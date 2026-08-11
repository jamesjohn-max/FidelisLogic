"""
SEO iteration 9 regression tests.

Task 1: www -> apex 301 redirect (via ASGI TestClient — preview ingress
        rejects spoofed Host on the preview subdomain).
Task 2: root /sitemap.xml alias serves same XML as /api/sitemap.xml.
Task 3: no duplicate meta description in frontend/public/index.html.
Task 4: pre-rendered SEO HTML for public routes.
P0    : prerender-seo.mjs best-effort (stale backend => exit 0) & STRICT.
Regression: /api/prerender/routes, /api/sitemap.xml counts, brand SEO.

NOTE: Motor's AsyncIOMotorClient is bound to whichever event loop first
touches it. starlette.TestClient spins up a fresh loop per instance and
tears it down on __exit__, so a second TestClient hits "Event loop is
closed" from Motor. We therefore use ONE module-scoped TestClient.
"""
import os
import re
import sys
import subprocess
from pathlib import Path

import pytest
import requests

sys.path.insert(0, "/app/backend")
from server import app  # noqa: E402
from starlette.testclient import TestClient  # noqa: E402

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")
FRONTEND_DIR = Path("/app/frontend")


# ---------------------------------------------------------------------------
# Shared fixtures
# ---------------------------------------------------------------------------
@pytest.fixture(scope="module")
def client():
    with TestClient(app, follow_redirects=False) as c:
        yield c


# ---------------------------------------------------------------------------
# Task 1 — www redirect via ASGI TestClient
# ---------------------------------------------------------------------------
class TestWwwRedirect:
    def test_www_host_redirects_301_to_apex(self, client):
        resp = client.get(
            "/api/prerender/routes",
            headers={"host": "www.fidelislogic.com"},
        )
        assert resp.status_code == 301
        loc = resp.headers["location"]
        # scheme derived from request; middleware honours x-forwarded-proto,
        # else defaults to whatever request.url.scheme is (http under TestClient)
        assert re.match(r"^https?://fidelislogic\.com/", loc), loc
        assert "/api/prerender/routes" in loc

    def test_www_preserves_query_string(self, client):
        resp = client.get(
            "/api/prerender?path=/solutions",
            headers={"host": "www.fidelislogic.com"},
        )
        assert resp.status_code == 301
        assert resp.headers["location"].endswith(
            "/api/prerender?path=/solutions"
        )
        assert "fidelislogic.com" in resp.headers["location"]
        assert "www." not in resp.headers["location"]

    def test_www_uses_x_forwarded_proto_https(self, client):
        resp = client.get(
            "/api/prerender/routes",
            headers={
                "host": "www.fidelislogic.com",
                "x-forwarded-proto": "https",
            },
        )
        assert resp.status_code == 301
        assert resp.headers["location"].startswith("https://fidelislogic.com/")

    def test_apex_host_not_redirected(self, client):
        resp = client.get(
            "/api/prerender/routes",
            headers={"host": "fidelislogic.com"},
        )
        assert resp.status_code == 200
        assert "static_routes" in resp.json()

    def test_default_host_not_redirected(self, client):
        resp = client.get("/api/prerender/routes")
        assert resp.status_code == 200


# ---------------------------------------------------------------------------
# Task 2 — /sitemap.xml root alias
# ---------------------------------------------------------------------------
class TestSitemapRootAlias:
    def test_root_sitemap_xml_serves_200(self, client):
        resp = client.get("/sitemap.xml")
        assert resp.status_code == 200
        assert "application/xml" in resp.headers.get("content-type", "")
        body = resp.text
        assert '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' in body
        assert body.count("<url>") >= 30

    def test_root_and_api_sitemap_match(self, client):
        root_resp = client.get("/sitemap.xml")
        api_resp = client.get("/api/sitemap.xml")
        assert root_resp.status_code == 200
        assert api_resp.status_code == 200
        assert root_resp.text.count("<url>") == api_resp.text.count("<url>")

    def test_api_sitemap_via_public_url(self):
        if not BASE_URL:
            pytest.skip("no REACT_APP_BACKEND_URL")
        resp = requests.get(f"{BASE_URL}/api/sitemap.xml", timeout=15)
        assert resp.status_code == 200
        assert resp.text.count("<url>") >= 30


# ---------------------------------------------------------------------------
# Task 3 — no duplicate meta description
# ---------------------------------------------------------------------------
class TestIndexHtmlMetaDescription:
    def test_exactly_one_meta_description(self):
        html = (FRONTEND_DIR / "public/index.html").read_text()
        matches = re.findall(r'<meta\s+name="description"', html, re.IGNORECASE)
        assert len(matches) == 1, f"expected 1, found {len(matches)}"

    def test_surviving_description_is_specific(self):
        html = (FRONTEND_DIR / "public/index.html").read_text()
        m = re.search(
            r'<meta\s+name="description"\s+content="([^"]+)"',
            html,
            re.IGNORECASE,
        )
        assert m
        content = m.group(1)
        assert "plan, deploy" in content or "meeting rooms" in content, content
        assert "Leading UAE IT consulting firm specializing" not in content


