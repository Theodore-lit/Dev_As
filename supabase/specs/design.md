# Conception Technique : Frontend DevAs - Lot 0

## Architecture Globale

```
.
├── app/                          # Routes Next.js App Router
│   ├── (public)/                 # Espace public (sans auth)
│   │   ├── layout.tsx
│   │   ├── page.tsx              # Accueil
│   │   ├── connexion/
│   │   ├── candidater/           # (Lot 1)
│   │   ├── editions/             # (Lot 1+)
│   │   └── ...
│   ├── (participant)/            # Espace participant (auth required)
│   │   ├── layout.tsx
│   │   ├── dashboard/
│   │   ├── profil/
│   │   ├── parcours/
│   │   ├── statistiques/
│   │   └── notifications/
│   ├── (admin)/                  # Espace admin (auth + role required)
│   │   ├── layout.tsx
│   │   ├── dashboard/
│   │   ├── editions/
│   │   ├── candidatures/
│   │   ├── participants/
│   │   ├── phases/
│   │   ├── seances/
│   │   ├── resultats/
│   │   ├── classements/
│   │   ├── annonces/
│   │   ├── archives/
│   │   ├── administrateurs/
│   │   ├── journal/
│   │   └── parametres/
│   ├── layout.tsx                # Root layout (polices, providers)
│   └── not-found.tsx
│
├── src/
│   ├── components/
│   │   ├── ui/                   # shadcn/ui + custom primitives
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── table.tsx
│   │   │   ├── modal.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── radio.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── skeleton.tsx
│   │   │   └── ...
│   │   ├── common/               # Composants partagés (pas de logique métier)
│   │   │   ├── header.tsx
│   │   │   ├── footer.tsx
│   │   │   ├── sidebar-nav.tsx
│   │   │   ├── empty-state.tsx
│   │   │   ├── error-state.tsx
│   │   │   ├── loading-state.tsx
│   │   │   └── ...
│   │   ├── public/               # Composants domaine public
│   │   ├── participant/          # Composants domaine participant
│   │   └── admin/                # Composants domaine admin
│   │
│   ├── utils/
│   │   ├── supabase/
│   │   │   ├── client.ts         # Client côté client (auth)
│   │   │   ├── server.ts         # Client côté serveur (cookies)
│   │   │   └── service.ts        # Service role (Server Actions sensibles)
│   │   ├── constants.ts          # Constantes (couleurs, chemins, etc)
│   │   └── helpers.ts            # Fonctions utilitaires
│   │
│   ├── queries/                  # Lectures typées (SELECT)
│   │   ├── editions.ts
│   │   ├── participants.ts
│   │   ├── resultats.ts
│   │   ├── candidatures.ts
│   │   └── ...
│   │
│   ├── actions/                  # Server Actions (POST/PUT/DELETE)
│   │   ├── candidatures.ts       # deposer_candidature, accepter, etc
│   │   ├── resultats.ts          # Scoring, validation matchs
│   │   ├── participants.ts
│   │   └── ...
│   │
│   ├── lib/                      # Logique métier isolée
│   │   ├── validators.ts         # Zod schemas
│   │   └── errors.ts             # Classes d'erreurs custom
│   │
│   └── types/                    # Types personnalisés (au-delà de database.ts)
│       └── domain.ts             # Types métier
│
├── public/                       # Assets statiques
│   ├── logo.png                  # Logo officiel
│   └── ...
│
├── .env.example                  # Variables d'environnement documentées
├── next.config.ts                # Configuration Next.js
├── tailwind.config.ts            # Thème couleurs DevAs
├── tsconfig.json                 # TypeScript strict
├── middleware.ts                 # Authentification + redirect
└── package.json
```

## Système de Couleurs Tailwind

**Fichier** : `tailwind.config.ts`

