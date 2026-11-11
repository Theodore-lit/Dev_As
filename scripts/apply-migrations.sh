#!/bin/bash

# Script d'application des migrations Supabase
# Usage: bash scripts/apply-migrations.sh
# 
# Extrait la connexion DB de Supabase et applique les migrations

set -e

echo "🚀 Application des migrations Supabase"
echo ""

# Extraire l'URL Supabase du .env
SUPABASE_URL="${NEXT_PUBLIC_SUPABASE_URL:-}"
SERVICE_ROLE_KEY="${SUPABASE_SERVICE_ROLE_KEY:-}"

if [ -z "$SUPABASE_URL" ] || [ -z "$SERVICE_ROLE_KEY" ]; then
  echo "❌ Erreur : NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY manquants dans .env"
  exit 1
fi

# Extraire host et projet ID de l'URL
# Format: https://PROJECT_ID.supabase.co
PROJECT_ID=$(echo "$SUPABASE_URL" | sed 's|https://||' | sed 's|\.supabase\.co||')
DB_HOST="$PROJECT_ID.supabase.co"
DB_PORT="5432"
DB_NAME="postgres"
DB_USER="postgres"

# Le mot de passe est stocké dans Supabase - utiliser psql avec URL de connexion
# URL format: postgresql://user:password@host:port/database
# Mais on n'a pas le mot de passe. Solution : utiliser Supabase CLI si disponible

echo "📋 Migrations trouvées :"
ls -1 supabase/migrations/*.sql | wc -l

echo ""
echo "⚠️ Les migrations Supabase doivent être appliquées via :"
echo ""
echo "Option 1 : Supabase CLI (recommandé)"
echo "  npm install -g @supabase/cli"
echo "  supabase link --project-ref $PROJECT_ID"
echo "  supabase db push"
echo ""
echo "Option 2 : Supabase Dashboard"
echo "  1. Accédez à https://app.supabase.com"
echo "  2. Sélectionnez le projet : $PROJECT_ID"
echo "  3. SQL Editor → New Query"
echo "  4. Copiez les migrations une par une"
echo ""
echo "Option 3 : Via psql (besoin du mot de passe DB)"
echo "  psql -h $DB_HOST -U $DB_USER -d $DB_NAME -p $DB_PORT -f supabase/migrations/001_types_enums.sql"
echo "  ..."
echo ""
