'use client';

import { useState } from 'react';
import { ParticipantCard } from './participant-card';
import { Input } from '@/src/components/ui/input';
import type { Database } from '@/src/types/database';

type Participant = Database['public']['Tables']['participants']['Row'];

interface ParticipantListProps {
  participants: Participant[];
  editionId: string;
}

export function ParticipantList({ participants, editionId }: ParticipantListProps) {
  const [search, setSearch] = useState('');

  const filtered = participants.filter(p =>
    `${p.prenom} ${p.nom}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="stack">
      {/* Search */}
      <div style={{ maxWidth: '400px' }}>
        <Input
          label="Rechercher"
          placeholder="Nom, prénom..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Grid */}
      <div className="grid c3">
        {filtered.map((participant) => (
          <ParticipantCard
            key={participant.id}
            participant={participant}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="empty">
          <p className="mute">Aucun participant trouvé</p>
        </div>
      )}
    </div>
  );
}
