# Capstoney decision room

Gawk Capstoney’s browser-linked capstone proposal-review workspace for STI College Lipa, BSIT A.Y. 2026–2027. Hono, vanilla JavaScript, CSS and Cloudflare D1.

## Status and URLs
This update targets the Hono application, not the unchanged root GitHub Pages archive. No production deployment is performed by this update.

- Repository: https://github.com/Tiredicey/gawk-capstone-sti-lipa
- Original archive: https://tiredicey.github.io/gawk-capstone-sti-lipa/
- Local application: http://localhost:3000
- Production application URL: not verified in this session.

## Features
- Search titles, domains, descriptions, context and review notes. Filter shortlisted, reviewed, incomplete assessments and custom ideas. Sort by original order, title or complete score; unknown scores follow complete ones and ties keep original order.
- Add proposals manually or format pasted notes into editable fields. Edit custom proposals while retaining IDs, shortlist membership and reviews. Duplicate checks, validation, removal confirmation and unsaved-edit discard confirmation protect data.
- Four-item shortlist, comparison and printing. Optional scores and notes. Overall score is the sum divided by four only when all four criteria are scored. Progress counts complete assessments; Continue reviewing prioritizes incomplete shortlisted ideas. Scores remain subjective.
- D1 autosaving, stale-revision protection, retry/reload controls, validated JSON export/import with pre-import backup, and explicit legacy recovery. Vote-message copying/sharing never claims to submit or tally votes.
- Responsive light/dark layouts, colorful card accents, keyboard dialogs, dismissible notifications and original background animation. Video pauses offscreen, in dialogs and in hidden tabs. Reduced-motion and data-saving preferences skip video loading. A local poster remains available when motion cannot play.

The original proposals, team roles and January 31, 2027 Philippine-time target remain. Preserving reference wording does not endorse its claims. This workspace does not implement the proposed transport or similarity-detection research systems; current regulatory applicability and research outcomes need separate verification.

## SDG 17 title review
The **Title review · SDG 17** section reviews all 43 titles on record as of October 1, 2026: the four reference proposals and the 39 group chat drafts from `/api/drafts`. For each title it shows:

- a revised capstone title, a verdict (Recommended, Revise before proposing, Merge into another title, Park for now) and an SDG 17 fit rating;
- the SDG 17 targets it serves, worded as on the UN DESA target list;
- an estimated hardware : software split across 16 build weeks, with a bar and a project type;
- scope, risks, sources and anything not confirmed.

Six new titles follow the reviewed ones. Filters cover verdict, fit, hardware or software, and free text. **Add revised title to my board** and **Add all recommended** copy titles into your workspace once each. **Print title review** opens a printable table. Group chat drafts link to their review.

Result: 8 recommended, 8 revise, 10 merge, 17 park. 8 of the 33 non-merged titles include hardware. Hardware is 11% of total effort, because most drafts are code-similarity or AI-detection tools.

What the review relies on, and its limits:
- The ratio is an effort estimate. No STI or CHED rule setting a hardware percentage turned up. The STI guideline copy we read (Studocu, undated) says BSIT uses hardware and software and asks for separate resource lists. Confirm the current edition with your coordinator.
- City offices named as partners come from lipa.gov.ph. None has agreed to anything.
- Not confirmed: the Lipa tricycle fare ordinance, license-exempt LoRa bands (the FOI page was under maintenance), a reference air monitor near Lipa, the LMS STI Lipa uses, 2025 to 2026 Lipa coffee volumes, and OpenAlex 2026 pricing.
- Data lives in `public/static/titles.js`. `tests/fixtures/drafts-2026-10-01.json` snapshots the drafts, and the model tests fail when a draft has no review.

