"""Iteration 8: STATIC_ROUTES expansion + sitemap sync validation.

Validates:
- /api/prerender/routes returns exactly 15 static routes (new brand + solution + brands hub pages).
- Each new route renders correctly via /api/prerender?path=... (title keywords, description length,
  canonical, absolute og:image, JSON-LD, main#__seo_prerender + h1).
- JSON-LD per-route: CollectionPage(hasPart)+BreadcrumbList for /brands, Brand+BreadcrumbList for
  each brand, Service+BreadcrumbList for each new solution.
- og:image per-brand differs and references /brand-logos/<slug>.png.
- /api/sitemap.xml is valid XML, sync'd with STATIC_ROUTES, dynamic blog routes, and EXTRA pages.
- No duplicate <loc> entries in sitemap.
- Regression: /brands/roomz and /solutions/business-apps still return 200.
"""

import os
import re
import xml.etree.ElementTree as ET
from urllib.parse import urlparse

import pytest
import requests


def _load_backend_url():
    env_val = os.environ.get("REACT_APP_BACKEND_URL")
    if env_val:
        return env_val.rstrip("/")
    try:
        with open("/app/frontend/.env") as fh:
            for line in fh:
                if line.startswith("REACT_APP_BACKEND_URL="):
                    return line.split("=", 1)[1].strip().rstrip("/")
    except OSError:
        pass
    raise RuntimeError("REACT_APP_BACKEND_URL not found")


BASE_URL = _load_backend_url()
SITE_BASE_URL = "https://fidelislogic.com"
SM_NS = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}

EXPECTED_STATIC_ROUTES = {
    "/",
    "/blog",
    "/brands",
    "/brands/jabra",
    "/brands/logitech",
    "/brands/morbit",
    "/brands/neat",
    "/brands/poly",
    "/brands/roomz",
    "/brands/yealink",
    "/solutions",
    "/solutions/business-apps",
    "/solutions/headsets",
    "/solutions/meeting-rooms",
    "/solutions/workspace-experience",
}

NEW_ROUTES_TITLE_KEYWORDS = {
    "/solutions/meeting-rooms": ["Microsoft Teams Rooms", "Zoom Rooms"],
    "/solutions/headsets": ["Enterprise Headsets", "Collaboration Devices"],
    "/solutions/workspace-experience": ["Room Booking", "Workspace Experience", "Hot Desking"],
    "/brands": ["Curated Brand", "Ecosystem"],
    "/brands/morbit": ["Morbit"],
    "/brands/jabra": ["Jabra"],
    "/brands/poly": ["Poly"],
    "/brands/neat": ["Neat"],
    "/brands/yealink": ["Yealink"],
    "/brands/logitech": ["Logitech"],
}

BRAND_SLUGS = ["morbit", "jabra", "poly", "neat", "yealink", "logitech"]
NEW_SOLUTION_ROUTES = [
    "/solutions/meeting-rooms",
    "/solutions/headsets",
    "/solutions/workspace-experience",
]

SITEMAP_EXPECTED_URLS = [
    f"{SITE_BASE_URL}/brands",
    f"{SITE_BASE_URL}/brands/jabra",
    f"{SITE_BASE_URL}/brands/morbit",
    f"{SITE_BASE_URL}/brands/poly",
    f"{SITE_BASE_URL}/brands/neat",
    f"{SITE_BASE_URL}/brands/yealink",
    f"{SITE_BASE_URL}/brands/logitech",
    f"{SITE_BASE_URL}/brands/roomz",
    f"{SITE_BASE_URL}/solutions/meeting-rooms",
    f"{SITE_BASE_URL}/solutions/headsets",
    f"{SITE_BASE_URL}/solutions/workspace-experience",
    f"{SITE_BASE_URL}/solutions/business-apps",
]

SITEMAP_EXTRA_EXPECTED = [
    f"{SITE_BASE_URL}/services",
    f"{SITE_BASE_URL}/services/consulting",
    f"{SITE_BASE_URL}/services/deployment-configuration",
    f"{SITE_BASE_URL}/services/managed-support",
    f"{SITE_BASE_URL}/services/video-conferencing-rentals",
    f"{SITE_BASE_URL}/services/workspace-audits",
    f"{SITE_BASE_URL}/services/technology-refresh",
    f"{SITE_BASE_URL}/services/relocation-office-moves",
    f"{SITE_BASE_URL}/services/training-adoption",
    f"{SITE_BASE_URL}/about",
    f"{SITE_BASE_URL}/contact",
    f"{SITE_BASE_URL}/deals",
]


# --------------- Fixtures ---------------

@pytest.fixture(scope="module")
def routes_payload():
    r = requests.get(f"{BASE_URL}/api/prerender/routes", timeout=30)
    assert r.status_code == 200, r.text
    return r.json()


@pytest.fixture(scope="module")
def sitemap_root():
    r = requests.get(f"{BASE_URL}/api/sitemap.xml", timeout=30)
    assert r.status_code == 200
    ctype = r.headers.get("Content-Type", "")
    assert "xml" in ctype.lower(), f"unexpected content-type: {ctype}"
    root = ET.fromstring(r.text)
    return root, r.text


