'use client';

import { useRef } from 'react';
import {
  TrophyIcon,
  CrownIcon,
  SwordsIcon,
  CheckIcon,
  CoinsIcon,
  UtensilsIcon,
} from '@/src/components/common/icons';

export function TournamentBracket() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -280 : 280;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const rounds = [
    {
      id: 'qualif',
      step: 'Étape 01',
      title: 'Qualifications',
      matches: '7 matchs',
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
      items: [
        { label: 'Groupes A & B', count: '30 cand.' },
        { label: 'Barrage ', count: '10 cand.' },
      ],
      output: '16 qualifiés retenus',
      highlight: false,
    },
    {
      id: 'principale',
      step: 'Étape 02',
      title: 'Phase Principale',
      matches: '4 matchs',
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
      items: [
        { label: 'Tours 1 & 2 ', count: '16 → 13' },
        { label: '16ᵉ & 8ᵉ de finale', count: '10 → 8' },
      ],
      output: '6 qualifiés pour les 1/4',
      highlight: false,
    },
    {
      id: 'quarts',
      step: 'Étape 03',
      title: 'Quarts de finale',
      matches: '1 match',
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
      items: [
        { label: 'Confrontation Top 6', count: '6 cand.' },
        { label: 'Ticket dernier carré', count: '4 places' },
      ],
      output: '4 demi-finalistes',
      highlight: false,
    },
    {
      id: 'demis',
      step: 'Étape 04',
      title: 'Demi-finales',
      matches: '1 match',
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
      items: [
        { label: 'Dernier Carré', count: '4 cand.' },
        { label: 'Match de Podium', count: '3ᵉ place' },
      ],
      output: '2 finalistes pour le titre',
      highlight: false,
    },
    {
      id: 'finale',
      step: 'Étape 05',
      title: 'Grande Finale',
      matches: '1 match',
      badgeColor: 'bg-orange-pale text-orange-dark border-orange/30',
      items: [
        { label: 'Duel Ultime au Sommet', count: '2 finalistes' },
        { label: 'Team Building H5', count: 'Direct' },
      ],
      output: '1 DevChampion sacré',
      highlight: true,
    },
  ];

  return (
    <div className="w-full">
      {/* En-tête épuré avec titre et flèches de navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-line">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider mb-1 border border-slate-200">
            <SwordsIcon className="w-3.5 h-3.5 text-slate-600" />
            Tableau du Tournoi · 14 Matchs
          </div>
          <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-ink">
            Schéma officiel des éliminatoires
          </h3>
          <p className="text-xs sm:text-sm text-mute mt-0.5">
            Progression façon tournoi, de 30 candidats jusqu&apos;au sacre ultime.
          </p>
        </div>

        {/* Boutons de navigation du scroll horizontal */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => scroll('left')}
            className="w-9 h-9 rounded-xl bg-soft hover:bg-line border border-line flex items-center justify-center text-slate-600 hover:text-ink transition-colors cursor-pointer"
            aria-label="Faire défiler vers la gauche"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            className="w-9 h-9 rounded-xl bg-soft hover:bg-line border border-line flex items-center justify-center text-slate-600 hover:text-ink transition-colors cursor-pointer"
            aria-label="Faire défiler vers la droite"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Conteneur horizontal avec scrollbar personnalisée */}
      <div
        ref={scrollRef}
        className="custom-scrollbar overflow-x-auto pb-4 pt-1 scroll-smooth"
      >
        <div className="inline-flex items-center gap-2 min-w-max pr-4">
          {rounds.map((round, idx) => (
            <div key={round.id} className="flex items-center">
              {/* Carte de phase au format réduit, inspirée des tableaux sportifs */}
              <div
                className={`w-[210px] h-[270px] rounded-2xl p-4 transition-all border flex flex-col justify-between ${
                  round.highlight
                    ? 'bg-gradient-to-b from-orange-pale/90 via-white to-orange-pale/40 border-orange shadow-md ring-2 ring-orange/20'
                    : 'bg-white border-line hover:border-slate-300 shadow-xs'
                }`}
              >
                {/* En-tête compact */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[0.68rem] uppercase font-bold tracking-wider text-slate-400">
                      {round.step}
                    </span>
                    <span className={`text-[0.65rem] font-bold px-2 py-0.5 rounded-full border ${round.badgeColor}`}>
                      {round.matches}
                    </span>
                  </div>

                  <h4 className="font-heading font-extrabold text-ink text-sm sm:text-base leading-tight">
                    {round.title}
                  </h4>
                </div>

                {/* Matchs / étapes sous forme de cellules façon bracket de football */}
                <div className="space-y-1.5 my-auto">
                  {round.items.map((it, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between gap-1.5 px-2.5 py-2 rounded-lg bg-slate-50 border border-slate-200/80 text-xs"
                    >
                      <span className="font-semibold text-slate-700 text-[0.72rem] truncate">
                        {it.label}
                      </span>
                      <span className="shrink-0 px-1.5 py-0.5 rounded bg-white border border-slate-200 text-[0.68rem] font-extrabold text-slate-900 shadow-2xs">
                        {it.count}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Ligne d'issue / qualifiés */}
                <div
                  className={`w-full py-1.5 px-2.5 rounded-xl text-[0.72rem] font-bold flex items-center justify-center gap-1.5 shadow-2xs ${
                    round.highlight
                      ? 'bg-orange text-white'
                      : 'bg-slate-100 text-slate-800 border border-slate-200'
                  }`}
                >
                  <CheckIcon className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{round.output}</span>
                </div>
              </div>

              {/* Ligne de liaison façon bracket de football (NON VERT : gris/ardoise métallisé) */}
              <div className="shrink-0 px-2 flex items-center justify-center text-slate-400">
                <svg
                  width="22"
                  height="16"
                  viewBox="0 0 22 16"
                  fill="none"
                  className="stroke-current text-slate-400"
                >
                  <path
                    d="M1 8H18M18 8L12 2M18 8L12 14"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          ))}

          {/* Div après les étapes : Carte Trophée DEVCHAMPION réduite & calibrée */}
          <div className="shrink-0">
            <div className="w-[210px] h-[270px] rounded-2xl p-4 bg-gradient-to-b from-[#111827] via-[#1f2937] to-[#111827] text-white border-2 border-amber-400 shadow-xl flex flex-col justify-between text-center relative overflow-hidden">
              {/* Effet halo d'ambiance doré */}
              <div className="absolute -top-8 -right-8 w-24 h-24 bg-amber-400/20 rounded-full blur-xl pointer-events-none" />

              {/* Badge d'en-tête */}
              <div className="relative z-10">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[0.62rem] font-extrabold uppercase tracking-widest bg-amber-400/20 text-amber-300 border border-amber-400/40">
                  Podium Final
                </span>

                {/* Icône Trophée dorée */}
                <div className="w-11 h-11 rounded-full bg-amber-400/20 border border-amber-400/50 flex items-center justify-center mx-auto my-2 text-amber-300 shadow-md">
                  <TrophyIcon className="w-6 h-6 text-amber-400" />
                </div>

                <h4 className="font-heading font-extrabold text-sm sm:text-base text-white leading-tight tracking-wide">
                  DEVCHAMPION
                </h4>
              </div>

              {/* Détail synthétique des récompenses */}
              <div className="p-2 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 text-left space-y-1 relative z-10 text-[0.7rem]">
                <div className="flex items-center gap-1.5 text-white/90">
                  <CoinsIcon className="w-3 h-3 text-amber-300 shrink-0" />
                  <span className="font-bold text-amber-300">10 000 FCFA</span>
                </div>
                <div className="flex items-center gap-1.5 text-white/80">
                  <UtensilsIcon className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span>5 tickets resto</span>
                </div>
              </div>

              {/* Pied de carte */}
              <div className="py-1.5 px-2 rounded-xl bg-amber-400 text-ink font-bold text-[0.68rem] flex items-center justify-center gap-1 shadow-sm relative z-10">
                <CrownIcon className="w-3 h-3 text-ink shrink-0" />
                <span className="font-extrabold truncate">Team Building HighFive</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Résumé synthétique minimaliste sous le bracket */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3 pt-3 border-t border-line text-center text-xs">
        <div className="p-2 rounded-xl bg-soft/50 border border-line">
          <span className="text-mute block text-[0.68rem]">1. Qualifications</span>
          <strong className="text-ink text-xs sm:text-sm">30 → 16 candidats</strong>
        </div>
        <div className="p-2 rounded-xl bg-soft/50 border border-line">
          <span className="text-mute block text-[0.68rem]">2. Phase Principale</span>
          <strong className="text-ink text-xs sm:text-sm">16 → 6 candidats</strong>
        </div>
        <div className="p-2 rounded-xl bg-soft/50 border border-line">
          <span className="text-mute block text-[0.68rem]">3. Quarts & Demis</span>
          <strong className="text-ink text-xs sm:text-sm">6 → 2 finalistes</strong>
        </div>
        <div className="p-2 rounded-xl bg-orange-pale/70 border border-orange/20">
          <span className="text-orange-dark block text-[0.68rem]">4. Grande Finale</span>
          <strong className="text-orange-dark text-xs sm:text-sm">1 DevChampion</strong>
        </div>
      </div>
    </div>
  );
}
