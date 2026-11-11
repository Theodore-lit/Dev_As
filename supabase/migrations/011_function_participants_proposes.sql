-- Task 11: Fonction participants_proposes

CREATE FUNCTION participants_proposes(p_phase_id UUID)
RETURNS TABLE (
  id UUID,
  numero INTEGER,
  nom VARCHAR,
  prenom VARCHAR,
  edition_id UUID
) AS $$
DECLARE
  v_edition_id UUID;
  v_phase_type type_phase;
BEGIN
  -- Récupérer la phase et son type
  SELECT ph.edition_id, ph.type
  INTO v_edition_id, v_phase_type
  FROM phases ph
  WHERE ph.id = p_phase_id;

  IF v_edition_id IS NULL THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT DISTINCT
    p.id,
    p.numero,
    p.nom,
    p.prenom,
    p.edition_id
  FROM participants p
  WHERE p.edition_id = v_edition_id
    AND p.statut = 'en_competition'::statut_participant
    -- Exclure ceux déjà dans un match de la phase
    AND p.id NOT IN (
      SELECT DISTINCT participant_id
      FROM resultats r
      JOIN matchs m ON r.match_id = m.id
      WHERE m.phase_id = p_phase_id
    )
    -- Logique barrage : si phase est barrage, seuls ceux avec dernière issue = barrage
    AND (
      v_phase_type != 'barrage'::type_phase
      OR (
        SELECT issue
        FROM resultats r
        JOIN matchs m ON r.match_id = m.id
        WHERE r.participant_id = p.id
          AND m.phase_id IN (
            SELECT id FROM phases WHERE edition_id = v_edition_id AND type != 'barrage'::type_phase
          )
        ORDER BY m.valide_le DESC NULLS LAST, m.date_heure DESC NULLS LAST
        LIMIT 1
      ) = 'barrage'::issue_resultat
    )
    -- Autres phases : exclure si dernière issue barrage et barrage non validé
    AND (
      v_phase_type = 'barrage'::type_phase
      OR NOT (
        (
          SELECT issue
          FROM resultats r
          JOIN matchs m ON r.match_id = m.id
          WHERE r.participant_id = p.id
            AND m.phase_id IN (
              SELECT id FROM phases WHERE edition_id = v_edition_id AND type != 'barrage'::type_phase
            )
          ORDER BY m.valide_le DESC NULLS LAST, m.date_heure DESC NULLS LAST
          LIMIT 1
        ) = 'barrage'::issue_resultat
        AND NOT EXISTS (
          SELECT 1 FROM matchs
          WHERE phase_id IN (
            SELECT id FROM phases
            WHERE edition_id = v_edition_id AND type = 'barrage'::type_phase
          )
          AND statut = 'valide'::statut_match
        )
      )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
