'use strict';
const https = require('https');

const OPENROUTER_API_KEY = (process.env.OPENROUTER_API_KEY || '').trim();
const MODEL = 'anthropic/claude-3.5-haiku';

function callOpenRouter(messages, maxTokens = 4000) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ model: MODEL, max_tokens: maxTokens, messages, temperature: 0.7 });
    const options = {
      hostname: 'openrouter.ai',
      path: '/api/v1/chat/completions',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://thekongutimes.com',
        'X-Title': 'The Kongu Times',
        'Content-Length': Buffer.byteLength(body),
      },
      timeout: 90000,
    };
    const req = https.request(options, (res) => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        try {
          const raw = Buffer.concat(chunks).toString();
          const data = JSON.parse(raw);
          if (data.error) reject(new Error(`API: ${JSON.stringify(data.error)}`));
          else if (!data.choices?.[0]) reject(new Error(`Bad response: ${raw.substring(0, 200)}`));
          else resolve(data.choices[0].message.content.trim());
        } catch (e) { reject(e); }
      });
      res.on('error', reject);
    });
    req.on('timeout', () => { req.destroy(); reject(new Error('API timeout')); });
    req.on('error', reject);
    req.write(body); req.end();
  });
}

// Robustly extract JSON even with broken Tamil unicode mid-string
function extractJSON(text) {
  // Strip markdown fences
  text = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();

  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1) return null;

  let jsonStr = text.substring(start, end + 1);

  // Strategy: fix broken JSON by sanitizing each string value individually
  // Replace all literal newlines/tabs/control chars inside JSON string values
  // We do this character by character to handle broken Unicode safely
  let result = '';
  let inString = false;
  let escape = false;

  for (let i = 0; i < jsonStr.length; i++) {
    const ch = jsonStr[i];
    const code = jsonStr.charCodeAt(i);

    if (escape) {
      result += ch;
      escape = false;
      continue;
    }

    if (ch === '\\') {
      escape = true;
      result += ch;
      continue;
    }

    if (ch === '"') {
      inString = !inString;
      result += ch;
      continue;
    }

    if (inString) {
      // Inside a string: replace control characters that break JSON
      if (code < 0x20) {
        // Control character — replace with space or escaped version
        if (code === 0x0A) result += '\\n';      // newline → \n
        else if (code === 0x0D) result += '';     // carriage return → remove
        else if (code === 0x09) result += ' ';   // tab → space
        else result += ' ';                       // other control → space
      } else {
        result += ch;
      }
    } else {
      result += ch;
    }
  }

  try {
    return JSON.parse(result);
  } catch (e) {
    // Last resort: try to manually extract key fields with regex
    return null;
  }
}

// Fallback: extract fields individually if JSON parse fails completely
function extractFieldsManually(text) {
  const get = (key) => {
    const pattern = new RegExp(`"${key}"\\s*:\\s*"((?:[^"\\\\]|\\\\.)*)"`, 's');
    const m = text.match(pattern);
    return m ? m[1].replace(/\\n/g, '\n').replace(/\\"/g, '"') : '';
  };
  const tagsMatch = text.match(/"tags"\s*:\s*\[([^\]]*)\]/);
  const tags = tagsMatch
    ? tagsMatch[1].match(/"([^"]+)"/g)?.map(t => t.replace(/"/g, '')) || []
    : [];
  return {
    headline_ta: get('headline_ta'),
    headline_en: get('headline_en'),
    meta_description_ta: get('meta_description_ta'),
    meta_description_en: get('meta_description_en'),
    body_ta: get('body_ta'),
    body_en: get('body_en'),
    category: get('category'),
    tags,
  };
}

