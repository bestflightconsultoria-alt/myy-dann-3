/*
# Create associations table and link strains

1. New Tables
- `associations`
  - `id` (text, primary key) — slug identifier e.g. "abm-mg"
  - `name` (text, not null) — full association name
  - `acronym` (text, not null) — short acronym
  - `state` (text, not null) — Brazilian state code e.g. "MG"
  - `city` (text, not null) — city name
  - `focus` (text[], default '{}') — areas of focus/specialty
  - `website` (text) — optional website URL
  - `instagram` (text) — optional Instagram handle
  - `description` (text) — description of the association
  - `created_at` (timestamptz, default now())
2. Modified Tables
- `strains`: add `association_id` (text, nullable, references associations.id)
  - Backfill existing strains to point at the correct association rows
3. Security
- Enable RLS on `associations`.
- Allow anon + authenticated CRUD (public directory, single-tenant app).
4. Seed Data
- Inserts the full Brazilian medical cannabis associations directory.
*/

CREATE TABLE IF NOT EXISTS associations (
  id text PRIMARY KEY,
  name text NOT NULL,
  acronym text NOT NULL,
  state text NOT NULL,
  city text NOT NULL,
  focus text[] NOT NULL DEFAULT '{}',
  website text,
  instagram text,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE strains ADD COLUMN IF NOT EXISTS association_id text REFERENCES associations(id) ON DELETE SET NULL;

ALTER TABLE associations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_associations" ON associations;
CREATE POLICY "anon_select_associations" ON associations FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_associations" ON associations;
CREATE POLICY "anon_insert_associations" ON associations FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_associations" ON associations;
CREATE POLICY "anon_update_associations" ON associations FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_associations" ON associations;
CREATE POLICY "anon_delete_associations" ON associations FOR DELETE
  TO anon, authenticated USING (true);

-- Seed the full associations directory (idempotent via ON CONFLICT)
INSERT INTO associations (id, name, acronym, state, city, focus, website, instagram, description) VALUES
  (
    'abm-mg',
    'Associação BH Medicinal',
    'ABM',
    'MG',
    'Belo Horizonte',
    ARRAY['Flores Medicinais', 'Óleo Full Spectrum', 'Acolhimento'],
    'https://bhmedicinal.org.br',
    '@bhmedicinal',
    'Referência no acolhimento a pacientes e fornecimento terapêutico em Belo Horizonte e região metropolitana.'
  ),
  (
    'amem-mg',
    'AMEM Cannabis',
    'AMEM',
    'MG',
    'Belo Horizonte',
    ARRAY['Óleos Terapêuticos', 'Orientação ao Paciente'],
    NULL,
    '@amemcannabis',
    'Associação mineira com foco em orientação médica, jurídica e facilitação de acesso ao tratamento.'
  ),
  (
    'abrace-pb',
    'Abrace Esperança',
    'ABRACE',
    'PB',
    'João Pessoa',
    ARRAY['Óleos Variados', 'Pomadas', 'Atendimento Nacional'],
    'https://abraceesperanca.org.br',
    '@abraceesperanca',
    'Primeira associação do Brasil com autorização definitiva para cultivo e produção em larga escala.'
  ),
  (
    'apepi-rj',
    'APEPI',
    'APEPI',
    'RJ',
    'Rio de Janeiro',
    ARRAY['Óleos CBD/THC', 'Pesquisa', 'Fazenda Legalizada'],
    'https://apepi.org',
    '@apepioficial',
    'Pioneira em pesquisa e produção medicinal no RJ, com cultivo próprio certificado.'
  ),
  (
    'santa-cannabis-sc',
    'Santa Cannabis',
    'Santa Cannabis',
    'SC',
    'Florianópolis',
    ARRAY['Flores', 'Óleos Full Spectrum', 'Atendimento Nacional'],
    'https://santacannabis.com.br',
    '@santacannabis',
    'Associação catarinense com cultivo próprio e fornecimento de flores e óleos full spectrum para pacientes de todo o Brasil.'
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  acronym = EXCLUDED.acronym,
  state = EXCLUDED.state,
  city = EXCLUDED.city,
  focus = EXCLUDED.focus,
  website = EXCLUDED.website,
  instagram = EXCLUDED.instagram,
  description = EXCLUDED.description;

-- Backfill existing strains to link to associations by name
UPDATE strains SET association_id = 'abm-mg' WHERE association = 'Associação BH Medicinal' AND association_id IS NULL;
UPDATE strains SET association_id = 'abrace-pb' WHERE association = 'Abrace Esperança' AND association_id IS NULL;
UPDATE strains SET association_id = 'santa-cannabis-sc' WHERE association = 'Santa Cannabis' AND association_id IS NULL;

CREATE INDEX IF NOT EXISTS idx_strains_association_id ON strains(association_id);
CREATE INDEX IF NOT EXISTS idx_associations_state ON associations(state);
