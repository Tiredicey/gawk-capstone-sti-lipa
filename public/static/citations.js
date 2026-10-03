export const CITATIONS_CHECKED_ON = '2026-10-03';

const lp = path => `https://lawphil.net/${path}.html`;
const law = (label, path, date, supports) => ({label, url: lp(path), tier: 'Primary', date, supports});

export const CITATION_SOURCES = {
  ra8485: law('R.A. 8485 Animal Welfare Act of 1998 (Lawphil)', 'statutes/repacts/ra1998/ra_8485_1998', '1998', 'Sec. 3: the BAI Director supervises and regulates the establishment, operation and maintenance of stockyards, corrals and any other structure for the confinement of animals where they are bred, maintained or kept for sale or trade.'),
  ra10631: law('R.A. 10631 amending the Animal Welfare Act (Lawphil)', 'statutes/repacts/ra2013/ra_10631_2013', '2013', 'Sec. 2 amends R.A. 8485 Sec. 6: unlawful to neglect to provide adequate care, sustenance or shelter to any animal.'),
  ra8435: law('R.A. 8435 Agriculture and Fisheries Modernization Act (Lawphil)', 'statutes/repacts/ra1997/ra_8435_1997', '1997', 'Sec. 39: a market information system for farmers, cooperatives, traders, processors, LGUs and the Department. Sec. 41: a National Information Network down to municipal offices.'),
  ra8293: law('R.A. 8293 Intellectual Property Code (Lawphil)', 'statutes/repacts/ra1997/ra_8293_1997', '1997', 'Sec. 172.1 lists protected works, including (a) books, articles and other writings and (n) computer programs. Sec. 193.1: the author may require that authorship be attributed to him.')
};

export const DPA_FRAMING = 'The system will comply with the Data Privacy Act (R.A. 10173), in particular the general data privacy principles (Sec. 11), the criteria for lawful processing (Sec. 12) and, where it applies, the rules on sensitive personal information (Sec. 13).';

const P = (cite, why, src) => [cite, why, src, 'primary'];
const H = (cite, why, src) => [cite, why, src, 'hardware'];
const I = (cite, why, src) => [cite, why, src, 'institutional'];

