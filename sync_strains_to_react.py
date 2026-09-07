import csv
import json
import os
import re
import sys

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

CSV_PATH = r"C:\Users\Lucas\.gemini\antigravity\brain\7e314b13-60ab-4aae-9690-d9eacd03d06a\planilha_strains_brasil_completa.csv"
DATA_TS_PATH = r"c:\Users\Lucas\CANNA GUIA\myy-dann2-main\src\data\strainsData.ts"

def extrair_efeitos_reais(nome, tipo, canabinoide, perfil, genetica, cat):
    nome_lower = nome.lower()
    
    if "pomada" in nome_lower or "tópico" in nome_lower or "topico" in nome_lower:
        return ["Alívio de Dores Locais", "Ação Anti-inflamatória", "Conforto Muscular"]

    if "hash" in nome_lower or "dry sift" in nome_lower or "concentrado" in nome_lower:
        return ["Alta Potência THCA", "Relaxamento Profundo", "Rápida Ação Terapêutica"]

    if "gummies" in nome_lower or "gummy" in nome_lower or "goma" in nome_lower:
        if "sono" in nome_lower or "cbn" in nome_lower:
            return ["Indução ao Sono Profundo", "Sem Ressaca Diurna", "Relaxamento Mental"]
        return ["Espectro Completo", "Dosagem Padronizada", "Conveniência Terapêutica"]

    if cat == "oleos":
        if "1:1" in nome_lower or "balanced" in nome_lower:
            return ["Manejo de Dores Neuropáticas", "Relaxamento Neuromuscular", "Melhora do Sono"]
        return ["Anti-inflamatório Sistêmico", "Modulação de Ansiedade", "Equilíbrio do Humor"]

    texto = f"{nome} {tipo} {canabinoide} {perfil} {genetica}".lower()
    efeitos = []

    if any(w in texto for w in ["sono", "sedação", "sedacao", "noturno", "noturna", "dormir", "insônia", "insonia", "repouso"]):
        efeitos.append("Indução ao Sono")
    if any(w in texto for w in ["ansiedade", "ansiolítico", "ansiolitico", "estresse", "tensão", "tensao", "calmante", "calma", "serenidade"]):
        efeitos.append("Controle de Ansiedade")
    if any(w in texto for w in ["foco", "concentração", "concentracao", "criativ", "disposição", "disposicao", "energia", "ânimo", "animo", "estímulo", "estimulo", "clareza"]):
        efeitos.append("Foco & Criatividade")
    if any(w in texto for w in ["dor", "dores", "analgésic", "analgesic", "muscular", "espasmo", "desconforto", "inflam", "cefaleia", "enxaqueca"]):
        efeitos.append("Alívio de Dores")
    if any(w in texto for w in ["humor", "eufor", "bem-estar", "bem estar", "alegria", "social"]):
        efeitos.append("Elevação de Humor")
    if any(w in texto for w in ["apetite", "fome"]):
        efeitos.append("Estímulo de Apetite")

    if not efeitos:
        if canabinoide == "CBD":
            efeitos = ["Alívio de Ansiedade", "Anti-inflamatório", "Clareza sem Psicoatividade"]
        elif "Indica" in tipo:
            efeitos = ["Relaxamento Corporal", "Sedação Noturna", "Alívio de Tensões"]
        elif "Sativa" in tipo:
            efeitos = ["Foco & Disposição", "Estímulo Criativo", "Elevação de Humor"]
        else:
            efeitos = ["Equilíbrio Físico e Mental", "Ansiolítico Suave", "Alívio de Estresse"]

    return list(dict.fromkeys(efeitos))[:3]

