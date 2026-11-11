-- Task 10: Fonction valider_match() - CRITIQUE

CREATE FUNCTION valider_match(p_match_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_match matchs;
  v_phase phases;
  v_edition editions;
  v_resultat_count INTEGER;
  v_incomplets INTEGER;
  v_egalites_non_departages TEXT;
  v_position_limite INTEGER;
  v_score_limite INTEGER;
  v_rang SMALLINT;
  v_issue issue_resultat;
  v_ancien_statut statut_participant;
  v_new_rang SMALLINT := 1;
  rec RECORD;
  v_finales_rang INTEGER;
BEGIN
  -- Vérifier que le match existe
  SELECT * INTO v_match FROM matchs WHERE id = p_match_id;
  IF v_match IS NULL THEN
    RAISE EXCEPTION 'Match non trouvé';
  END IF;

  -- Vérifier que le match n'est pas déjà validé
  IF v_match.statut = 'valide' THEN
    RAISE EXCEPTION 'Match déjà validé';
  END IF;

  -- Récupérer la phase et l'édition
  SELECT * INTO v_phase FROM phases WHERE id = v_match.phase_id;
  SELECT * INTO v_edition FROM editions WHERE id = v_phase.edition_id;

  -- Vérifier qu'il y a au moins 1 résultat
  SELECT COUNT(*) INTO v_resultat_count FROM resultats WHERE match_id = p_match_id;
  IF v_resultat_count = 0 THEN
    RAISE EXCEPTION 'Au moins un résultat requis';
  END IF;

  -- Vérifier que tous les résultats ont un score
  SELECT COUNT(*) INTO v_incomplets FROM resultats 
  WHERE match_id = p_match_id AND score IS NULL;
  IF v_incomplets > 0 THEN
    RAISE EXCEPTION 'Tous les participants doivent avoir un score';
  END IF;

  -- Vérifier les égalités non départagées sur positions décisives
  -- Position décisive 1 : dernier qualifié (nb_qualifies)
  v_position_limite := v_phase.nb_qualifies_par_groupe;
  SELECT GROUP_CONCAT(nom || ' ' || prenom) INTO v_egalites_non_departages
  FROM (
    SELECT p.nom, p.prenom, r.score, r.rang_departage,
           ROW_NUMBER() OVER (ORDER BY r.score DESC, r.rang_departage ASC NULLS LAST) AS rn
    FROM resultats r
    JOIN participants p ON r.participant_id = p.id
    WHERE r.match_id = p_match_id
  ) sub
  WHERE rn = v_position_limite OR rn = v_position_limite + 1
  GROUP BY score
  HAVING COUNT(DISTINCT rang_departage) < COUNT(*) OR COUNT(*) FILTER (WHERE rang_departage IS NULL) > 0;

  IF v_egalites_non_departages IS NOT NULL THEN
    RAISE EXCEPTION 'Égalité non départagée à la position décisive (dernier qualifié) : %', v_egalites_non_departages;
  END IF;

  -- Position décisive 2 : dernier du barrage (si applicable)
  IF v_phase.nb_barrage_par_groupe > 0 THEN
    v_position_limite := v_phase.nb_qualifies_par_groupe + v_phase.nb_barrage_par_groupe;
    SELECT GROUP_CONCAT(nom || ' ' || prenom) INTO v_egalites_non_departages
    FROM (
      SELECT p.nom, p.prenom, r.score, r.rang_departage,
             ROW_NUMBER() OVER (ORDER BY r.score DESC, r.rang_departage ASC NULLS LAST) AS rn
      FROM resultats r
      JOIN participants p ON r.participant_id = p.id
      WHERE r.match_id = p_match_id
    ) sub
    WHERE rn = v_position_limite OR rn = v_position_limite + 1
    GROUP BY score
    HAVING COUNT(DISTINCT rang_departage) < COUNT(*) OR COUNT(*) FILTER (WHERE rang_departage IS NULL) > 0;

    IF v_egalites_non_departages IS NOT NULL THEN
      RAISE EXCEPTION 'Égalité non départagée à la position décisive (dernier barrage) : %', v_egalites_non_departages;
    END IF;
  END IF;

  -- Position décisive 3 : rang 1 finale (si phase = finale)
  IF v_phase.type = 'finale' THEN
    SELECT GROUP_CONCAT(nom || ' ' || prenom) INTO v_egalites_non_departages
    FROM (
      SELECT p.nom, p.prenom, r.score, r.rang_departage,
             ROW_NUMBER() OVER (ORDER BY r.score DESC, r.rang_departage ASC NULLS LAST) AS rn
      FROM resultats r
      JOIN participants p ON r.participant_id = p.id
      WHERE r.match_id = p_match_id
    ) sub
    WHERE rn = 1 OR rn = 2
    GROUP BY score
    HAVING COUNT(DISTINCT rang_departage) < COUNT(*) OR COUNT(*) FILTER (WHERE rang_departage IS NULL) > 0;

    IF v_egalites_non_departages IS NOT NULL THEN
      RAISE EXCEPTION 'Égalité non départagée au rang 1 (champion) : %', v_egalites_non_departages;
    END IF;
  END IF;

  -- Calculer rangs et issues, puis mettre à jour
  FOR rec IN
    SELECT
      r.id AS resultat_id,
      r.participant_id,
      r.score,
      r.rang_departage,
      ROW_NUMBER() OVER (ORDER BY r.score DESC, r.rang_departage ASC NULLS LAST) AS new_rang
    FROM resultats r
    WHERE r.match_id = p_match_id
    ORDER BY new_rang
  LOOP
    v_rang := rec.new_rang;

    -- Déterminer issue selon type_phase et rang
    IF v_phase.type = 'finale' THEN
      IF v_rang = 1 THEN
        v_issue := 'champion'::issue_resultat;
      ELSE
        v_issue := 'finaliste'::issue_resultat;
      END IF;
    ELSIF v_phase.type = 'demi_finale' THEN
      IF v_rang <= v_phase.nb_qualifies_par_groupe THEN
        v_issue := 'qualifie'::issue_resultat;
      ELSE
        v_issue := 'elimine'::issue_resultat;
      END IF;
    ELSIF v_phase.nb_barrage_par_groupe > 0 THEN
      IF v_rang <= v_phase.nb_qualifies_par_groupe THEN
        v_issue := 'qualifie'::issue_resultat;
      ELSIF v_rang <= v_phase.nb_qualifies_par_groupe + v_phase.nb_barrage_par_groupe THEN
        v_issue := 'barrage'::issue_resultat;
      ELSE
        v_issue := 'elimine'::issue_resultat;
      END IF;
    ELSE
      IF v_rang <= v_phase.nb_qualifies_par_groupe THEN
        v_issue := 'qualifie'::issue_resultat;
      ELSE
        v_issue := 'elimine'::issue_resultat;
      END IF;
    END IF;

    -- Mettre à jour le résultat
    UPDATE resultats
    SET rang = v_rang, issue = v_issue, updated_at = NOW()
    WHERE id = rec.resultat_id;

    -- Mettre à jour le statut du participant
    SELECT statut INTO v_ancien_statut FROM participants WHERE id = rec.participant_id;

    CASE v_issue
      WHEN 'elimine'::issue_resultat THEN
        UPDATE participants
        SET statut = 'elimine'::statut_participant, elimine_en_phase_id = v_phase.id, updated_at = NOW()
        WHERE id = rec.participant_id;
      WHEN 'champion'::issue_resultat THEN
        UPDATE participants
        SET statut = 'champion'::statut_participant, updated_at = NOW()
        WHERE id = rec.participant_id;
      WHEN 'finaliste'::issue_resultat THEN
        UPDATE participants
        SET statut = 'finaliste'::statut_participant, updated_at = NOW()
        WHERE id = rec.participant_id;
      ELSE
        UPDATE participants
        SET statut = 'en_competition'::statut_participant, updated_at = NOW()
        WHERE id = rec.participant_id;
    END CASE;
  END LOOP;

  -- Mettre à jour le match
  UPDATE matchs
  SET statut = 'valide'::statut_match, valide_par = auth.uid(), valide_le = NOW(), updated_at = NOW()
  WHERE id = p_match_id;

  -- Si phase finale, remplir classements_finaux avec les finalistes uniquement
  IF v_phase.type = 'finale' THEN
    INSERT INTO classements_finaux (edition_id, participant_id, rang, titre)
    SELECT
      v_edition.id,
      r.participant_id,
      r.rang,
      CASE WHEN r.rang = 1 THEN 'DevAs' ELSE NULL END
    FROM resultats r
    WHERE r.match_id = p_match_id
    ORDER BY r.rang;
  END IF;

  -- Créer notifications pour les participants du match
  INSERT INTO notifications (profil_id, message, created_at, updated_at)
  SELECT
    pr.id,
    'Match validé : ' || (CASE
      WHEN res.issue = 'champion'::issue_resultat THEN 'Champion !'
      WHEN res.issue = 'finaliste'::issue_resultat THEN 'Finaliste'
      WHEN res.issue = 'qualifie'::issue_resultat THEN 'Qualifié'
      WHEN res.issue = 'barrage'::issue_resultat THEN 'Barrage'
      ELSE 'Éliminé'
    END),
    NOW(),
    NOW()
  FROM resultats res
  JOIN participants p ON res.participant_id = p.id
  LEFT JOIN profils pr ON p.profil_id = pr.id
  WHERE res.match_id = p_match_id AND pr.id IS NOT NULL;

  -- Écrire au journal
  INSERT INTO journal_activite (profil_id, action, table_cible, enregistrement_id, nouvelles_valeurs, created_at)
  VALUES (
    auth.uid(),
    'valider_match',
    'matchs',
    p_match_id,
    jsonb_build_object('statut', 'valide', 'valide_le', NOW()),
    NOW()
  );

  RETURN jsonb_build_object(
    'success', true,
    'message', 'Match validé avec succès',
    'match_id', p_match_id
  );
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'success', false,
    'message', SQLERRM
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
