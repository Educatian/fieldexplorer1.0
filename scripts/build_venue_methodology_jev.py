"""
build_venue_methodology_jev.py  --  venue research profiles coded by Jev (TypeSafe System One).

Replaces the single-label local-LLM methodology call (build_venue_methodology.py) with a
double-worded Jev battery per abstract, so every construct carries its own reliability.

Per abstract (title + abstract only), the battery asks:
  - six methodology constructs, each in two independent wordings (A, B), scored 0-1 (noul);
    a paper can use more than one methodology;
  - the primary methodology (one choice, or "not_research" for editorials and the like);
  - the education level studied (one choice);
  - six technology focus areas, each in two wordings.
A construct is "present" when the mean of A and B is >= .5. A/B disagreement (opposite sides
of .5) is counted and reported as reliability (agreement, Cohen's kappa).

Stages (each is resumable; caches live in data-cache/, which is not committed):
  py scripts/build_venue_methodology_jev.py fetch [--per-venue 60]        OpenAlex abstracts
  py scripts/build_venue_methodology_jev.py code [--venues 8 --per-venue 20] [--key-file PATH]
  py scripts/build_venue_methodology_jev.py build                          -> src/data/venue_methodology.json
The API key comes from TYPESAFE_API_KEY or --key-file; it is held in memory only.
"""
import argparse
import concurrent.futures as cf
import hashlib
import json
import os
import re
import time
from collections import Counter, defaultdict
from datetime import date
from pathlib import Path

import requests

from update_semantic_profiles import _abstract_from_work, MAILTO

OPENALEX_WORKS = "https://api.openalex.org/works"
JEV_URL = "https://api.typesafe.ai/v1/systemone"
MODEL = "jev-1.14.0"
VENUES_JSON = Path("src/data/venues.json")
SOURCES_CACHE = Path("src/data/venue_sources.json")
OUT = Path("src/data/venue_methodology.json")
CACHE = Path("data-cache")
ABSTRACTS = CACHE / "venue_abstracts.json"
CODES = CACHE / "jev_codes.jsonl"
REPORT = CACHE / "jev_report.json"
SINCE = "2023-01-01"
UNTIL = f"{date.today().year - 1}-12-31"  # complete calendar years only
MIN_WORDS = 40
MIN_RESEARCH = 15  # fewer coded research papers than this: shown, but flagged as a small sample

CODEBOOK_VERSION = "fe-venue-codebook-1.2"  # pilots of 160 abstracts: 1.1 narrowed theory B, immersive, analytics, online; 1.2 analytics A (topic, not method) and online B (internet-delivered course)
FOCUS = "Judge only from `title` and `abstract`. Do not assume anything the abstract does not state."

