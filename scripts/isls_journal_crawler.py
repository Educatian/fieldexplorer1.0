"""
ISLS Research Topics Journal Crawler
=====================================
Crawls https://www.isls.org/research-topics/ to extract journal information
from research topic pages and generates a list of journals for FieldExplorer.

This script checks against existing journals in venues.json and only outputs
NEW journals that are not already in the database.

Usage:
    python isls_journal_crawler.py

Output:
    - isls_new_journals.csv: List of NEW journals not in venues.json
    - isls_all_journals.csv: Complete list with duplicate status
    - isls_papers.csv: Full list of papers with journal information
"""

import requests
from bs4 import BeautifulSoup
import re
import time
import csv
from collections import defaultdict
from urllib.parse import urljoin
import json
import os
from pathlib import Path

# Configuration
BASE_URL = "https://www.isls.org"
RESEARCH_TOPICS_URL = f"{BASE_URL}/research-topics/"
DELAY_BETWEEN_REQUESTS = 1.0  # seconds, to be respectful

# Path to existing venues.json
SCRIPT_DIR = Path(__file__).parent
PROJECT_ROOT = SCRIPT_DIR.parent
VENUES_JSON_PATH = PROJECT_ROOT / "src" / "data" / "venues.json"

# Common journal name patterns in citations
JOURNAL_PATTERNS = [
    # Pattern: "Journal Name, Volume(Issue), Pages"
    r'\.([^.]+),\s*\d+(?:\(\d+\))?,\s*\d+[-–]\d+\.',
    # Pattern: "In Journal Name (pp. pages)"
    r'In\s+([^(]+)\s+\(pp\.',
    # Pattern: "Journal Name. Volume"
    r'\.([^.]+)\.\s*\d+',
]

def load_existing_journals():
    """Load existing journal names from venues.json."""
    try:
        if not VENUES_JSON_PATH.exists():
            print(f"⚠️  Warning: venues.json not found at {VENUES_JSON_PATH}")
            return set()
        
        with open(VENUES_JSON_PATH, 'r', encoding='utf-8') as f:
            venues = json.load(f)
        
        # Extract journal names (type == "Journal")
        existing_journals = set()
        for venue in venues:
            if venue.get('type') == 'Journal':
                # Normalize name for comparison (lowercase, remove special chars)
                name = venue['name']
                normalized = normalize_journal_name(name)
                existing_journals.add(normalized)
        
        return existing_journals
    except Exception as e:
        print(f"⚠️  Error loading venues.json: {e}")
        return set()

def normalize_journal_name(name):
    """Normalize journal name for comparison (lowercase, remove &, punctuation)."""
    # Convert to lowercase
    normalized = name.lower()
    # Replace & with 'and'
    normalized = normalized.replace('&', 'and')
    # Remove punctuation and extra spaces
    normalized = re.sub(r'[^\w\s]', '', normalized)
    normalized = re.sub(r'\s+', ' ', normalized)
    return normalized.strip()

def fetch_page(url):
    """Fetch a page with error handling and rate limiting."""
    try:
        time.sleep(DELAY_BETWEEN_REQUESTS)
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        return response.text
    except requests.RequestException as e:
        print(f"Error fetching {url}: {e}")
        return None

def extract_research_topic_urls(html):
    """Extract all research topic URLs from the main page."""
    soup = BeautifulSoup(html, 'html.parser')
    topic_urls = []
    
    # Find all links to research topics
    for link in soup.find_all('a', href=True):
        href = link['href']
        if '/research-topics/' in href and href != RESEARCH_TOPICS_URL:
            full_url = urljoin(BASE_URL, href)
            if full_url not in topic_urls:
                topic_urls.append(full_url)
    
    return topic_urls

