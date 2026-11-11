---
name: devas-page-implementation
description: Guide officiel et compétences de référence pour toute IA devant créer, modifier ou intégrer une page dans le projet DevAs (Question pour un DevChampion). Spécifie l'architecture Next.js 16 (App Router), la charte graphique Tailwind v4, l'intégration Supabase SSR, les routes réelles, les composants & icônes SVG réutilisables, et le format officiel du concours.
---

# Skill : Guide d'implémentation de pages pour DevAs

Ce guide fournit à toute IA ou développeur toutes les règles d'architecture, de style, de backend et de logique métier nécessaires pour implémenter ou modifier n'importe quelle page du projet **DevAs (Question pour un DevChampion)** sans erreur et en conformité totale avec le projet.

---

## 1. Contexte & Identité du concours

- **Nom officiel** : *DevAs ou Question pour un DevChampion*
- **Concept** : Concours de culture générale, de réflexion, de rapidité et de connaissances pour les passionnés d'informatique et de technologie.
- **Participants** : **30 candidats** initiaux sélectionnés.
- **Frais d'inscription** : **500 FCFA** par candidat (recette prévisionnelle : 15 000 FCFA).
- **Format de tournoi** : **14 matchs officiels** organisés en deux grandes parties :
  1. **Partie I : Qualifications (30 → 16 candidats / 7 matchs)** :
     - Phase 1 : 2 groupes de 15 candidats (10 qualifiés directs par groupe, 5 en barrage).
     - Phase 2 : Barrage (10 candidats réunis, 6 repêchés, 4 éliminés).
     - Phase 3 : 2 groupes de 13 candidats (10 qualifiés par groupe, 3 éliminés).
     - Phase 4 : 2 groupes de 10 candidats (8 qualifiés par groupe, 2 éliminés).
  2. **Partie II : Phase Principale & Finales (16 → 1 champion / 7 matchs)** :
     - Tous réunis dans un **groupe unique sous classement général**.
     - Tour 1 (16 → 13), Tour 2 (13 → 10), 16ᵉ de finale (10 → 8), 8ᵉ de finale (8 → 6), Quarts de finale (6 → 4), Demi-finales (4 → 2 finalistes + 3ᵉ place sur le podium).
     - **Grande Finale** : match ultime disputé en public le jour du **Team Building de HIGHFIVE**.
- **Récompenses officielles** :
  - 🥇 **1er Prix (DevChampion)** : Enveloppe de **10 000 FCFA** + **5 tickets resto badgés** + Trophée officiel.
  - 🥈 **2ème Prix (Finaliste)** : Enveloppe de **5 000 FCFA** + **10 tickets resto badgés**.
  - 🥉 **3ème Prix (3ème place)** : Un **Headphone (Casque audio)** + **5 tickets resto**.
- **Membres accrédités de la Régie financière (Paiement des 500 FCFA)** :
  - **Tomy AZONSI**
  - **Armel Kirchinot**
  - **Steeven Tossa**
  - **Alapini Primos**
  - **OROPONDE Christelle**

---

## 2. Règles strictes de design & Style

### Règle d'or : AUCUN ÉMOJI
- **Interdiction absolue d'utiliser des émojis** dans l'UI (`🏆`, `📅`, `📊`, `🔥`, etc.).
- Utiliser **exclusivement les icônes vectorielles SVG** du projet situées dans `@/src/components/common/icons` :
  - `TrophyIcon`, `CodeIcon`, `ChartBarIcon`, `CalendarIcon`, `UsersIcon`, `SwordsIcon`, `CoinsIcon`, `CrownIcon`, `AwardIcon`, `UtensilsIcon`, `HeadphonesIcon`, `CheckIcon`, `ShieldCheckIcon`, `PlayIcon`, `ChevronRightIcon`, etc.

