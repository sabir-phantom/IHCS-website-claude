# IHCS-website-claude

Website for Iqbal Hossain Catering Service (IHCS) — Dhaka's dawat caterer since 1987.
Live at https://ihcs.sabir.dpdns.org

## What this is

A 14-page static site in a Mughal court style: deep emerald, gold cusped arches, jali
lattice, ivory marble panels with pietra dura flower inlay. The home page carries a
scroll-driven hero video; every other page is a normal page with the same chrome.

Pages: home, about, founder, services, menus, venues, gallery, contact, plus six service
pages (wedding, corporate, private party, buffet, outdoor, iftar). Page addresses match
the old WordPress site so existing links and search results still work.

## Structure

- `index.html` and one folder per page, each holding its own `index.html`
- `media/` — css, js, img, team, video. Named `media/`, not `assets/`, because Cloudflare
  Workers static assets 404s everything under a top-level folder literally named `assets`
- `media/css/site.css`, `media/js/site.js`, `media/js/hero.js` — shared by every page
- `build/build-pages.mjs` — generates every page from shared parts. Not served (see
  `.assetsignore`)
- `design-package.md` — palette, type, motifs and section map

## Editing

Page content lives in `build/build-pages.mjs`, not in the generated HTML. Edit the
builder, then run it and commit the result:

    node build/build-pages.mjs

It writes to the site folder set in the `OUT` constant at the top of that file.

## Deploy

Pushing to `main` triggers a Cloudflare Workers build automatically.

## Earlier version

The single-page navy version that ran here before this redesign is kept at tag
`onepage-v1` and branch `onepage-navy`.

## Brand promise

"Quality you can taste. Quantity you can count on."
