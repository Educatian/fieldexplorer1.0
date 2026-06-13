"""
build_venue_activity.py  --  per-venue publication activity per year.

Feeds the longitudinal network animation: how active each venue was each year,
so node sizes can pulse across time and show the field evolving. Uses OpenAlex
group_by primary_location.source.id per year (aggregate; cheap, ~1 req/year).

Output: src/data/venue_activity.json
"""
import json
import time
from collections import defaultdict
from pathlib import Path

import requests

OA = "https://api.openalex.org/works"
MAILTO = "jewoong.moon@gmail.com"
SOURCES_CACHE = Path("src/data/venue_sources.json")
METRICS = Path("src/data/venue_metrics.json")
OUT = Path("src/data/venue_activity.json")
YEARS = list(range(2019, 2026))


def batches(ids, size=60):
    for i in range(0, len(ids), size):
        yield ids[i:i + size]


def counts_for_year(all_ids, year):
    out = defaultdict(int)
    for batch in batches(all_ids):
        params = {
            "filter": f"primary_location.source.id:{'|'.join(batch)},publication_year:{year}",
            "group_by": "primary_location.source.id", "per_page": 200, "mailto": MAILTO,
        }
        for attempt in range(3):
            try:
                r = requests.get(OA, params=params, timeout=30)
                if r.status_code != 200:
                    time.sleep(1.5); continue
                for g in r.json().get("group_by", []):
                    sid = (g.get("key") or "").rsplit("/", 1)[-1]
                    out[sid] += g["count"]
                break
            except Exception:
                time.sleep(1.5)
        time.sleep(0.3)
    return out


def main():
    sources = json.loads(SOURCES_CACHE.read_text(encoding="utf-8"))
    metrics = json.loads(METRICS.read_text(encoding="utf-8")).get("venues", {})
    id2name = {vid: (v.get("name") or vid) for vid, v in metrics.items()}
    # source id -> venue id (first wins)
    src2venue = {}
    for vid, sids in sources.items():
        for s in (sids or []):
            src2venue.setdefault(s, vid)
    all_ids = sorted(src2venue.keys())
    print(f"{len(all_ids)} sources -> {len(set(src2venue.values()))} venues")

    venue_counts = defaultdict(lambda: {str(y): 0 for y in YEARS})
    for y in YEARS:
        c = counts_for_year(all_ids, y)
        tot = 0
        for sid, n in c.items():
            vid = src2venue.get(sid)
            if vid:
                venue_counts[vid][str(y)] += n
                tot += n
        print(f"  {y}: {tot} works across venues")

    venues = {}
    for vid, by in venue_counts.items():
        venues[vid] = {"name": id2name.get(vid, vid), "counts": by, "total": sum(by.values())}

    OUT.write_text(json.dumps({
        "_meta": {"generator": "build_venue_activity.py", "years": YEARS,
                  "method": "OpenAlex group_by source per year over venue set"},
        "years": YEARS, "venues": venues,
    }, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"\n{len(venues)} venues -> {OUT}")
    top = sorted(venues.items(), key=lambda kv: kv[1]["total"], reverse=True)[:6]
    print("most active (total):", [(k, v["total"]) for k, v in top])


if __name__ == "__main__":
    main()
