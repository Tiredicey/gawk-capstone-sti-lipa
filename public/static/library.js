import {normalizeTitle} from './model.js';

export const LIBRARY_PAGE = 20;

export function filterLibrary(list, {search = '', theme = 'all', track = 'all', verdict = 'all', fit = 'all', target = 'all', kind = 'all', changed = 'all'} = {}) {
  const query = normalizeTitle(search);
  return list.filter(r => (theme === 'all' || r.theme === theme)
    && (track === 'all' || r.track === track)
    && (verdict === 'all' || r.verdict === verdict)
    && (fit === 'all' || r.fit === fit)
    && (target === 'all' || r.targets.includes(target))
    && (kind === 'all' || (kind === 'hardware' ? r.hw === 1 : r.hw === 0))
    && (changed === 'all' || (changed === 'changed' ? Boolean(r.check) : !r.check))
    && (!query || normalizeTitle([r.n, r.title, r.why, r.office, r.open, r.scope, ...r.notes, ...r.cites.map(c => `${c[0]} ${c[1]}`), r.targets.join(' ')].join(' ')).includes(query)));
}

export function librarySummary(list) {
  const count = (k, v) => list.filter(r => r[k] === v).length;
  const targets = {};
  for (const r of list) for (const t of r.targets) targets[t] = (targets[t] || 0) + 1;
  return {
    total: list.length,
    recommended: count('verdict', 'recommended'), revise: count('verdict', 'revise'), merge: count('verdict', 'merge'),
    strong: count('fit', 'strong'), moderate: count('fit', 'moderate'), weak: count('fit', 'weak'),
    bsit: count('track', 'B'), msit: count('track', 'M'), doctoral: count('track', 'D'),
    hardware: count('hw', 1), changed: list.filter(r => r.check).length, institutional: count('institutional', 1),
    laws: new Set(list.flatMap(r => r.cites.map(c => c[2]))).size, targets
  };
}

export function libraryToProposal(r, offices, id) {
  const basis = r.cites.map(c => c[0]).join('; ') || 'Institutional basis (CHED CMO 25 s.2015, STI capstone guideline)';
  return {
    id,
    title: r.title.slice(0, 240),
    domain: `SDG 17 · ${r.targets.join(', ')}`,
    desc: `${r.why}\n\nProposed partner: ${offices[r.office] || r.office}\nLegal basis: ${basis}${r.scope ? `\n\nBSIT scope: ${r.scope}` : ''}`.slice(0, 4000),
    note: `From the 513-title research library, item ${r.n}.${r.open ? `\nOpen point: ${r.open}` : ''}${r.notes.length ? `\nNotes: ${r.notes.join(' ')}` : ''}\nSources: ${[...new Set(r.cites.map(c => c[2]))].join(' ')}`.slice(0, 2000)
  };
}
