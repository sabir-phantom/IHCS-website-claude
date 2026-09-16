// Writes the static pages of the Iqbal Catering site from shared parts.
// Output is plain HTML in the deploy folder; nothing here ships.
import fs from 'node:fs';
import path from 'node:path';

const OUT = 'D:/Sabir/Work/IC/iqbal-site-multipage';
const SITE = 'https://iqbalcateringbd.com'; // DEPLOY STEP: confirm the live domain before going online
const WA_NUM = '8801716554413';
const wa = text => `https://wa.me/${WA_NUM}?text=${encodeURIComponent(text)}`;

/* ================= SHARED DATA ================= */
const SERVICES = [
  { slug:'wedding-catering-dhaka', name:'Wedding Catering', event:'Wedding', card:'hero-biryani.jpg', cardAlt:'Kacchi biryani served at a wedding',
    blurb:'Elegant menus and attentive service designed around your traditions, guest count and celebration style.' },
  { slug:'corporate-catering-dhaka', name:'Corporate Events & AGM', event:'Corporate Event / AGM', card:'hero-banquet.jpg', cardAlt:'A banquet spread laid out for a corporate program',
    blurb:'Reliable catering for conferences, annual meetings, launches and team gatherings.' },
  { slug:'private-party-catering-dhaka', name:'Private Parties', event:'Private Party', card:'brand-food.jpg', cardAlt:'A signature Iqbal Catering food presentation',
    blurb:'Personal food, presentation and service for birthdays, anniversaries and intimate celebrations.' },
  { slug:'buffet-catering-dhaka', name:'Buffet & Plated Service', event:'Buffet / Plated Service', card:'hero-grill.jpg', cardAlt:'A platter of grilled meats ready for a buffet counter',
    blurb:'Buffet, plated and customized formats with professional service coordination.' },
  { slug:'outdoor-catering-dhaka', name:'Outdoor Catering', event:'Outdoor Catering', card:'food-banner.jpg', cardAlt:'Signature dishes prepared for an outdoor event',
    blurb:'Complete catering support for picnics, open-air events, garden functions and remote venues.' },
  { slug:'iftar-catering-dhaka', name:'Iftar & Special Occasions', event:'Iftar / Special Occasion', card:'premium-catering.jpg', cardAlt:'Shahi mutton kacchi with borhani',
    blurb:'Arrangements for Iftar, government functions, religious and cultural occasions.' }
];
const VENUES = ["Dhaka International Convention Center (DICC)","Sena Kunja","United Convention Center","Courtside","RAOWA Convention Hall","Sena Prangan","Sena Malancha","SKS Convention Hall","Army Golf Garden","Army Officers' Club","Krishibid Convention Hall","Tokyo Square Convention Center","Baridhara DOHS Convention Hall","Shagorika Hall","Shaheen Hall","Trust Milanoyoton","Elite Convention Hall","Purbachol Club","Greenvilli","PaperTree","Fortis Ground Club"];
const PARTNERS = [
  { img:'founder.jpg', w:800, h:1200, name:'Mohd. Iqbal Hossain', role:'Founder & Managing Partner', focus:'Strategic vision, brand leadership and business development', phone:'+8801711523771', phoneLabel:'+880 1711 523771' },
  { img:'pappu.jpg', w:733, h:1100, name:'Mohammad Mahmud Hossain Pappu', role:'Managing Partner', focus:'Management, finance, accounts, organizational structure and business coordination', phone:'+8801711556575', phoneLabel:'+880 1711 556575' },
  { img:'nasim.jpg', w:733, h:1100, name:'Mohammad Nasim Hossain', role:'Managing Partner', focus:'Legal expertise, marketing, client relations and operational support', phone:'+8801711598742', phoneLabel:'+880 1711 598742' },
  { img:'nadim.jpg', w:733, h:1100, name:'Mohd Nadim Hossain', role:'Managing Partner', focus:'Overall management, operations and business development', phone:'+8801711545452', phoneLabel:'+880 1711 545452' },
  { img:'abdul-qayyuum.jpg', w:1200, h:1800, name:'Abdul Qayyuum', role:'Second-Generation Leadership', focus:'Legacy, modernization and future growth', phone:'+8801716554413', phoneLabel:'+880 1716 554413' }
];
const WHY = [
  { h:'Unmatched Quality', p:'Careful sourcing, disciplined preparation and consistent presentation.' },
  { h:'Experienced Team', p:'Chefs, coordinators and service professionals who know Dhaka\'s halls.' },
  { h:'Structured Planning', p:'Menu, quantity, timing and service agreed in writing before the event.' },
  { h:'Client-Centric Approach', p:'Responsive communication and planning shaped around your priorities.' },
  { h:'Timely &amp; Reliable', p:'Production, delivery and serving planned around your event schedule.' },
  { h:'35+ Years of Experience', p:'Recipes, teams and venue knowledge built since 1987.' }
];
const CULINARY = [
  { h:'Bangladeshi Traditional Dishes', p:'Authentic and celebration-ready: kacchi, polao, rezala, korma and borhani.' },
  { h:'International Cuisine', p:'A versatile selection of grills, starters and mains for diverse guests.' },
  { h:'Desserts &amp; Sweets', p:'The finishing touches: shahi zarda, firni, gulab jamun and doi.' },
  { h:'Customized Menus', p:'Buffet and plated service, built around your budget, season and guests.' }
];

/* ================= PARTS ================= */
const ICON_FB = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12z"/></svg>';
const ICON_IG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>';
const ICON_WA = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l1.9-5.4A8.4 8.4 0 1 1 21 11.5z"/></svg>';
const CHEV = '<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M2.5 4.5L6 8l3.5-3.5"/></svg>';
const FAVICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Cpath d='M4 62V26C4 18 9 14 14 13C15 7 21 4 26 5C28 2 30 1 32 0C34 1 36 2 38 5C43 4 49 7 50 13C55 14 60 18 60 26V62Z' fill='%230F3329' stroke='%23D2AE6D' stroke-width='3'/%3E%3Ctext x='32' y='46' text-anchor='middle' font-family='Georgia,serif' font-size='14' font-weight='700' fill='%23EDB84E'%3EIHCS%3C/text%3E%3C/svg%3E";

const jharokha = (r, img, alt, { tag = '', w = 800, h = 1200, eager = false, video = '' } = {}) => `
<div class="jharokha">
  <span class="glow" aria-hidden="true"></span>
  ${video
    ? `<video data-ambient data-src="${r}media/video/${video}" muted loop playsinline preload="none" poster="${r}media/img/${img}" aria-hidden="true" tabindex="-1"></video>`
    : `<img src="${r}media/img/${img}" alt="${alt}" width="${w}" height="${h}"${eager ? '' : ' loading="lazy"'}>`}
  ${tag ? `<span class="tag">${tag}</span>` : ''}
</div>`;

const features = (list, cols = 3) => `<ul class="features" style="--cols:${cols}" data-stagger>${list.map(f => `<li class="feature"><h3>${f.h}</h3><p>${f.p}</p></li>`).join('')}</ul>`;
const steps = list => `<ol class="steps" data-stagger>${list.map((s, i) => `<li class="step"><span class="step-num">${i + 1}</span><h3>${s.h}</h3><p>${s.p}</p></li>`).join('')}</ol>`;
const faqs = list => list.map(f => `<details class="faq-item"><summary>${f.q}<i aria-hidden="true"></i></summary><p class="ans">${f.a}</p></details>`).join('');
const medallions = list => `<ul class="medallions" data-stagger>${list.map(m => `<li class="medal"><div class="medal-disc"><b${m.count ? ` data-count="${m.count}" data-suffix="${m.suffix || ''}"` : ''}>${m.v}</b></div><span>${m.l}</span></li>`).join('')}</ul>`;
const STATS = [
  { v:'35+', count:35, suffix:'+', l:'years of experience' },
  { v:'20+', count:20, suffix:'+', l:'prestigious venues' },
  { v:'5-Star', l:'category convention center operated' },
  { v:'1987', l:'serving with passion since' }
];

const svcCards = r => `<ul class="svc-cards" data-stagger>${SERVICES.map(s => `
  <li><a class="svc-card" href="${r}${s.slug}/">
    <div class="pic"><img src="${r}media/img/${s.card}" alt="${s.cardAlt}" loading="lazy"></div>
    <div class="body"><h3>${s.name.replace('&', '&amp;')}</h3><p>${s.blurb}</p><span class="link-arrow">Explore the service <span aria-hidden="true">&rarr;</span></span></div>
  </a></li>`).join('')}</ul>`;

const ctaBand = (r, { eyebrow = 'Ready to plan?', h = 'Let Iqbal Catering build the right menu and service plan.', p = 'Discuss your guest count, date, venue and preferred menu with our team.', q = '' } = {}) => `
<section class="cta-band" aria-label="Request a quotation">
  <div class="wrap" data-io>
    <span class="eyebrow">${eyebrow}</span>
    <h2>${h}</h2>
    <div class="orn" aria-hidden="true"><i></i></div>
    <p>${p}</p>
    <div class="ph-cta">
      <a class="btn btn-accent" href="${r}contact/${q}#quote">Request a quotation</a>
      <a class="btn btn-ghost" href="tel:+8801713334040">Call 01713 334040</a>
    </div>
  </div>
</section>`;

