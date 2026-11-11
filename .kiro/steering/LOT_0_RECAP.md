# Lot 0 - Récapitulatif et Guide Continuation

## 🎯 Objectif Lot 0
Setup complet du frontend "Question pour un DevAs" (Next.js 16.4.5, React 19, TypeScript strict, Tailwind 4, shadcn/ui).

## ✅ État Final

### 1. **Structure Projet**
```
c:\Users\theodore.lima\Documents\_devProjects\dev_as/
├── app/
│   ├── layout.tsx                      # Root layout: Header + Footer
│   ├── page.tsx                        # Home page: /
│   ├── not-found.tsx                   # 404 page
│   ├── admin/
│   │   ├── layout.tsx                  # Admin wrapper avec sidebar
│   │   └── page.tsx                    # Admin dashboard: /admin
│   ├── participant/
│   │   ├── layout.tsx                  # Participant wrapper avec sidebar
│   │   └── page.tsx                    # Participant dashboard: /participant
│   └── (public)/
│       └── connexion/
│           └── page.tsx                # Login page: /connexion
├── src/
│   ├── components/
│   │   ├── ui/                         # Composants réutilisables
│   │   │   ├── button.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── empty-state.tsx
│   │   │   ├── error-state.tsx
│   │   │   ├── loading-spinner.tsx
│   │   │   └── [9 autres composants]
│   │   └── common/                     # Composants partagés
│   │       ├── header.tsx              # Navbar avec auth
│   │       ├── footer.tsx              # Footer global
│   │       └── brand-logo.tsx          # Logo DevAs
│   ├── utils/
│   │   ├── supabase/
│   │   │   ├── client.ts               # Client-side Supabase
│   │   │   ├── server.ts               # Server-side Supabase
│   │   │   └── service.ts              # Service role Supabase
│   │   ├── constants.ts                # Constantes app
│   │   └── [autres utilitaires]
│   ├── lib/
│   │   ├── validators.ts               # Validateurs Zod
│   │   └── [lib utilities]
│   ├── types/
│   │   └── database.ts                 # Types database générés
│   └── middleware.ts                   # Auth middleware + redirects
├── public/
│   ├── logo.png
│   ├── favicon.png
│   └── [assets]
├── tailwind.config.ts                  # Config Tailwind avec charte DevAs
├── next.config.ts
├── tsconfig.json
└── package.json
```

### 2. **Routes Implémentées**
| Route | Fichier | Accès | Description |
|-------|---------|-------|-------------|
| `/` | `app/page.tsx` | Public | Accueil avec Header + Footer |
| `/connexion` | `app/(public)/connexion/page.tsx` | Public | Formulaire login |
| `/admin` | `app/admin/page.tsx` | Admin only | Dashboard admin |
| `/participant` | `app/participant/page.tsx` | Participant only | Dashboard participant |
| `404` | `app/not-found.tsx` | All | Page erreur |

### 3. **Authentification & Middleware**
- **Fichier**: `src/middleware.ts`
- **Logique**:
  - Vérifie la session utilisateur
  - Redirige les non-authentifiés vers `/connexion`
  - Redirige les admins non-autorisés depuis `/admin` vers `/`
  - Redirige les participants non-autorisés depuis `/participant` vers `/`
- **Flow**:
  1. User accède `/admin` → Middleware vérifie session + role
  2. Si admin/super_admin → Allowed
  3. Si non admin → Redirect `/`
  4. Si non authentifié → Redirect `/connexion`

### 4. **Clients Supabase**
Trois clients isolés dans `src/utils/supabase/`:

#### `client.ts` (Client-side)
```typescript
// Utilisation dans les Client Components
const supabase = createClient();
const { data: users } = await supabase.from('users').select('*');
```
- Utilisé dans les composants React côté client
- Accès limité par RLS policies

#### `server.ts` (Server-side)
```typescript
// Utilisation dans les Server Components & Actions
const supabase = await createClient();
const { data } = await supabase.from('users').select('*');
```
- Utilisé dans les routes, layouts, server actions
- Authentifié avec la session utilisateur actuelle
- Respecte les RLS policies

#### `service.ts` (Service Role)
```typescript
// Utilisation côté backend pour opérations système
const supabase = createServiceClient();
const { data } = await supabase.from('users').select('*');
```
- **À utiliser UNIQUEMENT** dans les scripts backend/API routes
- **Ne JAMAIS** exposer côté client
- Bypassé les RLS policies

### 5. **Composants UI Créés**

