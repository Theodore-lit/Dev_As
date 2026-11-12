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
(2026, 'Édition 2026', 'Édition en cours', 'en_cours'::statut_edition, '2026-11-26 00:00:00 Africa/Porto-Novo', '2026-12-19 23:59:59 Africa/Porto-Novo', 100),
(2027, 'Édition 2027', 'Édition avec candidatures ouvertes', 'candidatures_ouvertes'::statut_edition, '2027-01-01', NULL, 100);

-- Calendrier officiel de l'édition 2026
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
