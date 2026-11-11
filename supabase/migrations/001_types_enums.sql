-- Task 1: Types énumérés
-- Tous les énumérés utilisés dans le schéma

CREATE TYPE role_utilisateur AS ENUM (
  'super_admin',
  'admin',
  'participant'
);

CREATE TYPE statut_edition AS ENUM (
  'preparation',
  'candidatures_ouvertes',
  'en_cours',
  'terminee',
  'archivee'
);

CREATE TYPE statut_candidatura AS ENUM (
  'en_attente',
  'acceptee',
  'refusee',
  'liste_attente'
);

CREATE TYPE type_phase AS ENUM (
  'qualification',
  'barrage',
  'tour',
  'demi_finale',
  'finale'
);

CREATE TYPE statut_match AS ENUM (
  'planifie',
  'en_cours',
  'termine',
  'valide'
);

CREATE TYPE issue_resultat AS ENUM (
  'qualifie',
  'barrage',
  'elimine',
  'finaliste',
  'champion'
);

CREATE TYPE statut_participant AS ENUM (
  'en_attente',
  'en_competition',
  'elimine',
  'finaliste',
  'champion'
);

CREATE TYPE cible_annonce AS ENUM (
  'public',
  'participants'
);

CREATE TYPE statut_publication AS ENUM (
  'brouillon',
  'publiee'
);