const pageHero = (r, { crumbs, eyebrow, h1, lede, cta = '', img, alt, w, h, tag = '' }) => `
<header class="page-hero">
  <div class="wrap ph-grid">
    <div class="ph-copy">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="${r || './'}">Home</a>${crumbs.map((c, i) => i === crumbs.length - 1 ? `<span aria-hidden="true">/</span><span aria-current="page">${c[0]}</span>` : `<span aria-hidden="true">/</span><a href="${r}${c[1]}">${c[0]}</a>`).join('')}</nav>
      <span class="eyebrow">${eyebrow}</span>
      <h1>${h1}</h1>
      <p class="lede">${lede}</p>
      ${cta ? `<div class="ph-cta">${cta}</div>` : ''}
    </div>
    <div class="ph-media">${jharokha(r, img, alt, { tag, w, h, eager: true })}</div>
  </div>
</header>
<div class="arcade" aria-hidden="true"></div>`;

const deck = (r, link = true) => `
<section class="deck-sec" id="dawats" aria-label="Menu cards from real events">
  <div class="wrap">
    <div class="head center" data-io>
      <span class="eyebrow">From real dawats</span>
      <h2>Menu cards from tables we have served.</h2>
      <div class="orn" aria-hidden="true"><i></i></div>
      <p>Every card here stood on a real table at an event we catered, printed for the hosts and their guests.</p>
    </div>
    <div class="deck" id="deck">
      <button class="mcard" type="button"><img src="${r}media/img/gallery-marigold-menu.jpg" alt="A wedding menu card among marigolds, with an Iqbal Catering table card" loading="lazy" width="1152" height="2048"></button>
      <button class="mcard" type="button"><img src="${r}media/img/gallery-menu-floral.jpg" alt="A floral wedding menu card on a reception table" loading="lazy" width="1152" height="2048"></button>
      <button class="mcard" type="button"><img src="${r}media/img/gallery-mayeesha-nabil-menu.jpg" alt="The printed menu card from Mayeesha and Nabil's wedding" loading="lazy" width="1152" height="2048"></button>
      <button class="mcard" type="button"><img src="${r}media/img/gallery-starter-menu.jpg" alt="A framed starter and main course menu board from a catered event" loading="lazy" width="1152" height="2048"></button>
      <button class="mcard" type="button"><img src="${r}media/img/gallery-menu-display.jpg" alt="A menu display with an Iqbal Catering branded table card" loading="lazy" width="1152" height="2048"></button>
      <button class="mcard" type="button"><img src="${r}media/img/gallery-menu-tissuebox.jpg" alt="A wedding menu beside an Iqbal Hossain Catering Service tissue box" loading="lazy" width="1152" height="2048"></button>
    </div>
    <p class="deck-hint">Tap a card to bring it forward</p>
    ${link ? `<p style="text-align:center;margin-top:26px"><a class="link-arrow" href="${r}gallery/">See the full gallery <span aria-hidden="true">&rarr;</span></a></p>` : ''}
  </div>
</section>`;

const reel = (r, file, poster, label, title) => `
<div class="reel" style="background-image:url('${r}media/img/${poster}')">
  <video data-src="${r}media/video/${file}" playsinline preload="none" poster="${r}media/img/${poster}"></video>
  <button class="reel-ui" type="button" aria-label="Play reel: ${title}">
    <span class="reel-play" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l13-7.5z"/></svg></span>
    <span class="reel-label">${label}</span><span class="reel-title">${title}</span>
  </button>
  <button class="reel-mute" type="button" aria-pressed="false" aria-label="Mute reels"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor" stroke="none"/><path class="wave" d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/><path class="cross" d="M16 9l6 6M22 9l-6 6"/></svg></button>
  <span class="reel-bar" aria-hidden="true"><i></i></span>
</div>`;
const reels = r => `
<section id="reels" aria-label="Event reels">
  <div class="wrap">
    <div class="head" data-io>
      <span class="eyebrow">Iqbal Catering in motion</span>
      <h2>Watch a service night.</h2>
      <p>Short reels from real events. Tap one to play it with sound.</p>
    </div>
    <div class="reels" data-stagger>
      ${reel(r, 'iqbal-reel-02.mp4', 'iqbal-reel-02-poster.jpg', 'Event reel 02', 'Refined Food Presentation')}
      ${reel(r, 'iqbal-reel-featured.mp4', 'iqbal-reel-featured-poster.jpg', 'Featured reel 01', 'Iqbal Catering in Motion')}
      ${reel(r, 'iqbal-reel-03.mp4', 'iqbal-reel-03-poster.jpg', 'Hospitality reel 03', 'Service in Motion')}
    </div>
  </div>
</section>`;

const menusBlock = (r, headTag = 'h2') => `
<div class="menus">
  <div data-io>
    <div class="tabs" role="tablist" aria-label="Set menus" id="tabs"></div>
    <p class="tab-note">Minimum order 30 persons. Prices are shared through a quotation, based on your menu, guest count and venue.</p>
  </div>
  <div class="paper" id="menuPanel" role="tabpanel" data-io>
    <div class="paper-top">
      <img src="${r}media/img/logo.png" alt="" width="64" height="64" loading="lazy">
      <p class="paper-kicker" id="menuKicker">Menu 1</p>
      <h3 id="menuTitle">Saffron Polao Selection</h3>
    </div>
    <div class="orn" aria-hidden="true"><i></i></div>
    <ul class="dishes" id="menuDishes"></ul>
    <div class="paper-foot"><a class="btn btn-accent" href="${r}contact/?menu=0#quote" data-base="${r}contact/" id="priceMenu">Get a price for this menu</a></div>
  </div>
</div>`;

const builder = (r, full) => `
<div class="builder" id="builder">
  <div>
    <form id="quoteForm" novalidate>
      <fieldset><legend class="legend">Set menu</legend><div class="pills" id="menuPills"></div></fieldset>
      <div class="field">
        <label for="qGuestsNum">Expected guests</label>
        <div class="guests">
          <input type="range" id="qGuests" min="30" max="2000" step="10" value="250" aria-label="Guest count slider">
          <input class="input" type="number" id="qGuestsNum" min="30" max="5000" value="250" inputmode="numeric">
        </div>
      </div>
      <div class="row2">
        <div class="field"><label for="qDate">Preferred date</label><input class="input" type="date" id="qDate"></div>
        <div class="field"><label for="qEvent">Event type</label>
          <select class="input" id="qEvent">
            <option>Wedding</option><option>Holud</option><option>Corporate Event / AGM</option><option>Private Party</option><option>Buffet / Plated Service</option><option>Outdoor Catering</option><option>Iftar / Special Occasion</option><option>Other</option>
          </select>
        </div>
      </div>
      <div class="field"><label for="qVenue">Venue or area</label><input class="input" id="qVenue" placeholder="For example DICC, or Mirpur DOHS" autocomplete="off"></div>
      ${full ? `
      <details class="more-fields">
        <summary>Add more details (optional) <span aria-hidden="true">+</span></summary>
        <div class="row2">
          <div class="field"><label for="qMeal">Meal time</label><select class="input" id="qMeal"><option value="">Not sure yet</option><option>Lunch</option><option>Dinner</option><option>Breakfast</option><option>Iftar</option><option>Tea break / Snacks</option></select></div>
          <div class="field"><label for="qStyle">Service style</label><select class="input" id="qStyle"><option value="">Not sure yet</option><option>Buffet</option><option>Plated</option><option>Packed box</option><option>Mixed</option></select></div>
        </div>
        <div class="row2">
          <div class="field"><label for="qBudget">Estimated budget</label><input class="input" id="qBudget" placeholder="Optional"></div>
          <div class="field"><label for="qEmail">Email</label><input class="input" id="qEmail" type="email" autocomplete="email" placeholder="Optional"></div>
        </div>
        <div class="field"><label for="qNotes">Staff, equipment, dietary or other needs</label><textarea class="input" id="qNotes" placeholder="Optional"></textarea></div>
      </details>` : ''}
      <div class="row2">
        <div class="field" id="fName"><label for="qName">Full name</label><input class="input" id="qName" autocomplete="name" required><span class="err">Please add your name.</span></div>
        <div class="field" id="fPhone"><label for="qPhone">Phone number</label><input class="input" id="qPhone" type="tel" autocomplete="tel" required placeholder="01XXX XXXXXX"><span class="err">Please add a phone number we can call.</span></div>
      </div>
      <button class="btn btn-accent send" type="submit">Send my dawat on WhatsApp</button>
      <p class="note">This opens WhatsApp with your details filled in, addressed to our team at +880 1716 554413. Nothing is sent until you press send there.</p>
    </form>
    <div class="done" role="status" aria-live="polite">
      <h3>Your dawat is ready in WhatsApp.</h3>
      <p>Press send in WhatsApp and our team will reply with your quotation. If WhatsApp did not open, call the hotline at <a href="tel:+8801713334040" style="color:var(--accent)">01713 334040</a>.</p>
    </div>
  </div>
  <aside class="paper dawat-card" aria-label="Your dawat card preview">
    <div class="paper-top"><p class="paper-kicker">Your dawat</p><h3 id="dcMenu">Shahi Mutton Kacchi Selection</h3></div>
    <div class="orn" aria-hidden="true"><i></i></div>
    <ul class="dishes" id="dcDishes"></ul>
    <div class="dc-meta">
      <div class="dc-line"><span>Guests</span><span class="dc-guests" id="dcGuests">250</span></div>
      <div class="dc-line"><span>Event</span><span id="dcEvent">Wedding</span></div>
      <div class="dc-line"><span>Date</span><span id="dcDate">To be decided</span></div>
      <div class="dc-line"><span>Venue</span><span id="dcVenue">To be decided</span></div>
    </div>
  </aside>
</div>`;

