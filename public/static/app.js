import {TITLE_REVIEWS, SUGGESTED_TITLES, SOURCES, SDG17_TARGETS, VERDICTS, FITS, REVIEWED_ON, ratioLabel, hardwareShare, projectType, displayTitle, filterTitles, portfolioSummary, titleToProposal, reviewForTitle} from './titles.js';
import {DEFAULT_PROPOSALS, CONCEPTS, CRITERIA, MESSENGER_THREAD_URL, emptyState, validateWorkspace, overallScore, formatNotes, makeBackup, parseBackup, recoverLegacy, selectProposals, assessmentProgress, normalizeTitle} from './model.js';

const $ = id => document.getElementById(id);
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
let state = emptyState(), revision = 0, ready = false, dirty = false, generation = 0, saving = null, saveTimer, blocked = false;
let returnFocus = null, editDirty = false;
const allProposals = () => [...DEFAULT_PROPOSALS, ...state.custom];
const concept = p => CONCEPTS[p.id] || {name: p.title, desc: p.desc, question: p.note || 'What would you need to validate this idea?'};
const reviewFor = id => state.reviews[id] || {scores: [null, null, null, null], notes: ''};
const scoreLabel = id => { const score = overallScore(reviewFor(id).scores); return score === null ? 'Not fully scored' : `${score.toFixed(2)} / 5`; };
const status = message => { $('saveStatus').textContent = message; };
function notify(message) { $('copyAlert').textContent = message; $('noticeRegion').hidden = false; }
function showError(message) { $('connectionError').hidden = false; $('errorText').textContent = message; }
async function request(url, options = {}) {
  const response = await fetch(url, {...options, signal: AbortSignal.timeout(15000), credentials: 'same-origin'});
  let data;
  try { data = await response.json(); } catch { throw new Error('The server returned an unreadable response. Keep your draft and retry.'); }
  if (!response.ok) { const error = new Error(data.error || `Request failed (${response.status}).`); error.status = response.status; throw error; }
  return data;
}
function applyTheme() {
  document.documentElement.dataset.theme = state.theme;
  $('themeButton').textContent = state.theme === 'light' ? 'Dark theme' : 'Light theme';
  $('themeButton').setAttribute('aria-label', `Switch to ${state.theme === 'light' ? 'dark' : 'light'} theme`);
}
async function load() {
  status('Connecting…');
  try {
    const data = await request('/api/workspace');
    const loaded = validateWorkspace(data.state);
    if (!Number.isSafeInteger(data.revision) || data.revision < 0) throw new Error('Invalid saved revision.');
    state = loaded; revision = data.revision; ready = true; dirty = false; blocked = false;
    $('connectionError').hidden = true; $('retryButton').disabled = false;
    ['exportButton', 'importButton', 'recoverButton', 'addButton'].forEach(id => $(id).disabled = false);
    applyTheme(); render(); status('Saved to D1');
  } catch (error) {
    status(ready ? 'Reload failed' : 'Not connected');
    showError(`${error.message} ${ready ? 'Your local draft remains unchanged.' : 'Editing is disabled until your workspace loads.'}`); render();
  }
}
function mutate(change, redraw = true) {
  if (!ready) { showError('Connect to your workspace before making changes.'); return false; }
  try {
    const next = structuredClone(state); change(next); state = validateWorkspace(next);
    generation++; dirty = true; status(blocked ? 'Unsaved · conflict' : 'Unsaved changes');
    if (redraw) render(); applyTheme(); clearTimeout(saveTimer);
    if (!blocked) saveTimer = setTimeout(save, 550);
    return true;
  } catch (error) { notify(error.message); if ($('dialog').open) $('dialogStatus').textContent = error.message; return false; }
}
async function save() {
  clearTimeout(saveTimer);
  if (saving) return saving;
  if (!ready || !dirty || blocked) return;
  saving = (async () => {
    while (dirty && !blocked) {
      const snapshot = generation;
      status('Saving…');
      try {
        const result = await request('/api/workspace', {method: 'PUT', headers: {'Content-Type': 'application/json', 'X-Workspace-Request': '1'}, body: JSON.stringify({state, revision})});
        if (result.revision !== revision + 1) throw new Error('The server did not confirm the expected revision. Export your draft before reloading.');
        revision = result.revision; dirty = snapshot !== generation;
        $('connectionError').hidden = true; status(dirty ? 'Unsaved changes' : 'Saved to D1');
      } catch (error) {
        blocked = [401, 409].includes(error.status);
        status(blocked ? 'Unsaved · conflict' : 'Not saved');
        showError(`${error.message} Your local draft is still open. Export it before leaving this page.`);
        $('retryButton').disabled = blocked; break;
      }
    }
  })();
  try { await saving; } finally { saving = null; }
}
function render() {
  const focused = document.activeElement, focusId = focused?.dataset.id, focusAction = focused?.dataset.action;
  const all = allProposals();
  const shown = selectProposals(state, {search: $('searchInput').value, filter: $('filterInput').value, sort: $('sortInput').value});
  const progress = assessmentProgress(state);
  $('progressSummary').textContent = ready ? `${progress.complete} of ${progress.total} ideas fully scored` : 'Connect to see your assessment progress.';
  $('reviewProgress').max = progress.total;
  $('reviewProgress').value = ready ? progress.complete : 0;
  $('shortlistSummary').textContent = ready ? `${state.shortlist.length} of 4 comparison spaces used` : 'Connect to see your shortlist.';
  $('nextReviewButton').disabled = !ready;
  $('nextReviewButton').textContent = progress.next ? 'Continue reviewing ↗' : 'Compare your shortlist ↗';
  $('proposalCount').textContent = `${shown.length} of ${all.length} ideas`;
  $('shortlistCount').textContent = state.shortlist.length;
  $('proposalsContainer').setAttribute('aria-busy', 'false');
  $('proposalsContainer').innerHTML = shown.length ? shown.map(p => {
    const c = concept(p), selected = state.shortlist.includes(p.id), custom = p.id.startsWith('custom-');
    return `<article class="proposal-card${selected ? ' is-shortlisted' : ''}" data-tone="${all.findIndex(item => item.id === p.id) % 4}" aria-labelledby="title-${p.id}"><div class="card-top"><span class="proposal-number">${String(all.findIndex(item => item.id === p.id) + 1).padStart(2, '0')}</span><span class="domain">${escape(p.domain)}</span><button class="shortlist-toggle" data-action="shortlist" data-id="${p.id}" aria-pressed="${selected}" aria-label="${selected ? 'Remove' : 'Add'} ${escape(c.name)} ${selected ? 'from' : 'to'} shortlist" ${!ready ? 'disabled' : ''}>${selected ? '✓' : '＋'}</button></div><h3 id="title-${p.id}">${escape(c.name)}</h3><p class="card-description">${escape(c.desc)}</p><p class="research-question"><span>${custom ? 'YOUR CONTEXT' : 'A QUESTION TO EXPLORE'}</span>${escape(c.question)}</p><div class="card-meta"><span>${custom ? 'Your proposal' : 'Reference concept'}</span><span>${scoreLabel(p.id)}</span></div><div class="card-actions"><button class="btn btn-secondary" data-action="review" data-id="${p.id}">Review idea <span aria-hidden="true">↗</span></button><button class="quiet" data-action="share" data-id="${p.id}">Prepare vote</button>${custom ? `<button class="quiet" data-action="edit" data-id="${p.id}" ${!ready ? 'disabled' : ''}>Edit</button><button class="quiet danger" data-action="remove" data-id="${p.id}" ${!ready ? 'disabled' : ''}>Remove</button>` : ''}</div></article>`;
  }).join('') : '<section class="empty-state"><h3>No matching ideas</h3><p>Try another keyword or view all ideas.</p><button class="btn btn-secondary" data-action="reset">Clear filters</button></section>';
  if (typeof renderDrafts === 'function' && $('draftList')) renderDrafts();
  if (typeof renderTitles === 'function') renderTitles();
  if (focusId && focusAction) [...document.querySelectorAll('[data-action]')].find(el => el.dataset.id === focusId && el.dataset.action === focusAction)?.focus({preventScroll: true});
}
let drafts = [], draftsLoaded = false;
const onBoard = title => allProposals().some(p => normalizeTitle(p.title) === normalizeTitle(title));
const draftProposal = d => ({id: `custom-${crypto.randomUUID()}`, title: d.title, domain: d.domain || 'General IT', desc: d.summary || `Capstone title sent${d.author ? ` by ${d.author}` : ''} in the group chat. Add the problem and approach.`, note: `From the group chat${d.author ? ` · ${d.author}` : ''} · ${new Date(d.created_at).toLocaleDateString('en-PH', {year: 'numeric', month: 'short', day: 'numeric'})}`});
function renderDrafts() {
  const fresh = drafts.filter(d => !onBoard(d.title));
  $('draftCount').textContent = drafts.length;
  $('addAllDrafts').disabled = !ready || !fresh.length;
  $('addAllDrafts').textContent = fresh.length ? `Add all ${fresh.length} new to my board` : 'All drafts are on your board';
  if (draftsLoaded) $('draftStatus').textContent = drafts.length ? `${drafts.length} title${drafts.length === 1 ? '' : 's'} · ${fresh.length} not on your board` : 'No titles posted yet';
  $('draftList').innerHTML = drafts.length ? drafts.map(d => {
    const added = onBoard(d.title);
    const reviewed = reviewForTitle(d.title);
    return `<li class="draft-item${added ? ' is-added' : ''}"><div><h3>${escape(d.title)}</h3>${reviewed ? `<p class="draft-review"><a href="#title-${reviewed.key}">${escape(VERDICTS[reviewed.verdict])} · ${escape(FITS[reviewed.fit])} · see the review</a></p>` : ''}<p class="draft-meta"><span class="domain">${escape(d.domain)}</span>${d.author ? `<span>${escape(d.author)}</span>` : ''}<time datetime="${new Date(d.created_at).toISOString()}">${escape(new Date(d.created_at).toLocaleString('en-PH', {month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'}))}</time></p>${d.summary ? `<p class="draft-summary">${escape(d.summary)}</p>` : ''}</div><button class="btn btn-secondary" data-draft="${escape(d.id)}" ${added || !ready ? 'disabled' : ''}>${added ? 'On your board ✓' : 'Add to my board'}</button></li>`;
  }).join('') : draftsLoaded ? '<li class="draft-empty">When a member sends a title such as <q>Title: Smart Attendance Tracker</q> in the group chat, Heisenbot posts it here.</li>' : '';
}
async function loadDrafts() {
  try {
    const data = await request('/api/drafts');
    drafts = Array.isArray(data.drafts) ? data.drafts.filter(d => d && typeof d.title === 'string' && typeof d.id === 'string') : [];
    draftsLoaded = true;
  } catch (error) { $('draftStatus').textContent = `Drafts unavailable: ${error.message}`; }
  renderDrafts();
}
function addDrafts(list) {
  const room = 100 - state.custom.length, take = list.filter(d => !onBoard(d.title)).slice(0, Math.max(0, room));
  if (!take.length) { notify(room <= 0 ? 'Your board already holds 100 custom proposals.' : 'Those titles are already on your board.'); return; }
  if (mutate(next => { next.custom.push(...take.map(draftProposal)); })) notify(`${take.length} group chat title${take.length === 1 ? '' : 's'} added to your board${take.length < list.filter(d => !onBoard(d.title)).length ? '. The 100-proposal limit stopped the rest' : ''}. Check the save status for D1 confirmation.`);
}
$('draftList').addEventListener('click', event => {
  const button = event.target.closest('button[data-draft]'); if (!button) return;
  const d = drafts.find(item => item.id === button.dataset.draft); if (d) addDrafts([d]);
});
$('addAllDrafts').onclick = () => addDrafts(drafts);
$('refreshDrafts').onclick = loadDrafts;
document.addEventListener('visibilitychange', () => { if (!document.hidden && draftsLoaded) loadDrafts(); });
const allTitles = () => [...TITLE_REVIEWS, ...SUGGESTED_TITLES];
const isSettled = r => r.verdict === 'merge' || r.verdict === 'park';
const titleOnBoard = r => allProposals().some(p => normalizeTitle(p.title) === normalizeTitle(r.revised));
const titleById = key => allTitles().find(r => r.key === key);
const verdictOrder = {recommended: 0, revise: 1, merge: 2, park: 3};
const byVerdict = list => list.map((r, i) => [r, i]).sort((a, b) => verdictOrder[a[0].verdict] - verdictOrder[b[0].verdict] || a[1] - b[1]).map(([r]) => r);
const titleBadges = r => `<div class="title-head"><span class="verdict verdict-${r.verdict}">${escape(VERDICTS[r.verdict])}</span><span class="fit fit-${r.fit}">${escape(FITS[r.fit])}</span><span class="targets">${r.targets.map(x => `<abbr title="${escape(SDG17_TARGETS[x])}">${x}</abbr>`).join('')}</span></div>`;
function compactTitleCard(r) {
  const target = r.mergeInto && titleById(r.mergeInto);
  const next = target ? `<a class="compact-link" href="#title-${target.key}">Merges into: ${escape(displayTitle(target))} ↓</a>` : r.revised ? `<p class="compact-why">If revived: ${escape(r.revised)}</p>` : '';
  return `<li id="title-${r.key}" class="title-item is-compact" data-verdict="${r.verdict}" tabindex="-1">${titleBadges(r)}<h3 class="title-original-compact">${escape(r.original)}</h3><p class="compact-why">${escape(target ? r.why : `${r.why} ${r.scope} ${r.risks}`)}${r.unverified ? ` <span class="unverified">Not confirmed: ${escape(r.unverified)}</span>` : ''}</p>${next}<p class="ratio-chip">Hardware : software ${ratioLabel(r.effort)}</p></li>`;
}
function titleCard(r) {
  if (isSettled(r)) return compactTitleCard(r);
  const added = titleOnBoard(r), hw = hardwareShare(r.effort);
  return `<li id="title-${r.key}" class="title-item" data-verdict="${r.verdict}" tabindex="-1">${titleBadges(r)}${r.original ? `<p class="title-original"><span>Original</span>${escape(r.original)}</p>` : ''}<h3 class="title-revised">${escape(r.revised)}</h3><div class="ratio" role="img" aria-label="Estimated hardware ${hw} percent, software ${100 - hw} percent"><span class="ratio-hw" data-hw="${hw}"></span></div><p class="ratio-label"><strong>Hardware : software ${ratioLabel(r.effort)}</strong> · ${projectType(r.effort)} · estimate</p>${r.unverified ? '<p class="unverified-flag">Has unconfirmed points</p>' : ''}<details class="title-details"><summary>SDG 17 link, scope, risks and sources</summary><dl class="title-facts"><dt>SDG 17 link</dt><dd>${escape(r.why)}</dd><dt>Scope</dt><dd>${escape(r.scope)}</dd><dt>Risks</dt><dd>${escape(r.risks)}</dd>${r.unverified ? `<dt>Not confirmed</dt><dd class="unverified">${escape(r.unverified)}</dd>` : ''}<dt>Sources</dt><dd class="title-cites">${r.sources.map(k => `<a href="${SOURCES[k].url}" target="_blank" rel="noopener noreferrer">${escape(SOURCES[k].label)} ↗</a>`).join('')}</dd></dl></details><div class="title-item-actions"><button class="btn btn-secondary" data-title-add="${r.key}" ${added || !ready ? 'disabled' : ''}>${added ? 'On your board ✓' : 'Add revised title to my board'}</button></div></li>`;
}
let sourcesRendered = false;
function renderTitles() {
  const filters = {search: $('titleSearch').value, verdict: $('titleVerdict').value, fit: $('titleFit').value, kind: $('titleKind').value};
  const shown = byVerdict(filterTitles(TITLE_REVIEWS, filters)), suggested = filterTitles(SUGGESTED_TITLES, filters), sum = portfolioSummary(TITLE_REVIEWS);
  const main = shown.filter(r => !isSettled(r)), settled = shown.filter(isSettled);
  const pending = allTitles().filter(r => r.verdict === 'recommended' && !titleOnBoard(r));
  $('titleReviewCount').textContent = TITLE_REVIEWS.length;
  $('titleReviewStatus').textContent = `${shown.length + suggested.length} of ${TITLE_REVIEWS.length + SUGGESTED_TITLES.length} shown`;
  $('titlePortfolio').innerHTML = [['Titles reviewed', sum.total], ['Recommended', sum.recommended], ['Revise first', sum.revise], ['Merge', sum.merge], ['Park', sum.park], ['With hardware', `${sum.hardwareTitles} of ${sum.active}`], ['Average hardware effort', `${sum.hardwareShare}%`]].map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('');
  $('titleList').innerHTML = main.length ? main.map(titleCard).join('') : `<li class="draft-empty">${settled.length ? 'Only merged or parked titles match. They are listed in the group below.' : 'No reviewed titles match these filters.'}</li>`;
  $('parkedList').innerHTML = settled.map(titleCard).join('');
  $('parkedGroup').hidden = !settled.length;
  $('parkedSummary').textContent = `${settled.length} merged or parked title${settled.length === 1 ? '' : 's'}, with reasons`;
  if (isSettled({verdict: filters.verdict})) $('parkedGroup').open = true;
  $('suggestList').innerHTML = suggested.length ? suggested.map(titleCard).join('') : '<li class="draft-empty">No suggested titles match these filters.</li>';
  document.querySelectorAll('.ratio-hw[data-hw]').forEach(el => { el.style.width = `${el.dataset.hw}%`; });
  $('addRecommended').disabled = !ready || !pending.length;
  $('addRecommended').textContent = pending.length ? `Add ${pending.length} recommended to my board` : 'All recommended titles are on your board';
  if (!sourcesRendered) {
    $('titleSources').innerHTML = `<details><summary>All ${Object.keys(SOURCES).length} sources read on ${REVIEWED_ON}</summary><ul>${Object.values(SOURCES).map(x => `<li><a href="${x.url}" target="_blank" rel="noopener noreferrer">${escape(x.label)} ↗</a><span>${escape(x.tier)} · ${escape(x.date)}</span><p>${escape(x.supports)}</p></li>`).join('')}</ul></details>`;
    sourcesRendered = true;
  }
}
function addTitles(list) {
  const room = 100 - state.custom.length, fresh = list.filter(r => !isSettled(r) && !titleOnBoard(r)), take = fresh.slice(0, Math.max(0, room));
  if (!take.length) { notify(room <= 0 ? 'Your board already holds 100 custom proposals.' : 'Those revised titles are already on your board.'); return; }
  if (mutate(next => { next.custom.push(...take.map(r => titleToProposal(r, `custom-${crypto.randomUUID()}`))); })) notify(`${take.length} revised title${take.length === 1 ? '' : 's'} added to your board${take.length < fresh.length ? '. The 100-proposal limit stopped the rest' : ''}. Check the save status for D1 confirmation.`);
}
function openTitlePrint() {
  const rows = byVerdict(allTitles().filter(r => r.verdict !== 'merge'));
  openDialog('Capstone title review · SDG 17', `<p>Reviewed ${REVIEWED_ON}. Ratios are effort estimates. Partners are proposed, not confirmed.</p><div class="comparison-scroll" tabindex="0" role="region" aria-label="Title review table"><table class="comparison"><thead><tr><th scope="col">Title</th><th scope="col">Verdict</th><th scope="col">SDG 17 targets</th><th scope="col">HW : SW</th><th scope="col">Not confirmed</th></tr></thead><tbody>${rows.map(r => `<tr><th scope="row">${escape(displayTitle(r))}</th><td>${escape(VERDICTS[r.verdict])}</td><td>${r.targets.join(', ')}</td><td>${ratioLabel(r.effort)}</td><td>${escape(r.unverified || 'None noted')}</td></tr>`).join('')}</tbody></table></div><div class="actions"><button id="printTitleTable" class="btn">Print</button><button id="doneTitlePrint" class="btn btn-secondary">Done</button></div>`, 'comparison-dialog');
  $('printTitleTable').onclick = () => window.print(); $('doneTitlePrint').onclick = closeDialog;
}
document.addEventListener('click', event => {
  const jump = event.target.closest('a[href^="#title-"]');
  if (jump) document.querySelector(jump.getAttribute('href'))?.closest('details')?.setAttribute('open', '');
  const button = event.target.closest('button[data-title-add]');
  if (button) { const r = titleById(button.dataset.titleAdd); if (r) addTitles([r]); }
});
$('addRecommended').onclick = () => addTitles(allTitles().filter(r => r.verdict === 'recommended'));
$('printTitles').onclick = openTitlePrint;
$('titleSearch').oninput = $('titleVerdict').onchange = $('titleFit').onchange = $('titleKind').onchange = renderTitles;
function openDialog(title, body, className = '') {
  returnFocus = document.activeElement; editDirty = false;
  $('dialog').className = className;
  $('dialogBody').innerHTML = `<h2 id="dialogTitle" tabindex="-1">${escape(title)}</h2>${body}`;
  $('dialogStatus').textContent = ''; $('dialog').showModal(); $('dialogTitle').focus(); syncMotion();
}
function closeDialog() {
  if (editDirty && !window.confirm('Discard unsaved proposal edits? Your saved proposal will stay unchanged.')) return;
  editDirty = false; $('dialog').close();
}
$('dialog').addEventListener('cancel', event => { event.preventDefault(); closeDialog(); });
$('dialog').addEventListener('keydown', event => {
  if (event.key !== 'Tab') return;
  const controls = [...$('dialog').querySelectorAll('button, a[href], input, select, textarea, summary, [tabindex]')].filter(el => !el.disabled && el.tabIndex >= 0 && el.getClientRects().length);
  const first = controls[0], last = controls.at(-1);
  if (!first) { event.preventDefault(); $('dialogTitle').focus(); return; }
  if (event.shiftKey && (document.activeElement === first || document.activeElement === $('dialogTitle'))) { event.preventDefault(); last.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
});
$('dialog').addEventListener('close', () => {
  syncMotion();
  let target = returnFocus;
  if (!target?.isConnected && target?.dataset.id) target = [...document.querySelectorAll('[data-action]')].find(el => el.dataset.id === returnFocus.dataset.id && el.dataset.action === returnFocus.dataset.action);
  target = target?.isConnected ? target : $('boardHeading');
  if (!target.hasAttribute('tabindex') && target.tagName.startsWith('H')) target.tabIndex = -1;
  target.focus({preventScroll: true});
});
function confirmAction(title, description, label, action) {
  openDialog(title, `<p>${escape(description)}</p><div class="actions"><button class="btn btn-secondary" id="cancelAction">Cancel</button><button class="btn" id="confirmAction">${escape(label)}</button></div>`);
  $('cancelAction').onclick = closeDialog;
  $('confirmAction').onclick = async () => { $('confirmAction').disabled = true; try { await action(); } catch (error) { $('dialogStatus').textContent = error.message; if ($('confirmAction')) $('confirmAction').disabled = false; } };
}
function openReview(id) {
  const p = allProposals().find(item => item.id === id), c = concept(p), review = reviewFor(id);
  openDialog(c.name, `<p class="domain">${escape(p.domain)}</p><p>${escape(c.desc)}</p>${CONCEPTS[id] ? `<details class="original-reference"><summary>Original reference wording · claims unverified</summary><h3>${escape(p.title)}</h3><p>${escape(p.desc)}</p><p>${escape(p.note)}</p></details>` : `<p>${escape(p.note)}</p>`}<h3>Your assessment</h3><p class="help">Optional subjective scores: 1 = low, 5 = high. Leave unknowns unscored. Changes save automatically to your browser-linked workspace.</p><div class="score-grid">${CRITERIA.map((label, i) => `<label for="score-${i}">${label}<select id="score-${i}" ${!ready ? 'disabled' : ''}><option value="">Unscored</option>${[1, 2, 3, 4, 5].map(n => `<option value="${n}" ${review.scores[i] === n ? 'selected' : ''}>${n}${n === 1 ? ' · Low' : n === 5 ? ' · High' : ''}</option>`).join('')}</select></label>`).join('')}</div><p id="overallScore" class="score-summary">Overall: ${scoreLabel(id)}</p><p class="help">Equal-weight mean = sum ÷ 4, only when all four scores are present.</p><label for="reviewNotes">Review notes and open questions</label><textarea id="reviewNotes" rows="5" maxlength="6000" ${!ready ? 'disabled' : ''}>${escape(review.notes)}</textarea><div class="actions"><button class="btn" id="saveReview" ${!ready ? 'disabled' : ''}>Save review now</button><button class="btn btn-secondary" id="doneReview">Done</button></div>`);
  const update = () => {
    const value = {scores: CRITERIA.map((_, i) => $(`score-${i}`).value === '' ? null : Number($(`score-${i}`).value)), notes: $('reviewNotes').value};
    if (mutate(next => { next.reviews[id] = value; })) $('overallScore').textContent = `Overall: ${scoreLabel(id)}`;
  };
  CRITERIA.forEach((_, i) => $(`score-${i}`).addEventListener('change', update));
  $('reviewNotes').addEventListener('input', update);
  $('saveReview').onclick = async () => { await save(); $('dialogStatus').textContent = dirty ? 'Not saved. Your draft remains open; see the workspace save issue.' : 'Review saved to D1.'; };
  $('doneReview').onclick = closeDialog;
}
function openEdit(id) {
  const proposal = state.custom.find(p => p.id === id);
  if (!ready || !proposal) return;
  openDialog('Refine your proposal', `<p>Keep the same idea, shortlist entry, and review. Edits only apply when you choose Update proposal.</p><form id="editProposalForm"><label for="editTitle">Project title (required)</label><input id="editTitle" required maxlength="240" value="${escape(proposal.title)}"><label for="editDomain">Domain or category</label><input id="editDomain" maxlength="100" value="${escape(proposal.domain)}"><label for="editDescription">Problem and proposed approach (required)</label><textarea id="editDescription" required maxlength="4000" rows="5">${escape(proposal.desc)}</textarea><label for="editContext">Evidence needs or context</label><textarea id="editContext" maxlength="2000" rows="3">${escape(proposal.note)}</textarea><p id="editError" class="form-error" role="alert"></p><div class="actions"><button class="btn" type="submit">Update proposal</button><button id="cancelEdit" class="btn btn-secondary" type="button">Cancel</button></div></form>`);
  $('editProposalForm').addEventListener('input', () => { editDirty = true; });
  $('cancelEdit').onclick = closeDialog;
  $('editProposalForm').onsubmit = async event => {
    event.preventDefault();
    const updated = {id, title: $('editTitle').value.trim(), domain: $('editDomain').value.trim() || 'General IT', desc: $('editDescription').value.trim(), note: $('editContext').value.trim()};
    try { validateWorkspace({...state, custom: state.custom.map(p => p.id === id ? updated : p)}); }
    catch (error) { $('editError').textContent = error.message; return; }
    if (mutate(next => { next.custom = next.custom.map(p => p.id === id ? updated : p); })) {
      editDirty = false; closeDialog(); await save();
      notify(dirty ? 'Proposal updated in your draft. Saving needs attention; export before leaving.' : 'Proposal updated and saved to D1. Your review and shortlist were preserved.');
    }
  };
}
function openCompare() {
  const selected = state.shortlist.map(id => allProposals().find(p => p.id === id));
  if (!selected.length) { openDialog('Your shortlist starts here', '<p>Use the plus button on a proposal to shortlist it. You can compare up to four ideas.</p><button id="backToBoard" class="btn">Explore proposals</button>'); $('backToBoard').onclick = closeDialog; return; }
  const cell = value => `<td>${escape(value)}</td>`;
  const rows = [['Concept', p => concept(p).desc], ['Question / context', p => concept(p).question], ...CRITERIA.map((name, i) => [name, p => reviewFor(p.id).scores[i] ?? 'Unscored']), ['Overall · sum ÷ 4', p => scoreLabel(p.id)], ['Review notes', p => reviewFor(p.id).notes || 'No notes yet']];
  openDialog('Compare your shortlist', `<p>Personal assessments, not a team result. Unscored criteria stay unknown.</p><div class="comparison-scroll" tabindex="0" role="region" aria-label="Proposal comparison table"><table class="comparison"><caption>Gawk Capstoney · Decision target: January 31, 2027 (Philippine time)</caption><thead><tr><th scope="col">Review criteria</th>${selected.map(p => `<th scope="col">${escape(concept(p).name)}</th>`).join('')}</tr></thead><tbody>${rows.map(([label, value]) => `<tr><th scope="row">${label}</th>${selected.map(p => cell(value(p))).join('')}</tr>`).join('')}</tbody></table></div><p class="help">Concepts require validation. Similarity does not prove plagiarism; citations do not establish compliance.</p><div class="actions"><button id="printComparison" class="btn">Print comparison</button><button id="doneCompare" class="btn btn-secondary">Done</button></div>`, 'comparison-dialog');
  $('printComparison').onclick = () => window.print(); $('doneCompare').onclick = closeDialog;
}
function openShare(id) {
  const p = allProposals().find(item => item.id === id);
  openDialog('Prepare a vote message', `<p>Review this text, then send it yourself. This app does not submit, tally, or confirm delivery of votes.</p><label for="voteText">Your message</label><textarea id="voteText" rows="5" maxlength="8000">${escape(`I vote for: ${p.title}`)}</textarea><div class="actions"><button id="copyVote" class="btn">Copy text</button><button id="shareVote" class="btn btn-secondary">Share with device</button><a id="messengerLink" class="btn btn-secondary" href="${MESSENGER_THREAD_URL}" target="_blank" rel="noopener noreferrer">Open Messenger ↗</a></div><p class="help">Paste your message in the existing thread and check its recipients before sending.</p>`);
  $('copyVote').onclick = async () => {
    try { if (!navigator.clipboard) throw new Error(); await navigator.clipboard.writeText($('voteText').value); $('dialogStatus').textContent = 'Text copied. No vote has been sent by this app.'; }
    catch { $('voteText').focus(); $('voteText').select(); $('dialogStatus').textContent = 'Clipboard unavailable. Text selected; use your device’s Copy command. Nothing was sent.'; }
  };
  $('shareVote').disabled = !navigator.share;
  if (!navigator.share) $('shareVote').textContent = 'Device sharing unavailable';
  $('shareVote').onclick = async () => {
    try { await navigator.share({title: 'Capstone vote message', text: $('voteText').value}); $('dialogStatus').textContent = 'Device sharing finished. Delivery is not confirmed by this app.'; }
    catch (error) { $('dialogStatus').textContent = error.name === 'AbortError' ? 'Sharing canceled. Messenger was not opened.' : 'Sharing unavailable or failed. You can copy the text instead.'; }
  };
  $('messengerLink').onclick = () => { $('dialogStatus').textContent = 'Messenger link selected. This app cannot confirm that a window opened or a message was delivered.'; };
}
function downloadBackup(prefix = 'capstoney-backup') {
  const url = URL.createObjectURL(new Blob([JSON.stringify(makeBackup(state), null, 2)], {type: 'application/json'}));
  const link = document.createElement('a'); link.href = url; link.download = `${prefix}-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
  document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 30000);
}
function importState(candidate) {
  const capturedGeneration = generation;
  openDialog('Import workspace backup', `<p>This replaces your current custom proposals, shortlist, reviews, and theme. The four reference proposals remain.</p><p>Incoming: ${candidate.custom.length} custom proposals, ${candidate.shortlist.length} shortlisted, ${Object.keys(candidate.reviews).length} review records.</p><ol><li>Download a backup of your current workspace.</li><li>Verify the downloaded file exists, then confirm replacement.</li></ol><button id="preImportBackup" class="btn btn-secondary">Download pre-import backup</button><label class="check-label"><input id="backupConfirmed" type="checkbox" disabled> I verified my pre-import backup file.</label><div class="actions"><button id="cancelImport" class="btn btn-secondary">Cancel</button><button id="confirmImport" class="btn" disabled>Replace workspace</button></div>`);
  $('cancelImport').onclick = closeDialog;
  $('preImportBackup').onclick = () => { downloadBackup('capstoney-pre-import'); $('backupConfirmed').disabled = false; $('dialogStatus').textContent = 'Backup download requested. Check your downloads before continuing.'; };
  $('backupConfirmed').onchange = () => $('confirmImport').disabled = !$('backupConfirmed').checked;
  $('confirmImport').onclick = async () => {
    if (capturedGeneration !== generation) { $('dialogStatus').textContent = 'Your workspace changed. Cancel and start the import again to create a current backup.'; return; }
    if (mutate(next => Object.assign(next, candidate))) { closeDialog(); await save(); notify(dirty ? 'Imported into the local draft, but not saved. Export it and resolve the save issue.' : 'Backup imported and saved to D1.'); }
  };
}
$('importFile').addEventListener('change', async event => {
  const file = event.target.files[0]; event.target.value = ''; if (!file) return;
  try {
    if (file.size > 1048576) throw new Error('Backup file exceeds 1 MB.');
    importState(parseBackup(JSON.parse(await file.text())));
  } catch (error) { notify(`Import rejected. ${error.message} Your workspace was not replaced.`); }
});
function openRecovery() {
  openDialog('Recover old proposals', `<p>Recovery reads <code>custom_proposals_v2</code> only in this browser and this origin. A Cloudflare address cannot read data from GitHub Pages. Old data will not be deleted.</p><p>If nothing is found, open the original site in the original browser, then copy your proposal text into “Add an idea”.</p><button id="readLegacy" class="btn">Check this browser’s old data</button><p id="legacyResult" role="status"></p><button id="confirmRecovery" class="btn btn-secondary" hidden>Add recovered proposals</button>`);
  $('readLegacy').onclick = () => {
    $('confirmRecovery').hidden = true;
    try {
      const raw = localStorage.getItem('custom_proposals_v2');
      if (!raw) { $('legacyResult').textContent = 'No old proposals found at this origin. Other origins cannot be checked here.'; return; }
      if (raw.length > 1048576) throw new Error('Legacy data is too large to recover here.');
      const recovered = recoverLegacy(JSON.parse(raw), state);
      $('legacyResult').textContent = `${recovered.added} proposals can be added; ${recovered.skipped} duplicate titles skipped. Existing reviews and shortlist will remain.`;
      $('confirmRecovery').hidden = recovered.added === 0;
      $('confirmRecovery').onclick = async () => {
        try {
          const current = recoverLegacy(JSON.parse(raw), state);
          if (mutate(next => Object.assign(next, current.state))) { closeDialog(); await save(); notify(`${current.added} proposals recovered${dirty ? ' into the unsaved draft' : ' and saved to D1'}. Old browser data was not changed.`); }
        } catch (error) { $('dialogStatus').textContent = error.message; }
      };
    } catch (error) { $('legacyResult').textContent = `Recovery stopped: ${error.message} No data was changed.`; }
  };
}
$('proposalsContainer').addEventListener('click', event => {
  const button = event.target.closest('button[data-action]'); if (!button) return;
  const {action, id} = button.dataset;
  if (action === 'reset') { $('searchInput').value = ''; $('filterInput').value = 'all'; render(); $('searchInput').focus(); }
  if (action === 'review') openReview(id);
  if (action === 'edit') openEdit(id);
  if (action === 'share') openShare(id);
  if (action === 'shortlist') mutate(next => { next.shortlist = next.shortlist.includes(id) ? next.shortlist.filter(value => value !== id) : [...next.shortlist, id]; });
  if (action === 'remove') confirmAction('Remove this proposal?', 'Its review and shortlist entry will also be removed. Export a backup first if you want to keep them.', 'Remove proposal', async () => {
    if (mutate(next => { next.custom = next.custom.filter(p => p.id !== id); next.shortlist = next.shortlist.filter(value => value !== id); delete next.reviews[id]; })) { closeDialog(); await save(); notify(dirty ? 'Removed in the local draft. Saving needs attention.' : 'Proposal removed and saved to D1.'); }
  });
});
$('proposalForm').addEventListener('submit', event => {
  event.preventDefault(); $('formError').textContent = '';
  const p = {id: `custom-${crypto.randomUUID()}`, title: $('newTitle').value.trim(), domain: $('newDomain').value.trim() || 'General IT', desc: $('newDesc').value.trim(), note: $('newNote').value.trim()};
  try { validateWorkspace({...state, custom: [...state.custom, p]}); }
  catch (error) { $('formError').textContent = error.message; return; }
  if (mutate(next => next.custom.push(p))) { $('proposalForm').reset(); $('smartPasteInput').value = ''; notify('Proposal added to your workspace draft. Check the save status for D1 confirmation.'); $('searchInput').value = ''; $('filterInput').value = 'all'; render(); }
});
$('formatButton').onclick = () => {
  const apply = () => {
    try {
      const parsed = formatNotes($('smartPasteInput').value);
      [['newTitle', 'title'], ['newDomain', 'domain'], ['newDesc', 'desc'], ['newNote', 'note']].forEach(([id, key]) => $(id).value = parsed[key]);
      $('formError').textContent = 'Fields formatted. Review the text, fill any missing description, then add the proposal.'; $('newTitle').focus();
    } catch (error) { $('formError').textContent = error.message; }
  };
  if (['newTitle', 'newDomain', 'newDesc', 'newNote'].some(id => $(id).value)) confirmAction('Replace these form fields?', 'Formatting will replace your current unsaved proposal fields. Your saved proposals will not change.', 'Replace fields', () => { closeDialog(); apply(); });
  else apply();
};
$('closeDialog').onclick = closeDialog;
$('compareButton').onclick = $('boardCompareButton').onclick = openCompare;
$('searchInput').oninput = $('filterInput').onchange = $('sortInput').onchange = render;
$('nextReviewButton').onclick = () => { const next = assessmentProgress(state).next; if (next) openReview(next); else openCompare(); };
$('dismissNotice').onclick = () => { $('noticeRegion').hidden = true; $('boardHeading').tabIndex = -1; $('boardHeading').focus({preventScroll: true}); };
$('themeButton').onclick = () => { if (ready) mutate(next => next.theme = next.theme === 'light' ? 'dark' : 'light'); else { state.theme = state.theme === 'light' ? 'dark' : 'light'; applyTheme(); notify('Theme changed for this view only. Connect to save your preference.'); } };
$('exportButton').onclick = () => { downloadBackup(); notify('Backup download requested, including your local workspace draft. Unsaved add-form fields are not included. Verify the file in your downloads.'); };
$('importButton').onclick = () => $('importFile').click();
$('recoverButton').onclick = openRecovery;
$('retryButton').onclick = async () => { if (!ready) await load(); else await save(); };
$('reloadButton').onclick = () => confirmAction('Reload the saved workspace?', 'This discards your unsaved local workspace changes. Export your draft first. Unsaved proposal form fields remain on this page.', 'Reload saved workspace', async () => { await saving; clearTimeout(saveTimer); closeDialog(); await load(); });
window.addEventListener('beforeunload', event => { if (dirty || editDirty || ['newTitle', 'newDomain', 'newDesc', 'newNote', 'smartPasteInput'].some(id => $(id).value.trim())) { event.preventDefault(); event.returnValue = ''; } });
const ambient = $('ambientVideo'), motionButton = $('motionButton');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const connection = navigator.connection;
let motionWanted = !reducedMotion.matches && !connection?.saveData, mediaVisible = false, mediaFailed = false;
function updateMotionControl() {
  const restricted = reducedMotion.matches || connection?.saveData;
  motionButton.disabled = !!restricted || mediaFailed;
  motionButton.textContent = mediaFailed ? 'Motion unavailable' : restricted ? 'Motion off · device preference' : !ambient.paused ? 'Pause motion' : 'Play motion';
  motionButton.setAttribute('aria-pressed', String(!ambient.paused));
}
function syncMotion() {
  const shouldPlay = motionWanted && mediaVisible && !document.hidden && !$('dialog').open && !reducedMotion.matches && !connection?.saveData && !mediaFailed;
  if (!shouldPlay) { ambient.pause(); updateMotionControl(); return; }
  if (!ambient.hasAttribute('src')) ambient.src = '/static/idea-orbit.mp4';
  ambient.play().catch(error => {
    if (error.name !== 'AbortError') { motionWanted = false; updateMotionControl(); }
  });
}
motionButton.onclick = () => { motionWanted = ambient.paused; syncMotion(); };
ambient.addEventListener('play', updateMotionControl);
ambient.addEventListener('pause', updateMotionControl);
ambient.addEventListener('error', () => { mediaFailed = true; ambient.pause(); updateMotionControl(); });
reducedMotion.addEventListener('change', () => { if (reducedMotion.matches) motionWanted = false; syncMotion(); });
connection?.addEventListener('change', () => { if (connection.saveData) motionWanted = false; syncMotion(); });
document.addEventListener('visibilitychange', syncMotion);
window.addEventListener('pagehide', () => ambient.pause());
window.addEventListener('pageshow', syncMotion);
if ('IntersectionObserver' in window) new IntersectionObserver(entries => { mediaVisible = entries[0].isIntersecting; syncMotion(); }, {threshold: 0}).observe(ambient);
else { mediaVisible = true; syncMotion(); }
updateMotionControl(); render(); load(); loadDrafts();
