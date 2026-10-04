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
