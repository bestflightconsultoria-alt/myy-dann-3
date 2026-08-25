import csv
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

HEADER_NOISE_TERMS = [
    "DASHBOARD", "MEUS PEDIDOS", "PRESCRIÇÕES", "CATÁLOGO", "SHOPPING_CART",
    "NOTIFICATIONS", "LUCAS", "RICARDO", "PEREIRA", "SILVA", "ASSOCIADO ATIVO",
    "PERSON", "CATEGORIAS", "TODOS OS PRODUTOS", "INFLORESCÊNCIA THC", "MIX",
    "FLORES MISTAS", "DISPONIBILIDADE", "EM ESTOQUE", "SOB ENCOMENDA", "REGRAS DE COMPRA",
    "INÍCIO", "CATÁLOGO AUTORIZADO", "ENVIOS PARA O RIO DE JANEIRO!", "ORDENAR POR:", "RELEVÂNCIA"
]

def limpar_descricoes():
    if not os.path.exists(CSV_PATH):
        print("Arquivo CSV não encontrado.")
        return

    rows = []
    with open(CSV_PATH, mode="r", encoding="utf-8-sig") as f:
        rows = list(csv.DictReader(f, delimiter=";"))

    for item in rows:
        perfil = item["Perfil Aromatico & Sabor"]
        
        # Se contiver ruído de cabeçalho
        if any(term in perfil.upper() for term in ["DASHBOARD", "LUCAS RICARDO", "SHOPPING_CART"]):
            partes = [p.strip() for p in perfil.split(' - ') if p.strip()]
            partes_limpas = []
            for p in partes:
                p_up = p.upper()
                if not any(noise in p_up for noise in HEADER_NOISE_TERMS) and len(p) > 3:
                    partes_limpas.append(p)
            
            nova_desc = " - ".join(partes_limpas)
            if not nova_desc:
                nova_desc = item["Nome do Produto / Flor"]
            
            print(f"🧹 Descrição limpa para '{item['Nome do Produto / Flor']}':")
            print(f"   Antes: {perfil[:80]}...")
            print(f"   Depois: {nova_desc}")
            item["Perfil Aromatico & Sabor"] = nova_desc

    # Salva CSV
    with open(CSV_PATH, mode="w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(f, fieldnames=FIELDS, delimiter=";")
        writer.writeheader()
        writer.writerows(rows)

    # Sincroniza com Google Sheets
    g_rows = [FIELDS]
    for item in rows:
        g_rows.append([item[f] for f in FIELDS])

    res = requests.post(GOOGLE_WEBAPP_URL, json=g_rows, allow_redirects=True)
    if res.status_code == 200 and "OK" in res.text:
        print("🎉 SUCESSO! Google Sheets atualizado com as descrições 100% limpas!")

if __name__ == "__main__":
    limpar_descricoes()
