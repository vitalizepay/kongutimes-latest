'use strict';
let currentLang = 'ta';

function switchLang(lang) {
  currentLang = lang;
  document.querySelectorAll('.lang-btn').forEach(function(b){ b.classList.toggle('active', b.dataset.lang===lang); });
  document.documentElement.lang = lang;
  // Article blocks
  document.querySelectorAll('.article-lang-ta').forEach(function(el){ el.style.display=lang==='ta'?'block':'none'; });
  document.querySelectorAll('.article-lang-en').forEach(function(el){ el.style.display=lang==='en'?'block':'none'; });
  // Dates
  document.querySelectorAll('.date-ta').forEach(function(el){ el.style.display=lang==='ta'?'inline':'none'; });
  document.querySelectorAll('.date-en').forEach(function(el){ el.style.display=lang==='en'?'inline':'none'; });
  // Categories
  document.querySelectorAll('.cat-ta').forEach(function(el){ el.style.display=lang==='ta'?'inline':'none'; });
  document.querySelectorAll('.cat-en').forEach(function(el){ el.style.display=lang==='en'?'inline':'none'; });
  // District names
  document.querySelectorAll('.dist-ta').forEach(function(el){ el.style.display=lang==='ta'?'inline':'none'; });
  document.querySelectorAll('.dist-en').forEach(function(el){ el.style.display=lang==='en'?'inline':'none'; });
  // Read more buttons — update text
  document.querySelectorAll('.read-more-btn[aria-expanded="false"]').forEach(function(b){
    b.innerHTML = lang==='ta' ? 'மேலும் படிக்க ▼' : 'Read more ▼';
  });
  document.querySelectorAll('.read-more-btn[aria-expanded="true"]').forEach(function(b){
    b.innerHTML = lang==='ta' ? 'மறை ▲' : 'Show less ▲';
  });
  try { localStorage.setItem('kt-lang', lang); } catch(e) {}
}

function setActiveNav() {
  var p = window.location.pathname;
  document.querySelectorAll('.region-nav-inner a').forEach(function(link){
    link.classList.remove('active');
    var href = link.getAttribute('href');
    if (href && p.includes(href.replace('../',''))) link.classList.add('active');
  });
  if (p.endsWith('index.html') || p.endsWith('/')) {
    var h = document.querySelector('.region-nav-inner a[href="index.html"],.region-nav-inner a[href="./"],.region-nav-inner a[href="../index.html"]');
    if(h) h.classList.add('active');
  }
}

document.addEventListener('DOMContentLoaded', function(){
  setActiveNav();
  document.querySelectorAll('.lang-btn').forEach(function(btn){
    btn.addEventListener('click', function(){ switchLang(btn.dataset.lang); });
  });
  var saved = 'ta';
  try { saved = localStorage.getItem('kt-lang') || 'ta'; } catch(e) {}
  switchLang(saved);
});
