import csv
import json
import os
import re
import requests
import sys

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

def remover_emojis(texto):
    if not texto: return ""
    # Remove emojis e caracteres especiais não alfanuméricos visíveis
    emoji_pattern = re.compile(
        "["
        "\U0001F600-\U0001F64F"  # emoticons
        "\U0001F300-\U0001F5FF"  # símbolos & pictógrafos
        "\U0001F680-\U0001F6FF"  # transporte & mapa
        "\U0001F1E0-\U0001F1FF"  # bandeiras
        "\U0001F900-\U0001F9FF"  # suplementar
        "\u2600-\u27BF"          # símbolos diversos
        "\u2300-\u23FF"
        "]+", flags=re.UNICODE
    )
    res = emoji_pattern.sub("", texto)
    return re.sub(r'\s+', ' ', res).strip()

def extrair_chave_canonica(nome):
    n = remover_emojis(nome).lower()
    n = re.sub(r'\s*-\s*(thc|cbd|cbn)\s*$', '', n)
    n = re.sub(r'\s+(thc|cbd|cbn)\s*$', '', n)
    n = re.sub(r'\b(inflorescencia|inflorescencias|flor|flores|gummie|gummies|gummy|oleo|óleo)\b', '', n)
    n = re.sub(r'[^a-z0-9]', '', n)

    if "drcbd" in n or "doctorcbd" in n: return "drcbd"
    if "gorilafreak" in n: return "gorilafreak"
    if "gorilakush" in n or "gorillakush" in n or "gorillaglue" in n: return "gorilakush"
    if "bubbakush" in n: return "bubbakush"
    if "24k" in n: return "24kgold"
    return n

def limpar_e_recategorizar():
    if not os.path.exists(CSV_PATH):
        print("CSV não encontrado.")
        return

    rows = []
    with open(CSV_PATH, mode="r", encoding="utf-8-sig") as f:
        rows = list(csv.DictReader(f, delimiter=";"))

    mapa_canonico = {}

    for r in rows:
        nome_limpo = remover_emojis(r["Nome do Produto / Flor"])
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

        # Deduplicação canônica (inclusive Dr CBD)
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

    # Garante IDs únicos
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

    print(f"✅ Limpeza concluída: {len(resultado)} itens únicos na base de dados!")

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
        print("🎉 Google Sheets atualizado sem emojis, sem duplicatas e com óleos recategorizados!")
    except Exception as e:
        print(f"Erro ao sincronizar Google Sheets: {e}")

    # Regenera useStrains.ts para a aplicação React
    import build_react_strains
    build_react_strains.gerar_use_strains_ts()

if __name__ == "__main__":
    limpar_e_recategorizar()
