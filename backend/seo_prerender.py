"""
Server-side SEO pre-rendering for public marketing routes.

Purpose
-------
Crawlers, social scrapers and non-JS bots must be able to see route-specific
`<title>`, `<meta name="description">`, canonical URL, JSON-LD schema, H1 and
a summary paragraph BEFORE JavaScript hydrates. React Helmet only runs after
JS executes, so it does not solve this on its own.

Usage
-----
Mounted at `GET /api/prerender?path=/some/route` (see server.py).

- Returns an HTML document with SEO tags injected into `<head>` and a
  crawler-visible content block prepended to the React root.
- React hydrates over the block as normal (the block is inside `#root`, so
  ReactDOM will replace it on hydration).
- Deployment: route bot user-agents (or all HTML requests) through this endpoint
  at the edge (nginx `map $http_user_agent`, Cloudflare Worker, etc.).

Static routes are declared in `STATIC_ROUTES`. Dynamic blog posts are resolved
at request time by reading `blog_posts` from MongoDB.
"""

from typing import Optional
import html as html_lib
import json
import os
import re

from motor.motor_asyncio import AsyncIOMotorDatabase

SITE_BASE_URL = os.environ.get("SITE_BASE_URL", "https://fidelislogic.com").rstrip("/")
SITE_NAME = "Fidelis Logic"
DEFAULT_OG_IMAGE = "/Logo_Color_Large.png"  # Site-wide fallback served from /public
DEFAULT_OG_IMAGE_WIDTH = 1200
DEFAULT_OG_IMAGE_HEIGHT = 630


def _absolute_url(path_or_url: str) -> str:
    """Return an absolute URL. Accepts absolute URLs, protocol-relative, or paths."""
    if not path_or_url:
        return f"{SITE_BASE_URL}{DEFAULT_OG_IMAGE}"
    if path_or_url.startswith(("http://", "https://")):
        return path_or_url
    if path_or_url.startswith("//"):
        return f"https:{path_or_url}"
    if not path_or_url.startswith("/"):
        path_or_url = "/" + path_or_url
    return f"{SITE_BASE_URL}{path_or_url}"

# ---------------------------------------------------------------------------
# Reusable JSON-LD builders
# ---------------------------------------------------------------------------

def _organization_schema() -> dict:
    return {
        "@type": "Organization",
        "@id": f"{SITE_BASE_URL}/#organization",
        "name": "Fidelis Logic LLC",
        "url": SITE_BASE_URL,
        "logo": f"{SITE_BASE_URL}/favicon-192x192.png",
        "sameAs": [],
        "address": {
            "@type": "PostalAddress",
            "addressCountry": "AE",
            "addressLocality": "Dubai",
        },
    }


def _website_schema() -> dict:
    return {
        "@type": "WebSite",
        "@id": f"{SITE_BASE_URL}/#website",
        "url": SITE_BASE_URL,
        "name": SITE_NAME,
        "publisher": {"@id": f"{SITE_BASE_URL}/#organization"},
    }


def _breadcrumb_schema(items: list[tuple[str, str]]) -> dict:
    """items = [(name, url_path), ...]"""
    return {
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": i + 1,
                "name": name,
                "item": f"{SITE_BASE_URL}{path}" if path else None,
            }
            for i, (name, path) in enumerate(items)
        ],
    }


# ---------------------------------------------------------------------------
# Static route registry
# ---------------------------------------------------------------------------
# Each entry produces the full SEO payload for that path.

