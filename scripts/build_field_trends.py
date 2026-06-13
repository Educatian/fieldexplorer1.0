"""
build_field_trends.py  --  longitudinal topic trends for the FieldExplorer venue set.

"Research currency": which topics in the edtech / learning-sciences community are
RISING vs DECLINING. Uses OpenAlex group_by (aggregate, cheap: ~1 request/year)
over all venue sources -> topic counts per year -> share per year -> linear slope
-> rising/declining classification. No per-paper fetch, no LLM.

Output: src/data/field_trends.json
"""
import json
import time
from collections import defaultdict
from pathlib import Path

import requests

OA = "https://api.openalex.org/works"
MAILTO = "jewoong.moon@gmail.com"
SOURCES_CACHE = Path("src/data/venue_sources.json")
OUT = Path("src/data/field_trends.json")
YEARS = list(range(2019, 2026))   # 2019-2025 (full years)
MIN_VOL = 60                      # ignore topics with tiny total volume (noise)


def source_batches(all_ids, size=60):
    for i in range(0, len(all_ids), size):
        yield all_ids[i:i + size]


def topic_counts_for_year(all_ids, year):
    """{topic_display: count} and {topic: field} for one year, summed over source batches."""
    counts = defaultdict(int)
    field = {}
    total = 0
    for batch in source_batches(all_ids):
        params = {
            "filter": f"primary_location.source.id:{'|'.join(batch)},publication_year:{year}",
            "group_by": "primary_topic.id", "per_page": 200, "mailto": MAILTO,
        }
        for attempt in range(3):
            try:
                r = requests.get(OA, params=params, timeout=30)
                if r.status_code != 200:
                    time.sleep(1.5); continue
                d = r.json()
                total += d.get("meta", {}).get("count", 0)
                for g in d.get("group_by", []):
                    counts[g["key_display_name"]] += g["count"]
                break
            except Exception:
                time.sleep(1.5)
        time.sleep(0.3)
    return counts, total


def main():
    sources = json.loads(SOURCES_CACHE.read_text(encoding="utf-8"))
    all_ids = sorted({x for v in sources.values() for x in (v or [])})
    print(f"{len(all_ids)} sources, years {YEARS[0]}-{YEARS[-1]}")

    by_year = {}
    total_by_year = {}
    for y in YEARS:
        c, tot = topic_counts_for_year(all_ids, y)
        by_year[y] = c
        total_by_year[y] = tot or 1
        print(f"  {y}: {len(c)} topics, {tot} works")

    # union of topics with enough total volume
    topic_total = defaultdict(int)
    for y in YEARS:
        for t, c in by_year[y].items():
            topic_total[t] += c
    topics = [t for t, tot in topic_total.items() if tot >= MIN_VOL]

    def slope(shares):  # least-squares slope over year index
        n = len(shares); xs = list(range(n))
        mx = sum(xs) / n; my = sum(shares) / n
        denom = sum((x - mx) ** 2 for x in xs) or 1
        return sum((xs[i] - mx) * (shares[i] - my) for i in range(n)) / denom

    rows = []
    for t in topics:
        counts = [by_year[y].get(t, 0) for y in YEARS]
        shares = [round(100 * counts[i] / total_by_year[YEARS[i]], 3) for i in range(len(YEARS))]
        sl = slope(shares)
        recent = sum(shares[-2:]) / 2
        early = sum(shares[:2]) / 2
        rows.append({
            "topic": t, "counts": counts, "shares": shares,
            "slope": round(sl, 4), "recent_share": round(recent, 3),
            "delta": round(recent - early, 3),
            "trend": "rising" if sl > 0.02 else "declining" if sl < -0.02 else "stable",
        })

    rows.sort(key=lambda r: r["slope"], reverse=True)
    out = {
        "_meta": {"generator": "build_field_trends.py", "years": YEARS,
                  "n_sources": len(all_ids), "min_volume": MIN_VOL,
                  "method": "OpenAlex primary_topic counts per year over venue set; linear slope of % share"},
        "years": YEARS,
        "total_by_year": {str(y): total_by_year[y] for y in YEARS},
        "topics": rows,
        "top_rising": rows[:12],
        "top_declining": rows[-12:][::-1],
    }
    OUT.write_text(json.dumps(out, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"\n{len(rows)} topics -> {OUT}")
    print("RISING:", [r["topic"] for r in rows[:6]])
    print("DECLINING:", [r["topic"] for r in rows[-6:][::-1]])


if __name__ == "__main__":
    main()
