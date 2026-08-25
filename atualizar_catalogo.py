import asyncio
import csv
import json
import os
import re
import requests
import sys
from playwright.async_api import async_playwright

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

CSV_PATH = r"C:\Users\Lucas\.gemini\antigravity\brain\7e314b13-60ab-4aae-9690-d9eacd03d06a\planilha_strains_brasil_completa.csv"
GOOGLE_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbzmQvFSwCRhc2jUlYS9oX9zTEFFQUq3bLR0LNXzRmPXvOgKoGE7oJ7KSDZ4YJ7DtKKb/exec"

LOGIN_EMAIL = os.environ.get("DAMASCENO_EMAIL", "lucas97.ricardo@gmail.com")
LOGIN_PASSWORD = os.environ.get("DAMASCENO_PASSWORD", "Org@123456")

FIELDS = [
    "ID Unico", "Nome do Produto / Flor", "Categoria", "Tipo / Subtipo",
    "Canabinoide Dominante", "% THC / Concentracao", "% CBD / Concentracao",
    "Linhagem Genetica", "Terpenos Dominantes",
    "Perfil Aromatico & Sabor", "Associacoes que Dispensam & Precos"
]

INVALID_TERMS = [
    "-1 UN.", "-2 UN.", "-3 UN.", "ESGOTADO", "IN NATURA", "RECEITA", 
    "CADASTRE-SE", "VARIAÇÕES DE VALORES", "TODOS", "GUMMIE", "ÓLEO", "POMADA",
    "ENTRAR", "PERFIL", "PEDIDOS", "SUPORTE", "TERMOS", "INÍCIO", "SAIR", "BRINDE"
]

INVALID_SLUGS = ["strain-1", "strain--1", "strain-1-un", "strain--1-un", "strain-esgotado", "strain-cadastre-se", "strain-receita", "strain-in-natura", "strain-variacoes-de-valores"]

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
    return n

def e_nome_valido(nome):
    if not nome or len(nome.strip()) < 2:
        return False
    nome_upper = nome.strip().upper()
    if nome_upper in INVALID_TERMS or any(t == nome_upper for t in INVALID_TERMS):
        return False
    if re.match(r'^-\d+\s*UN\.?$', nome_upper):
        return False
    return True

def determinar_categoria(nome, txt_completo=""):
    nome_lower = nome.lower()
    if any(k in nome_lower for k in ["gummie", "gummy", "goma", "edível", "edivel", "pomada", "creme", "bálsamo", "balm"]):
        return "outros"
    elif any(k in nome_lower for k in ["óleo", "oleo", "tintura", "drop"]):
        return "oleos"
    else:
        return "flores"

def criar_slug(texto, categoria):
    texto_limpo = re.sub(r'[^\w\s-]', '', texto)
    slug = texto_limpo.lower()
    slug = re.sub(r'[áàãâä]', 'a', slug)
    slug = re.sub(r'[éèêë]', 'e', slug)
    slug = re.sub(r'[íìîï]', 'i', slug)
    slug = re.sub(r'[óòõôö]', 'o', slug)
    slug = re.sub(r'[úùûü]', 'u', slug)
    slug = re.sub(r'[ç]', 'c', slug)
    slug = re.sub(r'[^a-z0-9]+', '-', slug).strip('-')

    prefixo = "gummy" if categoria == "outros" and "gumm" in slug else ("oil" if categoria == "oleos" else "strain")
    if not slug.startswith(prefixo):
        return f"{prefixo}-{slug}"
    return slug

