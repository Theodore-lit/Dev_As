-- Task 13: Fonction creer_edition

CREATE FUNCTION creer_edition(
  p_annee INTEGER,
  p_nom VARCHAR,
  p_description TEXT DEFAULT NULL,
  p_score_max_defaut INTEGER DEFAULT 100
)
RETURNS UUID AS $$
DECLARE
  v_edition_id UUID;
BEGIN
  -- Création édition
  INSERT INTO editions (annee, nom, description, score_max_defaut, statut, created_at, updated_at)
  VALUES (p_annee, p_nom, p_description, p_score_max_defaut, 'preparation'::statut_edition, NOW(), NOW())
  RETURNING id INTO v_edition_id;

  -- Copie des modèles_phases dans phases
  INSERT INTO phases (edition_id, ordre, nom, type, nb_groupes, nb_qualifies_par_groupe, nb_barrage_par_groupe, created_at, updated_at)
  SELECT v_edition_id, ordre, nom, type, nb_groupes, nb_qualifies_par_groupe, nb_barrage_par_groupe, NOW(), NOW()
  FROM modeles_phases
  ORDER BY ordre;

  -- Journal
  INSERT INTO journal_activite (action, table_cible, enregistrement_id, nouvelles_valeurs, created_at)
  VALUES ('creer_edition', 'editions', v_edition_id, jsonb_build_object('annee', p_annee, 'nom', p_nom), NOW());

  RETURN v_edition_id;
EXCEPTION WHEN OTHERS THEN
  RAISE EXCEPTION 'Erreur lors de la création de l''édition : %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
