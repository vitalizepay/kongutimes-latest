'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const BASE_URL = 'https://thekongutimes.com';

const STATIC_PAGES = [
  { loc: '/', priority: '1.0', changefreq: 'daily' },
  { loc: '/about.html', priority: '0.7', changefreq: 'monthly' },
  { loc: '/contact.html', priority: '0.6', changefreq: 'monthly' },
  { loc: '/privacy.html', priority: '0.5', changefreq: 'yearly' },
  { loc: '/regions/erode.html', priority: '0.9', changefreq: 'daily' },
  { loc: '/regions/coimbatore.html', priority: '0.9', changefreq: 'daily' },
  { loc: '/regions/tiruppur.html', priority: '0.9', changefreq: 'daily' },
  { loc: '/regions/salem.html', priority: '0.9', changefreq: 'daily' },
  { loc: '/regions/namakkal.html', priority: '0.9', changefreq: 'daily' },
  { loc: '/regions/karur.html', priority: '0.9', changefreq: 'daily' },
  { loc: '/regions/dharmapuri.html', priority: '0.9', changefreq: 'daily' },
];

function generateSitemap(date) {
  const lastmod = date.toISOString().split('T')[0];

  const urls = STATIC_PAGES.map(page => `
  <url>
    <loc>${BASE_URL}${page.loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urls}
</urlset>`;

  fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemap, 'utf8');
  console.log('  ✓ sitemap.xml regenerated');
}

// Generate robots.txt
function generateRobots() {
  const robots = `User-agent: *
Allow: /
Disallow: /thankyou.html

Sitemap: ${BASE_URL}/sitemap.xml

User-agent: AdsBot-Google
Allow: /
`;
  fs.writeFileSync(path.join(ROOT, 'robots.txt'), robots, 'utf8');
  console.log('  ✓ robots.txt written');
}

module.exports = { generateSitemap, generateRobots };