### Stack CSS : Tailwind v4
- **Tailwind v4 est configuré** via `@import "tailwindcss";` dans `app/globals.css`.
- **Interdit** de forcer ou d'ajouter une configuration Tailwind v3 (`tailwind.config.js` est proscrit).
- **Tokens de thème obligatoires** (définis dans `@theme` dans `app/globals.css`) :
  - `bg-green` / `text-green` : `#039846` (vert officiel DevAs)
  - `bg-green-dark` / `text-green-dark` : `#026b30`
  - `bg-green-pale` : `#ddf4e5` (pastilles douces)
  - `bg-green-light` : `#8bd3a8`
  - `bg-orange` / `text-orange` / `border-orange` : `#f26800` (orange vif DevAs)
  - `bg-orange-dark` : `#a24400`
  - `bg-orange-pale` : `#fff0e2`
  - `text-ink` : `#1f2937` (texte principal)
  - `text-mute` : `#5b6573` (texte secondaire)
  - `border-line` : `#e2e5e9` (bordures de cartes et séparateurs)
  - `bg-soft` : `#f3f4f6` (arrières-plans de cartes douces)
- **Typographie** :
  - Titres : `font-heading` (`Montserrat`, variable déclarée dans `layout.tsx`)
  - Corps de texte : `font-sans` (`Inter`, variable déclarée dans `layout.tsx`)
- **Mise en page standard** :
  - Conteneur de largeur maximale : `max-w-[1180px] mx-auto px-4` (ou classe `.wrap`)
  - Scrollbars horizontales personnalisées : appliquer la classe `.custom-scrollbar`.

---

## 3. Architecture des routes & Fichiers

### Pages principales dans `app/` :
- `app/page.tsx` : Page d'accueil officielle (Hero, Schéma de tournoi, Récompenses, Principes, Édition active, CTA).
- `app/candidacy/page.tsx` : Formulaire de candidature (accessible via `/candidacy` et alias réécrit `/candidater`).
- `app/candidacy/suivi/page.tsx` : Suivi d'état d'un dossier via `code_suivi`.
- `app/editions/page.tsx` : Liste dynamique de toutes les éditions.
- `app/editions/[id]/page.tsx` : Fiche détaillée d'une édition avec ses phases et candidats.
- `app/matchs/page.tsx` : Liste et calendrier de tous les matchs/séances.
- `app/matchs/[id]/page.tsx` : Détail d'un match avec scores et statut des participants.
- `app/participants/page.tsx` : Liste officielle des candidats et trombinoscope.
- `app/participants/[id]/page.tsx` : Profil détaillé d'un participant.
- `app/palmares/page.tsx` : Palmarès historique des éditions et des champions.
- `app/resultats/page.tsx` : Résultats des phases.
- `app/admin/page.tsx` : Dashboard administrateur (gestion candidatures, éditions, validation).
- `app/participant/page.tsx` : Espace connecté du candidat.
- `app/(public)/connexion/page.tsx` : Page d'authentification.

### Modules utilitaires dans `src/` :
- `src/utils/supabase/server.ts` : Client Supabase pour Server Components & Server Actions.
- `src/utils/supabase/client.ts` : Client Supabase pour composants client (`'use client'`).
- `src/utils/supabase/service.ts` : Client avec clé de service (opérations système / admin).
- `src/actions/` : Server Actions Next.js (ex: `candidatures.ts`).
- `src/components/common/` : `header.tsx`, `footer.tsx`, `icons.tsx`.
- `src/components/ui/` : `badge.tsx`, `button.tsx`, `card.tsx`, `empty-state.tsx`, `error-state.tsx`, `input.tsx`, `select.tsx`.
- `src/types/database.ts` : Types TypeScript générés automatiquement depuis la base PostgreSQL Supabase.

---

## 4. Intégration Supabase & Gestion des Cookies Next.js

### Règle vitale : Pas de modification de cookies dans les Server Components
Dans Next.js App Router, les Server Components (`page.tsx`) sont **en lecture seule pour les cookies**. 
`src/utils/supabase/server.ts` implémente un bloc `try / catch` dans `setAll()` pour ignorer sans planter les tentatives d'écriture de cookies en cours de rendu serveur :

```typescript
// Pattern obligatoire dans src/utils/supabase/server.ts
setAll(cookiesToSet) {
  try {
    cookiesToSet.forEach(({ name, value, options }) =>
      cookieStore.set(name, value, options),
    );
  } catch {
    // Appel depuis un Server Component : ignoré en toute sécurité
  }
}
```

### Récupération de l'édition en cours (Pattern standard)
Pour afficher ou lier l'édition active sur une page, toujours appliquer ce pattern de requête :

