'use strict';

const https = require('https');
const http = require('http');
const { URL } = require('url');

function fetchHTML(url, timeoutMs = 8000) {
  return new Promise((resolve, reject) => {
    try {
      const parsedUrl = new URL(url);
      const lib = parsedUrl.protocol === 'https:' ? https : http;
      const options = {
        hostname: parsedUrl.hostname,
        path: parsedUrl.pathname + parsedUrl.search,
        method: 'GET',
        timeout: timeoutMs,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; KonguTimesBot/1.0)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'ta,en;q=0.5',
        }
      };
      const req = lib.request(options, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          fetchHTML(res.headers.location, timeoutMs).then(resolve).catch(reject);
          return;
        }
        if (res.statusCode !== 200) { reject(new Error(`HTTP ${res.statusCode}`)); return; }
        const chunks = [];
        res.on('data', chunk => chunks.push(chunk));
        res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
        res.on('error', reject);
      });
      req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
      req.on('error', reject);
      req.end();
    } catch (e) { reject(e); }
  });
}

function stripHTML(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ').trim();
}

// Extract image URL from RSS item XML
function extractImage(itemXml) {
  // Try media:content, media:thumbnail, enclosure, og:image in description
  const patterns = [
    /media:content[^>]+url="([^"]+\.(jpg|jpeg|png|webp)[^"]*)"/i,
    /media:thumbnail[^>]+url="([^"]+\.(jpg|jpeg|png|webp)[^"]*)"/i,
    /<enclosure[^>]+url="([^"]+\.(jpg|jpeg|png|webp)[^"]*)"/i,
    /<img[^>]+src="([^"]+\.(jpg|jpeg|png|webp)[^"]*)"/i,
  ];
  for (const p of patterns) {
    const m = itemXml.match(p);
    if (m && m[1] && !m[1].includes('logo') && !m[1].includes('icon')) return m[1];
  }
  return null;
}

function extractArticleText(html) {
  const contentPatterns = [
    /<article[^>]*>([\s\S]*?)<\/article>/i,
    /<div[^>]*class="[^"]*story[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    /<div[^>]*class="[^"]*article[^"]*body[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    /<div[^>]*class="[^"]*post[^"]*content[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    /<main[^>]*>([\s\S]*?)<\/main>/i,
  ];
  for (const pattern of contentPatterns) {
    const match = html.match(pattern);
    if (match) {
      const text = stripHTML(match[1]);
      if (text.length > 150) return text.substring(0, 3000);
    }
  }
  const paragraphs = [];
  const pPattern = /<p[^>]*>([\s\S]*?)<\/p>/gi;
  let m;
  while ((m = pPattern.exec(html)) !== null) {
    const t = stripHTML(m[1]).trim();
    if (t.length > 40) paragraphs.push(t);
  }
  if (paragraphs.length > 0) return paragraphs.slice(0, 8).join(' ').substring(0, 3000);
  return null;
}

// Also try to extract OG image from article page
function extractOGImage(html) {
  const m = html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i)
            || html.match(/<meta[^>]+content="([^"]+)"[^>]+property="og:image"/i);
  if (m && m[1] && m[1].startsWith('http')) return m[1];
  return null;
}

function parseRSS(xml) {
  const items = [];
  const itemPattern = /<item>([\s\S]*?)<\/item>/gi;
  let match;
  while ((match = itemPattern.exec(xml)) !== null) {
    const item = match[1];
    const title = extractTag(item, 'title');
    const link = extractTag(item, 'link') || extractTag(item, 'guid');
    const description = extractTag(item, 'description') || extractTag(item, 'content:encoded') || '';
    const pubDate = extractTag(item, 'pubDate') || extractTag(item, 'dc:date') || '';
    const image = extractImage(item);

    if (title && link && isValidUrl(link)) {
      items.push({
        title: stripHTML(title).trim(),
        url: link.trim(),
        description: stripHTML(description).trim(),
        pubDate: pubDate.trim(),
        image: image || null,
        sourceText: null
      });
    }
  }
  return items;
}

function extractTag(xml, tag) {
  const pattern = new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`, 'i');
  const match = xml.match(pattern);
  return match ? match[1].trim() : null;
}

function isValidUrl(str) {
  try {
    const u = new URL(str);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch { return false; }
}

async function fetchFeed(feedUrl) {
  try {
    const xml = await fetchHTML(feedUrl, 10000);
    const items = parseRSS(xml);
    console.log(`  ✓ ${feedUrl.substring(0, 60)} → ${items.length} items`);
    return items;
  } catch (e) {
    console.log(`  ✗ ${feedUrl.substring(0, 60)} → ${e.message}`);
    return [];
  }
}

async function fetchArticleText(url) {
  try {
    const html = await fetchHTML(url, 8000);
    const text = extractArticleText(html);
    // Also try to get OG image if not from RSS
    const ogImage = extractOGImage(html);
    return { text, ogImage };
  } catch (e) {
    return { text: null, ogImage: null };
  }
}

function deduplicate(items) {
  const seen = new Set();
  return items.filter(item => {
    if (seen.has(item.url)) return false;
    seen.add(item.url);
    return true;
  });
}

function filterByDistrict(items, keywords) {
  return items.filter(item => {
    const text = (item.title + ' ' + item.description).toLowerCase();
    return keywords.some(kw => text.includes(kw.toLowerCase()));
  });
}

function filterRecent(items, hoursBack = 48) {
  const cutoff = Date.now() - hoursBack * 60 * 60 * 1000;
  return items.filter(item => {
    if (!item.pubDate) return true;
    const d = new Date(item.pubDate);
    if (isNaN(d.getTime())) return true;
    return d.getTime() >= cutoff;
  });
}

module.exports = { fetchFeed, fetchArticleText, deduplicate, filterByDistrict, filterRecent, stripHTML };
