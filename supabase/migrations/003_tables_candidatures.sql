-- Task 3: Table candidatures

CREATE TABLE candidatures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  edition_id UUID NOT NULL REFERENCES editions(id) ON DELETE CASCADE,
  nom VARCHAR NOT NULL,
  prenom VARCHAR NOT NULL,
  date_naissance DATE,
  sexe CHAR(1) CHECK (sexe IN ('M', 'F')),
  etablissement VARCHAR NOT NULL,
  classe_niveau VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  telephone VARCHAR,
  photo_path VARCHAR,
  informations TEXT,
  code_suivi VARCHAR NOT NULL UNIQUE,
  statut statut_candidatura NOT NULL DEFAULT 'en_attente',
  commentaire_interne TEXT,
  traite_par UUID REFERENCES profils(id),
  traite_le TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index unique avec expression pour email case-insensitive par édition
CREATE UNIQUE INDEX idx_candidatures_edition_email_unique ON candidatures(edition_id, LOWER(email));

-- Autres indexes
CREATE INDEX idx_candidatures_edition_statut ON candidatures(edition_id, statut);
CREATE INDEX idx_candidatures_code_suivi ON candidatures(code_suivi);
CREATE INDEX idx_candidatures_nom_prenom ON candidatures(nom, prenom);
