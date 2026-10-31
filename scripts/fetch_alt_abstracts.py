"""
fetch_alt_abstracts.py  --  abstracts for venues whose regular papers have none in OpenAlex.

OpenAlex holds abstracts only for the occasional review of these venues, so build_venue_methodology_jev.py
cannot profile them from OpenAlex. This script samples their 2023-2025 papers from other open sources and
adds them to data-cache/venue_abstracts.json with the source named, so `code` and `build` treat them like
any other venue:
  - Semantic Scholar bulk search, by S2 venue name, keeping only DOIs of the conference's publisher
    (S2 venue names collide: its "Educational Data Mining" is mostly IEEE papers from other meetings);
  - Zenodo communities edm2023-edm2025 (the EDM proceedings);
  - ISLS repository landing pages of 10.22318/cscl20xx DOIs (CSCL; Crossref lists the DOIs, the page has the abstract);
  - the journal's own issue pages (Educational Technology & Society, j-ets.net).
Each venue gets a seeded random sample of up to 60 papers with an abstract of at least 40 words.

  py scripts/fetch_alt_abstracts.py            # all venues below that are not cached yet
  py scripts/fetch_alt_abstracts.py --only chi # one venue
"""
import argparse
import html
import json
import random
import re
import time
from datetime import date
from pathlib import Path

import requests

CACHE = Path("data-cache/venue_abstracts.json")
SINCE, UNTIL = 2023, date.today().year - 1  # complete calendar years, as in build_venue_methodology_jev.py
PER_VENUE = 60
MIN_WORDS = 40
HEADERS = {"User-Agent": "FieldExplorer/1.0 (mailto:jewoong.moon@gmail.com)"}
S2 = "https://api.semanticscholar.org/graph/v1/paper/search/bulk"

# venue id -> (Semantic Scholar venue name, publisher DOI prefix); checked 2026-10-31
S2_VENUES = {
    "chi": ("CHI", "10.1145/"),
    "lak": ("International Conference on Learning Analytics and Knowledge", "10.1145/"),
    "uist": ("ACM Symposium on User Interface Software and Technology", "10.1145/"),
    "idc": ("Interaction Design and Children", "10.1145/"),
    "sigcse": ("Technical Symposium on Computer Science Education", "10.1145/"),
    "iticse": ("Annual Conference on Innovation and Technology in Computer Science Education", "10.1145/"),
    "ieeevr": ("IEEE Conference on Virtual Reality and 3D User Interfaces", "10.1109/"),
    "ismar": ("International Symposium on Mixed and Augmented Reality", "10.1109/"),
    "fie": ("Frontiers in Education Conference", "10.1109/"),
    "its": ("Intelligent Tutoring Systems", "10.1007/"),
}


def get(url, **kw):
    for attempt in range(6):
        try:
            r = requests.get(url, headers=HEADERS, timeout=60, **kw)
        except requests.RequestException:
            time.sleep(3 * (attempt + 1)); continue
        if r.status_code == 429 or r.status_code >= 500:
            time.sleep(5 * (attempt + 1)); continue
        return r
    raise RuntimeError(f"giving up on {url}")


def sample(works, seed):
    works = [w for w in works if len(w["abstract"].split()) >= MIN_WORDS and w["title"]]
    random.Random(seed).shuffle(works)
    return works[:PER_VENUE], len(works)


def from_s2(vid):
    name, prefix = S2_VENUES[vid]
    r = get(S2, params={"query": "", "venue": name, "year": f"{SINCE}-{UNTIL}",
                        "fields": "title,abstract,year,venue,publicationTypes,externalIds"})
    r.raise_for_status()
    data = r.json().get("data") or []
    works = [{"wid": "s2:" + p["paperId"], "title": p.get("title") or "", "year": p.get("year"),
              "type": ",".join(p.get("publicationTypes") or []), "abstract": (p.get("abstract") or "")[:3000],
              "doi": (p.get("externalIds") or {}).get("DOI")}
             for p in data if "Review" not in (p.get("publicationTypes") or [])
             and ((p.get("externalIds") or {}).get("DOI") or "").startswith(prefix)]
    if prefix == "10.1007/":
        # S2 withholds Springer abstracts; the chapter page carries it (dc.description). Fetch only what the sample needs.
        random.Random(vid).shuffle(works)
        filled = []
        for w in works:
            if len(filled) >= PER_VENUE:
                break
            if not w["abstract"]:
                t = get("https://link.springer.com/chapter/" + w["doi"]).text
                m = re.search(r'<meta name="dc.description" content="([^"]*)"', t)
                w["abstract"] = html.unescape(m.group(1))[:3000] if m else ""
                time.sleep(1.0)
            if len(w["abstract"].split()) >= MIN_WORDS:
                filled.append(w)
        works = filled
    venues = sorted({p.get("venue") for p in data})
    return works, {"source": "Semantic Scholar" + (" + Springer chapter pages" if prefix == "10.1007/" else ""), "query_venue": name, "doi_prefix": prefix, "returned_venues": venues[:3],
                   "listed": len(data), "listed_total": r.json().get("total"), "kept_by_doi": len(works)}


