'use strict';

const DISTRICT_SOURCES = {
  erode: {
    slug: 'erode', name: 'Erode', tamil: 'ஈரோடு',
    keywords: ['erode', 'ஈரோடு', 'bhavani', 'gobichettipalayam', 'perundurai', 'erode district'],
    feeds: [
      'https://tamil.abplive.com/news/erode/feed',
      'https://kumudam.com/rss/category/district-news',
      'https://news.google.com/rss/search?q=ஈரோடு+செய்திகள்&hl=ta&gl=IN&ceid=IN:ta',
      'https://news.google.com/rss/search?q=ஈரோடு+மாவட்டம்&hl=ta&gl=IN&ceid=IN:ta',
      'https://news.google.com/rss/search?q=erode+district+news+tamilnadu&hl=en-IN&gl=IN&ceid=IN:en',
      'https://news.google.com/rss/search?q=ஈரோடு+விவசாயம்+OR+தொழில்+OR+கல்வி&hl=ta&gl=IN&ceid=IN:ta',
    ]
  },
  coimbatore: {
    slug: 'coimbatore', name: 'Coimbatore', tamil: 'கோயம்புத்தூர்',
    keywords: ['coimbatore', 'கோயம்புத்தூர்', 'kovai', 'கோவை', 'pollachi', 'mettupalayam'],
    feeds: [
      'https://tamil.abplive.com/news/coimbatore/feed',
      'https://news.google.com/rss/search?q=கோயம்புத்தூர்+செய்திகள்&hl=ta&gl=IN&ceid=IN:ta',
      'https://news.google.com/rss/search?q=கோவை+மாவட்டம்+இன்று&hl=ta&gl=IN&ceid=IN:ta',
      'https://news.google.com/rss/search?q=coimbatore+news+today+tamilnadu&hl=en-IN&gl=IN&ceid=IN:en',
      'https://news.google.com/rss/search?q=coimbatore+latest+news+2026&hl=en-IN&gl=IN&ceid=IN:en',
      'https://news.google.com/rss/search?q=கோவை+தொழில்+OR+கல்வி+OR+சுகாதாரம்&hl=ta&gl=IN&ceid=IN:ta',
    ]
  },
  tiruppur: {
    slug: 'tiruppur', name: 'Tiruppur', tamil: 'திருப்பூர்',
    keywords: ['tiruppur', 'திருப்பூர்', 'tirupur', 'dharapuram', 'udumalaipettai'],
    feeds: [
      'https://tamil.abplive.com/news/tiruppur/feed',
      'https://news.google.com/rss/search?q=திருப்பூர்+செய்திகள்&hl=ta&gl=IN&ceid=IN:ta',
      'https://news.google.com/rss/search?q=திருப்பூர்+மாவட்டம்&hl=ta&gl=IN&ceid=IN:ta',
      'https://news.google.com/rss/search?q=tiruppur+news+tamilnadu&hl=en-IN&gl=IN&ceid=IN:en',
      'https://news.google.com/rss/search?q=tiruppur+knitwear+OR+textile+OR+industry&hl=en-IN&gl=IN&ceid=IN:en',
      'https://news.google.com/rss/search?q=திருப்பூர்+ஜவுளி+OR+தொழில்+OR+கல்வி&hl=ta&gl=IN&ceid=IN:ta',
    ]
  },
  salem: {
    slug: 'salem', name: 'Salem', tamil: 'சேலம்',
    keywords: ['salem', 'சேலம்', 'omalur', 'mettur', 'yercaud', 'attur', 'edappadi'],
    feeds: [
      'https://tamil.abplive.com/news/salem/feed',
      'https://news.google.com/rss/search?q=சேலம்+செய்திகள்&hl=ta&gl=IN&ceid=IN:ta',
      'https://news.google.com/rss/search?q=சேலம்+மாவட்டம்+இன்று&hl=ta&gl=IN&ceid=IN:ta',
      'https://news.google.com/rss/search?q=salem+tamilnadu+news+today&hl=en-IN&gl=IN&ceid=IN:en',
      'https://news.google.com/rss/search?q=salem+district+tamilnadu+latest&hl=en-IN&gl=IN&ceid=IN:en',
      'https://news.google.com/rss/search?q=சேலம்+எஃகு+OR+கல்வி+OR+சுகாதாரம்&hl=ta&gl=IN&ceid=IN:ta',
    ]
  },
  namakkal: {
    slug: 'namakkal', name: 'Namakkal', tamil: 'நாமக்கல்',
    keywords: ['namakkal', 'நாமக்கல்', 'rasipuram', 'tiruchengodu', 'kumarapalayam', 'sankari'],
    feeds: [
      'https://tamil.abplive.com/news/namakkal/feed',
      'https://news.google.com/rss/search?q=நாமக்கல்+செய்திகள்&hl=ta&gl=IN&ceid=IN:ta',
      'https://news.google.com/rss/search?q=நாமக்கல்+மாவட்டம்&hl=ta&gl=IN&ceid=IN:ta',
      'https://news.google.com/rss/search?q=namakkal+news+tamilnadu+today&hl=en-IN&gl=IN&ceid=IN:en',
      'https://news.google.com/rss/search?q=namakkal+egg+OR+poultry+OR+transport&hl=en-IN&gl=IN&ceid=IN:en',
      'https://news.google.com/rss/search?q=நாமக்கல்+முட்டை+OR+போக்குவரத்து+OR+தொழில்&hl=ta&gl=IN&ceid=IN:ta',
    ]
  },
  karur: {
    slug: 'karur', name: 'Karur', tamil: 'கரூர்',
    keywords: ['karur', 'கரூர்', 'kulithalai', 'krishnarayapuram', 'aravakurichi', 'pugalur'],
    feeds: [
      'https://tamil.abplive.com/news/karur/feed',
      'https://news.google.com/rss/search?q=கரூர்+செய்திகள்&hl=ta&gl=IN&ceid=IN:ta',
      'https://news.google.com/rss/search?q=கரூர்+மாவட்டம்+இன்று&hl=ta&gl=IN&ceid=IN:ta',
      'https://news.google.com/rss/search?q=karur+news+tamilnadu&hl=en-IN&gl=IN&ceid=IN:en',
      'https://news.google.com/rss/search?q=karur+district+tamilnadu+latest&hl=en-IN&gl=IN&ceid=IN:en',
      'https://news.google.com/rss/search?q=கரூர்+ஜவுளி+OR+கவேரி+OR+தொழில்&hl=ta&gl=IN&ceid=IN:ta',
    ]
  },
  dharmapuri: {
    slug: 'dharmapuri', name: 'Dharmapuri', tamil: 'தர்மபுரி',
    keywords: ['dharmapuri', 'தர்மபுரி', 'palacode', 'pennagaram', 'harur', 'hogenakkal', 'hosur'],
    feeds: [
      'https://tamil.abplive.com/news/dharmapuri/feed',
      // Wider window for dharmapuri — less frequent news
      'https://news.google.com/rss/search?q=தர்மபுரி+செய்திகள்&hl=ta&gl=IN&ceid=IN:ta',
      'https://news.google.com/rss/search?q=தர்மபுரி+மாவட்டம்&hl=ta&gl=IN&ceid=IN:ta',
      'https://news.google.com/rss/search?q=dharmapuri+news+tamilnadu&hl=en-IN&gl=IN&ceid=IN:en',
      'https://news.google.com/rss/search?q=dharmapuri+district+tamilnadu+latest&hl=en-IN&gl=IN&ceid=IN:en',
      'https://news.google.com/rss/search?q=தர்மபுரி+மாம்பழம்+OR+பட்டு+OR+ஹொகேனக்கல்&hl=ta&gl=IN&ceid=IN:ta',
      'https://news.google.com/rss/search?q=dharmapuri+mango+OR+hogenakkal+OR+sericulture&hl=en-IN&gl=IN&ceid=IN:en',
    ]
  }
};

