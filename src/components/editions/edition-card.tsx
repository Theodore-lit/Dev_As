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

export function EditionCard({ edition }: EditionCardProps) {
  const status = STATUS_MAP[edition.statut] ?? { label: edition.statut, variant: 'default' as const };

  const dateStr = edition.date_debut
    ? new Date(edition.date_debut).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null;

  return (
    <Link href={`/editions/${edition.id}`} className="block group">
      <div className="card flex flex-col gap-3 h-full hover:shadow-xl transition-shadow">
        {/* Top row: year pill + status badge */}
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center h-6 px-3 rounded-full bg-green-pale text-green-dark text-xs font-bold">
            {edition.annee}
          </span>
          <Badge variant={status.variant}>{status.label}</Badge>
        </div>

        {/* Edition name */}
        <h3 className="font-bold text-ink group-hover:text-green-dark transition-colors leading-snug">
          {edition.nom}
        </h3>

        {/* Description */}
        {edition.description && (
          <p className="text-sm mute line-clamp-2 flex-1">{edition.description}</p>
        )}

        {/* Footer: start date */}
        {dateStr && (
          <div className="pt-3 border-t border-line flex items-center gap-1.5 text-xs text-mute">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Depuis le {dateStr}
          </div>
        )}
      </div>
    </Link>
  );
}
