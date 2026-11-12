import Link from 'next/link';

interface MatchCardProps {
  match: {
    id: string;
    libelle: string;
    statut: string;
    date_heure: string | null;
    lieu: string | null;
    phase?: { nom: string; type: string } | null;
  };
}

const STATUS: Record<string, { label: string; cls: string }> = {
  planifie: { label: 'Planifié',  cls: 'bg-orange-pale text-orange-dark' },
  en_cours: { label: 'En cours',  cls: 'bg-green-pale text-green-dark' },
  valide:   { label: 'Validé',    cls: 'bg-gold-pale text-gold' },
  annule:   { label: 'Annulé',    cls: 'bg-red-pale text-red' },
};

export function MatchCard({ match }: MatchCardProps) {
  const st = STATUS[match.statut] ?? { label: match.statut, cls: 'bg-soft text-mute' };

  const dateStr = match.date_heure
    ? new Date(match.date_heure).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null;

  return (
    <Link href={`/matchs/${match.id}`} className="block">
      <div className="bg-white rounded-xl border border-line p-5 hover:shadow-card transition-shadow">
        <div className="flex justify-between items-start gap-3 mb-3">
          <h3 className="font-bold text-sm text-ink leading-snug">{match.libelle}</h3>
          <span
            className={[
              'shrink-0 inline-flex items-center h-5 px-2.5 rounded-full text-xs font-semibold',
              st.cls,
            ].join(' ')}
          >
            {st.label}
          </span>
        </div>
        {match.phase && (
          <p className="text-xs text-mute mb-2">{match.phase.nom}</p>
        )}
        <div className="flex flex-wrap gap-3 text-xs text-mute">
          {dateStr && <span>📅 {dateStr}</span>}
          {match.lieu && <span>📍 {match.lieu}</span>}
        </div>
      </div>
    </Link>
  );
}
