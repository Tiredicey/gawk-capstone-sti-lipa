import {LAW_HEADS, PRIOR_OCT4} from './catalog-oct4-data.js';

export const OCT4_CHECKED_ON = '2026-10-04';

const head = (n, s) => {
  const h = LAW_HEADS[n]?.heads?.[s];
  if (!h) throw new Error(`Unverified section R.A. ${n} Sec. ${s}`);
  return h;
};
const L = (n, s, why, tier = 'primary') => [`R.A. ${n} Sec. ${s} (${head(n, s)})`, why, `law${n}`, tier];
const M = (cite, why, src) => [cite, why, src, 'primary'];
const I = (cite, why, src) => [cite, why, src, 'institutional'];
const H = (cite, why, src) => [cite, why, src, 'hardware'];
const D11 = L('10173', '11', 'Collect only what the stated purpose needs, and declare the purpose before collecting');
const D12 = what => L('10173', '12', `Name one lawful condition for ${what}, such as consent under Sec. 12(a) or functions of public authority under Sec. 12(e)`);
const D13 = what => L('10173', '13', `${what} is sensitive personal information under Sec. 3(l)(2); processing needs a Sec. 13 exception, usually specific prior consent under Sec. 13(a)`);
const D20 = L('10173', '20', 'Secondary: reasonable organizational, physical and technical safeguards, with breach notice under Sec. 20(f)');
const SRD = H('NTC MC 03-05-2007 Secs. 5.1, 5.4 (Short Range Devices: type approval and registration)', 'Hardware compliance only: radios must be type-approved and registered before use', 'ntcSrd');
const BLE = H('NTC type approval (rules for 2.4 GHz Bluetooth devices not read)', 'Hardware compliance only: confirm with NTC before deploying radios', 'ntcSrd');
const RFID = H('NTC MC 03-08-2006 (RFID bands, type approval and registration)', 'Hardware compliance only: RFID readers need type approval and one-time registration', 'ntcRfid');
const LTE = H('NTC MC 002-09-2025 (secondary summary)', 'Hardware compliance only: 3G ends 31 December 2026, so use LTE modules', 'ntc');
const TRAFFIC = M('R.A. 7160 Sec. 458(a)(5)(vi) (Powers of the Sangguniang Panlungsod: regulate traffic)', 'The city council regulates traffic on all streets and bridges', 'law7160');

export const OCT4_SOURCES = {
  lawphilSite: {label: 'The LawPhil Project · Philippine laws and jurisprudence', url: 'https://lawphil.net/', tier: 'Primary text host', date: 'Retrieved 2026-10-04', supports: 'Hosts the statute texts used for every section check in this batch. Its terms of reuse were not read.'},
  lipaOffices2: {label: 'Lipa City · Departments and Offices (rechecked)', url: 'https://lipa.gov.ph/departments-offices/', tier: 'Primary', date: 'Retrieved 2026-10-04', supports: 'Lists the Mayor\u2019s, Administrator\u2019s and Vice Mayor\u2019s offices, ENRO, Planning and Development Coordinator\u2019s Office (ICT Division), Engineer\u2019s, Health, Social Welfare and Development, Community Affairs, Civil Registrar, Veterinary, Permits and Licensing, Cooperatives, Agriculture, Legal, Personnel, General Services, Budget, Accounting, Treasurer\u2019s, Assessor\u2019s, DRRM, Public Order and Safety, Traffic Management and Transport, and Management Information Systems offices. No PESO, solo parent, youth development, tourism, PDAO or OSCA office appears. No office has agreed to partner.'},
  nistCsf: {label: 'NIST CSWP 29 · The NIST Cybersecurity Framework (CSF) 2.0', url: 'https://nvlpubs.nist.gov/nistpubs/CSWP/NIST.CSWP.29.pdf', tier: 'Standard', date: '2024-02-26', supports: 'The CSF Core Functions are Govern, Identify, Protect, Detect, Respond and Recover.'},
  nist63b: {label: 'NIST SP 800-63B · Authentication and Authenticator Management', url: 'https://pages.nist.gov/800-63-4/sp800-63b.html', tier: 'Standard', date: 'Retrieved 2026-10-04', supports: 'Applications assessed at AAL2 must offer a phishing-resistant authentication option.'},
  dcat3: {label: 'W3C · Data Catalog Vocabulary (DCAT) Version 3', url: 'https://www.w3.org/TR/vocab-dcat-3/', tier: 'Standard', date: 'W3C Recommendation 22 August 2024', supports: 'A vocabulary for publishing machine-readable dataset catalogs on the web.'},
  openalexOct4: {label: 'OpenAlex API · works search (title and abstract)', url: 'https://api.openalex.org/works', tier: 'Primary dataset', date: 'Attempted 2026-10-04', supports: 'Prior-work counts for this batch. The free daily budget for this network ran out on 2026-10-04, so titles without a count show "not counted yet".'}
};

