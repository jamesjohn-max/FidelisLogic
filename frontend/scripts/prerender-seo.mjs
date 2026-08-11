#!/usr/bin/env node
/**
 * frontend/scripts/prerender-seo.mjs
 *
 * Post-build SEO prerender.
 *
 * Reads `build/index.html` (the compiled CRA shell with the React bundle),
 * hits the backend `/api/prerender` endpoint for every route it advertises,
 * merges the route-specific SEO tags into the shell, and writes a per-route
 * `build/<route>/index.html` file. Nginx's SPA fallback then serves those
 * static per-route HTML files to every visitor — including crawlers — with
 * the correct title, meta description, canonical, OG/Twitter tags,
 * JSON-LD schema, and a visible H1 + summary. React hydrates on top as
 * normal, so real users see no difference.
 *
 * Usage
 * -----
 *   REACT_APP_BACKEND_URL=https://your-api.example.com yarn build
 *   node scripts/prerender-seo.mjs
 *
 * The `yarn build` command (see package.json) chains this script so it runs
 * automatically after CRA/CRACO finishes compiling.
 *
 * Requirements: Node 18+ (uses global `fetch`), builds already generated.
 */

import fs from "node:fs/promises";
import fsSync from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FRONTEND_DIR = path.resolve(__dirname, "..");
const BUILD_DIR = path.join(FRONTEND_DIR, "build");
const INDEX_HTML_PATH = path.join(BUILD_DIR, "index.html");
// Pristine shell snapshot. First run copies the freshly-built build/index.html
// here. Subsequent runs always merge from this pristine copy so re-running
// `yarn prerender` is fully idempotent.
const SHELL_SNAPSHOT_PATH = path.join(BUILD_DIR, "_shell.html");
const DOTENV_PATH = path.join(FRONTEND_DIR, ".env");

// Load .env manually — yarn doesn't inject it for arbitrary node scripts.
if (fsSync.existsSync(DOTENV_PATH)) {
  const dotenv = fsSync.readFileSync(DOTENV_PATH, "utf8");
  for (const line of dotenv.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    if (!(key in process.env)) process.env[key] = value;
  }
}

const API_BASE =
  process.env.REACT_APP_BACKEND_URL ||
  process.env.API_BASE_URL ||
  process.env.SEO_PRERENDER_BASE_URL;

// Strict mode = fail the build on prerender errors. Off by default so
// production deploys never break just because the currently-running
// backend hasn't caught up with new SEO endpoints yet. First deploy after
// wiring this up will simply skip prerender; the next deploy (with the
// updated backend live) will produce the SEO files as expected.
const STRICT = /^(1|true|yes)$/i.test(process.env.SEO_PRERENDER_STRICT || "");

// Timings and safety
const FETCH_TIMEOUT_MS = 15_000;
const MAX_CONCURRENCY = 4;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const c = {
  reset: "\x1b[0m",
  dim: "\x1b[2m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
};

function log(msg) {
  process.stdout.write(msg + "\n");
}

function die(msg) {
  process.stderr.write(`${c.red}✗ ${msg}${c.reset}\n`);
  process.exit(1);
}

/**
 * Fail the build only when STRICT mode is enabled. Otherwise print a warning
 * and exit 0 so a stale backend never blocks a deploy.
 */
function bail(msg) {
  if (STRICT) die(msg);
  process.stderr.write(
    `${c.yellow}!${c.reset}  ${msg}\n` +
      `${c.dim}   Continuing without prerender output — the plain React SPA will be served.` +
      `\n   To make this failure fatal, set SEO_PRERENDER_STRICT=1.${c.reset}\n`,
  );
  process.exit(0);
}

