import {normalizeTitle} from './model.js';

export const REVIEWED_ON = '2026-10-01';

export const SDG17_TARGETS = {
  '17.6': 'Cooperation on and access to science, technology and innovation, and knowledge sharing on mutually agreed terms.',
  '17.7': 'Development, transfer and diffusion of environmentally sound technologies.',
  '17.8': 'Enhanced use of enabling technology, in particular information and communications technology.',
  '17.9': 'Effective, targeted capacity-building to support national plans for the SDGs.',
  '17.16': 'Multi-stakeholder partnerships that mobilize and share knowledge, expertise and technology.',
  '17.17': 'Effective public, public-private and civil society partnerships.',
  '17.18': 'Availability of high-quality, timely and reliable disaggregated data.',
  '17.19': 'Measurements of progress and statistical capacity-building.'
};

export const SOURCES = {
  un17: {label: 'UN DESA · SDG 17 targets and indicators', url: 'https://sdgs.un.org/goals/goal17', tier: 'Primary', date: 'Retrieved 2026-10-01', supports: 'Wording of targets 17.6 to 17.19 used in every alignment.'},
  cmo25: {label: 'CHED · 2015 Memorandum Orders list (CMO No. 25 s.2015)', url: 'https://legacy.ched.gov.ph/2015-ched-memorandum-orders/', tier: 'Primary listing', date: '2015', supports: 'CMO 25 s.2015 is the PSG for BSCS, BSIS and BSIT. Section 8.4 text (capstone required for BSIT) was read from a third-party copy, not the CHED PDF.'},
  sti: {label: 'STI IT/IS Capstone Project Guidelines (copy hosted on Studocu)', url: 'https://www.studocu.com/ph/document/sti-college/information-technology/capstone-project-guidelines/61007579', tier: 'Third-party copy', date: 'Undated', supports: 'Proposal acceptability by content and scope, feasibility by cost, time and effort; two terms; separate hardware and software resource lists. Confirm the current edition with your coordinator.'},
  psaEgg: {label: 'PSA CALABARZON · Poultry Production, Q1 2026', url: 'https://rsso04a.psa.gov.ph/content/poultry-production-calabarzon-first-quarter-2026', tier: 'Primary', date: '2026-08-04', supports: 'Batangas is the top chicken egg producer in CALABARZON at 54,219.64 metric tons in Q1 2026.'},
  flood: {label: 'VERA Files fact check citing ABS-CBN, Lipa floods', url: 'https://verafiles.org/articles/fact-check-old-video-passed-off-as-recent-flooding-in-batangas', tier: 'News (cites ABS-CBN)', date: '2026-08-17', supports: 'At least 15 Lipa City barangays had waist-deep flooding in August 2026.'},
  lipad: {label: 'UP DREAM LiPAD · City of Lipa 25-year flood hazard map', url: 'https://lipad-fmc.dream.upd.edu.ph/layers/geonode%3Aph041014000_fh25yr_10m', tier: 'Academic dataset', date: '2017 (older than 12 months)', supports: 'A published flood hazard layer exists for Lipa for sensor siting. Treat as potentially outdated.'},
  lipaOffices: {label: 'Lipa City · Departments and Offices', url: 'https://lipa.gov.ph/departments-offices/', tier: 'Primary', date: 'Retrieved 2026-10-01', supports: 'DRRM, Health, ENRO, Agriculture, Veterinary, Cooperatives, Traffic Management and MIS offices exist as possible partners. No partner has agreed to anything.'},
  ntc: {label: 'eLegal summary of NTC MC No. 002-09-2025', url: 'https://elegal.ph/ntc-orders-phaseout-of-2g-and-3g-mobile-networks/', tier: 'Secondary summary', date: '2025-11-05', supports: '3G shutdown by 31 December 2026, 2G on a separate timeline, no new type approval for 2G/3G-only devices. Read the NTC circular before citing.'},
  sim800l: {label: 'e-Gizmo SIM800L module document', url: 'https://e-gizmo.net/oc/kits%20documents/SIM800L%20module/SIM800L%20module.pdf', tier: 'Vendor document', date: 'Undated', supports: 'SIM800L is a quad-band GSM/GPRS (2G) module. Seen in a search result, not opened.'},
  denrAqi: {label: 'EMB-DENR · DAO 2020-14 PM2.5 AQI breakpoints', url: 'https://air.emb.gov.ph/denr-administrative-order-on-establishing-breakpoints-for-pm-2-5-air-quality-index-reviewed-and-approved-by-emb/', tier: 'Primary', date: 'Undated page', supports: 'Six PM2.5 AQI levels from Good (0 to 25 µg/m³) to Emergency (above 91).'},
  ra8749: {label: 'R.A. 8749 Philippine Clean Air Act (LTO copy)', url: 'https://lto.gov.ph/wp-content/uploads/2023/09/RA-8749.pdf', tier: 'Primary', date: '1999', supports: 'Section 21: no registration unless the vehicle passes the emission test. Low-cost sensors cannot replace that test.'},
  pnsCoffee: {label: 'DA-BAFS · Approved PNS list (PNS/BAFS 01:2025 Green Coffee Beans)', url: 'https://bafs.da.gov.ph/index.php/approved-philippine-national-standards/', tier: 'Primary', date: 'Retrieved 2026-10-01', supports: 'A 2025 national grading and classification standard for green coffee beans exists.'},
  pnsSorter: {label: 'PNS/BAFS 342:2022 Green Coffee Bean Sorter, Methods of Test', url: 'https://amtec.uplb.edu.ph/wp-content/uploads/2023/02/PNS.BAFS-342.2022_PNS-Green-Coffee-Bean-Sorter-Methods-of-Test.pdf', tier: 'Primary', date: '2022', supports: 'A national test method exists for evaluating coffee bean sorters. Seen in a search result, not opened.'},
  coffeeBoard: {label: 'Philippine Coffee Board · Philippine coffee', url: 'https://philcoffeeboard.com/philippine-coffee/', tier: 'Industry body', date: 'Undated', supports: 'Liberica is known locally as Barako and is associated with Lipa, Batangas.'},
  dilg: {label: 'DILG MC No. 2023-195', url: 'https://www.dilg.gov.ph/issuances/mc/Reinforcement-of-Prohibition-of-Tricycles-Pedicabs-and-Motorized-Pedicabs-on-National-Highways/3836', tier: 'Primary', date: '2023-12-06', supports: 'Reinforces the prohibition of tricycles, pedicabs and motorized pedicabs on national highways.'},
  ra10173: {label: 'NPC · R.A. 10173 Data Privacy Act', url: 'https://privacy.gov.ph/data-privacy-act/', tier: 'Primary', date: '2012', supports: 'Lawful processing, consent and security duties for personal data of students, drivers and farm workers. Section pinpoints are in the legal review.'},
  crossref: {label: 'Crossref REST API documentation', url: 'https://www.crossref.org/documentation/retrieve-metadata/rest-api/', tier: 'Primary', date: 'Retrieved 2026-10-01', supports: 'Public API for DOI and scholarly metadata lookup.'},
  openalex: {label: 'OpenAlex help and API reference', url: 'https://help.openalex.org/', tier: 'Primary', date: 'Retrieved 2026-10-01', supports: 'Open catalog of scholarly works. 2026 API keys and pricing are not confirmed here.'},
  synthid: {label: 'Google AI · SynthID Text documentation', url: 'https://ai.google.dev/responsible/docs/safeguards/synthid', tier: 'Primary', date: 'Retrieved 2026-10-01', supports: 'Detection is probabilistic, depends on the provider watermark configuration, and drops sharply after heavy rewriting or translation.'},
  liang: {label: 'Liang et al., Patterns (2023) · GPT detectors are biased against non-native English writers', url: 'https://www.sciencedirect.com/science/article/pii/S2666389923001307', tier: 'Peer-reviewed', date: '2023 (older than 12 months)', supports: 'Detectors frequently misclassify non-native English writing as AI-generated.'},
  moss: {label: 'Stanford MOSS', url: 'https://theory.stanford.edu/~aiken/moss/', tier: 'Primary', date: 'Undated', supports: 'An established code-similarity service exists, so new code tools need a comparison baseline.'}
};

