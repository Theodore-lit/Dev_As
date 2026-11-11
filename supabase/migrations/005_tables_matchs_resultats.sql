-- Task 5: Tables matchs et résultats

CREATE TABLE matchs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phase_id UUID NOT NULL REFERENCES phases(id) ON DELETE CASCADE,
  libelle VARCHAR NOT NULL,
  groupe INTEGER,
  date_heure TIMESTAMP WITH TIME ZONE,
  lieu VARCHAR,
  score_max INTEGER NOT NULL,
  statut statut_match NOT NULL DEFAULT 'planifie',
  valide_par UUID REFERENCES profils(id),
  valide_le TIMESTAMP WITH TIME ZONE,
  deverrouille_le TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_matchs_phase_groupe ON matchs(phase_id, groupe);
CREATE INDEX idx_matchs_statut ON matchs(statut);
CREATE INDEX idx_matchs_date_heure ON matchs(date_heure);

-- match_jury
CREATE TABLE match_jury (
  match_id UUID NOT NULL REFERENCES matchs(id) ON DELETE CASCADE,
  jury_membre_id UUID NOT NULL REFERENCES jury_membres(id) ON DELETE CASCADE,
  PRIMARY KEY (match_id, jury_membre_id)
);

-- resultats
CREATE TABLE resultats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES matchs(id) ON DELETE CASCADE,
  participant_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  score INTEGER CHECK (score >= 0),
  rang_departage SMALLINT,
  rang SMALLINT,
  issue issue_resultat,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (match_id, participant_id)
);

CREATE INDEX idx_resultats_match_rang ON resultats(match_id, rang);
CREATE INDEX idx_resultats_participant ON resultats(participant_id);
CREATE INDEX idx_resultats_issue ON resultats(issue);

-- resultats_notes
CREATE TABLE resultats_notes (
  resultat_id UUID PRIMARY KEY REFERENCES resultats(id) ON DELETE CASCADE,
  commentaire TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
