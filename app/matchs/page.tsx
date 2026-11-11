import { Suspense } from 'react';
import { io } from 'next/cache';
import { createClient } from '@/src/utils/supabase/server';
import { MatchList } from '@/src/components/matchs/match-list';
import { ErrorState } from '@/src/components/ui/error-state';

export const metadata = {
  title: 'Matchs - Question pour un DevAs',
  description: 'Consultez les matchs et resultats de Question pour un DevAs.',
};

export default function MatchsPage() {
  return (
    <div className="bg-soft">
      <div className="bg-white border-b border-line py-12">
        <div className="max-w-[1180px] mx-auto px-4">
          <span className="eyebrow">Competition</span>
          <h1 className="mt-2 mb-2">Matchs et Resultats</h1>
          <p className="mute">
            Consultez tous les matchs, les scores et les resultats de chaque phase.
          </p>
        </div>
      </div>
      <div className="max-w-[1180px] mx-auto px-4 py-10">
        <Suspense fallback={<MatchsSkeleton />}>
          <MatchsDynamic />
        </Suspense>
      </div>
    </div>
  );
}

function MatchsSkeleton() {
  return (
    <div className="animate-pulse grid gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-20 rounded-2xl bg-line/40" />
      ))}
    </div>
  );
}

async function MatchsDynamic() {
  await io();
  try {
    const supabase = await createClient();
    const { data: matchs, error } = await supabase
      .from('matchs')
      .select('*, phase:phases(nom, type)')
      .order('date_heure', { ascending: false });

    if (error) throw error;
    return <MatchList matchs={matchs ?? []} />;
  } catch (error) {
    console.error(error);
    return <ErrorState title="Erreur" message="Impossible de charger les matchs." />;
  }
}