const CATEGORIES = {
  'Agriculture': ['விவசாய','மஞ்சள்','நெல்','கரும்பு','முட்டை','மாம்பழம்','பட்டு','farmer','agriculture','crop','harvest','turmeric','paddy','egg','mango','sericulture','poultry'],
  'Politics':    ['தேர்தல்','அரசியல்','மந்திரி','கட்சி','election','politics','dmk','aiadmk','bjp','tvk','minister','mla','mp','party','vote'],
  'Infrastructure':['சாலை','பாலம்','ரயில்','விமான','road','bridge','railway','airport','highway','flyover','construction','metro'],
  'Industry':    ['தொழிற்சாலை','ஏற்றுமதி','ஜவுளி','industry','export','factory','textile','knitwear','manufacturing','msme'],
  'Education':   ['பள்ளி','கல்லூரி','மாணவர்','தேர்வு','school','college','students','education','exam','result','university','admission'],
  'Health':      ['மருத்துவமனை','நோய்','சுகாதாரம்','hospital','health','disease','treatment','doctor','medical','aiims'],
  'Crime':       ['கைது','போலீஸ்','திருட்டு','கொலை','arrest','police','crime','theft','murder','robbery','court','cbi'],
  'Development': ['திட்டம்','வளர்ச்சி','கோடி','development','project','scheme','crore','fund','inaugurate','launch'],
  'Environment': ['மழை','வெள்ளம்','அணை','யானை','rain','flood','drought','dam','river','lake','water','elephant'],
  'Sports':      ['கிரிக்கெட்','விளையாட்டு','cricket','sports','tournament','match','player','team'],
};

function detectCategory(text) {
  const lower = (text || '').toLowerCase();
  for (const [cat, words] of Object.entries(CATEGORIES)) {
    if (words.some(w => lower.includes(w.toLowerCase()))) return cat;
  }
  return 'General';
}

module.exports = { DISTRICT_SOURCES, CATEGORIES, detectCategory };
