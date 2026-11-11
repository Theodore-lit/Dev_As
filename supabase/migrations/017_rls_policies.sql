-- Task 17: Politiques RLS (Row-Level Security)

-- Activer RLS partout (TABLES SEULEMENT, pas les vues)
ALTER TABLE profils ENABLE ROW LEVEL SECURITY;
ALTER TABLE editions ENABLE ROW LEVEL SECURITY;
ALTER TABLE modeles_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE jury_membres ENABLE ROW LEVEL SECURITY;
ALTER TABLE matchs ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_jury ENABLE ROW LEVEL SECURITY;
ALTER TABLE resultats ENABLE ROW LEVEL SECURITY;
ALTER TABLE resultats_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE classements_finaux ENABLE ROW LEVEL SECURITY;
ALTER TABLE annonces ENABLE ROW LEVEL SECURITY;
ALTER TABLE actualites ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_activite ENABLE ROW LEVEL SECURITY;

-- ============= ANONYME =============

-- editions: lit non planning
CREATE POLICY "Anon lit editions non preparation"
ON editions FOR SELECT
TO anon
USING (statut != 'preparation'::statut_edition);

-- phases: lit phases d'éditions visibles
CREATE POLICY "Anon lit phases"
ON phases FOR SELECT
TO anon
USING (EXISTS (
  SELECT 1 FROM editions WHERE editions.id = phases.edition_id
  AND statut != 'preparation'::statut_edition
));

-- matchs: lit non planifiés
CREATE POLICY "Anon lit matchs non planifies"
ON matchs FOR SELECT
TO anon
USING (statut != 'planifie'::statut_match);

-- resultats: lit en_cours/valides
CREATE POLICY "Anon lit resultats en_cours_valides"
ON resultats FOR SELECT
TO anon
USING (EXISTS (
  SELECT 1 FROM matchs
  WHERE matchs.id = resultats.match_id
  AND statut IN ('en_cours'::statut_match, 'valide'::statut_match)
));

-- actualites publiques
CREATE POLICY "Anon lit actualites publiees"
ON actualites FOR SELECT
TO anon
USING (statut = 'publiee'::statut_publication);

-- annonces publiques
CREATE POLICY "Anon lit annonces publiques publiees"
ON annonces FOR SELECT
TO anon
USING (cible = 'public'::cible_annonce AND statut = 'publiee'::statut_publication);

-- classements_finaux
CREATE POLICY "Anon lit classements_finaux"
ON classements_finaux FOR SELECT
TO anon
USING (true);

-- Refuser tout pour autres tables
CREATE POLICY "Anon refuse profils"
ON profils FOR ALL
TO anon
USING (false);

CREATE POLICY "Anon refuse candidatures"
ON candidatures FOR ALL
TO anon
USING (false);

CREATE POLICY "Anon refuse participants"
ON participants FOR ALL
TO anon
USING (false);

CREATE POLICY "Anon refuse resultats_notes"
ON resultats_notes FOR ALL
TO anon
USING (false);

CREATE POLICY "Anon refuse journal_activite"
ON journal_activite FOR ALL
TO anon
USING (false);

-- ============= PARTICIPANT (authenticated) =============

-- participants: lit le sien
CREATE POLICY "Participant lit son profil"
ON participants FOR SELECT
TO authenticated
USING (profil_id = auth.uid());

-- resultats: lit les siens
CREATE POLICY "Participant lit ses resultats"
ON resultats FOR SELECT
TO authenticated
USING (participant_id IN (
  SELECT id FROM participants WHERE profil_id = auth.uid()
));

-- notifications: lit les siennes
CREATE POLICY "Participant lit ses notifications"
ON notifications FOR SELECT
TO authenticated
USING (profil_id = auth.uid());

-- notifications: peut marquer lue
CREATE POLICY "Participant marque notification lue"
ON notifications FOR UPDATE
TO authenticated
USING (profil_id = auth.uid())
WITH CHECK (profil_id = auth.uid());

-- annonces participants
CREATE POLICY "Participant lit annonces participants publiees"
ON annonces FOR SELECT
TO authenticated
USING (cible = 'participants'::cible_annonce AND statut = 'publiee'::statut_publication);

-- editions et phases : lecture
CREATE POLICY "Participant lit editions"
ON editions FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Participant lit phases"
ON phases FOR SELECT
TO authenticated
USING (true);

