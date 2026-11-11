import { Suspense } from 'react';
import { io } from 'next/cache';
import { createClient } from '@/src/utils/supabase/server';
import { ParticipantList } from '@/src/components/participants/participant-list';
import { ErrorState } from '@/src/components/ui/error-state';

export const metadata = {
  title: 'Participants – Question pour un DevAs',
  description: 'Découvrez les candidats et participants de Question pour un DevAs.',
};

export default function ParticipantsPage() {
  return (
    <Suspense fallback={<ParticipantsSkeleton />}>
      <ParticipantsDynamic />
    </Suspense>
  );
}

function ParticipantsSkeleton() {
  return (
    <div className="py-20">
      <div className="wrap">
        <div className="animate-pulse space-y-4">
          <div className="h-32 rounded-2xl bg-line/40" />
          <div className="h-64 rounded-2xl bg-line/40" />
        </div>
      </div>
    </div>
  );
}

async function ParticipantsDynamic() {
  await io();

  let data: Awaited<ReturnType<typeof loadParticipantsData>> | undefined;
  try {
    data = await loadParticipantsData();
  } catch (error) {
    console.error('Échec du chargement des participants :', formatError(error));
  }

  if (data === undefined) {
    return (
      <div className="py-20">
        <div className="wrap">
          <ErrorState title="Erreur" message="Impossible de charger les participants." />
        </div>
      </div>
    );
  }

  if (data === null) {
    return (
      <div className="py-20">
        <div className="wrap">
          <ErrorState title="Aucune édition" message="Aucune édition trouvée." />
        </div>
      </div>
    );
  }

  const { edition, candidatures, participants } = data;

  return (
    <>
      <div className="bg-soft border-b border-line py-14">
        <div className="wrap">
          <span className="eyebrow">Édition {edition.annee}</span>
          <h1 className="mt-2 mb-3">Candidats &amp; Participants</h1>
          {edition.description && (
            <p className="mute max-w-[56ch]">{edition.description}</p>
          )}
          <div className="flex flex-wrap gap-4 mt-5">
            <div className="inline-flex items-center gap-2 bg-white border border-line rounded-xl px-4 py-2 text-sm">
              <span className="font-bold text-ink">{candidatures.length}</span>
              <span className="text-mute">candidat(s)</span>
            </div>
            <div className="inline-flex items-center gap-2 bg-white border border-line rounded-xl px-4 py-2 text-sm">
              <span className="font-bold text-green-dark">{participants.length}</span>
              <span className="text-mute">participant(s) confirmé(s)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="py-12">
        <div className="wrap">
          <ParticipantList
            candidatures={candidatures}
            participants={participants}
          />
        </div>
      </div>
    </>
  );
}

async function loadParticipantsData() {
  const supabase = await createClient();

  const { data: edition, error: editionError } = await supabase
    .from('editions')
    .select('*')
    .order('annee', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (editionError) throw editionError;
  if (!edition) return null;

  const [
    { data: candidatures, error: candidaturesError },
    { data: participants, error: participantsError },
  ] = await Promise.all([
    supabase
      .from('v_candidatures_publiques')
      .select('id, nom, prenom, etablissement, classe_niveau, statut, created_at')
      .eq('edition_id', edition.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('v_participants_publics')
      .select('id, nom, prenom, numero, statut, etablissement, classe_niveau')
      .eq('edition_id', edition.id)
      .order('numero', { ascending: true }),
  ]);

  if (candidaturesError) throw candidaturesError;
  if (participantsError) throw participantsError;

  return {
    edition,
    candidatures: candidatures ?? [],
    participants: participants ?? [],
  };
}

function formatError(error: unknown): string {
  if (error instanceof Error) {
    return `${error.name}: ${error.message}`;
  }

  if (typeof error === 'object' && error !== null) {
    const details = error as Record<string, unknown>;
    const fields = ['message', 'code', 'details', 'hint'];
    const description = fields
      .filter((field) => field in details && details[field] != null)
      .map((field) => `${field}: ${String(details[field])}`)
      .join(' | ');

    return description || JSON.stringify(error);
  }

  return String(error);
}