for (const [n, law] of Object.entries(LAW_HEADS)) {
  const secs = Object.keys(law.heads).sort((a, b) => parseInt(a) - parseInt(b));
  OCT4_SOURCES[`law${n}`] = {label: `R.A. ${n} ${law.title} (Lawphil)`, url: law.url, tier: 'Primary', date: 'Opened 2026-10-04', supports: secs.length ? `Section headings checked on Lawphil: ${secs.map(x => `Sec. ${x} (${law.heads[x]})`).join('; ')}.` : 'Full text opened; cited through the amending section named in the legal basis.'};
}

export const OCT4_THEMES = {security: 'Cybersecurity and digital trust', culture: 'Culture, heritage and tourism'};

const rows = {}, verify = {}, grad = {}, probes = {};
const T = [];
function g(key, theme, verdict, fit, targets, effort, revised, why, scope, angle, risks, graduate, legal, probe, extra = [], unverified = '', check = null) {
  rows[key] = legal; grad[key] = graduate; probes[key] = probe;
  if (check) verify[key] = check;
  const sources = [...new Set([...legal.map(r => r[2]), ...extra, 'un17'])];
  T.push({key, theme, original: '', revised, verdict, fit, targets, effort, why, scope, angle, risks, sources, unverified, mergeInto: '', graduate, added: OCT4_CHECKED_ON});
}

g('g001', 'security', 'recommended', 'strong', ['17.8', '17.17', '17.18'], [0, 16],
  'Scam Message Triage Assistant: Classifying Reported Phishing and Social Engineering Messages in Filipino, Taglish and English with Referral Steps to Banks and E-Wallets for Lipa Residents',
  'Residents, financial institutions and the city share one structured record of reported scams, a public and private data partnership.',
  'Report form and forwarding inbox, consented message corpus, classifier with confidence and explanation, referral checklist naming the institution to call, monthly anonymized trend report for the City Public Order and Safety Office.',
  'Works on code-switched Filipino text and ends with the exact next step the law expects institutions to act on.',
  'No public labeled Filipino scam dataset was found; collect with consent. Report accuracy only on a held-out test set. The tool refers, it never holds or recovers funds.',
  'Low-resource, code-switched text classification under concept drift as scam scripts change: how fast does accuracy decay month to month, and which retraining schedule restores it?',
  [L('12010', '4', 'Defines money muling and social engineering schemes, the categories the classifier labels'), L('12010', '6', 'Institutions must protect account access; the referral step points users to them'), L('10175', '26', 'The CICC coordinates cybercrime prevention, a referral path for serious cases'), D11, D12('reported messages')],
  'phishing SMS detection Filipino', ['lipaOffices2'], '', ['Ask the City Public Order and Safety Office who receives scam complaints locally and whether PNP or NBI cyber units take referrals.', 'law10175']);
g('g002', 'security', 'revise', 'moderate', ['17.8', '17.6'], [2, 14],
  'Passkey Sign-In and Account Recovery Pilot for an STI College Lipa Student Web Portal Evaluated Against NIST SP 800-63B Phishing-Resistant Authentication',
  'Transfers a current authentication practice to a school system and publishes the usability results.',
  'WebAuthn passkey enrollment, fallback recovery codes, hardware security key option, sign-in success and time metrics, help desk recovery flow.',
  'Measures how Filipino students actually adopt passkeys, not only whether the code works.',
  'Needs school IT approval and a test portal, not the live student system. Shared phones complicate device-bound passkeys.',
  'Usable security study: compare sign-in success rate, recovery rate and time on task for passkeys against passwords with one-time codes, a publishable human-computer interaction design.',
  [I('NIST SP 800-63B (standard, not statute)', 'AAL2 applications must offer a phishing-resistant option; use it as the acceptance bar', 'nist63b'), D11, D20],
  'passkey usability students', ['sti'], 'Which portal STI College Lipa runs was not confirmed.', ['Ask the STI College Lipa IT office for a test instance and written approval.', 'sti']);
g('g003', 'security', 'recommended', 'strong', ['17.9', '17.17'], [0, 16],
  'Cybersecurity Self-Assessment Toolkit and Risk Register Mapped to NIST CSF 2.0 Functions for Lipa City Offices with the Management Information Systems Office',
  'Builds local capacity to manage cyber risk, with the MIS Office and other offices sharing one register.',
  'Questionnaire per CSF Function, evidence upload, risk register with owner and due date, heat map, progress over repeat assessments.',
  'Turns a national-level framework into a repeatable office-level check a small LGU team can run.',
  'Results are sensitive; restrict access. A self-assessment is not an audit.',
  'Cyber maturity measurement in local government: how reliable are office self-assessments when compared with an independent expert review of the same offices?',
  [L('10175', '26', 'The CICC formulates a national cybersecurity plan and runs a CERT; local registers can feed it'), L('10844', '6', 'The DICT harmonizes government ICT plans and protects government ICT infrastructure'), I('NIST CSF 2.0 (standard, not statute)', 'Six Core Functions organize the questionnaire', 'nistCsf')],
  'cybersecurity maturity local government', ['lipaOffices2'], '', ['Ask the Lipa City MIS Office whether a DICT or CICC self-assessment form is already required.', 'law10844']);