async function rewriteArticle(sourceText, districtName, districtTamil, category) {
  const clean = (sourceText || '')
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(/\s+/g, ' ').trim().substring(0, 2500);

  // Use a TWO-STEP approach:
  // Step 1: Generate Tamil article (separate call)
  // Step 2: Generate English article + metadata (separate call)
  // This avoids giant JSON with long Tamil text causing parse failures

  const tamilPrompt = `You are a senior Tamil journalist for The Kongu Times, covering ${districtName} (${districtTamil}).

Write a COMPLETE Tamil news article based on this source:
"${clean}"

REQUIREMENTS:
- Write in natural modern Tamil journalism style
- Minimum 5 paragraphs, each paragraph minimum 100 words
- Total minimum 600 Tamil words
- Include: என்ன நடந்தது (what happened), ஏன் (why), யாரால் (who), எங்கே (where), என்ன தாக்கம் (impact on people), அதிகாரிகளின் கருத்து (official response)
- Do NOT mention cinema, entertainment, or irrelevant topics
- Write ONLY about ${districtName} district

Return ONLY the Tamil article text. No JSON, no headlines, just the article paragraphs. Separate paragraphs with a blank line.`;

  const englishPrompt = `You are a senior English journalist for The Kongu Times, covering ${districtName}, Tamil Nadu.

Write a COMPLETE English news article based on this source:
"${clean}"

REQUIREMENTS:
- Professional English journalism style
- Minimum 5 paragraphs, each paragraph minimum 100 words  
- Total minimum 600 English words
- Include: what happened, why, who, where, impact on residents, official response
- Do NOT mention cinema, entertainment, or irrelevant topics
- Write ONLY about ${districtName} district

Return ONLY the English article text. No JSON, no headlines, just the article paragraphs. Separate paragraphs with a blank line.`;

  const metaPrompt = `Based on this news about ${districtName}: "${clean.substring(0, 400)}"

Return ONLY this JSON (no markdown, start with {, end with }):
{"headline_ta":"Tamil SEO headline 12-15 words with ${districtTamil}","headline_en":"English SEO headline 12-15 words with ${districtName}","meta_description_ta":"Tamil meta under 150 chars","meta_description_en":"English meta under 150 chars","category":"${category}","tags":["tag1","tag2","tag3","tag4","tag5"]}`;

  // Run all 3 in parallel for speed
  const [bodyTA, bodyEN, metaRaw] = await Promise.all([
    callOpenRouter([{ role: 'user', content: tamilPrompt }], 2000),
    callOpenRouter([{ role: 'user', content: englishPrompt }], 2000),
    callOpenRouter([{ role: 'user', content: metaPrompt }], 400),
  ]);

  // Parse meta (small JSON, much less likely to fail)
  let meta = extractJSON(metaRaw);
  if (!meta) meta = extractFieldsManually(metaRaw);

  // Derive fallback headline/description from actual body text (never use
  // a generic "{district} - {category} செய்தி" template — it mixes English
  // category words into Tamil and doesn't reflect the real story)
  const firstSentenceTA = (bodyTA || '').split(/[।.!?\n]/)[0].trim();
  const firstSentenceEN = (bodyEN || '').split(/[.!?\n]/)[0].trim();

  const fallbackHeadlineTA = firstSentenceTA
    ? firstSentenceTA.split(/\s+/).slice(0, 12).join(' ')
    : `${districtTamil} செய்தி`;
  const fallbackHeadlineEN = firstSentenceEN
    ? firstSentenceEN.split(/\s+/).slice(0, 12).join(' ')
    : `${districtName} News Update`;

  const headline_ta = (meta.headline_ta && meta.headline_ta.length >= 10) ? meta.headline_ta : fallbackHeadlineTA;
  const headline_en = (meta.headline_en && meta.headline_en.length >= 10) ? meta.headline_en : fallbackHeadlineEN;

  const meta_description_ta = meta.meta_description_ta || (bodyTA || '').substring(0, 150);
  const meta_description_en = meta.meta_description_en || (bodyEN || '').substring(0, 150);

  // Re-detect category from the ACTUAL generated content (headline + body).
  // Content-based detection takes PRIORITY over the AI's metadata guess —
  // the AI's meta.category is often wrong/generic (e.g. tags an AIADMK
  // harassment case as "Agriculture"), while keyword-matching the real
  // article text is far more reliable.
  const { detectCategory } = require('./rss-sources.cjs');
  const detectedCategory = detectCategory(`${headline_en} ${headline_ta} ${bodyEN} ${bodyTA}`);
  const finalCategory = detectedCategory !== 'General'
    ? detectedCategory
    : ((meta.category && meta.category !== 'General') ? meta.category : category);

  // Combine everything
  return {
    headline_ta,
    headline_en,
    meta_description_ta,
    meta_description_en,
    body_ta: bodyTA.trim(),
    body_en: bodyEN.trim(),
    category: finalCategory,
    tags: meta.tags || [],
  };
}

module.exports = { rewriteArticle };