**Core Components** (`src/components/ui/`):
- `Button.tsx` - Bouton avec variants (primary, secondary, danger, ghost)
- `Badge.tsx` - Tags/badges avec couleurs thème
- `Card.tsx` - Conteneur avec border/shadow
- `Input.tsx` - Input text avec validation
- `Textarea.tsx` - Textarea pour formulaires
- `Select.tsx` - Dropdown select
- `Checkbox.tsx` - Checkbox input
- `Modal.tsx` - Modal/dialog box
- `Toast.tsx` - Notifications temporaires
- `LoadingSpinner.tsx` - Spinner loading
- `ErrorState.tsx` - Page erreur avec message
- `EmptyState.tsx` - Page vide avec message
- `FormField.tsx` - Wrapper form field label+input
- `Tabs.tsx` - Onglets navigables

**Common Components** (`src/components/common/`):
- `Header.tsx` - Navbar global avec auth
- `Footer.tsx` - Footer global
- `BrandLogo.tsx` - Logo DevAs

### 6. **Thème Tailwind & Couleurs**

Configuré dans `tailwind.config.ts` avec la charte DevAs:

```typescript
colors: {
  vert: '#039846',      // Vert principal
  orange: '#E56001',    // Orange accent
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    // ... jusqu'à 950
  }
}
```

**Polices** (via `next/font`):
- `Montserrat` - Headings (font-display: swap)
- `Inter` - Body text (font-display: swap)

### 7. **TypeScript & Validation**

- **Mode strict**: `tsconfig.json` → `"strict": true`
- **Validateurs Zod** (`src/lib/validators.ts`):
  ```typescript
  export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8)
  });
  
  export const candidatureSchema = z.object({
    // ... à implémenter dans Lot 2
  });
  ```

### 8. **Constantes Globales**

`src/utils/constants.ts`:
```typescript
export const APP_NAME = 'Question pour un DevAs';
export const ROLES = {
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
  PARTICIPANT: 'participant'
};
// Autres constantes éditions, catégories, etc.
```

---

## 🚀 Comment Continuer - Guide pour Agents

### **Avant de coder un Lot**

1. **Lire la spec du Lot** dans `/supabase/specs/tasks.md`
2. **Checker les routes existantes** avec `npm run dev` → http://localhost:3000/
3. **Verify build**: `npm run build` → doit compiler sans erreurs TypeScript

### **Structure Fichiers à Respecter**

#### Pour une nouvelle page (`/editions`):
```
app/editions/
  ├── page.tsx          # La page elle-même
  ├── layout.tsx        # Si layout spécifique (sinon hérité)
  └── [id]/
      └── page.tsx      # Détail d'une édition: /editions/[id]
```

#### Pour des composants métier (`EditionCard`, `CandidatureForm`):
```
src/components/
  ├── editions/         # Dossier par domaine métier
  │   ├── edition-card.tsx
  │   ├── edition-list.tsx
  │   └── edition-filter.tsx
  └── candidatures/
      ├── candidature-form.tsx
      └── candidature-list.tsx
```

#### Pour des utilitaires métier:
```
src/lib/
  ├── editions.ts       # Logique métier éditions
  ├── candidatures.ts   # Logique métier candidatures
  └── participants.ts   # Logique métier participants
```

### **Checklist Avant Push**

- [ ] `npm run build` → ✓ compile sans erreurs TypeScript
- [ ] `npm run lint` → ✓ pas de warnings ESLint (si linter configuré)
- [ ] Routes testées manuellement via `npm run dev`
- [ ] Imports TypeScript corrects (pas de `any`)
- [ ] Pas de `console.log()` en production (utiliser logger si disponible)
- [ ] RLS policies respectées (Supabase queries via `server.ts` ou `client.ts`)
- [ ] Pas de service role client (`service.ts`) en composants client

### **Patterns à Utiliser**

#### Server Component + Supabase Query:
```typescript
// app/editions/page.tsx
import { createClient } from '@/src/utils/supabase/server';

export default async function EditionsPage() {
  const supabase = await createClient();
  const { data: editions } = await supabase
    .from('editions')
    .select('*')
    .order('annee', { ascending: false });

  return (
    <div>
      {editions?.map(e => <EditionCard key={e.id} edition={e} />)}
    </div>
  );
}
```

#### Client Component + Form Action:
```typescript
// src/components/candidatures/candidature-form.tsx
'use client';

import { submitCandidature } from '@/src/actions/candidatures';

export function CandidatureForm() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    try {
      await submitCandidature(formData);
    } finally {
      setLoading(false);
    }
  }

  return <form action={handleSubmit}>...</form>;
}
```

