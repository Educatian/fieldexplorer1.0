"""
build_venue_metrics.py  --  FieldExplorer V6 "Compute/Augment" layer (PoC)

Produces, from the live OpenAlex API (no snapshot download):

  1. citation-grounded venue -> venue edges
       (replaces the V<=5 keyword/TF-IDF "commodity" edges with edges grounded
        in real citation flow between venues in our set)

  2. per-venue interdisciplinarity profile
       Simpson + Shannon over the OpenAlex top-level FIELD distribution of each
       paper's references, aggregated to the venue. Formula is identical to
       pySciSci's methods.diversity.{simpson_interdisciplinarity,
       shannon_interdisciplinarity} (Gates & Barabasi / SciSciCollective),
       which implements Stirling (2007). We build the same pub2ref / pub2field
       structures pySciSci expects, so a production swap to the library call is
       a one-liner -- but we vendor the (tiny, pure) math here to stay
       dependency-light and pandas-3 safe.

  DEFERRED to Phase 2 -- venue DISRUPTION profile. The disruption index needs,
  per focus paper, both its references AND the papers citing it AND the papers
  citing its references. That is a bidirectional crawl that really wants an
  OpenAlex snapshot; sampling it cheaply over the API is not honest. Stubbed.

Output: src/data/venue_metrics.json  (merge target for the graph build)

Reuses venue->OpenAlex-source resolution from update_semantic_profiles.py.

Usage:
  py -3.11 scripts/build_venue_metrics.py --samples 30            # full run
  py -3.11 scripts/build_venue_metrics.py --venues 8 --samples 15 # quick E2E validation
"""

import argparse
import json
import math
import re
import time
from collections import Counter, defaultdict
from pathlib import Path

import requests

from update_semantic_profiles import (
    resolve_source_id,
    resolve_conference_source_ids,
    MAILTO,
)

OPENALEX_WORKS = "https://api.openalex.org/works"
DATA_DIR = Path("src/data")
VENUES_JSON = DATA_DIR / "venues.json"
SOURCES_CACHE = DATA_DIR / "venue_sources.json"   # venue_id -> [bare source ids]
OUT_JSON = DATA_DIR / "venue_metrics.json"
DELAY = 0.35


# --------------------------------------------------------------------------
# vendored from pyscisci.utils (Gates & Barabasi, SciSciCollective) + Stirling
# --------------------------------------------------------------------------
def simpson_diversity(field_seq):
    """1 - sum(p_i^2). 0 = single field, ->1 = many evenly-spread fields."""
    if not field_seq:
        return None
    c = Counter(field_seq)
    n = sum(c.values())
    return 1.0 - sum((v / n) ** 2 for v in c.values())


def shannon_diversity(field_seq):
    """Shannon entropy (nats), base e -- matches pyscisci default."""
    if not field_seq:
        return None
    c = Counter(field_seq)
    n = sum(c.values())
    return -sum((v / n) * math.log(v / n) for v in c.values())


def _bare(oa_id):
    """'https://openalex.org/S123' -> 'S123'  (None-safe)."""
    if not oa_id:
        return None
    return oa_id.rsplit("/", 1)[-1]


# --------------------------------------------------------------------------
# Phase 0 -- resolve venues to OpenAlex source ids (cached)
# --------------------------------------------------------------------------
def resolve_all_sources(venues):
    cache = {}
    if SOURCES_CACHE.exists():
        cache = json.loads(SOURCES_CACHE.read_text(encoding="utf-8"))

    for v in venues:
        vid = v["id"]
        if vid in cache:
            continue
        if v.get("type") == "Journal":
            sid, matched = resolve_source_id(v["name"])
            cache[vid] = [sid] if sid else []
            print(f"  [{vid}] journal -> {cache[vid]} ({matched})")
        else:
            ids, hint = resolve_conference_source_ids(v["name"])
            cache[vid] = ids
            print(f"  [{vid}] conf    -> {len(ids)} sources ({hint})")
        time.sleep(DELAY)

    SOURCES_CACHE.write_text(
        json.dumps(cache, indent=2, ensure_ascii=False), encoding="utf-8"
    )
    return cache


