# Actions (Écritures de données)

Ce répertoire contient les Server Actions qui modifient les données en base de données.

## Structure

Chaque fichier correspond à un domaine métier :

- `editions.ts` - Créer/modifier éditions
- `participants.ts` - Gérer participants
- `resultats.ts` - Saisir scores, valider matchs
- `candidatures.ts` - Accepter/refuser candidatures
- `matchs.ts` - Créer/modifier matchs

## Conventions

### 1. Signature standardisée

```typescript
'use server';

import { z } from 'zod';
import { createClient } from '@/src/utils/supabase/server';
import { SomeSchema } from '@/src/lib/validators';
import { revalidateTag } from 'next/cache';

export async function myAction(
  payload: z.infer<typeof SomeSchema>,
): Promise<{
  ok: boolean;
  message: string;
  erreurs?: Record<string, string[]>;
  data?: unknown;
}> {
  try {
    // 1. Valider avec zod
    const validated = SomeSchema.parse(payload);

    // 2. Créer client
    const supabase = await createClient();

    // 3. Appeler fonction SQL ou faire mutation
    const { data, error } = await supabase.rpc('ma_fonction', {
      // params
    });

    if (error) {
      return { ok: false, message: error.message };
    }

    // 4. Revalider le cache
    revalidateTag('domaine');

    // 5. Retourner succès
    return {
      ok: true,
      message: 'Succès',
      data,
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
    };
  }
}
```

### 2. Validation zod obligatoire

Toujours valider les données entrantes.

### 3. Revalider après écriture

Utiliser `revalidateTag()` ou `revalidatePath()` pour mettre à jour le cache.

### 4. Gestion d'erreur claire

Messages en français, expliquant comment corriger.

## Utilisation

Depuis un Client Component :

```typescript
'use client';

import { myAction } from '@/src/actions/domain';
import { toast } from 'sonner';

export function MyForm() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    setLoading(true);
    const result = await myAction(formData);
    setLoading(false);

    if (!result.ok) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);
  };

  // ...
}
```

## Sécurité

- **RLS** appliquée par Supabase - toujours vérifier les données retournées
- **Zod** valide côté serveur - jamais faire confiance aux données du client
- **Service role** utilisé UNIQUEMENT pour création de compte Auth et URLs signées Storage