# key -> (label used in the app, wording A, wording B)
METHODS = {
    "experimental": ("Experimental",
        "Does the study compare conditions or groups on a measured outcome, as in a randomized, controlled, or quasi-experiment?",
        "Is a quantitative comparison of an intervention against a control or another condition part of this study?"),
    "qualitative": ("Qualitative",
        "Does the study collect and interpret qualitative data such as interviews, observations, open responses, or discourse, using thematic, content, case-study, or ethnographic analysis?",
        "Is a qualitative analysis of what people said, wrote, or did (for example coding themes in interviews or observing a case) part of this study?"),
    "design_dev": ("Design & Dev",
        "Does the work design, build, or iteratively refine a learning tool, system, curriculum, or intervention (for example design-based research, prototyping, or a usability study)?",
        "Is creating or improving a designed artifact, such as an app, platform, lesson sequence, or prototype, a main part of this work?"),
    "data_ai": ("Data & AI",
        "Does the study analyze log, trace, or large-scale learner data with learning analytics, data mining, machine learning, NLP, or other computational modeling?",
        "Is a computational or AI model (for example prediction, classification, clustering, or language processing) applied to educational data in this study?"),
    "review_meta": ("Review & Meta",
        "Is this a systematic review, scoping review, meta-analysis, bibliometric analysis, or another synthesis of earlier research?",
        "Does the work collect and synthesize findings from a body of earlier studies instead of collecting new data from people?"),
    "theory": ("Theory",
        "Is this a conceptual, theoretical, or position paper that argues or builds a framework without collecting new empirical data?",
        "Does the work present no new empirical data, offering instead an argument, a theoretical model, or a conceptual framework?"),
}
PRIMARY = {
    "experimental": "Experiment or quasi-experiment comparing conditions on measured outcomes.",
    "qualitative": "Qualitative study: interviews, observation, discourse, case study, or ethnography.",
    "design_dev": "Design, development, or design-based research on a tool, system, or intervention.",
    "data_ai": "Learning analytics, data mining, or AI/ML modeling of educational data.",
    "review_meta": "Systematic review, meta-analysis, scoping review, or bibliometric synthesis.",
    "theory": "Conceptual, theoretical, or position paper without new data.",
    "survey_correlational": "Survey, questionnaire, or correlational study without a comparison of conditions.",
    "not_research": "Editorial, introduction to a special issue, book review, or not a research paper.",
}
# survey_correlational has no slot in the six app categories; it is kept and reported separately.
LEVELS = {
    "k12": "Primary or secondary school (K-12) students or teachers.",
    "higher_ed": "University or college students or instructors.",
    "workplace": "Workplace, professional, medical, or vocational training.",
    "informal": "Informal or public learning: museums, families, communities, everyday life.",
    "mixed_or_unspecified": "Several levels, or the level is not stated.",
}
TECH = {
    "ai": ("AI and intelligent systems",
        "Is artificial intelligence (for example generative AI, chatbots, intelligent tutoring, or machine learning) a focus of the learning technology studied?",
        "Does the work center on an AI-based or intelligent system used for teaching or learning?"),
    "immersive": ("VR and AR",
        "Is virtual reality, augmented reality, or mixed reality technology a focus of the work?",
        "Do learners in this work use a VR headset, an AR app, or another extended-reality (XR) environment?"),
    "games": ("Games and play",
        "Are digital games, gamification, or game-based learning a focus of the work?",
        "Does the work study learning through games or game elements?"),
    "collaboration": ("Collaborative learning",
        "Is collaborative or computer-supported collaborative learning (group work, discussion, peer learning) a focus of the work?",
        "Does the work study how learners learn together in groups, teams, or online discussions?"),
    "analytics": ("Analytics and dashboards",
        "Is a learning analytics tool, dashboard, or analytics-based feedback system for teachers or learners a topic of this work (not just the researchers' own analysis of their data)?",
        "Does the work build, use, or evaluate a tool that turns learner data into information for teachers or learners, such as a learning analytics dashboard or data-driven feedback?"),
    "online": ("Online and blended",
        "Is the setting an online, distance, blended, or MOOC course, and is that setting a focus of the work?",
        "Were the learners in this work taking a course delivered over the internet (fully online, distance, blended, or MOOC), as opposed to in-person classes that use digital tools?"),
}
PLANTED = [  # title pattern -> primary methodology the battery should pick
    (re.compile(r"meta-analy|systematic (literature )?review|scoping review", re.I), "review_meta"),
    (re.compile(r"randomi[sz]ed (controlled )?trial|randomi[sz]ed controlled", re.I), "experimental"),
]


def noul(q):
    return {"type": "noul", "instructions": {"question": q, "focus": FOCUS}}


def choice(q, crit):
    return {"type": "choice", "instructions": {"question": q, "focus": FOCUS}, "criteria": crit}


def battery():
    qs = {}
    for k, (_, a, b) in METHODS.items():
        qs[f"m_{k}__A"], qs[f"m_{k}__B"] = noul(a), noul(b)
    for k, (_, a, b) in TECH.items():
        qs[f"t_{k}__A"], qs[f"t_{k}__B"] = noul(a), noul(b)
    qs["primary"] = choice("Which one best describes the main research approach of this work?", PRIMARY)
    qs["level"] = choice("Which education level do the learners in this work belong to?", LEVELS)
    return qs


