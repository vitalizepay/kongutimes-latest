'use strict';
const fs = require('fs');
const path = require('path');

const SEEN_FILE = path.join(__dirname, '..', 'data', 'published-urls.json');
const MAX_AGE_DAYS = 14; // Forget URLs older than this to keep file small

function loadSeen() {
  try {
    const data = JSON.parse(fs.readFileSync(SEEN_FILE, 'utf8'));
    const cutoff = Date.now() - MAX_AGE_DAYS * 24 * 60 * 60 * 1000;
    const pruned = {};
    for (const [url, ts] of Object.entries(data)) {
      if (ts >= cutoff) pruned[url] = ts;
    }
    return pruned;
  } catch (e) {
    return {};
  }
}

function saveSeen(seenMap) {
  const dir = path.dirname(SEEN_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(SEEN_FILE, JSON.stringify(seenMap, null, 2), 'utf8');
}

function filterUnseen(items, seenMap) {
  return items.filter(item => !seenMap[item.url]);
}

function markSeen(seenMap, url) {
  seenMap[url] = Date.now();
}

// --- Article history (rolling window per district, for region pages + homepage) ---
const HISTORY_FILE = path.join(__dirname, '..', 'data', 'article-history.json');
const MAX_ARTICLES_PER_DISTRICT = 8;

function loadHistory() {
  try {
    return JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
  } catch (e) {
    return {};
  }
}

function saveHistory(history) {
  const dir = path.dirname(HISTORY_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2), 'utf8');
}

// Prepend new articles to a district's history, trim to max length
function addToHistory(history, slug, newArticles, publishedAt) {
  const stamped = newArticles.map(a => ({ ...a, publishedAt }));
  const existing = history[slug] || [];
  history[slug] = [...stamped, ...existing].slice(0, MAX_ARTICLES_PER_DISTRICT);
  return history[slug];
}

// One-time migration: convert old last-articles.json (single batch per district)
// into the new article-history.json format (array per district)
function migrateOldFormat() {
  const oldFile = path.join(__dirname, '..', 'data', 'last-articles.json');
  const newFile = HISTORY_FILE;
  if (fs.existsSync(newFile)) return; // already migrated
  try {
    const old = JSON.parse(fs.readFileSync(oldFile, 'utf8'));
    if (!old || Object.keys(old).length === 0) return;
    const migrated = {};
    const now = new Date().toISOString();
    for (const [slug, arts] of Object.entries(old)) {
      if (Array.isArray(arts)) {
        migrated[slug] = arts.map(a => ({ ...a, publishedAt: a.publishedAt || now }));
      }
    }
    saveHistory(migrated);
    console.log(`📦 Migrated ${Object.keys(migrated).length} districts from last-articles.json to article-history.json`);
  } catch (e) {
    // No old file or invalid — nothing to migrate
  }
}

module.exports = {
  loadSeen, saveSeen, filterUnseen, markSeen,
  loadHistory, saveHistory, addToHistory, MAX_ARTICLES_PER_DISTRICT,
  migrateOldFormat,
};
