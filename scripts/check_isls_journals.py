"""
Simple ISLS Journal Extractor
Extract journal names from the markdown content we already have
and compare with existing venues.json
"""
import json
from pathlib import Path

# Known journals from the sample content
ISLS_JOURNALS = [
    "Computers & Education",
    "Computers and Education",
    "International Journal of Computer-Supported Collaborative Learning",
    "Learning and Instruction",
    "Cognitive Science",
    "Contemporary Educational Psychology",
    "Cognition and Instruction",
    "Journal of the Learning Sciences",
]

# Path to existing venues.json
SCRIPT_DIR = Path(__file__).parent
PROJECT_ROOT = SCRIPT_DIR.parent
VENUES_JSON_PATH = PROJECT_ROOT / "src" / "data" / "venues.json"

def normalize_journal_name(name):
    """Normalize journal name for comparison."""
    normalized = name.lower()
    normalized = normalized.replace('&', 'and')
    normalized = normalized.replace('  ', ' ')
    return normalized.strip()

def load_existing_journals():
    """Load existing journal names from venues.json."""
    with open(VENUES_JSON_PATH, 'r', encoding='utf-8') as f:
        venues = json.load(f)
    
    existing = {}
    for venue in venues:
        if venue.get('type') == 'Journal':
            name = venue['name']
            normalized = normalize_journal_name(name)
            existing[normalized] = name
    
    return existing

def main():
    print("🔍 ISLS Journal Comparison\n")
    
    # Load existing journals
    existing = load_existing_journals()
    print(f"✅ Loaded {len(existing)} existing journals from venues.json\n")
    
    # Check each ISLS journal
    new_journals = []
    existing_journals = []
    
    for journal in ISLS_JOURNALS:
        normalized = normalize_journal_name(journal)
        if normalized in existing:
            existing_journals.append((journal, existing[normalized]))
        else:
            new_journals.append(journal)
    
    # Print results
    print("="*60)
    print("📊 RESULTS")
    print("="*60)
    
    if new_journals:
        print(f"\n🆕 NEW JOURNALS ({len(new_journals)}):")
        for i, journal in enumerate(new_journals, 1):
            print(f"  {i}. {journal}")
    else:
        print("\n✅ All ISLS journals already in database!")
    
    if existing_journals:
        print(f"\n✓ Already in database ({len(existing_journals)}):")
        for i, (isls_name, db_name) in enumerate(existing_journals, 1):
            if isls_name != db_name:
                print(f"  {i}. {isls_name} → (as '{db_name}')")
            else:
                print(f"  {i}. {isls_name}")

if __name__ == "__main__":
    main()
