const { createClient } = require('@supabase/supabase-js');

const url = 'https://vnuxmopaahgprmwhndke.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZudXhtb3BhYWhncHJtd2huZGtlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5OTU4OTQxNiwiZXhwIjoxOTk5OTg5NDE2fQ.hQ_w_QqKaZ7_Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z';
const adminPassword = 'AdminPass123!';
const participantPassword = 'ParticipantPass123!';

const supabase = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function seedAuth() {
  console.log('🌱 Création des comptes de démonstration\n');

  const accounts = [
    {
      email: 'super_admin@devAs.test',
      password: adminPassword,
      role: 'super_admin',
      nom: 'Admin',
      prenom: 'Super',
      permissions: ['candidatures', 'seances', 'resultats', 'comptes']
    },
    {
      email: 'admin_candidatures@devAs.test',
      password: adminPassword,
      role: 'admin',
      nom: 'Admin',
      prenom: 'Candidatures',
      permissions: ['candidatures']
    },
    {
      email: 'admin_resultats@devAs.test',
      password: adminPassword,
      role: 'admin',
      nom: 'Admin',
      prenom: 'Résultats',
      permissions: ['resultats']
    },
    {
      email: 'participant@devAs.test',
      password: participantPassword,
      role: 'participant',
      nom: 'Participant',
      prenom: 'Test',
      permissions: []
    }
  ];

  for (const acc of accounts) {
    try {
      console.log(`⏳ ${acc.email}...`);
      const { data, error } = await supabase.auth.admin.createUser({
        email: acc.email,
        password: acc.password,
        email_confirm: true
      });

      if (error) {
        console.error(`  ❌ ${error.message}`);
        continue;
      }

      const userId = data.user.id;

      const { error: profileError } = await supabase
        .from('profils')
        .insert([{
          id: userId,
          role: acc.role,
          nom: acc.nom,
          prenom: acc.prenom,
          permissions: acc.permissions,
          actif: true
        }]);

      if (profileError) {
        console.error(`  ❌ Profile: ${profileError.message}`);
      } else {
        console.log(`  ✅ Créé`);
      }
    } catch (err) {
      console.error(`  ❌ Erreur: ${err.message}`);
    }
  }

  console.log('\n✨ Terminé!');
}

seedAuth().catch(err => {
  console.error('❌ Erreur fatale:', err.message);
  process.exit(1);
});
