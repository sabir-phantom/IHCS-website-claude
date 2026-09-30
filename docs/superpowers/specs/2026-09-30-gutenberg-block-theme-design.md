# Rebuilding the Mughal catering design as a re-skinnable WordPress block theme

Date: 2026-09-30
Status: draft, awaiting review

## Why

The design currently exists twice: as a 14-page static site, and as a WordPress
build driven by Elementor Free plus a compatibility layer. The Elementor build
works and is 96% editable, but it is not a product. It depends on a third-party
plugin whose releases can break it, it needs a hand-written compatibility
stylesheet to survive Elementor's wrapper markup, and its header and footer are
PHP that only a developer can change.

The goal has changed: this design is to be installed for paying clients, first
locally and later internationally. That means one build must become many sites,
each with a different name, logo, palette, typography and content, set up by the
operator in minutes rather than re-coded.

## What we are building

A WordPress **block theme** (full site editing) that reproduces the existing
design exactly, where:

- every colour, font and brand asset is a setting, not a hardcoded value
- all page content is editable through the block editor by a non-technical client
- the header and footer are editable template parts, not PHP
- a single admin screen re-skins the whole site for a new client
- demo content installs in one click on a fresh site

### Success criteria

1. A fresh WordPress install plus this theme plus the demo import reproduces the
   current site pixel-for-pixel, verified by computed-style comparison, not by eye.
2. Changing the palette in one admin screen recolours the entire site, including
   the SVG motifs (arches, jali, inlay, stars, arcades).
3. No third-party plugin is required for any page to render.
4. A client can change every piece of visible text and every image from the
   block editor without touching code.
5. All 14 pages return 200, with zero broken assets and zero broken internal links.

### Explicitly out of scope

- Marketplace packaging (Theme Check compliance, `.pot` translations, `readme.txt`).
  Deferred until there is a reason to submit anywhere.
- A contact form backend. The theme will style a form; sending mail is plugin
  territory and stays that way.
- Replacing the client's real content with generic demo content. That is a
  separate pass once the build works.
- The static site in this repo. It stays as the reference implementation.

## Architecture

### The token pipeline — the core of re-skinnability

Today `site.css` defines its palette in a `:root` block and consumes it through
218 `var()` references. That is most of the way there, but three categories of
colour escape the tokens:

| Category | Count | Example | Problem |
|---|---|---|---|
| Literal `rgba()` | ~55 | `rgba(3,8,22,.78)` | Derived from navy, but written as numbers |
| Colour inside SVG data URIs | 10 | `stroke='%23D2AE6D'` | Motif colour is encoded in the URI |
| Stray hex | 9 | `#2a2420`, `#F3A48B` | Placeholders, error states, media backgrounds |

The fix is a **generated token layer**. A small set of brand inputs produces the
complete set of CSS custom properties at runtime:

```
Brand settings (stored as theme mods)
        |
        v
  PHP token generator
        |
        +-- hex tokens          --navy, --gold, --accent, --ivory, --ink, ...
        +-- RGB triplets        --navy-rgb: 23 39 77
        +-- derived alphas      --scrim: rgb(var(--navy-deep-rgb) / .78)
        +-- SVG motifs          --jali, --inlay, --star, --arch-line, --arcade-*
        |                       (data URIs rendered with the current palette)
        v
  inline <style> in <head>, before site.css
```

Three consequences:

- **Literal `rgba()` becomes `rgb(var(--x-rgb) / a)`.** The alpha stays in the
  rule where it belongs; the colour comes from the token. This is a mechanical
  refactor of ~55 declarations in `site.css`.
- **SVG motifs are generated, not static.** Each motif becomes a PHP function
  that takes colours and returns a data URI. The multi-colour inlay (gold stroke,
  jade leaves, ruby petals, gold centre) needs this; the single-colour motifs
  could use CSS masks instead, but generating all of them keeps one mechanism
  rather than two.
- **Stray hex become named tokens.** `--media-placeholder`, `--field-error`,
  `--field-placeholder`. Small, but they are visible when a client picks a light
  palette against a dark-assumed design.

`theme.json` carries the same palette as the editor-facing colour and font
settings, generated from the same source so the editor and front end cannot drift.

`site.css` remains the design system. We are not trying to express this design in
`theme.json` — that would fail. `theme.json` supplies tokens and editor settings;
`site.css` supplies the design.

### Brand settings

A single **Brand Setup** admin screen, holding everything that differs between
clients:

**Colour** — ground, ground deep, surface, metal, accent, light, ink, plus the
two motif accents (leaf, petal). Nine inputs, each with the current values as
defaults, each live-previewed.

**Type** — three font slots (display, body, mono), chosen from a curated list.
The theme loads the matching Google Fonts stylesheet for whatever is selected,
replacing today's hardcoded Marcellus / Hind Siliguri / IBM Plex Mono request.

**Identity** — logo, brand name, tagline, brand promise.

**Contact** — hotline, WhatsApp number, email, address, opening hours, social
links. These are consumed by the header CTA, the footer, and the contact block,
so a client's phone number is set once and appears everywhere.

Stored as theme mods so they survive content imports and appear in the Customizer
API for anything that wants them.

### Blocks