/* ================= CHROME ================= */
const NAV = [
  ['home', '', 'Home'], ['about', 'about/', 'About'], ['founder', 'founder/', 'Founder'], ['services', 'services/', 'Services'],
  ['menus', 'menus/', 'Menus'], ['venues', 'venues/', 'Venues'], ['gallery', 'gallery/', 'Gallery'], ['contact', 'contact/', 'Contact']
];
const header = (r, cur, sub, solid) => `
<nav class="nav${solid ? ' solid' : ''}" id="nav" aria-label="Main">
  <a class="brand" href="${r || './'}" aria-label="Iqbal Catering home">
    <img src="${r}media/img/logo.png" alt="" width="52" height="52">
    <span class="brand-name">Iqbal Catering<small>Since 1987</small></span>
  </a>
  <ul class="nav-links" id="navLinks">
    ${NAV.map(([key, href, label]) => key === 'services'
      ? `<li class="has-sub"><a href="${r}${href}"${cur === key && !sub ? ' aria-current="page"' : ''}${cur === key && sub ? ' data-active' : ''}>${label}</a><button class="sub-toggle" type="button" aria-expanded="false" aria-controls="subServices" aria-label="Show service pages">${CHEV}</button>
        <ul class="sub" id="subServices">${SERVICES.map(s => `<li><a href="${r}${s.slug}/"${sub === s.slug ? ' aria-current="page"' : ''}>${s.name.replace('&', '&amp;')}</a></li>`).join('')}</ul></li>`
      : `<li><a href="${r}${href || (r ? '' : './')}"${cur === key ? ' aria-current="page"' : ''}>${label}</a></li>`).join('\n    ')}
  </ul>
  <div class="nav-right">
    <a class="btn btn-accent nav-cta" href="${r}contact/#quote">Book Now</a>
    <button class="nav-toggle" id="navToggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="navLinks"><span></span></button>
  </div>
</nav>`;

const footer = r => `
<footer class="site-foot">
  <div class="inlay" aria-hidden="true"></div>
  <div class="wrap">
    <div class="foot-top">
      <div>
        <div class="reveal-logo">
          <video data-ambient data-once data-alpha data-src="${r}media/video/logo-reveal.webm" muted playsinline preload="none" poster="${r}media/img/logo-reveal-poster.png" width="480" height="496" aria-hidden="true" tabindex="-1"></video>
        </div>
        <p style="margin-top:16px;font-size:14.5px;color:var(--text-2)">Iqbal Hossain Catering Service. Symbol of client satisfaction, serving with passion since 1987. Part of Iqbal Group.</p>
      </div>
      <div class="foot-col"><h4>Explore</h4><ul>${NAV.map(([k, href, label]) => `<li><a href="${r}${href || (r ? '' : './')}">${label === 'Venues' ? 'Venues &amp; Achievements' : label}</a></li>`).join('')}</ul></div>
      <div class="foot-col"><h4>Services</h4><ul>${SERVICES.map(s => `<li><a href="${r}${s.slug}/">${s.name.replace('&', '&amp;')}</a></li>`).join('')}</ul></div>
      <div class="foot-col"><h4>Contact</h4><ul>
        <li><a href="tel:+8801713334040">Hotline 01713 334040</a></li>
        <li><a href="https://wa.me/${WA_NUM}" target="_blank" rel="noopener">WhatsApp +880 1716 554413</a></li>
        <li><a href="mailto:iqbalcatering523@gmail.com">iqbalcatering523@gmail.com</a></li>
        <li>Head office: Adabor, Mohammadpur, Dhaka</li>
        <li>Corporate office: DOHS Mohakhali, Dhaka</li>
      </ul></div>
    </div>
    <div class="foot-bottom">
      <span>&copy; <span id="year">2026</span> Iqbal Hossain Catering Service. Quality you can taste. Quantity you can count on.</span>
      <div class="social">
        <a href="https://www.facebook.com/IqbalcateringBangladesh" target="_blank" rel="noopener" aria-label="Facebook">${ICON_FB}</a>
        <a href="https://www.instagram.com/iqbalcateringbd/" target="_blank" rel="noopener" aria-label="Instagram">${ICON_IG}</a>
        <a href="https://wa.me/${WA_NUM}" target="_blank" rel="noopener" aria-label="WhatsApp">${ICON_WA}</a>
      </div>
    </div>
  </div>
</footer>`;

function write({ slug = '', title, desc, cur, sub = '', main, home = false, ogImg = 'hero-ending.jpg' }) {
  const r = slug ? '../' : '';
  const url = `${SITE}/${slug ? slug + '/' : ''}`;
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc}">
<meta name="theme-color" content="#0F3329">
<script>document.documentElement.classList.add('js')</script>
<link rel="icon" href="${FAVICON}">
<link rel="apple-touch-icon" href="${r}media/img/logo.png">
<!-- DEPLOY STEP: canonical, og:url and og:image use ${SITE}; change it if the site goes live on another address -->
<link rel="canonical" href="${url}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:image" content="${SITE}/media/img/${ogImg}">
<meta property="og:url" content="${url}">
<meta property="og:type" content="website">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Marcellus&family=Hind+Siliguri:wght@400;500;600&family=IBM+Plex+Mono:wght@500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${r}media/css/site.css">
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<div class="env" aria-hidden="true"></div>
${header(r, cur, sub, !home)}
<main id="main" tabindex="-1">
${main(r)}
</main>
${footer(r)}
${home ? `<script src="media/js/hero.js" defer></script>\n` : ''}<script src="${r}media/js/site.js" defer></script>
</body>
</html>
`;
  const dir = path.join(OUT, slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
  console.log('wrote', slug || '(home)');
}

/* ================= HOME ================= */
write({
  title: "Iqbal Catering | Dhaka's Royal Dawat Since 1987",
  desc: 'Wedding, corporate and family dawat catering in Dhaka since 1987. Kacchi, polao, rezala and borhani. Quality you can taste, quantity you can count on.',
  cur: 'home', home: true,
  main: r => `
<section class="hero" id="top" aria-label="Iqbal Catering introduction">
  <div class="stage" id="stage">
    <div class="scrub-layer">
      <div class="poster" id="poster" aria-hidden="true"></div>
      <div class="poster poster-end" id="posterEnd" aria-hidden="true"></div>
      <video class="hero-video" id="heroVideo" muted playsinline preload="none" aria-hidden="true" tabindex="-1"></video>
      <div class="scrim" aria-hidden="true"></div>
      <div class="band pos-bl deep" data-range="0,0.24" data-fx="rise" data-ramp="0.05" style="--sa:.84">
        <p class="eyebrow">Iqbal Hossain Catering Service</p>
        <p class="band-h" data-split>Dhaka's dawat, since 1987.</p>
      </div>
      <div class="band pos-tr deep off" data-range="0.27,0.48" data-fx="scatter" data-ramp="0.05" style="--sa:.86">
        <p class="band-h" data-split>Quality you can taste.</p>
      </div>
      <div class="band pos-tc off" data-range="0.53,0.74" data-fx="punch" data-ramp="0.05" style="--sa:.62">
        <p class="band-h" data-split data-em="3,4">Quantity you can count on.</p>
      </div>
      <div class="band pos-tl band-settle off" data-range="0.78,1" data-fx="rise" data-ramp="0.09" style="--sa:.72">
        <h1 class="band-h" data-split>Every guest gets the full plate.</h1>
        <p class="band-sub">Kacchi, polao, rezala and borhani for weddings, corporate programs and family dawats across Dhaka.</p>
        <div class="band-cta"><a class="btn btn-accent" href="contact/#quote">Request your quotation</a><a class="btn btn-ghost" href="menus/">See the set menus</a></div>
      </div>
    </div>
    <div class="static-hero" id="staticHero">
      <div class="static-inner">
        <h1>Every guest gets the full plate.</h1>
        <p>Dhaka's trusted caterer since 1987. Weddings, corporate programs and family dawats. Minimum order 30 guests.</p>
        <a class="btn btn-accent" href="contact/#quote">Request your quotation</a>
      </div>
    </div>
    <div class="cue" id="cue" aria-hidden="true"><span>Scroll</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 9l6 6 6-6"/></svg></div>
  </div>
</section>

<section aria-label="Iqbal Catering at a glance" style="padding-block:clamp(56px,7vw,90px)">
  <div class="wrap">${medallions(STATS)}</div>
</section>

<div class="arcade" aria-hidden="true"></div>
<section class="marble" aria-label="Welcome">
  <div class="wrap split">
    <div class="copy" data-io>
      <span class="eyebrow">Welcome to Iqbal Catering</span>
      <div class="head" style="margin-bottom:0"><h2>Where every event is a celebration of taste.</h2></div>
      <p class="big">Every meal is made with heart.</p>
      <p>For more than 35 years we have cooked for Dhaka's weddings, corporate programs and family gatherings. Fresh ingredients, dependable taste and service that arrives on time, from the first guest to the last.</p>
      <p><em>"Great food brings people together and creates lasting memories."</em></p>
      <p style="margin-top:26px"><a class="link-arrow" href="${r}about/">Read our story <span aria-hidden="true">&rarr;</span></a></p>
    </div>
    <div class="media" data-io>${jharokha(r, 'kacchi-pour-poster.jpg', '', { tag: 'Shahi mutton kacchi', video: 'kacchi-pour.mp4' })}</div>
  </div>
</section>
<div class="arcade to-emerald" aria-hidden="true"></div>

<section aria-label="Our services">
  <div class="wrap">
    <div class="head center" data-io>
      <span class="eyebrow">Our services</span>
      <h2>Catering for every kind of dawat.</h2>
      <div class="orn" aria-hidden="true"><i></i></div>
      <p>Personal catering, delivered with precision and style, for celebrations of every size.</p>
    </div>
    ${svcCards(r)}
  </div>
</section>

${deck(r)}

