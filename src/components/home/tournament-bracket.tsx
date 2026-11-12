'use client';

import { useState, type CSSProperties } from 'react';
import Link from 'next/link';
import {
  CheckIcon,
  CoinsIcon,
  CrownIcon,
  DownloadIcon,
  SwordsIcon,
  TrophyIcon,
  UtensilsIcon,
} from '@/src/components/common/icons';

interface TournamentStage {
  id: string;
  step: string;
  title: string;
  badge: string;
  items: { label: string }[];
  output: string;
  registration?: boolean;
  highlight?: boolean;
}

const stages: TournamentStage[] = [
  {
    id: 'inscriptions',
    step: 'Étape 01',
    title: 'Phase d’inscription',
    badge: 'Inscriptions',
    items: [
      { label: 'Dépôt des candidatures' },
      { label: 'Places visées'},
    ],
    output: 'Les candidats retenus accèdent aux qualifications',
    registration: true,
  },
  {
    id: 'qualifications',
    step: 'Étape 02',
    title: 'Qualifications',
    badge: '7 matchs',
    items: [
      { label: 'Groupes A & B' },
      { label: 'Barrage' },
    ],
    output: '16 qualifiés retenus',
  },
  {
    id: 'principale',
    step: 'Étape 03',
    title: 'Phase principale',
    badge: '4 matchs',
    items: [
      { label: 'Tours 1 & 2'},
      { label: '16ᵉ & 8ᵉ de finale' },
    ],
    output: '6 qualifiés pour les quarts',
  },
  {
    id: 'quarts',
    step: 'Étape 04',
    title: 'Quarts de finale',
    badge: '1 match',
    items: [
      { label: 'Confrontation entre 6 canditats', },
      { label: 'Ticket dernier carré : Juste 4 places' },
    ],
    output: '4 demi-finalistes',
  },
  {
    id: 'demis',
    step: 'Étape 05',
    title: 'Demi-finales',
    badge: '1 match',
    items: [
      { label: 'Dernier carré' },
      { label: 'Match de podium pour avoir le 3eme' },
    ],
    output: '2 finalistes pour le titre',
  },
  {
    id: 'finale',
    step: 'Étape 06',
    title: 'Grande finale',
    badge: 'Finale',
    items: [
      { label: 'Duel ultime au sommet',  },
      { label: 'Team Building H5',  },
    ],
    output: '1 DevChampion sacré',
    highlight: true,
  },
];