STATIC_ROUTES: dict[str, dict] = {
    "/": {
        "title": "Fidelis Logic | UAE IT Consulting & Modern Workplace Solutions",
        "description": (
            "Fidelis Logic helps UAE organisations plan, deploy, and support modern "
            "workplace technology — meeting rooms, collaboration devices, workspace "
            "platforms, and business applications. Vendor-neutral consulting from Dubai."
        ),
        "canonical": "/",
        "h1": "Modern Workplace Technology Consulting for the UAE",
        "summary": (
            "Vendor-neutral IT advisory covering Microsoft Teams Rooms and Zoom "
            "Rooms, enterprise headsets, room booking and hot-desking platforms, "
            "and low-cost ERP/HRMS/CRM deployments. We bridge business intent and "
            "technology execution for lean teams and enterprise programmes alike."
        ),
        "og_type": "website",
        "og_image": "/HeroImage.png",
        "keywords": [
            "IT consulting UAE",
            "modern workplace technology",
            "meeting room solutions Dubai",
            "workspace experience platforms",
            "ERP consulting UAE",
        ],
        "structured_data": [
            _organization_schema(),
            _website_schema(),
        ],
    },
    "/solutions": {
        "title": "Modern Workplace Technology Solutions | Fidelis Logic",
        "description": (
            "Comprehensive UAE consulting for meeting rooms, collaboration devices, "
            "workspace experience platforms, and business applications. Vendor-neutral "
            "guidance from strategy through deployment and adoption."
        ),
        "canonical": "/solutions",
        "h1": "Solutions Across the Modern Workplace",
        "summary": (
            "Structured advisory across four pillars — meeting rooms and AV, "
            "enterprise headsets and UC devices, room-booking and workspace "
            "experience platforms, and low-cost ERP/HRMS/CRM business applications. "
            "Every engagement stays vendor-neutral and outcome-led."
        ),
        "og_type": "website",
        "og_image": "/EnterpriseHeadsets.png",
        "keywords": [
            "workplace technology solutions",
            "IT consulting services UAE",
            "meeting room solutions",
            "collaboration technology",
            "business applications",
        ],
        "structured_data": [
            {
                "@type": "CollectionPage",
                "name": "Modern Workplace Solutions",
                "url": f"{SITE_BASE_URL}/solutions",
                "isPartOf": {"@id": f"{SITE_BASE_URL}/#website"},
            },
            _breadcrumb_schema([("Home", "/"), ("Solutions", "/solutions")]),
        ],
    },
    "/solutions/business-apps": {
        "title": "Low-Cost ERP, HRMS & CRM with AI Integration UAE | Fidelis Logic",
        "description": (
            "Affordable ERP, HRMS and CRM for small UAE businesses. Near-zero license "
            "platforms, cloud or on-prem deployment, AI-assisted ERP updates, "
            "configuration, training and monthly plans from USD 10/month."
        ),
        "canonical": "/solutions/business-apps",
        "h1": "Low-Cost ERP, HRMS & CRM with AI Integration",
        "summary": (
            "Launch a practical business application platform with near-zero license "
            "cost, cloud or on-prem deployment, and AI-assisted ERP record keeping. "
            "Fidelis Logic delivers a live-in-a-week focused first phase followed by "
            "monthly optimisation, training and support tuned to lean teams."
        ),
        "og_type": "website",
        "og_image": "/business-apps-ai-hero.png",
        "keywords": [
            "low cost ERP UAE",
            "affordable HRMS Dubai",
            "CRM for small business UAE",
            "AI ERP integration",
            "cloud ERP UAE",
            "on premise ERP UAE",
        ],
        "structured_data": [
            {
                "@type": "Service",
                "name": "Low-Cost ERP, HRMS & CRM Consulting",
                "provider": {"@id": f"{SITE_BASE_URL}/#organization"},
                "areaServed": "AE",
                "serviceType": "Business Application Consulting",
                "url": f"{SITE_BASE_URL}/solutions/business-apps",
                "description": (
                    "Configuration, deployment, AI integration and monthly support "
                    "for open-source and low-cost ERP, HRMS and CRM platforms."
                ),
                "offers": {
                    "@type": "Offer",
                    "priceCurrency": "USD",
                    "priceSpecification": {
                        "@type": "PriceSpecification",
                        "price": "10",
                        "priceCurrency": "USD",
                        "unitText": "MONTH",
                    },
                },
            },
            _breadcrumb_schema([
                ("Home", "/"),
                ("Solutions", "/solutions"),
                ("Business Applications", "/solutions/business-apps"),
            ]),
        ],
    },
    "/brands/roomz": {
        "title": "ROOMZ in the UAE — Wire-Free Room Booking & Occupancy | Fidelis Logic",
        "description": (
            "Swiss-engineered, battery-powered room booking panels and occupancy "
            "sensors. As ROOMZ's UAE distribution partner, Fidelis Logic delivers "
            "the full lifecycle — supply, configuration, integration and support."
        ),
        "canonical": "/brands/roomz",
        "h1": "ROOMZ — Wire-Free Room Booking for Hybrid Workplaces",
        "summary": (
            "ROOMZ combines e-paper booking panels, occupancy sensors and cloud "
            "analytics. It integrates natively with Microsoft 365, Google Workspace "
            "and Exchange — giving facilities and IT teams real-time visibility "
            "into room utilisation while ending double-bookings and no-shows. "
            "As ROOMZ's UAE Distribution Partner, Fidelis Logic owns the full "
            "in-region lifecycle."
        ),
        "og_type": "website",
        "og_image": "/hero-images/BrandHeroImages/ROOMZ2.jpg",
        "keywords": [
            "ROOMZ UAE",
            "wire-free room booking",
            "meeting room panels",
            "occupancy sensors",
            "hot desking Dubai",
            "workspace analytics",
        ],
        "structured_data": [
            {
                "@type": "Brand",
                "name": "ROOMZ",
                "url": f"{SITE_BASE_URL}/brands/roomz",
                "logo": f"{SITE_BASE_URL}/brand-logos/roomz.png",
                "description": (
                    "Swiss workspace experience platform for wire-free room booking "
                    "and occupancy intelligence."
                ),
            },
            _breadcrumb_schema([
                ("Home", "/"),
                ("Brands", "/brands"),
                ("ROOMZ", "/brands/roomz"),
            ]),
        ],
    },
    "/blog": {
        "title": "Blog | Modern Workplace Technology Insights — Fidelis Logic",
        "description": (
            "Expert insights on workplace technology, meeting rooms, collaboration "
            "devices and business applications. Practical guidance for UAE organisations."
        ),
        "canonical": "/blog",
        "h1": "Fidelis Logic Blog — Workplace Technology Insights",
        "summary": (
            "Field notes and buyer guidance from Fidelis Logic — meeting room "
            "technology, collaboration devices, ERP and HRMS decisions, room "
            "booking platforms and the practicalities of running modern UAE "
            "workplace programmes."
        ),
        "og_type": "website",
        "og_image": "/HeroImage.png",
        "keywords": [
            "workplace technology blog",
            "IT consulting insights UAE",
            "meeting room best practices",
            "collaboration technology tips",
        ],
        "structured_data": [
            {
                "@type": "Blog",
                "name": "Fidelis Logic Blog",
                "url": f"{SITE_BASE_URL}/blog",
                "publisher": {"@id": f"{SITE_BASE_URL}/#organization"},
            },
            _breadcrumb_schema([("Home", "/"), ("Blog", "/blog")]),
        ],
    },
}

