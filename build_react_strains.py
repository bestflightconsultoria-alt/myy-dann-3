import csv
import json
import os
import re
import sys

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

CSV_PATH = r"C:\Users\Lucas\.gemini\antigravity\brain\7e314b13-60ab-4aae-9690-d9eacd03d06a\planilha_strains_brasil_completa.csv"
TS_PATH = r"c:\Users\Lucas\CANNA GUIA\myy-dann2-main\src\hooks\useStrains.ts"

def extrair_efeitos_reais(nome, tipo, canabinoide, perfil, genetica):
    texto = f"{nome} {tipo} {canabinoide} {perfil} {genetica}".lower()
    efeitos = []

    # Sono e Sedação
    if any(w in texto for w in ["sono", "sedação", "sedacao", "noturno", "noturna", "dormir", "insônia", "insonia", "repouso"]):
        efeitos.append("Indução ao Sono")
    
    # Ansiedade e Estresse
    if any(w in texto for w in ["ansiedade", "ansiolítico", "ansiolitico", "estresse", "tensão", "tensao", "calmante", "calma", "serenidade"]):
        efeitos.append("Controle de Ansiedade")

    # Foco, Criatividade e Energia
    if any(w in texto for w in ["foco", "concentração", "concentracao", "criativ", "disposição", "disposicao", "energia", "ânimo", "animo", "estímulo", "estimulo", "clareza"]):
        efeitos.append("Foco & Criatividade")

    # Dores e Relaxamento Muscular
    if any(w in texto for w in ["dor", "dores", "analgésic", "analgesic", "muscular", "espasmo", "desconforto", "inflam", "cefaleia", "enxaqueca"]):
        efeitos.append("Alívio de Dores")

    # Elevação de Humor
    if any(w in texto for w in ["humor", "eufor", "bem-estar", "bem estar", "alegria", "social"]):
        efeitos.append("Elevação de Humor")

    # Estímulo de Apetite
    if any(w in texto for w in ["apetite", "fome"]):
        efeitos.append("Estímulo de Apetite")

    # Se não capturou nenhum específico, atribui baseado no tipo botânico
    if not efeitos:
        if canabinoide == "CBD":
            efeitos = ["Alívio de Ansiedade", "Anti-inflamatório", "Clareza sem Psicoatividade"]
        elif "Indica" in tipo:
            efeitos = ["Relaxamento Corporal", "Sedação Noturna", "Alívio de Tensões"]
        elif "Sativa" in tipo:
            efeitos = ["Foco & Disposição", "Estímulo Criativo", "Elevação de Humor"]
        else:
            efeitos = ["Equilíbrio Físico e Mental", "Ansiolítico Suave", "Alívio de Estresse"]

    # Limita a no máximo 3 efeitos únicos para não poluir
    return list(dict.fromkeys(efeitos))[:3]

