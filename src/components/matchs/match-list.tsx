'use client';

import { useState } from 'react';
import { MatchCard } from './match-card';
import { SwordsIcon } from '@/src/components/common/icons';
import { EmptyState } from '@/src/components/ui/empty-state';

type Match = {
  id: string;
  libelle: string;
  statut: string;
  date_heure: string | null;
  lieu: string | null;
  score_max: number;
  phase?: { nom: string; type: string } | null;
};

interface MatchListProps {
  matchs: Match[];
}

const FILTERS = [
  { val: '', label: 'Tous' },
  { val: 'planifie', label: 'Planifiés' },
  { val: 'en_cours', label: 'En cours' },
  { val: 'valide', label: 'Validés' },
];

export function MatchList({ matchs }: MatchListProps) {
  const [filter, setFilter] = useState('');

  const filtered = filter ? matchs.filter((m) => m.statut === filter) : matchs;

  if (matchs.length === 0) {
    return (
      <EmptyState
        icon={<SwordsIcon className="h-7 w-7" />}
        title="Aucun match pour le moment"
        description="Les matchs de la compétition apparaîtront ici dès leur publication."
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Filtres */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map(({ val, label }) => (
          <button
            key={val}
            type="button"
            onClick={() => setFilter(val)}
            className={[
              'h-8 px-4 rounded-full text-sm font-semibold transition-colors',
              filter === val
                ? 'bg-green text-white'
                : 'bg-white border border-line text-ink hover:bg-soft',
            ].join(' ')}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Grille */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<SwordsIcon className="h-7 w-7" />}
          title="Aucun match dans cette catégorie"
          description="Sélectionnez un autre filtre pour consulter les matchs disponibles."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((m) => (
            <MatchCard key={m.id} match={m} />
          ))}
        </div>
      )}
    </div>
  );
}