def _fetch_prerender(path):
    r = requests.get(f"{BASE_URL}/api/prerender", params={"path": path}, timeout=30)
    return r


# --------------- /api/prerender/routes ---------------

class TestPrerenderRoutes:
    def test_returns_15_static_routes(self, routes_payload):
        static = set(routes_payload.get("static_routes") or [])
        assert static == EXPECTED_STATIC_ROUTES, (
            f"Missing: {EXPECTED_STATIC_ROUTES - static}; Extra: {static - EXPECTED_STATIC_ROUTES}"
        )
        assert len(static) == 15


# --------------- Per-route prerender checks ---------------

def _extract_title(html):
    m = re.search(r"<title>([^<]+)</title>", html, re.IGNORECASE)
    return m.group(1) if m else ""


def _extract_meta(html, name_or_prop, is_property=False):
    attr = "property" if is_property else "name"
    m = re.search(
        rf'<meta\s+{attr}="{re.escape(name_or_prop)}"\s+content="([^"]*)"',
        html, re.IGNORECASE,
    )
    return m.group(1) if m else ""


def _extract_canonical(html):
    m = re.search(r'<link\s+rel="canonical"\s+href="([^"]+)"', html, re.IGNORECASE)
    return m.group(1) if m else ""


def _extract_jsonld_blocks(html):
    return re.findall(
        r'<script[^>]+type="application/ld\+json"[^>]*>(.+?)</script>',
        html, re.DOTALL | re.IGNORECASE,
    )


class TestNewRoutesRendering:
    @pytest.mark.parametrize("route", list(NEW_ROUTES_TITLE_KEYWORDS.keys()))
    def test_route_returns_200(self, route):
        r = _fetch_prerender(route)
        assert r.status_code == 200, f"{route} -> {r.status_code}"

    @pytest.mark.parametrize("route,keywords", list(NEW_ROUTES_TITLE_KEYWORDS.items()))
    def test_route_title_contains_keyword(self, route, keywords):
        html = _fetch_prerender(route).text
        title = _extract_title(html)
        assert any(k in title for k in keywords), f"{route} title '{title}' missing {keywords}"

    @pytest.mark.parametrize("route", list(NEW_ROUTES_TITLE_KEYWORDS.keys()))
    def test_route_description_long_enough(self, route):
        html = _fetch_prerender(route).text
        desc = _extract_meta(html, "description")
        assert len(desc) > 60, f"{route} description too short: {len(desc)} chars"

    @pytest.mark.parametrize("route", list(NEW_ROUTES_TITLE_KEYWORDS.keys()))
    def test_route_canonical_matches(self, route):
        html = _fetch_prerender(route).text
        canonical = _extract_canonical(html)
        assert canonical == f"{SITE_BASE_URL}{route}", f"{route} canonical={canonical}"

    @pytest.mark.parametrize("route", list(NEW_ROUTES_TITLE_KEYWORDS.keys()))
    def test_route_og_image_absolute_https(self, route):
        html = _fetch_prerender(route).text
        og_img = _extract_meta(html, "og:image", is_property=True)
        assert og_img.startswith("https://"), f"{route} og:image not absolute: {og_img}"

    @pytest.mark.parametrize("route", list(NEW_ROUTES_TITLE_KEYWORDS.keys()))
    def test_route_has_jsonld(self, route):
        html = _fetch_prerender(route).text
        blocks = _extract_jsonld_blocks(html)
        assert len(blocks) >= 1, f"{route} has no JSON-LD"

    @pytest.mark.parametrize("route", list(NEW_ROUTES_TITLE_KEYWORDS.keys()))
    def test_route_has_main_prerender_h1(self, route):
        html = _fetch_prerender(route).text
        assert '<main id="__seo_prerender"' in html, f"{route} missing main#__seo_prerender"
        # h1 inside main
        assert re.search(r"<main[^>]*__seo_prerender[^>]*>\s*<h1>[^<]+</h1>", html), (
            f"{route} missing h1 inside main"
        )


# --------------- JSON-LD schema types ---------------

def _parse_jsonld(html):
    import json
    out = []
    for block in _extract_jsonld_blocks(html):
        out.append(json.loads(block))
    return out


