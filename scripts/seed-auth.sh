#!/bin/bash

# Charger les variables d'environnement de .env
set -a
source .env
set +a

# Lancer le script TypeScript
npx ts-node scripts/seed-auth.ts