g('g004', 'security', 'revise', 'moderate', ['17.8', '17.6'], [6, 10],
  'Raspberry Pi Network Intrusion Sensor with Weekly Incident Digest for the STI College Lipa Computer Laboratories',
  'Shares a low-cost monitoring method other schools can copy.',
  'Mirrored switch port, open-source network monitor on a Raspberry Pi, rule tuning, alert dashboard, weekly digest for the IT office.',
  'Measures false alarms in a real school lab and documents the tuning, which most kits skip.',
  'Monitoring student traffic needs a written policy and notice. Never inspect content beyond what the policy allows.',
  'Anomaly detection with few labeled attacks: compare signature-based and learning-based detectors on lab traffic by detection rate and false alarms per day.',
  [L('10175', '4', 'Illegal access and interception are offenses; the sensor helps the IT office detect them'), D11, D12('network logs'), I('Institutional policy, not statute', 'Install only under the school acceptable use policy', 'sti')],
  'intrusion detection Raspberry Pi', ['sti'], '', ['Ask the STI College Lipa IT office for a written monitoring policy before any capture.', 'sti']);
g('g005', 'security', 'recommended', 'strong', ['17.9', '17.17'], [0, 16],
  'Personal Data Inventory and Breach Notification Drill Planner for Small Lipa Cooperatives Under the Data Privacy Act',
  'The City Cooperatives Office can share one privacy toolkit with many small cooperatives.',
  'Data inventory wizard, lawful basis per record type, retention schedule, breach drill scenario, notification template and timeline log.',
  'Rehearses a breach before it happens and records how long each step took.',
  'Templates are aids, not legal advice. Ask the NPC or counsel before relying on them.',
  'Compliance maturity in small organizations: does running a breach drill shorten the measured time to contain and notify in a second drill?',
  [L('10173', '20', 'Security of personal information, including breach notification under Sec. 20(f)'), L('10173', '16', 'Data subject rights the inventory must let the cooperative honor'), D11, D12('member records')],
  'data privacy compliance small organizations', ['lipaOffices2'], '', ['Ask the City Cooperatives Office which cooperatives would pilot it.', 'lipaOffices2']);
g('g006', 'security', 'revise', 'moderate', ['17.8', '17.17'], [0, 16],
  'Electronic Signature and Hash-Chained Audit Log for Barangay Certificates Issued in Lipa City',
  'A barangay and residents share a tamper-evident record of issued certificates.',
  'Certificate templates, signer authentication, document hash, append-only log, public verification page by QR code.',
  'Anyone can check a printed certificate against the log without seeing personal data.',
  'Electronic signature validity depends on the prescribed procedure; get the barangay\u2019s and counsel\u2019s view.',
  'Verifiable credentials for local government documents: compare hash chains with W3C-style credential formats on tamper detection, cost and verification time.',
  [L('8792', '7', 'Electronic documents have legal effect'), L('8792', '8', 'Electronic signatures are equivalent when a prescribed, unalterable procedure exists'), D11, D12('certificate requests')],
  'document verification QR hash', ['lipaOffices2'], 'Which barangay would pilot it was not checked.');
g('g007', 'security', 'revise', 'moderate', ['17.6', '17.8'], [0, 16],
  'Voice-Call Scam Awareness Simulator and Synthetic Voice Screening Study with Consenting Senior Citizens in Lipa City',
  'Shares detection knowledge with families and the community, and tests a technology on local speech.',
  'Awareness simulator with scripted calls, consented recordings, a screening model for synthetic speech, results report.',
  'Tests detection on Filipino and Tagalog speech, which global benchmarks rarely cover.',
  'Research-heavy. Detection rates on test sets do not transfer to real calls. Never record calls without consent.',
  'Audio deepfake detection for a low-resource language: how much does a detector trained on English lose on Tagalog speech, and how much local data closes the gap? A doctoral-scale question if extended.',
  [L('12010', '4', 'Social engineering schemes include deceptive electronic communications'), D11, D12('voice recordings')],
  'audio deepfake detection', [], 'No Filipino synthetic speech dataset was searched for. Whether voice data is sensitive under R.A. 10173 was not settled.');
