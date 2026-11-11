import Link from 'next/link';
import { Badge } from '@/src/components/ui/badge';
import type { Database } from '@/src/types/database';

type Edition = Database['public']['Tables']['editions']['Row'];

interface EditionCardProps {
  edition: Edition;
}

export function EditionCard({ edition }: EditionCardProps) {
  const statusMap: Record<string, { label: string; variant: 'ok' | 'wait' | 'gold' | 'no' }> = {
    candidatures_ouvertes: { label: 'Candidatures ouvertes', variant: 'ok' },
    en_cours: { label: 'En cours', variant: 'wait' },
    terminee: { label: 'Terminée', variant: 'gold' },
    archivee: { label: 'Archivée', variant: 'no' },
  };

  const status = statusMap[edition.statut] || { label: edition.statut, variant: 'ok' as const };

  return (
    <Link href={`/editions/${edition.id}`}>
      <div className="card hover:shadow-lg transition-shadow cursor-pointer">
        <div className="flex justify-between items-start gap-4 mb-3">
          <h3 className="text-lg font-bold">{edition.annee}</h3>
          <Badge variant={status.variant}>{status.label}</Badge>
        </div>

        <p className="text-sm text-mute mb-4">{edition.nom}</p>

        {edition.description && (
          <p className="text-sm text-ink line-clamp-2">{edition.description}</p>
        )}

        <div className="mt-4 pt-4 border-t border-line flex gap-4 text-xs text-mute">
          <span>Début: {edition.debut}</span>
          {edition.fin && <span>Fin: {edition.fin}</span>}
        </div>
      </div>
    </Link>
  );
}