export const VERDICTS = {recommended: 'Recommended', revise: 'Revise before proposing', merge: 'Merge into another title', park: 'Park for now'};
export const FITS = {strong: 'Strong SDG 17 fit', moderate: 'Moderate SDG 17 fit', weak: 'Weak SDG 17 fit'};
export const BUILD_WEEKS = 16;

const t = (key, original, revised, verdict, fit, targets, effort, why, scope, risks, sources, unverified = '', mergeInto = '') => ({key, original, revised, verdict, fit, targets, effort, why, scope, risks, sources, unverified, mergeInto});

export const TITLE_REVIEWS = [
  t('r1', 'TricyRoute Lipa: Ordinance-Compliant Dispatch and Fare Auditing Engine', 'TricyRoute Lipa: A Fare Matrix and Route-Rule Dispatch Platform for Tricycle Operators and Drivers Associations in Partnership with the Lipa City Traffic Management and Transport Office', 'recommended', 'strong', ['17.17', '17.18', '17.8'], [2, 14],
    'Names a public office and a civil society group as partners, which is the core of target 17.17, and produces shared trip and fare data for 17.18.',
    'Fare calculator from the certified ordinance, driver and passenger web app, digital receipt, route checks against a mapped no-tricycle road list. Phone GPS plus a Bluetooth thermal printer for paper receipts. Fares come from the council, which fixes them by zone after public hearing.',
    'Fare ordinance and route data must come from the city. Do not claim legal compliance; show the rule source on each receipt.',
    ['dilg', 'lipaOffices', 'ra10173', 'un17'], 'Sec. 458(a)(3)(vi) is confirmed. The current Lipa fare and zone ordinance text was not obtained.'),
  t('r2', 'CodeProvenance: AST and Git Telemetry Engine', 'CodeProvenance: An Abstract Syntax Tree and Git History Similarity Assistant for Faculty Review of Programming Submissions at STI College Lipa', 'revise', 'moderate', ['17.6', '17.8'], [0, 16],
    'Supports knowledge sharing only if the team publishes the method and consented test set. It mainly serves SDG 4.',
    'Limit to two languages, compare against MOSS on a consented dataset, report precision and recall, and keep a human reviewer in the loop.',
    'Similarity is not proof of plagiarism. Student code is personal data under R.A. 10173.',
    ['moss', 'ra10173', 'un17']),
  t('r3', 'ByteCheck: Compiler Bytecode and Intermediate Representation Matcher', 'ByteCheck: Java Bytecode Similarity Analysis for Detecting Refactored Code Reuse in Student Programming Projects', 'park', 'weak', ['17.6'], [0, 16],
    'Little partnership or data-sharing dimension. Hard to tie to SDG 17 beyond generic knowledge sharing.',
    'If kept, pick Java bytecode only, fix one compiler version, and drop LLVM IR to fit two terms.',
    'Compiler settings change output. Needs a labeled dataset the team does not have yet.',
    ['moss', 'un17']),
  t('r4', 'AlgoGuard: Control-Flow Graph Similarity Scanner', 'AlgoGuard: Control-Flow Graph Similarity Detection Between Python and Java Student Programs', 'park', 'weak', ['17.6'], [0, 16],
    'Same weak SDG 17 link as the other code-similarity ideas.',
    'Cross-language CFG matching is research-grade. Restrict to two languages and small programs.',
    'Graph isomorphism scales poorly. High risk of an unfinished prototype.',
    ['moss', 'un17']),
  t('d01', 'Federated Offline-First Knowledge and Alert-Sharing for Sub-Provincial Multi-Agency DRRM Clusters: A Reference Framework and Prototype', 'BayanAlert: An Offline-First Incident Report and Alert-Sharing Web App Linking the Lipa City DRRM Office with Barangay Responders', 'merge', 'strong', ['17.16', '17.17', '17.18'], [0, 16],
    'Shared situation reports between the city office and barangays fit multi-stakeholder partnership and timely data.',
    'Drop "federated", "multi-agency clusters" and "reference framework"; each is a separate thesis. Build a PWA with offline queue and sync.',
    'Overlaps the flood monitoring title. Combine both into one hardware plus software project.',
    ['lipaOffices', 'flood', 'un17'], '', 'd07'),
  t('d02', 'Smart Car Parking Detection and Space Reservation System with Mobile App and Web Dashboard', 'IoT Parking Occupancy Sensing and Reservation System with Shared Occupancy Data for the Lipa City Traffic Management and Transport Office', 'revise', 'moderate', ['17.17', '17.18'], [7, 9],
    'Gains SDG 17 fit only when a parking operator and the city office share occupancy data.',
    'Pilot one lot with ultrasonic or IR sensors on 6 to 10 slots. Reservation and dashboard as web app.',
    'Needs a lot owner willing to host sensors. Common topic, so the panel may ask for novelty.',
    ['lipaOffices', 'un17'], 'Lipa parking demand data was not found.'),
  t('d03', 'Car Crash Detection and Vehicle Black Box System with SMS and Emergency Web Portal', 'LTE-Based Vehicle Crash Detection and Event Recorder with SMS Alerts to the Lipa City DRRM Office Emergency Portal', 'revise', 'strong', ['17.17', '17.8'], [8, 8],
    'Links private vehicle owners with a public responder office, a public-civil society partnership.',
    'Accelerometer, GPS, LTE modem, SD event log, and a portal for responders. Test with drop rigs, not real crashes.',
    'SIM800L and other 2G-only modules face the NTC phase-out; use an LTE-capable module. False alarms need a cancel window. Not a certified safety device.',
    ['ntc', 'sim800l', 'lipaOffices', 'un17']),
  t('d04', 'Indicative Vehicle Emissions and GPS Fleet Tracking System with Web Dashboard for Transport Cooperatives', 'Non-Regulatory Indicative Emissions and GPS Fleet Monitoring for a Lipa City Transport Cooperative in Partnership with the City Cooperatives Office', 'recommended', 'strong', ['17.7', '17.17', '17.18'], [7, 9],
    'Puts environmentally sound monitoring in the hands of a cooperative with public-office support and shared fleet data.',
    'One or two units with GPS and low-cost gas sensors, maintenance reminders, and a cooperative dashboard.',
    'R.A. 8749 requires official emission tests for registration; label readings as indicative only. Sensor drift needs calibration notes.',
    ['ra8749', 'lipaOffices', 'un17']),
  t('d05', 'IoT Air Quality Monitoring and Pollution Prediction System for City Health Offices', 'Low-Cost PM2.5 Monitoring and Short-Term Air Quality Index Forecasting Network Shared with the Lipa City Health Office and City ENRO', 'recommended', 'strong', ['17.18', '17.7', '17.16'], [7, 9],
    'Produces timely local data for two public offices, matching 17.18, using the DENR PM2.5 AQI scale.',
    'Three to five sensor nodes, AQI display per DAO 2020-14, and a simple next-hours forecast once enough data exists.',
    'Low-cost sensors need co-location with a reference monitor. Forecast accuracy depends on weeks of data.',
    ['denrAqi', 'lipaOffices', 'un17'], 'EMB CALABARZON lists no monitoring station in Lipa.'),
  t('d06', 'Automated Coffee Bean Quality Sorting and Inventory Management System with Mobile App', 'Camera-Based Green Coffee Bean Defect Classification and Inventory System for Lipa Liberica Growers Aligned with PNS/BAFS 01:2025', 'recommended', 'strong', ['17.6', '17.7', '17.16'], [9, 7],
    'Transfers grading know-how to growers with the City Agriculture Office, and anchors grading to a national standard.',
    'Light box, camera, and a one-lane reject gate; classifier trained on labeled beans; inventory app. Full mechanical sorting is out of scope.',
    'Needs labeled bean samples and an expert grader. Measure against the PNS sorter test method.',
    ['pnsCoffee', 'pnsSorter', 'coffeeBoard', 'lipaOffices', 'un17'], 'Current Lipa coffee volume was not found in a 2025 to 2026 source.'),
  t('d07', 'IoT-Based Flood Monitoring and Early Warning System with Web Dashboard for Local Government Units', 'IoT Water-Level Monitoring and Early Warning System with an Offline-First Alert App for the Lipa City DRRM Office and Flood-Prone Barangays', 'recommended', 'strong', ['17.16', '17.17', '17.18', '17.8'], [8, 8],
    'Combines this title with BayanAlert. Shared sensor data and alerts between city and barangays fit partnership and data targets.',
    'Two or three ultrasonic water-level nodes, a gateway, SMS or app alerts, and the offline report app from BayanAlert. Site nodes using the LiPAD hazard map.',
    'Thresholds need the DRRM office. Power and theft at the site. Radio band choice needs NTC confirmation.',
    ['flood', 'lipad', 'lipaOffices', 'ntc', 'un17'], 'The NTC SRD tables read list 433 MHz and 868 to 870 MHz, not 920 to 925 MHz. Registration, not a license exemption, applies.'),
  t('d08', 'Student Incident Reporting and Disciplinary Records Management System at STI LIPA', 'Role-Based Student Incident Reporting and Case Tracking System for the STI College Lipa Discipline Office', 'revise', 'weak', ['17.18'], [0, 16],
    'Mostly an internal records system. SDG 16 or 4 describe it better than SDG 17.',
    'Report intake, case workflow, audit log, and anonymized statistics.',
    'Records about minors and discipline need strict access control under R.A. 10173. Needs school approval.',
    ['ra10173', 'un17']),
  t('d09', 'IoT-Based Environmental Monitoring and Automated Stress Mitigation System for Layer Poultry Farms', 'IoT Environmental Monitoring and Automated Ventilation Control for Small Layer Poultry Farms in Lipa City in Partnership with the City Veterinary Office', 'recommended', 'strong', ['17.6', '17.16', '17.18'], [9, 7],
    'Batangas leads CALABARZON egg output, so farm partners are local. Knowledge transfer with the Veterinary Office fits 17.6 and 17.16.',
    'Temperature, humidity and ammonia sensors, relay control of fans or misters with manual override, and alerts.',
    'Wrong actuation can harm birds; keep a manual override. Biosecurity limits site visits.',
    ['psaEgg', 'lipaOffices', 'un17']),
  t('d10', 'BlockChain-Cred: Immutable Timestamp Proof of Ownership', 'Hash-Based Timestamping of Student Manuscript Drafts as Evidence of Prior Possession', 'park', 'weak', ['17.6'], [0, 16],
    'Weak SDG 17 link.', 'Hash files and anchor the hash with a timestamp service; no personal text on any ledger.',
    'A timestamp proves someone had the file at a time, not that they wrote it. Public ledgers may cost fees.', ['un17']),
  t('d11', 'Peersub-Audit: Blind Peer-Review Collusion Detector', 'Similarity Pattern Screening for Unauthorized Collaboration in Blind Peer-Review Assignments', 'park', 'weak', ['17.6'], [0, 16], 'Internal academic integrity tool with weak SDG 17 link.', 'Requires access to course submissions.', 'Small cohorts give few signals. Needs consent.', ['ra10173', 'un17']),
  t('d12', 'MathEquate: LaTeX & Mathematical Proof Normalizer', 'Normalization of LaTeX Mathematical Expressions for Detecting Copied Solutions with Renamed Variables', 'park', 'weak', ['17.6'], [0, 16], 'Weak SDG 17 link.', 'Drop handwriting recognition; LaTeX only.', 'Few local courses submit LaTeX.', ['un17']),
  t('d13', 'ImageMatch-Academic: Figure & Chart Vector Matcher', 'Perceptual-Hash Matching of Reused Figures and Charts in Student Research Papers', 'park', 'weak', ['17.6'], [0, 16], 'Weak SDG 17 link.', 'Feasible with perceptual hashing on extracted figures.', 'Needs a reference corpus with permission.', ['un17']),
  t('d14', 'ZeroTrust-Similarity: LSH Cryptographic Document Hasher', 'Privacy-Preserving Cross-Campus Document Similarity Matching Using Locality-Sensitive Hashing', 'revise', 'moderate', ['17.6', '17.16'], [0, 16],
    'Sharing similarity fingerprints between campuses is knowledge sharing on agreed terms.', 'Two partner schools, MinHash signatures, and a match report.',
    'LSH is not cryptographic and similar fingerprints still leak similarity. Do not claim zero exposure.', ['ra10173', 'un17']),
  t('d15', 'PatentMatch: Prior Art & Industrial IP Checker', 'Prior-Art Search Assistant for Student Capstone Proposals Using Open Patent and Scholarly Metadata', 'park', 'weak', ['17.6'], [0, 16], 'Weak SDG 17 link.', 'Index only open metadata, not full patent text.', 'Large indexing scope for two terms.', ['openalex', 'un17'], 'USPTO and WIPO API terms were not checked.'),
  t('d16', 'DataIntegrity: Fabricated Dataset & Synthetic Graph Detector', 'Statistical Anomaly Screening of Student Research Datasets for Human Review', 'park', 'weak', ['17.18'], [0, 16], 'Data quality touches 17.18 only loosely.', 'Flag anomalies; never label data as fabricated.', "Benford's law fits only some data types. It cannot prove AI generation.", ['un17']),
  t('d17', 'SelfPlag-Finder: Institutional Intra-Student Indexer', 'Detection of Reused Coursework Across a Student’s Own Prior Submissions', 'park', 'weak', ['17.6'], [0, 16], 'Weak SDG 17 link.', 'Needs an archive of past submissions.', 'Retention and consent under R.A. 10173.', ['ra10173', 'un17']),
  t('d18', 'ContextCite: NLP Citation Context & Semantic Auditor', 'Checking Whether Cited Sources Support the Claims in Student Papers', 'merge', 'moderate', ['17.6', '17.8'], [0, 16], 'Best handled as a stretch feature of Citately.', 'Claim support checking is open research.', 'Requires full-text access to cited papers.', ['crossref', 'openalex', 'un17'], '', 'd19'),
  t('d19', 'Citately: AI Hallucinated Citation & DOI Verifier', 'Citately: Reference List Verification Against Crossref and OpenAlex Metadata for Student Research Papers', 'recommended', 'moderate', ['17.6', '17.8'], [0, 16],
    'Uses open scholarly infrastructure to support research quality. Feasible and testable within two terms.',
    'Parse references, look up DOI and title, flag missing or mismatched records, export a report.',
    'Missing metadata is not proof of fabrication; many local journals lack DOIs. Respect API rate limits.',
    ['crossref', 'openalex', 'un17'], 'OpenAlex 2026 API key and pricing changes were seen only in a secondary source.'),
  t('d20', 'Oral2Text: Spoken Presentation & Viva Auditor', 'Transcript-Based Similarity Checking of Recorded Student Presentations', 'park', 'weak', ['17.6'], [0, 16], 'Weak SDG 17 link.', 'Speech-to-text then text similarity.', 'Recording consent; Taglish transcription quality.', ['ra10173', 'un17']),
  t('d21', 'CodeSwitched-Plag: Mixed-Language Document Analyzer', 'Taglish Code-Switched Text Similarity Detection for Philippine Student Writing', 'merge', 'moderate', ['17.6'], [0, 16], 'Local language relevance. Combine with LinguaCheck.', 'Build a small consented Taglish corpus.', 'Little labeled data.', ['un17'], '', 'd24'),
  t('d22', 'Translatio: Multi-Engine Back-Translation Detector', 'Detecting Machine Back-Translated Paraphrase in Student Essays', 'park', 'weak', ['17.6'], [0, 16], 'Weak SDG 17 link.', 'Research-grade signal.', 'High false positive risk.', ['un17']),
  t('d23', 'DialectMatch: Regional Repository & Vernacular Indexer', 'Shared Undergraduate Thesis Abstract Repository for Batangas Colleges with Open Metadata Harvesting', 'recommended', 'strong', ['17.6', '17.16'], [0, 16],
    'Partner schools sharing thesis metadata on agreed terms is a direct reading of 17.6 and 17.16.',
    'Abstract-level records only, partner upload portal, search, and open metadata export.',
    'Needs memoranda with partner schools. Do not digitize full theses without author permission.', ['un17', 'ra10173']),
  t('d24', 'LinguaCheck: Multilingual Cross-Vector Matcher', 'Cross-Lingual Similarity Detection Between Filipino, Taglish and English Student Papers Using Sentence Embeddings', 'revise', 'moderate', ['17.6'], [0, 16], 'Covers Filipino and Taglish together.', 'Use an existing multilingual embedding model; evaluate on a small consented set.', 'Embedding similarity is not proof of translation plagiarism.', ['un17']),
  t('d25', 'WatermarkScan: Statistical LLM Token Watermark Decoder', '', 'park', 'weak', ['17.6'], [0, 16], 'Not feasible as stated.', 'Detection needs each provider’s private watermark configuration.', 'SynthID documentation says detection is probabilistic and weakens after rewriting or translation.', ['synthid', 'un17']),
  t('d26', 'MultiLLM-Finder: Model Signature Classifier', '', 'park', 'weak', ['17.6'], [0, 16], 'Weak SDG 17 link.', 'Model attribution is unreliable and changes with each model release.', 'High risk of false accusations.', ['liang', 'un17']),
  t('d27', 'PromptTrace: Reverse-Prompt Template Reconstruction Engine', '', 'park', 'weak', ['17.6'], [0, 16], 'Speculative.', 'Reconstructed prompts cannot be verified.', 'No ground truth for evaluation.', ['un17']),
  t('d28', 'BiasShield: ESL-Calibrated AI Sensitivity Adjuster', 'Measuring False-Positive Rates of AI-Text Detectors on Filipino ESL Student Writing at STI College Lipa', 'revise', 'moderate', ['17.18', '17.6'], [0, 16],
    'Produces local evidence on detector bias, useful data for schools deciding policy.',
    'Collect consented human-written essays, run several detectors, report false positives by group.',
    'Needs ethics approval and consent. A study and a dashboard, not a calibrated detector.', ['liang', 'ra10173', 'un17']),
  t('d29', 'XAI-Detect: Perplexity & Burstiness Statistical Inspector', 'Explainable Perplexity and Burstiness Reports for AI-Text Detection Results', 'merge', 'weak', ['17.6'], [0, 16], 'Fold into the detector-bias study.', 'Per-sentence statistics as explanation.', 'Explanations do not fix detector bias.', ['liang', 'un17'], '', 'd28'),
  t('d30', 'FocusGrade: Active Session & Idle-Time Monitor', 'Consent-Based Writing Session Activity Log', 'merge', 'weak', ['17.6'], [0, 16], 'Fold into ReviseTrack.', 'Only inside the school editor, with notice.', 'Surveillance concerns under R.A. 10173.', ['ra10173', 'un17'], '', 'd34'),
  t('d31', 'DocReplay: Google Docs & Word Version Graph Visualizer', 'Draft Revision Replay for Teacher Review', 'merge', 'weak', ['17.6'], [0, 16], 'Fold into ReviseTrack.', 'Replay from the school editor’s own history.', 'Depends on third-party revision APIs.', ['un17'], 'Google Docs and Word revision API access terms were not checked.', 'd34'),
  t('d32', 'PasteGuard: Clipboard Telemetry & Source Attribution Engine', 'In-Editor Paste Attribution Prompt', 'merge', 'weak', ['17.6'], [0, 16], 'Fold into ReviseTrack.', 'A web editor sees paste events inside its own page only, not the system clipboard.', 'Students can bypass by typing.', ['un17'], '', 'd34'),
  t('d33', 'AuthPulse: Biometric Typing Cadence Verifier', '', 'park', 'weak', ['17.6'], [0, 16], 'Weak SDG 17 link and high privacy risk.', 'Keystroke dynamics need enrollment data.', 'Needs consent and NPC guidance.', ['ra10173', 'un17'], 'R.A. 10173 does not list biometrics; NPC Advisory Opinion 2017-63 treated signatures as personal, not sensitive, information.'),
  t('d34', 'ReviseTrack: LMS Native Keystroke & Revision Plugin', 'ReviseTrack: A Consent-Based Drafting Timeline Plugin for the School Learning Management System Editor', 'revise', 'weak', ['17.6'], [0, 16],
    'Absorbs FocusGrade, DocReplay and PasteGuard. Still a weak SDG 17 fit.',
    'Plugin recording paste events and revision snapshots, with a teacher timeline view.',
    'Data minimization under R.A. 10173. Needs school approval to install.', ['ra10173', 'un17'], 'The LMS used by STI College Lipa was not confirmed.'),
  t('d35', 'SQL-Match: Database Schema & Query Normalizer', 'SQL-Match: Normalized Query and Schema Similarity Checking for Database Course Submissions', 'park', 'weak', ['17.6'], [0, 16], 'Feasible but weak SDG 17 link.', 'Parse SQL to a canonical tree; compare schemas.', 'Small assignment sets give many legitimate matches.', ['un17']),
  t('d36', 'NotebookTrace: Jupyter & Google Colab Session Auditor', 'NotebookTrace: Execution Metadata Review of Jupyter Notebook Submissions', 'park', 'weak', ['17.6'], [0, 16], 'Weak SDG 17 link.', 'Read execution counts and timestamps from notebook files.', 'Notebook metadata is editable, so it is weak evidence.', ['un17']),
  t('d37', 'AlgoGuard: Control-Flow Graph / CFG Similarity Scanner', '', 'merge', 'weak', ['17.6'], [0, 16], 'Same idea as reference AlgoGuard.', 'See AlgoGuard.', 'See AlgoGuard.', ['un17'], '', 'r4'),
  t('d38', 'ByteCheck: Compiler Bytecode & Intermediate Representation Matcher', '', 'merge', 'weak', ['17.6'], [0, 16], 'Same idea as reference ByteCheck.', 'See ByteCheck.', 'See ByteCheck.', ['un17'], '', 'r3'),
  t('d39', 'CodeProvenance: AST + Git Telemetry Engine', '', 'merge', 'moderate', ['17.6'], [0, 16], 'Same idea as reference CodeProvenance.', 'See CodeProvenance.', 'See CodeProvenance.', ['un17'], '', 'r2')
];