g('g008', 'security', 'revise', 'moderate', ['17.8', '17.7'], [7, 9],
  'Ransomware-Resilient Offline Backup Appliance with Scheduled Restore Drills for Small Clinics in Lipa City',
  'Transfers a low-cost resilience practice to small health providers.',
  'Single-board computer with rotating drives, air-gap schedule, encrypted backups, restore drill log and alerting.',
  'Proves recovery with timed restore drills instead of trusting backups blindly.',
  'Patient records are sensitive. Test with synthetic data first.',
  'Recovery objectives in resource-limited settings: measure restore success rate and restore time across months of scheduled drills.',
  [L('11223', '36', 'Health service providers maintain a health information system'), D13('Patient health data'), D20],
  'ransomware backup small healthcare', [], 'No partner clinic was contacted.');
g('g009', 'security', 'revise', 'moderate', ['17.9', '17.17'], [0, 16],
  'Consent-Based Phishing Simulation and Micro-Lesson Platform for Lipa City Hall Employees with the Personnel Office and MIS Office',
  'Builds staff capacity with two city offices sharing results.',
  'Opt-in campaign, simulated emails, instant micro-lesson, aggregate department reports only, no individual shaming.',
  'Reports only aggregates and teaches at the moment of the click.',
  'Needs ethics approval and staff notice. Never publish named results.',
  'Behavior change in security training: do micro-lessons at the moment of a click lower repeat click rates more than an annual seminar?',
  [L('10844', '6', 'The DICT develops ICT capability across government'), D11, D12('click results')],
  'phishing simulation training employees', ['lipaOffices2']);
g('g010', 'security', 'recommended', 'moderate', ['17.8', '17.18'], [0, 16],
  'Website Uptime, TLS and Defacement Monitor with Public Status Pages for Batangas LGU Websites',
  'Publishes timely data on the reliability of public digital services.',
  'Scheduled checks, certificate expiry alerts, visual diff for defacement, public status page, monthly report.',
  'Gives LGUs early warning and gives citizens an honest status page.',
  'Checks only public pages. Never probe beyond normal visits.',
  'How often do Batangas LGU sites go down, lose valid TLS or change unexpectedly over a semester, and does alerting shorten time to repair?',
  [L('10175', '4', 'Defacement may involve data or system interference offenses'), L('10844', '6', 'The DICT protects integrated government ICT infrastructure')],
  'website defacement detection', []);
g('g011', 'security', 'revise', 'moderate', ['17.8'], [0, 16],
  'Payment Screenshot Verifier for Small Lipa Merchants Matching Customer Proofs Against the Merchant\u2019s Own E-Wallet Notifications',
  'Helps small businesses trust digital payments, supporting enabling technology use.',
  'Notification capture on the merchant phone, screenshot upload, reference number and amount matching, mismatch alert.',
  'Uses the merchant\u2019s own data, so no e-wallet API access is needed.',
  'Reading notifications needs the merchant\u2019s consent and phone permissions.',
  'Which features of a payment proof (amount, reference, timing, image traces) best separate fake from genuine screenshots, measured as precision and recall on consented merchant data?',
  [L('12010', '4', 'Money muling and social engineering schemes behind fake payment proofs'), L('11765', '2', 'State policy to protect financial consumers'), D11],
  'fake payment screenshot fraud', []);
g('g012', 'security', 'revise', 'moderate', ['17.8', '17.17'], [0, 16],
  'Lost or Stolen SIM Response Assistant Guiding Lipa Residents Through Telco and E-Wallet Lockdown Steps',
  'Links residents, telcos and financial institutions through one guided response.',
  'Step-by-step lockdown checklist, contact directory, time log, printable report for the bank or police.',
  'Cuts the minutes between losing a phone and locking accounts.',
  'Contact numbers change; date-stamp each entry.',
  'Incident response for individuals: does a guided checklist shorten time to full account lockdown compared with unguided users in a timed scenario test?',
  [L('12010', '6', 'Institutions protect account access and act on disputed transactions'), L('11934', '4', 'SIMs must be registered, so telcos can verify the owner')],
  'SIM swap fraud', []);
g('g013', 'health', 'recommended', 'strong', ['17.18', '17.17'], [0, 16],
  'Newborn Screening Recall and Follow-Up Tracker Linking Lipa Birthing Facilities, the City Health Office and Families of Positive Screens',
  'Facilities, the city and families share timely follow-up data so no positive screen is lost.',
  'Sample dispatch log, result intake, recall queue with SMS, follow-up status by barangay, monthly turnaround report.',
  'Measures days from birth to sample to recall, the delays the national database does not show locally.',
  'Infant health data is sensitive. Use the facility\u2019s own records; do not duplicate the national database.',
  'Health information system turnaround analysis: which step (collection, transport, result release, recall) causes most delay before a positive screen is acted on?',
  [L('9288', '6', 'Screening is done after 24 hours of life but not later than three days from delivery'), L('9288', '15', 'Screening centers consolidate patient databases with the NIH reference center'), D13('Infant health data')],
  'newborn screening follow-up information system', ['lipaOffices2'], '', ['Ask the City Health Office which newborn screening center serves Lipa facilities.', 'law9288']);
