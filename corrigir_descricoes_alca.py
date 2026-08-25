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

# Descrições oficiais extraídas com precisão cirúrgica para as strains da ALCA
DESCRICOES_EXATAS_ALCA = {
    "gelato-41": "Flores de alta qualidade, com aroma adocicado e perfil equilibrado. Uma genética muito apreciada pela sua excelente resina, aparência e experiência marcante.",
    "pineapple-express": "Flores de alta qualidade, com aroma agradável e perfil tropical. Uma genética muito apreciada pela excelente produção de resina e qualidade consistente.",
    "mix-de-flores": "Seleção sortida de pequenas flores (as famosas “pipoquinhas”) de diversas genéticas como Purple Haze, Super Silver Haze, Blackberry OG, Jack Herer, Kushberry, Tangie, Hindu Kush e Blueberry. Excelente opção custo-benefício. Pedido mínimo de 10g.",
    "flores-mistas": "Seleção variada de flores pequenas e médias, composta por diferentes genéticas, podendo incluir Bubba Kush, Gorilla Glue, Jack Herer, Golden Goat, entre outras. Pedido mínimo de 10g.",
    "amnesia-haze": "Flores de alta qualidade, com aroma intenso e marcante. Uma genética clássica, reconhecida pela excelente produção de resina e pelo perfil aromático característico.",
    "acapulco-gold": "Flores de alta qualidade, com aroma marcante e perfil clássico. Uma genética renomada pela excelente produção de resina, aparência diferenciada e qualidade consistente.",
    "maui-wowie": "Flores de alta qualidade, com aroma agradável e perfil tropical. Uma genética clássica, conhecida pela boa produção de resina e excelente qualidade das flores.",
    "white-widow": "Flores de alta qualidade, com aroma marcante e excelente produção de resina. Uma genética clássica e muito reconhecida pela sua consistência e qualidade.",
    "durban-poison": "Flores de alta qualidade, com aroma marcante e perfil clássico. Uma genética tradicional, reconhecida pela excelente produção de resina e qualidade consistente.",
    "sour-diesel": "Flores de alta qualidade, com aroma intenso e perfil marcante. Uma genética clássica, reconhecida pela excelente produção de resina e qualidade consistente.",
    "moby-dick": "Flores de alta qualidade, com aroma marcante e excelente produção de resina. Uma genética reconhecida pelo seu perfil equilibrado e pela qualidade consistente das flores.",
    "girl-scout-cookies": "Flores de alta qualidade, com aroma marcante e excelente produção de resina. Uma genética muito apreciada pela qualidade consistente e pelo perfil aromático característico.",
    "mako-haze": "Flores de alta qualidade, com aroma intenso e perfil clássico. Uma genética reconhecida pela excelente produção de resina e qualidade consistente das flores.",
    "northern-lights": "Flores de alta qualidade, com aroma marcante e excelente produção de resina. Uma genética clássica, reconhecida pela sua qualidade consistente e perfil equilibrado.",
    "permanent-marker": "Flores de alta qualidade, com aroma intenso e perfil marcante. Uma genética reconhecida pela excelente produção de resina e qualidade consistente das flores.",
    "jack-herer": "Flores de alta qualidade, com aroma marcante e excelente produção de resina. Uma genética clássica, reconhecida pela sua qualidade consistente e perfil equilibrado.",
    "bubba-kush": "Flores de alta qualidade, com aroma marcante e excelente produção de resina. Uma genética reconhecida pela sua qualidade consistente e perfil clássico.",
    "gorilla-glue": "Flores de alta qualidade, com aroma intenso e excelente produção de resina. Uma genética muito apreciada pela qualidade consistente e perfil marcante das flores.",
    "afghan-kush": "Genética clássica de predominância índica, originária da região do Hindu Kush, conhecida por seu perfil terpeno terroso."
}

def corrigir_descricoes_alca():
    if not os.path.exists(CSV_PATH):
        print("CSV não encontrado.")
        return

    rows = []
    with open(CSV_PATH, mode="r", encoding="utf-8-sig") as f:
        rows = list(csv.DictReader(f, delimiter=";"))

    for item in rows:
        nome = item["Nome do Produto / Flor"].strip()
        slug = item["ID Unico"]

        # Busca correspondência exata de descrição
        for key, desc_oficial in DESCRICOES_EXATAS_ALCA.items():
            if key in slug or key.replace("-", "") in nome.lower().replace(" ", "").replace("#", ""):
                item["Perfil Aromatico & Sabor"] = desc_oficial
                print(f"✨ Descrição corrigida para '{nome}': {desc_oficial[:70]}...")
                break

    # Salva no CSV
    with open(CSV_PATH, mode="w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(f, fieldnames=FIELDS, delimiter=";")
        writer.writeheader()
        writer.writerows(rows)
    print("✅ CSV local atualizado com descrições perfeitas!")

    # Sincroniza com Google Sheets
    g_rows = [FIELDS]
    for item in rows:
        g_rows.append([item[f] for f in FIELDS])

    res = requests.post(GOOGLE_WEBAPP_URL, json=g_rows, allow_redirects=True)
    if res.status_code == 200 and "OK" in res.text:
        print("🎉 SUCESSO! Google Sheets atualizado com as descrições da ALCA 100% perfeitas!")

if __name__ == "__main__":
    corrigir_descricoes_alca()
