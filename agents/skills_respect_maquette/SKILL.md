---
name: respect-maquette-devas
description: À utiliser dès qu'on fournit une maquette (image) à reproduire en écran Next.js pour le projet DevAs. Impose fidélité visuelle, données dynamiques, questions sur les zones d'ombre et réutilisation de la stack déjà installée (Tailwind v4, shadcn/ui, Supabase).
---

# Skill : implémenter une maquette fidèlement (projet DevAs)

## Objectif
Transformer une maquette fournie en image en écran Next.js fonctionnel, fidèle au visuel, branché sur des données dynamiques, en utilisant exclusivement les outils déjà présents dans le projet.

## Règle d'or : utiliser l'existant, ne rien downgrader
Avant d'écrire une ligne de code, **inspecter le projet** (`package.json`, `app/globals.css`, `components.json`, `postcss.config.mjs`, dossier `components/`, `lib/`).

- **Tailwind v4 est installé. Interdit** d'installer, forcer ou imiter Tailwind v3 (pas de `@tailwind base/components/utilities`, pas de `tailwind.config.js`, pas de `content: [...]`).
- Syntaxe v4 uniquement : `@import "tailwindcss";` et `@theme { ... }` dans `app/globals.css`. Plugins via `@plugin`, variantes via `@custom-variant`, classes custom réutilisables via `@utility`.
- Ne jamais ajouter une dépendance si une solution existe déjà dans le projet (Tailwind, shadcn/ui, `next/font`, client Supabase déjà configuré).
- Une nouvelle dépendance n'est permise qu'après **accord explicite de l'utilisateur** : expliquer pourquoi l'existant ne suffit pas.
- Si une commande échoue, **corriger la cause** ; ne pas contourner en changeant de version ou de technologie.
- Ne pas modifier la configuration globale (PostCSS, `globals.css`, tokens du thème, layout racine) sans le signaler et le justifier.

## Stack du projet
Next.js (App Router), TypeScript, React, Tailwind CSS v4, shadcn/ui, Supabase (PostgreSQL, Auth, Storage), Vercel.

## Charte graphique à respecter
- Polices : **Montserrat** (titres, via `font-display`), **Inter** (texte, via `font-sans`), déjà déclarées avec `next/font` dans `app/layout.tsx`.
- Couleurs : utiliser les tokens du `@theme` (`bg-green`, `text-green-dark`, `bg-green-pale`, `text-ink`, `text-mute`, `border-line`, `bg-soft`, `bg-gold-pale`, etc.). **Aucune couleur écrite en dur** (`#xxxxxx`) dans les composants.
- Si une couleur de la maquette n'existe pas dans les tokens : poser la question, puis l'ajouter dans `@theme`, jamais en valeur isolée.
- Composants utilitaires existants à réutiliser avant d'en créer : `.wrap`, `.card`, `.card.soft`, `.btn-primary`, `.btn-secondary`, `.eyebrow`, `.tw` (tableaux), `.av`, `.who`, `.ico`, `.empty`, `.row`, `.stack`, `.grid-auto` + `.c2/.c3/.c4`.
- Le logo fourni ne doit jamais être modifié.

## Méthode de travail

### 1. Analyser la maquette avant de coder
Décrire (brièvement) ce qui est vu : structure, sections, composants, états visibles, couleurs, typographies, espacements. Lister les composants shadcn/ui et classes existantes qui correspondent.

### 2. Poser les questions sur les zones d'ombre **avant** d'implémenter
Ne jamais deviner. Poser des questions courtes, groupées, avec une proposition par défaut, notamment sur :
- États non visibles : chargement, vide, erreur, survol, désactivé, formulaire invalide.
- Comportement des boutons et liens (destination, action, confirmation).
- Origine des données (table, colonne, filtre, tri, pagination).
- Droits d'accès : public, participant ou administration.
- Éléments illisibles ou ambigus de l'image, comportement à partir de la taille tablette/mobile.
- Texte exact des libellés, messages et formats de date, nombres et monnaie (FCFA).

Si l'utilisateur ne peut pas répondre tout de suite : avancer sur les parties claires, marquer chaque hypothèse par un commentaire `// HYPOTHÈSE:` et la lister dans le compte rendu final.

### 3. Rendre les données dynamiques
- **Aucune donnée en dur** (noms de candidats, scores, classements, dates, statistiques, annonces) dans le JSX.
- Les données viennent de Supabase via le client déjà configuré dans le projet. Réutiliser les helpers et types existants.
- Si la table ou la colonne n'existe pas : le signaler et proposer le schéma plutôt que de l'inventer silencieusement.
- Pendant que le backend n'est pas prêt : isoler des données de démonstration dans un seul fichier (ex. `lib/mocks/…`) derrière une fonction de récupération qui aura la même signature que la vraie, pour basculer sans toucher aux composants.
- Prévoir pour chaque liste ou bloc : état de chargement (skeleton), état vide (`.empty`), état d'erreur.
- Typer avec TypeScript (pas de `any`). Validation côté serveur pour toute écriture.
- Composants serveur par défaut ; `"use client"` seulement si interaction nécessaire.

### 4. Fidélité visuelle
- Reproduire la hiérarchie, les espacements, les arrondis, les ombres et les alignements de la maquette. Pas d'« amélioration » non demandée.
- Responsive obligatoire (mobile d'abord : les utilisateurs sont surtout sur mobile avec une connexion limitée). Si la maquette ne montre que le desktop, demander ou déduire de façon cohérente et le signaler.
- Accessibilité de base : balises sémantiques, `alt`, contrastes, focus visible, labels de formulaire.
- Images : `next/image` ; légèreté prioritaire.

### 5. Vérifier avant de rendre
- Le projet compile (`npm run build` ou au minimum `npm run dev` sans erreur) et le lint passe.
- Aucun style Tailwind v3, aucune dépendance ajoutée sans accord, aucune couleur en dur.
- Comparer le rendu à la maquette point par point (sections, couleurs, polices, espacements, états).

## Compte rendu final (court)
1. Fichiers créés ou modifiés.
2. Composants et classes existants réutilisés.
3. Sources de données branchées, et tables ou colonnes manquantes éventuelles.
4. Hypothèses prises et questions encore ouvertes.
5. Tout écart avec la maquette, avec sa raison.

## Interdits récapitulatifs
- Installer ou imposer Tailwind v3, créer `tailwind.config.js`.
- Ajouter une librairie sans accord explicite.
- Coder des données statiques à la place de données dynamiques.
- Deviner une zone d'ombre sans la signaler ni poser la question.
- Modifier la maquette, la charte ou le logo de sa propre initiative.
