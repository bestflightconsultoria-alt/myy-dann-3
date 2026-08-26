import csv
import json
import os
import re
import requests
import sys
import unicodedata

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

CSV_PATH = r"C:\Users\Lucas\.gemini\antigravity\brain\7e314b13-60ab-4aae-9690-d9eacd03d06a\planilha_strains_brasil_completa.csv"
GOOGLE_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbzmQvFSwCRhc2jUlYS9oX9zTEFFQUq3bLR0LNXzRmPXvOgKoGE7oJ7KSDZ4YJ7DtKKb/exec"

FIELDS = [
    "ID Unico", "Nome do Produto / Flor", "Categoria", "Tipo / Subtipo",
    "Canabinoide Dominante", "% THC / Concentracao", "% CBD / Concentracao",
    "Linhagem Genetica", "Terpenos Dominantes",
    "Perfil Aromatico & Sabor", "Associacoes que Dispensam & Precos"
]

def remover_emojis_total(texto):
    if not texto: return ""
    cleaned = []
    for c in texto:
        code = ord(c)
        cat = unicodedata.category(c)
        # Mantém apenas letras, números e pontuações aceitas (incluindo acentos á, é, í, ó, ú, ç, ã, etc.)
        if cat.startswith('L') or cat.startswith('N') or c in " -():;.,/#%<>&'\"+":
            # Filtra símbolos de emojis específicos
            if not (0x2600 <= code <= 0x27BF or 0x1F000 <= code <= 0x1FFFF or 0xFE00 <= code <= 0xFE0F):
                cleaned.append(c)
    res = "".join(cleaned)
    return re.sub(r'\s+', ' ', res).strip()

def extrair_chave_canonica(nome):
    n = remover_emojis_total(nome).lower()
    n = re.sub(r'\s*-\s*(thc|cbd|cbn)\s*$', '', n)
    n = re.sub(r'\s+(thc|cbd|cbn)\s*$', '', n)
    n = re.sub(r'\b(inflorescencia|inflorescencias|flor|flores|gummie|gummies|gummy|oleo|óleo)\b', '', n)
    n = re.sub(r'[^a-z0-9]', '', n)

    if "drcbd" in n or "doctorcbd" in n or "dr.cbd" in n: return "drcbd"
    if "gorilafreak" in n: return "gorilafreak"
    if "gorilakush" in n or "gorillakush" in n or "gorillaglue" in n: return "gorilakush"
    if "bubbakush" in n: return "bubbakush"
    if "24k" in n: return "24kgold"
    if "superogbanana" in n or "ogbanana" in n: return "superogbanana"
    return n

def executar_limpeza_definitiva():
    if not os.path.exists(CSV_PATH):
        print("CSV não encontrado.")
        return

    rows = []
    with open(CSV_PATH, mode="r", encoding="utf-8-sig") as f:
        rows = list(csv.DictReader(f, delimiter=";"))

    mapa_canonico = {}

    for r in rows:
        nome_limpo = remover_emojis_total(r["Nome do Produto / Flor"])
        
        # Garante padronização de nome do Dr. CBD
        if "dr" in nome_limpo.lower() and "cbd" in nome_limpo.lower():
            nome_limpo = "Dr. CBD"

        r["Nome do Produto / Flor"] = nome_limpo

        # Recategorização estrita de Óleos
        nome_lower = nome_limpo.lower()
        subtipo_lower = r["Tipo / Subtipo"].lower()

        is_oil = any(w in nome_lower or w in subtipo_lower for w in [
            "óleo", "oleo", "full spectrum", "broad spectrum", "mg/ml", "3000mg", "1500mg", "900mg", "450mg", "200mg", "100mg", "50mg", "gotas"
        ]) and "gummies" not in nome_lower and "gummy" not in nome_lower and "gomas" not in nome_lower

        if is_oil:
            r["Categoria"] = "oleos"
            r["Tipo / Subtipo"] = "Óleo / Extrato"

        # Deduplicação canônica
        chave = extrair_chave_canonica(nome_limpo)

        if chave not in mapa_canonico:
            mapa_canonico[chave] = r.copy()
        else:
            existente = mapa_canonico[chave]
            
            p_exist = existente["Associacoes que Dispensam & Precos"]
            p_novo = r["Associacoes que Dispensam & Precos"]
            
            for parte in p_novo.split(';'):
                parte = parte.strip()
                if not parte: continue
                assoc = parte.split(':')[0].strip()
                if assoc not in p_exist:
                    p_exist += f"; {parte}"
                    
            existente["Associacoes que Dispensam & Precos"] = p_exist

    resultado = list(mapa_canonico.values())

    # Garante IDs 100% únicos
    seen_slugs = set()
    for idx, r in enumerate(resultado):
        cat = r["Categoria"]
        slug_base = re.sub(r'[^a-z0-9]', '-', r["Nome do Produto / Flor"].lower())
        slug_base = re.sub(r'-+', '-', slug_base).strip('-')
        prefix = "oil" if cat == "oleos" else ("gummy" if cat == "outros" else "strain")
        slug = f"{prefix}-{slug_base}"
        if slug in seen_slugs:
            slug = f"{slug}-{idx}"
        seen_slugs.add(slug)
        r["ID Unico"] = slug

    print(f"✅ Limpeza definitiva concluída: {len(resultado)} itens 100% únicos salvos!")

    # Salva CSV limpo
    with open(CSV_PATH, mode="w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(f, fieldnames=FIELDS, delimiter=";")
        writer.writeheader()
        writer.writerows(resultado)

    # Sincroniza Google Sheets
    g_rows = [FIELDS]
    for item in resultado:
        g_rows.append([item[f] for f in FIELDS])

    try:
        requests.post(GOOGLE_WEBAPP_URL, json=g_rows, allow_redirects=True)
        print("🎉 Google Sheets atualizado com zero emojis, zero duplicatas de Dr. CBD e óleos recategorizados!")
    except Exception as e:
        print(f"Erro ao sincronizar Google Sheets: {e}")

    # Regenera useStrains.ts para a aplicação React
    import build_react_strains
    build_react_strains.gerar_use_strains_ts()

if __name__ == "__main__":
    executar_limpeza_definitiva()