#### Server Action:
```typescript
// src/actions/candidatures.ts
'use server';

import { createClient } from '@/src/utils/supabase/server';

export async function submitCandidature(formData: FormData) {
  const supabase = await createClient();
  
  const email = formData.get('email');
  // Validation
  const result = candidatureSchema.safeParse({ email });
  if (!result.success) throw new Error('Invalid data');
  
  // Insert
  const { data, error } = await supabase
    .from('candidatures')
    .insert([result.data]);
  
  if (error) throw new Error(error.message);
  return data;
}
```

### **Layouts Personnalisés**

#### Admin Layout (avec sidebar):
```typescript
// app/admin/layout.tsx
// Existant - à COPIER pour routes admin supplémentaires
// Redirect si pas admin, wraps children avec Header + sidebar
```

#### Participant Layout (avec sidebar):
```typescript
// app/participant/layout.tsx
// Existant - à COPIER pour routes participant supplémentaires
```

#### Public Pages (sans sidebar):
```typescript
// Utilisent app/layout.tsx (Header + Footer)
// Exemple: /connexion, /editions, /palmares
```

### **Imports Standards**

```typescript
// Supabase
import { createClient } from '@/src/utils/supabase/server';
import { createClient as createClientComponent } from '@/src/utils/supabase/client';

// UI Components
import { Button } from '@/src/components/ui/button';
import { Card } from '@/src/components/ui/card';
import { Input } from '@/src/components/ui/input';

// Common Components
import { Header } from '@/src/components/common/header';
import { Footer } from '@/src/components/common/footer';

// Utilities
import { cn } from '@/src/lib/utils'; // Tailwind class merge
import { APP_NAME, ROLES } from '@/src/utils/constants';

// Validation
import { loginSchema } from '@/src/lib/validators';

// Types
import type { Database } from '@/src/types/database';
```

---

## 🔧 Commandes Utiles

```bash
# Development
npm run dev              # Start dev server on http://localhost:3000

# Build & Deploy
npm run build            # Build for production
npm run start            # Start production server

# Quality
npm run lint             # Run ESLint
npm run type-check       # TypeScript check (if configured)

# Database
npm run db:seed          # Seed database (Lot 0+)
npm run db:migrate       # Run migrations (if configured)
```

---

## 📋 Prochains Lots - Vue d'ensemble

| Lot | Objectif | Routes | Fichiers Clés |
|-----|----------|--------|---------------|
| **1** | Éditions management | `/editions`, `/editions/[id]` | `app/editions/`, `src/components/editions/` |
| **2** | Candidatures form | `/candidater` | `app/candidater/`, `src/actions/candidatures.ts` |
| **3** | Participants list | `/participants` | `app/participants/` |
| **4** | Classement/Palmares | `/palmares` | `app/palmares/` |
| **5** | Dashboard features | Admin/Participant tables | `src/components/tables/` |
| **6** | Match management | `/matchs`, `/resultats` | `app/matchs/` |
| **7** | Mobile responsive | Responsive design | CSS updates |

---

## 🛑 Points d'Attention

1. **Middleware**: Ne pas modifier `src/middleware.ts` sans raison - contrôle l'auth globale
2. **Root Layout**: `app/layout.tsx` s'applique à TOUTES les routes - attention aux changements
3. **Supabase Clients**: Toujours utiliser `server.ts` dans Server Components/Actions. Ne JAMAIS exposer `service.ts` côté client
4. **Tailwind**: Les couleurs sont en `tailwind.config.ts` - utiliser `vert` et `orange` pour cohérence
5. **Types**: Maintenir `src/types/database.ts` synchronisé avec migrations Supabase

---

## 📞 Questions Fréquentes

**Q: Une route retourne 404?**
A: Vérifier `app/` structure. Routes doivent être soit `app/page.tsx` (/) soit `app/folder/page.tsx` (/folder). Les groupes `()` ne créent pas de segments.

**Q: Comment ajouter une page admin?**
A: Créer `app/admin/subfolder/page.tsx`. Le layout `app/admin/layout.tsx` wrappera automatiquement avec sidebar et auth check.

**Q: Comment faire un form avec validation?**
A: Utiliser Server Action + Zod schema. Voir pattern "Server Action" ci-dessus.

**Q: RLS policies bloquent ma query?**
A: Vérifier `supabase/migrations/017_rls_policies.sql`. S'assurer que l'utilisateur a les permissions pour la table/role.

**Q: Comment ajouter une couleur personnalisée?**
A: Ajouter dans `tailwind.config.ts` → `colors` section, puis utiliser dans className.

---

**Dernière mise à jour**: Lot 0 complet - Nov 10, 2026
**Status**: ✅ Prêt pour Lot 1