class TestJsonLdSchemas:
    def test_brands_hub_collectionpage_with_haspart(self):
        html = _fetch_prerender("/brands").text
        blocks = _parse_jsonld(html)
        cp = next((b for b in blocks if b.get("@type") == "CollectionPage"), None)
        assert cp is not None, "no CollectionPage on /brands"
        has_part = cp.get("hasPart") or []
        assert isinstance(has_part, list) and len(has_part) == 7, (
            f"hasPart len={len(has_part)}: {has_part}"
        )
        brand_names = {p.get("name") for p in has_part}
        assert brand_names == {"ROOMZ", "Morbit", "Jabra", "Poly", "Neat", "Yealink", "Logitech"}

    @pytest.mark.parametrize("slug", BRAND_SLUGS)
    def test_brand_page_brand_and_breadcrumb(self, slug):
        html = _fetch_prerender(f"/brands/{slug}").text
        blocks = _parse_jsonld(html)
        brand = next((b for b in blocks if b.get("@type") == "Brand"), None)
        assert brand is not None, f"/brands/{slug} missing Brand"
        assert brand.get("name")
        assert brand.get("logo", "").startswith("https://")
        assert brand.get("url", "").startswith("https://")
        bc = next((b for b in blocks if b.get("@type") == "BreadcrumbList"), None)
        assert bc is not None, f"/brands/{slug} missing BreadcrumbList"
        items = bc.get("itemListElement") or []
        assert len(items) == 3, f"expected Home->Brands-><name>, got {len(items)}"

    @pytest.mark.parametrize("route", NEW_SOLUTION_ROUTES)
    def test_solution_page_service_and_breadcrumb(self, route):
        html = _fetch_prerender(route).text
        blocks = _parse_jsonld(html)
        svc = next((b for b in blocks if b.get("@type") == "Service"), None)
        assert svc is not None, f"{route} missing Service schema"
        assert svc.get("serviceType"), f"{route} Service.serviceType missing"
        bc = next((b for b in blocks if b.get("@type") == "BreadcrumbList"), None)
        assert bc is not None, f"{route} missing BreadcrumbList"


# --------------- Per-brand og:image differentiation ---------------

class TestBrandOgImages:
    def test_jabra_og_image_points_to_logo(self):
        html = _fetch_prerender("/brands/jabra").text
        og = _extract_meta(html, "og:image", is_property=True)
        assert og.endswith("/brand-logos/jabra.png"), og

    def test_logitech_og_image_points_to_logo(self):
        html = _fetch_prerender("/brands/logitech").text
        og = _extract_meta(html, "og:image", is_property=True)
        assert og.endswith("/brand-logos/logitech.png"), og

    def test_brand_og_images_unique(self):
        images = {}
        for slug in BRAND_SLUGS + ["roomz"]:
            html = _fetch_prerender(f"/brands/{slug}").text
            images[slug] = _extract_meta(html, "og:image", is_property=True)
        assert len(set(images.values())) == len(images), f"duplicate og:images: {images}"


# --------------- Sitemap ---------------

def _locs(root):
    return [el.text for el in root.findall(".//sm:url/sm:loc", SM_NS)]


class TestSitemap:
    def test_valid_xml_with_urlset(self, sitemap_root):
        root, raw = sitemap_root
        assert root.tag.endswith("urlset")
        assert "http://www.sitemaps.org/schemas/sitemap/0.9" in root.tag or (
            "http://www.sitemaps.org/schemas/sitemap/0.9" in raw
        )

    def test_all_new_static_urls_present(self, sitemap_root):
        root, _ = sitemap_root
        locs = set(_locs(root))
        missing = [u for u in SITEMAP_EXPECTED_URLS if u not in locs]
        assert not missing, f"Missing from sitemap: {missing}"

    def test_extra_pages_present(self, sitemap_root):
        root, _ = sitemap_root
        locs = set(_locs(root))
        missing = [u for u in SITEMAP_EXTRA_EXPECTED if u not in locs]
        assert not missing, f"Missing extra pages: {missing}"

    def test_no_duplicate_locs(self, sitemap_root):
        root, _ = sitemap_root
        locs = _locs(root)
        dupes = [u for u in set(locs) if locs.count(u) > 1]
        assert not dupes, f"Duplicate <loc>s: {dupes}"
        assert len(set(locs)) == len(locs)

    def test_total_url_count_reasonable(self, sitemap_root):
        root, _ = sitemap_root
        count = len(root.findall(".//sm:url", SM_NS))
        # ~35 expected; allow variance for blog posts / active deals
        assert count >= 27, f"too few URLs: {count}"
        assert count <= 80, f"too many URLs: {count}"

    def test_blog_posts_included(self, sitemap_root, routes_payload):
        root, _ = sitemap_root
        locs = set(_locs(root))
        dynamic = routes_payload.get("dynamic_routes") or []
        # dynamic_routes may be like "/blog/<slug>"
        missing = []
        for d in dynamic:
            url = f"{SITE_BASE_URL}{d}" if d.startswith("/") else d
            if url not in locs:
                missing.append(url)
        assert not missing, f"Blog posts missing from sitemap: {missing}"


# --------------- Regression ---------------

class TestRegression:
    def test_brands_roomz_still_200(self):
        r = _fetch_prerender("/brands/roomz")
        assert r.status_code == 200
        html = r.text
        og = _extract_meta(html, "og:image", is_property=True)
        assert og.endswith("/hero-images/BrandHeroImages/ROOMZ2.jpg"), og
        blocks = _parse_jsonld(html)
        assert any(b.get("@type") == "Brand" and b.get("name") == "ROOMZ" for b in blocks)

    def test_solutions_business_apps_still_200(self):
        r = _fetch_prerender("/solutions/business-apps")
        assert r.status_code == 200
        html = r.text
        blocks = _parse_jsonld(html)
        assert any(b.get("@type") == "Service" for b in blocks)
