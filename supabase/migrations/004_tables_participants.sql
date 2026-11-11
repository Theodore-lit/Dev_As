-- Task 4: Tables participants et jury

CREATE TABLE participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  edition_id UUID NOT NULL REFERENCES editions(id) ON DELETE CASCADE,
  candidature_id UUID UNIQUE REFERENCES candidatures(id) ON DELETE SET NULL,
  profil_id UUID UNIQUE REFERENCES profils(id) ON DELETE SET NULL,
  numero INTEGER NOT NULL,
  nom VARCHAR NOT NULL,
  prenom VARCHAR NOT NULL,
  date_naissance DATE,
  sexe CHAR(1),
  etablissement VARCHAR NOT NULL,
  classe_niveau VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  telephone VARCHAR,
  photo_path VARCHAR,
  publie BOOLEAN NOT NULL DEFAULT false,
  statut statut_participant NOT NULL DEFAULT 'en_attente',
  elimine_en_phase_id UUID REFERENCES phases(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (edition_id, numero),
  CHECK (statut IN ('en_attente', 'en_competition', 'elimine', 'finaliste', 'champion'))
);

CREATE INDEX idx_participants_edition_numero ON participants(edition_id, numero);
CREATE INDEX idx_participants_edition_statut ON participants(edition_id, statut);
CREATE INDEX idx_participants_profil ON participants(profil_id);
CREATE INDEX idx_participants_nom_prenom ON participants(nom, prenom);
CREATE INDEX idx_participants_publie ON participants(publie);

-- jury_membres
CREATE TABLE jury_membres (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom VARCHAR NOT NULL,
  prenom VARCHAR NOT NULL,
  fonction VARCHAR NOT NULL,
  etablissement VARCHAR NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_jury_membres_nom_prenom ON jury_membres(nom, prenom);