const dpa11 = P('R.A. 10173 Sec. 11 (General Data Privacy Principles)', 'Processing must follow transparency, legitimate purpose and proportionality', 'dpa');
const dpa12 = what => P('R.A. 10173 Sec. 12 (Criteria for Lawful Processing of Personal Information)', `Name one lawful condition for ${what}, such as consent under Sec. 12(a)`, 'dpa');
const dpa12e = what => P('R.A. 10173 Sec. 12(e) (Criteria for Lawful Processing: functions of public authority)', `Lawful basis when the city office processes ${what} for its mandate`, 'dpa');
const dpa13 = what => P('R.A. 10173 Sec. 13 (Sensitive Personal Information and Privileged Information)', `${what} is sensitive personal information; processing is prohibited unless a Sec. 13 exception applies, usually specific prior consent under Sec. 13(a)`, 'dpa');
const dpa3l2 = P('R.A. 10173 Sec. 3(l)(2) (Definition of Terms: sensitive personal information)', 'Information about an individual\u2019s health, education or offense proceedings is sensitive personal information', 'dpa');
const dpa20 = P('R.A. 10173 Sec. 20 (Security of Personal Information)', 'Secondary: reasonable organizational, physical and technical safeguards, and breach notice under Sec. 20(f)', 'dpa');
const dpa21b = what => P('R.A. 10173 Sec. 21(b) (Principle of Accountability)', `Secondary: designate an individual accountable for ${what}`, 'dpa');
const integrity = I('Institutional policy, not statute', 'Justify this title through the STI academic integrity policy and the instructor\u2019s course rules. No statute requires the system.', 'sti');
const ipCode = P('R.A. 8293 Sec. 172.1(a), (n) (Literary and Artistic Works)', 'Student writings and computer programs are protected works, which frames similarity checking as protecting authorship', 'ra8293');
const ipMoral = P('R.A. 8293 Sec. 193.1 (Scope of Moral Rights: attribution)', 'The author may require that authorship be attributed to him', 'ra8293');
const srd = H('NTC MC 03-05-2007 Secs. 5.1, 5.4 (Short Range Devices: type approval and registration)', 'Hardware compliance only: radios must be type-approved and registered before use. This does not establish why the system should exist.', 'ntcSrd');
const rfid = H('NTC MC 03-08-2006 (RFID bands, type approval and registration)', 'Hardware compliance only: RFID readers need type approval and one-time registration', 'ntcRfid');
const lte = H('NTC MC 002-09-2025 (secondary summary)', 'Hardware compliance only: 3G ends 31 December 2026, so use LTE modules. Read the circular itself before citing.', 'ntc');
const drrmPartner = P('R.A. 10121 Sec. 12(c)(13) (LDRRMO functions: partnerships)', 'The LDRRMO develops partnership mechanisms with the private sector, CSOs and volunteer groups', 'ra10121');
const drrmDb = P('R.A. 10121 Sec. 12(c)(12) (LDRRMO functions: database)', 'The LDRRMO maintains a database of human resource, equipment and critical infrastructure, including evacuation centers', 'ra10121');
const drrmEws = P('R.A. 10121 Sec. 12(c)(5) (LDRRMO functions: early warning)', 'The LDRRMO operates a multi-hazard early warning system that gives accurate and timely advice', 'ra10121');
const drrmOffice = P('R.A. 10121 Sec. 12(a) (Local DRRM Office)', 'An LDRRMO is established in every province, city and municipality', 'ra10121');
const coop = P('R.A. 9520 Art. 5(8) (Definition of Terms: Cooperative Development Authority)', 'The CDA is the agency in charge of the registration and regulation of cooperatives', 'ra9520');
const coopOfficer = why => P('R.A. 7160 Sec. 487 (Qualifications, Powers and Duties of the cooperatives officer)', why, 'lgc');
const traffic = P('R.A. 7160 Sec. 458(a)(5)(vi) (Powers of the Sangguniang Panlungsod: regulate traffic)', 'The city council regulates traffic on all streets and bridges', 'lgc');
const zeroContact = P('R.A. 9485 Sec. 7 (Zero-Contact Policy), inserted by R.A. 11032 Sec. 7', 'No contact with applicants except during preliminary assessment, unless strictly necessary', 'ra11032');
const charter = P('R.A. 9485 Sec. 6 (Citizen\u2019s Charter), as amended by R.A. 11032 Sec. 6', 'Every LGU publishes a checklist of requirements, the procedure, the person responsible for each step and the maximum time to conclude the process', 'ra11032');
const processing = P('R.A. 9485 Sec. 9(b) (Accessing Government Services: action of offices), as renumbered by R.A. 11032 Sec. 9', 'Applications are acted on within the processing time in the Citizen\u2019s Charter, not longer than three working days for simple transactions', 'ra11032');
const animalBai = P('R.A. 8485 Sec. 3 (BAI supervision of animal confinement structures)', 'The BAI regulates the operation and maintenance of structures where animals are bred and kept for sale or trade', 'ra8485');
const animalCare = P('R.A. 8485 Sec. 6 (unlawful acts), as amended by R.A. 10631 Sec. 2', 'Unlawful to neglect to provide adequate care, sustenance or shelter to any animal', 'ra10631');
const agriMachine = what => P('R.A. 10601 Sec. 3(a) (Definition of Terms: agricultural and fisheries machinery)', `Agricultural machinery expressly includes ${what}`, 'ra10601');
const nemsChartered = P('R.A. 9003 Sec. 7 (National Ecology Center), as amended by R.A. 11898 Sec. 5', 'The national database records recyclers, the materials they buy and their prices, and the recovery rate of each plastic type', 'ra11898');
const pnsCoffee = why => P('PNS/BAFS 01:2025 (Green Coffee Beans: grading and classification)', why, 'pnsCoffee');
const aqi = why => P('DENR DAO 2020-14 (PM2.5 AQI breakpoints)', why, 'denrAqi');
const barrierFree = P('R.A. 7277 Sec. 25 (Barrier-Free Environment)', 'The State ensures a barrier-free environment in public and private buildings', 'ra7277');

