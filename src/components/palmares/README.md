# Composants Palmares

Composants pour afficher le classement final et le palmares de "Question pour un DevAs".

## Fichiers

### `podium.tsx`
Affichage visuel du podium (1er, 2ème, 3ème). Affiche:
- Photos des 3 premiers
- Noms et numéros
- Médailles (🥇🥈🥉)
- Badge "Champion" pour le 1er
- Podiums de différentes hauteurs

**Props**: 
- `podium` (PodiumData[])

### `ranking-table.tsx`
Tableau du classement complet. Affiche:
- Rang avec médaille
- Participant (nom, numéro, lien)
- Établissement et classe
- Titre/distinction
- Tri par rang

**Props**: 
- `entries` (RankingEntry[])
- `editionId` (string)

## Routes

- `/palmares` → Dernier palmares terminé
- `/palmares/[edition]` → Palmares d'une édition spécifique

## Modèle de données

```typescript
// ClassementFinal
{
  id: UUID
  edition_id: UUID
  participant_id: UUID
  rang: integer
  titre?: string (ex: "Champion", "Vice-champion")
}

// Participant (lié au classement)
{
  id: UUID
  numero: number
  nom: string
  prenom: string
  etablissement: string
  classe_niveau: string
  photo_path?: string
}
```

## États

- **Aucun palmares**: Affiche ErrorState
- **Édition non trouvée**: Affiche 404 (notFound)
- **Classement vide**: Affiche ErrorState
- **Pas de podium (< 3 participants)**: Skip podium, affiche tableau
- **Erreur chargement**: Affiche ErrorState

## Composants utilisés

- `Podium` - Affichage podium
- `RankingTable` - Tableau classement
- `Badge` - Titres/distinctions
- `Card` - Conteneurs
- `Image` - Photos participants
- `ErrorState` - État erreur
- `Link` - Navigation vers profils participants

## Styling

- Podium 1er: Plus grand, couleurs vert+orange, bordure or
- Podium 2ème: Taille moyenne, couleurs grises, bordure argent
- Podium 3ème: Plus petit, couleurs orange, bordure orange
- Tableau: Alternance gris clair, médailles à gauche

## À implémenter (Lots futurs)

- [ ] Historique palmares (toutes éditions)
- [ ] Comparaison statistiques participants
- [ ] Export PDF palmares
- [ ] Partage sur réseaux sociaux
- [ ] Animations lors du chargement
- [ ] Statistiques détaillées (nb matchs, points, etc.)
- [ ] Classement par phase
- [ ] Trophée interactif pour 1er