export const SUGGESTED_TITLES = [
  t('n1', '', 'Kapeng Barako Lot Traceability: QR-Coded Farm-to-Buyer Records for Lipa Liberica Coffee Growers in Partnership with the City Agriculture Office', 'recommended', 'strong', ['17.16', '17.17', '17.18'], [4, 12],
    'Growers, buyers and a public office share lot records, a multi-stakeholder data partnership.',
    'Lot registration, QR label printing, scan history, buyer view, and a weighing scale connected by serial port.',
    'Needs a grower group willing to log harvests.', ['coffeeBoard', 'pnsCoffee', 'lipaOffices', 'un17']),
  t('n2', '', 'Open Agricultural Production Data Portal and API for the Lipa City Agriculture Office', 'recommended', 'strong', ['17.18', '17.19'], [0, 16],
    'Directly targets timely, reliable and disaggregated local data.',
    'Encode existing office reports, publish aggregate tables and a read-only API, and record data provenance.',
    'Depends on which reports the office agrees to publish.', ['lipaOffices', 'ra10173', 'un17']),
  t('n3', '', 'Shared Equipment and Volunteer Skills Registry for Lipa City Cooperatives', 'revise', 'strong', ['17.17', '17.16'], [0, 16],
    'Lets cooperatives pool equipment and skills with City Cooperatives Office oversight.',
    'Listings, booking calendar, return checks, and usage reports.',
    'Liability for lent equipment needs cooperative rules.', ['lipaOffices', 'un17']),
  t('n4', '', 'Co-Located Calibration of Low-Cost PM2.5 Sensors Against a Reference Monitor with an Open Calibration Dataset', 'revise', 'strong', ['17.18', '17.6'], [8, 8],
    'Publishes calibration data others can reuse, strengthening 17.18 and 17.6.',
    'Place two to three sensor units beside a reference monitor, fit a correction model, publish the data.',
    'Requires EMB or LGU permission to co-locate.', ['denrAqi', 'lipaOffices', 'un17'], 'EMB CALABARZON lists no monitoring station in Lipa.'),
  t('n5', '', 'RFID-Based Rescue Equipment Lending and Readiness Tracker for the Lipa City DRRM Office', 'revise', 'moderate', ['17.17', '17.18'], [7, 9],
    'Improves readiness data shared between the city office and barangay teams.',
    'RFID tags, a reader station, check-out and return logs, and a readiness dashboard.',
    'Interview the office first about its current process.', ['lipaOffices', 'un17'], 'Current DRRM office inventory practice was not checked.'),
  t('n6', '', 'Power-Outage and Overheat Alarm with LTE SMS Escalation for Small Layer Poultry Houses', 'recommended', 'strong', ['17.6', '17.8'], [9, 7],
    'A low-cost alarm small farms can adopt, shared through the City Veterinary Office.',
    'Mains-loss detection, temperature sensor, backup battery, LTE modem, escalation contact list.',
    'Use LTE modules given the 2G and 3G phase-out.', ['psaEgg', 'ntc', 'lipaOffices', 'un17'])
];

