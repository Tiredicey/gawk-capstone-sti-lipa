
export const TARGET_DATE = new Date('2027-01-31T23:59:59+08:00');
export const MESSENGER_THREAD_URL = 'https://www.facebook.com/messages/t/1629525598528599';

export const DEFAULT_PROPOSALS = [
      {
        id: 'default-1',
        title: 'TricyRoute Lipa: Ordinance-Compliant Dispatch and Fare Auditing Engine',
        domain: 'Municipal Transport',
        desc: 'Automated dispatch and fare calculation layer. Deters passenger overcharging through tamper-evident digital receipts, checks routes against local MTOP boundaries, and blocks transit on restricted national highways.',
        note: 'Regulatory anchor: R.A. 7160 Sec. 458, DILG MC 2023-195, and R.A. 10173 data privacy rules. Requires certified Lipa City fare ordinance.'
      },
      {
        id: 'default-2',
        title: 'CodeProvenance: AST and Git Telemetry Engine',
        domain: 'AST Code Analysis',
        desc: 'Evaluates Git commit cadence and builds Abstract Syntax Trees to detect structural source code plagiarism even when variable names, comments, and file names change.',
        note: 'Academic focus: Static source tree comparison without runtime execution overhead.'
      },
      {
        id: 'default-3',
        title: 'ByteCheck: Compiler Bytecode and Intermediate Representation Matcher',
        domain: 'Binary Analysis',
        desc: 'Compares compiled bytecode formats (Java Bytecode and LLVM IR) to identify refactored plagiarism across compiled student projects.',
        note: 'Academic focus: Neutralizes cosmetic refactoring at the compiler optimization stage.'
      },
      {
        id: 'default-4',
        title: 'AlgoGuard: Control-Flow Graph Similarity Scanner',
        domain: 'Logic Path Analysis',
        desc: 'Constructs program execution control-flow graphs (CFGs) to detect algorithmic theft translated across different programming languages.',
        note: 'Academic focus: Language-agnostic logic path isomorphism.'
      }
    ];