# ------------------------------------------------------------------ fetch
def _works(sids, wtype, n):
    """Up to n recent works of one type with abstracts, plus how many such works the venue has in the window."""
    params = {
        "filter": f"primary_location.source.id:{'|'.join(sids[:10])},has_abstract:true,type:{wtype},"
                  f"from_publication_date:{SINCE},to_publication_date:{UNTIL}",
        "sort": "publication_date:desc", "per_page": min(max(n * 2, 1), 200),
        "select": "id,title,publication_year,type,abstract_inverted_index", "mailto": MAILTO,
    }
    for attempt in range(4):
        try:
            r = requests.get(OPENALEX_WORKS, params=params, timeout=40)
            break
        except requests.RequestException:
            if attempt == 3:
                raise
            time.sleep(3 * (attempt + 1))
    if r.status_code == 429:
        raise RuntimeError("OpenAlex daily budget reached; rerun later to resume")
    r.raise_for_status()
    d = r.json()
    works = []
    for w in d.get("results", []):
        a = _abstract_from_work(w)
        if len(a.split()) >= MIN_WORDS and w.get("title"):
            works.append({"wid": w["id"].rsplit("/", 1)[-1], "title": w["title"], "year": w.get("publication_year"),
                          "type": w.get("type"), "abstract": a[:3000]})
    return works, d.get("meta", {}).get("count", 0)


def fetch(per_venue):
    """Articles and reviews are sampled in proportion to how many of each the venue published in the window,
    so a venue whose newest abstracts happen to be reviews is not read as a review venue."""
    CACHE.mkdir(exist_ok=True)
    venues = json.loads(VENUES_JSON.read_text(encoding="utf-8"))
    sources = json.loads(SOURCES_CACHE.read_text(encoding="utf-8"))
    store = json.loads(ABSTRACTS.read_text(encoding="utf-8")) if ABSTRACTS.exists() else {}
    used = 0
    for v in venues:
        vid, sids = v["id"], sources.get(v["id"]) or []
        if not sids or store.get(vid, {}).get("window") == [SINCE, UNTIL]:
            continue
        try:
            arts, n_art = _works(sids, "article", per_venue)
            revs, n_rev = _works(sids, "review", per_venue)
        except RuntimeError as e:
            print(e); break
        used += 2
        k_rev = round(per_venue * n_rev / (n_art + n_rev)) if (n_art + n_rev) else 0
        take = revs[:k_rev] + arts[: per_venue - min(k_rev, len(revs))]
        store[vid] = {"name": v["name"], "fetched_at": date.today().isoformat(), "window": [SINCE, UNTIL],
                      "openalex_counts": {"article": n_art, "review": n_rev}, "works": take}
        ABSTRACTS.write_text(json.dumps(store, ensure_ascii=False), encoding="utf-8")
        print(f"  [{vid}] {len(take)} abstracts (articles {n_art}, reviews {n_rev} in window)")
        time.sleep(0.2)
    print(f"fetch done: {len(store)} venues cached, {used} OpenAlex requests")


# ------------------------------------------------------------------ code
def battery_hash(qs):
    return hashlib.sha256((CODEBOOK_VERSION + MODEL + json.dumps(qs, sort_keys=True)).encode()).hexdigest()[:12]


def ask(session, qs, state):
    body = {"model": MODEL, "state": state, "questions": qs}
    for attempt in range(7):
        try:
            r = session.post(JEV_URL, json=body, timeout=120)
        except requests.RequestException:
            time.sleep(min(60, 2 ** attempt)); continue
        if r.status_code in (429, 529) or r.status_code >= 500:
            time.sleep(float(r.headers.get("retry-after", 0) or 0) or min(60, 2 ** attempt)); continue
        if r.status_code != 200:
            raise RuntimeError(f"HTTP {r.status_code}: {r.text[:200]}")
        return r.json()
    raise RuntimeError("retries exhausted")


