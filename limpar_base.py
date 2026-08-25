import csv
import os
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

# Nomes inválidos/lixo para filtrar
INVALID_SLUGS = [
    "strain-1", "strain--1", "strain-1-un", "strain--1-un",
    "strain-esgotado", "strain-cadastre-se", "strain-receita",
    "strain-in-natura", "strain-variacoes-de-valores", "strain-todos"
]

def limpar_e_corrigir():
    if not os.path.exists(CSV_PATH):
        print("Arquivo CSV não encontrado!")
        return

    itens_limpos = []
    with open(CSV_PATH, mode="r", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f, delimiter=";")
        for item in reader:
            slug = item["ID Unico"]
            nome = item["Nome do Produto / Flor"]

            # 1. Filtra itens inválidos
            if slug in INVALID_SLUGS or nome.strip() in ["-1 UN.", "ESGOTADO", "CADASTRE-SE", "IN NATURA", "RECEITA"]:
                print(f"Removendo item inválido: {slug} | {nome}")
                continue

            # 2. Corrige preço das Pipocas THC da Abrapango para R$ 300,00
            if "popcorn-thc" in slug or "pipocas" in nome.lower():
                item["Associacoes que Dispensam & Precos"] = "Abrapango: R$ 300,00 (10g)"

            itens_limpos.append(item)

    # Re-salva o CSV limpo
    with open(CSV_PATH, mode="w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(f, fieldnames=FIELDS, delimiter=";")
        writer.writeheader()
        writer.writerows(itens_limpos)
    print(f"✅ CSV limpo e corrigido! Total de itens válidos: {len(itens_limpos)}")

    # Sincroniza com o Google Sheets
    rows = [FIELDS]
    for item in itens_limpos:
        rows.append([item[f] for f in FIELDS])

    response = requests.post(GOOGLE_WEBAPP_URL, json=rows, allow_redirects=True)
    if response.status_code == 200 and "OK" in response.text:
        print("🎉 SUCESSO! Google Sheets atualizado com os dados limpos!")

if __name__ == "__main__":
    limpar_e_corrigir()