<div class="inlay" aria-hidden="true"></div>
<section id="menus" aria-label="Set menus">
  <div class="wrap">
    <div class="head" data-io>
      <span class="eyebrow">Royal set menus</span>
      <h2>Four menus to start from.</h2>
      <p>Pick one as it is, or change any dish to suit your guests. Every menu can be fully customized.</p>
    </div>
    ${menusBlock(r)}
  </div>
</section>

${reels(r)}

<div class="arcade" aria-hidden="true"></div>
<section class="marble" aria-label="Venues">
  <div class="wrap">
    <div class="head center" data-io>
      <span class="eyebrow">Venues &amp; achievements</span>
      <h2>Trusted at 20+ of Dhaka's most prestigious venues.</h2>
      <div class="orn" aria-hidden="true"><i></i></div>
      <p>And proud to operate the country's only 5-star category convention center, United Convention Center, under Iqbal Group.</p>
    </div>
  </div>
  <div class="marquee" aria-label="Venues we cater at"><div class="marquee-track">${[...VENUES, ...VENUES].map((v, i) => `<span${i >= VENUES.length ? ' aria-hidden="true"' : ''}>${v}</span>`).join('')}</div></div>
  <p style="text-align:center;margin-top:34px"><a class="link-arrow" href="${r}venues/">See all venues and achievements <span aria-hidden="true">&rarr;</span></a></p>
</section>
<div class="arcade to-emerald" aria-hidden="true"></div>

<section aria-label="Our founder">
  <div class="wrap split rev">
    <div class="media" data-io>${jharokha(r, '', '', {}).replace(`src="${r}media/img/"`, `src="${r}media/team/founder.jpg"`).replace('alt=""', 'alt="Mohd. Iqbal Hossain, founder of Iqbal Catering"')}</div>
    <div class="copy" data-io>
      <span class="eyebrow">Founder's principle</span>
      <div class="royal-quote" style="text-align:left;margin:18px 0 0">
        <p>"Build trust first. Protect quality always. Let service speak for the brand."</p>
        <cite><b>Mohd. Iqbal Hossain</b>, Founder &amp; Managing Partner</cite>
      </div>
      <p style="margin-top:26px"><a class="link-arrow" href="${r}founder/">Read the founder's story <span aria-hidden="true">&rarr;</span></a></p>
    </div>
  </div>
</section>

<div class="arcade" aria-hidden="true"></div>
<section class="marble" id="faq" aria-label="Frequently asked questions">
  <div class="wrap faq-grid">
    <div class="head" data-io>
      <span class="eyebrow">Before you book</span>
      <h2>What families ask us first.</h2>
      <p>Still unsure? Call the hotline at <a href="tel:+8801713334040" style="color:var(--ruby);font-weight:600">01713 334040</a>.</p>
    </div>
    <div data-io>${faqs([
      { q:'Will there be enough food for every guest?', a:'Yes. Portions are planned against your confirmed guest count before cooking starts, so the last table is served the same as the first.' },
      { q:'What is the minimum order?', a:'30 persons. Above that, we cater everything from home gatherings to full convention hall weddings.' },
      { q:'How much does it cost?', a:'Prices are shared through a quotation. It depends on the menu, guest count, event date, venue and service style.' },
      { q:'Can we change dishes in a set menu?', a:'Yes. The four set menus are starting points, and every menu can be fully customized around your budget, season and preferences.' }
    ])}</div>
  </div>
</section>
<div class="arcade to-emerald" aria-hidden="true"></div>

${ctaBand(r)}`
});

/* ================= ABOUT ================= */
write({
  slug: 'about', cur: 'about',
  title: 'About Iqbal Catering | A Trusted Name Since 1987',
  desc: "About Iqbal Catering: over 35 years of authentic Bangladeshi cuisine and personal hospitality for weddings, corporate events and family gatherings in Dhaka.",
  main: r => `
${pageHero(r, { crumbs: [['About']], eyebrow: 'About Iqbal Catering', h1: 'Where every event is a celebration of taste.', lede: 'And every meal is made with heart. For more than 35 years, Iqbal Catering has served weddings, corporate programs and family gatherings across Bangladesh.', cta: `<a class="btn btn-accent" href="${r}contact/#quote">Request a quotation</a><a class="btn btn-ghost" href="${r}founder/">Meet the founder</a>`, img: 'premium-catering.jpg', alt: 'Shahi mutton kacchi served with borhani', w: 1000, h: 1286, tag: 'Since 1987' })}
<section class="marble" aria-label="Welcome">
  <div class="wrap">
    <div class="split">
      <div class="copy" data-io>
        <span class="eyebrow">Welcome to Iqbal Catering</span>
        <div class="head" style="margin-bottom:0"><h2>A trusted name in Bangladesh's catering industry.</h2></div>
        <p class="big">Established more than 35 years ago, we are known for authentic flavours, fresh ingredients and personal hospitality.</p>
        <p>We create customized catering for weddings, corporate events, private gatherings and religious occasions. Our goal is simple: deliver quality cuisine and personal service that earns the trust of every family and company we serve.</p>
      </div>
      <div class="media" data-io>${jharokha(r, 'hero-biryani.jpg', 'Kacchi biryani prepared by Iqbal Catering', { w: 1920, h: 1280 })}</div>
    </div>
  </div>
</section>
<div class="arcade to-emerald" aria-hidden="true"></div>
<section aria-label="Our experience" style="padding-block:clamp(60px,8vw,100px)"><div class="wrap">${medallions(STATS)}</div></section>
<section aria-label="Our quote" style="padding-top:0">
  <div class="wrap royal-quote" data-io>
    <div class="orn" aria-hidden="true"><i></i></div>
    <p style="margin-top:22px">"Great food brings people together and creates lasting memories."</p>
    <cite><b>Iqbal Catering</b></cite>
  </div>
</section>
<div class="arcade" aria-hidden="true"></div>
<section class="marble" aria-label="What we cater">
  <div class="wrap">
    <div class="head" data-io><span class="eyebrow">What we cater</span><h2>Four kinds of occasion, one standard.</h2></div>
    ${features([
      { h:'Weddings &amp; Grand Celebrations', p:'Traditional menus and graceful service for holud, biye and walima.' },
      { h:'Corporate Events &amp; AGM Programs', p:'Punctual, organized catering for conferences, meetings and launches.' },
      { h:'Private &amp; Family Gatherings', p:'Birthdays, anniversaries, aqiqah and reunions, at home or in a hall.' },
      { h:'Outdoor &amp; Religious Events', p:'Picnics, garden functions, Iftar and community programs.' }
    ], 4)}
  </div>
</section>
<div class="arcade to-emerald" aria-hidden="true"></div>
<section aria-label="Vision and values">
  <div class="wrap">
    <div class="split">
      <div class="copy" data-io>
        <span class="eyebrow">Our vision</span>
        <div class="head" style="margin-bottom:0"><h2>Setting the benchmark for catering excellence in Bangladesh.</h2></div>
        <p class="big">We want every guest to remember the meal, by bringing tradition and innovation to the same table.</p>
      </div>
      <div data-io>
        <span class="eyebrow">Core values</span>
        <div style="margin-top:18px">${features([
          { h:'Quality', p:'Fresh ingredients, dependable taste and disciplined presentation.' },
          { h:'Trust', p:'Honest communication, accountability and consistent delivery.' },
          { h:'Service', p:'Professional coordination and attentive guest hospitality.' },
          { h:'Care', p:'Every event is treated with personal attention and respect.' }
        ], 2)}</div>
      </div>
    </div>
  </div>
</section>
<div class="arcade" aria-hidden="true"></div>
<section class="marble" aria-label="Why choose us">
  <div class="wrap">
    <div class="head center" data-io><span class="eyebrow">Why choose us</span><h2>Built around quality and reliability.</h2><div class="orn" aria-hidden="true"><i></i></div></div>
    ${features(WHY, 3)}
  </div>
</section>
<div class="arcade to-emerald" aria-hidden="true"></div>
${ctaBand(r)}`
});

/* ================= FOUNDER ================= */
const TIMELINE = [
  { when:'01', h:'A trusted beginning in Mohammadpur', p:'His business career began with Iqbal Hossain Variety Store, a well-known departmental store in Town Hall, one of the oldest and busiest bazaars in Mohammadpur, Dhaka. The store earned a name for reliability, fair pricing and real customer care, and became a trusted sourcing place for households, businesses and many professional chefs in the area.' },
  { when:'02', h:'Understanding food service from the ground up', p:'Mohd. Iqbal Hossain was not a chef. He was a businessman with sharp insight into what customers expect. As chefs bought their ingredients from his store, clients began asking him to arrange food for social gatherings, corporate programs and community events. He started connecting clients with chefs and supervising the arrangements himself.' },
  { when:'03', h:'Recognizing a gap in the market', p:'He saw that many providers put profit before quality, cutting food standards and customer satisfaction. Guided by honesty, accountability and excellence, he set out to build a catering service with uncompromising quality, authentic flavours and dependable service.' },
  { when:'04', h:'The establishment of Iqbal Catering', p:'He founded Iqbal Catering on integrity, premium quality and customer-centric hospitality. What began as an answer to a market need soon became a distinguished name in the catering industry.' },
  { when:'05', h:'A stronger family leadership', p:'As the business grew, his brothers joined him, bringing education, strategic insight and professional expertise. Each partner now oversees a critical function: management, finance and accounts, customer relations, operations and business development. Shared leadership keeps service standards high while the business grows.' },
  { when:'06', h:'Recognition, scale and hospitality excellence', p:'Today, by the grace of Almighty Allah, Alhamdulillah, many events feel incomplete without Iqbal Catering\'s cuisine. The brand is known for consistency, large-scale operations and a firm commitment to taste, hygiene and hospitality, serving high-profile weddings, corporate gatherings, government functions and prestigious social events.' },
  { when:'07', h:'A legacy built the right way', p:'His journey shows how trust, foresight and doing business the right way can turn a humble beginning into one of the country\'s most respected hospitality brands.' }
];
write({
  slug: 'founder', cur: 'founder',
  title: 'Founder & Leadership | Mohd. Iqbal Hossain | Iqbal Catering',
  desc: 'The story of Mohd. Iqbal Hossain, from Iqbal Hossain Variety Store in Mohammadpur to one of Bangladesh\'s respected catering brands, led by four brothers and the second generation.',
  ogImg: 'hero-ending.jpg',
  main: r => `
