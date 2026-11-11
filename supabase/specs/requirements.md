# Spécification des Exigences : Frontend DevAs - Lot 0

## Vue d'ensemble

Lot 0 établit la fondation technique du frontend pour la plateforme « Question pour un DevAs ». Il couvre la configuration du projet, du thème visuel, des clients backend et des composants réutilisables qui serviront pour tous les lots suivants.

## Exigences Fonctionnelles

### EXG-001 : Structure du Projet

- Projet Next.js 16.4.5 avec App Router en TypeScript strict
- Répertoire source : `src/` pour composants, actions, requêtes
- Répertoire applicatif : `app/` pour routes et layouts
- Dossiers organisés par domaine : `components/ui`, `components/common`, `components/public`, `components/participant`, `components/admin`
- Aucun composant n'excède 250 lignes
- Variables d'environnement documentées dans `.env.example`

### EXG-002 : Charte Graphique et Thème Tailwind

- Couleurs principales définies comme variables de thème Tailwind :
  - **Vert principal** : #039846 (boutons, navigation active, validations)
  - **Orange accent** : #E56001 (appels à l'action ponctuels)
  - **Blanc** : #FFFFFF (fonds principaux)
  - **Gris foncé** : #1F2937 (titres, textes)
  - **Gris clair** : #F3F4F6 (fonds secondaires)
  - **Vert pâle** : #DDF4E5 (complément)
  - **Orange pâle** : #FFF0E2 (complément)

- Boutons arrondis (radius 8-12 px)
- Cartes avec bordure discrète et ombres très légères
- Badges de statut sobres
- Tableaux lisibles
- Formulaires aérés
- Pas de dégradés omniprésents, pas d'emojis comme icônes, pas d'animations excessives
- Interface sobre, pas de succession de blocs verts et orange

### EXG-003 : Typographie

- Famille titres : Montserrat (via next/font)
- Famille texte : Inter (via next/font)
- Sous-ensemble latin uniquement
- Charger via `next/font/google` avec `display: swap` pour performance
- Intégration dans `app/layout.tsx`

### EXG-004 : Clients Supabase

- **Client SSR** (`src/utils/supabase/client.ts`) : Utilisation côté client avec auth
- **Client Serveur** (`src/utils/supabase/server.ts`) : Utilisation côté serveur avec `cookies()`
- **Client Service** (`src/utils/supabase/service.ts`) : Clé de service pour Server Actions sensibles uniquement
- Clé de service JAMAIS exposée côté client (NEXT_PUBLIC)
- Variables : `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`

### EXG-005 : Middleware d'Authentification

- Middleware situé à `src/middleware.ts`
- Rafraîchit la session à chaque requête
- Redirige selon le rôle :
  - Non authentifié → autoriser accès public, bloquer `/participant`, `/admin`
  - Participant → `/participant/dashboard`
  - Admin/super_admin → `/admin/dashboard`
  - Invalide → `/connexion`
- Utilise les cookies pour persister la session
- Gère gracieusement les expirationsde session

### EXG-006 : Composants Communs

Tous les composants doivent respecter :
- Nommage clair et prévisible
- Props typées avec TypeScript
- Pas de logique métier (logique fonctionnelle isolée)
- Accessibilité (contraste, focus, aria-labels)
- Responsivité mobile-first
- Cohérence avec la charte graphique

Composants requis :
- **Button** : Variantes (primary, secondary, ghost, destructive), tailles (sm, md, lg), états (disabled, loading)
- **Badge** : Variantes de statut (success, warning, error, info, default)
- **Card** : Conteneur avec padding, bordure, ombre légère
- **Table** : Responsive, avec tri et pagination (composant, pas juste HTML brut)
- **Modal** : Confirmation, contenu personnalisé, overlay avec fermeture ESC
- **Toast** : Via Sonner, notifications success/error/info, auto-dismiss
- **Input** : Texte, email, password (afficher/masquer), avec label et validation
- **Select** : Dropdown, multi-select, recherche (shadcn/ui Combobox si besoin)
- **Checkbox** : Simple et groupe
- **Radio** : Simple et groupe
- **Textarea** : Avec resize, caractères restants si long
- **Loading** : Spinner, skeleton
- **Empty State** : Illustration, message, action CTA
- **Error State** : Message claire, bouton retry si pertinent
- **Form Wrapper** : Intégration react-hook-form, zod validation, messages d'erreur

### EXG-007 : Layouts des Trois Espaces

- **Layout public** (`app/(public)/layout.tsx`) : Header, footer, navigation sans authentification
- **Layout participant** (`app/(participant)/layout.tsx`) : Sidebar navigation, header avec profile, vérification RLS côté serveur
- **Layout admin** (`app/(admin)/layout.tsx`) : Sidebar complète des permissions, header avec statut, vérification RLS stricte

Chaque layout :
- Revérifie le rôle côté serveur (sécurité en profondeur)
- Charge le logo depuis `/public/logo.png` avec proportions respectées
- Gère les états loading et error
- Responsive (mobile collapse sidebar, desktop full)

### EXG-008 : Structure des Routes et Données

#### Routes principales de Lot 0 (skeletons uniquement, données hardcodées)

