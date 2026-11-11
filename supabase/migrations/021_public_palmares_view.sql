CREATE VIEW v_palmares_publics AS
SELECT
  e.id AS edition_id,
  e.annee AS edition_annee,
  e.nom AS edition_nom,
  cf.rang,
  cf.titre,
  p.id AS participant_id,
  p.nom AS participant_nom,
  p.prenom AS participant_prenom,
  p.numero AS participant_numero,
  p.etablissement AS participant_etablissement,
  p.classe_niveau AS participant_classe
FROM classements_finaux cf
JOIN editions e ON e.id = cf.edition_id
JOIN participants p ON p.id = cf.participant_id
WHERE e.statut IN ('terminee'::statut_edition, 'archivee'::statut_edition);

GRANT SELECT ON TABLE v_palmares_publics TO anon, authenticated;
