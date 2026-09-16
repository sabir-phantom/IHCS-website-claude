(function(){
'use strict';
var doc = document.documentElement;
doc.classList.add('js');
var RM = matchMedia('(prefers-reduced-motion: reduce)');
function clamp(v,lo,hi){ return Math.min(hi, Math.max(lo, v)); }
function $(s,c){ return (c||document).querySelector(s); }
function $$(s,c){ return Array.prototype.slice.call((c||document).querySelectorAll(s)); }
function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;'); }
var WA = '8801716554413';

/* ================= DATA (from iqbalcateringbd.com) ================= */
var MENUS = [
  {name:'Saffron Polao Selection', dishes:['Shahi Bresta Saffron Polao','Chicken Tandoori / Chicken Roast / Crumbed Fry','Mutton / Beef / Chicken Rezala or Korma','Chicken Jali Kabab / Shami Kabab','Seasonal Piece Salad','Shahi Zarda with Baby Sweets / Shahi Firni','Full Cream Yogurt Borhani','Box Pan, Napkin & Tissue','Mineral Water']},
  {name:'Dhakayya Morog Polao Selection', dishes:['Shahi Dhakayya Morog Polao','Beef Bhuna / Rezala / Beef Kaliya / Mutton Korma','Chicken Jali Kabab / Shami Kabab','Aloo-Bokharar Chutney','Seasonal Piece Salad','Shahi Zarda with Baby Sweets / Shahi Firni','Full Cream Yogurt Borhani','Box Pan, Napkin & Tissue','Mineral Water']},
  {name:'Shahi Mutton Kacchi Selection', dishes:['Shahi Mutton Kacchi Biryani (Basmati / Chinigura Rice)','Chicken Mosallam / Chicken Tandoori','Shahi Sheermali Naan / Chapati Roti','Beef Kaliya / Chicken Karahi Gosht / Mutton Korma','Aloo-Bokharar Chutney','Seasonal Piece Salad','Shahi Zarda with Baby Sweets / Shahi Firni','Full Cream Yogurt Borhani','Box Pan, Napkin & Tissue','Mineral Water']},
  {name:'Premium Kacchi & Grill Selection', dishes:['Shahi Mutton Kacchi Biryani (Basmati / Chinigura Rice)','Chicken Tandoori / Chicken Mosallam / Crumbed Fry','Shahi Sheermali Naan / Chapati Roti','Beef Kaliya / Beef Handy Kabab','Karahi Gosht (Beef or Chicken)','Fish Fillet with Lemon Butter Sauce','Aloo-Bokharar Chutney','Dressing Salad / Russian Salad','Malai Bundia','Mughal Gulab Jamun / Kheer Mohon / Sweet & Sour Doi','Full Cream Yogurt Borhani','Box Pan, Napkin & Tissue','Mineral Water']}
];

var yearEl = $('#year'); if(yearEl) yearEl.textContent = new Date().getFullYear();

/* ================= NAV ================= */
var nav = $('#nav'), navToggle = $('#navToggle'), navScrolled = null;
function navState(){ var s = scrollY > 40; if(s !== navScrolled){ navScrolled = s; nav.classList.toggle('scrolled', s); } }
addEventListener('scroll', navState, {passive:true}); navState();
function closeSubs(){ $$('.has-sub.open').forEach(function(li){ li.classList.remove('open'); var b = $('.sub-toggle', li); if(b) b.setAttribute('aria-expanded','false'); }); }
function closeNav(){ nav.classList.remove('open'); navToggle.setAttribute('aria-expanded','false'); navToggle.setAttribute('aria-label','Open menu'); }
navToggle.addEventListener('click', function(){
  var open = !nav.classList.contains('open');
  nav.classList.toggle('open', open);
  navToggle.setAttribute('aria-expanded', String(open));
  navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});
$$('.sub-toggle').forEach(function(b){
  b.addEventListener('click', function(e){
    e.stopPropagation();
    var li = b.closest('.has-sub'), open = !li.classList.contains('open');
    li.classList.toggle('open', open); b.setAttribute('aria-expanded', String(open));
  });
});
$('#navLinks').addEventListener('click', function(e){ if(e.target.closest('a')){ closeNav(); closeSubs(); } });
document.addEventListener('click', function(e){ if(!e.target.closest('.has-sub') && innerWidth > 1180) closeSubs(); });
addEventListener('keydown', function(e){ if(e.key === 'Escape'){ closeNav(); closeSubs(); } });

/* ================= REVEALS, COUNTERS ================= */
function countUp(el){
  if(el._counted) return; el._counted = true;
  var to = Number(el.getAttribute('data-count')), suf = el.getAttribute('data-suffix') || '';
  if(RM.matches){ el.textContent = to + suf; return; }
  var start = null, last = '';
  el.textContent = '0' + suf;
  requestAnimationFrame(function step(now){
    if(start === null) start = now;
    var t = clamp((now - start)/1300, 0, 1);
    var txt = Math.round(to * (1 - Math.pow(1 - t, 3))) + suf;
    if(txt !== last){ last = txt; el.textContent = txt; }
    if(t < 1) requestAnimationFrame(step);
  });
}
function reveal(el){
  if(el.classList.contains('in')) return;
  if(el.hasAttribute('data-stagger') && !RM.matches){
    var kids = el.children, n = kids.length;
    for(var i=0;i<n;i++) kids[i].style.transitionDelay = (Math.min(i,10)*80) + 'ms';
    setTimeout(function(){ for(var j=0;j<n;j++) kids[j].style.transitionDelay = ''; }, Math.min(n,10)*80 + 900);
  }
  el.classList.add('in');
  $$('[data-count]', el).forEach(countUp);
}
var io = new IntersectionObserver(function(entries){
  entries.forEach(function(en){ if(en.isIntersecting){ reveal(en.target); io.unobserve(en.target); } });
}, {threshold:0.14, rootMargin:'0px 0px -6% 0px'});
$$('[data-io],[data-stagger]').forEach(function(el){ io.observe(el); });

/* ================= MARQUEE ================= */
$$('.marquee').forEach(function(m){
  new IntersectionObserver(function(en){ m.classList.toggle('on', en[0].isIntersecting); }).observe(m);
});

/* ================= DECK ================= */
var deck = $('#deck');
if(deck){
  new IntersectionObserver(function(en, obs){
    if(!en[0].isIntersecting) return;
    deck.classList.add('in'); obs.disconnect();
    setTimeout(function(){ deck.classList.add('settled'); }, 1500);
  }, {threshold:0.25}).observe(deck);
  deck.addEventListener('click', function(e){
    var card = e.target.closest('.mcard'); if(!card) return;
    var was = card.classList.contains('front');
    $$('.mcard.front', deck).forEach(function(c){ c.classList.remove('front'); });
    if(!was) card.classList.add('front');
  });
}

/* ================= AMBIENT VIDEOS ================= */
var ambients = $$('video[data-ambient]');
/* Safari and every iOS browser cannot play transparent WebM; they keep the transparent poster */
var UA = navigator.userAgent;
var NO_ALPHA_VIDEO = /iP(hone|ad|od)/.test(UA) || (/Safari/.test(UA) && !/Chrome|Chromium|Edg|OPR|Firefox/.test(UA));
function driveAmbient(v){
  if(v.hasAttribute('data-alpha') && NO_ALPHA_VIDEO) return;
  if(v._vis && !RM.matches && !document.hidden){
    if(v.hasAttribute('data-once') && v._played) return;
    if(!v.getAttribute('src')){
      v.src = v.getAttribute('data-src');
      if(v.hasAttribute('data-once')) v.addEventListener('ended', function(){ v._played = true; }, {once:true});
    }
    var pr = v.play(); if(pr && pr.catch) pr.catch(function(){});
  } else if(!v.paused) v.pause();
}
var ambIO = new IntersectionObserver(function(entries){
  entries.forEach(function(en){ en.target._vis = en.isIntersecting; driveAmbient(en.target); });
}, {threshold:0.35});
ambients.forEach(function(v){ ambIO.observe(v); });

/* ================= REELS ================= */
var reels = $$('.reel');
var PLAY = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l13-7.5z"/></svg>';
var PAUSE = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg>';
var reelsMuted = false;
function applyMute(){
  reels.forEach(function(reel){
    $('video', reel).muted = reelsMuted;
    var mb = $('.reel-mute', reel);
    if(mb){ mb.setAttribute('aria-pressed', String(reelsMuted)); mb.setAttribute('aria-label', reelsMuted ? 'Unmute reels' : 'Mute reels'); }
  });
}
reels.forEach(function(reel){
  var mb = $('.reel-mute', reel);
  if(mb) mb.addEventListener('click', function(){ reelsMuted = !reelsMuted; applyMute(); });
});
reels.forEach(function(reel){
  var v = $('video', reel), btn = $('.reel-ui', reel), bar = $('.reel-bar i', reel);
  var title = $('.reel-title', reel).textContent, lastW = -1, lastT = 0;
  function setUI(playing){
    reel.classList.toggle('playing', playing);
    btn.setAttribute('aria-label', (playing ? 'Pause reel: ' : 'Play reel: ') + title);
    $('.reel-play', btn).innerHTML = playing ? PAUSE : PLAY;
  }
  btn.addEventListener('click', function(){
    if(v.paused){
      reels.forEach(function(o){ var ov = $('video', o); if(ov !== v && !ov.paused) ov.pause(); });
      if(!v.getAttribute('src')) v.src = v.getAttribute('data-src');
      v.muted = reelsMuted;
      var pr = v.play(); if(pr && pr.catch) pr.catch(function(){ setUI(false); });
    } else v.pause();
  });
  v.addEventListener('play', function(){ setUI(true); });
  v.addEventListener('pause', function(){ setUI(false); });
  v.addEventListener('ended', function(){ setUI(false); });
  v.addEventListener('timeupdate', function(){
    var now = performance.now(); if(now - lastT < 100) return; lastT = now;
    var w = v.duration ? Math.round(v.currentTime / v.duration * 1000)/1000 : 0;
    if(w !== lastW){ lastW = w; bar.style.transform = 'scaleX(' + w + ')'; }
  });
});

/* ================= DISH LISTS ================= */
function renderDishes(ul, list, animate){
  ul.classList.remove('swap');
  ul.innerHTML = list.map(function(d, i){ return '<li style="animation-delay:'+(i*45)+'ms">'+esc(d)+'</li>'; }).join('');
  if(animate && !RM.matches){ void ul.offsetWidth; ul.classList.add('swap'); }
}

/* ================= SET MENU TABS ================= */
var tabs = $('#tabs');
if(tabs){
  var menuIdx = 0, priceLink = $('#priceMenu');
  tabs.innerHTML = MENUS.map(function(m, i){
    return '<button class="tab" role="tab" type="button" id="tab'+i+'" aria-controls="menuPanel" aria-selected="'+(i===0)+'" tabindex="'+(i===0?0:-1)+'" data-i="'+i+'"><span class="tab-num">0'+(i+1)+'</span><span class="tab-name">'+esc(m.name)+'</span></button>';
  }).join('');
  var showMenu = function(i, animate){
    menuIdx = i;
    $$('.tab', tabs).forEach(function(t, j){ t.setAttribute('aria-selected', String(j===i)); t.tabIndex = j===i ? 0 : -1; });
    $('#menuPanel').setAttribute('aria-labelledby', 'tab'+i);
    $('#menuKicker').textContent = 'Menu ' + (i+1);
    $('#menuTitle').textContent = MENUS[i].name;
    renderDishes($('#menuDishes'), MENUS[i].dishes, animate);
    if(priceLink) priceLink.href = priceLink.getAttribute('data-base') + '?menu=' + i + '#quote';
  };
  tabs.addEventListener('click', function(e){ var t = e.target.closest('.tab'); if(t) showMenu(Number(t.getAttribute('data-i')), true); });
  tabs.addEventListener('keydown', function(e){
    var dir = (e.key === 'ArrowDown' || e.key === 'ArrowRight') ? 1 : (e.key === 'ArrowUp' || e.key === 'ArrowLeft') ? -1 : 0;
    if(!dir) return; e.preventDefault();
    var n = (menuIdx + dir + MENUS.length) % MENUS.length; showMenu(n, true); $('#tab'+n).focus();
  });
  showMenu(0, false);
}

/* ================= BUILD YOUR DAWAT ================= */
var builder = $('#builder');
var dcGuests = null, guestRaf = null, guestShown = 250, guestTarget = 250;
if(builder){
  var params = new URLSearchParams(location.search);
  var bMenu = parseInt(params.get('menu'), 10);
  if(isNaN(bMenu) || bMenu < 0 || bMenu > 3) bMenu = 2;
  var pills = $('#menuPills');
  pills.innerHTML = MENUS.map(function(m, i){
    return '<label class="pill"><input type="radio" name="menu" value="'+i+'"'+(i===bMenu?' checked':'')+'><span>'+esc(m.name)+'</span></label>';
  }).join('');
  var qG = $('#qGuests'), qGN = $('#qGuestsNum'), qDate = $('#qDate'), qVenue = $('#qVenue'), qEvent = $('#qEvent');
  dcGuests = $('#dcGuests');
  var dcDishes = $('#dcDishes');
  var setBuilderMenu = function(i, animate){
    bMenu = i;
    $('#dcMenu').textContent = MENUS[i].name;
    renderDishes(dcDishes, MENUS[i].dishes, animate);
  };
  pills.addEventListener('change', function(e){ if(e.target.name === 'menu') setBuilderMenu(Number(e.target.value), true); });
  var animateGuests = function(){
    if(RM.matches){ guestShown = guestTarget; dcGuests.textContent = guestTarget; return; }
    if(guestRaf) return;
    var last = null;
    guestRaf = requestAnimationFrame(function step(now){
      var dt = Math.min(100, now - (last || now)); last = now;
      guestShown += (guestTarget - guestShown) * (1 - Math.pow(1 - 0.18, dt/16.667));
      if(Math.abs(guestTarget - guestShown) < 0.5){ guestShown = guestTarget; guestRaf = null; }
      var txt = String(Math.round(guestShown));
      if(dcGuests.textContent !== txt) dcGuests.textContent = txt;
      if(guestRaf) guestRaf = requestAnimationFrame(step);
    });
  };
  qG.addEventListener('input', function(){ qGN.value = qG.value; guestTarget = Number(qG.value); animateGuests(); });
  qGN.addEventListener('input', function(){
    var n = Math.max(0, Math.round(Number(qGN.value) || 0));
    qG.value = clamp(n, 30, 2000); guestTarget = n; animateGuests();
  });
  var ev = params.get('event');
  if(ev){ $$('option', qEvent).forEach(function(o){ if(o.value === ev) qEvent.value = ev; }); }
  var syncEvent = function(){ $('#dcEvent').textContent = qEvent.value; };
  qEvent.addEventListener('change', syncEvent); syncEvent();
  qDate.addEventListener('input', function(){
    var d = qDate.value ? new Date(qDate.value + 'T12:00:00') : null;
    $('#dcDate').textContent = d && !isNaN(d) ? d.toLocaleDateString('en-GB', {day:'numeric', month:'long', year:'numeric'}) : 'To be decided';
  });
  qVenue.addEventListener('input', function(){ $('#dcVenue').textContent = qVenue.value.trim() || 'To be decided'; });
  setBuilderMenu(bMenu, false);

  $('#quoteForm').addEventListener('submit', function(e){
    e.preventDefault();
    var name = $('#qName').value.trim(), phone = $('#qPhone').value.trim();
    var okName = !!name, okPhone = phone.replace(/\D/g,'').length >= 6;
    $('#fName').classList.toggle('bad', !okName); $('#fPhone').classList.toggle('bad', !okPhone);
    if(!okName){ $('#qName').focus(); return; }
    if(!okPhone){ $('#qPhone').focus(); return; }
    var val = function(id){ var el = $('#'+id); return el ? el.value.trim() : ''; };
    var guests = Math.max(30, Math.round(Number(qGN.value) || 30));
    var lines = [
      'Assalamu alaikum Iqbal Catering, I would like a quotation.',
      '',
      'Menu: ' + MENUS[bMenu].name,
      'Guests: ' + guests,
      'Event: ' + qEvent.value,
      'Date: ' + $('#dcDate').textContent,
      'Venue: ' + (qVenue.value.trim() || 'To be decided')
    ];
    [['qMeal','Meal time'],['qStyle','Service style'],['qBudget','Estimated budget'],['qNotes','Other requirements']].forEach(function(f){
      var v = val(f[0]); if(v) lines.push(f[1] + ': ' + v);
    });
    lines.push('', 'Name: ' + name, 'Phone: ' + phone);
    if(val('qEmail')) lines.push('Email: ' + val('qEmail'));
    window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent(lines.join('\n')), '_blank', 'noopener');
    builder.classList.add('sent');
  });
}

/* ================= GALLERY LIGHTBOX ================= */
var gallery = $('.gallery');
if(gallery){
  var items = $$('button', gallery), cur = 0, lastFocus = null;
  var lb = document.createElement('div');
  lb.className = 'lightbox'; lb.setAttribute('role','dialog'); lb.setAttribute('aria-modal','true'); lb.setAttribute('aria-label','Photo viewer');
  lb.innerHTML = '<img alt=""><p></p>'
    + '<button class="lb-btn lb-close" type="button" aria-label="Close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 6l12 12M18 6L6 18"/></svg></button>'
    + '<button class="lb-btn lb-prev" type="button" aria-label="Previous photo"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M15 5l-7 7 7 7"/></svg></button>'
    + '<button class="lb-btn lb-next" type="button" aria-label="Next photo"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 5l7 7-7 7"/></svg></button>';
  document.body.appendChild(lb);
  var lbImg = $('img', lb), lbCap = $('p', lb);
  var show = function(i){
    cur = (i + items.length) % items.length;
    var it = items[cur], im = $('img', it);
    lbImg.src = im.getAttribute('src'); lbImg.alt = im.alt;
    lbCap.textContent = it.getAttribute('data-caption') || '';
  };
  var openLb = function(i){ lastFocus = document.activeElement; show(i); lb.classList.add('open'); $('.lb-close', lb).focus(); };
  var closeLb = function(){ lb.classList.remove('open'); if(lastFocus) lastFocus.focus(); };
  items.forEach(function(it, i){ it.addEventListener('click', function(){ openLb(i); }); });
  $('.lb-close', lb).addEventListener('click', closeLb);
  $('.lb-prev', lb).addEventListener('click', function(){ show(cur - 1); });
  $('.lb-next', lb).addEventListener('click', function(){ show(cur + 1); });
  lb.addEventListener('click', function(e){ if(e.target === lb) closeLb(); });
  addEventListener('keydown', function(e){
    if(!lb.classList.contains('open')) return;
    if(e.key === 'Escape') closeLb();
    else if(e.key === 'ArrowLeft') show(cur - 1);
    else if(e.key === 'ArrowRight') show(cur + 1);
    else if(e.key === 'Tab'){
      var f = $$('.lb-btn', lb), first = f[0], lastB = f[f.length-1];
      if(e.shiftKey && document.activeElement === first){ e.preventDefault(); lastB.focus(); }
      else if(!e.shiftKey && document.activeElement === lastB){ e.preventDefault(); first.focus(); }
    }
  });
}

/* ================= REDUCED MOTION, LIVE BOTH WAYS ================= */
function pinToFinalStates(){
  $$('[data-io],[data-stagger]').forEach(function(el){ el.classList.add('in'); io.unobserve(el); });
  $$('[data-count]').forEach(function(el){ el._counted = true; el.textContent = el.getAttribute('data-count') + (el.getAttribute('data-suffix') || ''); });
  if(deck) deck.classList.add('in','settled');
  ambients.forEach(function(v){ if(!v.paused) v.pause(); });
  if(guestRaf){ cancelAnimationFrame(guestRaf); guestRaf = null; }
  if(dcGuests){ guestShown = guestTarget; dcGuests.textContent = guestTarget; }
}
function unpinFinalStates(){ ambients.forEach(driveAmbient); }
function onRM(e){ if(e.matches) pinToFinalStates(); else unpinFinalStates(); }
RM.addEventListener ? RM.addEventListener('change', onRM) : RM.addListener(onRM);
if(RM.matches) pinToFinalStates();

document.addEventListener('visibilitychange', function(){
  document.body.classList.toggle('paused', document.hidden);
  ambients.forEach(driveAmbient);
});

requestAnimationFrame(function(){ document.body.classList.add('ready'); });
})();
