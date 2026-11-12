import Image from 'next/image';
import Link from 'next/link';
import {
  CalendarMilestones,
  formatEditionDate,
  type EditionCalendarEntry,
} from './edition-calendar';
import { Badge } from '@/src/components/ui/badge';
import type { Database } from '@/src/types/database';

type Edition = Database['public']['Tables']['editions']['Row'];

interface EditionCardProps {
  edition: Edition;
  calendar?: EditionCalendarEntry[];
}

const STATUS_MAP: Record<
  string,
  { label: string; variant: 'ok' | 'wait' | 'gold' | 'no' | 'default' }
> = {
  preparation:           { label: 'En préparation',       variant: 'default' },
  candidatures_ouvertes: { label: 'Candidatures ouvertes', variant: 'ok' },
  en_cours:              { label: 'En cours',               variant: 'wait' },
  terminee:              { label: 'Terminée',               variant: 'gold' },
  archivee:              { label: 'Archivée',               variant: 'no' },
};

const EDITION_IMAGE =
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80';

function formatDate(value: string) {
  return formatEditionDate(value, { day: 'numeric', month: 'short', year: 'numeric' });
}

export function EditionCard({ edition, calendar = [] }: EditionCardProps) {
  const status = STATUS_MAP[edition.statut] ?? { label: edition.statut, variant: 'default' as const };
  const firstCalendarDate = calendar[0]?.date_match ?? edition.date_debut;
  const lastCalendarDate = calendar[calendar.length - 1]?.date_match ?? edition.date_fin;
  const dateRange =
    firstCalendarDate && lastCalendarDate
      ? `${formatDate(firstCalendarDate)} – ${formatDate(lastCalendarDate)}`
      : firstCalendarDate
        ? `À partir du ${formatDate(firstCalendarDate)}`
        : lastCalendarDate
          ? `Jusqu'au ${formatDate(lastCalendarDate)}`
          : 'Dates à venir';

  return (
    <Link
      href={`/editions/${edition.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-green"
    >
      <div className="relative flex h-48 items-end overflow-hidden bg-green-dark p-5 sm:h-52">
        <Image
          src={EDITION_IMAGE}
          alt=""
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071c13]/90 via-[#071c13]/35 to-[#071c13]/10" />
        <div className="absolute left-4 top-4">
          <Badge variant={status.variant} className="shadow-sm">
            {status.label}
          </Badge>
        </div>
        <div className="relative text-white">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/75">
            Saison {edition.annee}
          </p>
          <h2 className="mt-1 font-display text-2xl font-extrabold leading-tight text-white sm:text-3xl">
            {edition.nom}
          </h2>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="min-h-[3rem] text-sm leading-6 text-mute">
          {edition.description || `Découvrez les temps forts et les résultats de l’édition ${edition.annee}.`}
        </p>

        <div className="mt-5">
          {calendar.some((entry) => entry.repere) ? (
            <>
              <p className="text-[11px] font-bold uppercase tracking-wide text-mute">
                Grandes étapes officielles
              </p>
              <CalendarMilestones entries={calendar} className="mt-2" />
            </>
          ) : (
            <div className="rounded-2xl bg-green-pale/50 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-green-dark">
                Calendrier de l’édition
              </p>
              <p className="mt-1 text-sm font-bold text-ink">{dateRange}</p>
            </div>
          )}

          <div className="mt-3 flex items-center justify-between rounded-xl bg-soft/80 px-3 py-2.5">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-mute">
              Score maximum
            </p>
            <p className="text-sm font-bold text-ink">{edition.score_max_defaut} points</p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-4">
          <span
            className={[
              'inline-flex items-center gap-2 text-xs font-semibold',
              edition.candidatures_ouvertes ? 'text-green-dark' : 'text-mute',
            ].join(' ')}
          >
            <span
              className={[
                'h-2 w-2 rounded-full',
                edition.candidatures_ouvertes ? 'bg-green' : 'bg-mute/40',
              ].join(' ')}
            />
            {edition.candidatures_ouvertes
              ? 'Candidatures ouvertes'
              : 'Candidatures fermées'}
          </span>
          <span className="inline-flex items-center gap-1 text-sm font-bold text-green-dark transition-colors group-hover:text-green">
            Détails
            <svg
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M4 10h12m-5-5 5 5-5 5" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
