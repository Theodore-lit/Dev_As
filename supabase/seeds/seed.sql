-- Task 20: Seed de démonstration

-- Modèles de phases (configuration par défaut : 11 phases, 14 matchs)
INSERT INTO modeles_phases (ordre, nom, type, nb_groupes, nb_qualifies_par_groupe, nb_barrage_par_groupe) VALUES
(1, 'Première qualification', 'qualification'::type_phase, 2, 10, 5),
(2, 'Barrage', 'barrage'::type_phase, 1, 6, 0),
(3, 'Deuxième qualification', 'qualification'::type_phase, 2, 10, 0),
(4, 'Troisième qualification', 'qualification'::type_phase, 2, 8, 0),
(5, 'Tour 1', 'tour'::type_phase, 1, 13, 0),
(6, 'Tour 2', 'tour'::type_phase, 1, 10, 0),
(7, 'Seizième de finale', 'tour'::type_phase, 1, 8, 0),
(8, 'Huitième de finale', 'tour'::type_phase, 1, 6, 0),
(9, 'Quart de finale', 'tour'::type_phase, 1, 4, 0),
(10, 'Demi-finale', 'demi_finale'::type_phase, 1, 2, 0),
(11, 'Grande finale', 'finale'::type_phase, 1, 1, 0);

-- Éditions
INSERT INTO editions (annee, nom, description, statut, date_debut, date_fin, score_max_defaut)
VALUES 
(2024, 'Édition 2024', 'Édition archivée', 'archivee'::statut_edition, '2024-01-01', '2024-12-31', 100),
(2025, 'Édition 2025', 'Édition terminée', 'terminee'::statut_edition, '2025-01-01', '2025-12-31', 100),
(2026, 'Édition 2026', 'Édition en cours', 'en_cours'::statut_edition, '2026-01-01', NULL, 100),
(2027, 'Édition 2027', 'Édition avec candidatures ouvertes', 'candidatures_ouvertes'::statut_edition, '2027-01-01', NULL, 100);

-- Créer phases pour chaque édition
INSERT INTO phases (edition_id, ordre, nom, type, nb_groupes, nb_qualifies_par_groupe, nb_barrage_par_groupe)
SELECT (SELECT id FROM editions WHERE annee = 2024), ordre, nom, type, nb_groupes, nb_qualifies_par_groupe, nb_barrage_par_groupe
FROM modeles_phases;

INSERT INTO phases (edition_id, ordre, nom, type, nb_groupes, nb_qualifies_par_groupe, nb_barrage_par_groupe)
SELECT (SELECT id FROM editions WHERE annee = 2025), ordre, nom, type, nb_groupes, nb_qualifies_par_groupe, nb_barrage_par_groupe
FROM modeles_phases;

INSERT INTO phases (edition_id, ordre, nom, type, nb_groupes, nb_qualifies_par_groupe, nb_barrage_par_groupe)
SELECT (SELECT id FROM editions WHERE annee = 2026), ordre, nom, type, nb_groupes, nb_qualifies_par_groupe, nb_barrage_par_groupe
FROM modeles_phases;

INSERT INTO phases (edition_id, ordre, nom, type, nb_groupes, nb_qualifies_par_groupe, nb_barrage_par_groupe)
SELECT (SELECT id FROM editions WHERE annee = 2027), ordre, nom, type, nb_groupes, nb_qualifies_par_groupe, nb_barrage_par_groupe
FROM modeles_phases;

-- Créer 30 participants fictifs pour 2024
WITH p_2024 AS (
  SELECT 
    row_number() OVER () as num,
    'Participant' || row_number() OVER () as nom,
    'P' || row_number() OVER () as prenom,
    'Université' as etab,
    'L1' as classe,
    'participant' || row_number() OVER () || '@test.local' as email
  FROM generate_series(1, 30)
)
INSERT INTO participants (edition_id, numero, nom, prenom, etablissement, classe_niveau, email, statut, publie)
SELECT (SELECT id FROM editions WHERE annee = 2024), num, nom, prenom, etab, classe, email, 'en_competition'::statut_participant, true
FROM p_2024;

-- Créer 30 participants fictifs pour 2025
WITH p_2025 AS (
  SELECT 
    row_number() OVER () as num,
    'Candidat' || row_number() OVER () as nom,
    'C' || row_number() OVER () as prenom,
    'École' as etab,
    'M1' as classe,
    'candidat' || row_number() OVER () || '@test.local' as email
  FROM generate_series(1, 30)
)
INSERT INTO participants (edition_id, numero, nom, prenom, etablissement, classe_niveau, email, statut, publie)
SELECT (SELECT id FROM editions WHERE annee = 2025), num, nom, prenom, etab, classe, email, 'en_competition'::statut_participant, true
FROM p_2025;

-- Créer 30 participants fictifs pour 2026
WITH p_2026 AS (
  SELECT 
    row_number() OVER () as num,
    'Compétiteur' || row_number() OVER () as nom,
    'Co' || row_number() OVER () as prenom,
    'Institut' as etab,
    'S1' as classe,
    'competiteur' || row_number() OVER () || '@test.local' as email
  FROM generate_series(1, 30)
)
INSERT INTO participants (edition_id, numero, nom, prenom, etablissement, classe_niveau, email, statut, publie)
SELECT (SELECT id FROM editions WHERE annee = 2026), num, nom, prenom, etab, classe, email, 'en_competition'::statut_participant, false
FROM p_2026;

-- Jury membres
INSERT INTO jury_membres (nom, prenom, fonction, etablissement) VALUES
('Dupont', 'Jean', 'Professeur', 'Université X'),
('Martin', 'Marie', 'Docteur', 'Université Y'),
('Bernard', 'Pierre', 'Ingénieur', 'École Z'),
('Thomas', 'Sophie', 'Chercheur', 'Institut A'),
('Robert', 'Luc', 'Formateur', 'Centre B');