# ---------------------------------------------------------------------------
# Task 4 — pre-rendered SEO HTML for public routes
# ---------------------------------------------------------------------------
FOCUS_ROUTES = [
    "/",
    "/solutions",
    "/solutions/business-apps",
    "/brands/roomz",
    "/blog",
]


class TestPrerenderPublicRoutes:
    @pytest.mark.parametrize("route", FOCUS_ROUTES)
    def test_route_has_seo_essentials(self, client, route):
        r = client.get(f"/api/prerender?path={route}")
        assert r.status_code == 200, f"{route} -> {r.status_code}"
        html = r.text
        assert re.search(r"<title>[^<]+</title>", html), f"no title {route}"
        assert re.search(
            r'<meta\s+name="description"\s+content="[^"]+"', html, re.I
        ), f"no desc {route}"
        assert re.search(
            r'<link\s+rel="canonical"[^>]+href="[^"]+"', html, re.I
        ), f"no canonical {route}"
        assert re.search(
            r'<script\s+type="application/ld\+json"', html, re.I
        ), f"no jsonld {route}"
        og = re.search(
            r'<meta\s+property="og:image"\s+content="([^"]+)"', html, re.I
        )
        assert og and og.group(1).startswith("https://"), f"og:image {route}: {og}"
        assert re.search(r"<h1[^>]*>", html, re.I), f"no h1 {route}"

    def test_dynamic_blog_slug_has_seo(self, client):
        routes = client.get("/api/prerender/routes").json()
        dyn = [r for r in routes.get("dynamic_routes", []) if r.startswith("/blog/")]
        assert dyn, "no dynamic blog routes"
        r = client.get(f"/api/prerender?path={dyn[0]}")
        assert r.status_code == 200
        assert re.search(r"<title>[^<]+</title>", r.text)
        assert re.search(r'<meta\s+name="description"', r.text, re.I)


# ---------------------------------------------------------------------------
# Regression from iter 8
# ---------------------------------------------------------------------------
class TestIter8Regression:
    def test_prerender_routes_counts(self, client):
        j = client.get("/api/prerender/routes").json()
        assert len(j["static_routes"]) == 15
        assert len(j["dynamic_routes"]) >= 8

    def test_sitemap_min_urls(self, client):
        r = client.get("/api/sitemap.xml")
        assert r.status_code == 200
        assert r.text.count("<url>") >= 30

    @pytest.mark.parametrize("route", ["/brands/jabra", "/solutions/meeting-rooms"])
    def test_brand_and_solution_seo(self, client, route):
        r = client.get(f"/api/prerender?path={route}")
        assert r.status_code == 200
        m = re.search(r'<link\s+rel="canonical"[^>]+href="([^"]+)"', r.text, re.I)
        assert m and route in m.group(1)


# ---------------------------------------------------------------------------
# P0 — Prerender script best-effort vs strict
# ---------------------------------------------------------------------------
class TestPrerenderScriptBailBehaviour:
    BUILD_DIR = FRONTEND_DIR / "build"
    SCRIPT = FRONTEND_DIR / "scripts/prerender-seo.mjs"

    @classmethod
    def setup_class(cls):
        idx = cls.BUILD_DIR / "index.html"
        if not idx.exists():
            cls.BUILD_DIR.mkdir(parents=True, exist_ok=True)
            idx.write_text(
                "<!doctype html><html><head><title>x</title></head>"
                '<body><div id="root"></div></body></html>'
            )
            snap = cls.BUILD_DIR / "_shell.html"
            if snap.exists():
                snap.unlink()

    def _run(self, env_overrides):
        env = os.environ.copy()
        env.update(env_overrides)
        return subprocess.run(
            ["node", str(self.SCRIPT)],
            cwd=str(FRONTEND_DIR),
            env=env,
            capture_output=True,
            text=True,
            timeout=60,
        )

    def test_unreachable_backend_exits_zero_default(self):
        proc = self._run(
            {
                "REACT_APP_BACKEND_URL": "https://unreachable.example.invalid",
                "SEO_PRERENDER_STRICT": "",
            }
        )
        combined = proc.stdout + proc.stderr
        assert proc.returncode == 0, (
            f"expected 0, got {proc.returncode}\n{combined}"
        )
        assert "Could not enumerate routes" in combined, combined

    def test_unreachable_backend_strict_fails(self):
        proc = self._run(
            {
                "REACT_APP_BACKEND_URL": "https://unreachable.example.invalid",
                "SEO_PRERENDER_STRICT": "1",
            }
        )
        assert proc.returncode != 0, (
            f"expected non-zero in STRICT, got {proc.returncode}\n"
            f"{proc.stdout}\n{proc.stderr}"
        )
