'use strict';
const fs = require('fs');
const path = require('path');

const SEEN_FILE = path.join(__dirname, '..', 'data', 'published-urls.json');
const MAX_AGE_DAYS = 14; // Forget URLs older than this to keep file small

function loadSeen() {
  try {
    const data = JSON.parse(fs.readFileSync(SEEN_FILE, 'utf8'));
    const cutoff = Date.now() - MAX_AGE_DAYS * 24 * 60 * 60 * 1000;
    // Prune old entries
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

// Filter out items whose URL has already been published
function filterUnseen(items, seenMap) {
  return items.filter(item => !seenMap[item.url]);
}

// Mark items as published (call after successful rewrite)
function markSeen(seenMap, url) {
  seenMap[url] = Date.now();
}

module.exports = { loadSeen, saveSeen, filterUnseen, markSeen };

// --- Last published articles cache (for homepage continuity) ---
const LAST_ARTICLES_FILE = path.join(__dirname, '..', 'data', 'last-articles.json');

function loadLastArticles() {
  try {
    return JSON.parse(fs.readFileSync(LAST_ARTICLES_FILE, 'utf8'));
  } catch (e) {
    return {};
  }
}

function saveLastArticles(map) {
  const dir = path.dirname(LAST_ARTICLES_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(LAST_ARTICLES_FILE, JSON.stringify(map, null, 2), 'utf8');
}

module.exports.loadLastArticles = loadLastArticles;
module.exports.saveLastArticles = saveLastArticles;
