#!/usr/bin/env python3
import os

regions = [
    {
        "slug": "erode",
        "name": "Erode",
        "tamil": "ஈரோடு",
        "icon": "🌿",
        "tagline": "Turmeric Capital of India",
        "tagline_ta": "இந்தியாவின் மஞ்சள் தலைநகரம்",
        "desc": "Home to Asia's largest turmeric market, vibrant handloom weaving traditions, and the birthplace of social reformer Periyar E.V. Ramasamy.",
        "desc_ta": "ஆசியாவின் மிகப்பெரிய மஞ்சள் சந்தை, கைத்தறி பாரம்பரியம் மற்றும் சமூக சீர்திருத்தவாதி பெரியாரின் பிறந்த ஊர்.",
        "color": "#1D6B34",
        "articles": [
            {
                "label": "Agriculture",
                "title": "ஈரோடு மஞ்சள் ஏலம் — கிலோ ₹18,000 சாதனை விலை",
                "title_en": "Erode Turmeric Auction — Record price of ₹18,000 per kg",
                "body": "ஈரோடு மஞ்சள் ஏல மையத்தில் இன்று கிலோ 18,000 ரூபாயை தாண்டி விலை சென்றது. தரமான மஞ்சளுக்கு இதுவரை இல்லாத அளவில் விலை கிடைத்துள்ளது. இது மாவட்ட விவசாயிகளுக்கு மிகுந்த மகிழ்ச்சியளித்துள்ளது. ஏல மையத்தின் தலைவர் கூறும்போது, இந்த ஆண்டு மஞ்சள் தரம் சிறப்பாக இருப்பதால் வாங்குவோர் அதிக விலை கொடுக்கத் தயாராக இருக்கிறார்கள் என்றார்.",
                "date": "April 10, 2026",
                "category": "Agriculture"
            },
            {
                "label": "Infrastructure",
                "title": "Erode-Salem Highway — 4-lane expansion work begins",
                "title_en": "Erode-Salem Highway — 4-lane expansion work begins",
                "body": "The long-awaited four-lane expansion of the Erode–Salem National Highway has officially begun. The ₹1,200 crore project is expected to be completed within 18 months, cutting travel time between the two cities by half. Local traders and transport companies have welcomed the development.",
                "date": "April 8, 2026",
                "category": "Infrastructure"
            },
            {
                "label": "Culture",
                "title": "பெரியார் பிறந்த நாள் — ஈரோட்டில் பெரும் விழா",
                "title_en": "Periyar Birth Anniversary — Grand celebration in Erode",
                "body": "சமூக சீர்திருத்தவாதி தந்தை பெரியார் அவர்களின் பிறந்தநாள் விழாவை முன்னிட்டு ஈரோட்டில் பல்வேறு நிகழ்ச்சிகள் ஏற்பாடு செய்யப்பட்டுள்ளன. பள்ளி, கல்லூரி மாணவர்கள் ஊர்வலம், கட்டுரைப் போட்டிகளில் பங்கேற்றனர்.",
                "date": "April 7, 2026",
                "category": "Culture"
            }
        ]
    },
    {
        "slug": "coimbatore",
        "name": "Coimbatore",
        "tamil": "கோயம்புத்தூர்",
        "icon": "🏙️",
        "tagline": "Manchester of South India",
        "tagline_ta": "தென்னிந்தியாவின் மான்செஸ்டர்",
        "desc": "Tamil Nadu's second-largest city and a powerhouse of textile mills, engineering industries, and a growing IT and startup ecosystem.",
        "desc_ta": "தமிழ்நாட்டின் இரண்டாவது பெரிய நகரம். ஜவுளி ஆலைகள், பொறியியல் தொழில்கள் மற்றும் வளரும் தொழில்நுட்ப சுற்றுச்சூழல்.",
        "color": "#1A5276",
        "articles": [
            {
                "label": "Smart City",
                "title": "Coimbatore Smart City — ₹500 crore Central funding approved",
                "title_en": "Coimbatore Smart City — ₹500 crore Central funding approved",
                "body": "The Union Ministry of Housing and Urban Affairs has approved ₹500 crore for Coimbatore's Smart City projects. The funds will be used for road widening, underground cabling, smart traffic management, and the creation of 15 new public parks across the city. Mayor confirmed that work will begin within 60 days.",
                "date": "April 10, 2026",
                "category": "Development"
            },
            {
                "label": "Industry",
                "title": "கோயம்புத்தூர் தொழில் மண்டலம் — 5,000 புதிய வேலைகள்",
                "title_en": "Coimbatore Industrial Zone — 5,000 new jobs announced",
                "body": "TIDCO கோயம்புத்தூர் அருகே புதிய தொழில் மண்டலம் அமைக்கிறது. இதில் ஆட்டோமோட்டிவ் பாகங்கள், மின்னணு சாதனங்கள் உற்பத்தி நிறுவனங்கள் இடம்பெற உள்ளன. 5,000 நேரடி வேலை வாய்ப்புகள் உருவாகும்.",
                "date": "April 9, 2026",
                "category": "Industry"
            },
            {
                "label": "Education",
                "title": "PSG College tops national ranking — Engineering excellence recognised",
                "title_en": "PSG College tops national ranking — Engineering excellence recognised",
                "body": "PSG College of Technology, Coimbatore has secured the top rank among private engineering institutions in Tamil Nadu in the latest NIRF rankings. The college's research output and placement record were cited as key factors.",
                "date": "April 6, 2026",
                "category": "Education"
            }
        ]
    },
    {
        "slug": "tiruppur",
        "name": "Tiruppur",
        "tamil": "திருப்பூர்",
        "icon": "🧵",
        "tagline": "Knitwear Capital of India",
        "tagline_ta": "இந்தியாவின் ஜவுளி தலைநகரம்",
        "desc": "The undisputed knitwear export capital supplying T-shirts and garments to over 50 countries, contributing billions to India's export economy.",
        "desc_ta": "50க்கும் மேற்பட்ட நாடுகளுக்கு ஜவுளி ஏற்றுமதி செய்யும் இந்தியாவின் பின்னல் ஆடை தலைநகரம்.",
        "color": "#7D3C98",
        "articles": [
            {
                "label": "Export",
                "title": "திருப்பூர் ஏற்றுமதி 20% உயர்வு — ₹35,000 கோடி இலக்கு",
                "title_en": "Tiruppur exports up 20% — Target of ₹35,000 crore set",
                "body": "திருப்பூர் ஏற்றுமதியாளர்கள் சங்கம் (TEA) இந்த நிதியாண்டில் ₹35,000 கோடி ஏற்றுமதி இலக்கை அடைவதாக நம்பிக்கை தெரிவிக்கிறது. ஐரோப்பிய நாடுகளில் இருந்து கட்டளைகள் அதிகரித்துள்ளன. அமெரிக்காவிலும் புதிய வாடிக்கையாளர்கள் கிடைத்துள்ளனர்.",
                "date": "April 9, 2026",
                "category": "Trade"
            },
            {
                "label": "Environment",
                "title": "Noyyal river restoration — Tiruppur industries adopt zero-discharge norms",
                "title_en": "Noyyal river restoration — Tiruppur industries adopt zero-discharge norms",
                "body": "In a landmark move, 120 dyeing units in Tiruppur have voluntarily adopted zero-liquid-discharge systems. The Noyyal river, long affected by industrial effluents, is showing signs of recovery with improved water quality in recent testing.",
                "date": "April 7, 2026",
                "category": "Environment"
            },
            {
                "label": "Welfare",
                "title": "திருப்பூர் தொழிலாளர் குடியிருப்பு — 1,000 வீடுகள் கைமாறும்",
                "title_en": "Tiruppur Worker Housing — 1,000 homes to be handed over",
                "body": "ஜவுளி தொழிலாளர்களுக்காக கட்டப்பட்ட 1,000 குடியிருப்புகள் விரைவில் வழங்கப்படும். மாவட்ட ஆட்சியர் நேரில் ஆய்வு செய்து தொழிலாளர்களுக்கு நல்ல செய்தி தெரிவித்தார்.",
                "date": "April 6, 2026",
                "category": "Social Welfare"
            }
        ]
    },
    {
        "slug": "salem",
        "name": "Salem",
        "tamil": "சேலம்",
        "icon": "⚙️",
        "tagline": "Steel City of Tamil Nadu",
        "tagline_ta": "தமிழ்நாட்டின் எஃகு நகரம்",
        "desc": "Home to Salem Steel Plant, rich in mineral resources, and a key commercial hub connecting the Kongu and northern regions of Tamil Nadu.",
        "desc_ta": "சேலம் எஃகு ஆலை, கனிம வளங்கள் மற்றும் வடக்கு தமிழ்நாட்டை இணைக்கும் வணிக மையம்.",
        "color": "#B7770D",
        "articles": [
            {
                "label": "Industry",
                "title": "Salem Steel Plant Phase 4 — 2,000 new jobs, CM inaugurates",
                "title_en": "Salem Steel Plant Phase 4 — 2,000 new jobs, CM inaugurates",
                "body": "Chief Minister inaugurated the Phase 4 expansion of Salem Steel Plant today, boosting production capacity by 30%. The new phase will create 2,000 direct jobs and an estimated 8,000 indirect employment opportunities. The plant now ranks among the top five steel producers in India.",
                "date": "April 9, 2026",
                "category": "Industry"
            },
            {
                "label": "Water",
                "title": "மேட்டூர் அணை நீர்மட்டம் 90 அடி — விவசாயிகளுக்கு நம்பிக்கை",
                "title_en": "Mettur Dam at 90 feet — Good news for farmers",
                "body": "மேட்டூர் அணையில் நீர்மட்டம் 90 அடியை தாண்டியுள்ளது. கோடைக்காலத்திலும் கால்வாய்களுக்கு தொடர்ந்து நீர் வழங்கப்படும் என அதிகாரிகள் தெரிவித்தனர். ஆயிரக்கணக்கான ஏக்கர் விளைநிலங்களுக்கு பாசன நீர் கிடைக்கும்.",
                "date": "April 7, 2026",
                "category": "Water Resources"
            },
            {
                "label": "Transport",
                "title": "சேலம் — சென்னை வந்தே பாரத் ரயில் — தினசரி 2 சேவைகள்",
                "title_en": "Salem–Chennai Vande Bharat — 2 daily services from June",
                "body": "சேலத்தில் இருந்து சென்னைக்கு தினசரி 2 வந்தே பாரத் ரயில் சேவைகள் ஜூன் மாதம் தொடங்கும் என ரயில்வே அதிகாரிகள் உறுதிப்படுத்தினர். பயண நேரம் 3 மணி நேரமாக குறையும்.",
                "date": "April 5, 2026",
                "category": "Transport"
            }
        ]
    },
    {
        "slug": "namakkal",
        "name": "Namakkal",
        "tamil": "நாமக்கல்",
        "icon": "🥚",
        "tagline": "Egg Town & Transport Hub",
        "tagline_ta": "முட்டை நகரம் மற்றும் போக்குவரத்து மையம்",
        "desc": "India's largest egg-producing district and home to one of the nation's most thriving transport and lorry manufacturing industries.",
        "desc_ta": "இந்தியாவின் மிகப்பெரிய முட்டை உற்பத்தி மாவட்டம் மற்றும் போக்குவரத்து தொழில் மையம்.",
        "color": "#CA6F1E",
        "articles": [
            {
                "label": "Agriculture",
                "title": "நாமக்கல் முட்டை உற்பத்தி — இந்த ஆண்டு 10 கோடி டஜன் சாதனை",
                "title_en": "Namakkal Egg Production — Record 10 crore dozen this year",
                "body": "நாமக்கல் மாவட்ட கோழிப்பண்ணை அமைப்பு இந்த ஆண்டு 10 கோடி டஜன் முட்டை உற்பத்தி இலக்கை எட்டியுள்ளது. கிழக்கு ஆசிய நாடுகளுக்கும் ஏற்றுமதி தொடங்கியுள்ளது. விலை நிலையாக இருப்பதால் நுகர்வோரும் மகிழ்ச்சியாக உள்ளனர்.",
                "date": "April 10, 2026",
                "category": "Agriculture"
            },
            {
                "label": "Transport",
                "title": "Namakkal Lorry Body Building — New GST-friendly hub launched",
                "title_en": "Namakkal Lorry Body Building — New GST-friendly hub launched",
                "body": "The Namakkal Lorry Body Builders' Association has set up a dedicated GST facilitation centre to help small workshops comply with new regulations. Over 1,200 body-building units operate in the district, employing more than 20,000 workers.",
                "date": "April 8, 2026",
                "category": "Industry"
            },
            {
                "label": "Education",
                "title": "நாமக்கல் — மாவட்டத்தில் புதிய மருத்துவக் கல்லூரி",
                "title_en": "Namakkal — New medical college approved for district",
                "body": "நாமக்கல் மாவட்டத்தில் புதிய அரசு மருத்துவக் கல்லூரி அமைக்க மத்திய அரசு அனுமதி வழங்கியுள்ளது. 150 MBBS இடங்கள் கொண்ட இந்த கல்லூரி 2027-ல் தொடங்கும்.",
                "date": "April 6, 2026",
                "category": "Education"
            }
        ]
    },
    {
        "slug": "karur",
        "name": "Karur",
        "tamil": "கரூர்",
        "icon": "🏮",
        "tagline": "Home Textile Export Capital",
        "tagline_ta": "வீட்டு ஜவுளி ஏற்றுமதி மையம்",
        "desc": "A powerhouse of home textiles — bed linen, curtains, towels — exported worldwide, with deep roots in banking and trade tradition.",
        "desc_ta": "படுக்கை விரிப்புகள், திரைச்சீலைகள், துண்டுகள் என வீட்டு ஜவுளியில் உலக முன்னணி. வங்கி மற்றும் வணிக பாரம்பரியம்.",
        "color": "#1A6B5A",
        "articles": [
            {
                "label": "Trade",
                "title": "Karur Home Textiles exported to 45 countries — ₹12,000 crore this year",
                "title_en": "Karur Home Textiles exported to 45 countries — ₹12,000 crore this year",
                "body": "Karur's home textile exporters have recorded a turnover of ₹12,000 crore in the current fiscal year, supplying bed linen, curtains, and kitchen linen to 45 countries. The US, UK, Germany, and Australia remain top buyers.",
                "date": "April 9, 2026",
                "category": "Trade"
            },
            {
                "label": "Infrastructure",
                "title": "கரூர் மத்திய பேருந்து நிலையம் — புதுமைப்படுத்தல் பணிகள் முடிந்தன",
                "title_en": "Karur Central Bus Stand — Modernisation work completed",
                "body": "கரூர் மத்திய பேருந்து நிலையம் புதுமைப்படுத்தப்பட்டு திறக்கப்பட்டது. 50,000 பயணிகளுக்கு வசதியான காத்திருப்பு அரங்குகள், சுத்தமான கழிவறைகள் மற்றும் டிஜிட்டல் வரவு-செல்வு பலகை அமைக்கப்பட்டுள்ளது.",
                "date": "April 7, 2026",
                "category": "Infrastructure"
            },
            {
                "label": "Banking",
                "title": "Karur Vysya Bank posts record profit — Dividend announced for shareholders",
                "title_en": "Karur Vysya Bank posts record profit — Dividend announced for shareholders",
                "body": "Karur Vysya Bank has announced a record net profit of ₹1,605 crore for the financial year 2025–26, a 22% increase over the previous year. A dividend of ₹2.50 per share has been declared.",
                "date": "April 5, 2026",
                "category": "Finance"
            }
        ]
    },
    {
        "slug": "dharmapuri",
        "name": "Dharmapuri",
        "tamil": "தர்மபுரி",
        "icon": "🌾",
        "tagline": "Mango & Sericulture District",
        "tagline_ta": "மாம்பழம் மற்றும் பட்டுப்புழு மாவட்டம்",
        "desc": "Famous for its alphonso and neelam mangoes, rich sericulture tradition, and the ancient Hogenakkal Falls — the 'Niagara of India'.",
        "desc_ta": "அல்போன்சா மற்றும் நீலம் மாம்பழங்கள், பட்டுப்புழு வளர்ப்பு பாரம்பரியம் மற்றும் ஹொகேனக்கல் அருவி — இந்தியாவின் நயாகரா.",
        "color": "#1E8449",
        "articles": [
            {
                "label": "Agriculture",
                "title": "தர்மபுரி மாம்பழ சீசன் — இந்த ஆண்டு 25% அதிக மகசூல் எதிர்பார்ப்பு",
                "title_en": "Dharmapuri Mango Season — 25% higher yield expected this year",
                "body": "சரியான நேரத்தில் பெய்த மழை மற்றும் சாதகமான வானிலையால் தர்மபுரி மாம்பழ விவசாயிகள் கடந்த ஆண்டை விட 25 சதவீதம் அதிக மகசூல் எதிர்பார்க்கின்றனர். ஜூன் முதல் ஏற்றுமதி தொடங்கும்.",
                "date": "April 10, 2026",
                "category": "Agriculture"
            },
            {
                "label": "Tourism",
                "title": "Hogenakkal Falls — New eco-tourism packages launched for summer",
                "title_en": "Hogenakkal Falls — New eco-tourism packages launched for summer",
                "body": "The Tamil Nadu Tourism Development Corporation has launched special eco-tourism packages for Hogenakkal Falls ahead of the summer season. New facilities including improved coracle boat services, cafeteria, and visitor rest areas have been added.",
                "date": "April 8, 2026",
                "category": "Tourism"
            },
            {
                "label": "Sericulture",
                "title": "தர்மபுரி பட்டு — மத்திய அரசின் விருது பெற்ற உழவர்கள்",
                "title_en": "Dharmapuri Silk — Sericulture farmers receive national awards",
                "body": "தர்மபுரி மாவட்டத்தில் இருந்து 5 விவசாயிகள் மத்திய அரசின் தேசிய பட்டு வளர்ப்பு விருது பெற்றனர். மத்திய பட்டு வாரியம் தர்மபுரி பட்டின் தரத்தை மிகவும் பாராட்டியது.",
                "date": "April 5, 2026",
                "category": "Agriculture"
            }
        ]
    }
]

