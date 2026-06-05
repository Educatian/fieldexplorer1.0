import requests
import json
import time
import os
import re
import math
from pathlib import Path
from collections import Counter

# Configuration
OPENALEX_API_URL = "https://api.openalex.org/works"
OPENALEX_SOURCES_URL = "https://api.openalex.org/sources"
VENUES_JSON_PATH = Path("src/data/venues.json")
OUTPUT_PATH = Path("src/data/semantic_profiles.json")
SAMPLES_PER_JOURNAL = 75          # was 15 -- larger sample = far less noisy fingerprint
MIN_ABSTRACT_WORDS = 40           # skip near-empty abstracts
MAILTO = "jewoong.moon@gmail.com"  # OpenAlex polite pool
DELAY = 0.4

# Enhanced Stop words: function words, generic academic verbs, common surnames,
# AND the conference/title-match junk tokens that polluted the v1 profiles
# (e.g. "valencia", "birds-eye", "conferencedates", "inted").
STOP_WORDS = {
    # function words
    'the', 'and', 'of', 'in', 'to', 'a', 'is', 'for', 'with', 'on', 'as', 'by', 'at', 'an', 'be', 'this', 'it', 'from',
    'which', 'that', 'its', 'these', 'are', 'was', 'were', 'has', 'have', 'had', 'been', 'will', 'can', 'not', 'but',
    'or', 'if', 'when', 'how', 'where', 'why', 'who', 'their', 'our', 'my', 'your', 'his', 'her', 'them', 'they', 'we',
    'such', 'than', 'then', 'thus', 'while', 'whether', 'because', 'however', 'therefore', 'moreover', 'furthermore',
    # generic academic / filler
    'based', 'study', 'studies', 'research', 'paper', 'papers', 'article', 'articles', 'results', 'result', 'data',
    'methods', 'method', 'analysis', 'analyses', 'using', 'used', 'use', 'uses', 'also', 'between', 'more', 'most',
    'about', 'through', 'into', 'both', 'some', 'any', 'journal', 'journals', 'special', 'issue', 'issues', 'volume',
    'including', 'included', 'include', 'well', 'within', 'findings', 'finding', 'author', 'authors', 'year', 'years',
    'published', 'editor', 'editors', 'editorial', 'academic', 'international', 'review', 'reviews', 'systematic',
    'different', 'various', 'during', 'since', 'over', 'work', 'works', 'many', 'each', 'toward', 'towards', 'approach',
    'approaches', 'context', 'contexts', 'field', 'fields', 'area', 'areas', 'present', 'presents', 'presented',
    'propose', 'proposed', 'proposes', 'provide', 'provides', 'provided', 'show', 'shows', 'shown', 'found', 'among',
    'across', 'order', 'number', 'set', 'sets', 'given', 'three', 'four', 'five', 'first', 'second', 'third', 'new',
    'high', 'higher', 'low', 'lower', 'large', 'small', 'important', 'significant', 'significantly', 'related', 'relation',
    'used', 'develop', 'developed', 'development', 'design', 'designed', 'designs', 'effect', 'effects', 'role', 'roles',
    'level', 'levels', 'type', 'types', 'case', 'cases', 'group', 'groups', 'time', 'times', 'process', 'processes',
    'system', 'systems', 'model', 'models', 'understanding', 'understand', 'support', 'supported', 'supports',
    # abstract section-header leakage
    'background', 'abstract', 'introduction', 'conclusion', 'conclusions', 'discussion', 'purpose', 'objective',
    'objectives', 'aim', 'aims', 'participants', 'participant', 'implications', 'limitations', 'keywords',
    # conference / proceedings junk seen in v1 profiles
    'valencia', 'birds-eye', 'conferencedates', 'inted', 'iceri', 'edulearn', 'aect', 'ectj', 'flagship', 'milestones',
    'consolidate', 'consolidated', 'lexicon', 'replicating', 'replicated', 'replicate', 'proceedings', 'conference',
    'conferences', 'symposium', 'workshop', 'keynote', 'invited', 'committee', 'chair', 'chairs', 'session', 'sessions',
    'track', 'tracks', 'submission', 'submissions', 'deadline', 'registration', 'venue', 'venues', 'host', 'hosted',
    # common surnames (author-name leakage)
    'nussbaum', 'brown', 'stefaniak', 'richey', 'sachs', 'jones', 'smith', 'miller', 'davis', 'garcia', 'rodriguez',
    'wilson', 'martinez', 'anderson', 'taylor', 'thomas', 'hernandez', 'moore', 'martin', 'jackson', 'thompson',
    'white', 'lopez', 'lee', 'gonzalez', 'harris', 'clark', 'lewis', 'robinson', 'walker', 'perez', 'hall', 'young',
    'allen', 'sanchez', 'wright', 'king', 'scott', 'green', 'baker', 'adams', 'nelson', 'hill', 'ramirez', 'campbell',
    'mitchell', 'roberts', 'carter', 'phillips', 'evans', 'turner', 'torres', 'parker', 'collins', 'edwards', 'stewart',
    'flores', 'morris', 'nguyen', 'murphy', 'rivera', 'cook', 'rogers', 'morgan', 'peterson', 'cooper', 'reed', 'bailey',
    'kim', 'park', 'choi', 'wang', 'zhang', 'chen', 'liu', 'yang', 'huang', 'zhao', 'singh', 'kumar',
}

