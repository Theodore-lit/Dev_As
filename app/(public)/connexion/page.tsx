import { redirect } from 'next/navigation';
import { createClient } from '@/src/utils/supabase/server';
import { LoginForm } from '@/src/components/auth/login-form';


export const instant = false;

export const metadata = {
  title: 'Connexion - Question pour un DevAs',
  description: 'Connectez-vous à votre compte',
};

export default async function ConnexionPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (session) {
    redirect('/');
  }

  return (
    <section className="s">
      <div className="wrap" style={{ maxWidth: '560px', margin: '0 auto' }}>
        <div className="sh" style={{ textAlign: 'center' }}>
          <h1>Connexion</h1>
          <p className="mute">
            Connectez-vous à votre compte pour accéder à votre espace personnel.
          </p>
        </div>

        <div style={{ marginTop: '48px' }} className="card">
          <LoginForm />
        </div>
      </div>
    </section>
  );
}
