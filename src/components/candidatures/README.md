# Composants Candidatures

Composants pour la gestion des candidatures de "Question pour un DevAs".

## Fichiers

### `candidature-form.tsx`
Formulaire de candidature client. Fonctionnalités:
- Formulaire multi-sections (identité, contact, formation, infos supplémentaires)
- Validation côté client avec Zod
- Gestion des erreurs par champ
- État de succès avec code de suivi
- Réinitialisation du formulaire

**Props**: `edition` (Edition)

**Actions utilisées**: `submitCandidature()` (server action)

## Routes

- `/candidater` → Formulaire de candidature + FAQ
- `/candidater/suivi` → Consultation du statut avec code

## Modèle de données

```typescript
// Candidature
{
  id: UUID
  edition_id: UUID
  nom: string
  prenom: string
  date_naissance?: date
  sexe?: 'M' | 'F'
  etablissement: string
  classe_niveau: string
  email: string (unique par édition)
  telephone?: string
  informations?: string
  photo_path?: string
  code_suivi: string (unique)
  statut: 'en_attente' | 'acceptee' | 'refusee' | 'liste_attente'
  commentaire_interne?: string
  traite_par?: UUID (profil admin)
  traite_le?: timestamp
}
```

## Actions Server

### `submitCandidature(formData)`
Soumet une nouvelle candidature.

**Validations**:
- Email unique par édition
- Édition avec candidatures_ouvertes = true
- Format email valide
- Tous les champs obligatoires

**Retour**:
```typescript
{
  ok: boolean
  data?: { id: string, code_suivi: string }
  error?: string
  errors?: Record<string, string> // Par champ
}
```

### `getCandidatureByCode(code)`
Récupère une candidature par son code de suivi.

## Composants

- `CandidatureForm` - Formulaire de candidature
- `Input` - Champs texte
- `Button` - Boutons (submit, reset)
- `Card` - Conteneurs
- `LoadingSpinner` - Spinner chargement

## États

- **Envoi en cours**: Loader sur le bouton submit
- **Succès**: Affiche code de suivi + email
- **Erreur**: Affiche message global ou par champ
- **Édition fermée**: Affiche ErrorState
- **Aucune édition ouverte**: ErrorState

## Validation

Via `src/lib/validators.ts` → `candidatureSchema`:
- Nom/Prénom: min 2, max 100 caractères
- Email: format email valide, unique par édition
- Établissement: min 2, max 200 caractères
- Classe/Niveau: 1-50 caractères
- Téléphone: format français optionnel
- Informations: max 1000 caractères

## À implémenter (Lots futurs)

- [ ] Upload de photo de profil
- [ ] Validation numéro de téléphone en temps réel
- [ ] Confirmation email avec lien
- [ ] Brouillon/enregistrement automatique
- [ ] Édition de candidature avant confirmation jury
- [ ] Export liste candidatures (admin)
- [ ] Notification email résultats candidatures