def extract_journal_from_citation(citation):
    """
    Extract journal name from a citation string.
    Returns (journal_name, full_citation) or (None, citation) if not found.
    """
    # Try different patterns
    for pattern in JOURNAL_PATTERNS:
        match = re.search(pattern, citation)
        if match:
            journal = match.group(1).strip()
            # Clean up common artifacts
            journal = re.sub(r'\s+', ' ', journal)
            journal = journal.strip(',. ')
            
            # Filter out non-journal text
            if len(journal) > 5 and not journal.startswith('http'):
                return journal, citation
    
    # Manual patterns for common formats
    # "Computers & Education" format
    if 'Computers & Education' in citation or 'Computers and Education' in citation:
        return 'Computers & Education', citation
    
    # "Journal of the Learning Sciences" format
    if 'Journal of the Learning Sciences' in citation:
        return 'Journal of the Learning Sciences', citation
    
    # "International Journal of Computer-Supported Collaborative Learning"
    if 'International Journal of Computer-Supported Collaborative Learning' in citation:
        return 'International Journal of Computer-Supported Collaborative Learning', citation
    
    # "Cognitive Science"
    if 'Cognitive Science' in citation:
        return 'Cognitive Science', citation
    
    # "Learning and Instruction"
    if 'Learning and Instruction' in citation:
        return 'Learning and Instruction', citation
    
    # "Contemporary Educational Psychology"
    if 'Contemporary Educational Psychology' in citation:
        return 'Contemporary Educational Psychology', citation
    
    # "Cognition and Instruction"
    if 'Cognition and Instruction' in citation:
        return 'Cognition and Instruction', citation
    
    return None, citation

def extract_papers_from_topic(html, topic_url):
    """Extract paper citations from a research topic page."""
    soup = BeautifulSoup(html, 'html.parser')
    papers = []
    
    # Find the Reading section
    reading_section = None
    for header in soup.find_all(['h2', 'h3', 'h4']):
        if 'reading' in header.get_text().lower():
            reading_section = header
            break
    
    if not reading_section:
        return papers
    
    # Extract citations from list items following the Reading header
    current = reading_section.find_next_sibling()
    while current:
        if current.name in ['h2', 'h3', 'h4']:
            break
        
        if current.name in ['ul', 'ol']:
            for li in current.find_all('li'):
                citation = li.get_text().strip()
                if citation:
                    journal, full_citation = extract_journal_from_citation(citation)
                    papers.append({
                        'citation': full_citation,
                        'journal': journal,
                        'topic_url': topic_url
                    })
        
        current = current.find_next_sibling()
    
    return papers