async def raspar_alca(page):
    print("1. Realizando login na ALCA (plataforma.alcanabica.org)...")
    try:
        await page.goto("https://plataforma.alcanabica.org/login", wait_until="networkidle")
        await asyncio.sleep(2)

        email_field = page.locator("input[type='email'], input[type='text']").first
        pass_field = page.locator("input[type='password']").first

        if await email_field.is_visible() and await pass_field.is_visible():
            await email_field.fill(LOGIN_EMAIL)
            await pass_field.fill(LOGIN_PASSWORD)
            await pass_field.press("Enter")
            await asyncio.sleep(4)
            print("Login efetuado na ALCA!")

        print("Navegando para o catálogo completo da ALCA...")
        await page.goto("https://plataforma.alcanabica.org/user/catalog", wait_until="networkidle")
        await asyncio.sleep(3)

        for _ in range(6):
            await page.evaluate("window.scrollBy(0, 800)")
            await asyncio.sleep(1)

        full_text = await page.evaluate("document.body.innerText")
        blocos = full_text.split("SKU:")
        print(f"Divididos {len(blocos)-1} blocos de SKU na ALCA.")

        itens = []
        for b in blocos[1:]:
            linhas = [l.strip() for l in b.split('\n') if l.strip()]
            if not linhas or len(linhas) < 2:
                continue

            sku_code = linhas[0]
            nome = linhas[1]

            if not e_nome_valido(nome):
                continue

            m_preco = re.search(r'R\$\s*([\d\.\,]+)', b)
            preco_val = m_preco.group(0) if m_preco else "N/A"
            preco_fmt = f"ALCA: {preco_val}/g"

            categoria = determinar_categoria(nome, b)
            slug = criar_slug(nome, categoria)

            # Busca descrição exata limpa
            desc = " ".join([l for l in linhas[2:] if "Disponível" not in l and "unidades" not in l and "Renova" not in l and "R$" not in l and "SKU" not in l and "Dashboard" not in l])
            for key, desc_oficial in DESCRICOES_EXATAS_ALCA.items():
                if key in slug or key.replace("-", "") in nome.lower().replace(" ", "").replace("#", ""):
                    desc = desc_oficial
                    break

            canabinoide = "CBD" if "CBD" in nome.upper() else "THC"

            itens.append({
                "ID Unico": slug,
                "Nome do Produto / Flor": nome,
                "Categoria": categoria,
                "Tipo / Subtipo": "Hibrida",
                "Canabinoide Dominante": canabinoide,
                "% THC / Concentracao": "N/A",
                "% CBD / Concentracao": "N/A",
                "Linhagem Genetica": "N/A",
                "Terpenos Dominantes": "N/A",
                "Perfil Aromatico & Sabor": desc if desc else nome,
                "Associacoes que Dispensam & Precos": preco_fmt
            })

        print(f"✅ Processados {len(itens)} produtos válidos da ALCA.")
        return itens
    except Exception as e:
        print(f"Erro ao raspar ALCA: {e}")
        return []

async def raspar_farmacia_damasceno(page):
    print("2. Realizando login na Vitrine da Farmacia Damasceno...")
    await page.goto("https://vitrine.sousistemas.com.br/farmaciadamasceno", wait_until="networkidle")
    await asyncio.sleep(2)

    entrar_btn = page.locator("button:has-text('Entrar'), a:has-text('Entrar')").first
    if await entrar_btn.is_visible():
        await entrar_btn.click()
        await asyncio.sleep(2)

        modal = page.locator("div.fixed.inset-0")
        email_field = modal.locator("input").first
        pass_field = modal.locator("input[type='password']").first

        if await email_field.is_visible() and await pass_field.is_visible():
            await email_field.fill(LOGIN_EMAIL)
            await pass_field.fill(LOGIN_PASSWORD)
            await pass_field.press("Enter")
            await asyncio.sleep(5)
            print("Login efetuado na Farmacia Damasceno!")

    for _ in range(7):
        await page.evaluate("window.scrollBy(0, 800)")
        await asyncio.sleep(1)

    cards_raw = await page.evaluate('''() => {
        const elementos = Array.from(document.querySelectorAll('div, article, section'));
        const blocosValidos = [];

        elementos.forEach(el => {
            const txt = el.innerText || "";
            if ((txt.includes("Genética:") || txt.includes("Full Spectrum") || txt.includes("GUMMIE") || txt.includes("CBD") || txt.includes("POMADA")) && txt.length < 1200) {
                if (!blocosValidos.some(b => b.includes(txt) || txt.includes(b))) {
                    blocosValidos.push(txt);
                }
            }
        });
        return blocosValidos;
    }''')

    print(f"Encontrados {len(cards_raw)} blocos de produtos logados na Damasceno.")
    itens_extraidos = []

    for txt in cards_raw:
        linhas = [l.strip() for l in txt.split('\n') if l.strip()]
        linhas_filtradas = [l for l in linhas if e_nome_valido(l)]
        if not linhas_filtradas:
            continue

        nome_raw = linhas_filtradas[0]
        nome_limpo = re.sub(r'[\u2600-\u27BF\U0001F300-\U0001F6FF\U0001F900-\U0001F9FF\U0001F680-\U0001F6FF]', '', nome_raw)
        nome_limpo = re.sub(r'\s*-\s*(THC|CBD)\s*$', '', nome_limpo, flags=re.IGNORECASE).strip()

        if not e_nome_valido(nome_limpo):
            continue

        categoria = determinar_categoria(nome_limpo, txt)
        slug = criar_slug(nome_limpo, categoria)

        m_preco = re.search(r'R\$\s*([\d\.]+)\s*-\s*([\d\.]+)', txt)
        if m_preco:
            p_min = f"R$ {float(m_preco.group(1)):.2f}".replace('.', ',')
            p_max = f"R$ {float(m_preco.group(2)):.2f}".replace('.', ',')
            preco_str = f"Instituto Damasceno: {p_min} (1g) | {p_max} (10g)"
        else:
            m_unico = re.search(r'R\$\s*([\d\.]+)', txt)
            if m_unico:
                p_val = f"R$ {float(m_unico.group(1)):.2f}".replace('.', ',')
                preco_str = f"Instituto Damasceno: {p_val}"
            else:
                preco_str = "Instituto Damasceno: Preço Sob Consulta"

        if "ESGOTADO" in txt.upper():
            preco_str += " (Esgotado)"

        genetica = "N/A"
        terpenos = "N/A"
        tipo = "N/A"

        m_gen = re.search(r'Genética:\s*([^→\n\(\)]+)', txt, re.IGNORECASE)
        if m_gen:
            genetica = m_gen.group(1).strip()
            
        m_terp = re.search(r'Terpeno dominante:\s*([^→\n\(\)]+)', txt, re.IGNORECASE)
        if m_terp:
            terpenos = m_terp.group(1).strip()

        if "Indica dominante" in txt or "Indica" in txt:
            tipo = "Indica Dominante"
        elif "Sativa dominante" in txt or "Sativa" in txt:
            tipo = "Sativa Dominante"
        elif "Híbrido" in txt or "híbrido" in txt or "Hibrida" in txt:
            tipo = "Hibrida"
        elif "Full Spectrum" in txt:
            tipo = "Full Spectrum"

        canabinoide = "CBD" if ("CBD" in nome_raw.upper() or "CBD" in txt) else "THC"
        perfil = " - ".join([l for l in linhas_filtradas[1:] if "R$" not in l])

        itens_extraidos.append({
            "ID Unico": slug,
            "Nome do Produto / Flor": nome_limpo,
            "Categoria": categoria,
            "Tipo / Subtipo": tipo,
            "Canabinoide Dominante": canabinoide,
            "% THC / Concentracao": "N/A",
            "% CBD / Concentracao": "N/A",
            "Linhagem Genetica": genetica,
            "Terpenos Dominantes": terpenos,
            "Perfil Aromatico & Sabor": perfil if perfil else nome_limpo,
            "Associacoes que Dispensam & Precos": preco_str
        })

    return itens_extraidos

