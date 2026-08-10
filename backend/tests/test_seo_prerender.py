"""Tests for the SEO pre-render endpoints (/api/prerender, /api/prerender/routes)."""
import os
import re
import json
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://cxo-advisory.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"

REQUIRED_STATIC = ["/", "/solutions", "/solutions/business-apps", "/brands/roomz", "/blog"]


@pytest.fixture(scope="module")
def routes_index():
    r = requests.get(f"{API}/prerender/routes", timeout=15)
    assert r.status_code == 200, r.text
    return r.json()


def _extract_jsonld_types(html):
    scripts = re.findall(
        r'<script type="application/ld\+json">(.*?)</script>',
        html, flags=re.DOTALL,
    )
    types = []
    parsed = []
    for s in scripts:
        try:
            obj = json.loads(s)
            parsed.append(obj)
            t = obj.get("@type")
            if isinstance(t, list):
                types.extend(t)
            elif t:
                types.append(t)
        except Exception:
            pass
    return types, parsed


def _get_html(path):
    r = requests.get(f"{API}/prerender", params={"path": path}, timeout=15)
    return r


class TestRoutesIndex:
    def test_routes_index_status(self, routes_index):
        assert "static_routes" in routes_index
        assert "dynamic_routes" in routes_index

    def test_static_routes_include_required(self, routes_index):
        for p in REQUIRED_STATIC:
            assert p in routes_index["static_routes"], f"missing {p}"

    def test_dynamic_routes_non_empty(self, routes_index):
        assert isinstance(routes_index["dynamic_routes"], list)
        assert len(routes_index["dynamic_routes"]) >= 1, "expected at least one published blog post slug"
        for r in routes_index["dynamic_routes"]:
            assert r.startswith("/blog/")


class TestHome:
    def test_home_render(self):
        r = _get_html("/")
        assert r.status_code == 200
        assert "text/html" in r.headers.get("Content-Type", "")
        html = r.text
        assert re.search(r"<title>[^<]+</title>", html)
        title = re.search(r"<title>([^<]+)</title>", html).group(1)
        assert title.strip() != "Fidelis Logic API"
        m = re.search(r'<meta name="description" content="([^"]+)"', html)
        assert m and len(m.group(1)) > 50
        assert 'rel="canonical" href="https://fidelislogic.com/"' in html
        assert re.search(r"<h1>[^<]+</h1>", html)
        assert '<main id="__seo_prerender"' in html
        assert re.search(r"<main[^>]*>.*?<p>[^<]+</p>", html, flags=re.DOTALL)
        types, _ = _extract_jsonld_types(html)
        assert len(types) >= 1
        assert "https://schema.org" in html
        assert any(t in types for t in ("Organization", "WebSite"))


class TestSolutions:
    def test_solutions(self):
        r = _get_html("/solutions")
        assert r.status_code == 200
        html = r.text
        title = re.search(r"<title>([^<]+)</title>", html).group(1)
        assert ("Solutions" in title) or ("Modern Workplace" in title)
        types, _ = _extract_jsonld_types(html)
        assert "BreadcrumbList" in types


class TestBusinessApps:
    def test_business_apps(self):
        r = _get_html("/solutions/business-apps")
        assert r.status_code == 200
        html = r.text
        title = re.search(r"<title>([^<]+)</title>", html).group(1)
        assert ("ERP" in title) or ("Business" in title)
        types, parsed = _extract_jsonld_types(html)
        assert "Service" in types
        assert "BreadcrumbList" in types
        svc = next(p for p in parsed if p.get("@type") == "Service")
        assert "serviceType" in svc


class TestRoomz:
    def test_roomz(self):
        r = _get_html("/brands/roomz")
        assert r.status_code == 200
        html = r.text
        title = re.search(r"<title>([^<]+)</title>", html).group(1)
        assert "ROOMZ" in title
        types, _ = _extract_jsonld_types(html)
        assert "Brand" in types
        assert "BreadcrumbList" in types


class TestBlog:
    def test_blog_index(self):
        r = _get_html("/blog")
        assert r.status_code == 200
        html = r.text
        title = re.search(r"<title>([^<]+)</title>", html).group(1)
        assert "Blog" in title
        types, _ = _extract_jsonld_types(html)
        assert "Blog" in types

    def test_blog_post(self, routes_index):
        dyn = routes_index["dynamic_routes"]
        assert dyn, "no dynamic blog routes to test"
        slug_path = dyn[0]
        r = _get_html(slug_path)
        assert r.status_code == 200, r.text[:400]
        html = r.text
        title = re.search(r"<title>([^<]+)</title>", html).group(1)
        assert "Fidelis Logic Blog" in title
        m = re.search(r'<meta name="description" content="([^"]+)"', html)
        assert m and len(m.group(1)) > 10
        assert f'rel="canonical" href="https://fidelislogic.com{slug_path}"' in html
        assert 'property="og:type" content="article"' in html
        types, parsed = _extract_jsonld_types(html)
        assert "BlogPosting" in types
        assert "BreadcrumbList" in types
        bp = next(p for p in parsed if p.get("@type") == "BlogPosting")
        assert bp.get("headline")
        assert bp.get("author")
        assert bp.get("datePublished")


class TestNotFound:
    def test_unknown_route(self):
        r = _get_html("/nonexistent/route")
        assert r.status_code == 404

    def test_unknown_blog_slug(self):
        r = _get_html("/blog/does-not-exist-slug")
        assert r.status_code == 404