def main():
    """Main crawler function."""
    print("🔍 Starting ISLS Research Topics Journal Crawler...")
    print(f"📍 Target: {RESEARCH_TOPICS_URL}\n")
    
    # Step 0: Load existing journals
    print("Step 0: Loading existing journals from venues.json...")
    existing_journals = load_existing_journals()
    print(f"✅ Loaded {len(existing_journals)} existing journals\n")
    
    # Step 1: Fetch main research topics page
    print("Step 1: Fetching research topics list...")
    main_html = fetch_page(RESEARCH_TOPICS_URL)
    if not main_html:
        print("❌ Failed to fetch main page. Exiting.")
        return
    
    # Step 2: Extract topic URLs
    topic_urls = extract_research_topic_urls(main_html)
    print(f"✅ Found {len(topic_urls)} research topics\n")
    
    # Step 3: Crawl each topic page
    all_papers = []
    print("Step 2: Crawling individual topic pages...")
    
    for i, url in enumerate(topic_urls, 1):
        topic_name = url.split('/')[-2].replace('-', ' ').title()
        print(f"  [{i}/{len(topic_urls)}] {topic_name}...", end=' ')
        
        html = fetch_page(url)
        if html:
            papers = extract_papers_from_topic(html, url)
            all_papers.extend(papers)
            print(f"✓ ({len(papers)} papers)")
        else:
            print("✗ (failed)")
    
    print(f"\n✅ Extracted {len(all_papers)} total paper citations\n")
    
    # Step 4: Aggregate journal statistics and check for duplicates
    print("Step 3: Analyzing journals and checking for duplicates...")
    journal_stats = defaultdict(lambda: {'count': 0, 'papers': [], 'is_new': False})
    
    for paper in all_papers:
        if paper['journal']:
            journal_name = paper['journal']
            normalized = normalize_journal_name(journal_name)
            
            # Check if this is a new journal
            is_new = normalized not in existing_journals
            
            journal_stats[journal_name]['count'] += 1
            journal_stats[journal_name]['papers'].append(paper['citation'])
            journal_stats[journal_name]['is_new'] = is_new
    
    # Separate new and existing journals
    new_journals = [(j, d) for j, d in journal_stats.items() if d['is_new']]
    existing_found = [(j, d) for j, d in journal_stats.items() if not d['is_new']]
    
    # Sort by frequency
    new_journals.sort(key=lambda x: x[1]['count'], reverse=True)
    existing_found.sort(key=lambda x: x[1]['count'], reverse=True)
    
    print(f"✅ Found {len(journal_stats)} unique journals")
    print(f"   - {len(new_journals)} NEW journals (not in venues.json)")
    print(f"   - {len(existing_found)} already in database\n")
    
    # Step 5: Export to CSV
    print("Step 4: Exporting results...")
    
    # Export NEW journals only
    with open('isls_new_journals.csv', 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['Journal Name', 'Paper Count', 'Sample Citation'])
        
        for journal, data in new_journals:
            sample = data['papers'][0][:100] + '...' if len(data['papers'][0]) > 100 else data['papers'][0]
            writer.writerow([journal, data['count'], sample])
    
    print(f"  ✓ isls_new_journals.csv ({len(new_journals)} NEW journals)")
    
    # Export ALL journals with duplicate status
    with open('isls_all_journals.csv', 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['Journal Name', 'Paper Count', 'Status', 'Sample Citation'])
        
        all_sorted = sorted(journal_stats.items(), key=lambda x: x[1]['count'], reverse=True)
        for journal, data in all_sorted:
            status = 'NEW' if data['is_new'] else 'EXISTS'
            sample = data['papers'][0][:100] + '...' if len(data['papers'][0]) > 100 else data['papers'][0]
            writer.writerow([journal, data['count'], status, sample])
    
    print(f"  ✓ isls_all_journals.csv ({len(journal_stats)} total journals)")
    
    # Export all papers
    with open('isls_papers.csv', 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['Citation', 'Journal', 'Topic URL'])
        
        for paper in all_papers:
            writer.writerow([paper['citation'], paper['journal'] or 'Unknown', paper['topic_url']])
    
    print(f"  ✓ isls_papers.csv ({len(all_papers)} papers)")
    
    # Print summary
    print("\n" + "="*60)
    print("📊 SUMMARY")
    print("="*60)
    print(f"Total research topics crawled: {len(topic_urls)}")
    print(f"Total papers extracted: {len(all_papers)}")
    print(f"Unique journals identified: {len(journal_stats)}")
    print(f"  - NEW journals: {len(new_journals)}")
    print(f"  - Already in database: {len(existing_found)}")
    
    if new_journals:
        print(f"\n🆕 NEW JOURNALS TO ADD ({len(new_journals)}):")
        for i, (journal, data) in enumerate(new_journals[:20], 1):  # Show top 20
            print(f"  {i:2d}. {journal} ({data['count']} papers)")
        if len(new_journals) > 20:
            print(f"  ... and {len(new_journals) - 20} more (see isls_new_journals.csv)")
    else:
        print("\n✅ No new journals found - all journals already in database!")
    
    if existing_found:
        print(f"\n✓ Already in database ({len(existing_found)}):")
        for i, (journal, data) in enumerate(existing_found[:10], 1):  # Show top 10
            print(f"  {i:2d}. {journal} ({data['count']} papers)")
        if len(existing_found) > 10:
            print(f"  ... and {len(existing_found) - 10} more")
    
    print("\n✅ Crawling complete!")

if __name__ == "__main__":
    main()
