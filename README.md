# The Kongu Times | கொங்கு டைம்ஸ்

> Trusted Tamil & English news from the Kongu region of Tamil Nadu

**Live URL:** `https://[your-username].github.io/thekongutimes/`

---

## 📁 File Structure

```
thekongutimes/
├── index.html              ← Homepage
├── css/
│   └── style.css           ← All styles
├── js/
│   └── main.js             ← Language toggle, nav
└── regions/
    ├── erode.html          ← Erode · ஈரோடு
    ├── coimbatore.html     ← Coimbatore · கோயம்புத்தூர்
    ├── tiruppur.html       ← Tiruppur · திருப்பூர்
    ├── salem.html          ← Salem · சேலம்
    ├── namakkal.html       ← Namakkal · நாமக்கல்
    ├── karur.html          ← Karur · கரூர்
    └── dharmapuri.html     ← Dharmapuri · தர்மபுரி
```

---

## ✍️ How to Add News

### Add a news article to a region page

Open the relevant file in `regions/` and copy this block inside the `<main>` tag:

```html
<article class="news-article">
  <span class="article-label">Category</span>
  <h2 class="article-title">Your News Headline in Tamil or English</h2>
  <p class="article-body">
    Full news story text goes here. Write as much as needed.
    தமிழிலும் எழுதலாம்.
  </p>
  <div class="article-meta">
    <span>📅 April 10, 2026</span>
    <span class="meta-dot">·</span>
    <span>🏷 Category</span>
  </div>
</article>
```

### Add to homepage ticker

Edit `index.html` and add to the `.ticker-track` div:

```html
<span class="ticker-item">Your breaking news text here</span>
```

---

## 🚀 Deploy to GitHub Pages

1. Push all files to a GitHub repository
2. Go to **Settings → Pages**
3. Set source to **main branch / root folder**
4. Your site will be live at `https://[username].github.io/[repo-name]/`

---

## 🎨 Features

- ✅ Tamil + English bilingual (தமிழ் + English)
- ✅ Live news ticker
- ✅ 7 Kongu region pages
- ✅ Mobile responsive
- ✅ No frameworks — pure HTML/CSS/JS
- ✅ GitHub Pages compatible
- ✅ Sidebar with region navigation
- ✅ Submit news email link

---

*© 2026 The Kongu Times · கொங்கு டைம்ஸ்*
