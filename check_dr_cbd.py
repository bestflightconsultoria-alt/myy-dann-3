import re
import unicodedata

with open(r"c:\Users\Lucas\CANNA GUIA\myy-dann2-main\src\hooks\useStrains.ts", encoding="utf-8") as f:
    text = f.read()

names = re.findall(r'name:\s*"([^"]+)"', text)
dr_cbd = [n for n in names if "dr" in n.lower() and "cbd" in n.lower()]
print("Contagem de Dr. CBD no Banco de Dados:", len(dr_cbd), dr_cbd)

emojis = []
for n in names:
    for c in n:
        if unicodedata.category(c) in ['So', 'Sk'] or ord(c) > 0x2600:
            emojis.append((n, c))

print("Total de Emojis encontrados nos nomes:", len(emojis))