def consolidar_e_desduplicar(lista_existente, lista_novos):
    mapa_canonico = {}
    todas = lista_existente + lista_novos

    for item in todas:
        nome = item["Nome do Produto / Flor"].strip()
        slug = item["ID Unico"]

        if not e_nome_valido(nome) or slug in INVALID_SLUGS:
            continue

        item["Categoria"] = determinar_categoria(nome, item["Perfil Aromatico & Sabor"])
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

            # Atualiza descrição se a existente contiver ruído
            if len(item["Perfil Aromatico & Sabor"]) > 10 and not any(noise in item["Perfil Aromatico & Sabor"].upper() for noise in ["DASHBOARD", "LUCAS RICARDO", "SHOPPING_CART"]):
                existente["Perfil Aromatico & Sabor"] = item["Perfil Aromatico & Sabor"]

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
    print(f"3. Consolidação canônica concluída: {len(resultado)} strains/produtos únicos salvos!")
    return resultado

async def main():
    print("🚀 Iniciando raspagem multi-associação (ALCA + Damasceno + Abrapango + Outros)...")
    
    dados_existentes = []
    if os.path.exists(CSV_PATH):
        with open(CSV_PATH, mode="r", encoding="utf-8-sig") as f:
            dados_existentes = list(csv.DictReader(f, delimiter=";"))

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        
        page_alca = await browser.new_page()
        novos_alca = await raspar_alca(page_alca)
        
        page_damasceno = await browser.new_page()
        novos_damasceno = await raspar_farmacia_damasceno(page_damasceno)
        
        await browser.close()

    novos_totais = novos_alca + novos_damasceno
    dados_finais = consolidar_e_desduplicar(dados_existentes, novos_totais)

    with open(CSV_PATH, mode="w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(f, fieldnames=FIELDS, delimiter=";")
        writer.writeheader()
        writer.writerows(dados_finais)
    print(f"✅ CSV local salvo em: {CSV_PATH}")

    print("4. Sincronizando com o Google Sheets...")
    rows = [FIELDS]
    for item in dados_finais:
        rows.append([item[f] for f in FIELDS])

    res = requests.post(GOOGLE_WEBAPP_URL, json=rows, allow_redirects=True)
    if res.status_code == 200 and "OK" in res.text:
        print("🎉 SUCESSO! Google Sheets online atualizado com produtos da ALCA, Damasceno e Abrapango!")
    else:
        print(f"Status Google Sheets: {res.status_code}")

if __name__ == "__main__":
    asyncio.run(main())
