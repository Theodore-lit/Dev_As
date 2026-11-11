-- Task 16: Triggers

-- Fonction : validation score entre 0 et score_max
CREATE FUNCTION fn_resultats_score_valide()
RETURNS TRIGGER AS $$
DECLARE
  v_score_max INTEGER;
BEGIN
  SELECT score_max INTO v_score_max FROM matchs WHERE id = NEW.match_id;
  
  IF NEW.score IS NOT NULL AND (NEW.score < 0 OR NEW.score > v_score_max) THEN
    RAISE EXCEPTION 'Score doit être entre 0 et %', v_score_max;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_resultats_score_valide
BEFORE INSERT OR UPDATE ON resultats
FOR EACH ROW
EXECUTE FUNCTION fn_resultats_score_valide();

-- Fonction : immutabilité match validé non deverrouillé
CREATE FUNCTION fn_resultats_immutables()
RETURNS TRIGGER AS $$
DECLARE
  v_statut statut_match;
  v_deverrouille TIMESTAMP;
BEGIN
  SELECT statut, deverrouille_le INTO v_statut, v_deverrouille
  FROM matchs WHERE id = NEW.match_id;
  
  IF v_statut = 'valide'::statut_match AND v_deverrouille IS NULL THEN
    RAISE EXCEPTION 'Match validé : impossible de modifier. Autoriser correction d''abord.';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_resultats_immutables
BEFORE UPDATE ON resultats
FOR EACH ROW
EXECUTE FUNCTION fn_resultats_immutables();

-- Fonction : participant valide (en_competition, pas autre phase, pas autre édition)
CREATE FUNCTION fn_resultats_participant_valide()
RETURNS TRIGGER AS $$
DECLARE
  v_statut statut_participant;
  v_edition_id UUID;
  v_edition_match UUID;
BEGIN
  -- Récupérer statut et édition du participant
  SELECT p.statut, p.edition_id INTO v_statut, v_edition_id
  FROM participants p WHERE p.id = NEW.participant_id;
  
  IF v_statut IS NULL THEN
    RAISE EXCEPTION 'Participant non trouvé';
  END IF;
  
  IF v_statut != 'en_competition'::statut_participant THEN
    RAISE EXCEPTION 'Participant doit être en_competition';
  END IF;
  
  -- Vérifier édition match
  SELECT ph.edition_id INTO v_edition_match
  FROM matchs m
  JOIN phases ph ON m.phase_id = ph.id
  WHERE m.id = NEW.match_id;
  
  IF v_edition_id != v_edition_match THEN
    RAISE EXCEPTION 'Participant d''une autre édition';
  END IF;
  
  -- Vérifier pas déjà dans un autre match de la même phase
  IF EXISTS (
    SELECT 1 FROM resultats r
    JOIN matchs m ON r.match_id = m.id
    WHERE m.phase_id = (SELECT phase_id FROM matchs WHERE id = NEW.match_id)
      AND r.participant_id = NEW.participant_id
      AND r.match_id != NEW.match_id
  ) THEN
    RAISE EXCEPTION 'Participant déjà dans un autre match de cette phase';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_resultats_participant_valide
BEFORE INSERT ON resultats
FOR EACH ROW
EXECUTE FUNCTION fn_resultats_participant_valide();

-- Fonction : mise à jour updated_at
CREATE FUNCTION fn_update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_updated_at_profils
BEFORE UPDATE ON profils FOR EACH ROW
EXECUTE FUNCTION fn_update_updated_at();

CREATE TRIGGER trg_update_updated_at_editions
BEFORE UPDATE ON editions FOR EACH ROW
EXECUTE FUNCTION fn_update_updated_at();

CREATE TRIGGER trg_update_updated_at_modeles_phases
BEFORE UPDATE ON modeles_phases FOR EACH ROW
EXECUTE FUNCTION fn_update_updated_at();

CREATE TRIGGER trg_update_updated_at_phases
BEFORE UPDATE ON phases FOR EACH ROW
EXECUTE FUNCTION fn_update_updated_at();

CREATE TRIGGER trg_update_updated_at_candidatures
BEFORE UPDATE ON candidatures FOR EACH ROW
EXECUTE FUNCTION fn_update_updated_at();

