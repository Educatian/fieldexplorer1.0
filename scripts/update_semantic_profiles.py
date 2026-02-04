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
VENUES_JSON_PATH = Path("src/data/venues.json")
OUTPUT_PATH = Path("src/data/semantic_profiles.json")
SAMPLES_PER_JOURNAL = 15
DELAY = 0.5

# Enhanced Stop words including common surnames and generic verbs
STOP_WORDS = {
    'the', 'and', 'of', 'in', 'to', 'a', 'is', 'for', 'with', 'on', 'as', 'by', 'at', 'an', 'be', 'this', 'it', 'from',
    'which', 'that', 'its', 'these', 'are', 'was', 'were', 'has', 'have', 'had', 'been', 'will', 'can', 'not', 'but',
    'or', 'if', 'when', 'how', 'where', 'why', 'who', 'their', 'our', 'my', 'your', 'his', 'her', 'its', 'their',
    'based', 'study', 'research', 'paper', 'article', 'results', 'data', 'methods', 'analysis', 'using', 'also',
    'between', 'more', 'about', 'through', 'into', 'both', 'some', 'any', 'journal', 'special', 'issue', 'volume',
    'including', 'well', 'within', 'study', 'findings', 'author', 'year', 'published', 'editor', 'editors', 'academic',
    'international', 'review', 'systematic', 'different', 'various', 'during', 'since', 'over', 'work', 'many', 'each',
    'nussbaum', 'brown', 'stefaniak', 'richey', 'sachs', 'jones', 'smith', 'miller', 'davis', 'garcia', 'rodriguez', 
    'wilson', 'martinez', 'anderson', 'taylor', 'thomas', 'hernandez', 'moore', 'martin', 'jackson', 'thompson',
    'white', 'lopez', 'lee', 'gonzalez', 'harris', 'clark', 'lewis', 'robinson', 'walker', 'perez', 'hall', 'young', 
    'allen', 'sanchez', 'wright', 'king', 'scott', 'green', 'baker', 'adams', 'nelson', 'hill', 'ramirez', 'campbell', 
    'mitchell', 'roberts', 'carter', 'phillips', 'evans', 'turner', 'torres', 'parker', 'collins', 'edwards', 'stewart',
    'flores', 'morris', 'nguyen', 'murphy', 'rivera', 'cook', 'rogers', 'morgan', 'peterson', 'cooper', 'reed', 'bailey',
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
    'predictive', 'algorithm', 'clustering', 'network analysis', 'social network', 'sna', 'simulation'
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

def fetch_journal_data(journal_name):
    print(f"Fetching: {journal_name}")
    try:
        safe_name = re.sub(r'[^a-zA-Z\s]', ' ', journal_name).strip()
        params = {
            'filter': f'display_name.search:("{safe_name}")',
            'sort': 'publication_date:desc',
            'per_page': SAMPLES_PER_JOURNAL
        }
        resp = requests.get(OPENALEX_API_URL, params=params, timeout=10)
        
        if resp.status_code == 400:
            params['filter'] = f'primary_location.source.display_name.search:("{safe_name}")'
            resp = requests.get(OPENALEX_API_URL, params=params, timeout=10)

        if resp.status_code != 200: return None
        
        works = resp.json().get('results', [])
        if not works: return None
            
        all_text = ""
        for work in works:
            abstract_index = work.get('abstract_inverted_index')
            if abstract_index:
                try:
                    idx_len = max([max(pos) for pos in abstract_index.values()]) + 1
                    abstract_words = [None] * idx_len
                    for word, positions in abstract_index.items():
                        for pos in positions: abstract_words[pos] = word
                    all_text += " " + " ".join([w for w in abstract_words if w is not None])
                except Exception: pass
            
            title = work.get('title')
            if title: all_text += " " + title

        return all_text if all_text else None
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
