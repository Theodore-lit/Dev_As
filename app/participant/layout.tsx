import React from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/src/utils/supabase/server';
import { Header } from '@/src/components/common/header';

interface ParticipantLayoutProps {
  children: React.ReactNode;
}

export default async function ParticipantLayout({
  children,
}: ParticipantLayoutProps) {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/connexion');
  }

  const { data: profile } = await supabase
    .from('profils')
    .select('role, prenom, nom')
    .eq('id', session.user.id)
    .single();

  if (!profile || profile.role !== 'participant') {
    redirect('/');
  }

  const userName = `${profile.prenom} ${profile.nom}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header role="participant" userName={userName} />
      <div style={{ display: 'flex', flex: 1 }}>
        <aside style={{ width: '16rem', borderRight: '1px solid #E5E7EB', backgroundColor: '#F3F4F6', maxHeight: 'calc(100vh - 70px)', overflowY: 'auto', display: 'none' }} className="md:block">
          <nav style={{ padding: '1rem' }}>
            <a href="/participant" style={{ display: 'block', padding: '0.5rem 1rem', fontSize: '0.875rem', color: '#4B5563', borderRadius: '10px' }} className="hover:bg-white">
              Mon tableau de bord
            </a>
          </nav>
        </aside>
        <main style={{ flex: 1 }}>
          <div style={{ margin: '0 auto', padding: '2rem 1rem', maxWidth: '1200px' }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
