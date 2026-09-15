# IHCS-website-claude

Website redesign for Iqbal Hossain Catering Service (IHCS) — Dhaka's dawat caterer since 1987.

## About

Single-page site built around real customer footage (kacchi, polao, rezala, borhani), a scroll-driven hero sequence, and a "Build your dawat" WhatsApp quote flow. Design details, palette, typography, and section map live in [design-package.md](design-package.md).

## Structure

- `index.html` — main site markup
- `media/img/`, `media/video/`, `media/team/` — assets actually referenced by index.html (named `media/`, not `assets/` — Cloudflare Workers static assets 404s everything under a top-level folder literally named `assets`, so it's avoided here)
- `design-package.md` — brand, palette, type, and section/band reference
- `frames/`, `processed/`, `source/`, `thumbs/` — hero footage assets in various pipeline stages (not directly referenced by the site)
- `build/` — build output

### Known missing assets

These files are referenced by `index.html` but don't exist anywhere in this repo yet — they need to be sourced or regenerated, or the site will show broken images/video for these spots:

- `media/img/hero-ending.jpg`
- `media/img/hero-poster.jpg`
- `media/video/hero-scrub.mp4`
- `media/video/kacchi-pour.mp4`
- `media/img/kacchi-pour-poster.jpg`

## Brand promise

"Quality you can taste. Quantity you can count on."
