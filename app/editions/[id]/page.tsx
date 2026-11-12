import { Suspense } from 'react';
import { io } from 'next/cache';
import { notFound } from 'next/navigation';
import { createClient } from '@/src/utils/supabase/server';
import { EditionDetail } from '@/src/components/editions/edition-detail';
import { ErrorState } from '@/src/components/ui/error-state';
import type { Database } from '@/src/types/database';

export const instant = false;

type Edition = Database['public']['Tables']['editions']['Row'];
type Phase = Database['public']['Tables']['phases']['Row'];

interface EditionDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: EditionDetailPageProps) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: edition } = await supabase
      .from('editions')
      .select('*')
      .eq('id', id)
      .single();

    if (!edition) {
      return {
        title: 'Édition non trouvée',
      };
    }

    return {
      title: `${edition.nom} - Question pour un DevAs`,
      description: edition.description || `Édition ${edition.annee}`,
    };
  } catch {
    return {
      title: 'Édition - Question pour un DevAs',
    };
  }
}

export default function EditionDetailPage({
  params,
}: EditionDetailPageProps) {
  return (
    <Suspense fallback={<EditionDetailSkeleton />}>
      <EditionDetailContent params={params} />
    </Suspense>
  );
}

function EditionDetailSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-[390px] bg-green-dark/10 sm:h-[440px]" />
      <div className="wrap relative -mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="h-24 rounded-2xl bg-line/60" />
        ))}
      </div>
      <div className="wrap mt-8 grid gap-6 lg:grid-cols-[1.5fr_0.8fr]">
        <div className="h-52 rounded-2xl bg-line/40" />
        <div className="h-52 rounded-2xl bg-line/40" />
      </div>
    </div>
  );
}

async function EditionDetailContent({
  params,
}: EditionDetailPageProps) {
  await io();
  const { id } = await params;

  let supabase: Awaited<ReturnType<typeof createClient>> | null = null;
  let edition: Edition | null = null;
  let editionError: unknown = null;

  try {
    supabase = await createClient();
    const { data, error } = await supabase
      .from('editions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    edition = data;
  } catch (error) {
    console.error('Error fetching edition:', error);
    editionError = error;
  }

  if (editionError !== null) {
    return (
      <div className="wrap py-12">
        <ErrorState
          title="Erreur lors du chargement"
          message="Une erreur s'est produite lors du chargement de l'édition."
        />
      </div>
    );
  }

  if (!edition) {
    notFound();
  }

  if (!supabase) {
    throw new Error('Le client Supabase est indisponible.');
  }

  let phases: Phase[] = [];
  let stats = {
    candidatures: 0,
    participants: 0,
    matchs: 0,
  };
  let statsError: unknown = null;

  try {
    const [
      { data: editionPhases, error: phasesError },
      { count: candidaturesCount, error: candidaturesError },
      { count: participantsCount, error: participantsError },
    ] = await Promise.all([
      supabase
        .from('phases')
        .select('*')
        .eq('edition_id', edition.id)
        .order('ordre', { ascending: true }),
      supabase
        .from('v_candidatures_publiques')
        .select('id', { count: 'exact', head: true })
        .eq('edition_id', edition.id),
      supabase
        .from('v_participants_publics')
        .select('id', { count: 'exact', head: true })
        .eq('edition_id', edition.id),
    ]);

    if (phasesError) throw phasesError;
    if (candidaturesError) throw candidaturesError;
    if (participantsError) throw participantsError;

    let matchsCount = 0;
    if (editionPhases && editionPhases.length > 0) {
      const { count, error: matchsError } = await supabase
        .from('matchs')
        .select('id', { count: 'exact', head: true })
        .in('phase_id', editionPhases.map((phase) => phase.id));
      if (matchsError) throw matchsError;
      matchsCount = count ?? 0;
    }

    phases = editionPhases ?? [];
    stats = {
      candidatures: candidaturesCount ?? 0,
      participants: participantsCount ?? 0,
      matchs: matchsCount,
    };
  } catch (error) {
    console.error('Error fetching edition:', error);
    statsError = error;
  }

  if (statsError !== null) {
    return (
      <div className="wrap py-12">
        <ErrorState
          title="Erreur lors du chargement"
          message="Une erreur s'est produite lors du chargement de l'édition."
        />
      </div>
    );
  }

  return <EditionDetail edition={edition} phases={phases} stats={stats} />;
}
