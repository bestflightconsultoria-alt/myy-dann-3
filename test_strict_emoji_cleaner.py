import csv
import re
import unicodedata

CSV_PATH = r"C:\Users\Lucas\.gemini\antigravity\brain\7e314b13-60ab-4aae-9690-d9eacd03d06a\planilha_strains_brasil_completa.csv"

def limpar_nome_strict(nome):
    if not nome: return ""
    # Remove categoria 'So' (Symbol, other), 'Symbol', e faixa estendida de emojis
    out = []
    for c in nome:
        cat = unicodedata.category(c)
        if cat in ['So', 'Sk', 'Sm', 'Cn'] or ord(c) > 0x1F300:
            continue
        # Remove especificamente faixas de emojis
        if 0x2600 <= ord(c) <= 0x27BF or 0x1F000 <= ord(c) <= 0x1F9FF:
            continue
        out.append(c)
    res = "".join(out)
    return re.sub(r'\s+', ' ', res).strip()

with open(CSV_PATH, mode="r", encoding="utf-8-sig") as f:
    rows = list(csv.DictReader(f, delimiter=";"))

for idx, r in enumerate(rows):
    original = r["Nome do Produto / Flor"]
    limpo = limpar_nome_strict(original)
    if original != limpo:
        print(f"Linha {idx}: [{original}] ---> [{limpo}]")
