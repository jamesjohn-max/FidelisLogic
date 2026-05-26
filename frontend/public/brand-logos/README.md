# Brand Logos

Drop the official, supplier-approved brand logo files in this folder to
replace the placeholder SVGs. The site will pick them up automatically — no
code changes required.

## Expected filenames

| Brand    | Drop-in filename |
|----------|------------------|
| ROOMZ    | `roomz.png`      |
| Morbit   | `morbit.png`     |
| Jabra    | `jabra.png`      |
| Poly     | `poly.png`       |
| Neat     | `neat.png`       |
| Yealink  | `yealink.png`    |
| Logitech | `logitech.png`   |

## How the fallback chain works

For each brand, `<BrandLogo>` tries in order:

1. `/brand-logos/<slug>.png` — the official logo (drop here)
2. `/brand-logos/<slug>.svg` — generic placeholder shipped with the site
3. Wordmark text in the brand accent colour (last-resort fallback)

So when you add `roomz.png` the placeholder is automatically retired for that
brand. No deploy needed beyond redeploying the static assets.

## Recommended specs

- Format: **PNG with transparent background** (or **SVG** if you have it).
- Aspect: roughly **3:1 to 4:1** (wider than tall) — the placeholder uses
  320×100 as a reference.
- Height: aim for assets that look crisp at 64px tall (the largest place a
  logo is rendered on the brand detail hero).
- Colour: full-colour brand logo is fine — the surrounding card is neutral.

## Want a different filename or path?

Edit `/app/frontend/src/data/brands.js`, find the brand, and adjust its
`logoImages` array. Files are tried in array order; the first one that loads
wins.