g('g014', 'health', 'revise', 'moderate', ['17.18', '17.17'], [3, 13],
  'Newborn Hearing Screening Referral and Intervention Tracker for Lipa Birthing Facilities with Tablet-Based Result Capture',
  'Shares screening results between facilities and referral centers for timely intervention.',
  'Result capture by manual entry or device export, refer-and-rescreen queue, intervention milestones, coverage report.',
  'Tracks the gap between a failed screen and confirmed diagnosis.',
  'Device integration depends on the screener model. Health data is sensitive.',
  'Loss to follow-up in early hearing detection: which family and facility factors predict a missed rescreen, modeled on tracker records?',
  [L('9709', '12', 'Hospitals submit screening results to the NIH reference center for a national database'), D13('Infant hearing results')],
  'newborn hearing screening follow-up', [], 'Which Lipa facilities run hearing screening was not checked.');
g('g015', 'health', 'recommended', 'strong', ['17.18', '17.17'], [2, 14],
  'Kindergarten Vision Screening Data Capture and Eye Care Referral System for Lipa Public Schools Under the National Vision Screening Program',
  'DepEd, the DOH and eye care practitioners share one screening database, which the law itself requires.',
  'Teacher app for screening results, referral slips, eye care follow-up entry, shareable aggregate dashboard.',
  'Builds the shared database the law names, at division scale.',
  'Child health data is sensitive. Needs DepEd division approval.',
  'Screening program evaluation: what share of referred pupils reach an eye care practitioner, and how often does teacher screening agree with the practitioner\u2019s finding?',
  [L('11358', '5', 'DepEd leads vision screening of public kindergarten pupils with DOH and PERI'), L('11358', '9', 'The screening database is shared among DepEd, DOH, PERI and other agencies'), D13('Child vision data')],
  'school vision screening referral', [], '', ['Ask the DepEd Lipa City division how screening results are recorded now.', 'law11358']);
g('g016', 'health', 'recommended', 'strong', ['17.18', '17.19'], [0, 16],
  'Barangay Health Station Notifiable Disease Line-List and Early Clustering Dashboard for the Lipa City Health Office',
  'Delivers timely disaggregated surveillance data from barangays to the city.',
  'Case line-list entry, offline sync, weekly counts by barangay, simple cluster alerts, export in the format the surveillance unit uses.',
  'Spots clusters at barangay level before weekly reports are compiled.',
  'Must feed, not replace, the official DOH systems. Patient data is sensitive.',
  'Which cluster detection method flags real barangay outbreaks earliest with the fewest false alarms when weekly counts are small? Compare methods on historical line-lists.',
  [L('11332', '6', 'The DOH lists the official surveillance systems for mandatory reporting, including FHSIS and PIDSR'), D13('Patient health data'), D20],
  'disease surveillance cluster detection barangay', ['lipaOffices2'], '', ['Ask the City Health Office epidemiology unit which export format PIDSR accepts.', 'law11332']);
g('g017', 'health', 'recommended', 'strong', ['17.18', '17.17'], [0, 16],
  'Immunization Defaulter Tracing and SMS Reminder System for Barangay Health Stations in Lipa City',
  'Health workers and families share reminders and coverage data.',
  'Child schedule from the national list, due and overdue lists, SMS reminders, home visit log, coverage by barangay.',
  'Turns a static schedule into a daily list of who to visit.',
  'Child health data is sensitive. Message wording must not reveal health details.',
  'Do SMS reminders raise on-time vaccination compared with barangays that use home visits only? Measure the share of doses given within the due window.',
  [L('10152', '3', 'Mandatory basic immunization covers listed vaccine-preventable diseases, free up to age five'), L('10152', '5', 'Birth attendants must inform parents about immunization'), D13('Child health data')],
  'immunization reminder SMS defaulter', ['lipaOffices2']);
g('g018', 'health', 'revise', 'moderate', ['17.17', '17.18'], [0, 16],
  'Lactation Station Directory and Compliance Checklist for Lipa Workplaces and Public Buildings',
  'Employers, the city and mothers share a verified directory.',
  'Station listing, checklist of required facilities, photo evidence, user feedback, compliance report.',
  'Turns a mandate into a map mothers can actually use.',
  'Listing a station needs the owner\u2019s consent.',
  'What share of covered Lipa establishments have a lactation station meeting the listed requirements, and does a public directory change that share over time?',
  [M('R.A. 7600 Sec. 11 (Establishment of Lactation Stations), inserted by R.A. 10028 Sec. 6', 'All health and non-health facilities, establishments or institutions establish lactation stations with listed equipment', 'law10028')],
  'lactation room workplace', []);
