# Iqbal Catering v2, Design Package (Tier 1, user footage, no generation)

## 1. Brand premise
The dawat. A Dhaka feast is judged by the last plate, not the first. Iqbal's own motto carries it: "Quality you can taste. Quantity you can count on." Every section proves that every guest gets the full plate, and funnels to one call to action: Request your quotation (anchor #quote).

## 2. Palette (from the IHCS logo and the footage)
Deviation said out loud: dark navy + gold + serif sits near a banned default, but here it IS the brand's own logo (navy lettering, antique gold roundel). Saffron comes from the kacchi rice in the hero footage; cream from the borhani.
```css
:root{
  --canvas:#17203B;        /* IHCS navy */
  --canvas-deep:#10172C;
  --panel:#1F2A4B;
  --accent:#F0B43C;        /* saffron rice, CTA only */
  --accent-hover:#F7C862;
  --accent-muted:rgba(240,180,60,.16);
  --gold:#C9A45C;          /* antique gold roundel, lines and ornaments */
  --text-secondary:#C2B79F;
  --text-primary:#F4EAD5;  /* borhani cream */
  --paper:#F6EEDD;         /* printed menu card */
  --paper-ink:#1B2442;
}
```

## 3. Type trio
- Display: Marcellus 400 (engraved capitals, echoes the logo lettering)
- Body: Hind Siliguri 400/500/600 (Latin + Bangla)
- Mono labels: IBM Plex Mono 500

## 4. Band map (hero 560vh, footage 4.95s: wide spread 0 to 0.505, copper kacchi pot 0.505 to 1)
| Band | Range | Footage | Copy | Entrance |
|---|---|---|---|---|
| 1 | 0.00 to 0.24 | Wide table spread, real hotline board | "Iqbal Hossain Catering Service" / "Dhaka's dawat, since 1987." | word rise (load ramp) |
| 2 | 0.27 to 0.48 | Slow push over the spread | "Quality you can taste." | scatter (spices settling) |
| 3 | 0.53 to 0.74 | Cut to the copper pot | "Quantity you can count on." | word punch (the cut lands) |
| 4 | 0.78 to 1.00 | Pot at rest, borhani behind | "Every guest gets the full plate." / "Kacchi, polao, rezala and borhani for weddings, corporate programs and family dawats across Dhaka." / Request your quotation, See the set menus | staged settle |

## 5. Static hero
Over hero-ending.jpg: "Every guest gets the full plate." / "Dhaka's trusted caterer since 1987. Weddings, corporate programs and family dawats. Minimum order 30 guests." / Request your quotation

## 6. Below the fold
facts strip, story (split with kacchi pour video), menu card deck (signature), promise steps, reels, set menus (tabs), venues wall, services, family, FAQ, Build your dawat (interactive moment + WhatsApp form to +880 1716 554413), contact, footer with logo reveal. All facts from iqbalcateringbd.com.

## 7. Vector layer
Gold jali lattice in the fixed background, self-drawing gold divider with a diamond ornament, gold diamond bullets, double-rule menu card borders.

## 8. Engineering
Blob fetch, dt-normalized lerp, gated seeks, delta-gated DOM, flick-tested bands, four-layer legibility, five live gates, complete without video, reduced motion live both ways, quality floor.

## 9. Copy gate
All copy ships verbatim. Zero em dashes, zero stock words, body sweep for AI tells before showing.