```typescript
module.exports = {
  theme: {
    extend: {
      colors: {
        'brand': {
          'primary': '#039846',      // Vert principal
          'accent': '#E56001',       // Orange accent
          'success': '#039846',      // Alias vert
          'warning': '#E56001',      // Alias orange
          'light-green': '#DDF4E5',  // Vert pâle
          'light-orange': '#FFF0E2', // Orange pâle
        },
        'neutral': {
          'dark': '#1F2937',         // Gris foncé (titres)
          'light': '#F3F4F6',        // Gris clair (fonds)
        },
      },
      borderRadius: {
        'card': '8px',
        'button': '10px',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.1)',
      },
    },
  },
};
```

**Utilisation dans les composants** :
```tsx
// Bon
<button className="bg-brand-primary text-white rounded-button">
<div className="bg-neutral-light rounded-card shadow-card">

// Mauvais (pas de couleurs en dur)
<button className="bg-[#039846]">
<div style={{ backgroundColor: '#039846' }}>
```

## Clients Supabase

### Architecture Isolation

```
Contexte              | Client              | Clé utilisée
──────────────────────────────────────────────────────
Client Browser       | src/utils/supabase/client.ts   | NEXT_PUBLIC_SUPABASE_ANON_KEY
Server Component     | src/utils/supabase/server.ts   | NEXT_PUBLIC_SUPABASE_ANON_KEY + cookies
Server Action        | src/utils/supabase/service.ts  | SUPABASE_SERVICE_ROLE_KEY *rare*
                     | ou src/utils/supabase/server.ts | Pour 90% des cas
```

### `src/utils/supabase/client.ts`

```typescript
// Côté client, auth en session utilisateur
import { createBrowserClient } from '@supabase/ssr';

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
```

Usage dans Client Component :
```tsx
'use client';

const supabase = createClient();
const { data, error } = await supabase.from('table').select();
```

### `src/utils/supabase/server.ts`

```typescript
// Côté serveur, session via cookies
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const createClient = async () => {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookies) {
          cookies.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        },
      },
    },
  );
};
```

Usage dans Server Component ou Server Action :
```typescript
const supabase = await createClient();
const { data, error } = await supabase.from('table').select();
```

### `src/utils/supabase/service.ts`

```typescript
// Service role, JAMAIS côté client, JAMAIS en NEXT_PUBLIC
import { createClient } from '@supabase/supabase-js';

export const createServiceClient = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
```

Usage UNIQUEMENT dans :
- Création de compte Auth (`admin.auth.admin.createUser()`)
- URL signée Storage (`storage.from('bucket').createSignedUrl()`)

**Jamais** pour SELECT/INSERT sur tables protégées par RLS.

## Middleware d'Authentification

**Fichier** : `src/middleware.ts`

```typescript
import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

const PUBLIC_ROUTES = ['/', '/connexion', '/candidater', '/editions', '/participants', '/resultats'];
const ADMIN_ROUTES = ['/admin'];
const PARTICIPANT_ROUTES = ['/participant'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 1. Rafraîchir la session
  const supabase = createServerClient(request, NextResponse.next());
  const { data: { session } } = await supabase.auth.getSession();
  
  // 2. Charger le profil utilisateur s'il existe
  const user = session?.user;
  let role = null;
  if (user) {
    const { data: profile } = await supabase
      .from('profils')
      .select('role')
      .eq('id', user.id)
      .single();
    role = profile?.role;
  }
  
  // 3. Redirection selon la route et le rôle
  if (PUBLIC_ROUTES.some(r => pathname.startsWith(r))) {
    // Accès public toujours permis
    return NextResponse.next();
  }
  
  if (ADMIN_ROUTES.some(r => pathname.startsWith(r))) {
    if (!user || (role !== 'super_admin' && role !== 'admin')) {
      return NextResponse.redirect(new URL('/connexion', request.url));
    }
    return NextResponse.next();
  }
  
  if (PARTICIPANT_ROUTES.some(r => pathname.startsWith(r))) {
    if (!user || role !== 'participant') {
      return NextResponse.redirect(new URL('/connexion', request.url));
    }
    return NextResponse.next();
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png).*)',
  ],
};
```