export const CORRECTED_LEGAL = {
  r1: [P('R.A. 7160 Sec. 458(a)(3)(vi) (Powers of the Sangguniang Panlungsod: tricycles)', 'Lipa City council regulates tricycles and grants franchises, subject to DOTC guidelines', 'lgc'), P('DOTC tricycle guidelines (1994)', 'The council fixes fares by zone after public hearing; LTFRB powers over tricycles-for-hire ceased 30 June 1992', 'dotc94'), P('LTO v. City of Butuan, G.R. No. 131512, 20 January 2000 (Vitug, J.)', 'Read in full on Lawphil on 2026-10-03. The devolved power is franchising and regulation; registration and driver licensing stay with the LTO', 'butuan'), P('DILG MC 2023-195 (tricycles on national highways)', 'No tricycles on national highways', 'dilg'), dpa11, dpa12('driver and passenger records')],
  r2: [dpa3l2, dpa13('Student work tied to a student'), ipCode, integrity],
  r3: [ipCode, integrity],
  r4: [ipCode, integrity],
  d02: [traffic, dpa11, dpa12('plate numbers and reservation accounts'), srd],
  d03: [drrmOffice, P('R.A. 10173 Sec. 13(c) (Sensitive Personal Information: protect life and health)', 'Health data may be processed to protect life when the person cannot consent', 'dpa'), lte],
  d04: [P('R.A. 8749 Sec. 21 (Pollution from Motor Vehicles)', 'Only the official emission test counts for registration; label readings indicative', 'ra8749'), coop, coopOfficer('A city cooperatives officer is optional; confirm Lipa has one')],
  d05: [aqi('Report PM2.5 using the national AQI breakpoints'), I('EMB CALABARZON station list (fact, not law)', 'No regional station is in Lipa', 'embR4a')],
  d06: [pnsCoffee('National green coffee bean grading standard (listing confirmed, clauses not yet read)'), P('PNS/BAFS 342:2022 (Green Coffee Bean Sorter: methods of test)', 'Test method for coffee bean sorters', 'pnsSorter')],
  d07: [drrmEws, drrmPartner, srd, H('NTC MC 01-02-2020 (SRD band table)', 'Hardware compliance only: listed sub-1 GHz SRD bands are 433 MHz and 868 to 870 MHz', 'ntcSrd2020')],
  d08: [dpa3l2, dpa13('Discipline records'), dpa20, dpa21b('compliance')],
  d09: [animalBai, animalCare, agriMachine('greenhouses and other thermal conditioning equipment, and livestock equipment'), srd],
  d10: [P('R.A. 8792 Secs. 7, 11, 12 (Legal recognition, authentication and evidential weight of electronic documents)', 'Electronic records are recognized; weight depends on how they were generated and stored', 'ra8792'), P('Rules on Electronic Evidence Rule 5 (Authentication), Rule 7 (Evidentiary Weight)', 'The presenter must authenticate; courts weigh system integrity', 'ree')],
  d11: [integrity], d12: [integrity], d13: [ipCode, integrity], d16: [integrity], d17: [ipCode, integrity], d20: [integrity], d22: [integrity], d25: [integrity], d26: [integrity], d27: [integrity], d35: [ipCode, integrity], d36: [ipCode, integrity],
  d14: [P('R.A. 10173 Sec. 21(a) (Principle of Accountability: transfers)', 'Partner campuses must give a comparable level of protection to shared data', 'dpa'), dpa13('Student papers tied to students'), ipCode],
  d15: [I('Foreign and contractual terms', 'USPTO and WIPO data terms govern use. No Philippine statute requires the system.', 'sti')],
  d19: [I('Contractual, not statute', 'Follow the Crossref and OpenAlex terms and rate limits. Justify through the institutional research integrity policy.', 'crossref'), ipMoral],
  d23: [P('R.A. 10173 Sec. 4(d) (Scope: research purposes)', 'Research processing is excluded, but whether a public repository qualifies needs NPC guidance; get author consent', 'dpa'), ipMoral],
  d24: [dpa13('Student papers tied to students'), integrity],
  d28: [dpa3l2, dpa13('Essays tied to students'), integrity],
  d33: [dpa11, dpa12('typing cadence data'), integrity],
  d34: [dpa3l2, dpa13('Drafting telemetry tied to coursework'), dpa21b('the plugin'), integrity],
  n1: [coop, pnsCoffee('Grade labels should follow the national standard'), P('R.A. 8435 Sec. 39 (Market information system)', 'A market information system for farmers, cooperatives, traders and LGUs', 'ra8435')],
  n2: [P('R.A. 8435 Secs. 39, 41 (Market information system; National Information Network)', 'A market information system for farmers, cooperatives and LGUs, and a National Information Network down to municipal offices', 'ra8435'), dpa11, dpa20],
  n3: [coop, coopOfficer('A city cooperatives officer, if appointed, assists cooperatives')],
  n4: [aqi('Report against the national AQI breakpoints'), I('EMB CALABARZON memo, 14 November 2025 (fact, not law)', 'San Nicolas, Batangas uses an indicative method', 'embTaal')],
  n5: [drrmDb, rfid],
  n6: [animalBai, animalCare, lte],
  c01: [P('R.A. 10916 Sec. 4 (Mandatory Installation of Speed Limiter)', 'Covered vehicles may not run without a DOTC-approved speed limiter', 'ra10916'), P('R.A. 10916 Sec. 5 (No Speed Limiter, No Registration)', 'No registration or franchise without the limiter', 'ra10916'), dpa11, dpa12('driver location data'), lte],
  c02: [P('R.A. 11697 Sec. 17 (Dedicated Parking Slots for Electric Vehicles)', 'At least 5% EV slots when a qualifying new building has 20 or more slots; no permit unless met', 'ra11697'), srd],
  c03: [P('R.A. 11697 Sec. 4(e), (f) (Definition of Terms: charging fee, charging stations)', 'Charging fee components are unbundled under DOE rules', 'ra11697'), I('ODbL (license, not statute)', 'Credit OpenStreetMap; share alike', 'osm')],
  c04: [P('R.A. 10821 Sec. 4 (Comprehensive Emergency Program for Children)', 'DSWD formulates the program for children in emergencies', 'ra10821'), P('R.A. 10821 Sec. 5 (Evacuation Centers)', 'Schools serve as evacuation centers only when no other place is available', 'ra10821'), drrmDb, dpa13('Children\u2019s health data')],
  c05: [P('R.A. 9514 Sec. 5 (Responsibility for the Enforcement of this Code)', 'The BFP enforces the Fire Code', 'ra9514'), P('R.A. 9514 Sec. 7 (Inspections, Safety Measures and Protective or Warning Systems)', 'Owners and occupants maintain protective and warning systems, including fire alarm systems', 'ra9514'), lte],
  c06: [drrmEws, srd],
  c07: [drrmPartner, drrmDb],
  c08: [P('R.A. 10601 Sec. 8 (Agri-fisheries Mechanization RDE Network)', 'Research and educational institutions and LGUs are part of the network', 'ra10601'), P('R.A. 10601 Sec. 9 (Agri-fisheries Machinery and Equipment Service Centers)', 'DA and LGUs support machinery service centers', 'ra10601'), P('R.A. 10601 Sec. 17 (After-Sales Service)', 'After-sales service and warranty, monitored by LGU agriculture offices', 'ra10601')],
  c09: [P('R.A. 10068 Sec. 16 (Registration of Organic Food and Organic Input Producers)', 'Registration through an electronic portal', 'ra10068'), P('R.A. 10068 Sec. 19 (Availability of Trading Post for Organic Inputs)', 'At least one trading post for organic inputs per LGU, as far as practicable', 'ra10068')],
  c10: [agriMachine('irrigation equipment and accessories'), srd],
  c11: [P('R.A. 9482 Sec. 7(1) (Responsibilities of the LGUs)', 'LGUs ensure all dogs are immunized, registered and issued a dog tag', 'ra9482'), P('R.A. 9482 Sec. 5 (Responsibilities of Pet Owner)', 'Owners vaccinate, keep a registration card, and submit dogs for mandatory registration', 'ra9482'), dpa11, dpa12e('owner records')],
  c12: [P('R.A. 10611 Sec. 16(a) (Specific Responsibilities of the Department of Agriculture)', 'The BAI covers food derived from animals, including eggs', 'ra10611')],
  c13: [P('R.A. 10816 Sec. 3(c) (Definition of Terms: farm tourism camp)', 'Defines a farm tourism camp', 'ra10816'), P('R.A. 10816 Sec. 10 (Accreditation of Farm Tourism Camps)', 'DOT and DA jointly set accreditation standards', 'ra10816')],
  c14: [P('R.A. 11321 Sec. 4 (Coverage of the Program)', 'Covers procurement of farm products for storage, trading and distribution', 'ra11321'), P('R.A. 11321 Sec. 7 (Private Sector Partnership)', 'Farmer and private sector partnerships to improve market access', 'ra11321')],
  c15: [P('R.A. 9003 Sec. 21 (Mandatory Segregation of Solid Wastes)', 'Segregation primarily at the source', 'ra9003'), P('R.A. 9003 Sec. 32 (Establishment of LGU Materials Recovery Facility)', 'An MRF in every barangay or cluster of barangays', 'ra9003'), nemsChartered],
  c16: [nemsChartered],
  c17: [P('R.A. 9003 Sec. 12 (City and Municipal Solid Waste Management Board)', 'Every city forms a board that prepares and implements a waste plan', 'ra9003'), P('R.A. 9003 Sec. 21 (Mandatory Segregation of Solid Wastes)', 'Segregation primarily at the source', 'ra9003'), dpa11],
  c18: [P('R.A. 9003 Sec. 44-D (EPR Mandates), inserted by R.A. 11898 Sec. 6', 'Obliged enterprises establish or phase in EPR programs for plastic packaging', 'ra11898')],
  c19: [P('R.A. 9275 Sec. 20 (Role of Local Government Units)', 'The LGU, through its ENRO, monitors water quality and responds to emergencies', 'ra9275')],
  c20: [P('R.A. 9729 Sec. 14 (Local Climate Change Action Plan)', 'LGUs lead local climate plans; barangays are directly involved', 'ra9729')],
  c21: [P('R.A. 11285 Sec. 20(a) (Obligations of Designated Establishments)', 'Integrate an energy management system based on ISO 50001 or similar', 'ra11285'), P('R.A. 11285 Sec. 22 (Other Establishments)', 'Establishments using 100,000 to 500,000 kWh report annual consumption', 'ra11285')],
  c22: [P('R.A. 11285 Sec. 7 (Role of LGUs)', 'LGUs set up Energy Efficiency and Conservation Offices and local plans', 'ra11285')],
  c23: [P('R.A. 9513 Sec. 10 (Net-metering for Renewable Energy)', 'Utilities enter net-metering agreements; the ERC sets interconnection standards', 'ra9513')],
  c24: [P('R.A. 11036 Sec. 27 (Capacity Building of Barangay Health Workers)', 'LGUs train barangay health workers with DOH technical assistance', 'ra11036'), dpa13('Mental health data')],
  c25: [P('R.A. 11036 Sec. 24 (Mental Health Promotion in Educational Institutions)', 'Schools develop mental health policies and programs', 'ra11036'), dpa13('Student wellness data')],
  c26: [P('R.A. 11223 Sec. 36 (Health Information System)', 'Electronic health records uploaded through interoperable systems, with patient privacy upheld', 'ra11223'), dpa13('Patient health data')],
  c27: [P('R.A. 11223 Sec. 36 (Health Information System)', 'Health service providers maintain a health information system', 'ra11223'), lte],
  c28: [P('R.A. 10611 Sec. 15(c) (Principal Responsibilities of Government Agencies)', 'LGUs handle food safety in wet markets, school canteens and restaurants', 'ra10611')],
  c29: [P('R.A. 11058 Sec. 5 (Workers\u2019 Right to Know)', 'Workers are informed of all workplace hazards', 'ra11058')],
  c30: [P('R.A. 11106 Sec. 9 (Filipino Sign Language in All Other Public Transactions, Services, and Facilities)', 'LGUs use FSL as the medium of official communication with the deaf', 'ra11106')],
  c31: [P('B.P. 344 Sec. 1 (accessibility facilities as a permit condition)', 'No construction permit for buildings for public use unless mobility facilities are installed', 'bp344'), barrierFree],
  c32: [P('R.A. 7277 Sec. 40(b)(1) (Role of LGUs: Persons with Disability Affairs Office), as amended by R.A. 10070 Sec. 1', 'A PDAO shall be created in every province, city and municipality', 'ra10070'), dpa13('Disability and health data')],
  c33: [P('R.A. 7432 Sec. 6 (Office for Senior Citizens Affairs), as amended by R.A. 9994 Sec. 6', 'An OSCA is established in all cities and municipalities', 'ra9994'), dpa11, dpa12e('senior citizen records')],
  c34: [P('R.A. 11650 Sec. 4(u) (Definition of Terms: universal design)', 'Defines universal design', 'ra11650'), P('R.A. 11650 Sec. 12 (IEP Preparation and Review)', 'IEPs prepared and reviewed with a multidisciplinary team and parental consent', 'ra11650'), dpa13('Learner disability and education data')],
  c35: [barrierFree, H('NTC type approval (rules for 2.4 GHz beacons not read)', 'Hardware compliance only: confirm with NTC before deploying radios', 'ntcSrd')],
  c36: [charter, processing, zeroContact],
  c37: [P('R.A. 12009 Sec. 3(a) (Governing Principles: transparency and open contracting)', 'Disclosure of data across all stages of procurement', 'ra12009'), P('R.A. 12009 Sec. 4 (Scope and Application)', 'Applies to all agencies, including LGUs', 'ra12009')],
  c38: [P('R.A. 11315 Sec. 4 (Data Collection)', 'A CBMS in every city and municipality', 'ra11315'), P('R.A. 11315 Sec. 5 (Periodicity of Data Collection)', 'Data collection every three years', 'ra11315'), P('R.A. 11315 Sec. 6 (Lead Agency)', 'The PSA leads implementation', 'ra11315'), P('R.A. 11315 Sec. 10 (Confidentiality of Information)', 'The respondent\u2019s right to privacy remains inviolable', 'ra11315'), dpa11],
  c39: [P('R.A. 7581 Sec. 6 (Automatic Price Control)', 'Prices of basic necessities freeze automatically in calamity areas', 'ra7581'), P('R.A. 7581 Sec. 14 (Role of the National Statistics Office)', 'Periodic surveys of selling prices of basic necessities', 'ra7581')],
  c40: [charter, processing, dpa11],
  c41: [P('R.A. 10929 Sec. 4 (Coverage of the Program)', 'Covers government offices, schools, parks, libraries and terminals', 'ra10929'), P('R.A. 10929 Sec. 5 (Lead Implementing Agency)', 'The DICT is lead agency', 'ra10929')],
  c42: [P('R.A. 11337 Sec. 4 (Philippine Startup Development Program)', 'DOST, DICT and DTI lead the program and set impact metrics', 'ra11337')],
  c43: [P('R.A. 11967 Sec. 10 (Online Business Database)', 'The E-Commerce Bureau keeps a database of online merchants', 'ra11967')],
  c44: [P('R.A. 11927 Sec. 4 (Development of the Digital Workforce)', 'The State equips Filipinos with digital skills', 'ra11927'), P('R.A. 11230 Sec. 9 (Qualified Recipients)', 'Tulong-Trabaho Fund recipients', 'ra11230')],
  c45: [coop, dpa11, dpa20],
  c46: [pnsCoffee('National green coffee grading standard (listing confirmed, clauses not read)')],
  c47: [P('R.A. 11510 Sec. 4(j) (Definition of Terms: Community Learning Center)', 'Defines a Community Learning Center', 'ra11510'), dpa13('Learner education data'), rfid],
  c48: [I('Institutional policy, not statute', 'Justify through the school property and laboratory policy. No statute requires the system.', 'sti'), rfid],
  c49: [I('W3C WCAG 2.2 (standard, not statute)', 'Acceptance bar for the scanner. No Philippine rule requiring WCAG for LGU websites was found.', 'wcag22'), P('R.A. 7277 Sec. 25 (Barrier-Free Environment)', 'Barrier-free principle; physical, not web, by its text', 'ra7277')],
  c50: [traffic, dpa11, dpa12('driver location traces')],
  c51: [drrmPartner, P('R.A. 9513 Sec. 10 (Net-metering for Renewable Energy)', 'Context only: renewable systems and utility interconnection', 'ra9513')]
};