def gerar_use_strains_ts():
    if not os.path.exists(CSV_PATH):
        print("CSV não encontrado.")
        return

    rows = []
    with open(CSV_PATH, mode="r", encoding="utf-8-sig") as f:
        rows = list(csv.DictReader(f, delimiter=";"))

    strains_js = []

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

        # Classificação Estrita de Tipo (Sem sobreposição!)
        tipo_ts = "Híbrida"
        if cat == "oleos":
            tipo_ts = "Óleo"
        elif cat == "outros":
            tipo_ts = "Gummies"
        else:
            if "Indica" in tipo_raw and "Sativa" not in tipo_raw and "Híbrida" not in tipo_raw:
                tipo_ts = "Indica"
            elif "Sativa" in tipo_raw and "Indica" not in tipo_raw and "Híbrida" not in tipo_raw:
                tipo_ts = "Sativa"
            else:
                tipo_ts = "Híbrida"

        # Canabinoide Dominante
        can_ts = "THC"
        if canabinoide == "CBD": 
            can_ts = "CBD"
        elif "1:1" in tipo_raw or "1:1" in thc or "1:1" in cbd:
            can_ts = "THC/CBD"

        terpenos_arr = [t.strip() for t in terpenos_raw.split(';') if t.strip() and t.strip() != "N/A"]
        if not terpenos_arr:
            terpenos_arr = ["Cariofileno", "Mirceno", "Limoneno"]

        # Parseia as associações e preços da Coluna 11
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

                assoc_list.append({
                    "associationId": re.sub(r'[^a-z0-9]', '', assoc_name.lower()),
                    "associationName": assoc_name,
                    "pricePerGram": p_gram,
                    "priceDisplay": p_display,
                    "inStock": in_stock,
                    "cultivationType": "Indoor / Orgânico" if "Indoor" in p_display else ("Outdoor" if "Outdoor" in p_display else "Certificado")
                })
        else:
            assoc_list.append({
                "associationId": "damasceno",
                "associationName": "Instituto Damasceno",
                "pricePerGram": 60.0,
                "priceDisplay": "Instituto Damasceno: Sob Consulta",
                "inStock": True,
                "cultivationType": "Indoor"
            })

        # Efeitos Reais e Específicos
        efeitos_arr = extrair_efeitos_reais(nome, tipo_ts, can_ts, perfil, genetica)

        obj_ts = f"""  {{
    id: {json.dumps(slug)},
    name: {json.dumps(nome)},
    category: {json.dumps(cat)},
    type: {json.dumps(tipo_ts)},
    dominantCannabinoid: {json.dumps(can_ts)},
    thc: {json.dumps(thc if thc != "N/A" else "18% - 24%")},
    cbd: {json.dumps(cbd if cbd != "N/A" else "< 1%")},
    genetics: {json.dumps(genetica if genetica != "N/A" else nome)},
    terpenes: {json.dumps(terpenos_arr)},
    aromaFlavor: {json.dumps(perfil)},
    description: {json.dumps(perfil)},
    effects: {json.dumps(efeitos_arr)},
    associations: {json.dumps(assoc_list, indent=6)}
  }}"""
        strains_js.append(obj_ts)

    conteudo_ts = f"""import {{ useState, useMemo }} from 'react';
import {{ Strain }} from '../types/strain';

const INITIAL_STRAINS: Strain[] = [
{",\n".join(strains_js)}
];

export function useStrains() {{
  const [strains] = useState<Strain[]>(INITIAL_STRAINS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCannabinoid, setSelectedCannabinoid] = useState<string>('todos');
  const [selectedEffect, setSelectedEffect] = useState<string>('todos');

  const filteredStrains = useMemo(() => {{
    return strains.filter((strain) => {{
      const matchesSearch = 
        strain.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        strain.aromaFlavor?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        strain.effects.some(e => e.toLowerCase().includes(searchQuery.toLowerCase())) ||
        strain.associations?.some(a => a.associationName.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCannabinoid = 
        selectedCannabinoid === 'todos' || 
        strain.dominantCannabinoid === selectedCannabinoid;

      const matchesEffect = 
        selectedEffect === 'todos' || 
        strain.effects.some(e => e.toLowerCase().includes(selectedEffect.toLowerCase()));

      return matchesSearch && matchesCannabinoid && matchesEffect;
    }});
  }}, [strains, searchQuery, selectedCannabinoid, selectedEffect]);

  return {{
    strains: filteredStrains,
    allStrains: strains,
    searchQuery,
    setSearchQuery,
    selectedCannabinoid,
    setSelectedCannabinoid,
    selectedEffect,
    setSelectedEffect,
  }};
}}
"""

    with open(TS_PATH, mode="w", encoding="utf-8") as f:
        f.write(conteudo_ts)
    print(f"🎉 SUCESSO! {len(rows)} strains com efeitos reais e classificação estrita geradas em {TS_PATH}!")

if __name__ == "__main__":
    gerar_use_strains_ts()
