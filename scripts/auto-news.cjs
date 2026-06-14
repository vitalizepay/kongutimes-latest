#!/usr/bin/env node
'use strict';

const { DISTRICT_SOURCES, detectCategory } = require('./rss-sources.cjs');
const { fetchFeed, fetchArticleText, deduplicate, filterByDistrict, filterRecent } = require('./scraper.cjs');
const { rewriteArticle } = require('./ai-rewriter.cjs');
const { injectIntoRegionPage, updateHomepage } = require('./html-injector.cjs');
const { generateSitemap, generateRobots } = require('./sitemap-gen.cjs');

const ARTICLES_PER_DISTRICT = 5;   // 5 full articles per district
const MIN_TEXT_LENGTH = 80;
const AI_DELAY_MS = 2000; // 3 parallel calls per article          // 3 sec between AI calls to avoid rate limits

// Junk filters — skip clickbait/irrelevant headlines
const JUNK_PATTERNS = [
  /power.?cut|மின்.?தடை|மின்.?வெட்டு/i,   // Power cut notices (repetitive)
  /பவர்.?கட்/i,
  /tasmac|டாஸ்மாக்/i,                        // Tasmac (liquor shop) news
  /reel|reels|tiktok/i,
  /actress|actor|cinema|movie|film|serial|நடிகை|நடிகர்|சினிமா/i,  // Entertainment
  /cricket|ipl|match|player/i,               // Sports (unless category is sports)
  /gold price|petrol price|diesel price/i,
];

function isJunk(title, category) {
  if (category === 'Sports') return false; // Don't filter sports in sports category
  return JUNK_PATTERNS.some(p => p.test(title));
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function collectArticles(district) {
  console.log(`\n📡 Fetching: ${district.name}...`);
  const results = await Promise.all(district.feeds.map(url => fetchFeed(url)));
  let items = deduplicate(results.flat());
  console.log(`  Total: ${items.length} items`);

  // Filter to last 72 hours (wider window to ensure enough articles)
  // Dharmapuri gets wider window as it has less frequent news
  const hoursBack = district.slug === 'dharmapuri' ? 120 : 72;
  items = filterRecent(items, hoursBack);
  console.log(`  Recent 72h: ${items.length}`);

  // Filter by district keywords
  items = filterByDistrict(items, district.keywords);
  console.log(`  Relevant: ${items.length}`);

  // Remove junk
  items = items.filter(item => !isJunk(item.title, detectCategory(item.title)));
  console.log(`  After junk filter: ${items.length}`);

  // Fetch full text for each
  const withText = [];
  for (const item of items) {
    if (withText.length >= ARTICLES_PER_DISTRICT * 3) break; // Fetch 3x buffer

    if (item.description && item.description.length >= MIN_TEXT_LENGTH) {
      withText.push({ ...item, sourceText: item.description });
      continue;
    }

    const { text, ogImage } = await fetchArticleText(item.url);
    if (text && text.length >= MIN_TEXT_LENGTH) {
      withText.push({ ...item, sourceText: text, image: item.image || ogImage });
    }
    await sleep(300);
  }

  console.log(`  With content: ${withText.length}`);
  return withText;
}

async function rewriteArticles(items, district) {
  console.log(`\n✍️  Rewriting: ${district.name}...`);
  const done = [];
  const seen = new Set(); // Deduplicate by topic

  for (const item of items) {
    if (done.length >= ARTICLES_PER_DISTRICT) break;

    // Skip near-duplicate topics
    const key = item.title.toLowerCase().replace(/[^a-z0-9]/g,'').substring(0,30);
    if (seen.has(key)) { console.log(`  ⊘ Skip duplicate: ${item.title.substring(0,50)}`); continue; }
    seen.add(key);

    try {
      console.log(`  → "${item.title.substring(0,65)}"`);
      const cat = detectCategory(item.title + ' ' + (item.sourceText||''));
      const article = await rewriteArticle(item.sourceText, district.name, district.tamil, cat);

      if (!article.headline_ta || !article.body_ta || !article.body_en) throw new Error('Incomplete');
      if (article.body_ta.length < 400) throw new Error(`Tamil too short: ${article.body_ta.length} chars`);
      if (article.body_en.length < 400) throw new Error(`English too short: ${article.body_en.length} chars`);

      article.image = item.image || null;
      done.push(article);
      console.log(`  ✓ ${article.body_ta.length}ta/${article.body_en.length}en chars — "${article.headline_en.substring(0,55)}"`);
      await sleep(AI_DELAY_MS);
    } catch(e) {
      console.log(`  ✗ ${e.message}`);
    }
  }

  console.log(`  Done: ${done.length}/${ARTICLES_PER_DISTRICT} articles`);
  return done;
}

async function main() {
  console.log('\n🗞️  The Kongu Times — News Pipeline');
  console.log('='.repeat(50));
  console.log(`Started: ${new Date().toISOString()}\n`);

  if (!process.env.OPENROUTER_API_KEY) { console.error('❌ OPENROUTER_API_KEY not set'); process.exit(1); }

  const date = new Date();
  const allArticles = {};

  for (const district of Object.values(DISTRICT_SOURCES)) {
    try {
      const collected = await collectArticles(district);
      if (!collected.length) { console.log(`  ⚠️  No articles found for ${district.name}`); continue; }

      const articles = await rewriteArticles(collected, district);
      if (!articles.length) { console.log(`  ⚠️  No rewrites for ${district.name}`); continue; }

      allArticles[district.slug] = articles;
      console.log(`\n💉 Injecting → ${district.slug}.html`);
      injectIntoRegionPage(district.slug, articles, date);
    } catch(e) {
      console.error(`\n❌ ${district.name}: ${e.message}`);
    }
  }

  console.log('\n🏠 Updating homepage...');
  updateHomepage(allArticles, date);

  console.log('\n🗺️  Sitemap...');
  generateSitemap(date);
  generateRobots();

  const total = Object.values(allArticles).reduce((s,a) => s+a.length, 0);
  const avgLen = total > 0
    ? Math.round(Object.values(allArticles).flat().reduce((s,a) => s + (a.body_en||'').trim().split(/\s+/).length, 0) / total)
    : 0;
  console.log('\n' + '='.repeat(50));
  console.log(`✅ Complete! Districts: ${Object.keys(allArticles).length}/7`);
  console.log(`   Articles: ${total} | Avg length: ~${avgLen} words`);
  console.log(`   Finished: ${new Date().toISOString()}`);
}

main().catch(e => { console.error('\n❌ Fatal:', e); process.exit(1); });
