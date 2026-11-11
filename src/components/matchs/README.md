# Composants Matchs

Composants pour afficher et gérer les matchs de "Question pour un DevAs".

## Fichiers

### `match-card.tsx`
Carte individuelle d'un match. Affiche:
- Libellé du match
- Phase et type (Qualifications, Finale, etc.)
- Statut (badge)
- Date et heure
- Lieu
- Groupe (si applicable)
- Score max

**Props**: 
- `match` (Match)
- `phase` (Phase)
- `editionId` (string)

### `match-list.tsx`
Liste des matchs avec filtres et tri. Fonctionnalités:
- Tri par date ou phase
- Filtre par phase
- Filtre par statut
- Affichage en grille responsive
- Compte des résultats

**Props**: 
- `matches` (MatchDisplay[])
- `editionId` (string)

### `match-detail.tsx`
Page détail d'un match. Affiche:
- Libellé, phase, statut
- Informations (date, lieu, groupe, score max)
- Édition
- Tableau des résultats avec participants
- Informations de validation
- Navigation

**Props**: 
- `match` (Match)
- `phase` (Phase)
- `edition` ({ id, annee, nom })
- `resultats` (ResultatDisplay[])

## Routes

- `/matchs` → Liste tous les matchs (édition la plus récente)
- `/matchs/[id]` → Détail d'un match

## Modèle de données

```typescript
// Match
{
  id: UUID
  phase_id: UUID
  libelle: string
  groupe?: number
  date_heure?: timestamp
  lieu?: string
  score_max: number
  statut: 'planifie' | 'en_cours' | 'termine' | 'valide'
  valide_par?: UUID (profil admin)
  valide_le?: timestamp
  deverrouille_le?: timestamp
}

// Phase
{
  id: UUID
  edition_id: UUID
  ordre: number
  nom: string
  type: 'qualification' | 'barrage' | 'tour' | 'demi_finale' | 'finale'
}

// Resultat
{
  match_id: UUID
  participant_id: UUID
  score: number
  rang: number
  issue: 'qualifie' | 'barrage' | 'elimine' | 'finaliste' | 'champion'
}
```

## États

- **Aucun match**: Affiche EmptyState
- **Match non trouvé**: Affiche 404 (notFound)
- **Aucun résultat**: Affiche message dans match-detail
- **Erreur chargement**: Affiche ErrorState
- **Match validé**: Affiche info validation en vert

## Composants utilisés

- `MatchCard` - Carte match
- `MatchList` - Liste matchs
- `MatchDetail` - Page détail
- `Badge` - Statuts
- `Card` - Conteneurs
- `Button` - Navigation
- `Link` - Navigation interne
- `ErrorState` - État erreur
- `EmptyState` - État vide

## À implémenter (Lots futurs)

- [ ] Page résultats détaillée par match
- [ ] Formulaire saisie résultats (admin)
- [ ] Validation résultats (admin)
- [ ] Historique modifications résultats
- [ ] Export résultats (CSV, PDF)
- [ ] Classement en temps réel par phase
- [ ] Notifications match en cours
- [ ] Calendrier matchs par phase
- [ ] Statistiques head-to-head
- [ ] Undo/Redo saisie résultats
