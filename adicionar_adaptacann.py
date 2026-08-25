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

ADAPTA_CANN_ITEMS = [
    {
        "ID Unico": "strain-soul-glow",
        "Nome do Produto / Flor": "Soul Glow",
        "Categoria": "flores",
        "Tipo / Subtipo": "Hibrida",
        "Canabinoide Dominante": "THC",
        "% THC / Concentracao": "N/A",
        "% CBD / Concentracao": "< 1%",
        "Linhagem Genetica": "N/A",
        "Terpenos Dominantes": "Cariofileno; Limoneno; Linalol",
        "Perfil Aromatico & Sabor": "Marker funk nítido com doce floral, creme/gás e leve fruto vermelho. Equilíbrio emocional, conforto corporal progressivo.",
        "Associacoes que Dispensam & Precos": "Adapta-Cann: R$ 67,00/g (Outdoor) | R$ 92,00/g (Indoor)"
    },
    {
        "ID Unico": "strain-blue-slushi",
        "Nome do Produto / Flor": "Blue Slushi",
        "Categoria": "flores",
        "Tipo / Subtipo": "Hibrida",
        "Canabinoide Dominante": "THC",
        "% THC / Concentracao": "N/A",
        "% CBD / Concentracao": "< 1%",
        "Linhagem Genetica": "N/A",
        "Terpenos Dominantes": "Mirceno; Cariofileno; Limoneno",
        "Perfil Aromatico & Sabor": "Doce tipo 'berry-candy', creme/baunilha e fundo funky. Foco suave, inspiração e humor elevado.",
        "Associacoes que Dispensam & Precos": "Adapta-Cann: R$ 67,00/g (Outdoor) | R$ 92,00/g (Indoor)"
    },
    {
        "ID Unico": "strain-lemon-cherry-gelato",
        "Nome do Produto / Flor": "Lemon Cherry Gelato",
        "Categoria": "flores",
        "Tipo / Subtipo": "Hibrida",
        "Canabinoide Dominante": "THC",
        "% THC / Concentracao": "N/A",
        "% CBD / Concentracao": "< 1%",
        "Linhagem Genetica": "Sunset Sherbet x Girl Scout Cookies",
        "Terpenos Dominantes": "Cariofileno; Linalool; Limoneno",
        "Perfil Aromatico & Sabor": "Limão e cereja sobre creme/gelato, com leve terroso/pinho. Serenidade, descanso e conforto físico.",
        "Associacoes que Dispensam & Precos": "Adapta-Cann: R$ 67,00/g (Outdoor) | R$ 92,00/g (Indoor)"
    },
    {
        "ID Unico": "strain-zoap",
        "Nome do Produto / Flor": "Zoap (Raw Genetics)",
        "Categoria": "flores",
        "Tipo / Subtipo": "Hibrida",
        "Canabinoide Dominante": "THC",
        "% THC / Concentracao": "N/A",
        "% CBD / Concentracao": "< 1%",
        "Linhagem Genetica": "Rainbow Sherbet x Pink Guava",
        "Terpenos Dominantes": "Mirceno; Limoneno; Linalool",
        "Perfil Aromatico & Sabor": "Doce/frutado com 'soapy' floral e toque gasoso. Descanso ativo, conforto corporal e clareza.",
        "Associacoes que Dispensam & Precos": "Adapta-Cann: R$ 67,00/g (Outdoor) | R$ 92,00/g (Indoor)"
    },
    {
        "ID Unico": "strain-alien-mints",
        "Nome do Produto / Flor": "Alien Mints",
        "Categoria": "flores",
        "Tipo / Subtipo": "Hibrida",
        "Canabinoide Dominante": "THC",
        "% THC / Concentracao": "N/A",
        "% CBD / Concentracao": "< 1%",
        "Linhagem Genetica": "Alien Cookies x Cap Junky",
        "Terpenos Dominantes": "Cariofileno; Limoneno; Mirceno",
        "Perfil Aromatico & Sabor": "Menta cremosa com doce leve sobre terroso. Descanso muscular, equilíbrio afetivo e recuperação física.",
        "Associacoes que Dispensam & Precos": "Adapta-Cann: R$ 67,00/g (Outdoor) | R$ 92,00/g (Indoor)"
    },
    {
        "ID Unico": "strain-runtz-greenhouse",
        "Nome do Produto / Flor": "Runtz Greenhouse",
        "Categoria": "flores",
        "Tipo / Subtipo": "Hibrida",
        "Canabinoide Dominante": "THC",
        "% THC / Concentracao": "N/A",
        "% CBD / Concentracao": "< 1%",
        "Linhagem Genetica": "Zkittlez x Gelato",
        "Terpenos Dominantes": "Cariofileno; Limoneno; Mirceno",
        "Perfil Aromatico & Sabor": "Candy frutado com leve terroso/cremoso. Relaxamento físico, sociabilidade e humor elevado.",
        "Associacoes que Dispensam & Precos": "Adapta-Cann: R$ 67,00/g (Outdoor) | R$ 92,00/g (Indoor)"
    },
    {
        "ID Unico": "strain-lilac-cookies",
        "Nome do Produto / Flor": "Lilac Cookies",
        "Categoria": "flores",
        "Tipo / Subtipo": "Hibrida",
        "Canabinoide Dominante": "THC",
        "% THC / Concentracao": "N/A",
        "% CBD / Concentracao": "< 1%",
        "Linhagem Genetica": "Lilac Diesel x Forum Cookies",
        "Terpenos Dominantes": "Cariofileno; Limoneno; Terpinoleno",
        "Perfil Aromatico & Sabor": "Limão doce e floral rico, com toques 'sour cream' e gás. Elevação do humor e leveza cognitiva.",
        "Associacoes que Dispensam & Precos": "Adapta-Cann: R$ 67,00/g (Outdoor) | R$ 92,00/g (Indoor)"
    },
    {
        "ID Unico": "strain-cherry-gar-see-ya",
        "Nome do Produto / Flor": "Cherry Gar-See-Ya",
        "Categoria": "flores",
        "Tipo / Subtipo": "Hibrida",
        "Canabinoide Dominante": "THC",
        "% THC / Concentracao": "N/A",
        "% CBD / Concentracao": "< 1%",
        "Linhagem Genetica": "Black Cherry Soda x Cherry Maduro",
        "Terpenos Dominantes": "Ocimeno; Limoneno; Cariofileno",
        "Perfil Aromatico & Sabor": "Cereja marcante com cítrico e fundo gasoso/terroso. Humor positivo, descanso suave e leveza sensorial.",
        "Associacoes que Dispensam & Precos": "Adapta-Cann: R$ 67,00/g (Outdoor) | R$ 92,00/g (Indoor)"
    },
    {
        "ID Unico": "strain-fanta-sea",
        "Nome do Produto / Flor": "Fanta Sea",
        "Categoria": "flores",
        "Tipo / Subtipo": "Hibrida",
        "Canabinoide Dominante": "THC",
        "% THC / Concentracao": "N/A",
        "% CBD / Concentracao": "< 1%",
        "Linhagem Genetica": "Wedding Cake x Triangle Kush",
        "Terpenos Dominantes": "Limoneno; Terpinoleno; Cariofileno",
        "Perfil Aromatico & Sabor": "Doce-cremoso de bolo, laranja intensa e madeira/gasoso. Elevação sensorial e inspiração criativa.",
        "Associacoes que Dispensam & Precos": "Adapta-Cann: R$ 67,00/g (Outdoor) | R$ 92,00/g (Indoor)"
    },
    {
        "ID Unico": "strain-grandpas-stash",
        "Nome do Produto / Flor": "Grandpa's Stash",
        "Categoria": "flores",
        "Tipo / Subtipo": "Indica Dominante",
        "Canabinoide Dominante": "THC",
        "% THC / Concentracao": "N/A",
        "% CBD / Concentracao": "< 1%",
        "Linhagem Genetica": "1994 Super Skunk x 1992 OG Kush x 1970 Afghan Kush",
        "Terpenos Dominantes": "Limoneno; Mirceno; Pineno",
        "Perfil Aromatico & Sabor": "Terroso com pinho e toques 'gas/chem'. Estabilidade emocional, relaxamento físico e conforto noturno.",
        "Associacoes que Dispensam & Precos": "Adapta-Cann: R$ 67,00/g (Outdoor) | R$ 92,00/g (Indoor)"
    },
    {
        "ID Unico": "strain-cream-and-cheese",
        "Nome do Produto / Flor": "Cream and Cheese",
        "Categoria": "flores",
        "Tipo / Subtipo": "Equilibrado 1:1",
        "Canabinoide Dominante": "THC/CBD",
        "% THC / Concentracao": "1:1",
        "% CBD / Concentracao": "1:1",
        "Linhagem Genetica": "Seedsman CBD x UK Cheese",
        "Terpenos Dominantes": "Cariofileno; Humuleno; Mirceno",
        "Perfil Aromatico & Sabor": "Cremoso/cheese com doce suave. Equilíbrio entre corpo e mente, redução de tensão e conforto físico.",
        "Associacoes que Dispensam & Precos": "Adapta-Cann: R$ 67,00/g (Outdoor) | R$ 92,00/g (Indoor)"
    },
    {
        "ID Unico": "strain-lifter-cbd",
        "Nome do Produto / Flor": "Lifter CBD",
        "Categoria": "flores",
        "Tipo / Subtipo": "Sativa Dominante",
        "Canabinoide Dominante": "CBD",
        "% THC / Concentracao": "< 1%",
        "% CBD / Concentracao": "12% - 16%",
        "Linhagem Genetica": "Early Resin Berry x Suver Haze",
        "Terpenos Dominantes": "Mirceno; Cariofileno; Pineno",
        "Perfil Aromatico & Sabor": "Cítrico herbal e terroso fresco. Foco no presente, percepção otimista, leveza e conforto físico.",
        "Associacoes que Dispensam & Precos": "Adapta-Cann: R$ 67,00/g (Outdoor) | R$ 92,00/g (Indoor)"
    },
    {
        "ID Unico": "oil-full-spectrum-15mg",
        "Nome do Produto / Flor": "Óleo Full Spectrum 15mg/ml (450mg)",
        "Categoria": "oleos",
        "Tipo / Subtipo": "Full Spectrum",
        "Canabinoide Dominante": "THC/CBD",
        "% THC / Concentracao": "15mg/ml",
        "% CBD / Concentracao": "15mg/ml",
        "Linhagem Genetica": "Full Spectrum Extract",
        "Terpenos Dominantes": "N/A",
        "Perfil Aromatico & Sabor": "Extrato vegetal completo de Cannabis Sativa em Óleo MCT. Suporte de amplo espectro.",
        "Associacoes que Dispensam & Precos": "Adapta-Cann: R$ 280,00 (30ml)"
    },
    {
        "ID Unico": "oil-full-spectrum-30mg",
        "Nome do Produto / Flor": "Óleo Full Spectrum 30mg/ml (900mg)",
        "Categoria": "oleos",
        "Tipo / Subtipo": "Full Spectrum",
        "Canabinoide Dominante": "THC/CBD",
        "% THC / Concentracao": "30mg/ml",
        "% CBD / Concentracao": "30mg/ml",
        "Linhagem Genetica": "Full Spectrum Extract",
        "Terpenos Dominantes": "N/A",
        "Perfil Aromatico & Sabor": "Extrato vegetal completo de Cannabis Sativa em Óleo MCT.",
        "Associacoes que Dispensam & Precos": "Adapta-Cann: R$ 450,00 (30ml)"
    },
    {
        "ID Unico": "oil-full-spectrum-50mg",
        "Nome do Produto / Flor": "Óleo Full Spectrum 50mg/ml (1500mg)",
        "Categoria": "oleos",
        "Tipo / Subtipo": "Full Spectrum",
        "Canabinoide Dominante": "THC/CBD",
        "% THC / Concentracao": "50mg/ml",
        "% CBD / Concentracao": "50mg/ml",
        "Linhagem Genetica": "Full Spectrum Extract",
        "Terpenos Dominantes": "N/A",
        "Perfil Aromatico & Sabor": "Extrato concentrado de Cannabis Sativa em Óleo MCT. Ação prolongada e potente.",
        "Associacoes que Dispensam & Precos": "Adapta-Cann: R$ 750,00 (30ml)"
    },
    {
        "ID Unico": "oil-full-spectrum-100mg",
        "Nome do Produto / Flor": "Óleo Full Spectrum 100mg/ml (3000mg)",
        "Categoria": "oleos",
        "Tipo / Subtipo": "Full Spectrum",
        "Canabinoide Dominante": "THC/CBD",
        "% THC / Concentracao": "100mg/ml",
        "% CBD / Concentracao": "100mg/ml",
        "Linhagem Genetica": "Full Spectrum Extract",
        "Terpenos Dominantes": "N/A",
        "Perfil Aromatico & Sabor": "Extrato ultra-concentrado de Cannabis Sativa em Óleo MCT.",
        "Associacoes que Dispensam & Precos": "Adapta-Cann: R$ 1.150,00 (30ml)"
    },
    {
        "ID Unico": "gummy-full-spectrum-15mg",
        "Nome do Produto / Flor": "Gummies Full Spectrum 15mg",
        "Categoria": "outros",
        "Tipo / Subtipo": "Full Spectrum",
        "Canabinoide Dominante": "THC/CBD",
        "% THC / Concentracao": "15mg por gummie",
        "% CBD / Concentracao": "15mg por gummie",
        "Linhagem Genetica": "N/A",
        "Terpenos Dominantes": "N/A",
        "Perfil Aromatico & Sabor": "Gomas medicinais de espectro completo (450mg total / 30 unidades). Uso prático e saboroso.",
        "Associacoes que Dispensam & Precos": "Adapta-Cann: R$ 350,00 (30 un)"
    },
    {
        "ID Unico": "strain-hash-thca-static-dry-sift",
        "Nome do Produto / Flor": "Hash THCA (Static Dry Sift)",
        "Categoria": "outros",
        "Tipo / Subtipo": "Concentrado / Hash",
        "Canabinoide Dominante": "THCA",
        "% THC / Concentracao": "Alta Concentração THCA",
        "% CBD / Concentracao": "< 1%",
        "Linhagem Genetica": "N/A",
        "Terpenos Dominantes": "Cariofileno; Mirceno",
        "Perfil Aromatico & Sabor": "Extração pura e artesanal em pó resinoso Static Dry Sift de alta potência.",
        "Associacoes que Dispensam & Precos": "Adapta-Cann: R$ 125,00 (1g)"
    }
]

