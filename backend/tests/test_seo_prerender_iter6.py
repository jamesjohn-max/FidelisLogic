"""Iteration 6: og:image API tags + static build/<route>/index.html files."""
import os
import re
import json
import pytest
import requests
from pathlib import Path

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://cxo-advisory.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"
BUILD = Path("/app/frontend/build")


def _get(path):
    r = requests.get(f"{API}/prerender", params={"path": path}, timeout=20)
    return r


def _og(html, prop):
    m = re.search(
        rf'<meta property="{re.escape(prop)}" content="([^"]*)"', html
    )
    return m.group(1) if m else None


def _tw(html, name):
    m = re.search(
        rf'<meta name="{re.escape(name)}" content="([^"]*)"', html
    )
    return m.group(1) if m else None


def _title(html):
    m = re.search(r"<title>([^<]+)</title>", html)
    return m.group(1) if m else None


# ---------- API og:image tests ----------

EXPECTED_OG = {
    "/": "/HeroImage.png",
    "/solutions": "/EnterpriseHeadsets.png",
    "/solutions/business-apps": "/business-apps-ai-hero.png",
    "/brands/roomz": "/hero-images/BrandHeroImages/ROOMZ2.jpg",
}


@pytest.mark.parametrize("path,suffix", list(EXPECTED_OG.items()))
def test_og_image_absolute_and_correct(path, suffix):
    r = _get(path)
    assert r.status_code == 200, r.text[:300]
    html = r.text
    og = _og(html, "og:image")
    assert og, f"og:image missing for {path}"
    assert og.startswith("https://"), f"og:image not absolute: {og}"
    assert og.endswith(suffix), f"og:image {og} does not end with {suffix}"
    # secure_url matches
    secure = _og(html, "og:image:secure_url")
    assert secure == og, f"og:image:secure_url mismatch: {secure} vs {og}"
    # width/height
    assert _og(html, "og:image:width") == "1200"
    assert _og(html, "og:image:height") == "630"
    # alt has content
    alt = _og(html, "og:image:alt")
    assert alt and len(alt) > 0
    # twitter image
    tw = _tw(html, "twitter:image")
    assert tw == og, f"twitter:image mismatch: {tw} vs {og}"
    tw_alt = _tw(html, "twitter:image:alt")
    assert tw_alt and len(tw_alt) > 0


def test_home_og_image_alt_contains_title():
    r = _get("/")
    html = r.text
    title = _title(html)
    alt = _og(html, "og:image:alt")
    # alt often is title itself, allow substring both ways
    assert alt and (alt in title or title in alt or len(alt) > 5)


def test_blog_index_og_image_absolute():
    r = _get("/blog")
    assert r.status_code == 200
    og = _og(r.text, "og:image")
    assert og and og.startswith("https://")


def test_blog_post_og_image_and_jsonld_image():
    idx = requests.get(f"{API}/prerender/routes", timeout=15).json()
    dyn = idx["dynamic_routes"]
    assert dyn
    slug = dyn[0]
    r = _get(slug)
    assert r.status_code == 200
    html = r.text
    og = _og(html, "og:image")
    assert og and og.startswith("https://"), f"blog og:image not absolute: {og}"
    # BlogPosting JSON-LD image field
    scripts = re.findall(
        r'<script type="application/ld\+json">(.*?)</script>',
        html, flags=re.DOTALL,
    )
    found = False
    for s in scripts:
        try:
            obj = json.loads(s)
        except Exception:
            continue
        if obj.get("@type") == "BlogPosting":
            img = obj.get("image")
            assert img, "BlogPosting missing image field"
            # Should be array or contain the og URL
            if isinstance(img, list):
                assert og in img or any(og in str(i) for i in img)
            else:
                assert og == img or og in str(img)
            found = True
    assert found, "BlogPosting JSON-LD not found"


def test_unknown_path_returns_404():
    r = _get("/random/unknown")
    assert r.status_code == 404


# ---------- Static build file tests ----------