${pageHero(r, { crumbs: [['Founder &amp; Leadership']], eyebrow: 'Background of the founder', h1: 'Trust, foresight and the courage to build with integrity.', lede: "Mohd. Iqbal Hossain's journey reflects determination, honesty, disciplined leadership and a lasting commitment to quality service.", cta: `<a class="btn btn-accent" href="#story">Read the story</a>`, img: 'founder.jpg', alt: 'Mohd. Iqbal Hossain, founder and managing partner', w: 800, h: 1200, tag: 'Mohd. Iqbal Hossain' }).replace('media/img/founder.jpg', 'media/team/founder.jpg')}
<section class="marble" aria-label="Founder's principle" style="padding-block:clamp(60px,8vw,100px)">
  <div class="wrap royal-quote" data-io>
    <span class="eyebrow">Founder's principle</span>
    <p style="margin-top:20px">"Build trust first. Protect quality always. Let service speak for the brand."</p>
    <cite><b>Mohd. Iqbal Hossain</b></cite>
  </div>
</section>
<div class="arcade to-emerald" aria-hidden="true"></div>
<section id="story" aria-label="The founder's story">
  <div class="wrap">
    <div class="split" style="align-items:start">
      <div class="copy sticky-col" data-io>
        <span class="eyebrow">The complete founder story</span>
        <div class="head" style="margin-bottom:0"><h2>From a trusted Town Hall store to a respected hospitality brand.</h2></div>
        <p>Mohd. Iqbal Hossain, together with his brothers Mohammad Mahmud Hossain Pappu, Mohammad Nasim Hossain and Mohammad Nadim Hossain, leads the business with a shared vision of excellence, professionalism and sustainable growth.</p>
      </div>
      <ol class="timeline" data-stagger>${TIMELINE.map(t => `<li><span class="when">Chapter ${t.when}</span><h3>${t.h}</h3><p>${t.p}</p></li>`).join('')}</ol>
    </div>
  </div>
</section>
<div class="inlay" aria-hidden="true"></div>
<section aria-label="Managing partners">
  <div class="wrap">
    <div class="head center" data-io>
      <span class="eyebrow">One family, one standard</span>
      <h2>Four brothers, one shared vision.</h2>
      <div class="orn" aria-hidden="true"><i></i></div>
      <p>The business is led by four managing partners with a shared commitment to quality, professionalism, customer trust and sustainable growth.</p>
    </div>
    <ul class="partners" data-stagger>${PARTNERS.slice(0, 4).map(p => `<li class="partner">${jharokha(r, '', p.name, { w: p.w, h: p.h }).replace(`src="${r}media/img/"`, `src="${r}media/team/${p.img}"`)}<b>${p.name}</b><span>${p.role}</span><span>${p.focus}</span></li>`).join('')}</ul>
  </div>
</section>
<div class="arcade" aria-hidden="true"></div>
<section class="marble" aria-label="The second generation">
  <div class="wrap split rev">
    <div class="media" data-io>${jharokha(r, '', 'Abdul Qayyuum', { w: 1200, h: 1800, tag: 'Mr. Abdul Qayyuum' }).replace(`src="${r}media/img/"`, `src="${r}media/team/abdul-qayyuum.jpg"`)}</div>
    <div class="copy" data-io>
      <span class="eyebrow">Continuing the proud legacy</span>
      <div class="head" style="margin-bottom:0"><h2>The second generation steps forward.</h2></div>
      <p class="big">Mohd. Iqbal Hossain's son, Mr. Abdul Qayyuum, joined Iqbal Catering after completing his bachelor's degree at North South University.</p>
      <p>Learning directly from his father and uncles gave him practical knowledge, strong business ethics and a deep understanding of customer needs. He carries forward the principles of trust, quality and responsible service the business was built on.</p>
      <p>He is also bringing fresh ideas that pair the family's traditional values with modern strategy: better service quality, a wider customer base, digital platforms, a stronger brand and more organized operations.</p>
    </div>
  </div>
  <div class="wrap" style="margin-top:56px">${features([
    { h:'Service Quality', p:'Improving systems and guest experience while protecting the brand\'s established standards.' },
    { h:'Digital Growth', p:'Using modern platforms to reach more clients and build a stronger, more accessible brand.' },
    { h:'Organized Operations', p:'Developing structured processes for efficiency, consistency and sustainable expansion.' }
  ], 3)}
  <div class="royal-quote" data-io style="margin-top:60px"><p style="font-size:clamp(24px,3vw,36px)">"Continue the family tradition with honesty, dedication and innovation, so Iqbal Catering stays relevant, competitive and trusted by future generations."</p><cite><b>Mr. Abdul Qayyuum</b>, second-generation leadership</cite></div>
  </div>
</section>
<div class="arcade to-emerald" aria-hidden="true"></div>
${ctaBand(r, { eyebrow: 'A legacy of hospitality', h: 'Experience the standard built by the Iqbal family.', p: 'Tell us about your event and our team will plan the menu and service with you.' })}`
});

/* ================= SERVICES ================= */
write({
  slug: 'services', cur: 'services',
  title: 'Catering Services in Dhaka | Wedding, Corporate, Buffet | Iqbal Catering',
  desc: 'Wedding, corporate, private party, buffet, outdoor and Iftar catering in Dhaka. Personal catering, delivered with precision and style since 1987.',
  main: r => `
${pageHero(r, { crumbs: [['Services']], eyebrow: 'Our services', h1: 'Personal catering, delivered with precision and style.', lede: 'Six ways we cater, each planned around your guests, your venue and your schedule.', cta: `<a class="btn btn-accent" href="${r}contact/#quote">Request a quotation</a><a class="btn btn-ghost" href="${r}menus/">View menus</a>`, img: 'hero-banquet.jpg', alt: 'A full banquet spread laid out by Iqbal Catering', w: 1920, h: 1280 })}
<section class="marble" aria-label="All services">
  <div class="wrap">
    <div class="head center" data-io><span class="eyebrow">Designed around your event</span><h2>Choose the kind of dawat you are planning.</h2><div class="orn" aria-hidden="true"><i></i></div></div>
    ${svcCards(r)}
  </div>
</section>
<div class="arcade to-emerald" aria-hidden="true"></div>
<section aria-label="Our service process">
  <div class="wrap">
    <div class="head center" data-io><span class="eyebrow">Our service process</span><h2>Professional coordination from planning to presentation.</h2><div class="orn" aria-hidden="true"><i></i></div></div>
    ${steps([
      { h:'Consultation', p:'We learn about your occasion, guest count, venue, timing and budget.' },
      { h:'Menu Design', p:'We shape a menu from our set menus or build one around your taste.' },
      { h:'Preparation', p:'Ingredients are checked and cooking follows the agreed production plan.' },
      { h:'Execution', p:'Our team sets up, serves and manages the meal on the day.' }
    ])}
  </div>
</section>
<div class="arcade" aria-hidden="true"></div>
<section class="marble" aria-label="Culinary capability">
  <div class="wrap">
    <div class="split" style="align-items:start">
      <div class="copy" data-io>
        <span class="eyebrow">Culinary capability</span>
        <div class="head" style="margin-bottom:0"><h2>Tradition and variety on every menu.</h2></div>
        <p class="big">Menus tailored around your event style, guest preferences and service format.</p>
        <p style="margin-top:26px"><a class="link-arrow" href="${r}menus/">See the four set menus <span aria-hidden="true">&rarr;</span></a></p>
      </div>
      <div data-io>${features(CULINARY, 2)}</div>
    </div>
  </div>
</section>
<div class="arcade to-emerald" aria-hidden="true"></div>
<section aria-label="Why choose us">
  <div class="wrap">
    <div class="head center" data-io><span class="eyebrow">Why choose us</span><h2>Built around quality and reliability.</h2><div class="orn" aria-hidden="true"><i></i></div></div>
    ${features(WHY, 3)}
  </div>
