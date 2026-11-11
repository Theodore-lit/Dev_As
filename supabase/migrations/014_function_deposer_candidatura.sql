-- Task 14: Fonction deposer_candidature

CREATE FUNCTION deposer_candidatura(
  p_edition_id UUID,
  p_nom VARCHAR,
  p_prenom VARCHAR,
  p_email VARCHAR,
  p_etablissement VARCHAR,
  p_classe_niveau VARCHAR,
  p_date_naissance DATE DEFAULT NULL,
  p_sexe CHAR(1) DEFAULT NULL,
  p_telephone VARCHAR DEFAULT NULL,
  p_photo_path VARCHAR DEFAULT NULL,
  p_informations TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_candidature_id UUID;
  v_code_suivi VARCHAR;
  v_candidatures_ouvertes BOOLEAN;
BEGIN
  -- Vérifier que les candidatures sont ouvertes
  SELECT candidatures_ouvertes INTO v_candidatures_ouvertes
  FROM editions WHERE id = p_edition_id;

  IF v_candidatures_ouvertes IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'Édition non trouvée'
    );
  END IF;

  IF v_candidatures_ouvertes = false THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'Les candidatures sont fermées pour cette édition'
    );
  END IF;

  -- Vérifier pas déjà une candidature avec cet email (case-insensitive)
  IF EXISTS (
    SELECT 1 FROM candidatures
    WHERE edition_id = p_edition_id AND LOWER(email) = LOWER(p_email)
  ) THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'Email déjà utilisé dans une candidature pour cette édition'
    );
  END IF;

  -- Générer code de suivi
  v_code_suivi := substring(gen_random_uuid()::text, 1, 8);

  -- INSERT candidature
  INSERT INTO candidatures (
    edition_id, nom, prenom, date_naissance, sexe, etablissement, classe_niveau,
    email, telephone, photo_path, informations, code_suivi, statut, created_at, updated_at
  )
  VALUES (
    p_edition_id, p_nom, p_prenom, p_date_naissance, p_sexe, p_etablissement, p_classe_niveau,
    p_email, p_telephone, p_photo_path, p_informations, v_code_suivi, 'en_attente'::statut_candidatura, NOW(), NOW()
  )
  RETURNING id INTO v_candidature_id;

  -- Journal
  INSERT INTO journal_activite (action, table_cible, enregistrement_id, nouvelles_valeurs, created_at)
  VALUES ('deposer_candidatura', 'candidatures', v_candidature_id,
          jsonb_build_object('email', p_email, 'nom', p_nom, 'prenom', p_prenom), NOW());

  RETURN jsonb_build_object(
    'success', true,
    'message', 'Candidature déposée avec succès',
    'code_suivi', v_code_suivi,
    'candidature_id', v_candidature_id
  );
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'success', false,
    'message', SQLERRM
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
