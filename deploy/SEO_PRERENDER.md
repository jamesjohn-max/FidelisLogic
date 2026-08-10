# SEO Pre-render — how it works and how to enable it in production

## What it does
Public marketing routes are pre-rendered on the server so that crawlers and
social scrapers receive route-specific `<title>`, `<meta name="description">`,
canonical URL, OG tags, JSON-LD schema, `<h1>` and a summary paragraph
**before** JavaScript hydration.

Routes covered:

| Route pattern | Type |
|---|---|
| `/` | Static |
| `/solutions` | Static |
| `/solutions/business-apps` | Static |
| `/brands/roomz` | Static |
| `/blog` | Static |
| `/blog/<slug>` | Dynamic (any published blog post) |

Source of truth: `/app/backend/seo_prerender.py` — extend `STATIC_ROUTES` to
add more static pages.

## API

```
GET /api/prerender?path=/solutions/business-apps
    → 200 text/html   Full HTML shell with SEO tags baked in
    → 404             Path is not in the pre-render registry

GET /api/prerender/routes
    → 200 application/json   Lists all static + dynamic (published blog) routes
```

Quick check:
```bash
curl -s "$REACT_APP_BACKEND_URL/api/prerender?path=/brands/roomz" | head -30
```

## Wiring it up in production

The React app still owns the browser experience. Only bot traffic needs the
pre-rendered HTML. Route bot User-Agents at the edge to the `/api/prerender`
endpoint.

### Option 1 — Nginx (simplest)

```nginx
# In your server{} block, before the SPA fallback:
map $http_user_agent $is_bot {
    default 0;
    ~*(googlebot|bingbot|duckduckbot|slurp|baiduspider|yandexbot) 1;
    ~*(facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegrambot) 1;
    ~*(slackbot|discordbot|applebot|pinterestbot) 1;
}

location / {
    if ($is_bot) {
        rewrite ^ /api/prerender?path=$uri last;
    }
    try_files $uri $uri/ /index.html;
}
```

### Option 2 — Cloudflare Worker

```js
export default {
  async fetch(request, env) {
    const ua = (request.headers.get("user-agent") || "").toLowerCase();
    const isBot = /(googlebot|bingbot|facebookexternalhit|twitterbot|linkedinbot|slackbot|whatsapp)/.test(ua);
    const url = new URL(request.url);

    if (isBot && !url.pathname.startsWith("/api/")) {
      const prerenderUrl = new URL(url.origin + "/api/prerender");
      prerenderUrl.searchParams.set("path", url.pathname);
      return fetch(prerenderUrl.toString());
    }
    return fetch(request);
  }
}
```

### Option 3 — Static build-time pre-render (RECOMMENDED)

Removes the need for edge bot detection entirely. Every visitor — human or
crawler — gets a fully SEO-populated HTML file straight from Nginx.

Wired into the frontend build via `yarn build`:

```json
"scripts": {
  "build": "craco build && node scripts/prerender-seo.mjs",
  "build:no-prerender": "craco build",
  "prerender": "node scripts/prerender-seo.mjs"
}
```

What `scripts/prerender-seo.mjs` does:
1. Reads the compiled `build/index.html` (contains the React bundle links).
2. Reads `frontend/.env` to find `REACT_APP_BACKEND_URL`.
3. Calls `GET /api/prerender/routes` to enumerate every route (static + published blog posts).
4. For each route, calls `GET /api/prerender?path=<route>`, extracts the SEO fragments (title, meta description, canonical, OG/Twitter, JSON-LD, and the visible H1 + summary block).
5. Merges those fragments into a copy of the build shell and writes it to `build/<route>/index.html`.

Run it manually (after a build) if you only want to refresh the SEO pages:
```bash
cd frontend && yarn prerender
```

Environment overrides:
- `REACT_APP_BACKEND_URL` (preferred) — the URL of the running FastAPI backend
- `API_BASE_URL` / `SEO_PRERENDER_BASE_URL` — accepted aliases

Result — a browsable `build/` tree:
```
build/index.html                                        ← "/"  (with SEO baked in)
build/solutions/index.html
build/solutions/business-apps/index.html
build/brands/roomz/index.html
build/blog/index.html
build/blog/<slug>/index.html                            ← one per published post
```

Nginx's existing SPA fallback (`try_files $uri $uri/ /index.html`) resolves every
route to its per-route SEO'd file automatically.

Regenerating for new blog posts: run `yarn prerender` again after publishing —
no rebuild required (the compiled JS bundle is unchanged).

## Testing without deploying

Use curl with any User-Agent to see exactly what Google/Facebook will see:

```bash
API="$REACT_APP_BACKEND_URL"

# Every static route
for p in "/" "/solutions" "/solutions/business-apps" "/brands/roomz" "/blog"; do
  echo "=== $p ==="
  curl -s "$API/api/prerender?path=$p" \
    | grep -E "<title>|<meta name=\"description\"|canonical|<h1>" | head -5
done

# A dynamic blog post
curl -s "$API/api/prerender?path=/blog/teams-rooms-vs-zoom-rooms-2025" \
  | python3 -c "import sys, re; h=sys.stdin.read(); \
      print('title:', re.search(r'<title>(.*?)</title>', h).group(1)); \
      print('JSON-LD blocks:', h.count('application/ld+json'))"
```

## Adding more static routes

Edit `/app/backend/seo_prerender.py` → add an entry to `STATIC_ROUTES`:

```python
"/solutions/meeting-rooms": {
    "title": "...",
    "description": "...",
    "canonical": "/solutions/meeting-rooms",
    "h1": "...",
    "summary": "...",
    "og_type": "website",
    "keywords": ["..."],
    "structured_data": [ ... ],
},
```
Reload the backend (`sudo supervisorctl restart backend`) and you're done.