export const CRITERIA = ['Problem value', 'Build feasibility', 'Data access', 'Research clarity'];
export const CONCEPTS = {
  'default-1': {name: 'TricyRoute Lipa', desc: 'Explore tricycle dispatch, fare calculations, and route checks using verified local transport rules.', question: 'Can the team obtain current Lipa fare ordinances and authorized route data?'},
  'default-2': {name: 'CodeProvenance', desc: 'Explore structural source-code similarity through abstract syntax trees and Git activity for human review.', question: 'Which languages, consented datasets, and similarity baselines can the team evaluate?'},
  'default-3': {name: 'ByteCheck', desc: 'Study similarities in Java bytecode or LLVM intermediate representation under defined compilation settings.', question: 'How will compiler versions and optimization settings affect comparisons?'},
  'default-4': {name: 'AlgoGuard', desc: 'Investigate control-flow graph similarity for a bounded set of languages and program types.', question: 'What evidence would support comparison across the selected languages?'}
};
export const emptyState = () => ({version: 1, custom: [], shortlist: [], reviews: {}, theme: 'light'});
export const normalizeTitle = title => title.normalize('NFKC').trim().replace(/\s+/g, ' ').toLowerCase();
export const overallScore = scores => scores?.length === 4 && scores.every(n => Number.isInteger(n) && n >= 1 && n <= 5) ? scores.reduce((a, b) => a + b, 0) / 4 : null;
const check = (condition, message) => { if (!condition) throw new Error(message); };
const keys = (value, names, label) => check(value && typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === names.length && names.every(k => Object.hasOwn(value, k)), `Invalid ${label} fields.`);
const text = (value, max, label, required = false) => {
  check(typeof value === 'string' && value.length <= max && (!required || value.trim().length > 0), `${label} must be ${required ? 'nonempty text' : 'text'} up to ${max} characters.`);
  return required ? value.trim() : value;
};
export function validateWorkspace(input) {
  keys(input, ['version', 'custom', 'shortlist', 'reviews', 'theme'], 'workspace');
  check(input.version === 1, 'Unsupported workspace version.');
  check(['light', 'dark'].includes(input.theme), 'Invalid theme.');
  check(Array.isArray(input.custom) && input.custom.length <= 100, 'Use at most 100 custom proposals.');
  const custom = input.custom.map(p => {
    keys(p, ['id', 'title', 'domain', 'desc', 'note'], 'proposal');
    check(typeof p.id === 'string' && /^custom-[a-zA-Z0-9-]{1,70}$/.test(p.id), 'Invalid custom proposal ID.');
    return {id: p.id, title: text(p.title, 240, 'Title', true), domain: text(p.domain, 100, 'Domain', true), desc: text(p.desc, 4000, 'Description', true), note: text(p.note, 2000, 'Context')};
  });
  const all = [...DEFAULT_PROPOSALS, ...custom], ids = new Set(all.map(p => p.id));
  check(ids.size === all.length && new Set(all.map(p => normalizeTitle(p.title))).size === all.length, 'A proposal with this title or ID already exists.');
  check(Array.isArray(input.shortlist) && input.shortlist.length <= 4 && new Set(input.shortlist).size === input.shortlist.length && input.shortlist.every(id => ids.has(id)), 'Choose up to four distinct, existing proposals.');
  check(input.reviews && typeof input.reviews === 'object' && !Array.isArray(input.reviews), 'Invalid reviews.');
  const reviews = {};
  for (const [id, review] of Object.entries(input.reviews)) {
    check(ids.has(id), 'Review references an unknown proposal.');
    keys(review, ['scores', 'notes'], 'review');
    check(Array.isArray(review.scores) && review.scores.length === 4 && review.scores.every(n => n === null || Number.isInteger(n) && n >= 1 && n <= 5), 'Scores must be 1–5 or unscored.');
    reviews[id] = {scores: [...review.scores], notes: text(review.notes, 6000, 'Review notes')};
  }
  const state = {version: 1, custom, shortlist: [...input.shortlist], reviews, theme: input.theme};
  check(new TextEncoder().encode(JSON.stringify({state, revision: Number.MAX_SAFE_INTEGER})).length <= 262144, 'Workspace exceeds 256 KB. Export a backup, then shorten notes or remove unused custom proposals.');
  return state;
}
export function parseBackup(input) {
  keys(input, ['format', 'version', 'exportedAt', 'state'], 'backup');
  check(input.format === 'capstoney-workspace' && input.version === 1 && typeof input.exportedAt === 'string' && !Number.isNaN(Date.parse(input.exportedAt)), 'Unsupported backup format or date.');
  return validateWorkspace(input.state);
}
export const makeBackup = state => ({format: 'capstoney-workspace', version: 1, exportedAt: new Date().toISOString(), state: validateWorkspace(state)});
export function formatNotes(raw) {
  const lines = raw.trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
  check(lines.length > 0, 'Paste some notes first.');
  let title = '', domain = '', note = '', description = [];
  for (const line of lines) {
    const match = line.match(/^(title|project title|domain|category|summary|description|note|notes|context)\s*:\s*(.*)$/i);
    if (match) {
      const key = match[1].toLowerCase();
      if (['title', 'project title'].includes(key)) title = match[2];
      else if (['domain', 'category'].includes(key)) domain = match[2];
      else if (['note', 'notes', 'context'].includes(key)) note += (note ? '\n' : '') + match[2];
      else description.push(match[2]);
    } else if (!title) title = line.replace(/^(?:\d+[.)]\s*|-\s*)/, '');
    else description.push(line);
  }
  const category = title.match(/\s*\(([^()]*)\)\s*$/);
  if (category && !domain) { domain = category[1]; title = title.slice(0, category.index); }
  return {title: text(title, 240, 'Title', true), domain: text(domain || 'General IT', 100, 'Domain', true), desc: text(description.join('\n'), 4000, 'Description'), note: text(note, 2000, 'Context')};
}
export function recoverLegacy(input, state) {
  check(Array.isArray(input) && input.length <= 100, 'Legacy data must be an array of up to 100 proposals.');
  const next = structuredClone(state);
  let skipped = 0;
  for (const p of input) {
    check(p && typeof p === 'object' && typeof p.title === 'string', 'Malformed legacy proposal. Nothing was recovered.');
    if ([...DEFAULT_PROPOSALS, ...next.custom].some(item => normalizeTitle(item.title) === normalizeTitle(p.title))) { skipped++; continue; }
    next.custom.push({id: `custom-${crypto.randomUUID()}`, title: p.title, domain: p.domain || 'General IT', desc: p.desc, note: p.note || ''});
  }
  return {state: validateWorkspace(next), added: next.custom.length - state.custom.length, skipped};
}

