import csv
import json
import os
import re
import requests
import sys

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

CSV_PATH = r"C:\Users\Lucas\.gemini\antigravity\brain\7e314b13-60ab-4aae-9690-d9eacd03d06a\planilha_strains_brasil_completa.csv"
TS_PATH = r"c:\Users\Lucas\CANNA GUIA\myy-dann2-main\src\hooks\useStrains.ts"
GOOGLE_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbzmQvFSwCRhc2jUlYS9oX9zTEFFQUq3bLR0LNXzRmPXvOgKoGE7oJ7KSDZ4YJ7DtKKb/exec"

FIELDS = [
    "ID Unico", "Nome do Produto / Flor", "Categoria", "Tipo / Subtipo",
    "Canabinoide Dominante", "% THC / Concentracao", "% CBD / Concentracao",
    "Linhagem Genetica", "Terpenos Dominantes",
    "Perfil Aromatico & Sabor", "Associacoes que Dispensam & Precos"
]

def padronizar():
    if not os.path.exists(CSV_PATH):
        print("CSV não encontrado.")
        return

    rows = []
    with open(CSV_PATH, mode="r", encoding="utf-8-sig") as f:
        rows = list(csv.DictReader(f, delimiter=";"))

    novas_rows = []
    pipocas_thc = None
    pipocas_cbd = None

    for r in rows:
        nome = r["Nome do Produto / Flor"].strip()
        nome_lower = nome.lower()

        # Identifica se é mix/pipocas/sortidas/mistas
        eh_pipoca = any(w in nome_lower for w in ["pipoca", "pipocas", "popcorn", "mix", "sortida", "sortidas", "mistas"])

        if eh_pipoca:
            canab = r["Canabinoide Dominante"].strip()
            if "cbd" in nome_lower or canab == "CBD":
                if not pipocas_cbd:
                    pipocas_cbd = {
                        "ID Unico": "strain-pipoquinhas-cbd",
                        "Nome do Produto / Flor": "Pipoquinhas CBD",
                        "Categoria": "flores",
                        "Tipo / Subtipo": "Sativa Dominante",
                        "Canabinoide Dominante": "CBD",
                        "% THC / Concentracao": "< 1%",
                        "% CBD / Concentracao": "10% - 15%",
                        "Linhagem Genetica": "Blend de Pipocas CBD de Alta Qualidade",
                        "Terpenos Dominantes": "Mirceno; Cariofileno; Pineno",
                        "Perfil Aromatico & Sabor": "Inflorescências menores (pipoquinhas) ricas em CBD. Sabor herbal e terroso suave com excelente relação custo-benefício.",
                        "Associacoes que Dispensam & Precos": r["Associacoes que Dispensam & Precos"]
                    }
                else:
                    # Mescla preços
                    p_exist = pipocas_cbd["Associacoes que Dispensam & Precos"]
                    p_novo = r["Associacoes que Dispensam & Precos"]
                    for parte in p_novo.split(';'):
                        parte = parte.strip()
                        if parte and parte.split(':')[0].strip() not in p_exist:
                            p_exist += f"; {parte}"
                    pipocas_cbd["Associacoes que Dispensam & Precos"] = p_exist
            else:
                if not pipocas_thc:
                    pipocas_thc = {
                        "ID Unico": "strain-pipoquinhas-thc",
                        "Nome do Produto / Flor": "Pipoquinhas THC",
                        "Categoria": "flores",
                        "Tipo / Subtipo": "Híbrida",
                        "Canabinoide Dominante": "THC",
                        "% THC / Concentracao": "15% - 22%",
                        "% CBD / Concentracao": "< 1%",
                        "Linhagem Genetica": "Blend de Pipocas THC de Alta Qualidade",
                        "Terpenos Dominantes": "Cariofileno; Limoneno; Mirceno",
                        "Perfil Aromatico & Sabor": "Inflorescências menores (pipoquinhas) ricas em THC. Variedades sortidas e selecionadas com ótimo aroma e potência.",
                        "Associacoes que Dispensam & Precos": r["Associacoes que Dispensam & Precos"]
                    }
                else:
                    # Mescla preços
                    p_exist = pipocas_thc["Associacoes que Dispensam & Precos"]
                    p_novo = r["Associacoes que Dispensam & Precos"]
                    for parte in p_novo.split(';'):
                        parte = parte.strip()
                        if parte and parte.split(':')[0].strip() not in p_exist:
                            p_exist += f"; {parte}"
                    pipocas_thc["Associacoes que Dispensam & Precos"] = p_exist
        else:
            novas_rows.append(r)

    if pipocas_thc:
        novas_rows.append(pipocas_thc)
    if pipocas_cbd:
        novas_rows.append(pipocas_cbd)

    print(f"✅ Padronização concluída: {len(novas_rows)} itens na base de dados!")

    # Salva CSV atualizado
    with open(CSV_PATH, mode="w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(f, fieldnames=FIELDS, delimiter=";")
        writer.writeheader()
        writer.writerows(novas_rows)

    # Sincroniza Google Sheets
    g_rows = [FIELDS]
    for item in novas_rows:
        g_rows.append([item[f] for f in FIELDS])
    try:
        requests.post(GOOGLE_WEBAPP_URL, json=g_rows, allow_redirects=True)
        print("🎉 Google Sheets atualizado com Pipoquinhas THC e Pipoquinhas CBD!")
    except Exception as e:
        print(f"Erro ao sincronizar Google Sheets: {e}")

    # Regenera useStrains.ts para a aplicação React
    import build_react_strains
    build_react_strains.gerar_use_strains_ts()

if __name__ == "__main__":
    padronizar()
