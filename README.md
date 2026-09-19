## Foundation repair checkpoint

Inspected local and remote `main` at `9c1a5b6`. Repaired malformed favicon HTML,
removed misleading compliance/vote metadata and countdown placeholder, added the
favicon asset, and tracked the existing dependency lock. The original root
`index.html` remains unchanged. Frontend completion and runtime tests are still
pending; this is a source checkpoint, not a production release.

## Recovery checkpoint: application overhaul in progress

The existing GitHub Pages homepage (`index.html`) is preserved unchanged.
The new Hono/Cloudflare application lives in `src/`, with its HTML in
`src/page.html` and static assets in `public/static/`.

**Status:** foundation restored; frontend handlers, visual overhaul, dependency
installation, build, and runtime tests are not yet complete. Do not treat this
checkpoint as a finished or production-ready app.

- Authored backend: browser-scoped Cloudflare D1 workspace, input validation,
  optimistic revision checks, and same-origin write protection.
- Intended routes: `GET /`, `GET /api/workspace`, `PUT /api/workspace`,
  `GET /api/health`, and `/static/*`.
- Model: custom proposals, up to four shortlisted IDs, four optional review
  scores and notes per proposal, and light/dark preference.
- D1 migration: `migrations/0001_workspace.sql`. The database ID in
  `wrangler.jsonc` is for local development only, not a provisioned production DB.
- No production deployment has been performed. GitHub Pages cannot run the
  Hono API or D1 backend. Existing site:
  https://tiredicey.github.io/gawk-capstone-sti-lipa/
- Next: finish the client, install dependencies, build, apply local migration,
  start preview, run workflow/accessibility checks, and push the next checkpoint.
- Original proposal text remains below and in `src/original.json` for reference.
  Its performance/compliance claims are unverified concepts, not established results.
  The original “0:00 PM Today” deadline below is inconsistent; the source HTML
  uses January 31, 2027. The new app uses that date in Philippine time.

---

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
