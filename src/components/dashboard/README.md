# Composants Dashboard

Composants partagés pour les dashboards admin et participant.

## Fichiers

### `stats-card.tsx`
Carte de statistique simple. Affiche:
- Label
- Valeur
- Icône optionnelle
- Tendance optionnelle (+ ou -)

**Props**: 
- `label` (string)
- `value` (string | number)
- `icon?` (string - emoji)
- `trend?` ({ value: number, isPositive: boolean })

## Admin Dashboard

### `admin/admin-stats.tsx`
Grille de 4 stats pour le dashboard admin:
- Éditions
- Candidatures
- Participants
- Matchs

**Props**: 
- `editionsCount` (number)
- `candidaturesCount` (number)
- `participantsCount` (number)
- `matchsCount` (number)

### `admin/candidatures-table.tsx`
Tableau des candidatures récentes. Affiche:
- Candidat (prénom nom)
- Email
- Édition
- Statut (badge)
- Code de suivi

**Props**: 
- `candidatures` (Candidature[])

### `admin/editions-table.tsx`
Tableau des éditions. Affiche:
- Année
- Nom
- Statut (badge)
- Dates (début - fin)
- État candidatures

**Props**: 
- `editions` (Edition[])

## Participant Dashboard

### `participant/participant-matches.tsx`
Liste des matchs d'un participant. Affiche par match:
- Libellé et date
- Score si disponible
- Résultat/Issue (badge)
- Statut du match

**Props**: 
- `matches` (MatchDisplay[])

## Routes

- `/admin` → Tableau de bord administrateur
- `/participant` → Tableau de bord participant

## Modèle de données

```typescript
// Stats
{
  editionsCount: number
  candidaturesCount: number
  participantsCount: number
  matchsCount: number
}

// MatchDisplay
{
  match: Match
  resultat?: Resultat
  opponent?: string
}
```

## États

- **Aucune donnée**: Affiche message "Aucun X pour le moment"
- **Erreur chargement**: Page remonte une ErrorState
- **Pas de matchs participant**: Message dans ParticipantMatches

## Composants utilisés

- `StatsCard` - Carte statistique
- `Card` - Conteneurs
- `Badge` - Statuts
- `Table` - HTML table
- `Link` - Navigation
- `Image` - Photos

## À implémenter (Lots futurs)

- [ ] Graphiques statistiques (Chart.js, Recharts)
- [ ] Filtres par édition dans candidatures-table
- [ ] Export données tableaux (CSV, PDF)
- [ ] Pagination si trop de résultats
- [ ] Actions inline (éditer, supprimer)
- [ ] Notifications en temps réel
- [ ] Rafraîchissement automatique des stats
- [ ] Historique activités
- [ ] Comparaison stats participants (admin)
