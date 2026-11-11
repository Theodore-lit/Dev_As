-- Tests pgTAP - valider_match

BEGIN;

SELECT plan(10);

-- Préparation : créer une édition test, une phase, un match
INSERT INTO editions (annee, nom, statut, score_max_defaut) 
VALUES (9999, 'Test', 'en_cours'::statut_edition, 100);

INSERT INTO phases (edition_id, ordre, nom, type, nb_qualifies_par_groupe, nb_barrage_par_groupe)
VALUES (
  (SELECT id FROM editions WHERE annee = 9999),
  1, 'Test Phase', 'qualification'::type_phase, 2, 1
);

-- Créer 5 participants test
WITH p AS (
  INSERT INTO participants (edition_id, numero, nom, prenom, etablissement, classe_niveau, email, statut)
  SELECT 
    (SELECT id FROM editions WHERE annee = 9999),
    row_number() OVER (),
    'P' || row_number() OVER (),
    'Test',
    'Univ',
    'L1',
    'p' || row_number() OVER () || '@test',
    'en_competition'::statut_participant
  FROM generate_series(1, 5)
  RETURNING id
)
SELECT ok(true, 'Participants créés');

-- Créer un match
INSERT INTO matchs (phase_id, libelle, score_max, statut)
VALUES (
  (SELECT id FROM phases WHERE id IN (SELECT id FROM phases WHERE edition_id = (SELECT id FROM editions WHERE annee = 9999))),
  'Test Match',
  100,
  'planifie'::statut_match
);

-- Test 1: Match sans résultats → erreur
SELECT ok(
  (valider_match((SELECT id FROM matchs WHERE libelle = 'Test Match' LIMIT 1))->>'success' = 'false'),
  'Refus : aucun résultat'
);

-- Ajouter résultats sans scores
INSERT INTO resultats (match_id, participant_id)
SELECT 
  (SELECT id FROM matchs WHERE libelle = 'Test Match' LIMIT 1),
  id
FROM participants WHERE edition_id = (SELECT id FROM editions WHERE annee = 9999);

-- Test 2: Match avec résultats sans scores → erreur
SELECT ok(
  (valider_match((SELECT id FROM matchs WHERE libelle = 'Test Match' LIMIT 1))->>'success' = 'false'),
  'Refus : scores manquants'
);

-- Mettre à jour avec des scores (3 distincts, 2 égaux)
UPDATE resultats
SET score = CASE 
  WHEN participant_id IN (SELECT id FROM participants ORDER BY id LIMIT 1) THEN 90
  WHEN participant_id IN (SELECT id FROM participants ORDER BY id LIMIT 1 OFFSET 1) THEN 85
  WHEN participant_id IN (SELECT id FROM participants ORDER BY id LIMIT 1 OFFSET 2) THEN 80
  WHEN participant_id IN (SELECT id FROM participants ORDER BY id LIMIT 1 OFFSET 3) THEN 75
  ELSE 75
END
WHERE match_id = (SELECT id FROM matchs WHERE libelle = 'Test Match' LIMIT 1);

-- Test 3: Égalité non départagée (rang 3 = 75, rang 4 = 75) → erreur
SELECT ok(
  (valider_match((SELECT id FROM matchs WHERE libelle = 'Test Match' LIMIT 1))->>'success' = 'false'),
  'Refus : égalité non départagée sur position décisive'
);

-- Ajouter rang_departage pour les égalités
UPDATE resultats
SET rang_departage = CASE 
  WHEN score = 75 THEN row_number() OVER (PARTITION BY score ORDER BY id)
  ELSE NULL
END
WHERE match_id = (SELECT id FROM matchs WHERE libelle = 'Test Match' LIMIT 1);

-- Test 4: Avec rang_departage → succès
SELECT ok(
  (valider_match((SELECT id FROM matchs WHERE libelle = 'Test Match' LIMIT 1))->>'success' = 'true'),
  'Validation réussie avec rang_departage'
);

-- Test 5: Match validé → rangs calculés
SELECT ok(
  (SELECT COUNT(DISTINCT rang) FROM resultats 
   WHERE match_id = (SELECT id FROM matchs WHERE libelle = 'Test Match' LIMIT 1)) = 5,
  'Rangs calculés pour chaque participant'
);

-- Test 6: Issues correctes (2 qualifiés, 1 barrage, 2 éliminés)
SELECT is(
  (SELECT COUNT(*) FROM resultats 
   WHERE match_id = (SELECT id FROM matchs WHERE libelle = 'Test Match' LIMIT 1)
   AND issue = 'qualifie'::issue_resultat),
  2,
  'Exactement 2 qualifiés'
);

SELECT is(
  (SELECT COUNT(*) FROM resultats 
   WHERE match_id = (SELECT id FROM matchs WHERE libelle = 'Test Match' LIMIT 1)
   AND issue = 'barrage'::issue_resultat),
  1,
  'Exactement 1 au barrage'
);

SELECT is(
  (SELECT COUNT(*) FROM resultats 
   WHERE match_id = (SELECT id FROM matchs WHERE libelle = 'Test Match' LIMIT 1)
   AND issue = 'elimine'::issue_resultat),
  2,
  'Exactement 2 éliminés'
);

-- Test 7: Participants élimin marqués en_attente->elimine
SELECT ok(
  (SELECT COUNT(*) FROM participants 
   WHERE edition_id = (SELECT id FROM editions WHERE annee = 9999)
   AND statut = 'elimine'::statut_participant) = 2,
  'Participants marqués éliminés'
);

-- Test 8: Match passe à valide
SELECT ok(
  (SELECT statut FROM matchs WHERE libelle = 'Test Match' LIMIT 1) = 'valide'::statut_match,
  'Match statut = valide'
);

-- Nettoyage
DELETE FROM journal_activite WHERE table_cible IN ('editions', 'participants', 'matchs', 'resultats');
DELETE FROM resultats;
DELETE FROM matchs;
DELETE FROM participants;
DELETE FROM phases;
DELETE FROM editions WHERE annee = 9999;

SELECT * FROM finish();

ROLLBACK;
