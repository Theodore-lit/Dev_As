# Queries (Lectures de données)

Ce répertoire contient les fonctions de lecture typées qui interrogent la base de données Supabase.

## Structure

Chaque fichier correspond à un domaine métier :

- `editions.ts` - Éditions et phases
- `participants.ts` - Participants et profils
- `resultats.ts` - Résultats et classements
- `candidatures.ts` - Candidatures
- `matchs.ts` - Matchs et jury
- `annonces.ts` - Annonces et notifications

## Conventions

### 1. Toujours typer le retour

```typescript
import { createClient } from '@/src/utils/supabase/server';
import type { Database } from '@/src/types/database';

export async function getEdition(id: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('editions')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) throw error;
  return data as Database['public']['Tables']['editions']['Row'];
}
```

### 2. Filtres RLS appliqués automatiquement

Aucune vérification de permission dans les requêtes. Les politiques RLS de Supabase gèrent l'accès.

### 3. Pas de logique métier

Les requêtes retournent les données brutes. La logique métier reste dans les Server Actions.

## Utilisation

Dans un Server Component :

```typescript
const edition = await getEdition(editionId);
```

Dans une Server Action :

```typescript
'use server';
import { getEdition } from '@/src/queries/editions';

export async function myAction(editionId: string) {
  const edition = await getEdition(editionId);
  // ...
}
```

**Jamais** dans un Client Component (sauf si vous utilisez `useQuery` d'une bibliothèque de cache).