export function TournamentBracket({ registrationOpen }: { registrationOpen: boolean }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeStage = stages[activeIndex];
  const isRegistration = activeStage.registration === true;
  const isCurrent = isRegistration && registrationOpen;
  const isFinal = activeStage.highlight === true;

  const moveStage = (offset: number) => {
    setActiveIndex((index) => (index + offset + stages.length) % stages.length);
  };

  return (
    <div className="w-full">
      <div className="mb-4 flex flex-col items-start justify-between gap-3 border-b border-line pb-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-1 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-700">
            <SwordsIcon className="h-3.5 w-3.5 text-slate-600" />
            Parcours du tournoi · 14 matchs
          </div>
          <h3 className="font-heading text-xl font-extrabold text-ink sm:text-2xl">
            Les étapes vers le titre
          </h3>
          <p className="mt-0.5 text-xs text-mute sm:text-sm">
            Explorez le parcours, des inscriptions au sacre.
          </p>
        </div>

        <a
          href="/documents_officiels/CAHIER_DE_DEROULEMENT_DEVCHAMPION.pdf"
          download="CAHIER_DE_DEROULEMENT_DEVCHAMPION.pdf"
          aria-label="Télécharger le cahier de déroulement de la compétition"
          title="Télécharger le cahier de déroulement"
          className="inline-flex h-9 shrink-0 items-center gap-2 rounded-xl border border-green/20 bg-green-pale px-3 text-xs font-bold text-green-dark transition-colors hover:bg-green/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-dark"
        >
          <DownloadIcon className="h-4 w-4" />
          <span>Déroulement PDF</span>
        </a>
      </div>

      <div
        className="tournament-orbit"
        role="region"
        aria-roledescription="carrousel"
        aria-label="Parcours des phases du championnat"
      >
        <div className="tournament-orbit__ring" aria-hidden="true" />
        {stages.map((stage, index) => {
          const angle = ((index - activeIndex + stages.length) * 360) / stages.length - 90;
          const isSelected = index === activeIndex;
          const isStageCurrent = stage.registration === true && registrationOpen;
          const isStageFinal = stage.highlight === true;
          const orbitStyle = {
            '--orbit-angle': `${angle}deg`,
            '--float-delay': `${index * -0.45}s`,
          } as CSSProperties;

          return (
            <button
              key={stage.id}
              type="button"
              style={orbitStyle}
              onClick={() => setActiveIndex(index)}
              className={`tournament-orbit__stop ${
                isSelected ? 'is-selected' : ''
              } ${isStageCurrent ? 'is-current' : ''} ${isStageFinal ? 'is-final' : ''}`}
              aria-label={`${stage.step} : ${stage.title}${isStageCurrent ? ', phase actuelle' : ''}`}
              aria-pressed={isSelected}
            >
              <span className="tournament-orbit__stop-inner">
                <span className="tournament-orbit__number">{String(index + 1).padStart(2, '0')}</span>
                <span className="tournament-orbit__label">{stage.title}</span>
              </span>
            </button>
          );
        })}

        <article
          key={activeStage.id}
          className={`tournament-orbit__card ${
            isCurrent
              ? 'tournament-orbit__card--current'
              : isFinal
                ? 'tournament-orbit__card--final'
                : ''
          }`}
          aria-live="polite"
          aria-atomic="true"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[0.62rem] font-bold uppercase tracking-wider text-slate-400 sm:text-[0.68rem]">
                {activeStage.step}
              </p>
              <h4 className="mt-0.5 font-heading text-base font-extrabold leading-tight text-ink sm:text-lg">
                {activeStage.title}
              </h4>
            </div>
            <span
              className={`shrink-0 rounded-full border px-2 py-1 text-[0.58rem] font-bold sm:px-2.5 sm:text-[0.68rem] ${
                isCurrent
                  ? 'border-green/25 bg-green-pale text-green-dark'
                  : isFinal
                    ? 'border-orange/30 bg-orange-pale text-orange-dark'
                    : 'border-slate-200 bg-slate-100 text-slate-700'
              }`}
            >
              {isRegistration
                ? isCurrent
                  ? 'Phase actuelle'
                  : 'Candidatures fermées'
                : activeStage.badge}
            </span>
          </div>

          <div className="mt-2 grid gap-1.5 sm:mt-3 sm:grid-cols-2 sm:gap-2">
            {activeStage.items.map((item) => (
              <div
                key={item.label}
                className="flex min-w-0 flex-col items-start gap-1 rounded-lg border border-slate-200/80 bg-slate-50 px-2 py-2 text-[0.62rem] sm:flex-row sm:items-center sm:justify-between sm:gap-2 sm:rounded-xl sm:px-3 sm:py-2.5 sm:text-xs"
              >
                <span className="min-w-0 font-semibold leading-tight text-slate-700">{item.label}</span>
                {/* <span className="max-w-full shrink-0 truncate rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[0.58rem] font-extrabold text-slate-900 shadow-2xs sm:px-2 sm:py-1 sm:text-[0.68rem]">
                  {item.count}
                </span> */}
              </div>
            ))}
          </div>

          <div
            className={`mt-2 flex items-center gap-1.5 rounded-lg px-2 py-2 text-[0.62rem] font-bold leading-tight sm:mt-3 sm:gap-2 sm:rounded-xl sm:px-3 sm:py-2.5 sm:text-xs ${
              isFinal
                ? 'bg-orange text-white'
                : isCurrent
                  ? 'border border-green/15 bg-green-pale/60 text-green-dark'
                  : 'border border-slate-200 bg-slate-100 text-slate-800'
            }`}
          >
            {isFinal ? (
              <TrophyIcon className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
            ) : (
              <CheckIcon className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
            )}
            <span className="min-w-0">{activeStage.output}</span>
          </div>

          {isRegistration && (
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
              <p className="text-[0.62rem] leading-tight text-mute sm:text-xs">
                {isCurrent
                  ? 'Candidatez dès maintenant pour tenter votre chance.'
                  : 'Suivez nos actualités pour connaître la prochaine ouverture.'}
              </p>
              {isCurrent && (
                <Link
                  href="/candidacy"
                  className="inline-flex min-h-8 items-center justify-center rounded-lg bg-orange px-3 py-1.5 text-[0.62rem] font-bold text-white transition-colors hover:bg-orange-dark sm:min-h-10 sm:rounded-xl sm:px-4 sm:py-2 sm:text-xs"
                >
                  Candidater
                </Link>
              )}
            </div>
          )}

          {isFinal && (
            <div className="mt-2 grid grid-cols-2 gap-1.5 rounded-lg border border-amber-400/30 bg-slate-900 p-2 text-[0.62rem] text-white sm:mt-3 sm:gap-2 sm:rounded-xl sm:p-3 sm:text-xs">
              <div className="flex items-center gap-2">
                <CoinsIcon className="h-3.5 w-3.5 shrink-0 text-amber-300 sm:h-4 sm:w-4" />
                <span className="font-bold text-amber-300">10 000 FCFA</span>
              </div>
              <div className="flex items-center gap-2">
                <UtensilsIcon className="h-3.5 w-3.5 shrink-0 text-emerald-400 sm:h-4 sm:w-4" />
                <span>5 tickets resto</span>
              </div>
              <div className="col-span-2 flex items-center gap-2 border-t border-white/10 pt-1.5 font-bold text-amber-200 sm:pt-2">
                <CrownIcon className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
                <span>DEVCHAMPION · Team Building HighFive</span>
              </div>
            </div>
          )}
        </article>
      </div>

      <div className="mt-2 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => moveStage(-1)}
          className="grid h-10 w-10 place-items-center rounded-full border border-line bg-white text-green-dark shadow-sm transition hover:border-green/30 hover:bg-green-pale focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-dark"
          aria-label="Phase précédente"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <span className="min-w-16 text-center text-xs font-bold tabular-nums text-mute" aria-live="polite">
          {String(activeIndex + 1).padStart(2, '0')} / {String(stages.length).padStart(2, '0')}
        </span>
        <button
          type="button"
          onClick={() => moveStage(1)}
          className="grid h-10 w-10 place-items-center rounded-full border border-line bg-white text-green-dark shadow-sm transition hover:border-green/30 hover:bg-green-pale focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-dark"
          aria-label="Phase suivante"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
