---
name: strain-catalog-extractor
description: >-
  Coleta, extração, estruturação e automação de dados de catálogo de medicamentos e strains de associações de cannabis medicinal no Brasil (ex: Farmácia Damasceno / Instituto Damasceno, Abrapango, Liva, CannabCura).
  Use esta skill sempre que o usuário solicitar a extração, atualização automática, adição de novas strains ou exportação de tabelas/planilhas em CSV/Excel no esquema padronizado de 11 colunas.
---

# Strain Catalog Extractor & Automação

Esta skill define o procedimento padrão para extrair, categorizar, enriquecer e estruturar dados de produtos e strains de associações de cannabis medicinal do Brasil (com foco na **Farmácia Damasceno** e **Abrapango**), gerando tabelas unificadas no esquema de 11 colunas compatível com Google Sheets e Excel.

---

## 1. Esquema Padronizado das 11 Colunas

Todas as tabelas de strains e produtos devem seguir estritamente as colunas abaixo:

1. **`ID Unico`**: Identificador slug minúsculo e único (ex: `strain-24k`, `strain-bubba-kush`, `strain-manga-rosa`).
2. **`Nome do Produto / Flor`**: Nome comercial da strain ou do produto (limpo de sufixos como `- THC`, `- CBD` ou emojis).
3. **`Categoria`**: Categoria simplificada (`flores`, `oleos`, `outros`).
4. **`Tipo / Subtipo`**: (`Indica Dominante`, `Sativa Dominante`, `Hibrida`, `Full Spectrum`, `Equilibrado 1:1`).
5. **`Canabinoide Dominante`**: (`THC`, `CBD`, `THC/CBD`, `CBN`).
6. **`% THC / Concentracao`**: Porcentagem ou dosagem de THC (ex: `18% - 24%` ou `25mg/ml`).
7. **`% CBD / Concentracao`**: Porcentagem ou dosagem de CBD (ex: `< 1%` ou `3000mg`).
8. **`Linhagem Genetica`**: Cruzamento genético (ex: `Bubba Kush pré-98 x Bubba Kush pré-98`, `Oreoz x Biscotti`).
9. **`Terpenos Dominantes`**: Terpenos principais separados por ponto e vírgula (ex: `Mirceno; Cariofileno; Limoneno`).
10. **`Perfil Aromatico & Sabor & Efeitos Terapêuticos`**: Perfil de aroma/sabor unido com os efeitos terapêuticos e indicações medicinais.
11. **`Associacoes que Dispensam & Precos`**: Relação de associações e valores (ex: `Instituto Damasceno: R$ 60,00 (1g) | R$ 400,00 (10g); Abrapango: R$ 500,00 (10g)`).

---

## 2. Regras de Normalização Canônica e Desduplicação Estrita

* **Identificação de Strains Idênticas:** Nomes como `Gorila Freak` e `Gorila Freak - THC`, `24K` e `24K Gold`, `Bubba Kush ☕` e `Bubba Kush - THC` são reconhecidos como a **mesma strain física**.
* **Remoção de Sufixos e Emojis:** Ao gerar a Chave Canônica, são removidos emojis e sufixos como `- THC`, `- CBD`, `Inflorescências`, etc.
* **Unificação na Mesma Linha:** Se a strain já existir na tabela vinda de outra associação, a nova associação e seu valor são concatenados na coluna `Associacoes que Dispensam & Precos`, mantendo **apenas 1 linha por strain**.

---

## 3. Automação e Sincronização com o Google Drive

1. **Automação de Coleta (`atualizar_catalogo.py`):** Utiliza o Playwright para efetuar login automático e extrair os preços reais e disponibilidade.
2. **Sincronização Online:** O script envia o array JSON das 11 colunas diretamente para a URL do Web App do Google Apps Script (`script.google.com/macros/s/.../exec`), atualizando a planilha do Google Drive em tempo real.
