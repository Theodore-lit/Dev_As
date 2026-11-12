import React from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/src/utils/supabase/server';
import { DashboardSidebar } from '@/src/components/common/dashboard-sidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({
  children,
}: AdminLayoutProps) {
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

  if (!profile || (profile.role !== 'admin' && profile.role !== 'super_admin')) {
    redirect(profile?.role === 'participant' ? '/participant' : '/');
  }

  const userName = `${profile.prenom} ${profile.nom}`.trim();

  return (
    <div className="relative flex min-h-full flex-1">
      <DashboardSidebar role="admin" userName={userName} />
      <div className="min-w-0 flex-1">
        <div className="mx-auto max-w-[1200px] px-4 py-8 xl:pl-72">
          {children}
        </div>
      </div>
    </div>
  );
}
