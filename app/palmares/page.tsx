import { Suspense } from 'react';
import Image from 'next/image';
import { io } from 'next/cache';
import { createClient } from '@/src/utils/supabase/server';
import { CrownIcon, TrophyIcon } from '@/src/components/common/icons';
import { EmptyState } from '@/src/components/ui/empty-state';
import { ErrorState } from '@/src/components/ui/error-state';
import type { Database } from '@/src/types/database';

export const metadata = {
  title: 'Palmarès – Question pour un DevAs',
  description: 'Découvrez les champions et les classements officiels de chaque édition.',
};

type PalmaresRow = Database['public']['Views']['v_palmares_publics']['Row'];

interface PalmaresEdition {
  id: string;
  year: number;
  name: string;
  entries: PalmaresRow[];
}

export default function PalmaresPage() {
  return (
    <>
      <header className="relative isolate overflow-hidden bg-ink py-16 text-center text-white md:py-20">
        <Image
          src="/trophy.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover object-center opacity-30"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/95 via-ink/80 to-ink/95" />
        <div className="wrap">
          <span className="eyebrow text-orange">Hall of fame</span>
          <h1 className="mt-2 text-white">Le palmarès</h1>
          <p className="mx-auto mt-3 max-w-[52ch] text-sm text-white/75">
            Les champions désignés par le jury, édition après édition.
          </p>
        </div>
      </header>

      <Suspense fallback={<PalmaresSkeleton />}>
        <PalmaresDynamic />
      </Suspense>
    </>
  );
}

function PalmaresSkeleton() {
  return (
    <div className="wrap flex flex-col gap-5 py-10 md:py-12">
      {[1, 2, 3].map((item) => (
        <div key={item} className="h-40 animate-pulse rounded-2xl bg-line/40" />
      ))}
    </div>
  );
}

async function PalmaresDynamic() {
  await io();

  let editions: PalmaresEdition[] | undefined;
  try {
    editions = await loadPalmares();
  } catch (error) {
    console.error('Échec du chargement du palmarès :', error);
  }

  if (editions === undefined) {
    return (
      <section className="wrap py-10 md:py-12">
        <ErrorState
          title="Palmarès indisponible"
          message="Impossible de charger les classements officiels."
        />
      </section>
    );
  }

  if (editions.length === 0) {
    return (
      <section className="wrap py-10 md:py-12">
        <EmptyState
          icon={<TrophyIcon className="h-7 w-7" />}
          title="Le palmarès se prépare"
          description="Les classements officiels apparaîtront ici dès qu’une édition sera terminée."
        />
      </section>
    );
  }

  return (
    <section className="wrap flex flex-col gap-5 py-10 md:gap-6 md:py-12">
      {editions.map((edition) => (
        <PalmaresCard key={edition.id} edition={edition} />
      ))}
    </section>
  );
}

async function loadPalmares(): Promise<PalmaresEdition[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('v_palmares_publics')
    .select('*')
    .order('edition_annee', { ascending: false })
    .order('rang', { ascending: true });

  if (error) throw error;

  const editions = new Map<string, PalmaresEdition>();
  for (const entry of data ?? []) {
    let edition = editions.get(entry.edition_id);
    if (!edition) {
      edition = {
        id: entry.edition_id,
        year: entry.edition_annee,
        name: entry.edition_nom,
        entries: [],
      };
      editions.set(entry.edition_id, edition);
    }
    edition.entries.push(entry);
  }

  return [...editions.values()];
}

function PalmaresCard({ edition }: { edition: PalmaresEdition }) {
  const champion = edition.entries.find((entry) => entry.rang === 1);

  return (
    <article className="grid overflow-hidden rounded-2xl border border-line bg-white shadow-sm md:grid-cols-[minmax(240px,0.8fr)_minmax(0,1.2fr)]">
      <div className="flex flex-col justify-center bg-gradient-to-br from-green-dark to-green px-6 py-7 text-white md:px-8">
        <p className="text-xs font-semibold text-white/80">
          Édition {edition.name} · {edition.year}
        </p>
        {champion ? (
          <>
            <div className="mt-4 grid h-14 w-14 place-items-center rounded-full border border-white/80 text-lg font-bold">
              {champion.participant_prenom[0]}{champion.participant_nom[0]}
            </div>
            <h2 className="mt-3 flex items-center gap-2 text-lg font-bold text-white">
              <CrownIcon className="h-5 w-5 shrink-0 text-orange" />
              {champion.participant_prenom} {champion.participant_nom}
            </h2>
            <p className="mt-1 text-xs text-white/80">
              {champion.participant_etablissement}
            </p>
          </>
        ) : (
          <p className="mt-4 text-sm text-white/90">Champion non renseigné</p>
        )}
      </div>

      <ol className="divide-y divide-line px-5 py-2 md:px-7">
        {edition.entries.map((entry) => (
          <li
            key={entry.participant_id}
            className="grid grid-cols-[1.5rem_minmax(0,1fr)_auto] items-center gap-3 py-3"
          >
            <span className="font-display text-sm font-bold text-mute">{entry.rang}</span>
            <span className="truncate text-sm font-semibold text-ink">
              {entry.participant_prenom} {entry.participant_nom}
            </span>
            <span className="hidden text-right text-xs text-mute sm:block">
              {entry.titre || 'Position officielle'}
            </span>
          </li>
        ))}
      </ol>
    </article>
  );
}