def from_edm(vid):
    works = []
    for year in range(SINCE, UNTIL + 1):
        page = 1
        while True:
            j = get("https://zenodo.org/api/records", params={"communities": f"edm{year}", "size": 25, "page": page}).json()
            hits = j["hits"]["hits"]
            for h in hits:
                m = h["metadata"]
                if m["title"].lower().startswith("proceedings"):
                    continue  # the full volume, not a paper
                ab = html.unescape(re.sub(r"<[^>]+>", " ", m.get("description") or ""))
                works.append({"wid": f"zenodo:{h['id']}", "title": m["title"], "year": year, "type": m.get("resource_type", {}).get("type", ""),
                              "abstract": re.sub(r"\s+", " ", ab).strip()[:3000], "doi": h.get("doi")})
            if len(hits) < 25:
                break
            page += 1
            time.sleep(1.0)
    return works, {"source": "Zenodo communities edm2023-edm2025 (EDM proceedings)", "listed": len(works)}


def from_isls(vid):
    dois, cursor = [], "*"
    while cursor:
        m = get("https://api.crossref.org/works", params={
            "filter": f"prefix:10.22318,from-pub-date:{SINCE}-01-01,until-pub-date:{UNTIL}-12-31",
            "rows": 1000, "cursor": cursor, "select": "DOI"}).json()["message"]
        dois += [i["DOI"] for i in m["items"]]
        cursor = m.get("next-cursor") if m["items"] else None
    dois = sorted(d for d in dois if re.search(r"/cscl20\d\d\.", d.lower()))
    random.Random(vid).shuffle(dois)
    works = []
    for doi in dois:
        if len([w for w in works if len(w["abstract"].split()) >= MIN_WORDS]) >= PER_VENUE:
            break
        t = get("https://doi.org/" + doi, allow_redirects=True).text
        meta = lambda name: html.unescape((re.search(rf'<meta name="{name}"[^>]*content="([^"]*)"', t) or [None, ""])[1])
        works.append({"wid": "doi:" + doi.lower(), "title": meta("DC.title") or meta("citation_title"),
                      "year": int(re.search(r"cscl(20\d\d)", doi.lower()).group(1)), "type": meta("DC.description"),
                      "abstract": meta("DCTERMS.abstract")[:3000], "doi": doi})
        time.sleep(1.0)
    return works, {"source": "ISLS repository (DOI landing pages)", "listed": len(dois)}


def from_ets(vid):
    works = []
    for vol, year in ((26, 2023), (27, 2024), (28, 2025)):
        if year > UNTIL:
            continue
        for issue in range(1, 5):
            t = get(f"https://www.j-ets.net/collection/published-issues/{vol}_{issue}").text
            txt = html.unescape(re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", t)))
            for ab, yr, title in re.findall(r"ABSTRACT:\s*(.+?)\s*Keywords:.*?Cite as:.*?\((\d{4})\)\.\s*(.+?)\s*\.\s*Educational Technology & Society", txt):
                works.append({"wid": f"ets:{vol}_{issue}:{len(works)}", "title": title, "year": int(yr), "type": "article",
                              "abstract": ab[:3000], "doi": None})
            time.sleep(1.0)
    return works, {"source": "Educational Technology & Society issue pages (j-ets.net)", "listed": len(works)}


FETCHERS = {**{v: from_s2 for v in S2_VENUES}, "edm": from_edm, "cscl": from_isls, "ets": from_ets}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", default="")
    ap.add_argument("--refresh", action="store_true", help="refetch venues that are already cached")
    args = ap.parse_args()
    store = json.loads(CACHE.read_text(encoding="utf-8"))
    venues = {v["id"]: v["name"] for v in json.loads(Path("src/data/venues.json").read_text(encoding="utf-8"))}
    for vid, fetch in FETCHERS.items():
        if args.only and vid != args.only:
            continue
        if (store.get(vid) or {}).get("alt_source") and not args.refresh:
            continue
        works, info = fetch(vid)
        take, eligible = sample(works, vid)
        prev = store.get(vid) or {}
        store[vid] = {"name": venues[vid], "fetched_at": date.today().isoformat(), "window": [f"{SINCE}-01-01", f"{UNTIL}-12-31"],
                      "openalex_counts": prev.get("openalex_counts"), "alt_source": {**info, "eligible": eligible}, "works": take}
        CACHE.write_text(json.dumps(store, ensure_ascii=False), encoding="utf-8")
        print(f"  [{vid}] {len(take)} abstracts from {info['source']} ({eligible} eligible)")
        time.sleep(1.5)


if __name__ == "__main__":
    main()
