import {readFileSync, writeFileSync, existsSync} from 'node:fs';
const fixture = JSON.parse(readFileSync('tests/fixtures/law-sections-2026-10-04.json', 'utf8'));
const src = readFileSync('public/static/catalog-oct4.js', 'utf8');
const cites = [...src.matchAll(/L\('(\d+)', '(\d+(?:-[A-Z])?)'/g)].map(m => [m[1], m[2]]);
for (const s of ['11', '12', '13', '16', '20']) cites.push(['10173', s]);
for (const m of src.matchAll(/'law(\d+)'/g)) cites.push([m[1], null]);
const clean = h => {
  const m = h.match(/^(.{3,140}?)\s*(?:\.\s*[-\u2013\u2014\u0096\u0097]|\s[-\u2013\u2014\u0096\u0097]|\.\s+(?=[A-Z(])|\.$)/);
  return (m ? m[1] : h.slice(0, 90)).replace(/[.\s]+$/, '').replace(/\s+/g, ' ').trim();
};
const heads = {}, missing = [];
for (const [n, s] of cites) {
  const law = fixture[n];
  if (!law) { missing.push(n); continue; }
  heads[n] ??= {url: law.url, title: law.title, heads: {}};
  if (s === null) continue;
  const entries = law.sections[s];
  if (!entries) { missing.push(`${n}:${s}`); continue; }
  const pick = entries.find(e => !/^(Section|Sec\.)\s|is hereby (amended|added|inserted)|A new section/i.test(e)) || entries[0];
  heads[n].heads[s] = clean(pick);
}
if (missing.length) { console.error('Missing in fixture:', [...new Set(missing)].join(', ')); process.exit(1); }
const pf = 'tests/fixtures/openalex-2026-10-04.json';
const prior = existsSync(pf) ? JSON.parse(readFileSync(pf, 'utf8')) : {};
writeFileSync('public/static/catalog-oct4-data.js', `export const LAW_HEADS = ${JSON.stringify(heads)};\nexport const PRIOR_OCT4 = ${JSON.stringify(prior)};\n`);
console.log(`${Object.keys(heads).length} laws, ${cites.length} cites`);