# Slug of blog-post routes matches `^/blog/[a-z0-9-]+/?$`
BLOG_POST_RE = re.compile(r"^/blog/([a-z0-9][a-z0-9-]*)/?$")


# ---------------------------------------------------------------------------
# Blog post resolver
# ---------------------------------------------------------------------------

def _strip_html(raw: str, max_len: int = 320) -> str:
    """Strip HTML tags and collapse whitespace for use in meta/summary."""
    text = re.sub(r"<[^>]+>", " ", raw or "")
    text = re.sub(r"\s+", " ", text).strip()
    if len(text) > max_len:
        text = text[: max_len - 1].rsplit(" ", 1)[0] + "…"
    return text


async def _blog_post_meta(db: AsyncIOMotorDatabase, slug: str) -> Optional[dict]:
    post = await db.blog_posts.find_one({"slug": slug, "published": True})
    if not post:
        return None

    title = post.get("seo_title") or post.get("title") or "Blog post"
    description = (
        post.get("seo_description")
        or post.get("excerpt")
        or _strip_html(post.get("content", ""))
    )
    canonical = f"/blog/{slug}"
    date_pub = post.get("published_at") or post.get("created_at")
    date_mod = post.get("updated_at") or date_pub
    og_image = (
        post.get("cover_image")
        or post.get("hero_image")
        or post.get("featured_image")
        or "/HeroImage.png"
    )
    og_image_abs = _absolute_url(og_image)

    def _iso(value):
        if not value:
            return None
        try:
            return value.isoformat()
        except AttributeError:
            return str(value)

    return {
        "title": f"{title} | Fidelis Logic Blog",
        "description": description[:300],
        "canonical": canonical,
        "h1": post.get("title") or title,
        "summary": _strip_html(post.get("content", ""), max_len=500) or description,
        "og_type": "article",
        "og_image": og_image,
        "og_image_alt": post.get("title") or title,
        "keywords": post.get("tags") or [],
        "structured_data": [
            {
                "@type": "BlogPosting",
                "headline": post.get("title"),
                "description": description[:300],
                "image": [og_image_abs],
                "url": f"{SITE_BASE_URL}{canonical}",
                "datePublished": _iso(date_pub),
                "dateModified": _iso(date_mod),
                "author": {
                    "@type": "Person",
                    "name": post.get("author") or "Fidelis Logic",
                },
                "publisher": {"@id": f"{SITE_BASE_URL}/#organization"},
                "mainEntityOfPage": {
                    "@type": "WebPage",
                    "@id": f"{SITE_BASE_URL}{canonical}",
                },
            },
            _breadcrumb_schema([
                ("Home", "/"),
                ("Blog", "/blog"),
                (post.get("title") or title, canonical),
            ]),
        ],
    }