CREATE TRIGGER trg_update_updated_at_participants
BEFORE UPDATE ON participants FOR EACH ROW
EXECUTE FUNCTION fn_update_updated_at();

CREATE TRIGGER trg_update_updated_at_jury_membres
BEFORE UPDATE ON jury_membres FOR EACH ROW
EXECUTE FUNCTION fn_update_updated_at();

CREATE TRIGGER trg_update_updated_at_matchs
BEFORE UPDATE ON matchs FOR EACH ROW
EXECUTE FUNCTION fn_update_updated_at();

CREATE TRIGGER trg_update_updated_at_resultats
BEFORE UPDATE ON resultats FOR EACH ROW
EXECUTE FUNCTION fn_update_updated_at();

CREATE TRIGGER trg_update_updated_at_resultats_notes
BEFORE UPDATE ON resultats_notes FOR EACH ROW
EXECUTE FUNCTION fn_update_updated_at();

CREATE TRIGGER trg_update_updated_at_classements_finaux
BEFORE UPDATE ON classements_finaux FOR EACH ROW
EXECUTE FUNCTION fn_update_updated_at();

CREATE TRIGGER trg_update_updated_at_annonces
BEFORE UPDATE ON annonces FOR EACH ROW
EXECUTE FUNCTION fn_update_updated_at();

CREATE TRIGGER trg_update_updated_at_actualites
BEFORE UPDATE ON actualites FOR EACH ROW
EXECUTE FUNCTION fn_update_updated_at();

CREATE TRIGGER trg_update_updated_at_notifications
BEFORE UPDATE ON notifications FOR EACH ROW
EXECUTE FUNCTION fn_update_updated_at();

-- Fonction : journal sur mutations
CREATE FUNCTION fn_journal_mutations()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    INSERT INTO journal_activite (action, table_cible, enregistrement_id, anciennes_valeurs, created_at)
    VALUES ('DELETE', TG_TABLE_NAME, OLD.id, row_to_json(OLD), NOW());
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO journal_activite (action, table_cible, enregistrement_id, anciennes_valeurs, nouvelles_valeurs, created_at)
    VALUES ('UPDATE', TG_TABLE_NAME, NEW.id, row_to_json(OLD), row_to_json(NEW), NOW());
    RETURN NEW;
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO journal_activite (action, table_cible, enregistrement_id, nouvelles_valeurs, created_at)
    VALUES ('INSERT', TG_TABLE_NAME, NEW.id, row_to_json(NEW), NOW());
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Triggers de journal sur tables sensibles
CREATE TRIGGER trg_log_editions
AFTER INSERT OR UPDATE OR DELETE ON editions
FOR EACH ROW EXECUTE FUNCTION fn_journal_mutations();

CREATE TRIGGER trg_log_candidatures
AFTER INSERT OR UPDATE OR DELETE ON candidatures
FOR EACH ROW EXECUTE FUNCTION fn_journal_mutations();

CREATE TRIGGER trg_log_participants
AFTER INSERT OR UPDATE OR DELETE ON participants
FOR EACH ROW EXECUTE FUNCTION fn_journal_mutations();

CREATE TRIGGER trg_log_phases
AFTER INSERT OR UPDATE OR DELETE ON phases
FOR EACH ROW EXECUTE FUNCTION fn_journal_mutations();

CREATE TRIGGER trg_log_matchs
AFTER INSERT OR UPDATE OR DELETE ON matchs
FOR EACH ROW EXECUTE FUNCTION fn_journal_mutations();

CREATE TRIGGER trg_log_resultats
AFTER INSERT OR UPDATE OR DELETE ON resultats
FOR EACH ROW EXECUTE FUNCTION fn_journal_mutations();

CREATE TRIGGER trg_log_classements_finaux
AFTER INSERT OR UPDATE OR DELETE ON classements_finaux
FOR EACH ROW EXECUTE FUNCTION fn_journal_mutations();

CREATE TRIGGER trg_log_profils
AFTER INSERT OR UPDATE OR DELETE ON profils
FOR EACH ROW EXECUTE FUNCTION fn_journal_mutations();
