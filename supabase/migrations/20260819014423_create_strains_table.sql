/*
# Create strains table (single-tenant, public catalog)

1. New Tables
- `strains`
  - `id` (uuid, primary key)
  - `name` (text, not null) — strain name
  - `type` (text, not null) — Sativa / Indica / Híbrida
  - `thc` (text, not null) — THC percentage label e.g. "18%"
  - `cbd` (text, not null) — CBD percentage label e.g. "1%"
  - `rating` (numeric, default 0) — user rating 0-5
  - `effects` (text[], default '{}') — list of effects
  - `terpenes` (text[], default '{}') — list of terpenes
  - `usage_profiles` (text[], default '{}') — therapeutic use tags
  - `association` (text) — distributing association name
  - `city` (text) — city/state of the association
  - `description` (text) — strain description
  - `created_at` (timestamptz, default now())
2. Security
- Enable RLS on `strains`.
- Allow anon + authenticated read (public catalog).
- Allow anon + authenticated insert/update/delete so the catalog can be managed.
3. Seed Data
- Inserts 4 initial strains (Tangie, Northern Lights, Harlequin, Jack Herer).
*/

CREATE TABLE IF NOT EXISTS strains (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL,
  thc text NOT NULL,
  cbd text NOT NULL,
  rating numeric(2,1) NOT NULL DEFAULT 0,
  effects text[] NOT NULL DEFAULT '{}',
  terpenes text[] NOT NULL DEFAULT '{}',
  usage_profiles text[] NOT NULL DEFAULT '{}',
  association text,
  city text,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE strains ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_strains" ON strains;
CREATE POLICY "anon_select_strains" ON strains FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_strains" ON strains;
CREATE POLICY "anon_insert_strains" ON strains FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_strains" ON strains;
CREATE POLICY "anon_update_strains" ON strains FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_strains" ON strains;
CREATE POLICY "anon_delete_strains" ON strains FOR DELETE
  TO anon, authenticated USING (true);

-- Seed data (idempotent: only insert if table is empty)
INSERT INTO strains (name, type, thc, cbd, rating, effects, terpenes, usage_profiles, association, city, description)
SELECT * FROM (VALUES
  ('Tangie', 'Sativa', '18%', '< 1%', 4.8, ARRAY['Foco','Criatividade','Energia'], ARRAY['Limoneno','Mirceno'], ARRAY['Estudo','Criatividade','Disposição'], 'Associação BH Medicinal', 'Belo Horizonte - MG', 'Sabor cítrico marcante. Ideal para tarefas intelectuais diurnas sem provocar sonolência.'),
  ('Northern Lights', 'Indica', '16%', '1%', 4.9, ARRAY['Relaxamento','Sono','Alívio muscular'], ARRAY['Mirceno','Cariofileno'], ARRAY['Sono','Dor Crônica','Relaxamento'], 'Abrace Esperança', 'João Pessoa - PB', 'Altamente sedativa e relaxante. Excelente para o final da noite e manejo de insônia severa.'),
  ('Harlequin (1:1)', 'Híbrida', '6%', '10%', 4.7, ARRAY['Alívio de dor','Sem euforia','Clareza'], ARRAY['Cariofileno','Pineno'], ARRAY['Dor Crônica','Ansiedade','Estudo'], 'Santa Cannabis', 'Florianópolis - SC', 'Relação equilibrada de CBD/THC. Oferece analgesia e foco sem efeitos psicoativos intensos.'),
  ('Jack Herer', 'Sativa', '19%', '< 1%', 4.9, ARRAY['Clareza Mental','Motivação','Bem-estar'], ARRAY['Terpinoleno','Pineno'], ARRAY['Estudo','Criatividade','Foco'], 'Associação BH Medicinal', 'Belo Horizonte - MG', 'Uma das genéticas mais consagradas para manter a clareza e atenção ao longo do dia.')
) AS v(name, type, thc, cbd, rating, effects, terpenes, usage_profiles, association, city, description)
WHERE NOT EXISTS (SELECT 1 FROM strains);