</section>
${ctaBand(r)}`
});

/* ================= SERVICE DETAIL PAGES ================= */
const DETAIL = {
  'wedding-catering-dhaka': {
    title: 'Wedding Catering in Dhaka | Iqbal Catering', crumb: 'Wedding Catering', lower: 'wedding catering',
    h1: 'Wedding catering in Dhaka for memorable celebrations.',
    lede: "Plan a wedding menu with authentic taste, graceful presentation and dependable guest service from one of Dhaka's trusted catering teams.",
    hero: ['gallery-marigold-menu.jpg', 'A wedding menu card among marigolds with an Iqbal Catering table card', 1152, 2048],
    second: ['gallery-mayeesha-nabil-menu.jpg', "The printed menu card from Mayeesha and Nabil's wedding", 1152, 2048],
    features: [
      { h:'Traditional Wedding Menus', p:'Kacchi, polao, rezala, borhani and the dishes your families expect, cooked the traditional way.' },
      { h:'Buffet or Plated Service', p:'Buffet counters or plated service, chosen to suit the hall and your guests.' },
      { h:'Quantity Planning', p:'Portions planned against your confirmed guest count, so every table is served in full.' },
      { h:'Event-Day Coordination', p:'Counters, serving staff and timing managed by our team, so your families can enjoy the day.' }
    ],
    steps: [
      { h:'Share Event Details', p:'Provide the wedding date, venue, expected guests and preferred meal time.' },
      { h:'Build the Menu', p:'Choose packages or combine dishes by taste, tradition and budget.' },
      { h:'Confirm the Service Plan', p:'Finalize counters, serving style, staffing, equipment and timing.' },
      { h:'Prepare and Serve', p:'Our team carries out the confirmed production, setup and service plan.' }
    ],
    faqs: [
      { q:'Do you provide wedding catering across Dhaka?', a:'Yes. Iqbal Catering provides wedding catering for venues, community centers, convention halls and private locations across Dhaka.' },
      { q:'Can the wedding menu be customized?', a:'Yes. Menu items, service style, guest count and budget can be discussed before the final quotation.' },
      { q:'How can I get a wedding catering quotation?', a:'Use the booking form or WhatsApp button and share your event date, venue, guest count and preferred menu.' }
    ]
  },
  'corporate-catering-dhaka': {
    title: 'Corporate Catering in Dhaka | AGM & Conferences | Iqbal Catering', crumb: 'Corporate Catering', lower: 'corporate catering',
    h1: 'Corporate catering in Dhaka for AGM, conferences and office events.',
    lede: 'Keep your corporate program professional with organized menu planning, punctual service and dependable event coordination.',
    hero: ['gallery-starter-menu.jpg', 'A framed starter and main course menu board at a catered event', 1152, 2048],
    second: ['hero-banquet.jpg', 'A banquet spread laid out for a corporate program', 1920, 1280],
    features: [
      { h:'AGM and Conference Catering', p:'Structured service for annual meetings, conferences, launches, training sessions and institutional programs.' },
      { h:'Flexible Corporate Menus', p:'Breakfast boxes, tea breaks, executive lunches, dinner, snacks and buffet formats can be planned.' },
      { h:'Punctual Delivery and Service', p:'Preparation, transport, setup and serving times are coordinated around the official event schedule.' },
      { h:'Scalable Guest Planning', p:'Menus and service resources are matched to executives, invited guests, employees or large attendance groups.' }
    ],
    steps: [
      { h:'Share the Program Schedule', p:'Provide location, attendance, agenda and required food-service windows.' },
      { h:'Choose the Format', p:'Select packed meals, tea break, buffet, plated service or a mixed arrangement.' },
      { h:'Approve Logistics', p:'Confirm access, loading time, counters, equipment, staffing and billing requirements.' },
      { h:'Execute on Schedule', p:'The team coordinates delivery, setup and service around the approved corporate timetable.' }
    ],
    faqs: [
      { q:'Do you handle large corporate catering programs?', a:'Yes. The team supports corporate gatherings, annual meetings, launches and institutional programs with scalable planning.' },
      { q:'Can you serve lunch or buffet at an office venue?', a:'Yes. Buffet, packed, plated or customized service formats can be planned based on the venue and guest count.' },
      { q:'What details are needed for a quotation?', a:'Event date, location, guest count, food preference, timing and service style help prepare an accurate quotation.' }
    ]
  },
  'private-party-catering-dhaka': {
    title: 'Private Party Catering in Dhaka | Family Celebrations | Iqbal Catering', crumb: 'Private Party Catering', lower: 'private parties',
    h1: 'Private party catering in Dhaka for family celebrations.',
    lede: 'Create a warm and memorable private event with food, presentation and hospitality arranged around your guests.',
    hero: ['gallery-menu-floral.jpg', 'A floral menu card on a celebration table', 1152, 2048],
    second: ['brand-food.jpg', 'A signature Iqbal Catering food presentation', 1100, 1100],
    features: [
      { h:'Family Celebration Menus', p:'Menus can be planned for birthdays, anniversaries, aqiqah, reunions and intimate social gatherings.' },
      { h:'Traditional and Contemporary Choices', p:'Combine familiar Bangladeshi dishes with modern starters, grills, desserts and beverages.' },
      { h:'Home or Private-Venue Service', p:'Service requirements are adapted to available space, access, kitchen conditions and guest flow.' },
      { h:'Personalized Presentation', p:'Menu cards, counters, serving style and finishing details can reflect the tone of the celebration.' }
    ],
    steps: [
      { h:'Describe the Occasion', p:'Share the celebration type, venue, guest count and preferred date.' },
      { h:'Discuss Preferences', p:"Identify favourite dishes, dietary needs, children's options and presentation preferences." },
      { h:'Confirm the Arrangement', p:'Approve menu, quantities, arrival time, service format and any equipment needs.' },
      { h:'Host with Confidence', p:'The team prepares and serves according to the agreed plan so hosts can focus on guests.' }
    ],
    faqs: [
      { q:'Do you provide catering for small private parties?', a:'Yes. Private parties, family gatherings and intimate celebrations can be planned according to guest count and service style. The minimum order is 30 persons.' },
      { q:'Can I request a custom party menu?', a:'Yes. The team can discuss traditional, international, dessert and custom menu combinations.' },
      { q:'Can service be arranged at home?', a:'Service can be discussed for homes, halls and private venues depending on logistics and event size.' }
    ]
  },
  'buffet-catering-dhaka': {
    title: 'Buffet Catering in Dhaka | Buffet & Plated Service | Iqbal Catering', crumb: 'Buffet Catering', lower: 'buffet catering',
    h1: 'Buffet catering in Dhaka with flexible service formats.',
    lede: 'Choose a buffet or plated service style that matches your venue, guest flow and event objectives.',
    hero: ['gallery-menu-display.jpg', 'A menu display with an Iqbal Catering branded table card', 1152, 2048],
    second: ['gallery-menu-tissuebox.jpg', 'A wedding menu beside an Iqbal Hossain Catering Service tissue box', 1152, 2048],
    features: [
      { h:'Buffet and Plated Formats', p:'Choose buffet, plated, family-style or mixed service based on event pace and guest expectations.' },
      { h:'Balanced Menu Combinations', p:'Starters, mains, sides, desserts and beverages are arranged for variety and a coherent dining experience.' },
      { h:'Guest-Flow Planning', p:'Counter placement, queue direction and serving sequence are considered to reduce congestion.' },
      { h:'Food-Station Coordination', p:'Counters, chafing dishes, labels and service staff are organized for a clean, professional presentation.' }
    ],
    steps: [
      { h:'Assess the Event', p:'Share venue layout, guest count, meal period and event type.' },
      { h:'Select Service Style', p:'Choose buffet, plated or mixed service based on space, schedule and guest profile.' },
      { h:'Plan Counters and Staffing', p:'Finalize menu, station count, equipment, replenishment and serving responsibilities.' },
      { h:'Set Up and Serve', p:'The team installs the agreed service layout and manages food presentation throughout the meal.' }
    ],
    faqs: [
      { q:'Can you provide buffet catering for weddings and corporate events?', a:'Yes. Buffet service can be arranged for wedding, corporate, private and special occasion events.' },
      { q:'Can buffet menu items be customized?', a:'Yes. Menu combinations can be customized based on guest preferences, budget and event style.' },
      { q:'Do you arrange serving staff?', a:'Staffing can be planned as part of the service requirement and event scope.' }
    ]
  },
  'outdoor-catering-dhaka': {
    title: 'Outdoor Catering in Dhaka | Open-Air Events | Iqbal Catering', crumb: 'Outdoor Catering', lower: 'outdoor catering',
    h1: 'Outdoor catering in Dhaka for open-air and venue events.',
    lede: 'Make outdoor events easier with structured catering logistics, suitable menus and reliable setup planning.',
    hero: ['hero-grill.jpg', 'A platter of grilled meats prepared for an outdoor event', 1920, 1280],
    second: ['hero-biryani.jpg', 'Kacchi biryani ready to serve', 1920, 1280],
    features: [
      { h:'Open-Air Event Catering', p:'Support for picnics, garden functions, community programs and outdoor venue celebrations.' },
      { h:'Access and Timing Logistics', p:'Vehicle access, preparation area, power, water, weather exposure and serving time are reviewed in advance.' },
      { h:'Outdoor-Suitable Menus', p:'Menu choices can be adjusted for transport, holding time, temperature control and guest movement.' },
      { h:'Equipment and Team Planning', p:'Required counters, service equipment and staffing are defined according to the location and event scale.' }
    ],
    steps: [
      { h:'Review the Location', p:'Provide venue access, event time, guest count and any site restrictions.' },
      { h:'Choose a Practical Menu', p:'Select dishes and a serving plan appropriate for the outdoor setting.' },
      { h:'Confirm Site Logistics', p:'Agree on transport, setup area, equipment, staffing and weather contingencies.' },
      { h:'Coordinate the Event', p:'The team follows the approved site and service plan from arrival through completion.' }
    ],
    faqs: [
      { q:'Do you provide outdoor catering outside traditional halls?', a:'Yes. Outdoor venues, gardens, picnic locations and open-air programs can be discussed according to operational feasibility.' },
      { q:'What should I share for an outdoor catering quotation?', a:'Provide location, guest count, event time, menu preference, setup access and any venue restrictions.' },
      { q:'Can outdoor catering be customized for large events?', a:'Yes. Menu and service planning can be adjusted for larger guest counts and event formats.' }
    ]
  },
  'iftar-catering-dhaka': {
    title: 'Iftar & Special Occasion Catering in Dhaka | Iqbal Catering', crumb: 'Iftar Catering', lower: 'Iftar catering',
    h1: 'Iftar and special occasion catering in Dhaka.',
    lede: 'Arrange respectful, timely and well-planned catering for Ramadan, religious, cultural and community occasions.',
    hero: ['premium-catering.jpg', 'Shahi mutton kacchi with borhani', 1000, 1286],
    second: ['biryani-close.jpg', 'A close view of Iqbal Catering kacchi biryani', 1400, 933],
    features: [
      { h:'Iftar and Ramadan Menus', p:'Dates, beverages, snacks, main courses and desserts can be combined for family, corporate or community Iftar.' },
      { h:'Respectful Occasion Planning', p:'Menus and service are arranged with attention to the nature, timing and customs of religious or cultural programs.' },
      { h:'Time-Critical Coordination', p:'Production, delivery and serving schedules are planned carefully for fixed meal times such as Iftar.' },
      { h:'Customized Packages', p:'Traditional dishes, beverages, packed options and buffet service can be tailored to attendance and budget.' }
    ],
    steps: [
      { h:'Share Occasion Details', p:'Provide the date, venue, expected attendance and exact serving time.' },
      { h:'Plan the Menu', p:'Choose food and beverage combinations suited to the occasion and guest profile.' },
      { h:'Confirm Timing and Logistics', p:'Finalize preparation, delivery, staffing, counters and service sequence.' },
      { h:'Deliver with Care', p:'The team follows the approved timeline and service plan with respect for the occasion.' }
    ],
    faqs: [
      { q:'Do you provide Iftar catering in Dhaka?', a:'Yes. Iftar catering can be arranged for family, community, corporate and institutional Ramadan programs.' },
      { q:'Can you support religious or cultural gatherings?', a:'Yes. Special occasion catering can be planned according to the occasion, guest count and menu preference.' },
      { q:'How early should I request a quotation?', a:'For large programs, earlier confirmation helps menu planning, staffing and logistics. Share your date and details through WhatsApp or the booking form.' }
    ]
  }
};
for (const s of SERVICES) {
  const d = DETAIL[s.slug];
  const q = `?event=${encodeURIComponent(s.event)}`;
  const waText = `Assalamu alaikum Iqbal Catering, I would like a quotation for ${d.lower}.`;
  write({
    slug: s.slug, cur: 'services', sub: s.slug, title: d.title, desc: d.lede,
    main: r => `
