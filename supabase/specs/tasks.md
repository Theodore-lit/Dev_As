# Tâches d'Implémentation : Frontend DevAs - Lot 0

## Résumé des Tâches

Ce fichier détaille les étapes concrètes pour implémenter le Lot 0. Chaque tâche peut être complétée indépendamment, mais elles s'appuient les unes sur les autres.

**Arrêt prévu** : Après la création de design.md et tasks.md, je m'arrête pour validation avant de coder.

---

## Tâche 1 : Configuration de Tailwind 4 et Thème Couleurs

### Objectif
Configurer Tailwind CSS 4 avec Next.js 16.4.5 et intégrer les variables de couleurs DevAs.

### Étapes

1. **Mettre à jour `tailwind.config.ts`**
   - Définir les couleurs brand (vert #039846, orange #E56001, etc.)
   - Définir les couleurs neutres (gris foncé, gris clair)
   - Ajouter borderRadius personnalisés (8px, 10px)
   - Ajouter boxShadow card
   - Configurer fontFamily pour Montserrat et Inter

2. **Créer `src/globals.css`** (ou mettre à jour `app/globals.css`)
   - Importer Tailwind @layer directives
   - Définir variables CSS pour thème (optionnel mais recommandé pour flexibilité)
   - Reset global minimal

3. **Vérifier dans `next.config.ts`**
   - `@tailwindcss/turbopack` est configuré dans package.json ✓
   - Pas de conflits avec other config

4. **Tester avec storybook ou page test**
   - Créer une page `app/test-colors.tsx` (temporaire)
   - Afficher tous les boutons et badges avec couleurs brand
   - Vérifier contraste avec Lighthouse

### Fichiers à Modifier/Créer
- `tailwind.config.ts` (modifier)
- `app/globals.css` (créer ou mettre à jour)
- `next.config.ts` (vérifier)

---

## Tâche 2 : Ajouter les Polices via next/font

### Objectif
Charger Montserrat (titres) et Inter (texte) en sous-ensemble latin avec `display: swap`.

### Étapes

1. **Mettre à jour `app/layout.tsx`**
   - Importer `Montserrat` et `Inter` de `next/font/google`
   - Créer instances avec `subsets: ['latin']` et `display: 'swap'`
   - Ajouter variables CSS (`--font-montserrat`, `--font-inter`)

2. **Intégrer dans Tailwind (`tailwind.config.ts`)**
   - `fontFamily.sans: var(--font-inter)`
   - `fontFamily.serif: var(--font-montserrat)` ou utiliser classe `.font-serif`

3. **Appliquer dans `app/globals.css`**
   - `body { font-family: var(--font-inter); }`
   - `h1, h2, h3 { font-family: var(--font-montserrat); }`

4. **Vérifier la performance**
   - `next build` doit montrer les fichiers de polices
   - Pas de FOUT (flash of unstyled text)

### Fichiers à Modifier/Créer
- `app/layout.tsx` (modifier)
- `tailwind.config.ts` (ajouter fontFamily)
- `app/globals.css` (ajouter règles typographie)

---

## Tâche 3 : Créer les Clients Supabase (3 fichiers)

### Objectif
Isoler les trois clients Supabase (client browser, server, service) avec leurs contextes respectifs.

### Étapes

1. **Créer `src/utils/supabase/client.ts`**
   - Importer `createBrowserClient` de `@supabase/ssr`
   - Retourner une instance avec NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY
   - Pas d'authentification spéciale (utilise la session cookies)

2. **Créer `src/utils/supabase/server.ts`**
   - Importer `createServerClient` de `@supabase/ssr` et `cookies` de `next/headers`
   - Fonction async `createClient()` retournant une instance SSR
   - Passer les cookies getter/setter pour session persistance

3. **Créer `src/utils/supabase/service.ts`**
   - Importer `createClient` de `@supabase/supabase-js`
   - Utiliser `SUPABASE_SERVICE_ROLE_KEY` (JAMAIS NEXT_PUBLIC)
   - Ajouter un commentaire d'avertissement : "⚠️ Service role - Use ONLY for auth/storage admin tasks"

4. **Mettre à jour `.env` et `.env.example`**
   ```
   NEXT_PUBLIC_SUPABASE_URL=http://localhost:54322
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...
   ```

5. **Tester les imports**
   - Créer un test simple pour vérifier que les clients se créent sans erreur
   - Ou appeler `createClient()` dans une Server Component test

### Fichiers à Modifier/Créer
- `src/utils/supabase/client.ts` (créer)
- `src/utils/supabase/server.ts` (créer)
- `src/utils/supabase/service.ts` (créer)
- `.env` (mettre à jour avec vraies valeurs depuis `supabase status`)
- `.env.example` (documenter les variables)

---

## Tâche 4 : Créer le Middleware d'Authentification

### Objectif
Mettre en place le middleware qui rafraîchit la session et redirige selon le rôle.

### Étapes

1. **Créer `src/middleware.ts`**
   - Importer `NextRequest`, `NextResponse` de `next/server`
   - Importer `createServerClient` de `@supabase/ssr`
   - Définir PUBLIC_ROUTES, ADMIN_ROUTES, PARTICIPANT_ROUTES
   - Fonction middleware :
     - Créer un client SSR
     - Récupérer session et profil utilisateur
     - Vérifier la route demandée
     - Rediriger si accès refusé

2. **Configuration du matcher**
   - Exclure fichiers statiques : `_next/static`, `_next/image`, `favicon.ico`, images
   - Matcher tous les chemins au-delà

3. **Tester le middleware**
   - Lancer `npm run dev`
   - Accéder à `/` sans auth → OK
   - Accéder à `/participant/dashboard` sans auth → redirect `/connexion`
   - Accéder à `/admin/dashboard` sans auth → redirect `/connexion`

### Fichiers à Modifier/Créer
- `src/middleware.ts` (créer)

---

## Tâche 5 : Créer les Composants Communs (shadcn/ui + customs)

### Objectif
Mettre en place tous les composants réutilisables en `src/components/ui/`.

### Sous-tâches

#### 5.1 : Initialiser shadcn/ui

```bash
npx shadcn-ui@latest init -d
# Choix : TypeScript, tailwind custom config, ESLint, yes for other options
```

Cela crée `components/ui/` et `lib/utils.ts`.

#### 5.2 : Ajouter les composants shadcn/ui nécessaires

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add checkbox
npx shadcn-ui@latest add radio-group
npx shadcn-ui@latest add select
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add table
npx shadcn-ui@latest add form
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add skeleton
npx shadcn-ui@latest add alert
```

#### 5.3 : Créer/Adapter les Composants Personnalisés

Créer dans `src/components/ui/` :

- **badge.tsx** : Variantes pour statuts (en_attente, qualifie, elimine, finaliste, champion)
- **loading-spinner.tsx** : Spinner SVG ou `<Skeleton />`
- **empty-state.tsx** : Icône, titre, message, CTA
- **error-state.tsx** : Icône erreur, message, bouton retry

#### 5.4 : Installer Sonner pour Toasts

```bash
npm install sonner
```

Ajouter `<Toaster />` dans `app/layout.tsx`.

### Fichiers à Modifier/Créer
- `src/components/ui/` (tous les fichiers shadcn/ui + customs)
- `src/lib/utils.ts` (fourni par shadcn)
- `app/layout.tsx` (ajouter `<Toaster />`)

---

## Tâche 6 : Créer les Composants Communs (shared)

### Objectif
Créer les composants partagés entre les trois espaces (header, footer, sidebar, etc.).

### Étapes

1. **Créer `src/components/common/header.tsx`**
   - Logo centré ou aligné à gauche
   - Navigation responsive (mobile: burger menu, desktop: links)
   - Bouton login/profil selon contexte

2. **Créer `src/components/common/footer.tsx`**
   - Liens légaux, réseaux sociaux, copyright
   - Sobre et simple

3. **Créer `src/components/common/sidebar-nav.tsx`**
   - Props: `role` (public | participant | admin)
   - Liens actifs avec couleur brand-primary
   - Responsive (collapse sur mobile)

4. **Créer `src/components/common/brand-logo.tsx`**
   - Affiche `/public/logo.png` avec Image et proportions
   - Prend en prop la taille

5. **Tests visuels**
   - Créer une page `app/test-components.tsx` (temporaire)
   - Afficher tous les composants

### Fichiers à Modifier/Créer
- `src/components/common/header.tsx` (créer)
- `src/components/common/footer.tsx` (créer)
- `src/components/common/sidebar-nav.tsx` (créer)
- `src/components/common/brand-logo.tsx` (créer)

---

## Tâche 7 : Créer les Trois Layouts

### Objectif
Créer les layouts pour public, participant et admin avec navigation et sécurité.

### Étapes

#### 7.1 : Layout Public (`app/(public)/layout.tsx`)

```typescript
export default function PublicLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
```

#### 7.2 : Layout Participant (`app/(participant)/layout.tsx`)

```typescript
export default async function ParticipantLayout({ children }) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) redirect('/connexion');
  
  const { data: profile } = await supabase
    .from('profils')
    .select('role')
    .eq('id', session.user.id)
    .single();
  
  if (profile?.role !== 'participant') redirect('/');
  
  return (
    <div className="flex">
      <SidebarNav role="participant" />
      <div className="flex-1">
        <Header user={session.user} />
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
}
```

#### 7.3 : Layout Admin (`app/(admin)/layout.tsx`)

Similaire, mais vérifie `role === 'admin' || 'super_admin'`.

#### 7.4 : Root Layout (`app/layout.tsx`)

- Ajouter polices
- Ajouter providers (Toaster, etc.)
- Ajouter metadata
- Ajouter Tailwind classes

### Fichiers à Modifier/Créer
- `app/(public)/layout.tsx` (créer)
- `app/(participant)/layout.tsx` (créer)
- `app/(admin)/layout.tsx` (créer)
- `app/layout.tsx` (mettre à jour)

---

## Tâche 8 : Créer les Routes Skeletons

### Objectif
Créer les routes de base avec contenu placeholder.

### Étapes

1. **Accueil** (`app/(public)/page.tsx`)
   - Afficher le logo
   - "Bienvenue sur Question pour un DevAs"
   - Boutons placeholder pour public/connexion

2. **Connexion** (`app/(public)/connexion/page.tsx`)
   - Placeholder : "Formulaire de connexion"
   - Pas encore fonctionnel (Lot 2)

3. **Dashboard Participant** (`app/(participant)/dashboard/page.tsx`)
   - Afficher le nom de l'utilisateur
   - "Dashboard Participant"
   - Placeholder pour statut, phase, etc.

4. **Dashboard Admin** (`app/(admin)/dashboard/page.tsx`)
   - "Dashboard Admin"
   - Placeholder pour stats

5. **Not Found** (`app/not-found.tsx`)
   - Message 404 sobr

### Fichiers à Modifier/Créer
- `app/(public)/page.tsx` (créer)
- `app/(public)/connexion/page.tsx` (créer)
- `app/(public)/connexion/loading.tsx` (créer)
- `app/(public)/connexion/error.tsx` (créer)
- `app/(participant)/dashboard/page.tsx` (créer)
- `app/(participant)/dashboard/loading.tsx` (créer)
- `app/(admin)/dashboard/page.tsx` (créer)
- `app/(admin)/dashboard/loading.tsx` (créer)
- `app/not-found.tsx` (créer)

---

## Tâche 9 : Créer la Structure des Requêtes et Actions

### Objectif
Mettre en place les dossiers `src/queries/` et `src/actions/` avec quelques exemples.

### Étapes

1. **Créer `src/queries/`** (vide pour Lot 0)
   - Fichier placeholder : `src/queries/README.md`
   - Documenter la structure : "Une fonction par domaine"

2. **Créer `src/actions/`** (vide pour Lot 0)
   - Fichier placeholder : `src/actions/README.md`
   - Documenter la signature : "{ok, message, erreurs, data}"

3. **Créer `src/lib/validators.ts`**
   - Schéma Zod placeholder
   - Documenter l'importation

4. **Créer `src/lib/errors.ts`**
   - Classes custom d'erreurs (optionnel pour Lot 0)

### Fichiers à Modifier/Créer
- `src/queries/README.md` (créer)
- `src/actions/README.md` (créer)
- `src/lib/validators.ts` (créer)
- `src/utils/constants.ts` (créer)

---

## Tâche 10 : Vérifications Finales et Lint

### Objectif
S'assurer que le code compile et que lint passe.

### Étapes

1. **Lint et Types**
   ```bash
   npm run lint
   npm run build
   ```
   - Corriger tout erreur TypeScript
   - Corriger tout warning ESLint

2. **Pas de dépendances non-pinned**
   - Vérifier `package.json` : aucun `^` ou `~` devant les versions
   - Utiliser versions exactes

3. **Tester en local**
   ```bash
   npm run dev
   # Accéder à http://localhost:3000
   # Vérifier :
   # - Logo s'affiche
   # - Couleurs brand visibles
   # - Polices chargées
   # - Pas d'erreur console
   ```

4. **Lighthouse (optionnel)**
   - Chrome DevTools → Lighthouse
   - Profil Mobile, 4G lente
   - Note de performance (target > 90 pour Lot 0)

### Fichiers à Vérifier
- `package.json`
- `.env` (pas de secrets en dur)
- `.env.example` (documenté)
- `tsconfig.json` (strict mode on)
- `eslint.config.mjs` (hérité)

---

## Tâche 11 : Documenter et Arrêter

### Objectif
Résumer ce qui a été fait et attendre la validation.

### Étapes

1. **Créer `README.md` pour Lot 0**
   - Résumer la structure créée
   - Commandes pour lancer le projet
   - Commandes lint/test

2. **Documenter `.env.example`**
   ```
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   SUPABASE_SERVICE_ROLE_KEY=
   ```

3. **Arrêter et Rapporter**
   - ✅ Tailwind + thème couleurs configurés
   - ✅ Polices chargées
   - ✅ 3 clients Supabase isolés
   - ✅ Middleware authentification en place
   - ✅ Composants communs créés
   - ✅ Layouts trois espaces
   - ✅ Routes skeletons
   - ✅ Lint et types passent
   - **EN ATTENTE** : Validation avant Lot 1

---

## Ordre de Priorité

Si tu dois choisir par importance (Lot 0 minimum viable) :

1. **Tâche 1** : Tailwind + Thème (fondation visuelle)
2. **Tâche 2** : Polices (typographie)
3. **Tâche 3** : Clients Supabase (données)
4. **Tâche 4** : Middleware (sécurité)
5. **Tâche 5** : Composants communs (réutilisabilité)
6. **Tâche 6** : Composants partagés (structure UI)
7. **Tâche 7** : Layouts (navigation)
8. **Tâche 8** : Routes skeletons (app structure)
9. **Tâche 9** : Requêtes/Actions (préparation données)
10. **Tâche 10** : Vérifications (qualité)
11. **Tâche 11** : Documentation (transfert)

---

## Résumé des Fichiers Créés/Modifiés

### Créés
- `tailwind.config.ts` (rewrite)
- `app/globals.css`
- `src/utils/supabase/client.ts`
- `src/utils/supabase/server.ts`
- `src/utils/supabase/service.ts`
- `src/middleware.ts`
- `src/components/ui/badge.tsx` (+ shadcn/ui)
- `src/components/ui/loading-spinner.tsx`
- `src/components/ui/empty-state.tsx`
- `src/components/ui/error-state.tsx`
- `src/components/common/header.tsx`
- `src/components/common/footer.tsx`
- `src/components/common/sidebar-nav.tsx`
- `src/components/common/brand-logo.tsx`
- `app/(public)/layout.tsx`
- `app/(participant)/layout.tsx`
- `app/(admin)/layout.tsx`
- `app/(public)/page.tsx`
- `app/(public)/connexion/page.tsx`
- `app/(public)/connexion/loading.tsx`
- `app/(public)/connexion/error.tsx`
- `app/(participant)/dashboard/page.tsx`
- `app/(participant)/dashboard/loading.tsx`
- `app/(admin)/dashboard/page.tsx`
- `app/(admin)/dashboard/loading.tsx`
- `app/not-found.tsx`
- `src/queries/README.md`
- `src/actions/README.md`
- `src/lib/validators.ts`
- `src/utils/constants.ts`

### Modifiés
- `app/layout.tsx` (polices, providers)
- `.env` (variables Supabase)
- `.env.example` (documentation)
- `package.json` (vérifier versions exactes)

---

**Prochaine étape** : Validation du Spec par l'utilisateur avant implémentation.