# Methodology dictionary to tag keywords
METHODOLOGY_KEYWORDS = {
    'quantitative', 'qualitative', 'mixed methods', 'case study', 'grounded theory', 'ethnography',
    'experimental', 'quasi-experimental', 'longitudinal', 'cross-sectional', 'survey', 'interview',
    'focus group', 'observation', 'discourse analysis', 'content analysis', 'thematic analysis',
    'bibliometric', 'meta-analysis', 'systematic review', 'scoping review', 'analytics', 'data mining',
    'machine learning', 'artificial intelligence', 'nlp', 'eye tracking', 'eye-tracking', 'multimodal',
    'sequence mining', 'process mining', 'sequential', 'statistical', 'regression', 'sem', 'structural equation',
    'modeling', 'validation', 'instrument', 'questionnaire', 'psychometric', 'coding', 'classification',
    'predictive', 'algorithm', 'clustering', 'network analysis', 'social network', 'sna', 'simulation',
    'design-based', 'design based', 'dbr', 'learning analytics', 'epistemic network', 'ena', 'randomized',
    'controlled trial', 'phenomenology', 'narrative inquiry', 'mixed-methods'
}

def clean_text(text):
    if not text: return ""
    text = re.sub(r'<.*?>', '', text)
    text = re.sub(r'[^a-zA-Z\s\-]', ' ', text)
    return text.lower()

def get_weighted_ngrams(text):
    cleaned = clean_text(text)
    words = [w for w in cleaned.split() if len(w) > 3 and w not in STOP_WORDS]

    # Unigrams
    counts = Counter(words)

    # Bigrams
    bigrams = []
    for i in range(len(words) - 1):
        bigrams.append(f"{words[i]} {words[i+1]}")

    counts.update(bigrams)
    return counts

def _abstract_from_work(work):
    abstract_index = work.get('abstract_inverted_index')
    if not abstract_index:
        return ""
    try:
        idx_len = max(max(pos) for pos in abstract_index.values()) + 1
        abstract_words = [None] * idx_len
        for word, positions in abstract_index.items():
            for pos in positions:
                abstract_words[pos] = word
        return " ".join(w for w in abstract_words if w is not None)
    except Exception:
        return ""

def _norm(s):
    return re.sub(r'[^a-z0-9]+', ' ', (s or '').lower()).strip()

def resolve_source_id(journal_name):
    """Resolve a venue NAME to a concrete OpenAlex Source ID.

    Fuzzy works/source name search was the v2 noise source (it matched
    unrelated sources like 'Politecnico Torino' for JLS). The /sources
    endpoint ranks by relevance+works_count, so the top journal-type hit
    whose name reasonably overlaps the query is the right venue.
    """
    try:
        params = {'search': journal_name, 'filter': 'type:journal',
                  'per_page': 5, 'select': 'id,display_name,works_count', 'mailto': MAILTO}
        resp = requests.get(OPENALEX_SOURCES_URL, params=params, timeout=15)
        if resp.status_code != 200:
            return None, None
        results = resp.json().get('results', [])
        if not results:
            return None, None
        qn = set(_norm(journal_name).split())
        # Prefer the highest-works_count source whose name shares >=60% of query tokens.
        best = None
        for src in results:
            sn = set(_norm(src.get('display_name')).split())
            if not qn:
                continue
            overlap = len(qn & sn) / len(qn)
            if overlap >= 0.6:
                if best is None or src.get('works_count', 0) > best.get('works_count', 0):
                    best = src
        chosen = best or results[0]  # fall back to top relevance hit
        sid = (chosen.get('id') or '').rsplit('/', 1)[-1]
        return sid, chosen.get('display_name')
    except Exception as e:
        print(f"  source resolve error: {e}")
        return None, None