- `/` : Héros, édition en cours (placeholder), direct (placeholder), déroulement
- `/connexion` : Formulaire login
- `/participant/dashboard` : Placeholder avec infos utilisateur
- `/admin/dashboard` : Placeholder avec statut admin

Pas de vraies données pour Lot 0, juste la structure de routes.

#### Lectures : Requêtes typées

- Dossier `src/queries/`
- Fichiers par domaine : `editions.ts`, `participants.ts`, `resultats.ts`, etc.
- Fonctions typées retournant directement le résultat ou `null`
- Pas de logique métier dans les requêtes, juste SELECT avec filtres RLS

#### Écritures : Server Actions

- Dossier `src/actions/`
- Fichiers par domaine : `candidatures.ts`, `resultats.ts`, etc.
- Validation **zod** obligatoire
- Signature : `async function actionName(payload: ValidatedType) → Promise<{ok: boolean, message: string, erreurs?: Record<string, string[]>, data?: unknown}>`
- Appel de `revalidateTag` ou `revalidatePath` après écriture
- Gestion d'erreurs avec messages clairs en français
- Service role key utilisée UNIQUEMENT dans : création de compte Auth, URL signée Storage

### EXG-009 : Sécurité et RLS

- **Aucune donnée sensible** (email, téléphone, date naissance) ne doit être affichée publiquement
- Utiliser `v_participants_publics` pour l'annuaire public
- Tous les accès aux données sensibles doivent être contrôlés par RLS (base de source de vérité)
- Middleware vérifie le rôle, mais **RLS prend la décision finale**
- Aucune permission n'est vérifiée côté client ; vérifier dans la Server Action ou la requête

### EXG-010 : Performance Mobile

- Mobile-first design
- Objectif Lighthouse (profil mobile, 4G lente) :
  - Affichage principal < 2,5 secondes
  - JavaScript initial < 150 Ko (pages publiques)
  - Page classement < 100 Ko hors images
- `next/image` obligatoire pour toutes les images
- Polices en sous-ensemble latin
- Pas de bibliothèque lourde sur pages publiques

### EXG-011 : Accessibilité

- Contraste conforme (WCAG AA minimum)
- Focus visible sur tous les éléments interactifs
- Navigation au clavier complète
- Libellés sur tous les champs (`<label>` + `htmlFor` ou `aria-label`)
- `aria-live` pour notifications et mises à jour dynamiques
- Respect de `prefers-reduced-motion`
- Images avec `alt` descriptifs
- Boutons avec texte explicite ou `aria-label`

### EXG-012 : États et Messages

- **Chaque route** a ses états `loading.tsx` et `error.tsx`
- **États vides** soignés avec icône, message et CTA si pertinent
- **Messages d'erreur** clairs, en français, expliquant comment corriger
- **Notifications** (toasts) pour succès/erreur/info

### EXG-013 : Gestion des Erreurs

- Try-catch en Server Actions, retour `{ok: false, message, erreurs}`
- Affichage des erreurs métier via toast et formulaires
- Erreurs 404 et 500 avec pages vides cohérentes
- Pas de console.error exposée au client

### EXG-014 : Dépendances

- Versions exactes ou pinned, pas de ranges ouvertes
- Dépendances principales :
  - `next@16.4.5`
  - `react@19.3.0`
  - `tailwindcss@4`
  - `shadcn/ui` (installed via CLI, pinned versions)
  - `@supabase/ssr@^2`
  - `@supabase/supabase-js@^2`
  - `zod`
  - `react-hook-form`
  - `sonner` (toasts)
  - `lucide-react` (icônes)
  - `recharts` (graphiques, chargement à la demande)

## Critères d'Acceptation

- ✅ Configuration Tailwind avec couleurs DevAs en variables de thème
- ✅ Polices Montserrat (titres) et Inter (texte) chargées via next/font
- ✅ Trois clients Supabase (client, server, service) correctement isolés
- ✅ Middleware authentifie et redirige selon le rôle
- ✅ Tous les composants communs créés et testés visuellement
- ✅ Trois layouts (public, participant, admin) avec navigation et protection RLS
- ✅ Routes skeletons (`/`, `/connexion`, `/participant/dashboard`, `/admin/dashboard`)
- ✅ Structure `src/queries/`, `src/actions/` en place
- ✅ Lint et types TypeScript strict passent
- ✅ Aucune dépendance non pinned
- ✅ `.env.example` documenté

## Points d'Arrêt pour Validation

**Après ce lot, je fournirai** :
1. Ce fichier requirements.md
2. Un fichier design.md décrivant l'architecture technique
3. Un fichier tasks.md détaillant les étapes d'implémentation
4. Je m'arrêterai pour attendre ta validation avant de coder.

## Règles Métier à Respecter (Rappel)

Aucune règle métier métier n'est implémentée en Lot 0 (juste skeletons). Toutes seront respectées à partir du Lot 1.

- **RLS source de vérité** : Tous les contrôles d'accès sont RLS
- **Pas de calculs côté client** : Rangs, issues, classements viennent de la base
- **Participant en lecture seule** : Aucune modification possible
- **Données sensibles filtrées** : Jamais affichées publiquement

