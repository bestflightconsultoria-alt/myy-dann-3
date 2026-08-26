import re
from collections import Counter

with open(r"c:\Users\Lucas\CANNA GUIA\myy-dann2-main\src\hooks\useStrains.ts", encoding="utf-8") as f:
    text = f.read()

ids = re.findall(r'^\s*id:\s*"([^"]+)"', text, re.MULTILINE)
print("Total Item IDs:", len(ids))
print("Unique Item IDs:", len(set(ids)))

counts = Counter(ids)
dups = {k: v for k, v in counts.items() if v > 1}
print("Duplicate Item IDs:", dups)
