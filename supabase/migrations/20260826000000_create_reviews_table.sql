/*
# Criar Tabela de Avaliações (reviews) no Supabase

1. Tabela: `reviews`
   - `id` (uuid, primary key)
   - `strain_id` (text, not null)
   - `strain_name` (text, not null)
   - `association_id` (text)
   - `association_name` (text)
   - `rating` (numeric, not null)
   - `patient_name` (text)
   - `conditions` (text[])
   - `positive_effects` (text[])
   - `side_effects` (text[])
   - `comment` (text)
   - `is_verified` (boolean)
   - `created_at` (timestamptz, default now())

2. Segurança RLS (Row Level Security)
   - Leitura pública (anon + authenticated) para exibir no site e alimentar a IA.
   - Inserção pública (anon + authenticated) para qualquer paciente publicar avaliação.
*/

CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  strain_id text NOT NULL,
  strain_name text NOT NULL,
  association_id text,
  association_name text,
  rating numeric(2,1) NOT NULL DEFAULT 5.0,
  patient_name text DEFAULT 'Paciente Anônimo',
  conditions text[] DEFAULT '{}',
  positive_effects text[] DEFAULT '{}',
  side_effects text[] DEFAULT '{}',
  comment text,
  is_verified boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_reviews" ON reviews;
CREATE POLICY "anon_select_reviews" ON reviews FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_reviews" ON reviews;
CREATE POLICY "anon_insert_reviews" ON reviews FOR INSERT
  TO anon, authenticated WITH CHECK (true);
