"""
check_map_data.py  --  consistency checks for the map's data files (run in CI and before committing data).

Fails (exit 1) when:
  - an OpenAlex source id is shared by two venues (one venue would show another's data);
  - a data layer has no _meta.generated_at (the app shows that date next to each cue);
  - a coded or measured venue name is not a venue;
  - a venue name equals a category node id (the venue would get no node of its own);
  - an archive lecture linked from the map is missing from public/archive/catalog.js.
Prints warnings for gaps that are known and shown in the app (venues without an OpenAlex source).

  py scripts/check_map_data.py
"""
import json
import re
import subprocess
import sys
from collections import defaultdict
from pathlib import Path

D = Path("src/data")
errors, warnings = [], []


def load(name):
    return json.loads((D / name).read_text(encoding="utf-8"))


venues = load("venues.json")
names = {v["name"] for v in venues}
ids = {v["id"] for v in venues}

# 1. one OpenAlex source per venue
sources = load("venue_sources.json")
owner = defaultdict(list)
for vid, sids in sources.items():
    for s in sids or []:
        owner[s].append(vid)
for s, vids in owner.items():
    if len(vids) > 1:
        errors.append(f"OpenAlex source {s} is shared by {', '.join(vids)}")
missing_src = sorted(i for i in ids if not sources.get(i))
if missing_src:
    warnings.append(f"{len(missing_src)} venues have no OpenAlex source: {', '.join(missing_src)}")

# 2. every layer is dated; 3. every coded/measured venue exists
for f in ["venue_metrics.json", "venue_methodology.json", "venue_activity.json", "field_trends.json"]:
    d = load(f)
    if not (d.get("_meta") or {}).get("generated_at"):
        errors.append(f"{f}: _meta.generated_at missing")
    for vid, v in (d.get("venues") or {}).items():
        if vid not in ids or (v.get("name") and v["name"] not in names):
            errors.append(f"{f}: venue {vid} ({v.get('name')}) is not in venues.json")

# 4. venue names must not equal a category node id (TAG_CATEGORIES and CATEGORY_ALIAS in src/data/venues.ts)
ts = (D / "venues.ts").read_text(encoding="utf-8")
tags = set(re.findall(r"'([^']+)'", re.search(r"TAG_CATEGORIES = new Set\(\[(.*?)\]\)", ts).group(1)))
alias = dict(re.findall(r"'([^']+)':\s*'([^']+)'", re.search(r"CATEGORY_ALIAS[^=]*=\s*\{(.*?)\}", ts).group(1)))
cats = {alias.get(c, c) for v in venues for c in v["categories"] if c not in tags}
for c in sorted(cats & names):
    errors.append(f"category id '{c}' equals a venue name; add it to CATEGORY_ALIAS")
tsx = Path("index.tsx").read_text(encoding="utf-8")
map_rows = re.findall(r'\{ name: "([^"]+)", type: "\w+", categories: \[([^\]]*)\]', tsx)
map_cats = {alias.get(c, c) for _, cs in map_rows for c in re.findall(r'"([^"]+)"', cs) if c not in tags}
for c in sorted(map_cats & {n for n, _ in map_rows}):
    errors.append(f"index.tsx: category id '{c}' equals a venue name; add it to CATEGORY_ALIAS")

# 5. archive lectures linked from the map exist
links = (D / "archive_links.ts").read_text(encoding="utf-8")
linked = set(re.findall(r'^\s{4}"([^"]+)": \{\n\s+"title"', links, re.M))
try:
    out = subprocess.check_output(["node", "-e", "global.window={};require('./public/archive/catalog.js');"
                                   "process.stdout.write(JSON.stringify(window.LECTURES.map(v=>v.id)))"], text=True)
    catalog = set(json.loads(out))
    for i in sorted(linked - catalog):
        errors.append(f"archive_links.ts: lecture {i} is not in public/archive/catalog.js")
except (OSError, subprocess.CalledProcessError) as e:
    errors.append(f"could not read the archive catalog: {e}")

for w in warnings:
    print("WARN ", w)
for e in errors:
    print("ERROR", e)
print(f"checked {len(venues)} venues, {len(linked)} linked lectures: {len(errors)} errors, {len(warnings)} warnings")
sys.exit(1 if errors else 0)
