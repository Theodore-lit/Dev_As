import { Suspense } from 'react';
import { io } from 'next/cache';
import { createClient } from '@/src/utils/supabase/server';
import { EditionList } from '@/src/components/editions/edition-list';
import type { EditionCalendarEntry } from '@/src/components/editions/edition-calendar';
import { ErrorState } from '@/src/components/ui/error-state';
import type { Database } from '@/src/types/database';

type Edition = Database['public']['Tables']['editions']['Row'];

export const metadata = {
  title: 'Editions - Question pour un DevAs',
  description: 'Decouvrez toutes les editions de Question pour un DevAs.',
};

export default function EditionsPage() {
  return (
    <>
      <div className="bg-soft border-b border-line py-14">
        <div className="wrap">
          <span className="eyebrow">Historique</span>
          <h1 className="mt-2 mb-3">Toutes les editions</h1>
          <p className="mute max-w-[56ch]">
            Retrouvez toutes les editions de Question pour un DevAs, leurs resultats, participants et classements.
          </p>
        </div>
      </div>
      <div className="py-12">
        <div className="wrap">
          <Suspense fallback={<EditionsSkeleton />}>
            <EditionsDynamic />
          </Suspense>
        </div>
      </div>
    </>
  );
}

function EditionsSkeleton() {
  return (
    <div className="animate-pulse grid gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-24 rounded-2xl bg-line/40" />
      ))}
    </div>
  );
}

async function EditionsDynamic() {
  await io();
  let editionRows: Edition[] = [];
  let calendarsByEditionId: Record<string, EditionCalendarEntry[]> = {};

  try {
    const supabase = await createClient();
    const { data: editions, error: editionsError } = await supabase
      .from('editions')
      .select('*')
      .order('annee', { ascending: false });

    if (editionsError) throw editionsError;

    editionRows = editions ?? [];
    let calendarRows: EditionCalendarEntry[] = [];

    if (editionRows.length > 0) {
      const { data, error: calendarError } = await supabase
        .from('edition_calendrier')
        .select('*')
        .in('edition_id', editionRows.map((edition) => edition.id))
        .order('ordre', { ascending: true });

      if (calendarError) throw calendarError;
      calendarRows = data ?? [];
    }

    calendarsByEditionId = calendarRows.reduce<Record<string, EditionCalendarEntry[]>>(
      (calendars, entry) => {
        (calendars[entry.edition_id] ??= []).push(entry);
        return calendars;
      },
      {},
    );
  } catch (error) {
    console.error(error);
    return <ErrorState title="Erreur" message="Impossible de charger les editions." />;
  }

  return (
    <EditionList
      editions={editionRows}
      calendarsByEditionId={calendarsByEditionId}
    />
  );
}