g('g019', 'health', 'recommended', 'strong', ['17.18', '17.17'], [3, 13],
  'Child Nutrition Status Tracker with Weight and Height Capture for School Feeding Program Beneficiaries in Lipa Public Schools',
  'Schools, the city and the nutrition council share monitoring data.',
  'Bluetooth scale and height board entry, z-score computation, beneficiary list, progress report.',
  'Computes nutrition status at capture, so teachers see who is improving.',
  'Child data is sensitive. Use the reference standard DepEd uses.',
  'How accurate are teacher-captured weights and heights compared with health worker measurements, and how does that error change program impact estimates?',
  [L('11037', '6', 'The NNC harmonizes national and local nutrition databases'), L('11037', '9', 'Agencies monitor and report the program\u2019s impact'), D13('Child health data'), BLE],
  'school feeding nutritional status monitoring', [], 'The anthropometric reference DepEd uses was not confirmed.');
g('g020', 'health', 'recommended', 'strong', ['17.9', '17.18'], [0, 16],
  'First 1,000 Days Mother and Child Visit Planner for Barangay Health Workers and Nutrition Scholars in Lipa City',
  'Builds barangay health worker capacity with shared visit data.',
  'Household list, visit schedule, counseling checklists, referral flags, offline mode, supervisor summary.',
  'Supports the workers the law says must be trained.',
  'Health data is sensitive. Keep content aligned with DOH materials.',
  'Mobile health for community workers: does a visit planner raise completed visits and record completeness compared with paper logs over three months?',
  [L('11148', '12', 'DOH and NNC train barangay nutrition scholars and health workers'), L('11148', '4', 'Scaling up health and nutrition in the first 1,000 days'), D13('Maternal and child health data')],
  'community health worker mobile app maternal', ['lipaOffices2']);
g('g021', 'health', 'revise', 'moderate', ['17.18'], [0, 16],
  'Tuberculosis Case Notification and Treatment Adherence Support App for a Lipa City Health Center',
  'Improves timely case data flowing to the DOH.',
  'Case registration, notification export, daily dose check-in by video or SMS, missed-dose alerts.',
  'Adds adherence data at the clinic level.',
  'TB status is sensitive health data. Stigma risk; design messages carefully.',
  'Do video or SMS check-ins raise treatment adherence among consenting TB patients, measured as the share of doses confirmed, compared with usual care?',
  [L('10767', '12', 'Health facilities must notify the DOH of all TB cases'), D13('TB health data')],
  'tuberculosis treatment adherence digital', []);
g('g022', 'health', 'revise', 'moderate', ['17.17', '17.18'], [0, 16],
  'Voluntary Blood Donor Registry and Mobile Blood Drive Scheduler for Lipa City Barangays',
  'Links donors, blood services and barangays in one partnership.',
  'Donor registration, eligibility interval reminders, drive calendar, turnout reports.',
  'Reminds donors when they become eligible again.',
  'Donor health answers are sensitive. Blood screening stays with the blood service.',
  'Which donor traits and reminder timings predict a repeat donation within twelve months? Build and validate a retention model on registry data.',
  [L('7719', '4', 'Voluntary blood donation is promoted through public education with LGUs and barangays'), D13('Donor health data')],
  'blood donor recruitment app', [], 'Which blood service collects in Lipa was not checked.');
g('g023', 'health', 'park', 'weak', ['17.18'], [0, 16],
  'Hospital-Based Cancer Registry Entry and Quality Check Tool for a Batangas Hospital',
  'Data quality for a registry; weaker partnership angle.',
  'Case abstract form, coding helpers, completeness checks, export.',
  'Checks data quality at the moment of entry instead of at year-end review.',
  'Needs hospital approval and coded data skills. Highly sensitive data.',
  'How complete and consistent are hospital cancer registry abstracts, and which entry-time checks cut missing or conflicting fields the most?',
  [L('11215', '29', 'Every hospital, including clinics, keeps its own cancer registry'), D13('Cancer patient data')],
  'hospital cancer registry data quality', []);
g('g024', 'health', 'revise', 'moderate', ['17.8'], [0, 16],
  'Patient Medication Profile and Dispensing Record System for Small Independent Pharmacies in Lipa City',
  'Brings enabling technology to small pharmacies.',
  'Prescription entry, medication profile, label printing, retention and inspection view.',
  'Meets the recording duty while flagging duplicate therapy.',
  'Prescription data is sensitive. Not a clinical decision system.',
  'How often do dispensing records reveal duplicate therapy or interaction risks in small pharmacies, and how many alerts do pharmacists accept or override?',
  [L('10918', '37', 'Pharmacies record dispensed prescriptions and keep them open for inspection'), D13('Prescription data')],
  'pharmacy dispensing record system', []);
