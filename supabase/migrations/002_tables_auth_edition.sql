-- Task 2: Tables auth, éditions, phases

-- profils (liée à auth.users)
CREATE TABLE profils (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role role_utilisateur NOT NULL DEFAULT 'participant',
  nom VARCHAR NOT NULL,
  prenom VARCHAR NOT NULL,
  actif BOOLEAN NOT NULL DEFAULT false,
  permissions TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_profils_role ON profils(role);
CREATE INDEX idx_profils_actif ON profils(actif);
CREATE INDEX idx_profils_permissions ON profils USING GIN(permissions);

-- editions
CREATE TABLE editions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  annee INTEGER NOT NULL UNIQUE,
  nom VARCHAR NOT NULL,
  description TEXT,
  statut statut_edition NOT NULL DEFAULT 'preparation',
  date_debut TIMESTAMP WITH TIME ZONE,
  date_fin TIMESTAMP WITH TIME ZONE,
  candidatures_ouvertes BOOLEAN NOT NULL DEFAULT false,
  score_max_defaut INTEGER NOT NULL DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_editions_annee ON editions(annee);
CREATE INDEX idx_editions_statut ON editions(statut);
CREATE INDEX idx_editions_candidatures_ouvertes ON editions(candidatures_ouvertes);

-- modeles_phases (configuration par défaut)
CREATE TABLE modeles_phases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ordre INTEGER NOT NULL UNIQUE,
  nom VARCHAR NOT NULL,
  type type_phase NOT NULL,
  nb_groupes INTEGER NOT NULL DEFAULT 1,
  nb_qualifies_par_groupe INTEGER NOT NULL DEFAULT 1,
  nb_barrage_par_groupe INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_modeles_phases_ordre ON modeles_phases(ordre);

-- phases (par édition)
CREATE TABLE phases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  edition_id UUID NOT NULL REFERENCES editions(id) ON DELETE CASCADE,
  ordre INTEGER NOT NULL,
  nom VARCHAR NOT NULL,
  type type_phase NOT NULL,
  nb_groupes INTEGER NOT NULL DEFAULT 1,
  nb_qualifies_par_groupe INTEGER NOT NULL DEFAULT 1,
  nb_barrage_par_groupe INTEGER NOT NULL DEFAULT 0,
  score_max_defaut INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (edition_id, ordre) DEFERRABLE INITIALLY DEFERRED
);

CREATE INDEX idx_phases_edition_ordre ON phases(edition_id, ordre);
CREATE INDEX idx_phases_edition_type ON phases(edition_id, type);
