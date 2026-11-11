'use client';

import { EditionCard } from './edition-card';
import type { Database } from '@/src/types/database';

type Edition = Database['public']['Tables']['editions']['Row'];

interface EditionListProps {
  editions: Edition[];
}

export function EditionList({ editions }: EditionListProps) {
  return (
    <div className="grid c3">
      {editions.map((edition) => (
        <EditionCard key={edition.id} edition={edition} />
      ))}
    </div>
  );
}
