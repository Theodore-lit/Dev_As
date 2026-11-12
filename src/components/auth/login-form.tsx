'use client';

import { useState } from 'react';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { createClient } from '@/src/utils/supabase/client';
import { useRouter } from 'next/navigation';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profils')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (profileError) {
        console.error(profileError);
        setError(
          'Votre compte est connecté, mais aucun espace utilisateur ne lui est associé. Contactez un administrateur.',
        );
        return;
      }

      if (!profile) {
        setError(
          'Aucun profil utilisateur n’est associé à ce compte. Contactez un administrateur.',
        );
        return;
      }

      const dashboardPath =
        profile.role === 'admin' || profile.role === 'super_admin'
          ? '/admin'
          : profile.role === 'participant'
            ? '/participant'
            : null;

      if (!dashboardPath) {
        setError('Aucun espace n’est associé au rôle de votre compte.');
        return;
      }

      router.replace(dashboardPath);
      router.refresh();
    } catch (err) {
      setError('Une erreur s\'est produite lors de la connexion.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="stack gap-5">
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red" role="alert">
          <svg viewBox="0 0 20 20" className="mt-0.5 h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
            <circle cx="10" cy="10" r="7.5" />
            <path d="M10 6.5v4m0 3h.01" />
          </svg>
          <p className="text-sm leading-5">{error}</p>
        </div>
      )}

      <Input
        label="Email"
        type="email"
        placeholder="nom@exemple.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
        required
      />

      <Input
        label="Mot de passe"
        type="password"
        placeholder="Votre mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="current-password"
        required
      />

      <Button
        type="submit"
        variant="primary"
        size="lg"
        loading={loading}
        disabled={loading}
        className="w-full !rounded-xl"
      >
        Se connecter
      </Button>
    </form>
  );
}
