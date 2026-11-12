import { EditionCard } from './edition-card';
import { EmptyState } from '@/src/components/ui/empty-state';
import type { Database } from '@/src/types/database';

type Edition = Database['public']['Tables']['editions']['Row'];

interface EditionListProps {
  editions: Edition[];
}

export function EditionList({ editions }: EditionListProps) {
  if (editions.length === 0) {
    return (
      <EmptyState
        title="Aucune édition disponible"
        description="Les éditions apparaîtront ici dès leur création."
        icon={
          <svg
            className="h-7 w-7"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="3" y="5" width="18" height="16" rx="2" />
            <path d="M16 3v4M8 3v4M3 10h18M8 14h3m-3 3h7" />
          </svg>
        }
      />
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
