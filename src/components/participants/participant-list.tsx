'use client';

import { useState } from 'react';
import { Badge } from '@/src/components/ui/badge';

interface Candidature {
  id: string;
  nom: string;
  prenom: string;
  etablissement: string;
  classe_niveau: string;
  statut: string;
  created_at: string | null;
}

interface Participant {
  id: string;
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
}

const PART_STATUS: Record<string, { label: string; variant: 'ok' | 'no' | 'wait' | 'gold' | 'default' }> = {
  en_attente:     { label: 'En attente',      variant: 'wait' },
  en_competition: { label: 'En competition',   variant: 'ok' },
  elimine:        { label: 'Elimine',           variant: 'no' },
  finaliste:      { label: 'Finaliste',         variant: 'wait' },
  champion:       { label: 'Champion',          variant: 'gold' },
};

const CAND_STATUS: Record<string, { label: string; variant: 'ok' | 'no' | 'wait' | 'default' }> = {
  en_attente: { label: 'En attente', variant: 'wait' },
  acceptee:   { label: 'Acceptee',   variant: 'ok' },
  refusee:    { label: 'Refusee',    variant: 'no' },
  liste_attente: { label: "Liste d'attente", variant: 'wait' },
};

export function ParticipantList({ candidatures, participants }: ParticipantListProps) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'tous' | 'participants' | 'candidats'>('tous');

  // Filtrage selon onglet + recherche
  const matchSearch = (nom: string, prenom: string) =>
    (prenom + ' ' + nom).toLowerCase().includes(search.toLowerCase());

  const filteredParticipants = participants.filter((p) => matchSearch(p.nom, p.prenom));
  const filteredCandidates   = candidatures.filter((c) => matchSearch(c.nom, c.prenom));

  const showParticipants = filter === 'tous' || filter === 'participants';
  const showCandidates   = filter === 'tous' || filter === 'candidats';

  const totalVisible =
    (showParticipants ? filteredParticipants.length : 0) +
    (showCandidates ? filteredCandidates.length : 0);

  const filters: { val: 'tous' | 'participants' | 'candidats'; label: string; count: number }[] = [
    { val: 'tous',         label: 'Tous',           count: participants.length + candidatures.length },
    { val: 'participants', label: 'Participants',    count: participants.length },
    { val: 'candidats',    label: 'Candidats seuls', count: candidatures.length },
  ];

  return (
    <div className={"flex flex-col gap-6"}>

      {/* Barre recherche + filtres */}
      <div className={"flex flex-col sm:flex-row gap-3 items-start sm:items-center"}>
        <div className={"relative flex-1 max-w-sm"}>
          <svg className={"absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-mute pointer-events-none"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={2} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
            <circle cx={11} cy={11} r={8} />
            <line x1={21} y1={21} x2={16.65} y2={16.65} />
          </svg>
          <input
            type={"search"}
            placeholder={"Rechercher…"}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={"w-full h-10 pl-9 pr-3 rounded-[10px] border-[1.5px] border-line bg-white text-sm text-ink focus:border-green focus:outline-none"}
          />
        </div>
        <div className={"flex flex-wrap gap-2"}>
          {filters.map(({ val, label, count }) => (
            <button
              key={val}
              type={"button"}
              onClick={() => setFilter(val)}
              className={[
                'h-8 px-3 rounded-full text-xs font-semibold transition-colors',
                filter === val ? 'bg-green text-white' : 'bg-white border border-line text-ink hover:bg-soft',
              ].join(' ')}
            >
              {label} <span className={filter === val ? 'opacity-70' : 'text-mute'}>({count})</span>
            </button>
          ))}
        </div>
      </div>

      {totalVisible === 0 && (
        <div className={"empty"}><p className={"mute"}>Aucun resultat.</p></div>
      )}

      {/* Participants confirmes */}
      {showParticipants && filteredParticipants.length > 0 && (
        <div className={"flex flex-col gap-4"}>
          {filter === 'tous' && (
            <h2 className={"text-base font-bold text-ink border-b border-line pb-2"}>
              Participants confirmes <span className={"text-mute font-normal text-sm"}>({filteredParticipants.length})</span>
            </h2>
          )}
          <div className={"grid-auto c3"}>
            {filteredParticipants.map((p) => {
              const st = PART_STATUS[p.statut] ?? { label: p.statut, variant: 'default' as const };
              const initiales = (p.prenom[0] ?? '') + (p.nom[0] ?? '');
              return (
                <div key={p.id} className={"card flex flex-col gap-3 border-l-4 border-green"}>
                  <div className={"flex items-start justify-between gap-2"}>
                    <div className={"av m bg-green-pale text-green-dark shrink-0 font-bold"}>{initiales}</div>
                    <div className={"flex flex-col items-end gap-1"}>
                      <Badge variant={st.variant}>{st.label}</Badge>
                      <span className={"bd ok"}>
                        <svg width={10} height={10} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={3} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}><polyline points={"20 6 9 17 4 12"} /></svg>
                        Participant
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className={"font-bold text-ink leading-tight"}>{p.prenom} {p.nom}</p>
                    <p className={"text-xs text-green-dark font-semibold mt-0.5"}>
                      N°{p.numero}
                    </p>
                  </div>
                  <div className={"flex flex-col gap-0.5 text-xs text-mute"}>
                    <span>{p.etablissement}</span>
                    <span>{p.classe_niveau}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Candidats non encore confirmes */}
      {showCandidates && filteredCandidates.length > 0 && (
        <div className={"flex flex-col gap-4"}>
          {filter === 'tous' && (
            <h2 className={"text-base font-bold text-ink border-b border-line pb-2"}>
              Candidatures <span className={"text-mute font-normal text-sm"}>({filteredCandidates.length})</span>
            </h2>
          )}
          <div className={"grid-auto c3"}>
            {filteredCandidates.map((c) => {
              const st = CAND_STATUS[c.statut] ?? { label: c.statut, variant: 'default' as const };
              const initiales = (c.prenom[0] ?? '') + (c.nom[0] ?? '');
              return (
                <div key={c.id} className={"card flex flex-col gap-3"}>
                  <div className={"flex items-start justify-between gap-2"}>
                    <div className={"av m bg-soft text-mute shrink-0 font-bold"}>{initiales}</div>
                    <Badge variant={st.variant}>{st.label}</Badge>
                  </div>
                  <div>
                    <p className={"font-bold text-ink leading-tight"}>{c.prenom} {c.nom}</p>
                  </div>
                  <div className={"flex flex-col gap-0.5 text-xs text-mute"}>
                    <span>{c.etablissement}</span>
                    <span>{c.classe_niveau}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}