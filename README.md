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

## Routes and storage
`GET /`, `GET /api/workspace`, `PUT /api/workspace`, `GET /api/health`, `/static/*`.

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

Startup applies local D1 migrations and serves port 3000. Tests cover model/API validation, persistence, cookie isolation, conflicts, backups, XSS escaping, editing/cancellation, sorting, progress, media playback/failures, reduced motion, keyboard focus, axe checks and viewport overflow. Screenshots, comparison PDF and results regenerate under ignored `test-results/`.

These checks are not security or accessibility certification. Physical devices, screen readers, other browsers and production load remain unverified. Share/clipboard tests inject outcomes, not actual message delivery. PDF tests verify output creation, not every printed layout.

## Media
`/static/idea-orbit.mp4` is an original procedural illustration, not campus footage: H.264, 960 × 640, 24 fps, eight seconds, no audio. `/static/idea-orbit.webp` is its static poster. No third-party media requests run in the app.

Regenerate using `python tests/render-media.py` with Python, Pillow and FFmpeg. These development tools are not needed by the deployed application. Stock photography was not added because the selected image download returned HTTP 403.

## Use, limitations and next steps
Wait for Saved to D1, review ideas, shortlist, compare and export backups. On errors keep the page open, export the local draft, then retry or confirm reloading saved data. Verify downloaded files. Backups exclude unsubmitted add/edit form fields.

Workspaces are browser-linked, not authenticated accounts or shared team access. Cookie loss, switching browsers/origins or clearing site data can disconnect a workspace. Anyone using the browser profile can access it. Avoid sensitive data. Sandbox resets can lose preview data. Legacy recovery requires the original browser and origin.

Not implemented: shared vote tallies, authenticated collaboration, research detectors, durable offline drafts or photography. Review abuse controls and retention before production. Supply authorized photos for a later media update if wanted.

The existing manual GitHub Actions workflow targets the owner’s Cloudflare account. It is not executed by this update. Production needs credentials and a real D1 database; the checked-in database ID is local-only. GitHub Pages cannot run Hono/D1. Review the application and activate production deployment separately when ready.
