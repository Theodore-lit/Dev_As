# Composants Éditions

Composants pour afficher et gérer les éditions de "Question pour un DevAs".

## Fichiers

### `edition-card.tsx`
Carte individuelle d'une édition. Affiche:
- Année (principal)
- Statut (badge)
- Nom et description
- Dates de début/fin
- Score max
- État des candidatures

**Props**: `edition` (Edition)

### `edition-list.tsx`
Liste des éditions avec filtres et tri. Fonctionnalités:
- Tri par année (croissant/décroissant) ou statut
- Filtre par statut
- Affichage en grille responsive
- État vide si aucune édition

**Props**: `editions` (Edition[])

### `edition-detail.tsx`
Page détail d'une édition. Affiche:
- En-tête avec badge statut
- Description complète
- Statistiques (candidatures, participants, matchs)
- Dates importantes
- Phases de compétition avec détails
- Informations supplémentaires
- Boutons de navigation

**Props**: 
- `edition` (Edition)
- `phases` (Phase[])
- `stats` (statistiques optionnelles)

## Routes

- `/editions` → Liste toutes les éditions
- `/editions/[id]` → Détail d'une édition

## Modèle de données

```typescript
// Edition
{
  id: UUID
  annee: number
  nom: string
  description?: string
  statut: 'preparation' | 'candidatures_ouvertes' | 'en_cours' | 'terminee' | 'archivee'
  date_debut?: timestamp
  date_fin?: timestamp
  candidatures_ouvertes: boolean
  score_max_defaut: number
}

// Phase
{
  id: UUID
  edition_id: UUID
  ordre: number
  nom: string
  type: 'qualification' | 'barrage' | 'tour' | 'demi_finale' | 'finale'
  nb_groupes: number
  nb_qualifies_par_groupe: number
  nb_barrage_par_groupe: number
}
```

## États

- **Aucune édition**: Affiche EmptyState
- **Édition non trouvée**: Affiche 404 (notFound)
- **Erreur chargement**: Affiche ErrorState
- **Chargement**: Utilise le loading skeleton par défaut (voir layout)

## À implémenter (Lots futurs)

- [ ] Page d'édition avec modification (admin only)
- [ ] Création d'édition (admin only)
- [ ] Suppression d'édition (admin only)
- [ ] Export statistiques édition
- [ ] Clonage d'édition depuis une autre