def extrair_chave_canonica(nome):
    n = re.sub(r'[\u2600-\u27BF\U0001F300-\U0001F6FF\U0001F900-\U0001F9FF\U0001F680-\U0001F6FF]', '', nome)
    n = n.lower()
    n = re.sub(r'\s*-\s*(thc|cbd|cbn)\s*$', '', n)
    n = re.sub(r'\s+(thc|cbd|cbn)\s*$', '', n)
    n = re.sub(r'\b(inflorescencia|inflorescencias|flor|flores|gummie|gummies|gummy|oleo|óleo)\b', '', n)
    n = re.sub(r'[^a-z0-9]', '', n)

    if n in ["24k", "24kgold"]: return "24kgold"
    if "gorilafreak" in n: return "gorilafreak"
    if "gorilakush" in n or "gorillakush" in n or "gorillaglue" in n: return "gorilakush"
    if "bubbakush" in n: return "bubbakush"
    if "drcbd" in n or "doctorcbd" in n: return "drcbd"
    if "harleyqueen" in n: return "harleyqueen"
    if "kamakush" in n: return "kamakush"
    if "mexicanice" in n: return "mexicanice"
    if "frozenbiscuit" in n: return "frozenbiscuit"
    if "purplerein" in n or "purplequeen" in n: return "purplequeen"
    if "strolonafreak" in n: return "strolonafreak"
    if "moby" in n: return "mobydick"
    if "acapulco" in n: return "acapulcogold"
    if "amnesia" in n: return "amnesiahaze"
    if "maui" in n: return "mauiwowie"
    if "whitewidow" in n: return "whitewidow"
    if "durban" in n: return "durbanpoison"
    if "sourdiesel" in n: return "sourdiesel"
    if "girlscout" in n or "gsc" in n: return "girlscoutcookies"
    if "gelato" in n: return "gelato41"
    if "pineapple" in n: return "pineappleexpress"
    if "jackherer" in n: return "jackherer"
    if "northernlights" in n: return "northernlights"
    if "lemoncherry" in n: return "lemoncherrygelato"
    if "runtz" in n: return "runtzgreenhouse"
    if "cherrygar" in n: return "cherrygarseeya"
    if "grandpas" in n: return "grandpasstash"
    return n

