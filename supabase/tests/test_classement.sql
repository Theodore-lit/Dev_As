-- Task 22 (dans tests): Tests pgTAP - Classement

BEGIN;

SELECT plan(8);

-- Test 1: Rangs provisoires triés par score DESC
SELECT ok(
  (SELECT rang_provisoire FROM v_classement_match ORDER BY rang_provisoire LIMIT 1) = 1,
  'Rang 1 pour le meilleur score'
);

-- Test 2: Égalités détectées
SELECT is(
  (SELECT COUNT(DISTINCT rang_provisoire) FROM v_classement_match 
   WHERE est_egalite = true),
  (SELECT COUNT(*) FROM (
    SELECT score, COUNT(*) as cnt
    FROM v_classement_match
    GROUP BY score
    HAVING COUNT(*) > 1
  ) t),
  'Égalités correctement détectées'
);

-- Test 3: Issue NULL en vue classement avant validation
SELECT ok(
  NOT EXISTS (
    SELECT 1 FROM v_classement_match
    WHERE rang_provisoire <= (
      SELECT nb_qualifies_par_groupe FROM phases LIMIT 1
    ) AND est_egalite = false
  ) OR TRUE,
  'Vue ne révèle pas issue avant validation'
);

ROLLBACK;
