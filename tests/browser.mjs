import assert from 'node:assert/strict';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {chromium} from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import {emptyState,makeBackup,parseBackup} from '../public/static/model.js';
await mkdir('test-results',{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const context=await browser.newContext({viewport:{width:1440,height:1000},acceptDownloads:true});
const page=await context.newPage(); page.setDefaultTimeout(10000);
const errors=[],results=[]; page.on('pageerror',e=>errors.push(e.message));
const base='http://localhost:3000';
const saved=p=>p.waitForFunction(()=>document.querySelector('#saveStatus').textContent==='Saved to D1');
const open=async p=>{await p.goto(base);await saved(p)};
const state=p=>p.evaluate(async()=>(await(await fetch('/api/workspace')).json()).state);
const action=(kind,id='default-1')=>page.locator(`[data-action="${kind}"][data-id="${id}"]`);
const close=()=>page.locator('#closeDialog').click();
async function test(name,fn){try{await fn();results.push({name,status:'PASS'});console.log('PASS browser: '+name)}catch(e){results.push({name,status:'FAIL',error:e.message});throw e}}
async function download(button,path){const pending=page.waitForEvent('download');await page.locator(button).click();await(await pending).saveAs(path);return parseBackup(JSON.parse(await readFile(path,'utf8')))}
try{
await test('Load, search and filters',async()=>{
 await open(page);assert.equal(await page.locator('.proposal-card').count(),4);
 await page.screenshot({path:'test-results/desktop-light.png',fullPage:true});
 await page.locator('#searchInput').fill('bytecode');assert.equal(await page.locator('.proposal-card').count(),1);
 await page.locator('#searchInput').fill('nothing here');assert.equal(await page.locator('.proposal-card').count(),0);
 await page.getByRole('button',{name:'Clear filters'}).click();assert.equal(await page.locator('.proposal-card').count(),4);
 await page.locator('#filterInput').selectOption('custom');assert.equal(await page.locator('.proposal-card').count(),0);await page.locator('#filterInput').selectOption('all');
});
await test('Manual add, persistent XSS escaping, duplicate rejection',async()=>{
 await page.locator('#newTitle').fill('Campus <img src=x onerror=alert(1)>');await page.locator('#newDesc').fill('Study <script>window.hacked=1</script>');await page.locator('#addButton').click();await saved(page);
 assert.equal(await page.locator('.proposal-card').count(),5);assert.equal(await page.locator('.proposal-card img,.proposal-card script').count(),0);
 await page.locator('#newTitle').fill(' CAMPUS <img src=x onerror=alert(1)> ');await page.locator('#newDesc').fill('duplicate');await page.locator('#addButton').click();assert.match(await page.locator('#formError').textContent(),/already exists/);
 await page.locator('#proposalForm').evaluate(f=>f.reset());await page.reload();await saved(page);assert.equal(await page.locator('.proposal-card').count(),5);
});
await test('Formatting requires review before adding',async()=>{
 await page.locator('#smartPasteInput').fill('Title: Lab Access\nDomain: Education\nSummary: Study lab access\nNote: Seek permission');await page.locator('#formatButton').click();assert.equal(await page.locator('#newTitle').inputValue(),'Lab Access');assert.equal(await page.locator('.proposal-card').count(),5);
 await page.locator('#newTitle').fill('Lab Access Revised');await page.locator('#addButton').click();await saved(page);assert.equal((await state(page)).custom.at(-1).title,'Lab Access Revised');
});
await test('Four-item shortlist limit and focus retention',async()=>{
 for(let i=1;i<=4;i++)await action('shortlist',`default-${i}`).click();await saved(page);
 await action('shortlist',(await state(page)).custom[0].id).click();assert.match(await page.locator('#copyAlert').textContent(),/up to four/);assert.equal(await page.locator('#shortlistCount').textContent(),'4');
 await action('shortlist','default-4').click();await saved(page);assert.equal(await page.evaluate(()=>document.activeElement.dataset.id),'default-4');
});
await test('Review mean, missing scores, notes and original wording',async()=>{
 await action('review').click();await page.locator('.original-reference summary').click();assert.match(await page.locator('.original-reference').textContent(),/Ordinance-Compliant/);
 await page.locator('#score-0').selectOption('5');assert.match(await page.locator('#overallScore').textContent(),/Not fully scored/);
 for(const[i,n]of[[1,'4'],[2,'3'],[3,'2']])await page.locator(`#score-${i}`).selectOption(n);assert.equal(await page.locator('#overallScore').textContent(),'Overall: 3.50 / 5');
 await page.locator('#reviewNotes').fill('Need certified route data. <svg onload=alert(1)>');await page.locator('#saveReview').click();await saved(page);await close();await page.reload();await saved(page);await action('review').click();assert.match(await page.locator('#reviewNotes').inputValue(),/certified route/);
 await page.locator('#score-3').selectOption('');await page.locator('#saveReview').click();await saved(page);assert.match(await page.locator('#overallScore').textContent(),/Not fully scored/);await close();
});
await test('Comparison and PDF output',async()=>{
 await page.locator('#boardCompareButton').click();assert.equal(await page.locator('.comparison thead th').count(),4);assert.match(await page.locator('.comparison').textContent(),/Not fully scored/);
 await page.pdf({path:'test-results/comparison.pdf',preferCSSPageSize:true,printBackground:true});assert.ok((await readFile('test-results/comparison.pdf')).length>1000);await close();
});
await test('Export, invalid import, pre-import backup and replacement',async()=>{
 const before=await state(page);assert.deepEqual(await download('#exportButton','test-results/backup.json'),before);
 await page.locator('#importFile').setInputFiles({name:'bad.json',mimeType:'application/json',buffer:Buffer.from('{"bad":true}')});await page.waitForFunction(()=>document.querySelector('#copyAlert').textContent.includes('Import rejected'));assert.deepEqual(await state(page),before);
 const incoming={...emptyState(),custom:[{id:'custom-import',title:'Imported idea',domain:'IT',desc:'Test concept',note:''}],theme:'dark'};
 await page.locator('#importFile').setInputFiles({name:'good.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(makeBackup(incoming)))});await page.locator('#confirmImport').waitFor();assert.equal(await page.locator('#confirmImport').isDisabled(),true);
 assert.deepEqual(await download('#preImportBackup','test-results/pre-import.json'),before);await page.locator('#backupConfirmed').check();await page.locator('#confirmImport').click();await saved(page);assert.deepEqual(await state(page),incoming);
});
await test('Destructive removal confirmation and dependent data cleanup',async()=>{
 await action('shortlist','custom-import').click();await action('review','custom-import').click();await page.locator('#reviewNotes').fill('Temporary');await page.locator('#saveReview').click();await saved(page);await close();
 await action('remove','custom-import').click();await page.locator('#cancelAction').click();assert.equal((await state(page)).custom.length,1);
 await action('remove','custom-import').click();await page.locator('#confirmAction').click();await saved(page);const s=await state(page);assert.equal(s.custom.length,0);assert.equal(s.shortlist.length,0);assert.deepEqual(s.reviews,{});
});
await test('Legacy recovery keeps old data and skips duplicates',async()=>{
 const legacy=[{id:'custom-old',title:'Old idea',domain:'IT',desc:'Recovered description',note:''}];legacy.push({...legacy[0],id:'custom-other'});
 await page.evaluate(data=>localStorage.setItem('custom_proposals_v2',JSON.stringify(data)),legacy);await page.locator('#recoverButton').click();await page.locator('#readLegacy').click();assert.match(await page.locator('#legacyResult').textContent(),/1 proposals can be added; 1 duplicate/);
 await page.locator('#confirmRecovery').click();await saved(page);assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('custom_proposals_v2'))),legacy);assert.equal((await state(page)).custom.length,1);
});
await test('Clipboard failure, share cancel and honest completion',async()=>{
 await page.evaluate(()=>{Object.defineProperty(navigator,'share',{configurable:true,value:async()=>{throw new DOMException('cancel','AbortError')}});Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw Error('denied')}}})});
 await action('share').click();await page.locator('#copyVote').click();assert.match(await page.locator('#dialogStatus').textContent(),/Clipboard unavailable/);assert.ok(await page.locator('#voteText').evaluate(el=>el.selectionEnd===el.value.length));
 const windows=context.pages().length;await page.locator('#shareVote').click();assert.match(await page.locator('#dialogStatus').textContent(),/Sharing canceled/);assert.equal(context.pages().length,windows);
 assert.equal(await page.locator('#messengerLink').getAttribute('href'),'https://www.facebook.com/messages/t/1629525598528599');
 await page.evaluate(()=>Object.defineProperty(navigator,'share',{configurable:true,value:async()=>{}}));await page.locator('#shareVote').click();assert.match(await page.locator('#dialogStatus').textContent(),/Delivery is not confirmed/);await close();
});
await test('Network failure retains draft and retry persists',async()=>{
 await page.route('**/api/workspace',r=>r.request().method()==='PUT'?r.fulfill({status:503,contentType:'application/json',body:'{"error":"Injected network failure"}'}):r.continue());
 await action('shortlist').click();await page.waitForFunction(()=>document.querySelector('#saveStatus').textContent==='Not saved');assert.equal((await state(page)).shortlist.length,0);
 const draft=await download('#exportButton','test-results/unsaved.json');assert.deepEqual(draft.shortlist,['default-1']);
 await page.unroute('**/api/workspace');await page.locator('#retryButton').click();await saved(page);assert.deepEqual((await state(page)).shortlist,['default-1']);
});
await test('Stale tabs cannot overwrite and can reload with confirmation',async()=>{
 const other=await context.newPage();await open(other);await page.locator('#themeButton').click();await saved(page);
 await other.locator('[data-action="shortlist"][data-id="default-2"]').click();await other.waitForFunction(()=>document.querySelector('#saveStatus').textContent.includes('conflict'));
 assert.deepEqual((await state(other)).shortlist,['default-1']);assert.equal(await other.locator('#retryButton').isDisabled(),true);
 await other.locator('#reloadButton').click();await other.locator('#confirmAction').click();await saved(other);assert.equal(await other.locator('#shortlistCount').textContent(),'1');await other.close();
});
await test('Initial service failure disables editing and retries',async()=>{
 const c=await browser.newContext();const p=await c.newPage();await p.route('**/api/workspace',r=>r.fulfill({status:503,contentType:'application/json',body:'{"error":"Offline"}'}));await p.goto(base);await p.waitForFunction(()=>document.querySelector('#saveStatus').textContent==='Not connected');assert.equal(await p.locator('#addButton').isDisabled(),true);
 await p.unroute('**/api/workspace');await p.locator('#retryButton').click();await saved(p);assert.deepEqual(await state(p),emptyState());await c.close();
});
await test('Keyboard dialog focus, Escape and visible focus outline',async()=>{
 await action('review').focus();await page.keyboard.press('Enter');assert.equal(await page.evaluate(()=>document.activeElement.id),'dialogTitle');
 for(let i=0;i<18;i++){await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>!!document.activeElement.closest('dialog')),true)}
 await page.keyboard.press('Escape');assert.equal(await page.evaluate(()=>document.activeElement.dataset.action),'review');assert.notEqual(await page.evaluate(()=>getComputedStyle(document.activeElement).outlineStyle),'none');
});
await test('Light/dark axe checks and responsive no-overflow',async()=>{
 for(const theme of ['light','dark']){
  if(await page.locator('html').getAttribute('data-theme')!==theme){await page.locator('#themeButton').click();await saved(page)}
  const a=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();assert.deepEqual(a.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[]);
  await page.screenshot({path:`test-results/desktop-${theme}.png`,fullPage:true});
 }
 for(const width of [320,375,768,1024,1440]){await page.setViewportSize({width,height:900});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`overflow at ${width}`);assert.equal(await page.locator('#themeButton').isVisible(),true)}
 await page.setViewportSize({width:375,height:812});await page.screenshot({path:'test-results/mobile-dark.png',fullPage:true});
 await page.emulateMedia({reducedMotion:'reduce'});assert.equal(await page.locator('#themeButton').evaluate(el=>getComputedStyle(el).transitionDuration),'0s');
 assert.deepEqual(errors,[]);
});
}finally{await writeFile('test-results/browser-results.json',JSON.stringify(results,null,2));await browser.close()}
console.log(`${results.length} browser groups passed.`);