${pageHero(r, { crumbs: [['Services', 'services/'], [d.crumb]], eyebrow: s.name.replace('&', '&amp;'), h1: d.h1, lede: d.lede, cta: `<a class="btn btn-accent" href="${wa(waText)}" target="_blank" rel="noopener">Request quotation on WhatsApp</a><a class="btn btn-ghost" href="${r}menus/">View menus</a>`, img: d.hero[0], alt: d.hero[1], w: d.hero[2], h: d.hero[3] })}
<section class="marble" aria-label="Why choose this service">
  <div class="wrap">
    <div class="head" data-io>
      <span class="eyebrow">Why choose this service</span>
      <h2>${s.name.replace('&', '&amp;')} in Dhaka with quality, timing and professional care.</h2>
      <p>Every booking can be customized by menu, guest count, venue, budget and service style.</p>
    </div>
    ${features(d.features, 4)}
  </div>
</section>
<div class="arcade to-emerald" aria-hidden="true"></div>
<section aria-label="Booking process">
  <div class="wrap">
    <div class="head center" data-io><span class="eyebrow">Booking process</span><h2>From enquiry to event-day execution.</h2><div class="orn" aria-hidden="true"><i></i></div><p>Share your event details and our team will guide you through menu selection, quotation and service planning.</p></div>
    ${steps(d.steps)}
  </div>
</section>
<div class="inlay" aria-hidden="true"></div>
<section aria-label="Menu and quotation">
  <div class="wrap split rev">
    <div class="media" data-io>${jharokha(r, d.second[0], d.second[1], { w: d.second[2], h: d.second[3] })}</div>
    <div class="copy" data-io>
      <span class="eyebrow">Menu &amp; quotation</span>
      <div class="head" style="margin-bottom:0"><h2>Get a customized quote for ${d.lower}.</h2></div>
      <p class="big">Final pricing depends on the menu, quantity, event date, venue, service style and operational scope.</p>
      <p>For a faster quotation, share your event date, expected guest count, location and preferred menu. Minimum order 30 persons.</p>
      <div class="ph-cta">
        <a class="btn btn-accent" href="${r}contact/${q}#quote">Build your dawat</a>
        <a class="btn btn-ghost" href="${wa(waText)}" target="_blank" rel="noopener">Send details on WhatsApp</a>
      </div>
    </div>
  </div>
</section>
<div class="arcade" aria-hidden="true"></div>
<section class="marble" aria-label="Frequently asked questions">
  <div class="wrap faq-grid">
    <div class="head" data-io><span class="eyebrow">FAQ</span><h2>Common questions about ${d.lower}.</h2></div>
    <div data-io>${faqs(d.faqs)}</div>
  </div>
</section>
<div class="arcade to-emerald" aria-hidden="true"></div>
<section aria-label="Other services" style="padding-bottom:0">
  <div class="wrap">
    <div class="head center" data-io><span class="eyebrow">More services</span><h2>Planning something else?</h2></div>
    <ul class="features" style="--cols:5" data-stagger>${SERVICES.filter(o => o.slug !== s.slug).map(o => `<li class="feature"><h3><a href="${r}${o.slug}/">${o.name.replace('&', '&amp;')}</a></h3></li>`).join('')}</ul>
  </div>
</section>
${ctaBand(r, { q })}`
  });
}

/* ================= MENUS ================= */
write({
  slug: 'menus', cur: 'menus',
  title: 'Set Menus | Kacchi, Polao & Grill Packages | Iqbal Catering',
  desc: 'Four set menus from Iqbal Catering: Saffron Polao, Dhakayya Morog Polao, Shahi Mutton Kacchi and Premium Kacchi & Grill. Minimum order 30 persons.',
  main: r => `
${pageHero(r, { crumbs: [['Menus']], eyebrow: 'A rich culinary collection', h1: 'Four royal set menus.', lede: 'Pick one as it is, or change any dish to suit your guests. Minimum order 30 persons. Prices are available through quotation.', cta: `<a class="btn btn-accent" href="#menus">See the menus</a><a class="btn btn-ghost" href="${r}contact/#quote">Request a quotation</a>`, img: 'hero-biryani.jpg', alt: 'Kacchi biryani served in a copper dish', w: 1920, h: 1280 })}
<section class="marble" id="menus" aria-label="Set menus">
  <div class="wrap">
    <div class="head" data-io><span class="eyebrow">Set menus</span><h2>Choose your starting point.</h2><p>Tap a menu to see every dish. Each one can be changed to suit your budget, season and guests.</p></div>
    <div class="menus-on-marble">${menusBlock(r)}</div>
  </div>
</section>
<div class="arcade to-emerald" aria-hidden="true"></div>
<section aria-label="Culinary categories">
  <div class="wrap">
    <div class="head center" data-io><span class="eyebrow">Tradition and variety</span><h2>Menus tailored around your event.</h2><div class="orn" aria-hidden="true"><i></i></div></div>
    ${features(CULINARY, 4)}
  </div>
</section>
${deck(r)}
${ctaBand(r, { h: 'Found the menu you want?', p: 'Send it to our team with your guest count and date, and we will reply with a quotation.' })}`
});

/* ================= VENUES ================= */
write({
  slug: 'venues', cur: 'venues',
  title: 'Venues & Achievements | 20+ Prestigious Venues | Iqbal Catering',
  desc: "Iqbal Catering is enlisted across nearly all prestigious convention venues in Dhaka and operates United Convention Center, the country's only 5-star category convention center.",
  main: r => `
${pageHero(r, { crumbs: [['Venues &amp; Achievements']], eyebrow: 'Venues &amp; achievements', h1: 'Prestigious venues, trusted partnerships, proven operations.', lede: 'Iqbal Catering is enlisted as a trusted catering partner across nearly all prestigious convention venues in Dhaka.', cta: `<a class="btn btn-accent" href="#venue-list">See the venues</a><a class="btn btn-ghost" href="${r}contact/#quote">Plan an event</a>`, img: 'gallery-menu-display.jpg', alt: 'An Iqbal Catering table card and menu display at a convention hall', w: 1152, h: 2048 })}
<section class="marble" aria-label="Industry presence">
  <div class="wrap split">
    <div class="copy" data-io>
      <span class="eyebrow">An unmatched industry presence</span>
      <div class="head" style="margin-bottom:0"><h2>Enlisted across nearly all prestigious convention venues in Dhaka.</h2></div>
      <p class="big">This wide enlistment across premier venues shows Iqbal Catering's market reach and its standing as one of the most trusted hospitality operators in the country.</p>
      <p>Under the umbrella of Iqbal Group, our experience spans prestigious venues, major hospitality operations and important national and international events.</p>
    </div>
    <div data-io>${medallions([{ v:'35+', count:35, suffix:'+', l:'years of experience' }, { v:'20+', count:20, suffix:'+', l:'prestigious venues operated' }, { v:'5-Star', l:'category convention center operated' }, { v:'1987', l:'founded' }]).replace('class="medallions"', 'class="medallions" style="grid-template-columns:1fr 1fr;row-gap:36px"')}</div>
  </div>
</section>
<div class="arcade to-emerald" aria-hidden="true"></div>
<section id="venue-list" aria-label="Our distinguished portfolio">
  <div class="wrap">
    <div class="head" data-io><span class="eyebrow">Our distinguished portfolio</span><h2>Premium convention centers and elite venues.</h2><p>Our team knows these halls: where the counters go, how guests move, and how long service takes.</p></div>
    <ul class="venue-wall" data-stagger>${VENUES.map(v => `<li>${v}</li>`).join('')}</ul>
  </div>