def code(key, venues_cap, per_venue):
    qs = battery()
    bh = battery_hash(qs)
    store = json.loads(ABSTRACTS.read_text(encoding="utf-8"))
    done = set()
    if CODES.exists():
        for line in CODES.read_text(encoding="utf-8").splitlines():
            rec = json.loads(line)
            if rec["battery_hash"] == bh:
                done.add((rec["vid"], rec["wid"]))
    todo = []
    for vid in list(store)[: venues_cap or None]:
        if no_abstracts(store[vid]):
            continue
        for w in store[vid]["works"][: per_venue or None]:
            if (vid, w["wid"]) not in done:
                todo.append((vid, w))
    print(f"code | battery {bh} | questions {len(qs)} | todo {len(todo)} | cached {len(done)}")
    s = requests.Session()
    s.headers.update({"Authorization": "Bearer " + key, "Content-Type": "application/json"})
    n, errs, tok = 0, 0, 0
    with CODES.open("a", encoding="utf-8") as f, cf.ThreadPoolExecutor(8) as ex:
        futs = {ex.submit(ask, s, qs, {"title": w["title"], "abstract": w["abstract"]}): (vid, w) for vid, w in todo}
        for fu in cf.as_completed(futs):
            vid, w = futs[fu]
            try:
                resp = fu.result()
            except Exception as e:
                errs += 1
                print("ERR", vid, w["wid"], str(e)[:160])
                if "402" in str(e):
                    print("Jev credits exhausted; stopping"); ex.shutdown(cancel_futures=True); break
                continue
            tok += (resp.get("usage") or {}).get("input_tokens", 0)
            f.write(json.dumps({"vid": vid, "wid": w["wid"], "battery_hash": bh, "model_served": resp.get("model"),
                                "answers": resp.get("answers"), "usage": resp.get("usage")}) + "\n")
            f.flush()
            n += 1
            if n % 200 == 0:
                print(f"  {n}/{len(todo)} | errors {errs} | input tokens {tok}")
    print(f"code done: {n} coded, {errs} errors, input tokens {tok}")


def no_abstracts(d):
    """OpenAlex has no regular-paper abstracts and scripts/fetch_alt_abstracts.py found no other source."""
    return (d.get("openalex_counts") or {}).get("article", 1) == 0 and not d.get("alt_source")


# ------------------------------------------------------------------ build
def kappa(a, b):
    n = len(a)
    if not n:
        return None
    po = sum(x == y for x, y in zip(a, b)) / n
    pa, pb = sum(a) / n, sum(b) / n
    pe = pa * pb + (1 - pa) * (1 - pb)
    return round((po - pe) / (1 - pe), 3) if pe < 1 else 1.0


def top_choice(ans):
    c = ans.get("choice")
    return (max(c, key=c.get) if isinstance(c, dict) else c), float(ans.get("confidence") or 0)