# --------------------------------------------------------------------------
# Phase 1 -- fetch recent works per venue (id, year, refs, own source, field)
# --------------------------------------------------------------------------
def fetch_venue_works(source_ids, samples):
    joined = "|".join(source_ids[:10])
    params = {
        "sort": "publication_date:desc",
        "per_page": min(samples, 200),
        "select": "id,publication_year,referenced_works,primary_location,primary_topic",
        "filter": f"primary_location.source.id:{joined}",
        "mailto": MAILTO,
    }
    try:
        r = requests.get(OPENALEX_WORKS, params=params, timeout=30)
        if r.status_code != 200:
            return []
        return r.json().get("results", [])
    except Exception as e:
        print(f"    fetch error: {e}")
        return []


# --------------------------------------------------------------------------
# Phase 2 -- batch-resolve referenced works -> (source, field)
# --------------------------------------------------------------------------
def resolve_refs(ref_ids):
    """ref work id -> {'source': bare S-id, 'field': field name}."""
    meta = {}
    ref_ids = list(ref_ids)
    for i in range(0, len(ref_ids), 50):
        batch = ref_ids[i : i + 50]
        params = {
            "filter": "ids.openalex:" + "|".join(batch),
            "select": "id,primary_location,primary_topic",
            "per_page": 50,
            "mailto": MAILTO,
        }
        try:
            r = requests.get(OPENALEX_WORKS, params=params, timeout=30)
            if r.status_code != 200:
                continue
            for w in r.json().get("results", []):
                wid = _bare(w.get("id"))
                loc = w.get("primary_location") or {}
                src = _bare((loc.get("source") or {}).get("id"))
                topic = w.get("primary_topic") or {}
                field = ((topic.get("field") or {}).get("display_name"))
                meta[wid] = {"source": src, "field": field}
        except Exception as e:
            print(f"    ref batch error: {e}")
        time.sleep(DELAY)
        if (i // 50) % 20 == 0 and i:
            print(f"    ...resolved {i}/{len(ref_ids)} refs")
    return meta


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--samples", type=int, default=30, help="recent works per venue")
    ap.add_argument("--venues", type=int, default=0, help="cap #venues (0=all) for quick E2E test")
    ap.add_argument("--refs-cap", type=int, default=80, help="max references kept per paper")
    ap.add_argument("--min-edge", type=int, default=2, help="drop venue edges below this weight")
    ap.add_argument("--out", type=str, default=str(OUT_JSON))
    args = ap.parse_args()

    venues = [v for v in json.loads(VENUES_JSON.read_text(encoding="utf-8"))
              if v.get("type") in ("Journal", "Conference", "SubConference")]
    if args.venues:
        venues = venues[: args.venues]
    vid2name = {v["id"]: v["name"] for v in venues}

    print(f"== Phase 0: resolve {len(venues)} venues -> OpenAlex sources ==")
    sources = resolve_all_sources(venues)
    # reverse map: bare source id -> venue id (first wins)
    src2venue = {}
    for vid, sids in sources.items():
        if vid not in vid2name:
            continue
        for s in sids:
            src2venue.setdefault(s, vid)

    print(f"== Phase 1: fetch up to {args.samples} works/venue ==")
    # citing_work -> venue ; citing_work -> [ref ids]
    work_venue = {}
    work_refs = {}
    for v in venues:
        sids = sources.get(v["id"]) or []
        if not sids:
            continue
        works = fetch_venue_works(sids, args.samples)
        for w in works:
            wid = _bare(w.get("id"))
            refs = [_bare(x) for x in (w.get("referenced_works") or [])][: args.refs_cap]
            if not refs:
                continue
            work_venue[wid] = v["id"]
            work_refs[wid] = refs
        print(f"  [{v['id']}] {len([w for w in works if w.get('referenced_works')])} works w/ refs")
        time.sleep(DELAY)

    all_refs = {r for refs in work_refs.values() for r in refs}
    print(f"== Phase 2: resolve {len(all_refs)} unique referenced works ==")
    ref_meta = resolve_refs(all_refs)

    print("== Phase 3: build edges + interdisciplinarity ==")
    edge_counts = Counter()          # (V, U) cross-venue citation flow
    per_paper_simpson = defaultdict(list)
    per_paper_shannon = defaultdict(list)
    venue_paper_n = Counter()
    venue_ref_resolved = Counter()
    venue_field_counts = defaultdict(Counter)  # venue -> {cited field: count}

    for wid, refs in work_refs.items():
        V = work_venue[wid]
        venue_paper_n[V] += 1
        fields = []
        for r in refs:
            m = ref_meta.get(r)
            if not m:
                continue
            # edge: only if the cited work's venue is in our set and differs
            U = src2venue.get(m["source"])
            if U and U != V:
                edge_counts[(V, U)] += 1
            if m["field"]:
                fields.append(m["field"])
                venue_ref_resolved[V] += 1
                venue_field_counts[V][m["field"]] += 1
        if fields:
            per_paper_simpson[V].append(simpson_diversity(fields))
            per_paper_shannon[V].append(shannon_diversity(fields))

    def _top_fields(vid, k=5):
        fc = venue_field_counts.get(vid)
        if not fc:
            return []
        tot = sum(fc.values())
        return [{"field": f, "share": round(c / tot, 3)} for f, c in fc.most_common(k)]

    def _agg(d, vid):
        xs = [x for x in d.get(vid, []) if x is not None]
        if not xs:
            return None
        xs.sort()
        n = len(xs)
        mean = sum(xs) / n
        median = xs[n // 2] if n % 2 else (xs[n // 2 - 1] + xs[n // 2]) / 2
        return {"mean": round(mean, 4), "median": round(median, 4), "n_papers": n}

    venue_out = {}
    for v in venues:
        vid = v["id"]
        venue_out[vid] = {
            "name": v["name"],
            "interdisciplinarity_simpson": _agg(per_paper_simpson, vid),
            "interdisciplinarity_shannon": _agg(per_paper_shannon, vid),
            "n_papers_sampled": venue_paper_n[vid],
            "n_refs_field_resolved": venue_ref_resolved[vid],
            "top_fields": _top_fields(vid),
        }

    edges = [
        {"source": s, "target": t, "weight": w}
        for (s, t), w in edge_counts.items()
        if w >= args.min_edge
    ]
    edges.sort(key=lambda e: e["weight"], reverse=True)

    out = {
        "_meta": {
            "generator": "build_venue_metrics.py (FieldExplorer V6)",
            "interdisciplinarity_method": "Simpson/Shannon over OpenAlex top-level fields of references; formula per pySciSci methods.diversity (Stirling 2007)",
            "disruption": "DEFERRED to Phase 2 (needs bidirectional citation crawl / snapshot)",
            "samples_per_venue": args.samples,
            "n_venues": len(venues),
            "n_edges": len(edges),
        },
        "venues": venue_out,
        "citation_edges": edges,
    }
    Path(args.out).write_text(json.dumps(out, indent=2, ensure_ascii=False), encoding="utf-8")

    # console summary
    print(f"\nWrote {args.out}")
    print(f"  cross-venue citation edges (weight>={args.min_edge}): {len(edges)}")
    print("  top 8 edges:")
    for e in edges[:8]:
        print(f"    {e['source']:>8} -> {e['target']:<8} {e['weight']}")
    ranked = sorted(
        ((vid, d["interdisciplinarity_simpson"]) for vid, d in venue_out.items()
         if d["interdisciplinarity_simpson"]),
        key=lambda x: x[1]["mean"], reverse=True)
    print("  most interdisciplinary (Simpson mean, top 6):")
    for vid, s in ranked[:6]:
        print(f"    {vid:>8}  {s['mean']:.3f}  (n={s['n_papers']})")


if __name__ == "__main__":
    main()
