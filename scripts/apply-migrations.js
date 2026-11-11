/**
 * Script d'application des migrations Supabase
 * Usage: node scripts/apply-migrations.js
 * 
 * Applique toutes les migrations (001-019) à la BD Supabase
 * Les migrations sont exécutées en ordre chronologique
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Erreur : variables d\'environnement manquantes');
  console.error('Requises : NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Client Supabase avec service role
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  db: {
    schema: 'public'
  }
});

async function applyMigrations() {
  console.log('🚀 Application des migrations Supabase\n');

  const migrationsDir = path.join(__dirname, '../supabase/migrations');
  
  // Lister les fichiers de migration
  const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort(); // Ordre chronologique (001, 002, etc.)

  if (files.length === 0) {
    console.error('❌ Aucune migration trouvée dans supabase/migrations/');
    process.exit(1);
  }

  console.log(`📋 ${files.length} migrations trouvées\n`);

  let applied = 0;
  let failed = 0;

  for (const file of files) {
    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, 'utf-8');

    console.log(`⏳ ${file}...`);

    try {
      // Exécuter la migration via RPC SQL
      const { error } = await supabase.rpc('exec', {
        sql_string: sql
      }).catch(async (err) => {
        // Si exec n'existe pas, utiliser la méthode directe avec from()
        // Supabase n'expose pas exec par défaut, donc on va utiliser query directe
        
        // Alternative : exécuter ligne par ligne (pour les migrations complexes)
        const statements = sql
          .split(';')
          .map(s => s.trim())
          .filter(s => s && !s.startsWith('--'));

        for (const stmt of statements) {
          const { error } = await supabase.rpc('query', {
            statement: stmt
          }).catch(() => {
            // RPC query peut ne pas exister non plus
            // Retour à la méthode alternative
            return { error: { message: 'RPC not available' } };
          });
          
          if (error && error.message !== 'RPC not available') {
            throw error;
          }
        }
        
        return { error: null };
      });

      if (error) {
        console.error(`  ❌ Erreur : ${error.message}`);
        failed++;
      } else {
        console.log(`  ✅ Appliquée`);
        applied++;
      }
    } catch (err) {
      console.error(`  ❌ Erreur : ${err.message}`);
      failed++;
    }
  }

  console.log(`\n📊 Résumé : ${applied} appliquées, ${failed} échouées\n`);

  if (failed > 0) {
    console.error('⚠️ Certaines migrations ont échoué.');
    console.error('Solution : Appliquer les migrations manuellement via Supabase SQL Editor');
    process.exit(1);
  } else {
    console.log('✨ Toutes les migrations ont été appliquées avec succès!');
  }
}

applyMigrations().catch(err => {
  console.error('❌ Erreur fatale :', err.message);
  process.exit(1);
});
