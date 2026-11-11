'use client';

import { MatchCard } from './match-card';
import type { Database } from '@/src/types/database';

type Seance = Database['public']['Tables']['seances']['Row'];

interface MatchListProps {
  seances: Seance[];
}

export function MatchList({ seances }: MatchListProps) {
  return (
    <div className="grid c2">
      {seances.map((seance) => (
        <MatchCard key={seance.id} seance={seance} />
      ))}
    </div>
  );
}
