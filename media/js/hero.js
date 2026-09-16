(function(){
'use strict';
var hero = document.getElementById('top');
if(!hero) return;
function clamp(v,lo,hi){ return Math.min(hi, Math.max(lo, v)); }
function smooth(p,e0,e1){ var t = clamp((p-e0)/(e1-e0),0,1); return t*t*(3-2*t); }
function rng(seed){ var s = seed>>>0; return function(){ s = (s*1664525+1013904223)>>>0; return s/4294967296; }; }

/* ================= SPLIT HERO TEXT ================= */
Array.prototype.forEach.call(document.querySelectorAll('[data-split]'), function(el, i){
  var text = el.textContent.trim();
  var ems = (el.getAttribute('data-em') || '').split(',').filter(Boolean).map(Number);
  var r = rng(4211 + i*97);
  var words = text.split(/\s+/);
  el.textContent = '';
  var sr = document.createElement('span'); sr.className = 'sr-only'; sr.textContent = text; el.appendChild(sr);
  var vis = document.createElement('span'); vis.setAttribute('aria-hidden','true');
  words.forEach(function(w, wi){
    var ws = document.createElement('span'); ws.className = 'w' + (ems.indexOf(wi) > -1 ? ' em' : '');
    ws.style.setProperty('--th', (wi/words.length*0.5 + r()*0.05).toFixed(3));
    w.split('').forEach(function(ch){
      var cs = document.createElement('span'); cs.className = 'c'; cs.textContent = ch;
      cs.style.setProperty('--th', (r()*0.55).toFixed(3));
      cs.style.setProperty('--jx', ((r()*2-1)*30).toFixed(1)+'px');
      cs.style.setProperty('--jy', ((r()*2-1)*24).toFixed(1)+'px');
      cs.style.setProperty('--jr', ((r()*2-1)*28).toFixed(1)+'deg');
      ws.appendChild(cs);
    });
    vis.appendChild(ws);
    if(wi < words.length-1) vis.appendChild(document.createTextNode(' '));
  });
  el.appendChild(vis);
});

/* ================= SCRUB ENGINE ================= */
var stage = document.getElementById('stage');
var video = document.getElementById('heroVideo'), posterEl = document.getElementById('poster');
var staticHero = document.getElementById('staticHero'), cue = document.getElementById('cue');
var VIDEO_URL = 'media/video/hero-scrub.mp4';
var bands = Array.prototype.map.call(document.querySelectorAll('.band'), function(el){
  var r = el.getAttribute('data-range').split(',').map(Number);
  return {el:el, a:r[0], b:r[1], ramp:Number(el.getAttribute('data-ramp')) || Math.min(0.025,(r[1]-r[0])*0.35), op:-1, k:-1, on:null};
});
var target = 0, shown = 0, rafId = null, lastTick = 0, heroOnScreen = true;
var seekBusy = false, pendingTime = null, loadK = 0, loadRan = false, cueHidden = null, isLate = null;
var scrubOn = false, inited = false, staticBgSet = false;

function heroProgress(){
  var total = hero.offsetHeight - innerHeight;
  if(total <= 0) return 0;
  return clamp(-hero.getBoundingClientRect().top / total, 0, 1);
}
function updateCaptions(p){
  var last = bands.length - 1;
  bands.forEach(function(b, i){
    var f = Math.min(0.02, (b.b - b.a)/3);
    var inn = i === 0 ? 1 : smooth(p, b.a, b.a + f);
    var out = i === last ? 0 : smooth(p, b.b - f, b.b);
    var op = inn * (1 - out);
    if(Math.abs(op - b.op) > 0.004 || (op === 0 && b.op !== 0) || (op === 1 && b.op !== 1)){ b.op = op; b.el.style.opacity = op.toFixed(3); }
    var on = op > 0.001;
    if(on !== b.on){ b.on = on; b.el.classList.toggle('off', !on); }
    var k = clamp((p - b.a)/b.ramp, 0, 1);
    if(i === 0) k = Math.max(k, loadK);
    if(Math.abs(k - b.k) > 0.008 || (k === 1 && b.k !== 1) || (k === 0 && b.k !== 0)){ b.k = k; b.el.style.setProperty('--k', k.toFixed(3)); }
  });
  var hide = p > 0.03;
  if(hide !== cueHidden){ cueHidden = hide; cue.classList.toggle('hide', hide); }
  var late = p > 0.5;
  if(late !== isLate){ isLate = late; stage.classList.toggle('late', late); }
}
function failVideo(){
  document.getElementById('posterEnd').style.backgroundImage = "url('media/img/hero-ending.jpg')";
  stage.classList.add('video-failed');
}
function requestSeek(t){
  if(!video.duration || isNaN(video.duration)) return;
  if(seekBusy){ pendingTime = t; return; }
  seekBusy = true;
  try { video.currentTime = t; } catch(e){ seekBusy = false; }
}
video.addEventListener('seeked', function(){
  seekBusy = false;
  if(pendingTime !== null){ var t = pendingTime; pendingTime = null; requestSeek(t); }
});
video.addEventListener('error', function(){ seekBusy = false; pendingTime = null; if(video.getAttribute('src')) failVideo(); });

function tick(now){
  var dt = Math.min(100, now - (lastTick || now));
  lastTick = now;
  shown += (target - shown) * (1 - Math.pow(1 - 0.16, dt/16.667));
  if(Math.abs(target - shown) < 0.0005){ shown = target; rafId = null; lastTick = 0; }
  else rafId = requestAnimationFrame(tick);
  requestSeek(shown * (video.duration || 0));
  updateCaptions(shown);
}
function onScroll(){
  target = heroProgress();
  if(rafId === null && heroOnScreen) rafId = requestAnimationFrame(tick);
}
new IntersectionObserver(function(en){
  heroOnScreen = en[0].isIntersecting;
  if(heroOnScreen && scrubOn) onScroll();
}).observe(hero);

function loadTick(start){
  return function step(now){
    if(start === null) start = now;
    var t = clamp((now - start)/1100, 0, 1);
    loadK = 1 - Math.pow(1 - t, 3);
    updateCaptions(shown);
    if(t < 1) requestAnimationFrame(step);
  };
}
function loadVideo(){
  var ctrl = window.AbortController ? new AbortController() : null;
  var wd = setTimeout(function(){ if(ctrl) ctrl.abort(); }, 45000);
  fetch(VIDEO_URL, ctrl ? {signal: ctrl.signal} : {})
    .then(function(r){ if(!r.ok) throw new Error('video ' + r.status); return r.blob(); })
    .then(function(blob){
      clearTimeout(wd);
      video.addEventListener('loadeddata', function(){
        stage.classList.add('video-ready');
        requestSeek(heroProgress() * video.duration);
      }, {once:true});
      video.src = URL.createObjectURL(blob);
      video.load();
    })
    .catch(function(){ clearTimeout(wd); failVideo(); });
}
function initHeroOnce(){
  if(inited) return; inited = true;
  posterEl.style.backgroundImage = "url('media/img/hero-poster.jpg')";
  var started = false;
  function go(){ if(started) return; started = true; loadVideo(); }
  var img = new Image(); img.onload = go; img.onerror = go; img.src = 'media/img/hero-poster.jpg';
  setTimeout(go, 4000);
}
function enableScrub(){
  if(scrubOn) return; scrubOn = true;
  initHeroOnce();
  addEventListener('scroll', onScroll, {passive:true});
  bands.forEach(function(b){ b.op = -1; b.k = -1; b.on = null; });
  cueHidden = null; isLate = null;
  target = shown = heroProgress();
  if(!loadRan){ loadRan = true; requestAnimationFrame(loadTick(null)); }
  updateCaptions(shown);
  onScroll();
}
function disableScrub(){
  if(!staticBgSet){ staticBgSet = true; staticHero.style.backgroundImage = "url('media/img/hero-ending.jpg')"; }
  if(!scrubOn) return; scrubOn = false;
  removeEventListener('scroll', onScroll);
  if(rafId !== null){ cancelAnimationFrame(rafId); rafId = null; lastTick = 0; }
}
var GATES = [
  '(max-width: 720px)',
  '(orientation: portrait) and (max-width: 1024px)',
  '(orientation: portrait) and (pointer: coarse)',
  '(orientation: landscape) and (pointer: coarse) and (max-height: 560px)',
  '(prefers-reduced-motion: reduce)'
];
var MQLS = GATES.map(function(q){ return matchMedia(q); });
function applyHeroMode(){
  if(MQLS.some(function(m){ return m.matches; })) disableScrub(); else enableScrub();
}
MQLS.forEach(function(m){ m.addEventListener ? m.addEventListener('change', applyHeroMode) : m.addListener(applyHeroMode); });
applyHeroMode();
})();