## Composants Communs (Priorité 1)

Tous créés en `src/components/ui/` avec shadcn/ui comme base.

### Button (`src/components/ui/button.tsx`)

```tsx
<button className={cn(
  'px-4 py-2 rounded-button font-medium transition-colors',
  variant === 'primary' && 'bg-brand-primary text-white hover:bg-opacity-90',
  variant === 'secondary' && 'bg-neutral-light text-neutral-dark hover:bg-gray-200',
  variant === 'ghost' && 'text-brand-primary hover:bg-brand-light-green',
  disabled && 'opacity-50 cursor-not-allowed',
)}>
```

### Badge (`src/components/ui/badge.tsx`)

```tsx
// Pour statuts : 'en_attente', 'qualifie', 'elimine', 'finaliste', 'champion'
<span className={cn(
  'px-3 py-1 rounded-full text-sm font-medium',
  status === 'qualifie' && 'bg-brand-light-green text-brand-primary',
  status === 'elimine' && 'bg-red-100 text-red-800',
  status === 'finaliste' && 'bg-brand-light-orange text-brand-accent',
  status === 'champion' && 'bg-brand-primary text-white',
)}>
```

### Card (`src/components/ui/card.tsx`)

```tsx
<div className="rounded-card border border-gray-200 bg-white p-6 shadow-card">
```

### Table (`src/components/ui/table.tsx`)

```tsx
// Responsive, avec thead/tbody standard HTML
// Classes Tailwind pour borders, padding, hover states
```

### Modal (`src/components/ui/modal.tsx`)

```tsx
// Utilise Dialog de shadcn/ui
// Props : isOpen, onClose, title, children, actions
// Fermeture : ESC, clic outside, bouton close
```

### Toast (via Sonner)

```tsx
// Dans layout.tsx :
<Toaster position="top-right" />

// Usage dans Server Action :
'use server';
import { toast } from 'sonner';
toast.success('Succès');
toast.error('Erreur');
```

**Note** : Sonner fonctionne avec `'use client'` ou en Server Action. Configuration dans le layout.

## Layouts Trois Espaces

### Layout Public (`app/(public)/layout.tsx`)

```tsx
// Server Component
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

### Layout Participant (`app/(participant)/layout.tsx`)

```tsx
// Server Component avec vérification RLS
export default async function ParticipantLayout({ children }) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect('/connexion');
  }
  
  const { data: profile } = await supabase
    .from('profils')
    .select('*')
    .eq('id', session.user.id)
    .single();
  
  if (profile?.role !== 'participant') {
    redirect('/');
  }
  
  return (
    <div className="flex">
      <SidebarNav role="participant" />
      <div className="flex-1">
        <Header user={session.user} />
        <main>{children}</main>
      </div>
    </div>
  );
}
```

### Layout Admin (`app/(admin)/layout.tsx`)

```tsx
// Similaire, mais vérifie role === 'admin' || 'super_admin'
// Affiche permissions dans sidebar
```

## Schémas Zod pour Validation

**Fichier** : `src/lib/validators.ts`

```typescript
import { z } from 'zod';

export const CandidatureSchema = z.object({
  nom: z.string().min(2, 'Nom trop court').max(50),
  prenom: z.string().min(2, 'Prénom trop court').max(50),
  email: z.string().email('Email invalide'),
  etablissement: z.string().min(2),
  classe_niveau: z.string(),
  date_naissance: z.string().date().optional(),
  sexe: z.enum(['M', 'F']).optional(),
  telephone: z.string().regex(/^\+?[\d\s\-()]{10,}$/).optional(),
  photo: z.instanceof(File).optional(),
  informations: z.string().max(500).optional(),
  champ_piege: z.string().optional().refine(v => !v, 'Champ anti-spam'),
});