def sync_to_react():
    if not os.path.exists(CSV_PATH):
        print(f"Erro: Arquivo CSV {CSV_PATH} não encontrado.")
        return

    rows = []
    with open(CSV_PATH, mode="r", encoding="utf-8-sig") as f:
        rows = list(csv.DictReader(f, delimiter=";"))

    strains_list = []

    for r in rows:
        slug = r["ID Unico"]
        nome = r["Nome do Produto / Flor"].strip()
        cat = r["Categoria"].strip()
        tipo_raw = r["Tipo / Subtipo"].strip()
        canabinoide = r["Canabinoide Dominante"].strip()
        thc = r["% THC / Concentracao"].strip()
        cbd = r["% CBD / Concentracao"].strip()
        genetica = r["Linhagem Genetica"].strip()
        terpenos_raw = r["Terpenos Dominantes"].strip()
        perfil = r["Perfil Aromatico & Sabor"].strip()
        precos_raw = r["Associacoes que Dispensam & Precos"].strip()

        nome_lower = nome.lower()

        tipo_ts = "Híbrida"
        if cat == "oleos":
            tipo_ts = "Óleo"
        elif cat == "outros":
            if "pomada" in nome_lower:
                tipo_ts = "Pomadas"
            elif "hash" in nome_lower or "dry sift" in nome_lower:
                tipo_ts = "Concentrados"
            else:
                tipo_ts = "Gummies"
        else:
            if "Indica" in tipo_raw and "Sativa" not in tipo_raw and "Híbrida" not in tipo_raw:
                tipo_ts = "Indica"
            elif "Sativa" in tipo_raw and "Indica" not in tipo_raw and "Híbrida" not in tipo_raw:
                tipo_ts = "Sativa"
            else:
                tipo_ts = "Híbrida"

        can_ts = "THC"
        if canabinoide == "CBD" or "cbd" in nome_lower: 
            can_ts = "CBD"
        if "1:1" in tipo_raw or "1:1" in thc or "1:1" in cbd or "1:1" in nome_lower:
            can_ts = "THC/CBD"

        terpenos_arr = [t.strip() for t in terpenos_raw.split(';') if t.strip() and t.strip() != "N/A"]
        if not terpenos_arr:
            terpenos_arr = ["Cariofileno", "Mirceno", "Limoneno"]

        assoc_list = []
        if precos_raw and precos_raw != "N/A":
            for o in precos_raw.split(';'):
                o = o.strip()
                if not o: continue
                
                parts = o.split(':')
                assoc_name = parts[0].strip()
                p_display = parts[1].strip() if len(parts) > 1 else o
                
                p_gram = 60.0
                m_num = re.search(r'R\$\s*([\d\.\,]+)', p_display)
                if m_num:
                    try:
                        p_gram = float(m_num.group(1).replace('.', '').replace(',', '.'))
                    except:
                        pass

                in_stock = "Esgotado" not in p_display
                cultivation = "Padronizado"
                if "Indoor" in p_display:
                    cultivation = "Indoor / Orgânico"
                elif "Outdoor" in p_display:
                    cultivation = "Outdoor"
                elif "Greenhouse" in p_display:
                    cultivation = "Greenhouse"

                assoc_list.append({
                    "associationId": re.sub(r'[^a-z0-9]', '', assoc_name.lower()),
                    "associationName": assoc_name,
                    "pricePerGram": p_gram,
                    "priceDisplay": p_display,
                    "inStock": in_stock,
                    "cultivationType": cultivation
                })
        else:
            assoc_list.append({
                "associationId": "institutodamasceno",
                "associationName": "Instituto Damasceno",
                "pricePerGram": 60.0,
                "priceDisplay": "R$ 60,00 (1g) | R$ 400,00 (10g)",
                "inStock": True,
                "cultivationType": "Padronizado"
            })

        efeitos_arr = extrair_efeitos_reais(nome, tipo_ts, can_ts, perfil, genetica, cat)

        strain_obj = {
            "id": slug,
            "name": nome,
            "category": cat,
            "type": tipo_ts,
            "dominantCannabinoid": can_ts,
            "thc": thc if thc != "N/A" else ("18% - 24%" if cat == "flores" else None),
            "cbd": cbd if cbd != "N/A" else ("< 1%" if cat == "flores" else None),
            "genetics": genetica if genetica != "N/A" else nome,
            "terpenes": terpenos_arr,
            "aromaFlavor": perfil,
            "description": perfil,
            "effects": efeitos_arr,
            "associations": assoc_list
        }
        # Remove chaves com None
        strain_obj = {k: v for k, v in strain_obj.items() if v is not None}
        strains_list.append(strain_obj)

    conteudo_ts = f"""import {{ Strain }} from '../types/strain';

export const INITIAL_STRAINS: Strain[] = {json.dumps(strains_list, ensure_ascii=False, indent=2)};
"""

    with open(DATA_TS_PATH, mode="w", encoding="utf-8") as f:
        f.write(conteudo_ts)

    print(f"🎉 SUCESSO! {len(strains_list)} strains sincronizadas em {DATA_TS_PATH}!")

if __name__ == "__main__":
    sync_to_react()
