#!/bin/bash

# Script de setup PostgreSQL pour Question pour un DevAs
# Usage: ./scripts/setup-db.sh

set -e

echo "🚀 Setup PostgreSQL - Question pour un DevAs"

# Configuration
DB_NAME="dev_as_local"
DB_USER="dev_as_user"
DB_PASSWORD="dev_as_password"
DB_PORT="${DB_PORT:-5432}"
DB_HOST="${DB_HOST:-localhost}"

echo "📦 Configuration:"
echo "  Host: $DB_HOST"
echo "  Port: $DB_PORT"
echo "  Database: $DB_NAME"
echo "  User: $DB_USER"

# Créer la base de données
echo "📝 Création de la base de données..."
psql -h $DB_HOST -U postgres -p $DB_PORT -tc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" | grep -q 1 || \
psql -h $DB_HOST -U postgres -p $DB_PORT -c "CREATE DATABASE $DB_NAME;"

# Créer l'utilisateur
echo "👤 Création de l'utilisateur..."
psql -h $DB_HOST -U postgres -p $DB_PORT -d $DB_NAME -tc "SELECT 1 FROM pg_roles WHERE rolname = '$DB_USER'" | grep -q 1 || \
psql -h $DB_HOST -U postgres -p $DB_PORT -d $DB_NAME -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';"

# Assigner les droits
psql -h $DB_HOST -U postgres -p $DB_PORT -d $DB_NAME -c "ALTER ROLE $DB_USER WITH CREATEDB;"
psql -h $DB_HOST -U postgres -p $DB_PORT -d $DB_NAME -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"

echo "✅ Base de données créée!"

# Appliquer les migrations
echo ""
echo "🔨 Application des migrations..."
export PGPASSWORD=$DB_PASSWORD
for file in supabase/migrations/*.sql; do
  echo "  Exécution: $file"
  psql -h $DB_HOST -U $DB_USER -d $DB_NAME -p $DB_PORT -f "$file"
done
unset PGPASSWORD

# Charger le seed
echo ""
echo "🌱 Chargement du seed..."
export PGPASSWORD=$DB_PASSWORD
psql -h $DB_HOST -U $DB_USER -d $DB_NAME -p $DB_PORT -f "supabase/seeds/seed.sql"
unset PGPASSWORD

echo ""
echo "✨ Setup terminé!"
echo ""
echo "🔗 Connexion:"
echo "  psql -h $DB_HOST -U $DB_USER -d $DB_NAME -p $DB_PORT"
echo ""
echo "📝 Prochaines étapes:"
echo "  1. npm run seed:auth (pour créer les comptes de démo)"
echo "  2. supabase test db (pour lancer les tests, si Supabase CLI installé)"