</section>
<div class="inlay" aria-hidden="true"></div>
<section aria-label="A landmark milestone">
  <div class="wrap split rev">
    <div class="media" data-io>${jharokha(r, 'hero-banquet.jpg', 'A banquet spread prepared for a prestigious event', { w: 1920, h: 1280, tag: 'United Convention Center' })}</div>
    <div class="copy" data-io>
      <span class="eyebrow">A landmark milestone</span>
      <div class="head" style="margin-bottom:0"><h2>United Convention Center.</h2></div>
      <p class="big">Alhamdulillah, we are proud to operate the country's only 5-star category convention center, United Convention Center, next to Hazrat Shahjalal International Airport, solely under the management of Iqbal Group.</p>
      <p>Years of trusted service have built our name for reliability, scale and excellence, and made Iqbal Catering a preferred partner for prestigious national and international events.</p>
    </div>
  </div>
</section>
<div class="arcade" aria-hidden="true"></div>
<section class="marble" aria-label="Our promise">
  <div class="wrap royal-quote" data-io>
    <div class="orn" aria-hidden="true"><i></i></div>
    <p style="margin-top:22px">"Premium hospitality is not only about serving food. It is about delivering confidence, consistency and a memorable guest experience."</p>
    <cite><b>Iqbal Catering</b></cite>
  </div>
</section>
<div class="arcade to-emerald" aria-hidden="true"></div>
${ctaBand(r, { eyebrow: 'Planning a prestigious event?', h: 'Tell us the venue. We will plan around it.' })}`
});

/* ================= GALLERY ================= */
const GALLERY = [
  ['hero-banquet.jpg', 1920, 1280, 'A full banquet spread'],
  ['gallery-mayeesha-nabil-menu.jpg', 1152, 2048, "Mayeesha and Nabil's wedding menu card"],
  ['hero-biryani.jpg', 1920, 1280, 'Kacchi biryani'],
  ['promo-country-best-wedding.jpg', 1254, 1254, "Country's best Indo-Bangla wedding special food"],
  ['gallery-marigold-menu.jpg', 1152, 2048, 'Marigold floral event menu'],
  ['hero-grill.jpg', 1920, 1280, 'Mixed grill platter'],
  ['premium-catering.jpg', 1000, 1286, 'Shahi mutton kacchi with borhani'],
  ['gallery-menu-floral.jpg', 1152, 2048, 'Floral menu card presentation'],
  ['royal-feast.jpg', 1600, 1066, 'The Royal Feast'],
  ['biryani-close.jpg', 1400, 933, 'Kacchi biryani, close up'],
  ['gallery-starter-menu.jpg', 1152, 2048, 'Traditional starter and main course menu board'],
  ['brand-food.jpg', 1100, 1100, 'Signature food presentation'],
  ['promo-celebration-of-taste.jpg', 1920, 1279, 'Where every event is a celebration of taste'],
  ['gallery-menu-tissuebox.jpg', 1152, 2048, 'Wedding menu and branded tissue box'],
  ['food-banner.jpg', 1800, 599, 'Signature dishes'],
  ['gallery-menu-display.jpg', 1152, 2048, 'Menu display with a branded table card'],
  ['promo-premium-order.jpg', 1254, 1254, 'Premium spread, minimum order 30 persons']
];
write({
  slug: 'gallery', cur: 'gallery',
  title: 'Gallery | Food, Menu Styling & Events | Iqbal Catering',
  desc: 'Photos and reels from Iqbal Catering events: kacchi, grills, banquet spreads and printed wedding menu cards from real Dhaka celebrations.',
  main: r => `
${pageHero(r, { crumbs: [['Gallery']], eyebrow: 'Symbol of client satisfaction', h1: 'Food, menu styling and event presentation.', lede: 'Moments from weddings and celebrations we have catered, and the food that made them. Tap any photo to see it larger.', cta: `<a class="btn btn-accent" href="#photos">See the photos</a><a class="btn btn-ghost" href="#reels">Watch the reels</a>`, img: 'gallery-mayeesha-nabil-menu.jpg', alt: "The printed menu card from Mayeesha and Nabil's wedding", w: 1152, h: 2048 })}
<section class="marble" id="photos" aria-label="Photo gallery">
  <div class="wrap">
    <div class="gallery">${GALLERY.map(([f, w, h, c]) => `<button type="button" data-caption="${c.replace(/"/g, '&quot;')}" aria-label="View photo: ${c.replace(/"/g, '&quot;')}"><img src="${r}media/img/${f}" alt="${c.replace(/"/g, '&quot;')}" width="${w}" height="${h}" loading="lazy"><figcaption aria-hidden="true">${c}</figcaption></button>`).join('')}</div>
  </div>
</section>
<div class="arcade to-emerald" aria-hidden="true"></div>
${reels(r)}
${deck(r, false)}
${ctaBand(r)}`
});

/* ================= CONTACT ================= */
write({
  slug: 'contact', cur: 'contact',
  title: 'Contact & Book | Request a Catering Quotation in Dhaka | Iqbal Catering',
  desc: 'Request a catering quotation from Iqbal Catering. Hotline 01713334040, WhatsApp +880 1716 554413. Offices in Adabor, Mohammadpur and DOHS Mohakhali, Dhaka.',
  main: r => `
${pageHero(r, { crumbs: [['Contact']], eyebrow: 'Contact Iqbal Catering', h1: 'Request a catering quotation in Dhaka.', lede: 'Plan the menu, quantity and service with our team. Build your dawat below, or call the hotline at 01713 334040.', cta: `<a class="btn btn-accent" href="#quote">Build your dawat</a><a class="btn btn-ghost" href="tel:+8801713334040">Call the hotline</a>`, img: 'biryani-close.jpg', alt: 'A close view of Iqbal Catering kacchi biryani', w: 1400, h: 933 })}
<section class="marble" style="padding-block:clamp(40px,5vw,60px)" aria-label="Quick contact">
  <div class="wrap">
    <div class="contact-grid" data-stagger style="--dummy:0">
      <a class="ccard" href="tel:+8801713334040" style="background:rgba(255,255,255,.6);border-color:rgba(126,97,40,.3)"><span class="eyebrow">Primary hotline</span><b style="color:var(--ink)">01713 334040</b><p>Call or SMS for orders and enquiries.</p></a>
      <a class="ccard" href="https://wa.me/${WA_NUM}" target="_blank" rel="noopener" style="background:rgba(255,255,255,.6);border-color:rgba(126,97,40,.3)"><span class="eyebrow">WhatsApp</span><b style="color:var(--ink)">+880 1716 554413</b><p>Send your menu, date and guest count.</p></a>
      <a class="ccard" href="mailto:iqbalcatering523@gmail.com" style="background:rgba(255,255,255,.6);border-color:rgba(126,97,40,.3)"><span class="eyebrow">Email</span><b class="email" style="color:var(--ink)">iqbalcatering523@gmail.com</b><p>Also iqbalcatering77@gmail.com</p></a>
    </div>
  </div>
</section>
<div class="arcade to-emerald" aria-hidden="true"></div>
<section id="quote" aria-label="Request a quotation">
  <div class="wrap">
    <div class="head" data-io>
      <span class="eyebrow">Request a quotation</span>
      <h2>Plan the menu, quantity and service.</h2>
      <p>Pick a set menu, add your guest count and date. Your dawat card fills in as you go, and one tap sends it to our team on WhatsApp.</p>
    </div>
    ${builder(r, true)}
  </div>
</section>
<div class="inlay" aria-hidden="true"></div>
<section aria-label="Complete contact information">
  <div class="wrap">
    <div class="head" data-io><span class="eyebrow">Complete contact information</span><h2>Reach our managing partners and offices.</h2></div>
    <div class="contact-grid" data-stagger>
      <div class="ccard"><span class="eyebrow">Head office</span><b>Adabor, Mohammadpur</b><p>Road-6/A, House-15/2, Nobodoy Housing Society, Adabor, Mohammadpur, Dhaka</p><p>Hotlines: <a href="tel:+8801713334040">01713 334040</a>, <a href="tel:+8801973334052">01973 334052</a>, <a href="tel:+8801713334025">01713 334025</a>, <a href="tel:+8801713334051">01713 334051</a></p></div>
      <div class="ccard"><span class="eyebrow">Corporate office</span><b>DOHS Mohakhali</b><p>Road-33, House-497, Flat-2B, DOHS Mohakhali, Dhaka</p><p>Phones: <a href="tel:+8801713334030">01713 334030</a>, <a href="tel:+8801713334070">01713 334070</a>, <a href="tel:+8801713334031">01713 334031</a></p></div>
      <div class="ccard"><span class="eyebrow">Follow us</span><b>@iqbalcateringbd</b><p><a href="https://www.facebook.com/IqbalcateringBangladesh" target="_blank" rel="noopener">Facebook</a> and <a href="https://www.instagram.com/iqbalcateringbd/" target="_blank" rel="noopener">Instagram</a></p><p>Website: iqbalcateringbd.com</p></div>
    </div>
    <div class="head" data-io style="margin:64px 0 30px"><span class="eyebrow">Owners and managing partners</span></div>
    <ul class="partners five" data-stagger>${PARTNERS.map(p => `<li class="partner">${jharokha(r, '', p.name, { w: p.w, h: p.h }).replace(`src="${r}media/img/"`, `src="${r}media/team/${p.img}"`)}<b>${p.name}</b><span>${p.role}</span><a class="phone" href="tel:${p.phone}">${p.phoneLabel}</a></li>`).join('')}</ul>
    <div class="map-frame" data-io style="margin-top:64px"><iframe title="Map of Iqbal Catering head office in Adabor, Mohammadpur, Dhaka" src="https://www.google.com/maps?q=Nobodoy+Housing+Society,+Adabor,+Mohammadpur,+Dhaka&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>
  </div>
</section>`
});

console.log('done');