def build():
    qs = battery()
    bh = battery_hash(qs)
    store = json.loads(ABSTRACTS.read_text(encoding="utf-8"))
    titles = {(vid, w["wid"]): w["title"] for vid, d in store.items() for w in d["works"]}
    years = [w["year"] for d in store.values() for w in d["works"] if w.get("year")]
    skip = {vid for vid, d in store.items() if no_abstracts(d)}
    recs = [r for r in (json.loads(l) for l in CODES.read_text(encoding="utf-8").splitlines())
            if r["battery_hash"] == bh and (r["vid"], r["wid"]) in titles and r["vid"] not in skip]  # current sample only
    by_venue = defaultdict(list)
    for r in recs:
        by_venue[r["vid"]].append(r)

    # reliability per construct, over every coded abstract
    rel = {}
    for prefix, table in (("m", METHODS), ("t", TECH)):
        for k in table:
            A = [int(r["answers"][f"{prefix}_{k}__A"]["noul"] >= .5) for r in recs]
            B = [int(r["answers"][f"{prefix}_{k}__B"]["noul"] >= .5) for r in recs]
            rel[f"{prefix}_{k}"] = {"label": table[k][0], "agreement": round(sum(x == y for x, y in zip(A, B)) / len(A), 3) if A else None,
                                    "kappa": kappa(A, B), "present_share": round(sum((x + y) / 2 for x, y in zip(A, B)) / len(A), 3) if A else None}
    # planted controls: titles that name their own design
    planted = []
    for r in recs:
        t = titles.get((r["vid"], r["wid"]), "")
        for pat, want in PLANTED:
            if pat.search(t):
                got, _ = top_choice(r["answers"]["primary"])
                planted.append({"title": t[:120], "want": want, "got": got, "ok": got == want})
                break

    def present(r, prefix, k):
        a = r["answers"]
        return (a[f"{prefix}_{k}__A"]["noul"] + a[f"{prefix}_{k}__B"]["noul"]) / 2 >= .5

    out = {}
    for vid, d in store.items():
        # OpenAlex holds abstracts only for this venue's occasional reviews, not its regular papers:
        # coding them would misread the venue, so it is listed without a profile.
        if no_abstracts(d):
            out[vid] = {"name": d["name"], "shares": {}, "dominant": None, "n_classified": 0, "n_abstracts": 0,
                        "n_research": 0, "no_article_abstracts": True, "reviews_with_abstracts": d["openalex_counts"].get("review", 0)}
    for vid, rs in by_venue.items():
        if vid in out:
            continue
        prim, lev, confs, low, disagree, survey, nonres = Counter(), Counter(), [], 0, 0, 0, 0
        for r in rs:
            p, c = top_choice(r["answers"]["primary"])
            confs.append(c)
            low += c < .6
            if p == "not_research":
                nonres += 1; continue
            if p == "survey_correlational":
                survey += 1
            else:
                prim[METHODS[p][0]] += 1
            lv, _ = top_choice(r["answers"]["level"])
            lev[lv] += 1
            for prefix, table in (("m", METHODS), ("t", TECH)):
                for k in table:
                    a = r["answers"]
                    disagree += (a[f"{prefix}_{k}__A"]["noul"] >= .5) != (a[f"{prefix}_{k}__B"]["noul"] >= .5)
        research = [r for r in rs if top_choice(r["answers"]["primary"])[0] != "not_research"]
        n_res = len(research)
        tot = sum(prim.values())
        shares = {c: round(prim[c] / tot, 3) for c in (v[0] for v in METHODS.values()) if prim[c]} if tot else {}
        out[vid] = {
            "name": store[vid]["name"],
            "shares": shares,
            "dominant": max(shares, key=shares.get) if shares else None,
            "n_classified": tot,
            "n_abstracts": len(rs),
            "n_research": n_res,
            "survey_correlational_n": survey,
            "not_research_n": nonres,
            "uses": {METHODS[k][0]: round(sum(present(r, "m", k) for r in research) / n_res, 3) for k in METHODS} if n_res else {},
            "tech": {TECH[k][0]: round(sum(present(r, "t", k) for r in research) / n_res, 3) for k in TECH} if n_res else {},
            "level": {k: round(lev[k] / n_res, 3) for k in LEVELS if lev[k]} if n_res else {},
            "low_confidence_n": low,
            "mean_confidence": round(sum(confs) / len(confs), 3) if confs else 0.0,
            "ab_disagreements": disagree,
            "low_sample": n_res < MIN_RESEARCH,
            "abstract_source": (store[vid].get("alt_source") or {}).get("source", "OpenAlex"),
        }
    meta = {
        "generator": "build_venue_methodology_jev.py",
        "coder": MODEL, "codebook": CODEBOOK_VERSION, "battery_hash": bh,
        "generated_at": date.today().isoformat(),
        "source": "OpenAlex abstracts (articles and reviews in proportion to their counts); venues without OpenAlex abstracts use scripts/fetch_alt_abstracts.py (abstract_source per venue)",
        "works_window": [SINCE, UNTIL], "works_years": [min(years), max(years)] if years else None,
        "n_abstracts": len(recs), "n_venues": len(out),
        "categories": [v[0] for v in METHODS.values()],
        "tech_areas": [v[0] for v in TECH.values()],
        "levels": list(LEVELS),
        "rule": "shares = primary methodology among research papers; uses/tech = share of research papers where the mean of two wordings is >= .5",
        "reliability": rel,
        "planted_controls": {"n": len(planted), "correct": sum(p["ok"] for p in planted)},
    }
    OUT.write_text(json.dumps({"_meta": meta, "venues": out}, indent=2, ensure_ascii=False), encoding="utf-8")
    REPORT.write_text(json.dumps({"reliability": rel, "planted": planted}, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"wrote {OUT}: {len(out)} venues, {len(recs)} abstracts")
    for k, v in rel.items():
        print(f"  {k:16} agreement {v['agreement']}  kappa {v['kappa']}  present {v['present_share']}")
    print(f"  planted controls {meta['planted_controls']}")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("stage", choices=["fetch", "code", "build"])
    ap.add_argument("--per-venue", type=int, default=60)
    ap.add_argument("--venues", type=int, default=0)
    ap.add_argument("--key-file", type=str, default="")
    args = ap.parse_args()
    if args.stage == "fetch":
        fetch(args.per_venue)
    elif args.stage == "code":
        key = os.environ.get("TYPESAFE_API_KEY") or (Path(args.key_file).read_text(encoding="utf-8").strip() if args.key_file else "")
        if not key:
            raise SystemExit("Set TYPESAFE_API_KEY or pass --key-file")
        code(key, args.venues, args.per_venue)
    else:
        build()


if __name__ == "__main__":
    main()
