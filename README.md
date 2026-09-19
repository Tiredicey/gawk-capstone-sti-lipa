# Capstoney decision room

## Current status
Implemented and locally tested at `531c0bb`. Not production-deployed. Original root `index.html` remains unchanged from `9c1a5b6`.

## Completed features
Search/filter, manual proposals, editable paste formatting, duplicate checks, confirmed removal, four-item shortlist, comparison/print, optional scores and notes, D1 autosaving, conflict handling, validated backup/import with pre-import backup, explicit legacy recovery, honest vote-message copying/sharing, mobile light/dark controls and keyboard dialogs. Original proposals and team roles are preserved. Overall score is sum divided by four only when all four scores are present. Target: January 31, 2027, Philippine time.

## Routes and storage
`GET /`, `GET /api/workspace`, `PUT /api/workspace`, `GET /api/health`, `/static/*`. PUT accepts `{state,revision}` and requires a workspace cookie, same Origin and `X-Workspace-Request: 1`. D1 stores hashed browser-token IDs, JSON state and revisions. State contains version, custom proposals, shortlist, reviews and theme. Limits: 100 custom proposals, four shortlist entries and 256 KiB state/request budget.

## Run and test
Node 22: `npm ci`, `npm run build`, `pm2 start ecosystem.config.cjs`. Local preview: http://localhost:3000. Startup applies local D1 migrations. Install tests with `npx playwright install --with-deps chromium`, then run `npm test`.

Observed at `531c0bb`: 7 model/API and 15 browser groups passed twice in Chromium/Linux. Coverage includes persistence, validation, XSS escaping, cookie isolation, stale tabs, backups, recovery, network failures, sharing cancellation and keyboard focus. Axe checks passed for tested light/dark page states; no document overflow at 320/375/768/1024/1440 CSS pixels. Comparison PDF content was checked. Artifacts regenerate under ignored `test-results/`. This is not security or accessibility certification; physical devices, screen readers, other browsers and production load remain unverified. Share/clipboard tests inject outcomes, not real message delivery.

## Use and limitations
Wait for Saved to D1, review ideas, shortlist, compare, and export backups. On errors keep the page open, export your draft, then retry or confirm reload. Backups exclude unfinished add-form fields. Workspaces are browser-linked, not authenticated accounts or team collaboration. Cookie loss or changing browsers/origins can disconnect your workspace. Sandbox resets can lose preview data. Legacy recovery requires the original browser and origin. Avoid sensitive data.

Production path selected: your own Cloudflare account through GitHub Actions. Deployment has not run. GitHub Pages cannot run Hono/D1; the configured database ID is local-only. No shared vote tally, authenticated collaboration, research detectors or durable offline drafts exist. Review abuse controls and retention before production.

Repository: https://github.com/Tiredicey/gawk-capstone-sti-lipa
Original site: https://tiredicey.github.io/gawk-capstone-sti-lipa/

## Inherited reference below
Historical wording is retained, not endorsed. Capability claims and the old Today deadline below are unverified/superseded; use the Philippine-time target above. Current Lipa rules and DILG/court applicability need verification.

# STI College Lipa - BSIT Capstone Project (A.Y. 2026-2027)
**Group Name:** Gawk Capstoney  
**Program:** Bachelor of Science in Information Technology  
**Campus:** STI College Lipa  

---

## 1. Title Defense Proposals

| # | Proposal Title | Focus Area | Defense Advantage |
|---|----------------|------------|-------------------|
| 1 | **TricyRoute Lipa: Automated Tricycle Booking and Fare Calculator System** | Municipal Transport / Geofencing | Solves Lipa City fare overcharging and maps to Local Government Code Sections 447 and 458. |
| 2 | **CodeProvenance: AST and Git Telemetry Engine** | Code Plagiarism Detection | Analyzes Abstract Syntax Trees to catch structural copying across student assignments. |
| 3 | **ByteCheck: Bytecode and Intermediate Representation Matcher** | Binary Analysis | Compares compiled code (Java Bytecode / LLVM IR) to render variable renaming useless. |
| 4 | **AlgoGuard: Control-Flow Graph Similarity Scanner** | Program Logic Analysis | Generates execution flow paths to identify algorithmic logic theft across different languages. |

---

## 2. Team Role Distribution

| Member Name | Assigned Capstone Role | Primary Responsibilities |
|-------------|------------------------|--------------------------|
| Lead Architect | Systems & Backend | Database schema, API routing, server logic |
| Researcher | Algorithm & Research Lead | Core logic research, detection models, flow verification |
| UI/UX Engineer | Frontend & Client | Mobile responsive views, client-side state, user flows |
| Documentation Lead | Technical Writer | Manuscript Chapters 1 to 3, panel compliance, defense slides |

---

## 3. Immediate Milestones

1. **Title Selection Deadline:** 0:00 PM Today.
2. **Title Defense Submission:** Target completion of the STI Lipa Title Defense Form.
3. **Chapter 1 Draft:** Background of the Study, Objectives, and Scope and Delimitation.
