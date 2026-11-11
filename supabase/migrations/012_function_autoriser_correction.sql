-- Task 12: Fonction autoriser_correction

CREATE FUNCTION autoriser_correction(p_match_id UUID, p_motif TEXT)
RETURNS JSONB AS $$
DECLARE
  v_match matchs;
  v_phase phases;
BEGIN
  -- Validation : motif obligatoire et non vide
  IF p_motif IS NULL OR TRIM(p_motif) = '' THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'Motif obligatoire pour autoriser une correction'
    );
  END IF;

  -- Vérifier que le match existe et est validé
  SELECT * INTO v_match FROM matchs WHERE id = p_match_id;
  IF v_match IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'Match non trouvé'
    );
  END IF;

  IF v_match.statut != 'valide'::statut_match THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'Seul un match validé peut être deverrouillé'
    );
  END IF;

  -- Récupérer la phase
  SELECT * INTO v_phase FROM phases WHERE id = v_match.phase_id;

  -- Vérifier qu'aucun match d'une phase suivante n'est validé
  IF EXISTS (
    SELECT 1 FROM matchs m
    JOIN phases ph ON m.phase_id = ph.id
    WHERE ph.edition_id = v_phase.edition_id
      AND ph.ordre > v_phase.ordre
      AND m.statut = 'valide'::statut_match
  ) THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'Impossible : un match d''une phase suivante est déjà validé'
    );
  END IF;

  -- Mise à jour
  UPDATE matchs
  SET deverrouille_le = NOW(), updated_at = NOW()
  WHERE id = p_match_id;

  -- Journal
  INSERT INTO journal_activite (profil_id, action, table_cible, enregistrement_id, motif, nouvelles_valeurs, created_at)
  VALUES (auth.uid(), 'autoriser_correction', 'matchs', p_match_id, p_motif,
          jsonb_build_object('deverrouille_le', NOW()), NOW());

  RETURN jsonb_build_object(
    'success', true,
    'message', 'Match deverrouillé pour correction'
  );
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'success', false,
    'message', SQLERRM
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
