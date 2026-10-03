import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {emptyState, validateWorkspace, overallScore, formatNotes, makeBackup, parseBackup, recoverLegacy, DEFAULT_PROPOSALS, TARGET_DATE, selectProposals, assessmentProgress, validateDraftBatch} from '../public/static/model.js';
import {normalizeTitle} from '../public/static/model.js';
import {TITLE_REVIEWS, SUGGESTED_TITLES, SOURCES, SDG17_TARGETS, BUILD_WEEKS, THEMES, PRIOR_WORK, themeOf, rankTitles, rankScore, hardwareShare, ratioLabel, filterTitles, portfolioSummary, titleToProposal, reviewForTitle} from '../public/static/titles.js';
import {LEGAL_SOURCES, LEGAL_BASIS, VERIFY, THESIS_TRACK, COUNSEL_REVIEW, COUNSEL_VERDICTS} from '../public/static/legal.js';
const base = 'http://localhost:3000';
let count = 0;
async function test(name, fn) { await fn(); console.log(`PASS ${++count}: ${name}`); }
const proposal = (id = 'custom-test', title = 'Study') => ({id, title, domain: 'General IT', desc: 'Test-only description.', note: ''});
await test('Original wording, homepage and Philippine target preserved', () => {
  assert.deepEqual(DEFAULT_PROPOSALS, JSON.parse(readFileSync('src/original.json','utf8')));
  assert.equal(readFileSync('index.html','utf8'),execFileSync('git',['show','9c1a5b6:index.html'],{encoding:'utf8'}));
  assert.equal(TARGET_DATE.toISOString(),'2027-01-31T15:59:59.000Z');
});
await test('Mean requires four valid scores', () => {
  assert.equal(overallScore([1,2,3,4]),2.5); assert.equal(overallScore([5,5,5,5]),5);
  for (const scores of [[1,null,3,4],[1,2,3],[0,2,3,4],[1,2,3,6]]) assert.equal(overallScore(scores),null);
});
await test('Strict validation, duplicates and size limits', () => {
  assert.deepEqual(validateWorkspace(emptyState()),emptyState());
  const invalid = [
    {...emptyState(),extra:true}, {...emptyState(),version:2}, {...emptyState(),theme:'auto'},
    {...emptyState(),custom:[proposal(),proposal('custom-two',' STUDY ')]},
    {...emptyState(),custom:[proposal('default-9')]}, {...emptyState(),custom:[{...proposal(),title:' '}]},
    {...emptyState(),shortlist:['unknown']}, {...emptyState(),shortlist:['default-1','default-1']},
    {...emptyState(),reviews:JSON.parse('{"__proto__":{"scores":[1,2,3,4],"notes":"x"}}')},
    {...emptyState(),reviews:{'default-1':{scores:[1,2,3,5.5],notes:''}}},
    {...emptyState(),reviews:{'default-1':{scores:[1,2,3,4],notes:'x'.repeat(6001)}}},
    {...emptyState(),custom:Array.from({length:101},(_,i)=>proposal(`custom-${i}`,`Study ${i}`))}
  ];
  for(const state of invalid) assert.throws(()=>validateWorkspace(state));
  const max={...emptyState(),custom:Array.from({length:100},(_,i)=>proposal(`custom-${i}`,`Study ${i}`))};
  assert.equal(validateWorkspace(max).custom.length,100);
  assert.throws(()=>validateWorkspace({...max,shortlist:['default-1','default-2','default-3','default-4','custom-1']}));
  assert.throws(()=>validateWorkspace({...max,custom:max.custom.map(p=>({...p,desc:'界'.repeat(4000)}))}));
});
await test('Formatter and backup round-trip; legacy does not mutate source', () => {
  assert.deepEqual(formatNotes('Title: Study\nDomain: Education\nSummary: Assess access\nNote: Consent'),{title:'Study',domain:'Education',desc:'Assess access',note:'Consent'});
  assert.equal(formatNotes('Study (Education)\nSummary here').domain,'Education');
  assert.equal(formatNotes('Only title').desc,''); assert.throws(()=>formatNotes(' '));
  assert.deepEqual(parseBackup(makeBackup(emptyState())),emptyState()); assert.throws(()=>parseBackup({state:emptyState()}));
  const old=[proposal(),proposal('custom-two','STUDY')], raw=JSON.stringify(old), initial=emptyState();
  const recovered=recoverLegacy(old,initial); assert.equal(recovered.added,1); assert.equal(recovered.skipped,1);
  assert.equal(JSON.stringify(old),raw); assert.deepEqual(initial,emptyState());
});
await test('Search context and notes; stable sorting keeps unknowns last', () => {
  const s = {...emptyState(), custom: [proposal('custom-a', 'Alpha')], reviews: {
    'default-1': {scores: [4,4,4,4], notes: 'City permit interview'},
    'default-2': {scores: [5,null,null,null], notes: ''},
    'default-3': {scores: [4,4,4,4], notes: ''},
    'custom-a': {scores: [5,5,5,5], notes: ''}
  }};
  const original = structuredClone(s);
  assert.deepEqual(selectProposals(s, {search: 'CITY   PERMIT'}).map(p => p.id), ['default-1']);
  assert.deepEqual(selectProposals(s, {search: 'certified Lipa'}).map(p => p.id), ['default-1']);
  assert.deepEqual(selectProposals(s, {sort: 'score'}).map(p => p.id), ['custom-a','default-1','default-3','default-2','default-4']);
  assert.deepEqual(selectProposals(s, {sort: 'title'}).map(p => p.id), ['default-4','custom-a','default-3','default-2','default-1']);
  assert.deepEqual(selectProposals(s, {filter: 'unscored'}).map(p => p.id), ['default-2','default-4']);
  assert.equal(selectProposals(s, {filter: 'reviewed'}).length, 4);
  assert.equal(selectProposals(s, {filter: 'shortlist'}).length, 0);
  assert.deepEqual(s, original);
});
await test('Progress counts complete assessments and prioritizes shortlist', () => {
  const s = emptyState();
  assert.deepEqual(assessmentProgress(s), {complete:0,total:4,next:'default-1'});
  s.shortlist = ['default-3'];
  s.reviews['default-3'] = {scores:[5,null,null,null],notes:'Not complete'};
  assert.deepEqual(assessmentProgress(s), {complete:0,total:4,next:'default-3'});
  for (const p of DEFAULT_PROPOSALS) s.reviews[p.id] = {scores:[1,1,1,1],notes:''};
  assert.deepEqual(assessmentProgress(s), {complete:4,total:4,next:null});
  s.custom.push(proposal());
  assert.deepEqual(assessmentProgress(s), {complete:4,total:5,next:'custom-test'});
});
await test('Title reviews cover every reference and group chat title with valid sources, targets and ratios', () => {
  const chat = JSON.parse(readFileSync('tests/fixtures/drafts-2026-10-01.json','utf8')).drafts.map(d => d.title);
  for (const title of [...DEFAULT_PROPOSALS.map(p => p.title), ...chat]) assert.ok(reviewForTitle(title), `missing review: ${title}`);
  const keys = new Set();
  for (const r of [...TITLE_REVIEWS, ...SUGGESTED_TITLES]) {
    assert.ok(!keys.has(r.key)); keys.add(r.key);
    assert.equal(r.effort[0] + r.effort[1], BUILD_WEEKS);
    assert.ok(r.targets.length && r.targets.every(x => SDG17_TARGETS[x]));
    assert.ok(r.sources.length && r.sources.every(k => /^https:\/\//.test(SOURCES[k]?.url)));
    assert.ok(!/\u2014/.test([r.revised, r.why, r.scope, r.risks, r.unverified].join(' ')));
    if (r.verdict === 'merge') assert.ok(TITLE_REVIEWS.some(x => x.key === r.mergeInto && x.key !== r.key));
    if (['recommended', 'revise'].includes(r.verdict)) assert.ok(r.revised.length > 10);
  }
  assert.equal(hardwareShare([8, 8]), 50); assert.equal(hardwareShare([0, 16]), 0); assert.equal(ratioLabel([7, 9]), '44 : 56');
  const sum = portfolioSummary(TITLE_REVIEWS);
  assert.equal(sum.total, 43); assert.equal(sum.recommended + sum.revise + sum.merge + sum.park, 43);
  assert.ok(filterTitles(TITLE_REVIEWS, {kind: 'hardware'}).every(r => r.effort[0] > 0));
  assert.ok(filterTitles(TITLE_REVIEWS, {search: 'POULTRY'}).some(r => r.key === 'd09'));
  const proposal = titleToProposal(TITLE_REVIEWS.find(r => r.key === 'd07'), 'custom-title-test');
  assert.deepEqual(validateWorkspace({...emptyState(), custom: [proposal]}).custom[0], proposal);
  const all = [...TITLE_REVIEWS, ...SUGGESTED_TITLES].filter(r => ['recommended', 'revise'].includes(r.verdict)).map((r, i) => titleToProposal(r, `custom-t${i}`));
  assert.equal(validateWorkspace({...emptyState(), custom: all}).custom.length, all.length);
});
await test('Legal basis, verify actions and counsel review reference real titles and sources', () => {
  const keys = new Set([...TITLE_REVIEWS, ...SUGGESTED_TITLES].map(r => r.key));
  const src = k => LEGAL_SOURCES[k] || SOURCES[k];
  for (const [key, rows] of Object.entries(LEGAL_BASIS)) { assert.ok(keys.has(key), key); for (const [cite, why, k] of rows) { assert.ok(cite && why); assert.ok(src(k), `${key} ${k}`); } }
  for (const [key, [text, k]] of Object.entries(VERIFY)) { assert.ok(keys.has(key), key); assert.ok(text.length > 20); if (k) assert.ok(src(k), `${key} ${k}`); }
  for (const key of THESIS_TRACK) assert.ok(keys.has(key), key);
  for (const c of COUNSEL_REVIEW) { assert.ok(COUNSEL_VERDICTS[c.verdict]); assert.ok(c.finding && c.action); for (const k of c.sources) assert.ok(src(k), k); }
  for (const x of Object.values(LEGAL_SOURCES)) assert.match(x.url, /^https:\/\//);
  const all = JSON.stringify({LEGAL_SOURCES, LEGAL_BASIS, VERIFY, COUNSEL_REVIEW});
  assert.ok(!/\u2014/.test(all));
  assert.match(LEGAL_SOURCES.lgc.supports, /458\(a\)\(3\)\(vi\)/);
  assert.ok(COUNSEL_REVIEW.some(c => c.verdict === 'corrected' && /Sec\. 21\(b\)/.test(c.finding)));
  for (const r of [...TITLE_REVIEWS, ...SUGGESTED_TITLES].filter(r => r.verdict === 'recommended')) assert.ok(LEGAL_BASIS[r.key], `recommended ${r.key} lacks legal basis`);
});
await test('Top 100 catalog: unique titles, themes, prior-work counts, legal basis and stable rank', () => {
  const all = [...TITLE_REVIEWS, ...SUGGESTED_TITLES];
  assert.equal(all.length, 100); assert.equal(SUGGESTED_TITLES.length, 57);
  assert.equal(new Set(all.map(r => normalizeTitle(r.revised || r.original))).size, 100);
  for (const r of all) assert.ok(THEMES[themeOf(r)], r.key);
  for (const r of SUGGESTED_TITLES.filter(r => r.key.startsWith('c'))) { assert.ok(r.angle && r.angle.length > 20, r.key); assert.ok(PRIOR_WORK[r.key] && Number.isInteger(PRIOR_WORK[r.key][1]), r.key); assert.ok(LEGAL_BASIS[r.key], r.key); assert.ok(r.revised.length <= 240, r.key); }
  const ranks = rankTitles(all); assert.deepEqual(ranks.map(x => x.rank), all.map((_, i) => i + 1));
  for (let i = 1; i < ranks.length; i++) assert.ok(ranks[i - 1].score >= ranks[i].score);
  assert.equal(rankScore({verdict: 'recommended', fit: 'strong', effort: [8, 8], unverified: ''}), 9);
  assert.ok(filterTitles(all, {theme: 'inclusion'}).every(r => themeOf(r) === 'inclusion'));
  assert.ok(filterTitles(all, {search: 'sign language'}).some(r => r.key === 'c30'));
  const sum = portfolioSummary(all); assert.equal(sum.total, 100); assert.equal(sum.hardwareTitles, 37);
  assert.match(titleToProposal(all.find(r => r.key === 'c15'), 'custom-c15').note, /^Angle: /);
});
let cookie, initial;
const get = async () => (await fetch(base+'/api/workspace',{headers:cookie?{Cookie:cookie}:{}})).json();
const put = (data, extra={}) => fetch(base+'/api/workspace',{method:'PUT',headers:{'Content-Type':'application/json',Origin:base,'X-Workspace-Request':'1',Cookie:cookie,...extra},body:typeof data==='string'?data:JSON.stringify(data)});
await test('D1 health and browser cookie attributes', async () => {
  assert.equal((await fetch(base+'/api/health')).status,200);
  const r=await fetch(base+'/api/workspace'); initial=await r.json();
  assert.deepEqual(initial.state,emptyState());
  const set=r.headers.get('set-cookie'); assert.match(set,/HttpOnly/i); assert.match(set,/SameSite=Strict/i); cookie=set.split(';')[0];
  assert.equal(r.headers.get('cache-control'),'no-store'); assert.match(r.headers.get('content-security-policy'),/script-src 'self'/);
});
await test('Invalid, cross-origin, cookieless and oversized writes rejected', async () => {
  const data={state:initial.state,revision:initial.revision};
  assert.equal((await put(data,{Origin:'https://other.example'})).status,403);
  assert.equal((await put(data,{'X-Workspace-Request':''})).status,403);
  assert.equal((await put(data,{Cookie:''})).status,401);
  assert.equal((await put('{')).status,400);
  assert.equal((await put('text',{'Content-Type':'text/plain'})).status,415);
  assert.equal((await put('x'.repeat(262145))).status,413);
  for(const bad of [{...data,revision:-1},{...data,extra:true},{...data,state:{...emptyState(),shortlist:['missing']}}]) assert.equal((await put(bad)).status,400);
});
await test('D1 persistence, stale revision rejection and cookie isolation', async () => {
  const state={...emptyState(),custom:[proposal('custom-api','<img src=x onerror=alert(1)>')],shortlist:['custom-api'],reviews:{'custom-api':{scores:[1,2,3,null],notes:"quote ' <script>"}},theme:'dark'};
  assert.equal((await put({state,revision:initial.revision})).status,200);
  assert.equal((await put({state:emptyState(),revision:initial.revision})).status,409);
  assert.deepEqual((await get()).state,state);
  assert.deepEqual((await (await fetch(base+'/api/workspace')).json()).state,emptyState());
});
await test('Draft batch validation trims, dedupes and rejects bad input', () => {
  assert.deepEqual(validateDraftBatch({drafts:[{title:'  Smart   Clinic Queue ',author:'Kurt'}]}),[{title:'Smart Clinic Queue',norm:'smart clinic queue',domain:'General IT',summary:'',author:'Kurt',source:'heisenbot'}]);
  for (const bad of [{}, {drafts:'x'}, {drafts:[{title:'ab'}]}, {drafts:[{title:'123'}]}, {drafts:[{title:'Same'},{title:' SAME '}]}, {drafts:[{title:'Ok title',extra:1}]}, {drafts:Array.from({length:51},(_,i)=>({title:`Title ${i}`}))}]) assert.throws(()=>validateDraftBatch(bad));
});
const token = process.env.INTAKE_TOKEN || (readFileSync('.dev.vars','utf8').match(/^INTAKE_TOKEN=(.+)$/m) || [])[1]?.trim();
const intake = (body, auth = token) => fetch(base+'/api/intake',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${auth}`},body:JSON.stringify(body)});
await test('Heisenbot intake requires token, dedupes, skips reference titles and publishes drafts', async () => {
  const title = `Group Chat Draft ${Date.now()}`;
  assert.equal((await intake({drafts:[{title}]}, 'wrong-token-wrong-token-wrong')).status,401);
  assert.equal((await fetch(base+'/api/intake',{method:'POST',headers:{'Content-Type':'application/json'},body:'{"drafts":[]}'})).status,401);
  const first = await intake({drafts:[{title,author:'Kurt Atienza <b>',domain:'Education'},{title:DEFAULT_PROPOSALS[1].title}]});
  assert.equal(first.status,201); const body = await first.json();
  assert.deepEqual(body.added,[title]); assert.equal(body.skipped[0].reason,'reference proposal');
  assert.equal((await (await intake({drafts:[{title:title.toUpperCase()}]})).json()).skipped[0].reason,'already posted');
  assert.equal((await intake({drafts:[{title:'x'}]})).status,400);
  const list = (await (await fetch(base+'/api/drafts')).json()).drafts; const row = list.find(d=>d.title===title);
  assert.equal(row.author,'Kurt Atienza <b>'); assert.equal(row.domain,'Education');
  assert.equal((await fetch(base+'/api/intake/'+row.id,{method:'DELETE',headers:{Authorization:`Bearer ${token}`}})).status,200);
  assert.ok(!(await (await fetch(base+'/api/drafts')).json()).drafts.some(d=>d.id===row.id));
  assert.equal((await (await fetch(base+'/api/intake',{headers:{Authorization:`Bearer ${token}`}})).json()).ok,true);
});
console.log(`${count} model/API groups passed.`);
await import('./browser.mjs');
