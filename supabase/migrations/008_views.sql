-- Task 8: Vues classement et participants publics

-- v_classement_match : classement provisoire avec rangs sans exposer l'issue
CREATE VIEW v_classement_match AS
SELECT
  r.match_id,
  r.participant_id,
  p.nom,
  p.prenom,
  p.numero,
  r.score,
  r.rang_departage,
  ROW_NUMBER() OVER (
    PARTITION BY r.match_id
    ORDER BY r.score DESC, r.rang_departage ASC NULLS LAST
  )::SMALLINT AS rang_provisoire,
  COUNT(*) OVER (
    PARTITION BY r.match_id, r.score, r.rang_departage
  ) > 1 AS est_egalite,
  r.created_at,
  r.updated_at
FROM resultats r
JOIN participants p ON r.participant_id = p.id;

-- v_participants_publics : participants publiés, pas de données sensibles
CREATE VIEW v_participants_publics AS
SELECT
  p.id,
  p.numero,
  p.nom,
  p.prenom,
  p.etablissement,
  p.classe_niveau,
  p.photo_path,
  p.statut
FROM participants p
WHERE p.publie = true;