export const REVIEW_VERDICTS = {right: 'Reviewer right', partly: 'Partly right', wrong: 'Reviewer wrong', ours: 'Our error'};

export const REVIEW_FINDINGS = [
  {item: 'Fix 1: Data Privacy Act Sec. 20 and Sec. 21 used as the anchor', verdict: 'partly', finding: 'Sec. 20 (Security of Personal Information) and Sec. 21 (Principle of Accountability) are real duties, not side topics. But they assume processing is already lawful. The operative tests are Sec. 11 (General Data Privacy Principles), Sec. 12 (Criteria for Lawful Processing) and Sec. 13 (Sensitive Personal Information). Ten rows (r1, d02, d14, n2, c01, c11, c17, c38, c45, c50) cited only Sec. 20 or Sec. 21 for privacy.', action: 'Every privacy row now leads with Sec. 11, 12 or 13. Sec. 20 and 21 stay only as labeled secondary duties.', sources: ['dpa']},
  {item: 'Fix 2: NTC circulars as the only anchor', verdict: 'right', finding: 'Two recommended poultry titles (d09, n6) and the soil moisture title (c10) rested on NTC circulars alone. NTC circulars govern radio equipment, not why the system should exist.', action: 'Every NTC row is now tagged Hardware compliance. Poultry titles lead with R.A. 8485 Sec. 3 and Sec. 6 as amended by R.A. 10631. d09 and c10 add R.A. 10601 Sec. 3(a). d02 adds R.A. 7160 Sec. 458(a)(5)(vi).', sources: ['ra8485', 'ra10631', 'ra10601', 'lgc']},
  {item: 'Fix 3: rows with no legal basis or contractual only', verdict: 'right', finding: '26 titles, mostly the parked and merged academic integrity group, had no legal basis row. d19 and c49 rested on contracts or a standard.', action: 'Every non-merged title now has a basis row. Integrity titles say Institutional policy, not statute, and cite R.A. 8293 Secs. 172.1 and 193.1 where authorship is at stake. Merged titles link to the title they merge into.', sources: ['ra8293', 'sti']},
  {item: 'Fix 4: LTO v. City of Butuan cannot be confirmed', verdict: 'wrong', finding: 'The case exists. We opened G.R. No. 131512, 20 January 2000, penned by Justice Vitug, on Lawphil. It holds that the devolved power covers franchising and regulation of tricycles, while LTO keeps registration and licensing. The reviewer could not see it in their sources; that does not make it wrong.', action: 'Kept, with the full citation, date and ponente, linked to the Lawphil text. Read the decision once before quoting.', sources: ['butuan']},
  {item: 'R.A. 9485 Sec. 7 as inserted by R.A. 11032', verdict: 'partly', finding: 'Our cite was correct: R.A. 11032 Sec. 7 inserts a new Sec. 7 Zero-Contact Policy into R.A. 9485. The reviewer was right that processing-time transparency sits elsewhere: Sec. 6 (Citizen\u2019s Charter) and Sec. 9(b) (Action of Offices), as amended and renumbered by R.A. 11032.', action: 'c36 and c40 now cite Sec. 6, Sec. 9(b) and Sec. 7 by subject.', sources: ['ra11032']},
  {item: 'R.A. 9482 Sec. 5 for the rabies registry', verdict: 'partly', finding: 'Sec. 5 is Responsibilities of Pet Owner and does require mandatory registration. The stronger anchor for a city system is Sec. 7(1), Responsibilities of the LGUs: ensure all dogs are immunized, registered and issued a dog tag.', action: 'c11 now leads with Sec. 7(1), then Sec. 5.', sources: ['ra9482']},
  {item: 'R.A. 7277 Sec. 40 as amended by R.A. 10070', verdict: 'wrong', finding: 'The reviewer asked to verify it. It holds: R.A. 10070 Sec. 1 amends R.A. 7277 Sec. 40, and the amended text says a PDAO shall be created in every province, city and municipality.', action: 'c32 now cites Sec. 40(b)(1) with its subject.', sources: ['ra10070']},
  {item: 'R.A. 9994 Sec. 6 for OSCA', verdict: 'ours', finding: 'Imprecise. R.A. 9994 Sec. 6 is an amending clause. The OSCA rule is the new Sec. 6 of R.A. 7432 that it writes in.', action: 'c33 now cites R.A. 7432 Sec. 6 as amended by R.A. 9994 Sec. 6.', sources: ['ra9994']},
  {item: 'R.A. 9003 Sec. 44-D inserted by R.A. 11898', verdict: 'ours', finding: 'Content right, amending section wrong. Sec. 44-D (EPR Mandates) is inserted by R.A. 11898 Sec. 6, which adds a new chapter. R.A. 11898 Sec. 5 amends R.A. 9003 Sec. 7 instead.', action: 'c18 now names R.A. 11898 Sec. 6.', sources: ['ra11898']},
  {item: 'Section numbers in general', verdict: 'partly', finding: 'The reviewer could not see the law texts, so it flagged every number as a risk. We matched every R.A. and B.P. section cited against Lawphil: all 106 cited sections exist, then 64 subject checks ran by keyword. Six checks failed. Two were real errors (R.A. 9994 and R.A. 11898, above). Four were parser misses in amending laws, read by hand and confirmed (R.A. 10068 Sec. 19, R.A. 10070 Sec. 1, R.A. 11032 Secs. 7 and 9).', action: 'Every statutory row now names its section subject in parentheses, the citation style the reviewer asked for. The model tests fail if a row loses it.', sources: []}
];

export const AUDIT_SUMMARY = {checkedOn: CITATIONS_CHECKED_ON, sectionsFound: 106, subjectChecks: 64, realErrors: 2, parserMisses: 4};
