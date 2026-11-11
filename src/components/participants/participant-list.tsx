'use client';

import { useState } from 'react';
import { Badge } from '@/src/components/ui/badge';

// Subset of the candidatures row (columns selected in page.tsx)
interface Candidature {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  etablissement: string;
  classe_niveau: string;
  statut: string;
  created_at: string | null;
}

// Subset of the participants row (columns selected in page.tsx)
interface Participant {
  id: string;
  candidature_id: string | null;
  nom: string;
  prenom: string;
  numero: number;
  statut: string;
  etablissement: string;
  classe_niveau: string;
}

interface ParticipantListProps {
  candidatures: Candidature[];
  participants: Participant[];
  participantCandidatureIds: string[];
}

const CAND_STATUS: Record<string, { label: string; variant: 'ok' | 'no' | 'wait' | 'default' }> = {
  en_attente:    { label: 'En attente',     variant: 'wait' },
  acceptee:      { label: 'Acceptée',       variant: 'ok' },
  refusee:       { label: 'Refusée',        variant: 'no' },
  liste_attente: { label: "Liste d'attente", variant: 'wait' },
};

function getParticipantStatusLabel(statut: string): string {
  switch (statut) {
    case 'champion':      return '🏆 Champion';
    case 'finaliste':     return '🎯 Finaliste';
    case 'en_competition': return '⚡ En compétition';
    case 'elimine':       return 'Éliminé';
    case 'en_attente':    return 'En attente';
    default:              return statut;
  }
}

function getParticipantStatusClass(statut: string): string {
  switch (statut) {
    case 'champion':      return 'text-orange-dark font-semibold';
    case 'finaliste':     return 'text-orange-dark font-semibold';
    case 'en_competition': return 'text-green-dark font-semibold';
    case 'elimine':       return 'text-mute';
    default:              return 'text-mute';
  }
}

export function ParticipantList({
  candidatures,
  participants,
  participantCandidatureIds,
}: ParticipantListProps) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');

  const participantSet = new Set(participantCandidatureIds);

  const filtered = candidatures.filter((c) => {
    const matchSearch = `${c.prenom} ${c.nom}`
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchFilter =
      filter === '' ? true :
      filter === 'participant' ? participantSet.has(c.id) :
      c.statut === filter;

    return matchSearch && matchFilter;
  });

  const filters: { val: string; label: string }[] = [
    { val: '',           label: 'Tous' },
    { val: 'participant', label: 'Participants' },
    { val: 'acceptee',   label: 'Acceptés' },
    { val: 'en_attente', label: 'En attente' },
    { val: 'refusee',    label: 'Refusés' },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Search + filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        {/* Search input */}
        <div className="relative flex-1 max-w-sm">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-mute pointer-events-none"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="search"
            placeholder="Rechercher un candidat…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-3 rounded-[10px] border-[1.5px] border-line bg-white text-sm text-ink focus:border-green focus:outline-none"
          />
        </div>

        {/* Filter pills */}
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrer par statut">
          {filters.map(({ val, label }) => (
            <button
              key={val}
              type="button"
              onClick={() => setFilter(val)}
              aria-pressed={filter === val}
              className={[
                'h-8 px-3 rounded-full text-xs font-semibold transition-colors',
                filter === val
                  ? 'bg-green text-white'
                  : 'bg-white border border-line text-ink hover:bg-soft',
              ].join(' ')}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      {filtered.length > 0 && (
        <p className="text-sm text-mute">
          {filtered.length} candidat{filtered.length > 1 ? 's' : ''} affiché{filtered.length > 1 ? 's' : ''}
        </p>
      )}

      {/* Grid or empty state */}
      {filtered.length === 0 ? (
        <div className="empty">
          <p className="mute">Aucun candidat trouvé.</p>
        </div>
      ) : (
        <div className="grid-auto c3">
          {filtered.map((cand) => {
            const isParticipant = participantSet.has(cand.id);
            const participant = isParticipant
              ? participants.find((p) => p.candidature_id === cand.id)
              : null;
            const st = CAND_STATUS[cand.statut] ?? { label: cand.statut, variant: 'default' as const };

            return (
              <div key={cand.id} className="card flex flex-col gap-3">
                {/* Header: avatar + badges */}
                <div className="flex items-start justify-between gap-2">
                  <div
                    className="av m bg-green-pale text-green-dark shrink-0 font-bold"
                    aria-hidden="true"
                  >
                    {cand.prenom[0]}{cand.nom[0]}
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <Badge variant={st.variant}>{st.label}</Badge>
                    {isParticipant && (
                      <Badge variant="ok">
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Participant confirmé
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Name + participant number */}
                <div>
                  <p className="font-bold text-ink leading-tight">
                    {cand.prenom} {cand.nom}
                  </p>
                  {isParticipant && participant && (
                    <p className="text-xs text-green-dark font-semibold mt-0.5">
                      N°{participant.numero}
                    </p>
                  )}
                </div>

                {/* School / level */}
                <div className="flex flex-col gap-0.5 text-xs text-mute">
                  <span>{cand.etablissement}</span>
                  <span>{cand.classe_niveau}</span>
                </div>

                {/* Participant competition status */}
                {isParticipant && participant && (
                  <div className="mt-auto pt-2 border-t border-line">
                    <span className={`text-xs ${getParticipantStatusClass(participant.statut)}`}>
                      {getParticipantStatusLabel(participant.statut)}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