def fetch_journal_data(journal_name):
    print(f"Fetching: {journal_name}")
    try:
        sid, matched = resolve_source_id(journal_name)
        if not sid:
            print("  no source id resolved -> skip")
            return None
        print(f"  source: {sid} ({matched})")
        base = {
            'sort': 'publication_date:desc',
            'per_page': SAMPLES_PER_JOURNAL,
            'select': 'title,abstract_inverted_index',
            'filter': f'primary_location.source.id:{sid},has_abstract:true,type:article',
            'mailto': MAILTO,
        }
        resp = requests.get(OPENALEX_API_URL, params=base, timeout=20)
        if resp.status_code != 200:
            return None

        works = resp.json().get('results', [])
        if not works:
            return None

        all_text = ""
        kept = 0
        for work in works:
            abstract = _abstract_from_work(work)
            if len(abstract.split()) < MIN_ABSTRACT_WORDS:
                # still use the title, but skip near-empty abstracts for the body
                title = work.get('title')
                if title:
                    all_text += " " + title
                continue
            all_text += " " + abstract
            title = work.get('title')
            if title:
                all_text += " " + title
            kept += 1

        print(f"  kept {kept} abstracts ({len(works)} works)")
        return all_text if all_text.strip() else None
    except Exception as e:
        print(f"  Error: {e}")
        return None

def main():
    if not VENUES_JSON_PATH.exists(): return

    with open(VENUES_JSON_PATH, 'r', encoding='utf-8') as f:
        venues = [v for v in json.load(f) if v.get('type') == 'Journal']

    journal_texts = {}
    for journal in venues:
        text = fetch_journal_data(journal['name'])
        if text: journal_texts[journal['name']] = text
        time.sleep(DELAY)

    # 1. Calculate TF
    journal_tfs = {name: get_weighted_ngrams(text) for name, text in journal_texts.items()}

    # 2. DF
    all_terms = set()
    for tf in journal_tfs.values(): all_terms.update(tf.keys())

    df = Counter()
    for term in all_terms:
        for tf in journal_tfs.values():
            if term in tf: df[term] += 1

    # 3. TF-IDF and Tagging
    num_docs = len(journal_tfs)
    profiles = {}

    for name, tf in journal_tfs.items():
        tfidf_vector = {}
        for term, freq in tf.items():
            # drop hapax terms (freq 1) to cut residual noise now that samples are larger
            if freq < 2 and ' ' not in term:
                continue
            tf_score = 1 + math.log10(freq)
            idf_score = math.log10(num_docs / df[term])
            tfidf_vector[term] = round(tf_score * idf_score, 4)

        # Sort and take top 100
        top_keywords = sorted(tfidf_vector.items(), key=lambda x: x[1], reverse=True)[:100]

        # Tagging: Separate into Methodology and Domain
        methodology = {}
        domain = {}

        for kw, weight in top_keywords:
            is_meth = False
            # Check if keyword or parts of bigram match methodology dictionary
            if kw in METHODOLOGY_KEYWORDS:
                is_meth = True
            else:
                parts = kw.split()
                if any(p in METHODOLOGY_KEYWORDS for p in parts):
                    is_meth = True

            if is_meth:
                methodology[kw] = weight
            else:
                domain[kw] = weight

        profiles[name] = {
            "name": name,
            "methodology": methodology,
            "domain": domain,
            # For backward compatibility and general cosine
            "vector": dict(top_keywords)
        }

    with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
        json.dump(profiles, f, indent=4, ensure_ascii=False)

    print(f"\nSuccessfully generated {len(profiles)} TF-IDF profiles with Methodology tagging to {OUTPUT_PATH}")

if __name__ == "__main__":
    main()
