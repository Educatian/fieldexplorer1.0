"""
build_venue_methodology.py  --  data-derived methodology profiles (LLM proposer).

Replaces the fragile lexical keyword-matching of methodology with per-abstract
LLM classification, then venue-level aggregation. Follows the house pattern:
LOCAL LLM proposes (Ollama / hermes3:8b), Claude verifies a sample afterwards.

Per venue: fetch N recent OpenAlex abstracts -> classify each into one of six
methodology cultures (+ confidence) -> aggregate to shares. Low-confidence and
"Unclear" calls are tracked so Claude can spot-check them before the data is
trusted / wired into the app.

Output: src/data/venue_methodology.json   (checkpointed per venue, resumable)

Usage:
  py scripts/build_venue_methodology.py --samples 12 --venues 8   # quick test
  py scripts/build_venue_methodology.py --samples 12              # full run
"""
import argparse
import json
import time
from collections import Counter
from pathlib import Path

import requests

from update_semantic_profiles import (
    resolve_source_id, resolve_conference_source_ids, _abstract_from_work, MAILTO,
)

OPENALEX_WORKS = "https://api.openalex.org/works"
OLLAMA = "http://localhost:11434/api/generate"
OLLAMA_MODEL = "hermes3:8b"
VENUES_JSON = Path("src/data/venues.json")
SOURCES_CACHE = Path("src/data/venue_sources.json")
OUT = Path("src/data/venue_methodology.json")
DELAY = 0.3

CATEGORIES = ["Experimental", "Qualitative", "Design & Dev", "Data & AI", "Review & Meta", "Theory"]

RUBRIC = """You classify the PRIMARY research methodology of an education/learning-sciences paper abstract into exactly ONE category:
- Experimental: controlled/quasi experiments, RCTs, interventions with quantitative outcome comparison, effect sizes, regression/SEM on collected data.
- Qualitative: interviews, case studies, ethnography, discourse/thematic/content analysis, phenomenology, grounded theory.
- Design & Dev: design-based research, instructional/system design, prototype or tool building, usability/HCI development studies.
- Data & AI: learning analytics, educational data mining, machine learning/AI modelling, NLP, predictive/algorithmic analysis of log/trace data.
- Review & Meta: systematic/scoping literature review, meta-analysis, evidence synthesis, bibliometrics.
- Theory: conceptual/theoretical framework papers, position/critique, philosophical argument with no empirical data.
If the abstract is an editorial, CFP, or genuinely unclear, use "Unclear".
Return ONLY JSON: {"category": "<one of the six or Unclear>", "confidence": <0.0-1.0>}"""


def fetch_abstracts(source_ids, n):
    joined = "|".join(source_ids[:10])
    params = {
        "sort": "publication_date:desc", "per_page": min(n * 2, 50),
        "select": "title,abstract_inverted_index",
        "filter": f"primary_location.source.id:{joined},has_abstract:true,type:article",
        "mailto": MAILTO,
    }
    out = []
    try:
        r = requests.get(OPENALEX_WORKS, params=params, timeout=25)
        if r.status_code != 200:
            return out
        for w in r.json().get("results", []):
            a = _abstract_from_work(w)
            if len(a.split()) >= 40:
                out.append(a[:2000])
            if len(out) >= n:
                break
    except Exception as e:
        print(f"    fetch error: {e}")
    return out


def classify(abstract):
    """LOCAL LLM proposer -> (category, confidence). Robust to junk output."""
    prompt = f"{RUBRIC}\n\nABSTRACT:\n{abstract}\n\nJSON:"
    for attempt in range(3):
        try:
            r = requests.post(OLLAMA, json={
                "model": OLLAMA_MODEL, "prompt": prompt, "stream": False,
                "format": "json", "options": {"temperature": 0.1, "num_predict": 60},
            }, timeout=120)
            if r.status_code != 200:
                time.sleep(1.5); continue
            obj = json.loads(r.json().get("response", "{}"))
            cat = obj.get("category", "Unclear")
            if cat not in CATEGORIES:
                cat = "Unclear"
            conf = float(obj.get("confidence", 0.0) or 0.0)
            return cat, max(0.0, min(1.0, conf))
        except Exception:
            time.sleep(1.5)
    return "Unclear", 0.0


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--samples", type=int, default=12)
    ap.add_argument("--venues", type=int, default=0)
    args = ap.parse_args()

    venues = [v for v in json.loads(VENUES_JSON.read_text(encoding="utf-8"))
              if v.get("type") in ("Journal", "Conference", "SubConference")]
    if args.venues:
        venues = venues[: args.venues]
    sources = json.loads(SOURCES_CACHE.read_text(encoding="utf-8")) if SOURCES_CACHE.exists() else {}

    out = {}
    if OUT.exists():
        try:
            out = json.loads(OUT.read_text(encoding="utf-8")).get("venues", {})
        except Exception:
            out = {}

    for i, v in enumerate(venues):
        vid = v["id"]
        if vid in out:
            continue
        sids = sources.get(vid) or []
        if not sids:  # resolve + cache if missing
            if v.get("type") == "Journal":
                sid, _ = resolve_source_id(v["name"]); sids = [sid] if sid else []
            else:
                sids, _ = resolve_conference_source_ids(v["name"])
            sources[vid] = sids
            time.sleep(DELAY)
        abstracts = fetch_abstracts(sids, args.samples) if sids else []
        counts, confs, low = Counter(), [], 0
        for a in abstracts:
            cat, conf = classify(a)
            confs.append(conf)
            if cat != "Unclear":
                counts[cat] += 1
            if conf < 0.6:
                low += 1
            time.sleep(0.05)
        total = sum(counts.values())
        shares = {c: round(counts[c] / total, 3) for c in CATEGORIES if counts[c]} if total else {}
        dominant = max(shares, key=shares.get) if shares else None
        out[vid] = {
            "name": v["name"], "shares": shares, "dominant": dominant,
            "n_classified": total, "n_abstracts": len(abstracts),
            "low_confidence_n": low, "mean_confidence": round(sum(confs) / len(confs), 3) if confs else 0.0,
        }
        print(f"[{i+1}/{len(venues)}] {vid}: {dominant} {shares} (n={total}, low={low})")
        OUT.write_text(json.dumps({
            "_meta": {"generator": "build_venue_methodology.py", "proposer": OLLAMA_MODEL,
                      "categories": CATEGORIES, "note": "LLM proposer; Claude verifies low-confidence before trust"},
            "venues": out,
        }, indent=2, ensure_ascii=False), encoding="utf-8")
        SOURCES_CACHE.write_text(json.dumps(sources, indent=2, ensure_ascii=False), encoding="utf-8")

    print(f"\nDone: {len(out)} venues -> {OUT}")


if __name__ == "__main__":
    main()
