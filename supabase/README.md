# Backend Supabase : Question pour un DevAs

Documentation complète du backend PostgreSQL/Supabase pour le concours de culture générale « Question pour un DevAs ».

---

## Table des matières

1. [Prérequis](#prérequis)
2. [Lancer la base en local](#lancer-la-base-en-local)
3. [Rejouer les tests](#rejouer-les-tests)
4. [Créer les comptes de démonstration](#créer-les-comptes-de-démonstration)
5. [Fonctions et droits](#fonctions-et-droits)
6. [Architecture RLS](#architecture-rls)
7. [Troubleshooting](#troubleshooting)

---

## Prérequis

- **Node.js** : 18.x ou supérieur
- **Supabase CLI** : https://supabase.com/docs/guides/cli/getting-started
- **Docker** (optionnel) : Pour la base de données locale

### Installation Supabase CLI

```bash
# macOS / Linux
brew install supabase/tap/supabase

# Windows (avec Scoop)
scoop install supabase
```

---

## Lancer la base en local

### 1. Initialiser Supabase (première fois seulement)

```bash
cd supabase
supabase init
```

### 2. Démarrer la base

```bash
supabase start
```

Cela démarre :
- PostgreSQL (port 54321)
- Kong API gateway (port 54322)
- pgAdmin (port 5050)
- Realtime (port 54323)

### 3. Charger le schéma et les données

```bash
supabase db reset
```

Cela exécute en ordre :
- Toutes les migrations (001 → 019)
- Le seed de démonstration (seed.sql)

La base est maintenant prête avec :
- 4 éditions (2024, 2025, 2026, 2027)
- 30 participants par édition (2024, 2025, 2026)
- 20 candidatures pour 2027
- 5 membres de jury
- Matchs et résultats de démonstration

### 4. Vérifier que tout fonctionne

```bash
# Afficher l'URL et les credentials de la base
supabase status
```

Vous verrez quelque chose comme :

```
API URL: http://localhost:54322
anon key: eyJ...
service_role key: eyJ...
```

---

## Rejouer les tests

### Tests pgTAP

```bash
supabase test db
```

Cela exécute tous les tests SQL dans `supabase/tests/` :
- `test_classement.sql` : Rangs provisoires, égalités
- `test_valider_match.sql` : Validation des matchs
- `test_rls.sql` : Politiques de sécurité
- `test_regles_metier.sql` : Règles métier

Les tests utilisent la structure `BEGIN...ROLLBACK` pour s'exécuter en isolation.

### Exemple de sortie réussie

```
✅ All tests passed (42/42)
```

### Relancer les tests après modifications

```bash
supabase db reset  # Réinitialise la base
supabase test db   # Relance les tests
```

---

## Créer les comptes de démonstration

### Variables d'environnement

Créez un fichier `.env.local` (ou `.env`) :

```env
SUPABASE_URL=http://localhost:54322
SUPABASE_SERVICE_ROLE_KEY=<votre_service_role_key>
ADMIN_PASSWORD=AdminPass123!
PARTICIPANT_PASSWORD=ParticipantPass123!
```

Récupérez la `SUPABASE_SERVICE_ROLE_KEY` avec :

```bash
supabase status | grep "service_role key"
```

### Exécuter le script de seed Auth

```bash
npm run seed:auth
```

Cela crée 4 comptes de démonstration :

| Email | Rôle | Permissions | Motdepasse |
|-------|------|-------------|-----------|
| `super_admin@devAs.test` | super_admin | Tous | ADMIN_PASSWORD |
| `admin_candidatures@devAs.test` | admin | candidatures | ADMIN_PASSWORD |
| `admin_resultats@devAs.test` | admin | resultats | ADMIN_PASSWORD |
| `participant@devAs.test` | participant | (aucun) | PARTICIPANT_PASSWORD |

### Tester les comptes

```bash
# Avec curl
curl -X POST http://localhost:54322/auth/v1/token?grant_type=password \
  -H "apikey: <votre_anon_key>" \
  -d '{
    "email": "super_admin@devAs.test",
    "password": "AdminPass123!"
  }'
```

---

## Fonctions et droits

### Fonctions critiques

#### 1. `valider_match(p_match_id UUID) → JSONB`

**Rôles autorisés** : super_admin, admin avec permission `resultats`

Valide un match :
- Vérifie tous les participants ont un score
- Détecte les égalités non départagées sur positions décisives
- Calcule les rangs et les issues
- Met à jour les statuts des participants
- Crée des notifications
- Remplit classements_finaux si finale

**Exemple**

```sql
SELECT valider_match('550e8400-e29b-41d4-a716-446655440000');
-- {
--   "success": true,
--   "message": "Match validé avec succès",
--   "match_id": "550e8400-e29b-41d4-a716-446655440000"
-- }
```

#### 2. `autoriser_correction(p_match_id UUID, p_motif TEXT) → JSONB`

**Rôles autorisés** : super_admin, admin avec permission `resultats`

Autorise une correction d'un match validé :
- motif obligatoire
- Refuse si une phase suivante est déjà validée
- Écrit au journal d'activité

**Exemple**

```sql
SELECT autoriser_correction(
  '550e8400-e29b-41d4-a716-446655440000',
  'Erreur de saisie score participant 5'
);
```

#### 3. `participants_proposes(p_phase_id UUID) → TABLE`

**Rôles autorisés** : Tous (security definer)

Retourne les participants disponibles pour un match :
- En statut `en_competition`
- Pas déjà dans un autre match de la phase
- Logique barrage : si barrage, seuls ceux avec issue = 'barrage'

**Exemple**

```sql
SELECT * FROM participants_proposes('550e8400-e29b-41d4-a716-446655440000');
```

#### 4. `deposer_candidature(...) → JSONB`

**Rôles autorisés** : Anonyme

Dépose une candidature :
- Vérifie que les candidatures sont ouvertes
- Vérifie unicité email (case-insensitive)
- Génère un code de suivi
- Retourne le code pour suivi

#### 5. `accepter_candidatura(p_candidature_id UUID) → JSONB`

**Rôles autorisés** : Admin avec permission `candidatures`

Accepte une candidature :
- Crée la fiche participant avec numéro séquentiel
- Met à jour candidature.statut = 'acceptee'
- Écrit au journal

#### 6. `creer_edition(...) → UUID`

**Rôles autorisés** : Super_admin

Crée une édition :
- Copie automatiquement les modèles_phases
- Retourne l'ID de la nouvelle édition

#### 7. `est_admin() / est_super_admin() / a_permission(nom) → BOOLEAN`

**Helper functions**

Vérifient le rôle et les permissions de l'utilisateur courant.

---

## Architecture RLS

### 4 niveaux d'accès

#### Anonyme (anon)

Accès en **lecture seule** :
- ✅ Éditions (non-preparation)
- ✅ Phases
- ✅ Matchs (non-planifiés)
- ✅ Résultats (en_cours/valides, sans issue avant validation)
- ✅ Vue v_participants_publics
- ✅ Actualités et annonces publiques
- ✅ Classements finaux
- ❌ Email, téléphone, date naissance des participants
- ❌ Candidatures, profils, journal, notes

#### Participant (authenticated)

Accès en **lecture propre + notifications** :
- ✅ Son propre profil participant
- ✅ Ses résultats
- ✅ Ses notifications (peut marquer comme lue)
- ✅ Annonces destinées aux participants
- ❌ Profils d'autres participants
- ❌ Scores d'autres participants
- ❌ Aucune modification de score, statut, rang

#### Admin (authenticated + permission)

Accès selon **permissions granulaires** :

| Permission | Accès |
|-----------|-------|
| `candidatures` | Lire/modifier candidatures, créer participants |
| `resultats` | Lire/modifier résultats, notes, valider matchs |
| `seances` | (Réservé) |
| `comptes` | Gérer profils participants, créer/modifier comptes |

#### Super-admin (authenticated + role)

Accès **complet** :
- ✅ Tous les admin droits
- ✅ Gestion des profils (créer/modifier/supprimer)
- ✅ Lecture journal d'activité complet
- ✅ Corrections et deverrouillage

### Exemple : Filtre sur les résultats

```sql
-- Anonyme voit scores en_cours/valides, pas issue
SELECT score, rang_provisoire FROM v_classement_match;

-- Participant voit uniquement ses scores
SELECT score, rang FROM resultats
WHERE participant_id IN (SELECT id FROM participants WHERE profil_id = auth.uid());

-- Admin (resultats) voit tous les résultats + notes
SELECT r.*, n.commentaire FROM resultats r
LEFT JOIN resultats_notes n ON r.id = n.resultat_id;

-- Super-admin voit tout + historique
SELECT * FROM journal_activite
WHERE table_cible = 'resultats';
```

---

## Structure des migrations

Les migrations sont exécutées en ordre :

1. **001** : Types énumérés
2. **002** : Tables auth, éditions, phases
3. **003** : Table candidatures
4. **004** : Tables participants, jury
5. **005** : Tables matchs, résultats
6. **006** : Classements, annonces, notifications
7. **007** : Journal d'activité
8. **008** : Vues
9. **009** : Fonctions helpers
10. **010** : Fonction valider_match
11. **011** : Fonction participants_proposes
12. **012** : Fonction autoriser_correction
13. **013** : Fonction creer_edition
14. **014** : Fonction deposer_candidature
15. **015** : Fonction accepter_candidature
16. **016** : Triggers (validation, immutabilité, journal)
17. **017** : Politiques RLS
18. **018** : Indexes (déjà inline)
19. **019** : Storage buckets (documentation)

**Important** : Jamais modifier une migration une fois validée. Pour corriger : créer une nouvelle migration.

---

## Configuration des buckets Storage

Trois buckets sont configurés (via dashboard ou SDK) :

### 1. candidatures-photos

- **Privé** (public: false)
- **Max size** : 300 Ko
- **Types** : webp, jpeg, png
- **Accès** : Admin avec permission `candidatures`
- **Upload** : URL signée côté serveur

### 2. participants-photos

- **Public** (public: true)
- **Max size** : 300 Ko
- **Types** : webp, jpeg, png
- **Accès** : Lecture publique, insertion admin

### 3. actualites-images

- **Public** (public: true)
- **Max size** : 300 Ko
- **Types** : webp, jpeg, png

---

## Realtime

Les tables `matchs` et `resultats` sont publiées en Realtime.

Les abonnés reçoivent les mises à jour en temps réel (scores, statuts) avec les filtres RLS appliqués.

**Note** : L'issue n'est renseignée qu'après validation, donc elle n'apparaît pas pendant le direct.

---

## Troubleshooting

### `supabase db reset` échoue

**Cause** : Erreur de syntaxe SQL ou conflit de contrainte unique.

**Solution** :
```bash
supabase db reset --force-remove
supabase start
supabase db reset
```

### Tests échouent

**Cause** : État inconsistant ou migrations manquantes.

**Solution** :
```bash
supabase test db -- --verbose
```

Cherchez l'erreur dans la sortie et vérifiez les migrations.

### Pas d'accès à la base

**Cause** : Docker non démarré ou port occupé.

**Solution** :
```bash
docker ps  # Vérifier que Supabase containers tournent
supabase stop
supabase start
```

### Seed Auth ne crée pas les comptes

**Cause** : Variables d'environnement manquantes.

**Solution** :
```bash
echo $SUPABASE_URL
echo $SUPABASE_SERVICE_ROLE_KEY
# Si vides, ajouter à .env.local
```

### Impossible valider un match : "Égalité non départagée"

**Cause** : Deux participants ont le même score à une position décisive (dernier qualifié, rang 1 finale) et pas de `rang_departage`.

**Solution** :
1. Ajouter manuellement `rang_departage` pour les participants égalitaires :

```sql
UPDATE resultats
SET rang_departage = 1
WHERE match_id = '...' AND participant_id = '...' AND score = 65;

UPDATE resultats
SET rang_departage = 2
WHERE match_id = '...' AND participant_id = '...' AND score = 65;
```

2. Revalider le match.

---

## Sécurité

### Principes appliqués

- ✅ **RLS partout** : Aucune table sans politique
- ✅ **Least privilege** : Admin granulaires, super_admin seulement nécessaire
- ✅ **Audit trail** : Journal d'activité sur mutations sensibles
- ✅ **Immutabilité** : Matches validés non modifiables sans motif
- ✅ **Données sensibles filtrées** : Email, téléphone, date naissance protégés
- ✅ **HTTPS/TLS** : Supabase impose HTTPS en production

### Vérification de sécurité

Supabase Security Advisor (dans le dashboard) doit afficher **aucune alerte critique**.

```bash
# Depuis CLI (via Supabase dashboard admin)
supabase status
```

---

## Support

- **Docs Supabase** : https://supabase.com/docs
- **Postgres Docs** : https://www.postgresql.org/docs
- **pgTAP (tests)** : https://pgtap.org

---

## Changelog

### Version 1.0 (Production)

- ✅ Schéma complet avec 19 tables
- ✅ 7 fonctions métier critiques
- ✅ RLS 4 niveaux
- ✅ Tests complets (pgTAP)
- ✅ Seed de démonstration
- ✅ 4 comptes de test

**Déployé** : 2026-11-10

---

**Fin de la documentation.** Pour lancer : `supabase start && supabase db reset`