export type Candidature = z.infer<typeof CandidatureSchema>;
```

## Structure Server Actions

**Fichier** : `src/actions/candidatures.ts`

```typescript
'use server';

import { z } from 'zod';
import { createClient } from '@/utils/supabase/server';
import { CandidatureSchema } from '@/lib/validators';
import { revalidateTag } from 'next/cache';

export async function deposerCandidature(
  payload: z.infer<typeof CandidatureSchema>,
) {
  try {
    // 1. Valider le payload
    const validated = CandidatureSchema.parse(payload);
    
    // 2. Vérifier que les candidatures sont ouvertes (côté serveur)
    const supabase = await createClient();
    const { data: edition, error: editionError } = await supabase
      .from('editions')
      .select('candidatures_ouvertes')
      .single();
    
    if (editionError || !edition?.candidatures_ouvertes) {
      return {
        ok: false,
        message: 'Les candidatures ne sont pas ouvertes',
        erreurs: {},
      };
    }
    
    // 3. Appeler la fonction SQL deposer_candidatura
    const { data, error } = await supabase.rpc('deposer_candidatura', {
      p_nom: validated.nom,
      p_prenom: validated.prenom,
      // ... autres params
    });
    
    if (error) {
      return {
        ok: false,
        message: error.message,
        erreurs: {},
      };
    }
    
    // 4. Revalider le cache
    revalidateTag('candidatures');
    
    // 5. Retourner le résultat
    return {
      ok: true,
      message: 'Candidature déposée avec succès',
      data: data.code_suivi,
    };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return {
        ok: false,
        message: 'Données invalides',
        erreurs: err.flatten().fieldErrors,
      };
    }
    
    return {
      ok: false,
      message: 'Erreur serveur',
      erreurs: {},
    };
  }
}
```

## Polices via next/font

**Fichier** : `app/layout.tsx`

```typescript
import { Montserrat, Inter } from 'next/font/google';

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={`${montserrat.variable} ${inter.variable}`}>
      <head>
        <title>Question pour un DevAs</title>
      </head>
      <body className="font-inter">{children}</body>
    </html>
  );
}
```

**Utilisation dans Tailwind** :
```typescript
// tailwind.config.ts
theme: {
  fontFamily: {
    'sans': ['var(--font-inter)', 'sans-serif'],
    'serif': ['var(--font-montserrat)', 'serif'],
  },
}
```

## Performance et Stratégie de Cache

- **Images** : `next/image` obligatoire avec `width` et `height`
- **Polices** : `display: 'swap'` pour éviter FOUT
- **Données publiques** : `revalidate: 3600` (1 heure)
- **Données sensibles** : `revalidate: false` (on-demand)
- **Server Actions** : `revalidateTag` ou `revalidatePath` après mutation

## Accessibilité

- **Focus** : `outline-2 outline-offset-2 outline-brand-primary` sur tous les interactifs
- **Contraste** : Vérifier avec Lighthouse
- **Labels** : Tous les inputs ont un `<label>` associé
- **ARIA** : `aria-live="polite"` sur zones qui changent, `aria-label` sur boutons sans texte
- **Reduced Motion** : `prefers-reduced-motion` respecté dans animations

## Vérification Lint et Types

```bash
npm run lint    # ESLint
npm run build   # TypeScript check
```

Configuration ESLint : `eslint.config.mjs` (hérité du starter)

## Points Clés de Conception

1. **Pas de logique métier en Lot 0** : Juste structure et composants réutilisables
2. **RLS comme source de vérité** : Le serveur n'applique jamais de règles supplémentaires
3. **Server Components par défaut** : Client Components seulement si interactif
4. **Isolation des clients Supabase** : Chacun sait ce qu'il peut faire
5. **Couleurs en variables Tailwind** : Facilite les changements futurs
6. **Types TypeScript stricts** : Zod pour validation runtime, database.ts pour schéma

---

**Prochaine étape** : Fichier `tasks.md` détaillant chaque étape d'implémentation.

