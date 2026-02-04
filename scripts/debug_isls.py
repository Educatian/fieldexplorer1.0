"""
More detailed HTML structure inspection
"""
import requests
from bs4 import BeautifulSoup

url = "https://www.isls.org/research-topics/analysis-of-discourse-data/"
response = requests.get(url)
soup = BeautifulSoup(response.text, 'html.parser')

# Find all list items
all_lis = soup.find_all('li')
print(f"Total <li> elements found: {len(all_lis)}\n")

# Look for citations (they usually contain years in parentheses)
citation_pattern_lis = [li for li in all_lis if '(' in li.get_text() and ')' in li.get_text() and any(char.isdigit() for char in li.get_text())]
print(f"List items that look like citations: {len(citation_pattern_lis)}\n")

if citation_pattern_lis:
    print("Sample citations:")
    for i, li in enumerate(citation_pattern_lis[:5], 1):
        text = li.get_text().strip()
        print(f"{i}. {text[:150]}...")

# Try finding by class or other attributes
print("\n\nLooking for specific sections...")
# Check if there's a div or section with reading content
for tag in soup.find_all(['div', 'section', 'article']):
    text = tag.get_text()
    if 'Computers & Education' in text or 'Computers and Education' in text:
        print(f"\nFound section containing 'Computers & Education'")
        print(f"Tag: {tag.name}, Classes: {tag.get('class')}")
        # Find list items within this section
        lis = tag.find_all('li')
        print(f"List items in this section: {len(lis)}")
        if lis:
            print(f"First item: {lis[0].get_text()[:100]}")
        break
