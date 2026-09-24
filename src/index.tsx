import {Hono} from 'hono';
import {getCookie, setCookie} from 'hono/cookie';
import {bodyLimit} from 'hono/body-limit';
import {secureHeaders} from 'hono/secure-headers';
import {serveStatic} from 'hono/cloudflare-workers';
import {emptyState, validateWorkspace, validateDraftBatch, referenceTitles} from '../public/static/model.js';
import page from './page.html?raw';

const app = new Hono();
const validToken = token => typeof token === 'string' && /^[a-f0-9]{64}$/.test(token);
const hex = bytes => Array.from(bytes, v => v.toString(16).padStart(2, '0')).join('');
const hash = async token => hex(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token))));

app.use('*', secureHeaders({contentSecurityPolicy: {defaultSrc: ["'self'"], scriptSrc: ["'self'"], styleSrc: ["'self'"], connectSrc: ["'self'"], imgSrc: ["'self'", 'data:'], objectSrc: ["'none'"], baseUri: ["'none'"], frameAncestors: ["'none'"], formAction: ["'self'"]}, referrerPolicy: 'no-referrer'}));
app.use('/static/*', serveStatic({root: './public'}));
app.use('/api/*', async (c, next) => {
  c.header('Cache-Control', 'no-store');
  if (!['GET', 'HEAD'].includes(c.req.method) && !c.req.path.startsWith('/api/intake') && (c.req.header('Origin') !== new URL(c.req.url).origin || c.req.header('X-Workspace-Request') !== '1')) return c.json({error: 'Request must come from this workspace.'}, 403);
  await next();
});
app.use('/api/*', bodyLimit({maxSize: 262144, onError: c => c.json({error: 'Workspace exceeds 256 KB.'}, 413)}));

app.get('/api/workspace', async c => {
  let token = getCookie(c, 'capstone_workspace');
  if (!validToken(token)) {
    token = hex(crypto.getRandomValues(new Uint8Array(32)));
    setCookie(c, 'capstone_workspace', token, {httpOnly: true, sameSite: 'Strict', secure: new URL(c.req.url).protocol === 'https:', maxAge: 31536000, path: '/'});
  }
  const id = await hash(token);
  await c.env.DB.prepare('INSERT OR IGNORE INTO workspaces(id,data) VALUES(?,?)').bind(id, JSON.stringify(emptyState())).run();
  const row = await c.env.DB.prepare('SELECT data,revision FROM workspaces WHERE id=?').bind(id).first();
  return c.json({state: validateWorkspace(JSON.parse(row.data)), revision: row.revision});
});

app.put('/api/workspace', async c => {
  const token = getCookie(c, 'capstone_workspace');
  if (!validToken(token)) return c.json({error: 'Enable cookies and reload before saving.'}, 401);
  if (c.req.header('Content-Type')?.split(';')[0].trim() !== 'application/json') return c.json({error: 'Send application/json.'}, 415);
  let body;
  try { body = await c.req.json(); } catch { return c.json({error: 'Invalid JSON.'}, 400); }
  let state;
  try {
    if (!body || Object.keys(body).length !== 2 || !Object.hasOwn(body, 'state') || !Number.isSafeInteger(body.revision) || body.revision < 0 || body.revision === Number.MAX_SAFE_INTEGER) throw new Error('Invalid workspace revision or request fields.');
    state = validateWorkspace(body.state);
  } catch (error) { return c.json({error: error.message}, 400); }
  const result = await c.env.DB.prepare('UPDATE workspaces SET data=?,revision=revision+1 WHERE id=? AND revision=?').bind(JSON.stringify(state), await hash(token), body.revision).run();
  if (!result.meta.changes) return c.json({error: 'The saved revision changed. Export your local draft before reloading the saved workspace. No overwrite was performed.'}, 409);
  return c.json({revision: body.revision + 1});
});

const draftColumns = 'id,title,domain,summary,author,source,created_at';
const intakeAuth = async (c, next) => {
  const secret = c.env.INTAKE_TOKEN;
  if (typeof secret !== 'string' || secret.length < 24) return c.json({error: 'Intake is not configured. Set the INTAKE_TOKEN secret on this Cloudflare project.'}, 503);
  const given = (c.req.header('Authorization') || '').replace(/^Bearer\s+/i, '');
  const [a, b] = await Promise.all([hash(given), hash(secret)]);
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  if (diff || !given) return c.json({error: 'Invalid intake token.'}, 401);
  await next();
};

app.get('/api/drafts', async c => {
  const {results} = await c.env.DB.prepare(`SELECT ${draftColumns} FROM drafts WHERE hidden=0 ORDER BY created_at DESC,rowid DESC LIMIT 300`).all();
  return c.json({drafts: results});
});

app.get('/api/intake', intakeAuth, async c => {
  const row = await c.env.DB.prepare('SELECT COUNT(*) AS n FROM drafts WHERE hidden=0').first();
  return c.json({ok: true, drafts: row.n});
});

app.post('/api/intake', intakeAuth, async c => {
  if (c.req.header('Content-Type')?.split(';')[0].trim() !== 'application/json') return c.json({error: 'Send application/json.'}, 415);
  let drafts;
  try { drafts = validateDraftBatch(await c.req.json()); } catch (error) { return c.json({error: error instanceof SyntaxError ? 'Invalid JSON.' : error.message}, 400); }
  const reference = referenceTitles(), added = [], skipped = [], now = Date.now();
  const fresh = drafts.filter(d => { if (reference.has(d.norm)) { skipped.push({title: d.title, reason: 'reference proposal'}); return false; } return true; });
  if (fresh.length) {
    const results = await c.env.DB.batch(fresh.map((d, i) => c.env.DB.prepare('INSERT OR IGNORE INTO drafts(id,title,norm,domain,summary,author,source,created_at) VALUES(?,?,?,?,?,?,?,?)').bind(`draft-${crypto.randomUUID()}`, d.title, d.norm, d.domain, d.summary, d.author, d.source, now + i)));
    results.forEach((r, i) => { if (r.meta.changes) added.push(fresh[i].title); else skipped.push({title: fresh[i].title, reason: 'already posted'}); });
  }
  return c.json({added, skipped}, added.length ? 201 : 200);
});

app.delete('/api/intake/:id', intakeAuth, async c => {
  const id = c.req.param('id');
  if (!/^draft-[a-f0-9-]{36}$/.test(id)) return c.json({error: 'Invalid draft ID.'}, 400);
  const r = await c.env.DB.prepare('UPDATE drafts SET hidden=1 WHERE id=? AND hidden=0').bind(id).run();
  return r.meta.changes ? c.json({ok: true}) : c.json({error: 'Draft not found.'}, 404);
});

app.get('/api/health', async c => {
  await c.env.DB.prepare('SELECT 1 FROM workspaces LIMIT 1').first();
  return c.json({ok: true, storage: 'D1'});
});
app.get('/', c => { c.header('Cache-Control', 'no-cache'); return c.html(page); });
app.onError((error, c) => {
  console.error(error.message);
  return c.json({error: 'Database unavailable. Keep this page open, export your draft if available, and retry.'}, 503);
});
export default app;