def integrar_adaptacann():
    dados_existentes = []
    if os.path.exists(CSV_PATH):
        with open(CSV_PATH, mode="r", encoding="utf-8-sig") as f:
            dados_existentes = list(csv.DictReader(f, delimiter=";"))

    mapa_canonico = {}
    todas = dados_existentes + ADAPTA_CANN_ITEMS

    for item in todas:
        nome = item["Nome do Produto / Flor"].strip()
        chave = extrair_chave_canonica(nome)

        if chave not in mapa_canonico:
            mapa_canonico[chave] = item.copy()
        else:
            existente = mapa_canonico[chave]
            
            if existente["Linhagem Genetica"] == "N/A" and item["Linhagem Genetica"] != "N/A":
                existente["Linhagem Genetica"] = item["Linhagem Genetica"]
            if existente["Terpenos Dominantes"] == "N/A" and item["Terpenos Dominantes"] != "N/A":
                existente["Terpenos Dominantes"] = item["Terpenos Dominantes"]
            if existente["Tipo / Subtipo"] == "N/A" and item["Tipo / Subtipo"] != "N/A":
                existente["Tipo / Subtipo"] = item["Tipo / Subtipo"]

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
                    partes = [p.strip() for p in p_exist.split(';') if not p.startswith(assoc)]
                    partes.append(parte)
                    p_exist = "; ".join(partes)
                    
            existente["Associacoes que Dispensam & Precos"] = p_exist

    resultado = list(mapa_canonico.values())
    print(f"✅ Consolidação da Adapta-Cann concluída: {len(resultado)} strains/produtos únicos salvos!")

    # Salva CSV local
    with open(CSV_PATH, mode="w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(f, fieldnames=FIELDS, delimiter=";")
        writer.writeheader()
        writer.writerows(resultado)

    # Sincroniza diretamente com o Google Sheets
    g_rows = [FIELDS]
    for item in resultado:
        g_rows.append([item[f] for f in FIELDS])

    res = requests.post(GOOGLE_WEBAPP_URL, json=rows if 'rows' in locals() else g_rows, allow_redirects=True)
    if res.status_code == 200 and "OK" in res.text:
        print("🎉 SUCESSO! Google Sheets online atualizado com todas as genéticas da Adapta-Cann!")

if __name__ == "__main__":
    integrar_adaptacann()
