# Composants Participants

Composants pour afficher et gérer les participants de "Question pour un DevAs".

## Fichiers

### `participant-card.tsx`
Carte individuelle d'un participant. Affiche:
- Photo de profil (ou initiales)
- Numéro participant
- Nom et prénom
- Statut (badge)
- Classe/Niveau et établissement
- Sexe et date de naissance
- Email

**Props**: 
- `participant` (Participant)
- `editionId` (string)

### `participant-list.tsx`
Liste des participants avec recherche et filtres. Fonctionnalités:
- Recherche par nom, prénom ou numéro
- Tri par numéro, nom ou statut
- Filtre par statut
- Affichage en grille responsive
- Compte des résultats

**Props**: 
- `participants` (Participant[])
- `editionId` (string)

### `participant-detail.tsx`
Page détail d'un participant. Affiche:
- Photo grande taille
- Nom, prénom, numéro
- Statut (badge)
- Informations personnelles (établissement, classe, date naissance, sexe)
- Contact (email, téléphone)
- Statistiques (matchs joués, victoires, score total)
- État d'élimination si applicable

**Props**: 
- `participant` (Participant)
- `edition` ({ id, annee, nom })
- `stats` (optionnel - statistiques matchs)

## Routes

- `/participants` → Liste tous les participants (édition la plus récente)
- `/participants/[id]` → Détail d'un participant

## Modèle de données

```typescript
// Participant
{
  id: UUID
  edition_id: UUID
  candidature_id?: UUID
  profil_id?: UUID
  numero: number (unique par édition)
  nom: string
  prenom: string
  date_naissance?: date
  sexe?: 'M' | 'F'
  etablissement: string
  classe_niveau: string
  email: string
  telephone?: string
  photo_path?: string
  publie: boolean (affiche publiquement si true)
  statut: 'en_attente' | 'en_competition' | 'elimine' | 'finaliste' | 'champion'
  elimine_en_phase_id?: UUID
}

// Resultats (pour stats)
{
  match_id: UUID
  participant_id: UUID
  score: number
  rang: number
  issue: 'qualifie' | 'barrage' | 'elimine' | 'finaliste' | 'champion'
}
```

## États

- **Aucun participant**: Affiche EmptyState
- **Participant non trouvé**: Affiche 404 (notFound)
- **Participant non publié**: Page 404 (filtre publie=true)
- **Erreur chargement**: Affiche ErrorState
- **Pas de matchs**: Affiche stats à 0

## Composants utilisés

- `ParticipantCard` - Carte participant
- `ParticipantList` - Liste participants
- `ParticipantDetail` - Page détail
- `Input` - Recherche
- `Card` - Conteneurs
- `Badge` - Statut
- `Button` - Navigation
- `Image` - Photos profil
- `EmptyState` - État vide
- `ErrorState` - État erreur

## À implémenter (Lots futurs)

- [ ] Upload/modification photo de profil
- [ ] Statistiques détaillées par phase
- [ ] Historique matchs de chaque participant
- [ ] Classement participant par phase
- [ ] Export liste participants (admin)
- [ ] Édition infos participant (admin)
- [ ] Suppression participant (admin)
- [ ] Tri avancé (victoires, points, etc.)
- [ ] Pagination si > 100 participants
- [ ] Comparaison participants (face à face)