g('g025', 'education', 'recommended', 'strong', ['17.9', '17.17'], [0, 16],
  'ARAL Program Tutor Matching and Blended Session Scheduler for Lipa Public Elementary Schools',
  'Schools and tutors build learner capacity together, with a college partner supplying the system.',
  'Learner list from teachers, tutor pool, matching rules that block a teacher from tutoring own learners, session log, progress checks.',
  'Encodes the law\u2019s rule that teachers cannot tutor their own learners.',
  'Learner data is sensitive. Needs DepEd approval.',
  'Do learners matched by the scheduler gain more on ARAL reading and math assessments than those tutored ad hoc, controlling for baseline scores?',
  [L('12028', '7', 'Teachers, para-teachers and pre-service teachers may tutor; teachers may not tutor their own learners'), L('12028', '15', 'Face-to-face, online or blended tutorial delivery'), D13('Learner education data')],
  'tutoring program learning recovery', [], 'Sec. 7 names teachers, para-teachers and pre-service teachers as tutors; BSIT students build the system, not tutor.', ['Ask the DepEd Lipa City division how ARAL tutors are assigned now.', 'law12028']);
g('g026', 'education', 'recommended', 'strong', ['17.9', '17.17'], [0, 16],
  'School Care Center Appointment, Referral and Caseload Dashboard for a Lipa Public Secondary School Under the Basic Education Mental Health Act',
  'Schools and referral partners share structured, minimal data.',
  'Self or teacher referral, appointment queue, referral to external providers, anonymized caseload report.',
  'Supports the care centers the 2024 law creates; the existing wellness title (c25) serves a college.',
  'Mental health data is highly sensitive. Counselors control access.',
  'Does an appointment and referral system shorten the wait from first referral to first session, and does it change how many learners seek help?',
  [L('12080', '7', 'A care center is established in every school'), L('12080', '8', 'Functions of the center, including referrals'), D13('Student mental health data')],
  'school mental health referral system', []);
g('g027', 'education', 'recommended', 'moderate', ['17.18'], [0, 16],
  'Anti-Bullying Incident Reporting and Case Workflow with Division Statistics Export for Lipa Public Schools',
  'Produces the reliable statistics schools must already submit.',
  'Anonymous and named reporting, case workflow for the designated officer, retaliation flag, yearly statistics export.',
  'Generates the division report the law requires; the existing STI title (d08) covers college discipline, not basic education.',
  'Minor students; strict access control. Needs DepEd approval.',
  'Does anonymous digital reporting raise bullying disclosure rates compared with paper reports, without raising unfounded reports?',
  [L('10627', '3', 'Schools adopt anti-bullying policies'), L('10627', '4', 'The principal oversees mechanisms and reports'), L('10627', '5', 'Schools report bullying statistics to the division'), D13('Offense proceedings data about students')],
  'bullying reporting system school', []);
g('g028', 'education', 'revise', 'moderate', ['17.17'], [0, 16],
  'Safe Spaces Act Complaint Intake and Committee Case Tracker for STI College Lipa',
  'An institutional partnership between school and committee.',
  'Confidential intake, case timeline, committee notes, published grievance procedure.',
  'Keeps the procedure the law requires visible to students.',
  'Highly sensitive; legal review required.',
  'Does a visible, confidential intake channel change students\u2019 stated willingness to report and the time to resolve complaints?',
  [L('11313', '21', 'Schools designate an officer to receive complaints and publish grievance procedures'), L('11313', '22', 'School heads create an independent internal mechanism to investigate complaints'), D13('Offense proceedings data')],
  'sexual harassment reporting campus', ['sti']);
g('g029', 'education', 'revise', 'moderate', ['17.6', '17.8'], [3, 13],
  'Offline-First Open Distance Learning Module Server on a Raspberry Pi for Students with Weak Internet in Lipa Barangays',
  'Shares learning content where networks are weak.',
  'Local Wi-Fi hotspot, module library, quiz sync when online, usage log.',
  'Delivers digital content with no internet connection.',
  'Content licensing. Radio rules apply to the hotspot.',
  'What usage patterns appear when learners access modules offline, and do they predict quiz performance as well as online learning analytics do?',
  [L('10650', '9', 'Open distance learning may use ICT and other delivery modes'), L('10650', '4', 'Coverage: higher education institutions with ODL programs'), SRD],
  'offline learning server Raspberry Pi', []);
g('g030', 'education', 'revise', 'moderate', ['17.9'], [0, 16],
  'PQF-Aligned Skills Portfolio and Level Descriptor Self-Mapping Tool for BSIT Students of STI College Lipa',
  'Builds individual capacity mapped to the national qualifications framework.',
  'Evidence upload, descriptor mapping, adviser review, exportable portfolio.',
  'Links coursework evidence to national level descriptors.',
  'The framework does not certify anything here.',
  'How closely do BSIT students\u2019 self-mapped PQF levels agree with adviser ratings, measured with an agreement statistic such as weighted kappa?',
  [L('10968', '4', 'A PQF describes levels of educational qualifications'), L('10968', '8', 'Level descriptors in knowledge, skills and values, application and independence')],
  'qualifications framework e-portfolio', ['sti']);