-- matchs : lecture
CREATE POLICY "Participant lit matchs"
ON matchs FOR SELECT
TO authenticated
USING (true);

-- actualites : lecture
CREATE POLICY "Participant lit actualites publiees"
ON actualites FOR SELECT
TO authenticated
USING (statut = 'publiee'::statut_publication);

-- classements: lecture
CREATE POLICY "Participant lit classements"
ON classements_finaux FOR SELECT
TO authenticated
USING (true);

-- ============= ADMIN (avec permissions) =============

-- candidatures
CREATE POLICY "Admin lit candidatures si permission"
ON candidatures FOR SELECT
TO authenticated
USING (a_permission('candidatures'));

CREATE POLICY "Admin modifie candidatures si permission"
ON candidatures FOR UPDATE
TO authenticated
USING (a_permission('candidatures'))
WITH CHECK (a_permission('candidatures'));

-- participants (admin peut voir/modifier si permission)
CREATE POLICY "Admin lit participants si permission"
ON participants FOR SELECT
TO authenticated
USING (a_permission('comptes') OR a_permission('resultats'));

CREATE POLICY "Admin modifie participants si permission"
ON participants FOR UPDATE
TO authenticated
USING (a_permission('comptes'))
WITH CHECK (a_permission('comptes'));

-- resultats (admin peut insérer/modifier si permission)
CREATE POLICY "Admin lit resultats si permission"
ON resultats FOR SELECT
TO authenticated
USING (a_permission('resultats'));

CREATE POLICY "Admin insert resultats si permission"
ON resultats FOR INSERT
TO authenticated
WITH CHECK (a_permission('resultats'));

CREATE POLICY "Admin update resultats si permission"
ON resultats FOR UPDATE
TO authenticated
USING (a_permission('resultats'))
WITH CHECK (a_permission('resultats'));

-- resultats_notes
CREATE POLICY "Admin lit notes si permission"
ON resultats_notes FOR SELECT
TO authenticated
USING (a_permission('resultats'));

CREATE POLICY "Admin modifie notes si permission"
ON resultats_notes FOR UPDATE
TO authenticated
USING (a_permission('resultats'))
WITH CHECK (a_permission('resultats'));

-- journal_activite
CREATE POLICY "Admin lit journal si permission"
ON journal_activite FOR SELECT
TO authenticated
USING (a_permission('resultats') OR est_super_admin());

-- Admin accès éditions
CREATE POLICY "Admin lit editions"
ON editions FOR SELECT
TO authenticated
USING (est_admin() OR a_permission('candidatures'));

CREATE POLICY "Admin modifie editions si admin"
ON editions FOR UPDATE
TO authenticated
USING (est_admin())
WITH CHECK (est_admin());

-- Admin accès phases
CREATE POLICY "Admin lit phases"
ON phases FOR SELECT
TO authenticated
USING (est_admin());

CREATE POLICY "Admin modifie phases si admin"
ON phases FOR UPDATE
TO authenticated
USING (est_admin())
WITH CHECK (est_admin());

-- Admin accès matchs
CREATE POLICY "Admin lit matchs"
ON matchs FOR SELECT
TO authenticated
USING (est_admin() OR a_permission('resultats'));

CREATE POLICY "Admin modifie matchs si permission"
ON matchs FOR UPDATE
TO authenticated
USING (a_permission('resultats'))
WITH CHECK (a_permission('resultats'));

-- Admin accès jury
CREATE POLICY "Admin lit jury"
ON jury_membres FOR SELECT
TO authenticated
USING (est_admin());

-- Admin annonces
CREATE POLICY "Admin lit annonces"
ON annonces FOR SELECT
TO authenticated
USING (est_admin());

CREATE POLICY "Admin modifie annonces si admin"
ON annonces FOR UPDATE
TO authenticated
USING (est_admin())
WITH CHECK (est_admin());

-- ============= SUPER_ADMIN =============

-- profils : super-admin gère tout
CREATE POLICY "Super-admin gere profils"
ON profils FOR ALL
TO authenticated
USING (est_super_admin())
WITH CHECK (est_super_admin());

-- super-admin accès complet journal
CREATE POLICY "Super-admin lit journal complet"
ON journal_activite FOR SELECT
TO authenticated
USING (est_super_admin());

-- super-admin gère classifications
CREATE POLICY "Super-admin modifie classements"
ON classements_finaux FOR UPDATE
TO authenticated
USING (est_super_admin())
WITH CHECK (est_super_admin());
