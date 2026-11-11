import Link from 'next/link';
import { Badge } from '@/src/components/ui/badge';
import type { Database } from '@/src/types/database';

type Seance = Database['public']['Tables']['seances']['Row'];

interface MatchCardProps {
  seance: Seance;
}

export function MatchCard({ seance }: MatchCardProps) {
  const statusMap: Record<string, { label: string; variant: 'ok' | 'wait' | 'gold' | 'no' }> = {
    planifie: { label: 'Planifié', variant: 'wait' },
    en_cours: { label: 'En cours', variant: 'ok' },
    valide: { label: 'Validé', variant: 'gold' },
    annule: { label: 'Annulé', variant: 'no' },
  };

  const status = statusMap[seance.st] || { label: seance.st, variant: 'ok' as const };

  return (
    <Link href={`/matchs/${seance.id}`}>
      <div className="card hover:shadow-lg transition-shadow cursor-pointer">
        <div className="flex justify-between items-start gap-4 mb-3">
          <h3 className="text-lg font-bold flex-1 min-w-0">{seance.lab}</h3>
          <Badge variant={status.variant}>{status.label}</Badge>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex gap-4">
            <span className="text-mute">📅 {seance.date}</span>
            <span className="text-mute">📍 {seance.lieu}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