async function fetchWithTimeout(url, opts = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, { ...opts, signal: controller.signal });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} for ${url}`);
    }
    return res;
  } finally {
    clearTimeout(timer);
  }
}

async function fetchJson(url) {
  const res = await fetchWithTimeout(url);
  return res.json();
}

async function fetchText(url) {
  const res = await fetchWithTimeout(url);
  return res.text();
}

// ---------------------------------------------------------------------------
// HTML parsing / injection
// ---------------------------------------------------------------------------

/**
 * Pull the SEO-relevant pieces out of the /api/prerender HTML response.
 * We only take what we need — leaving CRA's own asset <script> and <link>
 * tags alone so the compiled bundle keeps working.
 */
function extractSeoFragments(prerenderHtml) {
  const grab = (re) => {
    const m = prerenderHtml.match(re);
    return m ? m[0] : "";
  };
  const grabAll = (re) => [...prerenderHtml.matchAll(re)].map((m) => m[0]);
  const grabInner = (re) => {
    const m = prerenderHtml.match(re);
    return m ? m[1] : "";
  };

  return {
    title: grabInner(/<title>([\s\S]*?)<\/title>/i),
    metaTags: grabAll(
      /<meta\s+(?:name|property)="(?:description|keywords|robots|author|og:[^"]+|twitter:[^"]+)"[^>]*\/?>/gi,
    ),
    canonical: grab(/<link\s+rel="canonical"[^>]*\/?>/i),
    jsonLdScripts: grabAll(
      /<script\s+type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/gi,
    ),
    seoBody: grab(/<main\s+id="__seo_prerender"[\s\S]*?<\/main>/i),
  };
}

/**
 * Given the compiled build/index.html shell and extracted SEO fragments,
 * return a new HTML string with everything merged.
 */
function mergeIntoShell(shell, seo) {
  let html = shell;

  // ---- <title> ----
  if (seo.title) {
    if (/<title>[\s\S]*?<\/title>/i.test(html)) {
      html = html.replace(
        /<title>[\s\S]*?<\/title>/i,
        `<title>${seo.title}</title>`,
      );
    } else {
      html = html.replace(/<\/head>/i, `<title>${seo.title}</title></head>`);
    }
  }

  // ---- Remove stale head tags we're about to replace ----
  html = html
    .replace(/<meta\s+name="description"[^>]*\/?>/gi, "")
    .replace(/<meta\s+name="keywords"[^>]*\/?>/gi, "")
    .replace(/<meta\s+name="robots"[^>]*\/?>/gi, "")
    .replace(/<meta\s+property="og:[^"]+"[^>]*\/?>/gi, "")
    .replace(/<meta\s+name="twitter:[^"]+"[^>]*\/?>/gi, "")
    .replace(/<link\s+rel="canonical"[^>]*\/?>/gi, "");

  // ---- Build injection block for <head> ----
  const headInject = [
    ...seo.metaTags,
    seo.canonical,
    ...seo.jsonLdScripts,
  ]
    .filter(Boolean)
    .join("\n    ");

  html = html.replace(
    /<\/head>/i,
    `    ${headInject}\n  </head>`,
  );

  // ---- Inject visible SEO block inside <div id="root"> ----
  // React will replace #root on hydration, so real users never see the block.
  // Crawlers and non-JS clients see the H1 + summary.
  if (seo.seoBody && /<div id="root">/i.test(html)) {
    html = html.replace(
      /<div id="root">/i,
      `<div id="root">${seo.seoBody}`,
    );
  }

  return html;
}

/**
 * Convert a route like "/solutions/business-apps" to the on-disk output path
 * "build/solutions/business-apps/index.html". Root ("/") overwrites
 * "build/index.html" so a crawler hitting the site root gets SEO immediately.
 */
function routeToOutputPath(route) {
  if (route === "/") return path.join(BUILD_DIR, "index.html");
  const clean = route.replace(/^\//, "").replace(/\/$/, "");
  return path.join(BUILD_DIR, clean, "index.html");
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  log(`${c.cyan}▶${c.reset}  SEO prerender starting`);

  if (!API_BASE) {
    bail(
      "Missing backend URL. Set REACT_APP_BACKEND_URL (or API_BASE_URL) before running this script.",
    );
  }
  log(`   API base: ${c.dim}${API_BASE}${c.reset}`);

  // Ensure the compiled shell exists. To keep re-runs idempotent, snapshot
  // the pristine shell on the first run and always merge from that snapshot.
  let shell;
  try {
    // If a snapshot already exists (previous run), use it — it's guaranteed
    // to be un-injected.
    shell = await fs.readFile(SHELL_SNAPSHOT_PATH, "utf8");
    log(`   ${c.dim}Using existing pristine shell snapshot${c.reset}`);
  } catch {
    // No snapshot yet. Read the current build/index.html (assumed pristine
    // straight out of `yarn build:no-prerender`) and save it for reuse.
    try {
      shell = await fs.readFile(INDEX_HTML_PATH, "utf8");
    } catch {
      die(
        `build/index.html not found. Run \`yarn build\` first (this script is meant to run as a post-build step).`,
      );
    }
    if (/<main\s+id="__seo_prerender"/i.test(shell)) {
      die(
        `build/index.html already contains SEO injections but no _shell.html snapshot is present. ` +
          `Please run \`yarn build:no-prerender\` to regenerate a clean shell, then re-run this script.`,
      );
    }
    await fs.writeFile(SHELL_SNAPSHOT_PATH, shell, "utf8");
    log(`   ${c.dim}Snapshotted pristine shell to _shell.html${c.reset}`);
  }

  // Enumerate routes from the backend.
  const routesUrl = `${API_BASE.replace(/\/$/, "")}/api/prerender/routes`;
  let routesPayload;
  try {
    routesPayload = await fetchJson(routesUrl);
  } catch (err) {
    bail(`Could not enumerate routes at ${routesUrl} — ${err.message}`);
  }
  const staticRoutes = routesPayload.static_routes || [];
  const dynamicRoutes = routesPayload.dynamic_routes || [];
  const allRoutes = [...new Set([...staticRoutes, ...dynamicRoutes])];

  if (allRoutes.length === 0) {
    log(`${c.yellow}!${c.reset}  Backend returned zero prerender routes.`);
    return;
  }
  log(
    `   ${allRoutes.length} routes queued ` +
      `${c.dim}(${staticRoutes.length} static + ${dynamicRoutes.length} dynamic)${c.reset}`,
  );

  // Prerender each route with bounded concurrency.
  let ok = 0;
  let fail = 0;
  const failures = [];

  const queue = [...allRoutes];
  async function worker(id) {
    while (queue.length) {
      const route = queue.shift();
      const url = `${API_BASE.replace(/\/$/, "")}/api/prerender?path=${encodeURIComponent(route)}`;
      try {
        const prerenderHtml = await fetchText(url);
        const seo = extractSeoFragments(prerenderHtml);
        const finalHtml = mergeIntoShell(shell, seo);
        const outPath = routeToOutputPath(route);
        await fs.mkdir(path.dirname(outPath), { recursive: true });
        await fs.writeFile(outPath, finalHtml, "utf8");
        log(`   ${c.green}✓${c.reset} ${route}`);
        ok++;
      } catch (err) {
        failures.push({ route, error: err.message });
        log(`   ${c.red}✗${c.reset} ${route} ${c.dim}${err.message}${c.reset}`);
        fail++;
      }
    }
  }

  const workers = Array.from(
    { length: Math.min(MAX_CONCURRENCY, allRoutes.length) },
    (_, i) => worker(i),
  );
  await Promise.all(workers);

  // ---- Also snapshot sitemap.xml to build/ so the static host serves it ----
  // /sitemap.xml at the root, no FastAPI dependency at request time.
  try {
    const sitemapUrl = `${API_BASE.replace(/\/$/, "")}/api/sitemap.xml`;
    const res = await fetchWithTimeout(sitemapUrl);
    const xml = await res.text();
    await fs.writeFile(path.join(BUILD_DIR, "sitemap.xml"), xml, "utf8");
    log(`   ${c.green}✓${c.reset} sitemap.xml ${c.dim}(${xml.length} bytes)${c.reset}`);
  } catch (err) {
    log(
      `   ${c.yellow}!${c.reset} sitemap.xml snapshot skipped ` +
        `${c.dim}${err.message}${c.reset}`,
    );
  }

  log("");
  log(
    `${c.cyan}▶${c.reset}  SEO prerender complete — ${c.green}${ok} written${c.reset}` +
      (fail ? `, ${c.red}${fail} failed${c.reset}` : ""),
  );

  if (fail > 0) {
    log(`${c.yellow}Failures:${c.reset}`);
    for (const f of failures) {
      log(`   ${c.red}✗${c.reset} ${f.route} — ${f.error}`);
    }
    // Per-route failures are non-fatal unless STRICT — deploy should proceed
    // with whatever routes succeeded.
    if (STRICT) process.exit(1);
  }
}

main().catch((err) => {
  if (STRICT) die(err.stack || err.message);
  bail(err.message || String(err));
});
