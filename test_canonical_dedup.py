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

def extrair_chave_canonica(nome):
    # Remove emojis
    n = re.sub(r'[\u2600-\u27BF\U0001F300-\U0001F6FF\U0001F900-\U0001F9FF\U0001F680-\U0001F6FF]', '', nome)
    n = n.lower()
    
    # Remove sufixos e termos genéricos comuns
    n = re.sub(r'\s*-\s*(thc|cbd|cbn)\s*$', '', n)
    n = re.sub(r'\s+(thc|cbd|cbn)\s*$', '', n)
    n = re.sub(r'\b(inflorescencia|inflorescencias|flor|flores|gummie|gummies|gummy|oleo|óleo)\b', '', n)
    n = re.sub(r'\b(gold|freak)\b', r'\1', n) # Preserva gold / freak
    n = re.sub(r'[^a-z0-9]', '', n)
    
    # Mapeamento especial de equivalências conhecidas
    if n in ["24k", "24kgold"]:
        return "24kgold"
    if "gorilafreak" in n:
        return "gorilafreak"
    if "gorilakush" in n or "gorillakush" in n:
        return "gorilakush"
    if "bubbakush" in n:
        return "bubbakush"
    if "drcbd" in n or "doctorcbd" in n:
        return "drcbd"
    if "harleyqueen" in n:
        return "harleyqueen"
    if "kamakush" in n:
        return "kamakush"
    if "mexicanice" in n:
        return "mexicanice"
    if "frozenbiscuit" in n:
        return "frozenbiscuit"
    if "purplerein" in n or "purplequeen" in n:
        return "purplequeen"
    if "strolonafreak" in n:
        return "strolonafreak"
    if "moby" in n:
        return "mobydick"
        
    return n

def desduplicar_e_limpar():
    if not os.path.exists(CSV_PATH):
        print("Arquivo CSV não encontrado.")
        return

    rows = []
    with open(CSV_PATH, mode="r", encoding="utf-8-sig") as f:
        rows = list(csv.DictReader(f, delimiter=";"))

    mapa_canonico = {}

    for item in rows:
        nome = item["Nome do Produto / Flor"].strip()
        slug = item["ID Unico"]

        chave = extrair_chave_canonica(nome)
        print(f"Nome: '{nome}' -> Chave Canônica: '{chave}'")

        if chave not in mapa_consolidado:
            pass

if __name__ == "__main__":
    rows = []
    with open(CSV_PATH, mode="r", encoding="utf-8-sig") as f:
        rows = list(csv.DictReader(f, delimiter=";"))

    mapa_canonico = {}
    for item in rows:
        nome = item["Nome do Produto / Flor"].strip()
        slug = item["ID Unico"]
        chave = extrair_chave_canonica(nome)

        if chave not in mapa_canonico:
            mapa_canonico[chave] = item.copy()
        else:
            existente = mapa_canonico[chave]
            
            # Mescla linhagem e terpenos se a nova for mais completa
            if existente["Linhagem Genetica"] == "N/A" and item["Linhagem Genetica"] != "N/A":
                existente["Linhagem Genetica"] = item["Linhagem Genetica"]
            if existente["Terpenos Dominantes"] == "N/A" and item["Terpenos Dominantes"] != "N/A":
                existente["Terpenos Dominantes"] = item["Terpenos Dominantes"]
            if existente["Tipo / Subtipo"] == "N/A" and item["Tipo / Subtipo"] != "N/A":
                existente["Tipo / Subtipo"] = item["Tipo / Subtipo"]

            # Mescla associações e preços sem duplicar
            p_exist = existente["Associacoes que Dispensam & Precos"]
            p_novo = item["Associacoes que Dispensam & Precos"]
            
            for parte in p_novo.split(';'):
                parte = parte.strip()
                if not parte:
                    continue
                assoc = parte.split(':')[0].strip()
                
                if assoc not in p_exist:
                    p_exist += f"; {parte}"
                elif ("Vitrine Restrita" in p_exist or "Sob Consulta" in p_exist) and ("R$" in parte):
                    # Substitui vitrine restrita pelo preço real R$
                    partes = [p.strip() for p in p_exist.split(';') if not p.startswith(assoc)]
                    partes.append(parte)
                    p_exist = "; ".join(partes)
                    
            existente["Associacoes que Dispensam & Precos"] = p_exist

    resultado = list(mapa_canonico.values())
    print(f"\n✅ Total de Strains únicas após desduplicação canônica: {len(resultado)}")

    # Salva no CSV
    with open(CSV_PATH, mode="w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(f, fieldnames=FIELDS, delimiter=";")
        writer.writeheader()
        writer.writerows(resultado)

    # Envia para Google Sheets
    g_rows = [FIELDS]
    for item in resultado:
        g_rows.append([item[f] for f in FIELDS])

    res = requests.post(GOOGLE_WEBAPP_URL, json=g_rows, allow_redirects=True)
    print("Google Sheets status:", res.status_code)
