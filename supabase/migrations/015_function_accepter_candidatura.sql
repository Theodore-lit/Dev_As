-- Task 15: Fonction accepter_candidature

CREATE FUNCTION accepter_candidatura(p_candidature_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_candidature candidatures;
  v_edition editions;
  v_next_numero INTEGER;
  v_participant_id UUID;
BEGIN
  -- Récupérer candidature
  SELECT * INTO v_candidature FROM candidatures WHERE id = p_candidature_id;
  IF v_candidature IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'Candidature non trouvée'
    );
  END IF;

  -- Vérifier statut
  IF v_candidature.statut != 'en_attente'::statut_candidatura THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'Candidature déjà traitée'
    );
  END IF;

  -- Récupérer édition
  SELECT * INTO v_edition FROM editions WHERE id = v_candidature.edition_id;

  -- Calculer prochain numéro
  SELECT COALESCE(MAX(numero), 0) + 1
  INTO v_next_numero
  FROM participants
  WHERE edition_id = v_candidature.edition_id;

  -- Créer participant
  INSERT INTO participants (
    edition_id, candidature_id, numero, nom, prenom, date_naissance, sexe,
    etablissement, classe_niveau, email, telephone, photo_path, statut, created_at, updated_at
  )
  VALUES (
    v_candidature.edition_id, p_candidature_id, v_next_numero,
    v_candidature.nom, v_candidature.prenom, v_candidature.date_naissance, v_candidature.sexe,
    v_candidature.etablissement, v_candidature.classe_niveau, v_candidature.email,
    v_candidature.telephone, v_candidature.photo_path, 'en_attente'::statut_participant, NOW(), NOW()
  )
  RETURNING id INTO v_participant_id;

  -- Mettre à jour candidature
  UPDATE candidatures
  SET statut = 'acceptee'::statut_candidatura, traite_par = auth.uid(), traite_le = NOW(), updated_at = NOW()
  WHERE id = p_candidature_id;

  -- Journal
  INSERT INTO journal_activite (profil_id, action, table_cible, enregistrement_id, nouvelles_valeurs, created_at)
  VALUES (auth.uid(), 'accepter_candidatura', 'candidatures', p_candidature_id,
          jsonb_build_object('statut', 'acceptee', 'participant_id', v_participant_id), NOW());

  RETURN jsonb_build_object(
    'success', true,
    'message', 'Candidature acceptée',
    'participant_id', v_participant_id,
    'numero', v_next_numero
  );
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'success', false,
    'message', SQLERRM
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
