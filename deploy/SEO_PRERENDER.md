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

### Option 3 — Static build-time pre-render (future enhancement)

Add a post-build Node script (`frontend/scripts/prerender-seo.mjs`) that:
1. Reads the built `build/index.html`.
2. Fetches `/api/prerender/routes` to enumerate every route.
3. For each route, fetches `/api/prerender?path=<route>` and writes the HTML
   to `build/<route>/index.html`. Nginx's SPA fallback serves them as normal.

This is best for infrastructures without edge-layer bot detection.

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