# ---------------------------------------------------------------------------
# Resolver — path → SEO metadata (or None)
# ---------------------------------------------------------------------------

async def resolve_route_meta(path: str, db: AsyncIOMotorDatabase) -> Optional[dict]:
    """Return the SEO metadata for `path`, or None if not a pre-rendered route."""
    # Normalise (strip trailing slash except for "/")
    if len(path) > 1 and path.endswith("/"):
        path = path.rstrip("/")

    if path in STATIC_ROUTES:
        return STATIC_ROUTES[path]

    match = BLOG_POST_RE.match(path)
    if match:
        return await _blog_post_meta(db, match.group(1))

    return None


# ---------------------------------------------------------------------------
# HTML shell renderer
# ---------------------------------------------------------------------------

_HTML_TEMPLATE = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="theme-color" content="#2563eb" />
<meta name="author" content="Fidelis Logic LLC" />
<title>{title}</title>
<meta name="description" content="{description}" />
{keywords_tag}
<link rel="canonical" href="{canonical_url}" />
<meta property="og:title" content="{title}" />
<meta property="og:description" content="{description}" />
<meta property="og:url" content="{canonical_url}" />
<meta property="og:type" content="{og_type}" />
<meta property="og:site_name" content="{site_name}" />
<meta property="og:image" content="{og_image_url}" />
<meta property="og:image:secure_url" content="{og_image_url}" />
<meta property="og:image:width" content="{og_image_width}" />
<meta property="og:image:height" content="{og_image_height}" />
<meta property="og:image:alt" content="{og_image_alt}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="{title}" />
<meta name="twitter:description" content="{description}" />
<meta name="twitter:image" content="{og_image_url}" />
<meta name="twitter:image:alt" content="{og_image_alt}" />
<meta name="robots" content="index, follow" />
{structured_data_scripts}
</head>
<body>
<main id="__seo_prerender" data-prerendered="true">
<h1>{h1}</h1>
<p>{summary}</p>
</main>
<noscript>
<p>This site requires JavaScript for the full experience. The core content above
is served for crawlers and users without JavaScript enabled.
Contact: <a href="{site_url}/contact">{site_name} contact page</a>.</p>
</noscript>
</body>
</html>
"""


def _esc(value) -> str:
    if value is None:
        return ""
    return html_lib.escape(str(value), quote=True)


def render_seo_html(path: str, meta: dict) -> str:
    """Render a full HTML document with SEO tags baked in."""
    canonical_path = meta.get("canonical") or path
    canonical_url = f"{SITE_BASE_URL}{canonical_path}"

    keywords = meta.get("keywords") or []
    keywords_tag = (
        f'<meta name="keywords" content="{_esc(", ".join(keywords))}" />'
        if keywords else ""
    )

    og_image_url = _absolute_url(meta.get("og_image"))
    og_image_alt = meta.get("og_image_alt") or meta.get("title") or SITE_NAME

    scripts = []
    for schema in meta.get("structured_data", []) or []:
        payload = {"@context": "https://schema.org", **schema}
        # Drop keys with None values for cleanliness
        cleaned = json.loads(json.dumps(payload, default=str))
        scripts.append(
            '<script type="application/ld+json">'
            + json.dumps(cleaned, separators=(",", ":"), ensure_ascii=False)
            + "</script>"
        )
    structured_data_scripts = "\n".join(scripts)

    return _HTML_TEMPLATE.format(
        title=_esc(meta.get("title") or SITE_NAME),
        description=_esc(meta.get("description") or ""),
        keywords_tag=keywords_tag,
        canonical_url=_esc(canonical_url),
        og_type=_esc(meta.get("og_type") or "website"),
        og_image_url=_esc(og_image_url),
        og_image_width=DEFAULT_OG_IMAGE_WIDTH,
        og_image_height=DEFAULT_OG_IMAGE_HEIGHT,
        og_image_alt=_esc(og_image_alt),
        site_name=_esc(SITE_NAME),
        site_url=SITE_BASE_URL,
        h1=_esc(meta.get("h1") or ""),
        summary=_esc(meta.get("summary") or ""),
        structured_data_scripts=structured_data_scripts,
    )


def list_static_routes() -> list[str]:
    return sorted(STATIC_ROUTES.keys())
