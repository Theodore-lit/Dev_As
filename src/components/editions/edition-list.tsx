import { EditionCard } from './edition-card';
import type { Database } from '@/src/types/database';

type Edition = Database['public']['Tables']['editions']['Row'];

interface EditionListProps {
  editions: Edition[];
}

export function EditionList({ editions }: EditionListProps) {
  if (editions.length === 0) {
    return (
      <div className="empty">
        <div className="ico mx-auto mb-3">📋</div>
        <p className="font-semibold text-ink">Aucune édition disponible</p>
        <p className="text-sm mute mt-1">Les éditions apparaîtront ici dès leur création.</p>
      </div>
    );
  }

  return (
    <div className="grid-auto c3">
      {editions.map((edition) => (
        <EditionCard key={edition.id} edition={edition} />
      ))}
    </div>
  );
}
