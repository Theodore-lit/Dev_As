import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/src/components/ui/badge';
import type { Database } from '@/src/types/database';

type Edition = Database['public']['Tables']['editions']['Row'];

interface EditionCardProps {
  edition: Edition;
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
  return new Date(value).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function EditionCard({ edition }: EditionCardProps) {
  const status = STATUS_MAP[edition.statut] ?? { label: edition.statut, variant: 'default' as const };
  const dateRange =
    edition.date_debut && edition.date_fin
      ? `${formatDate(edition.date_debut)} – ${formatDate(edition.date_fin)}`
      : edition.date_debut
        ? `À partir du ${formatDate(edition.date_debut)}`
        : edition.date_fin
          ? `Jusqu'au ${formatDate(edition.date_fin)}`
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

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-soft/80 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-mute">
              Calendrier
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-ink">
              <svg
                className="h-4 w-4 shrink-0 text-green-dark"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="5" width="18" height="16" rx="2" />
                <path d="M16 3v4M8 3v4M3 10h18" />
              </svg>
              <span className="truncate">{dateRange}</span>
            </p>
          </div>

          <div className="rounded-xl bg-soft/80 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-mute">
              Score maximum
            </p>
            <p className="mt-1 text-sm font-bold text-ink">
              {edition.score_max_defaut} points
            </p>
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