Core blocks (Group, Columns, Heading, Paragraph, Image, List, Buttons) cover
ordinary content once `theme.json` and the existing classes are wired up. Custom
blocks are only for what core cannot express.

| Block | Type | What it does |
|---|---|---|
| Scroll Hero | dynamic | Scroll-scrubbed video with a repeater of caption bands |
| Jharokha | static | Arch-masked image or video niche, optional stat overlay |
| Service Grid | dynamic | Card grid; cards are inner blocks |
| Service Card | static | One card: image, title, copy, link |
| Menu Deck | dynamic | Tabbed menu with dish lists per tab |
| Reel | static | Vertical arch-framed video with the marquee strip |
| Stat Row | static | Numbered niches |
| Accordion | static | `<details>`-based FAQ |
| Timeline | static | Founder-page milestones |
| Contact Panel | dynamic | Pulls hotline/WhatsApp/address from brand settings |

"Dynamic" means a PHP `render_callback`, which emits exact markup with no wrapper
divs — the property that removes the entire class of bug the Elementor build
needed `elementor-compat.css` to work around.

Each block owns a `block.json`, an `edit.js`, and either a `save.js` or a
`render.php`. Built with `@wordpress/scripts` (Node 26 and npm 11 are installed).

### Existing JavaScript

`hero.js` (169 lines) and `site.js` (326 lines) read `data-io`, `data-stagger`
and specific element IDs. Because blocks emit markup we control exactly, these
attributes can be output directly. The `elementor-compat.js` marker-class shim
and `elementor-compat.css` are both deleted — they exist only to work around
Elementor and have no purpose here.

### Templates

Block templates in `templates/`: `front-page.html`, `page.html`, `index.html`,
`404.html`, `search.html`. Template parts in `parts/`: `header.html`,
`footer.html`. The six service pages use the standard page template; their
differences are content, not structure.

## Data flow

```
Brand Setup screen  -->  theme mods  -->  token generator  -->  inline :root
                                     \
                                      ->  theme.json palette  ->  editor
                                     \
                                      ->  header/footer parts ->  phone, logo

Block editor  -->  post_content (block markup)  -->  render  -->  page
                                                         ^
Custom blocks  ---  render.php / save.js  -----------------

site.css  --  consumes tokens, styles everything
site.js, hero.js  --  read data-* attributes the blocks emit
```

## Error handling and edge cases

- **Missing brand settings.** Every token falls back to the current IHCS value,
  so a theme activated with no setup still renders the reference design.
- **Client picks a light ground.** The design assumes a dark ground in places
  (text colours, scrims, the `--tshadow` stack). The token refactor must derive
  these from the ground token rather than assume darkness. Verified by building
  a light preset as a test case.
- **Hero video without the right encoding.** Smooth scrubbing needs a short
  keyframe interval. The Scroll Hero block detects a video it cannot scrub and
  falls back to a static poster rather than stuttering, and the docs give the
  encode command.
- **Demo import on a site with content.** The importer never overwrites; it
  creates pages and reports what it made.
- **Blocks with missing media.** Render a placeholder in the editor and nothing
  on the front end, rather than a broken image.

## Testing

The verification approach from the Elementor build carries over, because it
caught real regressions that screenshots did not:

1. **Computed-style parity.** For each converted section, compare computed styles
   of block-rendered markup against the static site's hand-authored markup. A
   property mismatch is a failure, not a judgement call.
2. **Page sweep.** All 14 pages return 200; every asset resolves; every internal
   link target exists.
3. **Palette swap test.** Apply a deliberately different preset (light ground,
   different metal) and confirm nothing remains the original colour — this is the
   direct test of the commercial requirement.
4. **Editor round-trip.** Open each page in the block editor, confirm no block
   validation errors, change text, save, confirm the front end updates and the
   design is unchanged.
5. **Fresh-install test.** New WordPress, activate theme, run import, compare
   against the reference.

## Phases

| Phase | Deliverable |
|---|---|
| 0 | Theme scaffold, `theme.json`, build tooling |
| 1 | Token generator; `site.css` refactored so every colour is a token |
| 2 | Brand Setup screen; palette swap test passes |
| 3 | Custom blocks |
| 4 | Header and footer as template parts |
| 5 | Page conversion, all 14 pages |
| 6 | Demo content and importer |
| 7 | Client-handover documentation |

Phase 1 and 2 come before any block work on purpose: if full re-skinning turns
out to be harder than this spec assumes, that needs to surface before ten blocks
are built on the assumption.

## Risks

- **The palette swap may expose design assumptions we cannot cheaply remove.**
  Some of this design is specifically a dark Mughal court aesthetic. A client
  wanting a white minimalist site may not be servable by re-skinning alone.
  Phase 2 establishes how far the re-skin genuinely goes, and the answer becomes
  a sales boundary rather than a surprise during a project.
- **Block markup and existing CSS.** Core blocks add their own classes and
  occasional wrappers. Less invasive than Elementor, not zero. Phase 5 may need
  a small number of core blocks replaced with custom ones.
- **The current build contains real client data** — the founder's name and
  photograph, the hotline, real event photography. None of it can ship to another
  client. Handled in a later pass, but it blocks any delivery until done.

## Open question

Whether the theme should keep the name `ihcs` internally or be renamed to a
neutral product name now. Renaming later means touching every prefix and text
domain; renaming now costs nothing.
