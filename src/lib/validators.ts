import { z } from 'zod';

// Auth
export const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
});

export type LoginInput = z.infer<typeof loginSchema>;

// Candidatures
export const candidatureSchema = z.object({
  edition_id: z.string().uuid('Édition invalide'),
  nom: z
    .string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères'),
  prenom: z
    .string()
    .min(2, 'Le prénom doit contenir au moins 2 caractères')
    .max(100, 'Le prénom ne peut pas dépasser 100 caractères'),
  date_naissance: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), 'Date de naissance invalide')
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
  sexe: z
    .enum(['M', 'F'], { message: 'Sexe invalide' })
    .optional(),
  etablissement: z
    .string()
    .min(2, "L'établissement doit contenir au moins 2 caractères")
    .max(200, "L'établissement ne peut pas dépasser 200 caractères"),
  classe_niveau: z
    .string()
    .min(1, 'La classe/niveau est requise')
    .max(50, 'La classe/niveau ne peut pas dépasser 50 caractères'),
  email: z.string().email('Email invalide'),
  telephone: z
    .string()
    .regex(/^[0-9+\s\-().]+$/, 'Numéro de téléphone invalide')
    .max(20, 'Le numéro de téléphone ne peut pas dépasser 20 caractères')
    .optional()
    .or(z.literal('')),
  informations: z
    .string()
    .max(1000, 'Les informations supplémentaires ne peuvent pas dépasser 1000 caractères')
    .optional()
    .or(z.literal('')),
});

export type CandidatureInput = z.infer<typeof candidatureSchema>;

// Participants
export const participantSchema = z.object({
  prenom: z.string().min(1, 'Prénom requis'),
  nom: z.string().min(1, 'Nom requis'),
  etablissement: z.string().min(1, 'Établissement requis'),
  classe_niveau: z.string().min(1, 'Classe/Niveau requis'),
});

export type ParticipantInput = z.infer<typeof participantSchema>;

// Matchs & Results
export const matchResultSchema = z.object({
  match_id: z.string().uuid(),
  participant_id: z.string().uuid(),
  score: z.number().int().min(0, 'Le score ne peut pas être négatif'),
  rang: z.number().int().min(1, 'Le rang doit être positif').optional(),
  issue: z.enum(['qualifie', 'barrage', 'elimine', 'finaliste', 'champion']).optional(),
});

export type MatchResultInput = z.infer<typeof matchResultSchema>;
