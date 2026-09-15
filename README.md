# IHCS-website-claude

Website redesign for Iqbal Hossain Catering Service (IHCS) — Dhaka's dawat caterer since 1987.

## About

Single-page site built around real customer footage (kacchi, polao, rezala, borhani), a scroll-driven hero sequence, and a "Build your dawat" WhatsApp quote flow. Design details, palette, typography, and section map live in [design-package.md](design-package.md).

## Structure

- `index.html` — main site markup
- `assets/img/`, `assets/video/`, `assets/team/` — assets actually referenced by index.html
- `design-package.md` — brand, palette, type, and section/band reference
- `frames/`, `processed/`, `source/`, `thumbs/` — hero footage assets in various pipeline stages (not directly referenced by the site)
- `build/` — build output

### Known missing assets

These files are referenced by `index.html` but don't exist anywhere in this repo yet — they need to be sourced or regenerated, or the site will show broken images/video for these spots:

- `assets/img/hero-ending.jpg`
- `assets/img/hero-poster.jpg`
- `assets/video/hero-scrub.mp4`
- `assets/video/kacchi-pour.mp4`
- `assets/img/kacchi-pour-poster.jpg`

## Brand promise

"Quality you can taste. Quantity you can count on."
