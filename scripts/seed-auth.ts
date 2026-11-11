/**
 * Task 21: Seed Auth - Crée les comptes de démonstration
 * Usage: npx ts-node scripts/seed-auth.ts
 * 
 * Nécessite les variables d'environnement :
 * - NEXT_PUBLIC_SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY
 * - ADMIN_PASSWORD
 * - PARTICIPANT_PASSWORD
 */

import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Charger .env manuellement
const envPath = path.join(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && !key.startsWith('#')) {
      process.env[key.trim()] = value?.trim();
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const adminPassword = process.env.ADMIN_PASSWORD!;
const participantPassword = process.env.PARTICIPANT_PASSWORD!;

if (!supabaseUrl || !supabaseServiceKey || !adminPassword || !participantPassword) {
  console.error('❌ Erreur : variables d\'environnement manquantes');
  console.error('Requises: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ADMIN_PASSWORD, PARTICIPANT_PASSWORD');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

interface AuthUser {
  email: string;
  password: string;
  email_confirm: boolean;
}

interface ProfileData {
  role: 'super_admin' | 'admin' | 'participant';
  nom: string;
  prenom: string;
  permissions: string[];
  actif: boolean;
}

async function createAccountAndProfile(userData: AuthUser, profileData: ProfileData) {
  try {
    console.log(`Création: ${userData.email}`);

    // Créer utilisateur Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      email_confirm: userData.email_confirm,
    });

    if (authError) {
      console.error(`  ❌ Erreur Auth: ${authError.message}`);
      return;
    }

    const userId = authData.user?.id;
    if (!userId) {
      console.error(`  ❌ Pas d'ID utilisateur`);
      return;
    }

    // Créer profil
    const { error: profileError } = await supabase
      .from('profils')
      .insert([
        {
          id: userId,
          role: profileData.role,
          nom: profileData.nom,
          prenom: profileData.prenom,
          permissions: profileData.permissions,
          actif: profileData.actif,
        },
      ]);

    if (profileError) {
      console.error(`  ❌ Erreur profil: ${profileError.message}`);
      return;
    }

    console.log(`  ✅ Créé: ${userData.email} (${profileData.role})`);
  } catch (error: unknown) {
    const err = error as Error;
    console.error(`  ❌ Erreur: ${err.message}`);
  }
}

async function seedAuth() {
  console.log('🌱 Seed Auth - Création des comptes de démonstration\n');

  const accounts: Array<{
    auth: AuthUser;
    profile: ProfileData;
  }> = [
    {
      auth: {
        email: 'super_admin@devAs.test',
        password: adminPassword,
        email_confirm: true,
      },
      profile: {
        role: 'super_admin',
        nom: 'Admin',
        prenom: 'Super',
        permissions: ['candidatures', 'seances', 'resultats', 'comptes'],
        actif: true,
      },
    },
    {
      auth: {
        email: 'admin_candidatures@devAs.test',
        password: adminPassword,
        email_confirm: true,
      },
      profile: {
        role: 'admin',
        nom: 'Admin',
        prenom: 'Candidatures',
        permissions: ['candidatures'],
        actif: true,
      },
    },
    {
      auth: {
        email: 'admin_resultats@devAs.test',
        password: adminPassword,
        email_confirm: true,
      },
      profile: {
        role: 'admin',
        nom: 'Admin',
        prenom: 'Résultats',
        permissions: ['resultats'],
        actif: true,
      },
    },
    {
      auth: {
        email: 'participant@devAs.test',
        password: participantPassword,
        email_confirm: true,
      },
      profile: {
        role: 'participant',
        nom: 'Participant',
        prenom: 'Test',
        permissions: [],
        actif: true,
      },
    },
  ];

  // Créer chaque compte
  for (const { auth, profile } of accounts) {
    await createAccountAndProfile(auth, profile);
  }

  console.log('\n✅ Seed Auth terminé\n');
  console.log('Comptes créés :');
  console.log('  • super_admin@devAs.test (super_admin)');
  console.log('  • admin_candidatures@devAs.test (admin, permission: candidatures)');
  console.log('  • admin_resultats@devAs.test (admin, permission: resultats)');
  console.log('  • participant@devAs.test (participant, en édition 2026)');
}

seedAuth().catch((error: unknown) => {
  const err = error as Error;
  console.error('❌ Erreur fatale:', err.message);
  process.exit(1);
});
