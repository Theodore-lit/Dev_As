-- Tests pgTAP - Règles métier

BEGIN;

SELECT plan(5);

-- Test 1: Participant éliminé ne peut pas être ajouté à un match
INSERT INTO editions (annee, nom, statut) VALUES (8888, 'Test2', 'en_cours'::statut_edition);

INSERT INTO phases (edition_id, ordre, nom, type)
VALUES ((SELECT id FROM editions WHERE annee = 8888), 1, 'Phase1', 'qualification'::type_phase);

INSERT INTO participants (edition_id, numero, nom, prenom, etablissement, classe_niveau, email, statut)
VALUES (
  (SELECT id FROM editions WHERE annee = 8888),
  1, 'Élim', 'Test', 'U', 'L1', 'elim@test', 'elimine'::statut_participant
);

INSERT INTO matchs (phase_id, libelle, score_max)
VALUES ((SELECT id FROM phases WHERE edition_id = (SELECT id FROM editions WHERE annee = 8888)), 'Match', 100);

-- Tenter d'ajouter participant éliminé
SELECT throws_ok(
  'INSERT INTO resultats (match_id, participant_id, score) 
   SELECT (SELECT id FROM matchs WHERE libelle = ''Match'' LIMIT 1),
           (SELECT id FROM participants WHERE nom = ''Élim'' LIMIT 1), 50',
  'Participant doit être en_competition',
  'Participant éliminé refusé'
);

-- Test 2: Impossible ajouter même participant 2 fois au même match
INSERT INTO participants (edition_id, numero, nom, prenom, etablissement, classe_niveau, email, statut)
VALUES ((SELECT id FROM editions WHERE annee = 8888), 2, 'OK', 'Test', 'U', 'L1', 'ok@test', 'en_competition'::statut_participant);

INSERT INTO resultats (match_id, participant_id, score)
VALUES (
  (SELECT id FROM matchs WHERE libelle = 'Match' LIMIT 1),
  (SELECT id FROM participants WHERE nom = 'OK' LIMIT 1),
  50
);

SELECT throws_ok(
  'INSERT INTO resultats (match_id, participant_id, score)
   SELECT (SELECT id FROM matchs WHERE libelle = ''Match'' LIMIT 1),
           (SELECT id FROM participants WHERE nom = ''OK'' LIMIT 1), 75',
  'duplicate key',
  'Impossible doublon participant/match'
);

-- Test 3: Score borné 0 <= score <= score_max
SELECT throws_ok(
  'UPDATE resultats SET score = -1 
   WHERE match_id = (SELECT id FROM matchs WHERE libelle = ''Match'' LIMIT 1)',
  'Score doit être entre 0 et 100',
  'Score négatif refusé'
);

SELECT throws_ok(
  'UPDATE resultats SET score = 150 
   WHERE match_id = (SELECT id FROM matchs WHERE libelle = ''Match'' LIMIT 1)',
  'Score doit être entre 0 et 100',
  'Score > max refusé'
);

-- Test 4: Match validé immuable sans deverrouillage
-- Match validé
UPDATE matchs SET statut = 'valide'::statut_match WHERE libelle = 'Match';

SELECT throws_ok(
  'UPDATE resultats SET score = 60 
   WHERE match_id = (SELECT id FROM matchs WHERE libelle = ''Match'' LIMIT 1)',
  'Match validé : impossible de modifier',
  'Match validé bloqué sans deverrouillage'
);

-- Test 5: Email candidature unique par édition (case-insensitive)
INSERT INTO candidatures (edition_id, nom, prenom, email, etablissement, classe_niveau, code_suivi)
VALUES ((SELECT id FROM editions WHERE annee = 8888), 'C1', 'Test', 'email@test', 'U', 'L1', 'code1');

SELECT throws_ok(
  'INSERT INTO candidatures (edition_id, nom, prenom, email, etablissement, classe_niveau, code_suivi)
   VALUES ((SELECT id FROM editions WHERE annee = 8888), ''C2'', ''Test'', ''EMAIL@TEST'', ''U'', ''L1'', ''code2'')',
  'duplicate key',
  'Email doublon case-insensitive refusé'
);

-- Nettoyage
DELETE FROM journal_activite WHERE table_cible IN ('editions', 'candidatures', 'participants', 'matchs', 'resultats');
DELETE FROM resultats;
DELETE FROM match_jury;
DELETE FROM matchs;
DELETE FROM participants;
DELETE FROM candidatures;
DELETE FROM phases;
DELETE FROM editions WHERE annee IN (8888, 9999);

SELECT * FROM finish();

ROLLBACK;