```typescript
const supabase = await createClient();

// 1. Priorité à l'édition avec candidatures ouvertes
let { data: activeEdition } = await supabase
  .from('editions')
  .select('*')
  .eq('candidatures_ouvertes', true)
  .order('annee', { ascending: false })
  .limit(1)
  .maybeSingle();

// 2. Repli sur l'édition avec statut 'en_cours'
if (!activeEdition) {
  const { data: inProgress } = await supabase
    .from('editions')
    .select('*')
    .eq('statut', 'en_cours')
    .order('annee', { ascending: false })
    .limit(1)
    .maybeSingle();
  activeEdition = inProgress;
}

// 3. Repli de secours sur la plus récente
if (!activeEdition) {
  const { data: latest } = await supabase
    .from('editions')
    .select('*')
    .order('annee', { ascending: false })
    .limit(1)
    .maybeSingle();
  activeEdition = latest;
}
```

---

## 5. Configuration Next.js 16 & Rendu Dynamique

### Règle ABSOLUE : `cacheComponents: true` incompatible avec les route segment configs
Avec `cacheComponents: true` dans `next.config.ts`, **les exports suivants sont INTERDITS dans tout fichier page/layout** car ils causent une erreur de build :
- `export const dynamic = '...'`
- `export const revalidate = ...`
- `export const fetchCache = '...'`

### Méthode officielle : `io()` + `<Suspense>` (Next.js 16 avec cacheComponents)

Le pattern recommandé par la doc officielle **pour ce projet** est `await io()` depuis `next/cache`, wrappé dans un composant async séparé derrière une `<Suspense>` boundary. C'est **plus performant** que `connection()` car le shell statique est prérendu et streamé immédiatement, seul le contenu dynamique est différé.

```typescript
// ✅ Pattern CORRECT — À utiliser dans toutes les pages de ce projet
import { Suspense } from 'react';
import { io } from 'next/cache';
import { createClient } from '@/src/utils/supabase/server';

// Page : shell statique (rendu immédiat, prefetchable)
export default function MaPage() {
  return (
    <Suspense fallback={<MonSkeleton />}>
      <MonContenuDynamique />
    </Suspense>
  );
}

// Squelette affiché pendant le streaming
function MonSkeleton() {
  return <div className="animate-pulse h-32 rounded-2xl bg-line/40" />;
}

// Composant async qui fait le vrai fetch — exécuté hors prerender
async function MonContenuDynamique() {
  await io(); // suspend le prerender ici, force l'exécution côté serveur à la requête
  const supabase = await createClient();
  const { data } = await supabase.from('ma_table').select('*');
  return <div>{/* ... rendu avec data */}</div>;
}
```

### Comparaison des approches (pour référence)

| Méthode | Compatible `cacheComponents` | Usage |
|---------|---|---|
| `export const dynamic = 'force-dynamic'` | ❌ Erreur de build | Interdit |
| `export const revalidate = X` | ❌ Erreur de build | Interdit |
| `unstable_noStore()` | ⚠️ Deprecated v15 | Interdit (legacy) |
| `await connection()` | ✅ Fonctionne | Bloque aussi les prefetches — éviter |
| **`await io()` + `<Suspense>`** | ✅ **Optimal** | **À utiliser** dans tout ce projet |

### Configuration `next.config.ts`
`partialPrefetching: true` requiert `cacheComponents: true`. Ces deux flags doivent toujours être présents ensemble :

```typescript
const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // ...
};
```

---

## 6. Checklist de validation avant de valider une page

1. **Données dynamiques** : Aucune donnée fictive codée en dur lorsque les tables Supabase existent (`editions`, `candidatures`, `participants`, `matchs`, `phases`, `classements_finaux`).
2. **Gestion des états** : Prévoir les états d'erreur (`<ErrorState />`) et de contenu vide (`<EmptyState />`).
3. **Style & Icônes** : Aucun émoji, uniquement les icônes SVG de `@/src/components/common/icons`.
4. **Cohérence des liens** : Vérifier que les liens pointent vers les routes existantes (ex. `/candidacy` pour candidater, `/editions/[id]` pour le détail d'une édition).
5. **Compilation** : Vérifier qu'aucune erreur TypeScript (`npx tsc --noEmit`) ou runtime Next.js ne survient.
