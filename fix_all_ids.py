import csv
import json
import os
import re
import sys

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

CSV_PATH = r"C:\Users\Lucas\.gemini\antigravity\brain\7e314b13-60ab-4aae-9690-d9eacd03d06a\planilha_strains_brasil_completa.csv"
TS_PATH = r"c:\Users\Lucas\CANNA GUIA\myy-dann2-main\src\hooks\useStrains.ts"

def fix_csv_ids():
    if not os.path.exists(CSV_PATH):
        print("CSV não encontrado.")
        return

    rows = []
    with open(CSV_PATH, mode="r", encoding="utf-8-sig") as f:
        rows = list(csv.DictReader(f, delimiter=";"))

    seen_slugs = set()
    fixed_rows = []

    for idx, r in enumerate(rows):
        nome = r["Nome do Produto / Flor"].strip()
        cat = r["Categoria"].strip()
        
        # Gera slug único a partir do nome
        slug_base = re.sub(r'[^a-z0-9]', '-', nome.lower())
        slug_base = re.sub(r'-+', '-', slug_base).strip('-')
        
        prefix = "oil" if cat == "oleos" else ("gummy" if cat == "outros" else "strain")
        slug = f"{prefix}-{slug_base}"

        if slug in seen_slugs:
            slug = f"{slug}-{idx}"
        seen_slugs.add(slug)

        r["ID Unico"] = slug
        fixed_rows.append(r)

    # Reescreve CSV limpo com IDs 100% únicos
    with open(CSV_PATH, mode="w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(f, fieldnames=list(rows[0].keys()), delimiter=";")
        writer.writeheader()
        writer.writerows(fixed_rows)

    print(f"✅ CSV corrigido: {len(fixed_rows)} linhas com IDs 100% únicos!")

    # Regenera useStrains.ts
    import build_react_strains
    build_react_strains.gerar_use_strains_ts()

if __name__ == "__main__":
    fix_csv_ids()
