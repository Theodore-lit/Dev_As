'use client';

import { useState } from 'react';
import Image from 'next/image';
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

type BadgeVariant = 'ok' | 'no' | 'wait' | 'gold' | 'default';

const PART_STATUS: Record<string, { label: string; variant: BadgeVariant }> = {
  en_attente: { label: 'En attente', variant: 'wait' },
  en_competition: { label: 'En compétition', variant: 'ok' },
  elimine: { label: 'Éliminé', variant: 'no' },
  finaliste: { label: 'Finaliste', variant: 'wait' },
  champion: { label: 'Champion', variant: 'gold' },
};

const CAND_STATUS: Record<string, { label: string; variant: BadgeVariant }> = {
  en_attente: { label: 'En attente', variant: 'wait' },
  acceptee: { label: 'Acceptée', variant: 'ok' },
  refusee: { label: 'Refusée', variant: 'no' },
  liste_attente: { label: "Liste d'attente", variant: 'wait' },
};

interface ProfileTileProps {
  seed: string;
  prenom: string;
  nom: string;
  etablissement: string;
  classeNiveau: string;
  badge: { label: string; variant: BadgeVariant };
  kind: 'participant' | 'candidat';
  numero?: number;
  createdAt?: string | null;
}

function ProfileSticker({ seed, name }: { seed: string; name: string }) {
  const [failed, setFailed] = useState(false);
  const initials = `${name.trim().split(/\s+/).map((part) => part[0] ?? '').slice(0, 2).join('')}`.toUpperCase();
  const imageUrl = `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(seed)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;

  return (
    <div className="profile-tile__art" aria-hidden="true">
      {!failed ? (
        <Image
          src={imageUrl}
          alt=""
          fill
          unoptimized
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="profile-tile__image"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="profile-tile__fallback">{initials}</span>
      )}
    </div>
  );
}

function ProfileTile({
  seed,
  prenom,
  nom,
  etablissement,
  classeNiveau,
  badge,
  kind,
  numero,
  createdAt,
}: ProfileTileProps) {
  const name = `${prenom} ${nom}`;

  return (
    <details className={`profile-tile ${kind === 'participant' ? 'profile-tile--participant' : ''}`}>
      <summary aria-label={`${name} — ${badge.label}. Afficher plus d’informations.`}>
        <ProfileSticker seed={seed} name={name} />
        <div className="profile-tile__front">
          <div className="flex items-start justify-between gap-2">
            <Badge variant={badge.variant}>{badge.label}</Badge>
            {numero !== undefined && (
              <span className="rounded-full border border-white/60 bg-white/80 px-2.5 py-1 text-xs font-extrabold text-green-dark shadow-sm">
                N°{numero}
              </span>
            )}
          </div>
          <div className="profile-tile__name">
            <span className="profile-tile__kind">
              {kind === 'participant' ? 'Participant' : 'Candidature'}
            </span>
            <h3>{name}</h3>
            <p>{classeNiveau}</p>
          </div>
          {/* <span className="profile-tile__hint">Survolez ou touchez pour les détails</span> */}
        </div>
      </summary>

      <div className="profile-tile__reveal">
        <span className="profile-tile__kind">
          {kind === 'participant' ? 'Participant confirmé' : 'Candidat'}
        </span>
        <h3>{name}</h3>
        <dl className="mt-4 space-y-3 text-sm">
          <div>
            <dt>Établissement</dt>
            <dd>{etablissement}</dd>
          </div>
          <div>
            <dt>Classe / niveau</dt>
            <dd>{classeNiveau}</dd>
          </div>
          {numero !== undefined && (
            <div>
              <dt>Numéro de participant</dt>
              <dd>N°{numero}</dd>
            </div>
          )}
          {kind === 'candidat' && createdAt && (
            <div>
              <dt>Candidature déposée le</dt>
              <dd>
                {new Date(createdAt).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </dd>
            </div>
          )}
        </dl>
        <p className="mt-5 text-xs font-semibold text-green-dark">Touchez pour refermer</p>
      </div>
    </details>
  );
}

export function ParticipantList({ candidatures, participants }: ParticipantListProps) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'tous' | 'participants' | 'candidats'>('tous');

  const matchSearch = (nom: string, prenom: string) =>
    `${prenom} ${nom}`.toLocaleLowerCase('fr').includes(search.trim().toLocaleLowerCase('fr'));

  const filteredParticipants = participants.filter((participant) =>
    matchSearch(participant.nom, participant.prenom),
  );
  const filteredCandidates = candidatures.filter((candidature) =>
    matchSearch(candidature.nom, candidature.prenom),
  );

  const showParticipants = filter === 'tous' || filter === 'participants';
  const showCandidates = filter === 'tous' || filter === 'candidats';
  const totalVisible =
    (showParticipants ? filteredParticipants.length : 0) +
    (showCandidates ? filteredCandidates.length : 0);

  const filters: { val: 'tous' | 'participants' | 'candidats'; label: string; count: number }[] = [
    { val: 'tous', label: 'Tous', count: participants.length + candidatures.length },
    { val: 'participants', label: 'Participants', count: participants.length },
    { val: 'candidats', label: 'Candidats seuls', count: candidatures.length },
  ];

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full max-w-sm">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mute"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx={11} cy={11} r={8} />
            <line x1={21} y1={21} x2={16.65} y2={16.65} />
          </svg>
          <input
            type="search"
            placeholder="Rechercher un nom…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="h-11 w-full rounded-xl border-[1.5px] border-line bg-white pl-9 pr-3 text-sm text-ink focus:border-green focus:outline-none"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {filters.map(({ val, label, count }) => (
            <button
              key={val}
              type="button"
              onClick={() => setFilter(val)}
              aria-pressed={filter === val}
              className={[
                'min-h-9 rounded-full px-3.5 text-xs font-semibold transition-colors',
                filter === val
                  ? 'bg-green text-white'
                  : 'border border-line bg-white text-ink hover:bg-soft',
              ].join(' ')}
            >
              {label}{' '}
              <span className={filter === val ? 'opacity-75' : 'text-mute'}>({count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* <p className="-mt-4 text-[0.68rem] text-mute">
        Avatars illustratifs DiceBear Adventurer par{' '}
        <a
          href="https://www.figma.com/community/file/1184595184137881796"
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-green-dark underline underline-offset-2"
        >
          Lisa Wischofsky
        </a>{' '}
        · licence{' '}
        <a
          href="https://creativecommons.org/licenses/by/4.0/"
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-green-dark underline underline-offset-2"
        >
          CC BY 4.0
        </a>
      </p> */}

      {totalVisible === 0 && (
        <div className="rounded-2xl border border-dashed border-line bg-soft/50 px-5 py-12 text-center text-sm text-mute">
          Aucun résultat ne correspond à votre recherche.
        </div>
      )}

      {showParticipants && filteredParticipants.length > 0 && (
        <section className="flex flex-col gap-4" aria-labelledby="participants-list-title">
          {filter === 'tous' && (
            <h2
              id="participants-list-title"
              className="border-b border-line pb-2 text-base font-bold text-ink"
            >
              Participants confirmés{' '}
              <span className="text-sm font-normal text-mute">({filteredParticipants.length})</span>
            </h2>
          )}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {filteredParticipants.map((participant, index) => (
              <ProfileTile
                key={participant.id}
                seed={`participant-${index}`}
                prenom={participant.prenom}
                nom={participant.nom}
                etablissement={participant.etablissement}
                classeNiveau={participant.classe_niveau}
                numero={participant.numero}
                badge={PART_STATUS[participant.statut] ?? {
                  label: participant.statut,
                  variant: 'default',
                }}
                kind="participant"
              />
            ))}
          </div>
        </section>
      )}

      {showCandidates && filteredCandidates.length > 0 && (
        <section className="flex flex-col gap-4" aria-labelledby="candidates-list-title">
          {filter === 'tous' && (
            <h2
              id="candidates-list-title"
              className="border-b border-line pb-2 text-base font-bold text-ink"
            >
              Candidatures{' '}
              <span className="text-sm font-normal text-mute">({filteredCandidates.length})</span>
            </h2>
          )}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {filteredCandidates.map((candidate, index) => (
              <ProfileTile
                key={candidate.id}
                seed={`candidate-${index}`}
                prenom={candidate.prenom}
                nom={candidate.nom}
                etablissement={candidate.etablissement}
                classeNiveau={candidate.classe_niveau}
                badge={CAND_STATUS[candidate.statut] ?? {
                  label: candidate.statut,
                  variant: 'default',
                }}
                createdAt={candidate.created_at}
                kind="candidat"
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
