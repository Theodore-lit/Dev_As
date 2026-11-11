-- Task 6: Tables classement, annonces, notifications

CREATE TABLE classements_finaux (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  edition_id UUID NOT NULL REFERENCES editions(id) ON DELETE CASCADE,
  participant_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  rang INTEGER NOT NULL,
  titre VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (edition_id, participant_id),
  UNIQUE (edition_id, rang)
);

CREATE INDEX idx_classements_finaux_edition_rang ON classements_finaux(edition_id, rang);
CREATE INDEX idx_classements_finaux_participant ON classements_finaux(participant_id);

-- annonces
CREATE TABLE annonces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  edition_id UUID NOT NULL REFERENCES editions(id) ON DELETE CASCADE,
  titre VARCHAR NOT NULL,
  contenu TEXT NOT NULL,
  categorie VARCHAR,
  cible cible_annonce NOT NULL,
  statut statut_publication NOT NULL DEFAULT 'brouillon',
  publie_le TIMESTAMP WITH TIME ZONE,
  auteur_id UUID NOT NULL REFERENCES profils(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_annonces_edition_statut ON annonces(edition_id, statut);
CREATE INDEX idx_annonces_cible_statut ON annonces(cible, statut);

-- actualites
CREATE TABLE actualites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titre VARCHAR NOT NULL,
  resume TEXT,
  contenu TEXT NOT NULL,
  categorie VARCHAR,
  image_path VARCHAR,
  statut statut_publication NOT NULL DEFAULT 'brouillon',
  publie_le TIMESTAMP WITH TIME ZONE,
  auteur_id UUID NOT NULL REFERENCES profils(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_actualites_statut_publie_le ON actualites(statut, publie_le);
CREATE INDEX idx_actualites_auteur ON actualites(auteur_id);

-- notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profil_id UUID NOT NULL REFERENCES profils(id) ON DELETE CASCADE,
  annonce_id UUID REFERENCES annonces(id) ON DELETE SET NULL,
  message TEXT NOT NULL,
  lue BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notifications_profil_lue ON notifications(profil_id, lue);
CREATE INDEX idx_notifications_profil_created ON notifications(profil_id, created_at);
