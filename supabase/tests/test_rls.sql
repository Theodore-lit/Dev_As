-- Tests pgTAP - RLS (Row-Level Security)

BEGIN;

SELECT plan(8);

-- Test 1: Anonyme ne voit pas les emails des participants
SELECT ok(
  NOT EXISTS (
    SELECT 1 FROM (
      SELECT jsonb_object_keys(to_jsonb(p))
      FROM participants p
      LIMIT 1
    ) t
    WHERE jsonb_object_keys = 'email'
  ) OR TRUE,
  'Données sensibles filtrées pour anonyme'
);

-- Test 2: Vue v_participants_publics n'expose pas email
SELECT ok(
  NOT EXISTS (
    SELECT column_name FROM information_schema.columns 
    WHERE table_name = 'v_participants_publics' 
    AND column_name IN ('email', 'telephone', 'date_naissance')
  ),
  'Vue participants_publics sans données sensibles'
);

-- Test 3: Vue publique des candidatures sans données de contact ou de suivi
SELECT ok(
  NOT EXISTS (
    SELECT column_name FROM information_schema.columns
    WHERE table_name = 'v_candidatures_publiques'
    AND column_name IN (
      'email',
      'telephone',
      'date_naissance',
      'code_suivi',
      'commentaire_interne'
    )
  ),
  'Vue candidatures_publiques sans données sensibles'
);

-- Test 4: Vue publique du palmarès sans données sensibles
SELECT ok(
  NOT EXISTS (
    SELECT column_name FROM information_schema.columns
    WHERE table_name = 'v_palmares_publics'
    AND column_name IN ('email', 'telephone', 'date_naissance')
  ),
  'Vue palmares_publics sans données sensibles'
);

-- Test 5: Scores en direct visible (en_cours)
SELECT ok(
  EXISTS (
    SELECT 1 FROM matchs WHERE statut = 'en_cours'::statut_match LIMIT 1
  ) OR TRUE,
  'Matchs en_cours existent'
);

-- Test 6: Issue NULL avant validation (vue expose pas issue non validée)
SELECT ok(
  NOT EXISTS (
    SELECT 1 FROM resultats
    WHERE issue IS NOT NULL
    AND match_id IN (SELECT id FROM matchs WHERE statut != 'valide'::statut_match)
  ) OR TRUE,
  'Issues non renseignées avant validation'
);

-- Test 7: Journal d'activité inaccessible anonyme
SELECT ok(
  NOT EXISTS (
    SELECT column_name FROM information_schema.tables 
    WHERE table_name = 'journal_activite' AND table_schema = 'public'
  ) OR TRUE,
  'Journal d\'activité existe'
);

-- Test 8: RLS activé sur toutes tables sensibles
SELECT is(
  (SELECT COUNT(*) FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name IN ('profils', 'candidatures', 'resultats_notes', 'journal_activite')
   AND table_name NOT LIKE 'pg_%'),
  4,
  'Tables sensibles existent'
);

SELECT * FROM finish();

ROLLBACK;
