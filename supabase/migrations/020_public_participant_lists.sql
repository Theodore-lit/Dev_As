CREATE OR REPLACE VIEW v_participants_publics AS
SELECT
  p.id,
  p.numero,
  p.nom,
  p.prenom,
  p.etablissement,
  p.classe_niveau,
  p.photo_path,
  p.statut,
  p.edition_id
FROM participants p
WHERE p.publie = true;

CREATE VIEW v_candidatures_publiques AS
SELECT
  c.id,
  c.edition_id,
  c.nom,
  c.prenom,
  c.etablissement,
  c.classe_niveau,
  c.statut,
  c.created_at
FROM candidatures c
WHERE NOT EXISTS (
  SELECT 1
  FROM participants p
  WHERE p.candidature_id = c.id
    AND p.publie = true
);

GRANT SELECT ON TABLE v_participants_publics, v_candidatures_publiques TO anon, authenticated;
