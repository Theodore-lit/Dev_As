import Link from 'next/link';
import type { Database } from '@/src/types/database';

type Participant = Database['public']['Tables']['participants']['Row'];

interface ParticipantCardProps {
  participant: Participant;
}

export function ParticipantCard({ participant }: ParticipantCardProps) {
  return (
    <Link href={`/participants/${participant.id}`}>
      <div className="card hover:shadow-lg transition-shadow cursor-pointer">
        <div className="flex gap-3 mb-3">
          <div className="av m bg-green-pale text-green-dark flex-none">
            {participant.prenom[0]}
            {participant.nom[0]}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-ink truncate">
              {participant.prenom} {participant.nom}
            </h3>
            <p className="text-xs text-mute">N°{participant.numero}</p>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div>
            <p className="text-xs text-mute">Établissement</p>
            <p className="text-ink">{participant.etablissement}</p>
          </div>
          <div>
            <p className="text-xs text-mute">Classe</p>
            <p className="text-ink">{participant.classe_niveau}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