## Group chat drafts from Heisenbot
[Heisenbot](https://github.com/Tiredicey/Heisenbot) watches the Messenger group chat. When a member sends a capstone title, it posts the title here. The **Group chat drafts** section lists every posted title with its sender and time. Anyone who opens the site sees the same list. **Add to my board** or **Add all new to my board** copies titles into your own workspace, where you can edit, shortlist and score them.

- Titles match the four reference proposals or earlier drafts after trimming spaces and ignoring case. Those duplicates are skipped.
- Only a caller holding the `INTAKE_TOKEN` secret can post or hide drafts. Visitors can only read them.
- Drafts are shared. Workspaces stay personal.

### Turn it on
1. Make a random token of 32 or more characters, for example `openssl rand -hex 32`.
2. Save it on GitHub: repository → Settings → Secrets and variables → Actions → New secret `INTAKE_TOKEN`.
3. Run **Actions → Publish Capstoney to Cloudflare** with *publish* ticked. The workflow applies migration `0002_drafts.sql`, stores the token as a Pages secret and deploys.
4. In the Heisenbot dashboard, open **Capstone titles**, paste the same token, press **Save link**, then **Test connection**.

If the token is not set, `/api/intake` answers 503 and nothing can be posted.

## Routes and storage
`GET /` (includes `#title-review`), `GET /api/workspace`, `PUT /api/workspace`, `GET /api/drafts`, `GET|POST /api/intake`, `DELETE /api/intake/:id`, `GET /api/health`, `/static/*`.

`POST /api/intake` takes `{"drafts":[{"title","domain?","summary?","author?","source?"}]}` with up to 50 drafts and `Authorization: Bearer <INTAKE_TOKEN>`. It answers `{added:[titles], skipped:[{title, reason}]}`. D1 table `drafts` stores the title, a normalized unique key, domain, summary, author, source, time and a hidden flag.

PUT accepts `{state,revision}` and requires JSON, a workspace cookie, same Origin and `X-Workspace-Request: 1`. D1 stores hashed browser-token IDs, state JSON and revisions. State version 1 contains custom proposals, shortlist IDs, review scores/notes and theme. Limits: 100 custom proposals, four shortlist entries and a 256 KiB state/request budget. Schema, migrations and storage bindings are unchanged. Filters, sorting and playback controls apply to the current visit.

## Run and test
Use Node 22, with PM2 installed:

```sh
npm ci
npx playwright install --with-deps chromium
npm run build
pm2 start ecosystem.config.cjs
npm test
```

Put `INTAKE_TOKEN=<any 24+ characters>` in `.dev.vars` for local intake tests. Startup applies local D1 migrations and serves port 3000. Tests cover model/API validation, persistence, cookie isolation, conflicts, backups, XSS escaping, editing/cancellation, sorting, progress, media playback/failures, reduced motion, keyboard focus, axe checks and viewport overflow. Screenshots, comparison PDF and results regenerate under ignored `test-results/`.

These checks are not security or accessibility certification. Physical devices, screen readers, other browsers and production load remain unverified. Share/clipboard tests inject outcomes, not actual message delivery. PDF tests verify output creation, not every printed layout.

## Media
`/static/idea-orbit.mp4` is an original procedural illustration, not campus footage: H.264, 960 × 640, 24 fps, eight seconds, no audio. `/static/idea-orbit.webp` is its static poster. No third-party media requests run in the app.

Regenerate using `python tests/render-media.py` with Python, Pillow and FFmpeg. These development tools are not needed by the deployed application. Stock photography was not added because the selected image download returned HTTP 403.

## Use, limitations and next steps
Wait for Saved to D1, review ideas, shortlist, compare and export backups. On errors keep the page open, export the local draft, then retry or confirm reloading saved data. Verify downloaded files. Backups exclude unsubmitted add/edit form fields.

Workspaces are browser-linked, not authenticated accounts or shared team access. Cookie loss, switching browsers/origins or clearing site data can disconnect a workspace. Anyone using the browser profile can access it. Avoid sensitive data. Sandbox resets can lose preview data. Legacy recovery requires the original browser and origin.

Not implemented: editing or deleting drafts from the page (hide them through `DELETE /api/intake/:id`), shared vote tallies, authenticated collaboration, research detectors, durable offline drafts or photography. Review abuse controls and retention before production. Supply authorized photos for a later media update if wanted.

The existing manual GitHub Actions workflow targets the owner’s Cloudflare account. It is not executed by this update. Production needs credentials and a real D1 database; the checked-in database ID is local-only. GitHub Pages cannot run Hono/D1. Review the application and activate production deployment separately when ready.
