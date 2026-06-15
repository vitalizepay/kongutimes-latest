'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

function dateEN(d) { return d.toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'}); }
function dateTA(d) {
  const m=['ஜனவரி','பிப்ரவரி','மார்ச்','ஏப்ரல்','மே','ஜூன்','ஜூலை','ஆகஸ்ட்','செப்டம்பர்','அக்டோபர்','நவம்பர்','டிசம்பர்'];
  return `${d.getDate()} ${m[d.getMonth()]} ${d.getFullYear()}`;
}

function replaceBlock(html, startMark, endMark, newContent) {
  const si = html.indexOf(startMark);
  const ei = html.indexOf(endMark);
  if (si === -1 || ei === -1) return null;
  return html.substring(0, si + startMark.length) + newContent + html.substring(ei);
}

// Each article carries its own publishedAt timestamp (set when first generated)
function buildArticle(a, idx) {
  const d = a.publishedAt ? new Date(a.publishedAt) : new Date();
  const dEN = dateEN(d), dTA = dateTA(d);
  const id = `art${idx}`;
  const img = a.image ? `<img class="article-featured-img" src="${a.image}" alt="" loading="lazy" onerror="this.style.display='none'"/>` : '';
  const preTA = (a.body_ta||'').replace(/\n/g,' ').substring(0,220);
  const preEN = (a.body_en||'').replace(/\n/g,' ').substring(0,220);
  const fullTA = (a.body_ta||'').split('\n').filter(p=>p.trim()).map(p=>`<p>${p}</p>`).join('');
  const fullEN = (a.body_en||'').split('\n').filter(p=>p.trim()).map(p=>`<p>${p}</p>`).join('');

  return `
<article class="news-article" id="${id}" itemscope itemtype="https://schema.org/NewsArticle">
  <meta itemprop="datePublished" content="${d.toISOString()}"/>
  <meta itemprop="author" content="The Kongu Times"/>
  ${img}
  <div class="article-lang-ta">
    <span class="article-label">${a.category||'General'}</span>
    <h2 class="article-title" itemprop="headline">${a.headline_ta||''}</h2>
    <div class="article-preview article-preview-ta">${preTA}...</div>
    <div class="article-full article-full-ta" style="display:none">${fullTA}</div>
  </div>
  <div class="article-lang-en" style="display:none">
    <span class="article-label">${a.category||'General'}</span>
    <h2 class="article-title">${a.headline_en||''}</h2>
    <div class="article-preview article-preview-en">${preEN}...</div>
    <div class="article-full article-full-en" style="display:none">${fullEN}</div>
  </div>
  <div class="article-meta">
    <span>📅 <span class="date-ta">${dTA}</span><span class="date-en" style="display:none">${dEN}</span></span>
    <span class="meta-dot">·</span><span>🏷 ${a.category||'General'}</span>
    <span class="meta-dot">·</span>
    <button class="read-more-btn" onclick="toggleArticle('${id}',this)" aria-expanded="false">மேலும் படிக்க ▼</button>
  </div>
  <div class="ad-slot"><!-- ADSENSE --></div>
</article>`;
}

// articles = full history array for this district (already newest-first, max 8)
function injectIntoRegionPage(slug, articles) {
  const fp = path.join(ROOT, 'regions', `${slug}.html`);
  if (!fs.existsSync(fp)) { console.log(`  ✗ Missing: ${slug}.html`); return false; }
  let html = fs.readFileSync(fp, 'utf8');

  const arts = articles.map((a,i) => buildArticle(a,i+1)).join('\n<hr class="article-divider"/>\n');
  const result = replaceBlock(html, '<!--AUTO-NEWS-START-->', '<!--AUTO-NEWS-END-->', '\n' + arts + '\n');
  if (!result) { console.log(`  ✗ No markers in ${slug}.html`); return false; }
  html = result;

  // Ticker from this district's latest articles
  const tickerItems = articles.slice(0,4).flatMap(a => [
    a.headline_ta ? `<span class="ticker-item">${a.headline_ta}</span>` : '',
    a.headline_en ? `<span class="ticker-item">${a.headline_en}</span>` : '',
  ]).filter(Boolean);
  const ticker = [...tickerItems,...tickerItems].join('');
  const tr = replaceBlock(html, '<!--TICKER-START-->', '<!--TICKER-END-->', ticker);
  if (tr) html = tr;

  // Title + meta from newest article
  if (articles[0]) {
    html = html.replace(/<title[^>]*>[^<]*<\/title>/, `<title>${articles[0].headline_en} | The Kongu Times</title>`);
    const desc = (articles[0].meta_description_en||'').replace(/"/g,'&quot;');
    html = html.replace(/content="Latest [^"]*news[^"]*"/, `content="${desc}"`);
  }

  fs.writeFileSync(fp, html, 'utf8');
  console.log(`  ✓ Injected ${articles.length} articles → ${slug}.html`);
  return true;
}

// history = { slug: [article, article, ...] } — each article has publishedAt
function updateHomepage(history, date) {
  const fp = path.join(ROOT, 'index.html');
  let html = fs.readFileSync(fp, 'utf8');
  const dEN = dateEN(date), dTA = dateTA(date);

  // Latest article per district (for grid + ranking)
  const latestPerDistrict = Object.entries(history)
    .filter(([_, arts]) => arts && arts.length > 0)
    .map(([slug, arts]) => ({ slug, art: arts[0] }));

  // Sort by publishedAt desc to find overall top story
  const sorted = [...latestPerDistrict].sort((a,b) =>
    new Date(b.art.publishedAt||0) - new Date(a.art.publishedAt||0)
  );

  const top = sorted[0]?.art;
  const topSlug = sorted[0]?.slug;

  // Ticker — latest 2 articles from each district
  const ti = Object.values(history).flat().filter(Boolean).flatMap(a=>[
    a.headline_ta?`<span class="ticker-item">${a.headline_ta}</span>`:'',
    a.headline_en?`<span class="ticker-item">${a.headline_en}</span>`:'',
  ]).filter(Boolean);
  const ticker = [...ti,...ti].join('');
  let r = replaceBlock(html,'<!--TICKER-START-->','<!--TICKER-END-->',ticker);
  if (r) html = r;

  // Hero — overall most recent article
  if (top) {
    const img = top.image ? `<img class="hero-img" src="${top.image}" alt="" onerror="this.src='kongu-map.jpg'"/>` : `<img class="hero-img" src="kongu-map.jpg" alt="Kongu Nadu"/>`;
    const tDate = top.publishedAt ? new Date(top.publishedAt) : date;
    const hero = `
    <div class="hero-label"><span class="live-dot"></span>
      <span class="hero-date-ta">இன்றைய தலைச்செய்தி · ${dateTA(tDate)}</span>
      <span class="hero-date-en" style="display:none">Today's Top Story · ${dateEN(tDate)}</span>
    </div>
    ${img}
    <div class="hero-lang-ta">
      <h1 class="hero-headline">${top.headline_ta||''}</h1>
      <p class="hero-lead">${(top.body_ta||'').substring(0,280)}...</p>
    </div>
    <div class="hero-lang-en" style="display:none">
      <h1 class="hero-headline">${top.headline_en||''}</h1>
      <p class="hero-lead">${(top.body_en||'').substring(0,280)}...</p>
    </div>
    <div class="hero-meta">
      <span>📅 <span class="hero-date-ta">${dateTA(tDate)}</span><span class="hero-date-en" style="display:none">${dateEN(tDate)}</span></span>
      <span>${top.category||''}</span><span>✍️ The Kongu Times</span>
    </div>`;
    r = replaceBlock(html,'<!--HERO-START-->','<!--HERO-END-->',hero);
    if (r) html = r;
  }

  // Side articles — next 2 most recent from different districts
  const sideArts = sorted.slice(1,3);
  const sideHTML = sideArts.map(({slug,art}) => {
    const aDate = art.publishedAt ? new Date(art.publishedAt) : date;
    return `
  <article class="hero-side" onclick="location.href='regions/${slug}.html'" style="cursor:pointer">
    <div class="side-label">${slug.charAt(0).toUpperCase()+slug.slice(1)} · ${art.category||''}</div>
    <div class="hero-lang-ta"><h2 class="side-title">${art.headline_ta||''}</h2><p class="side-body">${(art.body_ta||'').substring(0,120)}...</p></div>
    <div class="hero-lang-en" style="display:none"><h2 class="side-title">${art.headline_en||''}</h2><p class="side-body">${(art.body_en||'').substring(0,120)}...</p></div>
    <div class="side-meta">📅 <span class="hero-date-ta">${dateTA(aDate)}</span><span class="hero-date-en" style="display:none">${dateEN(aDate)}</span> · 🏷 ${art.category||''}</div>
  </article>`;
  }).join('\n');
  r = replaceBlock(html,'<!--SIDE-START-->','<!--SIDE-END-->',sideHTML);
  if (r) html = r;

  // News grid — one card per district (latest article), all 7 districts
  const cards = latestPerDistrict.map(({slug, art}) => {
    const aDate = art.publishedAt ? new Date(art.publishedAt) : date;
    const dname = slug.charAt(0).toUpperCase()+slug.slice(1);
    return `
  <article class="news-card" onclick="location.href='regions/${slug}.html'">
    <div class="nc-region">${dname} · ${art.category||''}</div>
    <div class="nc-lang-ta">
      <h3 class="nc-title">${art.headline_ta||''}</h3>
      <p class="nc-body">${(art.meta_description_ta||'').substring(0,130)}</p>
    </div>
    <div class="nc-lang-en" style="display:none">
      <h3 class="nc-title">${art.headline_en||''}</h3>
      <p class="nc-body">${(art.meta_description_en||'').substring(0,130)}</p>
    </div>
    <div class="nc-meta">📅 <span class="nc-date-ta">${dateTA(aDate)}</span><span class="nc-date-en" style="display:none">${dateEN(aDate)}</span> <span class="meta-dot">·</span> 🏷 ${art.category||''}</div>
  </article>`;
  });

  if (cards.length === 0) {
    console.log('  ⚠️  No news cards generated — history may be empty');
  }
  r = replaceBlock(html,'<!--NEWSGRID-START-->','<!--NEWSGRID-END-->',cards.join('\n'));
  if (r) html = r;
  else console.log('  ⚠️  NEWSGRID markers not found in index.html');

  // Update header date (current run date, not article date — shows last-updated)
  html = html.replace(/VOICE OF THE KONGU REGION[^<"']*/g, `VOICE OF THE KONGU REGION · ${dEN}`);
  html = html.replace(/>Updated daily</, `>${dEN}<`);

  const homeExt = `<script>
(function(){
var os=window.switchLang;
window.switchLang=function(l){
  os&&os(l);
  ['nc-lang-ta','nc-lang-en','hero-lang-ta','hero-lang-en'].forEach(function(c){
    document.querySelectorAll('.'+c).forEach(function(el){
      el.style.display=(c.endsWith('-en')?(l==='en'):(l==='ta'))?'block':'none';
    });
  });
  ['hero-date-ta','hero-date-en','nc-date-ta','nc-date-en'].forEach(function(c){
    document.querySelectorAll('.'+c).forEach(function(el){
      el.style.display=(c.endsWith('-en')?(l==='en'):(l==='ta'))?'inline':'none';
    });
  });
  var lh=document.getElementById('latest-heading-ta'),eh=document.getElementById('latest-heading-en');
  if(lh)lh.style.display=l==='ta'?'block':'none';
  if(eh)eh.style.display=l==='en'?'block':'none';
};
})();
</script>`;

  if (html.includes('window.switchLang=function')) {
    html = html.replace(/<script>\s*\(function\(\)\{[\s\S]*?window\.switchLang[\s\S]*?\}\)\(\);\s*<\/script>/, homeExt);
  } else {
    html = html.replace('</body>', homeExt + '\n</body>');
  }

  fs.writeFileSync(fp, html, 'utf8');
  const total = Object.values(history).flat().length;
  console.log(`  ✓ Updated index.html — ${total} total articles across ${latestPerDistrict.length} districts`);
}

module.exports = { injectIntoRegionPage, updateHomepage };
