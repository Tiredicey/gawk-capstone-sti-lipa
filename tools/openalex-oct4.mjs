import {readFileSync, writeFileSync, existsSync} from 'node:fs';
const file = 'tests/fixtures/openalex-2026-10-04.json';
const src = readFileSync('public/static/catalog-oct4.js', 'utf8');
const items = [...src.matchAll(/g\('(g\d{3})'[\s\S]*?\],\n  '([^']+)', \[/g)].map(m => [m[1], m[2]]);
const out = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : {};
const key = process.env.OPENALEX_API_KEY ? `&api_key=${process.env.OPENALEX_API_KEY}` : '';
let limited = false;
for (const [id, phrase] of items) {
  if (Number.isInteger(out[id]?.[1]) && out[id][0] === phrase) continue;
  out[id] = [phrase, null];
  if (!limited) {
    try {
      const r = await fetch(`https://api.openalex.org/works?filter=title_and_abstract.search:${encodeURIComponent(phrase)}&per-page=1${key}`, {signal: AbortSignal.timeout(30000)});
      if (r.status === 429 || r.status === 403) limited = true;
      else if (r.ok) out[id][1] = (await r.json()).meta.count;
    } catch {}
    await new Promise(s => setTimeout(s, 150));
  }
}
for (const k of Object.keys(out)) if (!items.some(([id]) => id === k)) delete out[k];
writeFileSync(file, JSON.stringify(out));
const done = Object.values(out).filter(x => Number.isInteger(x[1])).length;
console.log(`${done} of ${items.length} counted${limited ? '; OpenAlex daily budget used up, rerun after 00:00 UTC or set OPENALEX_API_KEY' : ''}`);