export const hardwareShare = effort => {
  const total = effort[0] + effort[1];
  return total > 0 ? Math.round(effort[0] / total * 100) : 0;
};
export const ratioLabel = effort => `${hardwareShare(effort)} : ${100 - hardwareShare(effort)}`;
export const projectType = effort => effort[0] === 0 ? 'Software only' : hardwareShare(effort) >= 40 ? 'Hardware-integrated' : 'Software-led with hardware';
export const displayTitle = r => r.revised || r.original;

const reviewIndex = new Map(TITLE_REVIEWS.map(r => [normalizeTitle(r.original), r]));
export const reviewForTitle = title => reviewIndex.get(normalizeTitle(title)) || null;

export function filterTitles(list, {search = '', verdict = 'all', fit = 'all', kind = 'all'} = {}) {
  const query = normalizeTitle(search);
  return list.filter(r => (verdict === 'all' || r.verdict === verdict)
    && (fit === 'all' || r.fit === fit)
    && (kind === 'all' || (kind === 'hardware' ? r.effort[0] > 0 : r.effort[0] === 0))
    && (!query || normalizeTitle([r.original, r.revised, r.why, r.scope, r.risks, r.targets.join(' ')].join(' ')).includes(query)));
}

export function portfolioSummary(list) {
  const active = list.filter(r => r.verdict !== 'merge');
  const hw = active.reduce((a, r) => a + r.effort[0], 0), sw = active.reduce((a, r) => a + r.effort[1], 0);
  const count = key => list.filter(r => r.verdict === key).length;
  return {total: list.length, active: active.length, recommended: count('recommended'), revise: count('revise'), merge: count('merge'), park: count('park'), hardwareTitles: active.filter(r => r.effort[0] > 0).length, hardwareShare: hardwareShare([hw, sw])};
}

export function titleToProposal(r, id) {
  const sourceList = r.sources.map(s => SOURCES[s]?.label).filter(Boolean).join('; ');
  return {
    id,
    title: r.revised,
    domain: `SDG 17 · ${r.targets.join(', ')}`,
    desc: `${r.why}\n\nScope: ${r.scope}\n\nHardware : software effort ${ratioLabel(r.effort)} (estimated ${r.effort[0]} of ${BUILD_WEEKS} build weeks on hardware, ${r.effort[1]} on software).`,
    note: `Risks: ${r.risks}${r.unverified ? `\nNot confirmed: ${r.unverified}` : ''}\nSources: ${sourceList}`.slice(0, 2000)
  };
}