def build_region_page(r):
    articles_html = ""
    for a in r["articles"]:
        articles_html += f"""
        <article class="news-article">
          <span class="article-label">{a['label']}</span>
          <h2 class="article-title">{a['title']}</h2>
          <p class="article-body">{a['body']}</p>
          <div class="article-meta">
            <span>📅 {a['date']}</span>
            <span class="meta-dot">·</span>
            <span>🏷 {a['category']}</span>
          </div>
        </article>"""

    # sidebar links for other regions
    sidebar_links = ""
    count = 1
    for other in regions:
        if other["slug"] != r["slug"]:
            sidebar_links += f"""
            <a href="{other['slug']}.html" class="sidebar-link">
              <span class="sidebar-link-num">{str(count).zfill(2)}</span>
              <span class="sidebar-link-title">{other['icon']} {other['name']} · {other['tamil']}</span>
            </a>"""
            count += 1

    nav_links = ""
    for other in regions:
        active = 'class="active"' if other["slug"] == r["slug"] else ""
        nav_links += f'<a href="{other["slug"]}.html" {active}>{other["name"]} · {other["tamil"]}</a>\n      '

    page = f"""<!DOCTYPE html>
<html lang="ta">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="{r['name']} news in Tamil and English — The Kongu Times. {r['desc']}" />
  <title>{r['name']} · {r['tamil']} | The Kongu Times</title>
  <link rel="stylesheet" href="../css/style.css" />
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📰</text></svg>" />
</head>
<body>

  <!-- HEADER -->
  <header class="site-header">
    <div class="header-top">
      <a href="../index.html" class="logo-block" style="text-decoration:none">
        <span class="logo-title">The <span>Kongu</span> Times</span>
        <span class="logo-tamil">கொங்கு டைம்ஸ்</span>
      </a>
      <div class="header-tagline">கொங்கு மண்டலத்தின் குரல் · Voice of the Kongu Region</div>
      <div class="lang-toggle">
        <button class="lang-btn active" data-lang="ta" onclick="switchLang('ta')">தமிழ்</button>
        <button class="lang-btn" data-lang="en" onclick="switchLang('en')">English</button>
      </div>
    </div>
  </header>

  <!-- REGION NAV -->
  <nav class="region-nav" aria-label="Region Navigation">
    <div class="region-nav-inner">
      <a href="../index.html">🏠 Home</a>
      {nav_links}
    </div>
  </nav>

  <!-- NEWS TICKER -->
  <div class="news-ticker">
    <div class="ticker-inner">
      <span class="ticker-label">LIVE</span>
      <div class="ticker-scroll">
        <div class="ticker-track">
          <span class="ticker-item">{r['name']} — {r['tagline_ta']}</span>
          <span class="ticker-item">{r['articles'][0]['title']}</span>
          <span class="ticker-item">{r['articles'][1]['title_en']}</span>
          <span class="ticker-item">{r['articles'][2]['title']}</span>
          <span class="ticker-item">{r['name']} — {r['tagline_ta']}</span>
          <span class="ticker-item">{r['articles'][0]['title']}</span>
          <span class="ticker-item">{r['articles'][1]['title_en']}</span>
          <span class="ticker-item">{r['articles'][2]['title']}</span>
        </div>
      </div>
    </div>
  </div>

  <!-- REGION HERO -->
  <div class="region-hero">
    <div class="region-hero-inner">
      <div class="region-breadcrumb">
        <a href="../index.html">Home</a> &rsaquo; {r['name']}
      </div>
      <h1 class="region-title">{r['icon']} {r['name']}</h1>
      <div class="region-title-tamil">{r['tamil']}</div>
      <p class="region-desc">{r['desc']}</p>
      <p class="region-desc" style="font-family:'Tiro Tamil',serif;margin-top:8px">{r['desc_ta']}</p>
    </div>
  </div>

  <!-- CONTENT + SIDEBAR -->
  <div class="region-content">
    <main>
      <div class="section-head">
        <h2 data-en="Latest from {r['name']}" data-ta="{r['tamil']} செய்திகள்">{r['tamil']} செய்திகள்</h2>
        <div class="section-head-line"></div>
      </div>
      {articles_html}

      <!-- ADD MORE NEWS BELOW THIS LINE — copy the article block above -->

    </main>

    <aside class="sidebar">
      <div class="sidebar-block">
        <div class="sidebar-title">Other Regions</div>
        {sidebar_links}
      </div>
      <div class="sidebar-block" style="background:var(--red-light);border-color:var(--red)">
        <div class="sidebar-title" style="border-bottom-color:var(--red);color:var(--red-dark)">Submit News</div>
        <p style="font-family:'DM Sans',sans-serif;font-size:13px;color:var(--ink-mid);line-height:1.6;margin-bottom:10px">
          Have a story from {r['name']}? Send it to us!<br>
          <span style="font-family:'Tiro Tamil',serif">{r['tamil']} செய்தி அனுப்ப:</span>
        </p>
        <a href="mailto:news@thekongutimes.com" style="font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;color:var(--red);text-decoration:none">
          ✉️ news@thekongutimes.com
        </a>
      </div>
    </aside>
  </div>

  <!-- FOOTER -->
  <footer class="site-footer">
    <div class="footer-inner">
      <div class="footer-grid">
        <div>
          <div class="footer-logo">The <span>Kongu</span> Times</div>
          <p class="footer-desc">Trusted news from the heart of Tamil Nadu's Kongu region.</p>
          <p class="footer-desc-tamil">கொங்கு மண்டலத்தின் நம்பகமான செய்தி ஆதாரம்.</p>
        </div>
        <div class="footer-col">
          <div class="footer-col-title">Regions</div>
          <a href="erode.html">Erode · ஈரோடு</a>
          <a href="coimbatore.html">Coimbatore · கோயம்புத்தூர்</a>
          <a href="tiruppur.html">Tiruppur · திருப்பூர்</a>
          <a href="salem.html">Salem · சேலம்</a>
        </div>
        <div class="footer-col">
          <div class="footer-col-title">More Regions</div>
          <a href="namakkal.html">Namakkal · நாமக்கல்</a>
          <a href="karur.html">Karur · கரூர்</a>
          <a href="dharmapuri.html">Dharmapuri · தர்மபுரி</a>
        </div>
        <div class="footer-col">
          <div class="footer-col-title">About</div>
          <a href="../index.html">Home</a>
          <a href="#">Contact</a>
          <a href="#">Submit News</a>
          <a href="#">Privacy Policy</a>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© 2026 The Kongu Times · கொங்கு டைம்ஸ். All rights reserved.</span>
        <span>Made with ❤️ for the Kongu people</span>
      </div>
    </div>
  </footer>

  <script src="../js/main.js"></script>
</body>
</html>"""
    return page

os.makedirs('/home/claude/thekongutimes/regions', exist_ok=True)

for r in regions:
    path = f"/home/claude/thekongutimes/regions/{r['slug']}.html"
    with open(path, 'w', encoding='utf-8') as f:
        f.write(build_region_page(r))
    print(f"✓ Built: {r['name']} → {path}")

print("\nAll 7 region pages built successfully!")
