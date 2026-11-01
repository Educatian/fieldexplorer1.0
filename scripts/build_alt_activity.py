"""
build_alt_activity.py  --  yearly paper counts for venues that OpenAlex does not cover, merged into venue_activity.json.

build_venue_activity.py counts works per year from OpenAlex. Conferences whose proceedings OpenAlex does not
index (or indexes under scattered sources) get their counts here, from the same open sources that
fetch_alt_abstracts.py samples abstracts from:
  - Semantic Scholar by venue, counting only papers with the publisher's DOI prefix;
  - Crossref for ISLS (10.22318/cscl20xx, icls20xx) and CSCW (PACM HCI issues CSCW1/CSCW2);
  - Zenodo communities edm20xx for EDM.
Each merged venue records `source`. A venue whose source fails keeps its previous counts. Run after
build_venue_activity.py (it rewrites the file from OpenAlex):
  py scripts/build_alt_activity.py
"""
import json
import re
import time
from collections import Counter
from pathlib import Path

import fetch_alt_abstracts as alt

OUT = Path("src/data/venue_activity.json")


def s2_counts(vid, years):
    name, prefix = alt.S2_VENUES[vid]
    out = {}
    for y in years:
        n, token = 0, None
        while True:
            params = {"query": "", "venue": name, "year": str(y), "fields": "externalIds"}
            if token:
                params["token"] = token
            d = alt.get(alt.S2, params=params).json()
            n += sum(1 for p in d.get("data") or [] if ((p.get("externalIds") or {}).get("DOI") or "").startswith(prefix))
            token = d.get("token")
            if not token:
                break
            time.sleep(1.5)
        out[str(y)] = n
        time.sleep(1.5)
    return out, f"Semantic Scholar, {prefix} DOIs"


def crossref_isls_counts(vid, years):
    c, cursor = Counter(), "*"
    while cursor:
        m = alt.get("https://api.crossref.org/works", params={
            "filter": f"prefix:10.22318,from-pub-date:{years[0]}-01-01,until-pub-date:{years[-1]}-12-31",
            "rows": 1000, "cursor": cursor, "select": "DOI"}).json()["message"]
        for i in m["items"]:
            doi = i["DOI"].lower()
            if re.search(alt.ISLS_PATTERNS[vid], doi):
                c[re.search(r"(?:icls|cscl)(20\d\d)", doi).group(1)] += 1
        cursor = m.get("next-cursor") if m["items"] else None
    # ISLS registered proceedings DOIs from 2023 on: earlier years are outside the source, not zero
    return {str(y): c.get(str(y), 0) for y in years if y >= 2023}, "Crossref, ISLS proceedings DOIs (2023 on)"


def crossref_cscw_counts(vid, years):
    c, cursor = Counter(), "*"
    while cursor:
        m = alt.get("https://api.crossref.org/journals/2573-0142/works", params={
            "filter": f"from-pub-date:{years[0]}-01-01,until-pub-date:{years[-1]}-12-31", "rows": 1000,
            "cursor": cursor, "select": "issue,volume,issued"}).json()["message"]
        for i in m["items"]:
            if alt.is_cscw(i):
                c[str(((i.get("issued") or {}).get("date-parts") or [[None]])[0][0])] += 1
        cursor = m.get("next-cursor") if m["items"] else None
    return {str(y): c.get(str(y), 0) for y in years}, "Crossref, PACM HCI CSCW issues"


def zenodo_edm_counts(vid, years):
    out = {}
    for y in years:
        r = alt.get("https://zenodo.org/api/records", params={"communities": f"edm{y}", "size": 1})
        total = r.json()["hits"]["total"] if r.ok else 0
        out[str(y)] = max(0, total - 1) if total else 0  # minus the full-proceedings record
        time.sleep(1.0)
    return out, "Zenodo communities edm20xx (from the year the community exists)"


COUNTERS = {**{v: s2_counts for v in alt.S2_VENUES}, "cscl": crossref_isls_counts, "icls": crossref_isls_counts,
            "isls": crossref_isls_counts, "cscw": crossref_cscw_counts, "edm": zenodo_edm_counts}


def main():
    import argparse
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", default="", help="comma-separated venue ids")
    only = set(filter(None, ap.parse_args().only.split(",")))
    d = json.loads(OUT.read_text(encoding="utf-8"))
    years = d["years"]
    names = {v["id"]: v["name"] for v in json.loads(Path("src/data/venues.json").read_text(encoding="utf-8"))}
    prev = d.get("venues", {})
    done = []
    for vid, fn in COUNTERS.items():
        if only and vid not in only:
            continue
        if prev.get(vid, {}).get("total") and "source" not in prev[vid]:
            continue  # OpenAlex already covers this venue
        try:
            counts, source = fn(vid, years)
        except Exception as e:
            print(f"  [{vid}] failed ({e}); previous counts kept" if vid in prev else f"  [{vid}] failed ({e})")
            continue
        if sum(counts.values()) == 0:
            continue
        prev[vid] = {"name": names[vid], "counts": counts, "total": sum(counts.values()), "source": source}
        done.append(vid)
        print(f"  [{vid}] {counts} ({source})")
    d["venues"] = prev
    d["_meta"]["alt_sources"] = "venues with `source` are counted by scripts/build_alt_activity.py, not OpenAlex"
    OUT.write_text(json.dumps(d, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"merged {len(done)} venues")


if __name__ == "__main__":
    main()