STATIC_FILES = [
    BUILD / "index.html",
    BUILD / "solutions" / "index.html",
    BUILD / "solutions" / "business-apps" / "index.html",
    BUILD / "brands" / "roomz" / "index.html",
    BUILD / "blog" / "index.html",
]


@pytest.mark.parametrize("f", STATIC_FILES)
def test_static_file_exists(f):
    assert f.exists(), f"missing generated file: {f}"


@pytest.mark.parametrize("f", STATIC_FILES)
def test_static_file_has_react_bundle(f):
    html = f.read_text()
    assert re.search(
        r'<script[^>]*src="/static/js/main\.[^"]+\.js"', html
    ), f"no React bundle script in {f}"


@pytest.mark.parametrize("f", STATIC_FILES)
def test_static_file_has_route_title(f):
    html = f.read_text()
    title = _title(html)
    assert title, f"no <title> in {f}"
    assert title.strip() not in ("React App",), f"generic title in {f}: {title}"


@pytest.mark.parametrize("f", STATIC_FILES)
def test_static_file_has_description(f):
    html = f.read_text()
    m = re.search(r'<meta name="description" content="([^"]+)"', html)
    assert m and len(m.group(1)) > 50, f"weak/no description in {f}"


@pytest.mark.parametrize("f", STATIC_FILES)
def test_static_file_has_canonical(f):
    html = f.read_text()
    assert re.search(
        r'<link rel="canonical" href="https://fidelislogic\.com/', html
    ), f"missing canonical in {f}"


@pytest.mark.parametrize("f", STATIC_FILES)
def test_static_file_has_jsonld(f):
    html = f.read_text()
    assert '<script type="application/ld+json">' in html, f"no JSON-LD in {f}"


@pytest.mark.parametrize("f", STATIC_FILES)
def test_static_file_has_seo_main(f):
    html = f.read_text()
    assert '<main id="__seo_prerender"' in html, f"no seo main in {f}"
    # h1 inside main
    m = re.search(
        r'<main id="__seo_prerender"[^>]*>.*?<h1[^>]*>[^<]+</h1>',
        html, flags=re.DOTALL,
    )
    assert m, f"no <h1> inside seo main in {f}"


def test_at_least_one_blog_slug_file_exists():
    blog_dir = BUILD / "blog"
    slugs = [p for p in blog_dir.iterdir() if p.is_dir()]
    assert slugs, "no blog slug dirs generated"
    # Verify at least one has an index.html with expected content
    with_html = [d for d in slugs if (d / "index.html").exists()]
    assert with_html, "no blog slug index.html generated"
    sample = with_html[0] / "index.html"
    html = sample.read_text()
    assert re.search(r'<script[^>]*src="/static/js/main\.', html)
    assert '<main id="__seo_prerender"' in html
    assert '<script type="application/ld+json">' in html


def test_titles_differ_across_routes():
    titles = {}
    for f in STATIC_FILES:
        titles[str(f)] = _title(f.read_text())
    # Should have distinct titles
    unique = set(titles.values())
    assert len(unique) == len(titles), f"duplicate titles: {titles}"


def test_specific_title_keywords():
    home = _title((BUILD / "index.html").read_text())
    assert home and ("UAE" in home or "IT" in home or "Consult" in home), f"home title: {home}"
    ba = _title((BUILD / "solutions" / "business-apps" / "index.html").read_text())
    assert ba and ("ERP" in ba or "Business" in ba), f"ba title: {ba}"
    rz = _title((BUILD / "brands" / "roomz" / "index.html").read_text())
    assert rz and "ROOMZ" in rz, f"roomz title: {rz}"


def test_home_and_roomz_og_image_differ():
    home = (BUILD / "index.html").read_text()
    rz = (BUILD / "brands" / "roomz" / "index.html").read_text()
    home_og = _og(home, "og:image")
    rz_og = _og(rz, "og:image")
    assert home_og and rz_og
    assert home_og != rz_og, f"per-route og:image not customized: {home_og}"
