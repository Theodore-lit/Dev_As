CREATE TABLE edition_calendrier (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  edition_id UUID NOT NULL REFERENCES editions(id) ON DELETE CASCADE,
  ordre SMALLINT NOT NULL CHECK (ordre > 0),
  date_match DATE NOT NULL,
  horaire TEXT NOT NULL,
  intitule TEXT NOT NULL,
  precision TEXT,
  repere TEXT,
  repere_date_fin DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE (edition_id, ordre)
);

GRANT SELECT ON edition_calendrier TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON edition_calendrier TO authenticated;

CREATE INDEX idx_edition_calendrier_date
  ON edition_calendrier(edition_id, date_match, ordre);

CREATE TRIGGER trg_update_updated_at_edition_calendrier
BEFORE UPDATE ON edition_calendrier
FOR EACH ROW
EXECUTE FUNCTION fn_update_updated_at();

ALTER TABLE edition_calendrier ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Calendrier des éditions public"
ON edition_calendrier FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Admin gere le calendrier des editions"
ON edition_calendrier FOR ALL
TO authenticated
USING (est_admin())
WITH CHECK (est_admin());

INSERT INTO edition_calendrier (
  edition_id,
  ordre,
  date_match,
  horaire,
  intitule,
  precision,
  repere,
  repere_date_fin
)
SELECT
  e.id,
  schedule.ordre,
  schedule.date_match,
  schedule.horaire,
  schedule.intitule,
  schedule.precision,
  schedule.repere,
  schedule.repere_date_fin
FROM editions e
CROSS JOIN (
  VALUES
    (1, DATE '2026-11-26', '12h30 – 13h30', 'Première qualification', 'Groupe A', 'Première qualification · 30 candidats', NULL::DATE),
    (2, DATE '2026-11-26', '18h30 – 19h30', 'Première qualification', 'Groupe B', NULL, NULL::DATE),
    (3, DATE '2026-11-30', '18h30 – 19h30', 'Barrage', '10 candidats', 'Barrage · 10 candidats', NULL::DATE),
    (4, DATE '2026-12-01', '12h30 – 13h30', 'Deuxième qualification', 'Groupe A', 'Deuxième qualification · 26 candidats', NULL::DATE),
    (5, DATE '2026-12-01', '18h30 – 19h30', 'Deuxième qualification', 'Groupe B', NULL, NULL::DATE),
    (6, DATE '2026-12-03', '12h30 – 13h30', 'Troisième qualification', 'Groupe B', 'Troisième qualification · 20 candidats', NULL::DATE),
    (7, DATE '2026-12-03', '18h30 – 19h30', 'Troisième qualification', 'Groupe A', NULL, NULL::DATE),
    (8, DATE '2026-12-07', '18h30 – 19h30', 'Tour 1', 'Phase principale', 'Phase principale · 16 candidats au départ', DATE '2026-12-17'),
    (9, DATE '2026-12-08', '18h30 – 19h30', 'Tour 2', 'Phase principale', NULL, NULL::DATE),
    (10, DATE '2026-12-10', '18h30 – 19h30', 'Seizième de finale', 'Phase principale', NULL, NULL::DATE),
    (11, DATE '2026-12-11', '18h30 – 19h30', 'Huitième de finale', 'Phase principale', NULL, NULL::DATE),
    (12, DATE '2026-12-14', '18h30 – 19h30', 'Quart de finale', 'Phase principale', NULL, NULL::DATE),
    (13, DATE '2026-12-17', '18h30 – 19h30', 'Demi-finale', 'Phase principale', NULL, NULL::DATE),
    (14, DATE '2026-12-19', 'À confirmer', 'Grande finale', 'Finale', 'Grande finale · 2 finalistes · 1 DevChampion', NULL::DATE)
) AS schedule(ordre, date_match, horaire, intitule, precision, repere, repere_date_fin)
WHERE e.annee = 2026
ON CONFLICT (edition_id, ordre) DO UPDATE SET
  date_match = EXCLUDED.date_match,
  horaire = EXCLUDED.horaire,
  intitule = EXCLUDED.intitule,
  precision = EXCLUDED.precision,
  repere = EXCLUDED.repere,
  repere_date_fin = EXCLUDED.repere_date_fin,
  updated_at = NOW();

UPDATE editions e
SET
  date_debut = dates.date_debut,
  date_fin = dates.date_fin,
  updated_at = NOW()
FROM (
  SELECT
    edition_id,
    MIN(date_match)::TIMESTAMP AT TIME ZONE 'Africa/Porto-Novo' AS date_debut,
    ((MAX(date_match) + 1)::TIMESTAMP AT TIME ZONE 'Africa/Porto-Novo') - INTERVAL '1 second' AS date_fin
  FROM edition_calendrier
  GROUP BY edition_id
) AS dates
WHERE e.id = dates.edition_id
  AND e.annee = 2026;
