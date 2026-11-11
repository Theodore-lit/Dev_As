/**
 * Application-wide constants
 */

// Colors
export const COLORS = {
  primary: '#039846',
  accent: '#E56001',
  success: '#039846',
  warning: '#E56001',
  error: '#ef4444',
  lightGreen: '#DDF4E5',
  lightOrange: '#FFF0E2',
  darkGray: '#1F2937',
  lightGray: '#F3F4F6',
};

// Statuses
export const PARTICIPANT_STATUSES = [
  'en_attente',
  'en_competition',
  'elimine',
  'finaliste',
  'champion',
] as const;

export const CANDIDATURE_STATUSES = [
  'en_attente',
  'acceptee',
  'refusee',
  'liste_attente',
] as const;

export const MATCH_STATUSES = ['planifie', 'en_cours', 'termine', 'valide'] as const;

export const ISSUE_STATUSES = [
  'qualifie',
  'barrage',
  'elimine',
  'finaliste',
  'champion',
] as const;

// Phase types
export const PHASE_TYPES = [
  'qualification',
  'barrage',
  'tour',
  'demi_finale',
  'finale',
] as const;

// Pagination
export const ITEMS_PER_PAGE = 20;
export const MAX_FILE_SIZE = 300 * 1024; // 300 KB

// Routes
export const PUBLIC_ROUTES = [
  '/',
  '/connexion',
  '/candidacy',
  '/editions',
  '/participants',
  '/resultats',
  '/palmares',
  '/actualites',
] as const;

export const ADMIN_ROUTES = ['/admin'] as const;
export const PARTICIPANT_ROUTES = ['/participant'] as const;

// Form validation
export const MIN_PASSWORD_LENGTH = 8;
export const MAX_NAME_LENGTH = 50;
export const MAX_EMAIL_LENGTH = 255;

// Costs (in FCFA)
export const PARTICIPATION_FEE = 500;
