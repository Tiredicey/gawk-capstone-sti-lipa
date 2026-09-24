import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {emptyState, validateWorkspace, overallScore, formatNotes, makeBackup, parseBackup, recoverLegacy, DEFAULT_PROPOSALS, TARGET_DATE, selectProposals, assessmentProgress, validateDraftBatch} from '../public/static/model.js';
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
