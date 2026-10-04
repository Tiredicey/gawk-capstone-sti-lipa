import re, json, html, sys, urllib.request, concurrent.futures as cf
LAWS = {"12010":2024,"10175":2012,"8792":2000,"10844":2016,"10173":2012,"9288":2004,"9709":2009,"11358":2019,"11332":2019,"10152":2011,"10028":2010,"11037":2018,"10918":2016,"11148":2018,"10767":2016,"7719":1994,"11215":2019,"11166":2018,"10627":2013,"11313":2019,"12080":2024,"12028":2024,"10650":2014,"10968":2018,"12063":2024,"10912":2016,"10533":2013,"12001":2024,"11055":2018,"11261":2019,"10361":2013,"10742":2016,"11861":2022,"11310":2019,"7160":1991,"10176":2012,"10066":2010,"9710":2009,"10913":2016,"11229":2019,"11235":2019,"10666":2015,"6969":1990,"6716":1989,"11995":2024,"11592":2021,"11285":2019,"9003":2001,"12022":2024,"9296":2004,"7900":1995,"8435":1997,"10644":2014,"11960":2023,"11904":2022,"11293":2019,"10679":2015,"11165":2018,"11765":2022,"11981":2024,"9593":2009,"11106":2018,"10121":2010,"11646":2022,"11058":2018,"7277":1992,"11223":2019,"9514":2008,"10601":2013,"11127":2018,"10917":2016,"10611":2013,"10929":2017,"11315":2019,"11934":2022,"9520":2009,"10055":2010,"11916":2022,"10931":2017,"9729":2009}
NAMES = {"10917":"Act amending the Special Program for Employment of Students","11058":"Occupational Safety and Health Standards Act","11106":"Filipino Sign Language Act","6716":"Barangay Water Wells and Rainwater Collectors Act","11861":"Expanded Solo Parents Welfare Act","11916":"Act Increasing the Social Pension of Indigent Senior Citizens","10028":"Expanded Breastfeeding Promotion Act of 2009","10844":"Department of Information and Communications Technology Act of 2015","11592":"LPG Industry Regulation Act","11646":"Microgrid Systems Act","10742":"Sangguniang Kabataan Reform Act of 2015","11127":"National Payment Systems Act","9520":"Philippine Cooperative Code of 2008"}
def url(n): return f"https://lawphil.net/statutes/repacts/ra{LAWS[n]}/ra_{n}_{LAWS[n]}.html"
def get(n):
    req = urllib.request.Request(url(n), headers={"User-Agent": "Mozilla/5.0"})
    s = urllib.request.urlopen(req, timeout=60).read().decode("cp1252", errors="replace")
    t = re.sub(r"<script.*?</script>|<style.*?</style>", "", s, flags=re.S | re.I)
    t = re.sub(r"<br\s*/?>|</p>|</div>|</tr>", "\n", t, flags=re.I)
    t = html.unescape(re.sub(r"<[^>]+>", "", t)); t = re.sub(r"[ \t\xa0]+", " ", t); t = re.sub(r"\n\s*\n+", "\n", t)
    secs = {}
    for m in re.finditer(r"(?:^|\n)\s*(?:Section|SECTION|Sec\.|SEC\.)\s*(\d+(?:-[A-Z])?)\s*\.?\s*[-\u2013\u2014]?\s*([^\n]{0,400})", t):
        secs.setdefault(m.group(1), []).append(m.group(2).strip()[:260])
    title = re.search(r'(?:known as|cited as)\s+(?:the\s+)?["\u201c\u201d\u2033]+([^"\u201c\u201d\u2033]{4,120})["\u201c\u201d\u2033]', t)
    name = NAMES.get(n) or (title.group(1).strip().rstrip('.') if title else "")
    return n, {"url": url(n), "title": name, "sections": secs}
out = {}
with cf.ThreadPoolExecutor(12) as ex:
    for n, d in ex.map(get, LAWS): out[n] = d
missing = [n for n, d in out.items() if not d["title"]]
if missing: sys.exit(f"No short title for {missing}; add to NAMES")
json.dump(out, open(sys.argv[1], "w"), separators=(",", ":"), sort_keys=True)
print(len(out), "laws")