g('g031', 'education', 'revise', 'moderate', ['17.17', '17.9'], [0, 16],
  'Enterprise-Based Training Agreement and Trainee Logbook System for Lipa Employers and TESDA-Registered Programs',
  'Enterprises, trainees and TESDA share training records.',
  'Program registry, agreement builder with required contents, attendance and competency logbook.',
  'Covers the agreement fields the 2024 law lists.',
  'Needs a pilot enterprise.',
  'Do digital logbooks raise the share of trainees who complete competency assessment, compared with paper logbooks?',
  [L('12063', '9', 'EBET programs register with TESDA'), L('12063', '12', 'Contents of the EBET agreement'), D11, D12('trainee records')],
  'apprenticeship logbook system', []);
g('g032', 'education', 'revise', 'weak', ['17.9'], [0, 16],
  'Continuing Professional Development Credit Tracker for Lipa Teachers and Nurses',
  'Individual capacity tracking; modest SDG 17 link.',
  'Certificate upload, credit totals, renewal countdown.',
  'Shows the renewal gap early, before a license lapses.',
  'Credit rules vary by profession.',
  'What patterns in CPD credit earning predict late license renewal, and can a reminder model reduce late renewals?',
  [L('10912', '10', 'CPD is required for license renewal'), L('10912', '11', 'Recognition and accumulation of credit units')],
  'continuing professional development tracking', []);
g('g033', 'education', 'revise', 'moderate', ['17.9'], [0, 16],
  'Tertiary Education Subsidy and Scholarship Eligibility Assistant for Senior High Graduates in Lipa City',
  'Builds access to education funding.',
  'Questionnaire, program list with sources, document checklist, deadline reminders.',
  'Explains eligibility rules in plain words with the source of each rule.',
  'Rules change yearly; date-stamp each rule.',
  'Does a plain-language eligibility assistant raise the share of senior high graduates who complete an aid application? Compare with a control group.',
  [L('10931', '7', 'The TES supports students in SUCs, LUCs, private HEIs and TVIs'), D11],
  'scholarship eligibility chatbot', []);
g('g034', 'education', 'revise', 'moderate', ['17.17'], [0, 16],
  'Special Program for Employment of Students Job Matching for Lipa Employers and Student Applicants',
  'Employers, students and the city share one matching platform.',
  'Employer posts, applicant profiles with age and eligibility checks, placement records.',
  'Encodes the eligibility rules of the amended law.',
  'Run with the office that manages SPES; Lipa has no PESO listed online.',
  'Does rule-based matching place more eligible applicants in SPES slots, and faster, than manual screening? Measure placement rate and days to placement.',
  [M('R.A. 9547 Sec. 1 (employment of students), as amended by R.A. 10917 Sec. 1', 'Employers of at least ten persons may employ poor but deserving students, out-of-school youth or dependents of displaced workers aged 15 to 30', 'law10917'), D11],
  'student job matching platform', ['lipaOffices2'], 'No PESO was found on lipa.gov.ph.');
g('g035', 'education', 'revise', 'moderate', ['17.9'], [0, 16],
  'Senior High School Track Recommender with Explainable Results for Grade 10 Career Guidance in Lipa',
  'Supports career guidance capacity.',
  'Interest and grade inputs, explainable recommendation, counselor review.',
  'Shows why each track is suggested, so counselors can challenge it.',
  'Must assist, not decide. Bias testing required.',
  'Are track recommendations equally accurate across sex, school type and income groups? Measure fairness gaps and test a mitigation.',
  [L('10533', '9', 'DepEd conducts career advocacy activities for secondary students'), D13('Student education data')],
  'senior high school strand recommendation', []);
g('g036', 'education', 'recommended', 'strong', ['17.6', '17.16'], [0, 16],
  'Filipino Sign Language Vocabulary Learning App with Deaf Community Validated Videos for Hearing Classmates and Teachers',
  'Shares language knowledge through a partnership with the deaf community.',
  'Video lessons recorded by deaf signers, practice quizzes, teacher mode.',
  'Content is made and checked by deaf signers, not generated.',
  'Needs deaf community partners and consent for videos.',
  'Can a model trained on community-validated FSL videos recognize isolated signs reliably across signers? This leads to continuous sign recognition, a doctoral topic.',
  [L('11106', '4', 'FSL in education'), L('11106', '11', 'Agencies and LGUs promote FSL'), D11],
  'Filipino sign language learning app', [], 'No Lipa deaf organization was contacted.');
