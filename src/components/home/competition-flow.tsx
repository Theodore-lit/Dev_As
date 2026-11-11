'use client';

import { useState } from 'react';
import {
  UsersIcon,
  SwordsIcon,
  TrophyIcon,
  CheckIcon,
  ShieldCheckIcon,
  CrownIcon,
  SparklesIcon,
} from '@/src/components/common/icons';

const QUALIFICATION_PHASES = [
  {
    phase: 'Phase 1 : Première qualification',
    participants: 30,
    format: '2 groupes de 15 candidats (Groupe A & Groupe B)',
    matches: 2,
    criteria: 'Les 10 premiers de chaque groupe qualifiés directs. Les 5 derniers au barrage.',
    outcome: '20 directement qualifiés · 10 envoyés au barrage',
  },
  {
    phase: 'Phase 2 : Barrage (Seconde chance)',
    participants: 10,
    format: 'Les 10 candidats des deux groupes réunis',
    matches: 1,
    criteria: 'Les 6 premiers au classement sont repêchés. Les 4 derniers sont éliminés.',
    outcome: '6 repêchés · 4 éliminés · 26 qualifiés au total',
  },
  {
    phase: 'Phase 3 : Deuxième qualification',
    participants: 26,
    format: '2 groupes de 13 candidats (Groupe A & Groupe B)',
    matches: 2,
    criteria: 'Les 10 premiers de chaque groupe qualifiés. Les 3 derniers éliminés.',
    outcome: '20 qualifiés · 6 éliminés',
  },
  {
    phase: 'Phase 4 : Troisième qualification',
    participants: 20,
    format: '2 groupes de 10 candidats (Groupe A & Groupe B)',
    matches: 2,
    criteria: 'Les 8 premiers de chaque groupe qualifiés. Les 2 derniers éliminés.',
    outcome: '16 qualifiés pour la phase principale · 4 éliminés',
  },
];

const MAIN_PHASES = [
  {
    phase: 'Tour 1',
    participants: 16,
    format: '16 candidats réunis en groupe unique',
    matches: 1,
    criteria: 'Les 13 premiers qualifiés · Les 3 derniers éliminés',
    outcome: '13 participants qualifiés',
  },
  {
    phase: 'Tour 2',
    participants: 13,
    format: '13 candidats réunis en groupe unique',
    matches: 1,
    criteria: 'Les 10 premiers qualifiés · Les 3 derniers éliminés',
    outcome: '10 participants qualifiés',
  },
  {
    phase: 'Seizième de finale',
    participants: 10,
    format: '10 candidats réunis en match décisif',
    matches: 1,
    criteria: 'Les 8 premiers qualifiés · Les 2 derniers éliminés',
    outcome: '8 participants qualifiés',
  },
  {
    phase: 'Huitième de finale',
    participants: 8,
    format: '8 candidats restants',
    matches: 1,
    criteria: 'Les 6 premiers qualifiés · Les 2 derniers éliminés',
    outcome: '6 participants qualifiés',
  },
  {
    phase: 'Quart de finale',
    participants: 6,
    format: '6 candidats pour une place en demi-finale',
    matches: 1,
    criteria: 'Les 4 premiers qualifiés · Les 2 derniers éliminés',
    outcome: '4 demi-finalistes qualifiés',
  },
  {
    phase: 'Demi-finale',
    participants: 4,
    format: 'Les 4 meilleurs candidats en confrontation',
    matches: 1,
    criteria: 'Les 2 premiers en Grande Finale. Le 3e monte sur le podium (récompensé). Le 4e termine au pied du podium.',
    outcome: '2 finalistes · 1 troisième place récompensée',
  },
  {
    phase: 'Grande Finale',
    participants: 2,
    format: 'Ultime duel en direct lors du TEAM BUILDING de HIGHFIVE',
    matches: 1,
    criteria: 'Confrontation au sommet devant tout le public. Le vainqueur est sacré DEVCHAMPION.',
    outcome: '1 DevChampion sacré · 1 Finaliste d’honneur',
    highlight: true,
  },
];

export function CompetitionFlow() {
  const [activeTab, setActiveTab] = useState<'qualification' | 'principale' | 'summary'>('qualification');

  return (
    <div className="space-y-6">
      {/* Sélecteur d'onglets épuré */}
      <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-soft rounded-xl border border-line max-w-xl mx-auto">
        <button
          type="button"
          onClick={() => setActiveTab('qualification')}
          className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'qualification'
              ? 'bg-white text-green-dark shadow-xs border border-line'
              : 'text-mute hover:text-ink'
          }`}
        >
          Partie I : Qualifications (30 → 16)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('principale')}
          className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'principale'
              ? 'bg-white text-green-dark shadow-xs border border-line'
              : 'text-mute hover:text-ink'
          }`}
        >
          Partie II : Phase Principale (16 → 1)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('summary')}
          className={`py-2.5 px-4 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'summary'
              ? 'bg-white text-green-dark shadow-xs border border-line'
              : 'text-mute hover:text-ink'
          }`}
        >
          Synthèse (14 Matchs)
        </button>
      </div>

      {/* Onglet 1 : Qualifications */}
      {activeTab === 'qualification' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-green-pale/50 border border-green-light/40 flex items-start gap-3">
            <ShieldCheckIcon className="w-5 h-5 text-green-dark shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-green-dark">
              <strong>Objectif des qualifications :</strong> Passer progressivement de 30 candidats à 16 qualifiés pour la phase principale à travers 4 étapes et un total de <strong>7 matchs</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {QUALIFICATION_PHASES.map((p, index) => (
              <div
                key={p.phase}
                className="p-5 rounded-2xl bg-white border border-line hover:border-green-light transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-green uppercase tracking-wider">
                      Étape 0{index + 1}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-soft text-mute border border-line">
                      <SwordsIcon className="w-3.5 h-3.5 text-mute" />
                      {p.matches} {p.matches > 1 ? 'matchs' : 'match'}
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-ink text-base mb-2">
                    {p.phase}
                  </h3>

                  <div className="space-y-2 text-xs sm:text-sm text-ink/80 mb-4">
                    <div className="flex items-start gap-2">
                      <UsersIcon className="w-4 h-4 text-mute shrink-0 mt-0.5" />
                      <span><strong>Participants :</strong> {p.participants} candidats ({p.format})</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckIcon className="w-4 h-4 text-green shrink-0 mt-0.5" />
                      <span><strong>Critères :</strong> {p.criteria}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-line/70 flex items-center justify-between text-xs font-semibold text-green-dark bg-green-pale/30 px-3 py-2 rounded-lg">
                  <span>Bilan :</span>
                  <span>{p.outcome}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Onglet 2 : Phase Principale */}
      {activeTab === 'principale' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-orange-pale/60 border border-orange/20 flex items-start gap-3">
            <SparklesIcon className="w-5 h-5 text-orange-dark shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-orange-dark">
              <strong>Groupe unique & Classement général :</strong> À partir de 16 candidats, les groupes disparaissent. Tous participent ensemble et sont départagés par les points au classement général.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MAIN_PHASES.map((p, index) => (
              <div
                key={p.phase}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                  p.highlight
                    ? 'bg-gradient-to-br from-green-pale/80 to-orange-pale/40 border-green md:col-span-2 lg:col-span-3'
                    : 'bg-white border-line hover:border-green-light'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-orange-dark uppercase tracking-wider">
                      Tour 0{index + 1}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-soft text-mute border border-line">
                      <SwordsIcon className="w-3.5 h-3.5 text-mute" />
                      {p.matches} match
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-ink text-base mb-2 flex items-center gap-2">
                    {p.phase}
                    {p.highlight && <CrownIcon className="w-5 h-5 text-orange shrink-0" />}
                  </h3>

                  <div className="space-y-2 text-xs sm:text-sm text-ink/80 mb-4">
                    <div className="flex items-start gap-2">
                      <UsersIcon className="w-4 h-4 text-mute shrink-0 mt-0.5" />
                      <span>{p.participants} candidats ({p.format})</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckIcon className="w-4 h-4 text-green shrink-0 mt-0.5" />
                      <span>{p.criteria}</span>
                    </div>
                  </div>
                </div>

                <div
                  className={`pt-3 border-t px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between ${
                    p.highlight
                      ? 'border-green/30 bg-green text-white'
                      : 'border-line/70 bg-soft text-ink'
                  }`}
                >
                  <span>Bilan :</span>
                  <span>{p.outcome}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Onglet 3 : Tableau Synthétique */}
      {activeTab === 'summary' && (
        <div className="border border-line rounded-2xl overflow-hidden bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-soft border-b border-line text-mute uppercase font-bold text-[0.7rem] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Étape</th>
                  <th className="py-3 px-4">Organisation</th>
                  <th className="py-3 px-4 text-center">Participants</th>
                  <th className="py-3 px-4 text-center">Qualifiés</th>
                  <th className="py-3 px-4 text-center">Éliminés</th>
                  <th className="py-3 px-4 text-right">Nb Matchs</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                <tr className="hover:bg-soft/50">
                  <td className="py-3 px-4 font-semibold text-ink">Première qualification</td>
                  <td className="py-3 px-4 text-mute">2 groupes de 15</td>
                  <td className="py-3 px-4 text-center font-bold">30</td>
                  <td className="py-3 px-4 text-center text-green-dark font-medium">20 directs</td>
                  <td className="py-3 px-4 text-center text-orange-dark">10 au barrage</td>
                  <td className="py-3 px-4 text-right font-bold">2</td>
                </tr>
                <tr className="hover:bg-soft/50">
                  <td className="py-3 px-4 font-semibold text-ink">Barrage (Seconde chance)</td>
                  <td className="py-3 px-4 text-mute">10 candidats réunis</td>
                  <td className="py-3 px-4 text-center font-bold">10</td>
                  <td className="py-3 px-4 text-center text-green-dark font-medium">6 repêchés</td>
                  <td className="py-3 px-4 text-center text-red-600">4</td>
                  <td className="py-3 px-4 text-right font-bold">1</td>
                </tr>
                <tr className="hover:bg-soft/50">
                  <td className="py-3 px-4 font-semibold text-ink">Deuxième qualification</td>
                  <td className="py-3 px-4 text-mute">2 groupes de 13</td>
                  <td className="py-3 px-4 text-center font-bold">26</td>
                  <td className="py-3 px-4 text-center text-green-dark font-medium">20</td>
                  <td className="py-3 px-4 text-center text-red-600">6</td>
                  <td className="py-3 px-4 text-right font-bold">2</td>
                </tr>
                <tr className="hover:bg-soft/50">
                  <td className="py-3 px-4 font-semibold text-ink">Troisième qualification</td>
                  <td className="py-3 px-4 text-mute">2 groupes de 10</td>
                  <td className="py-3 px-4 text-center font-bold">20</td>
                  <td className="py-3 px-4 text-center text-green-dark font-medium">16 en phase principale</td>
                  <td className="py-3 px-4 text-center text-red-600">4</td>
                  <td className="py-3 px-4 text-right font-bold">2</td>
                </tr>
                <tr className="bg-green-pale/20 font-bold text-green-dark">
                  <td colSpan={5} className="py-2.5 px-4 uppercase text-[0.7rem] tracking-wider">
                    Sous-total Qualifications
                  </td>
                  <td className="py-2.5 px-4 text-right font-extrabold">7 matchs</td>
                </tr>
                <tr className="hover:bg-soft/50">
                  <td className="py-3 px-4 font-semibold text-ink">Tour 1</td>
                  <td className="py-3 px-4 text-mute">16 candidats réunis</td>
                  <td className="py-3 px-4 text-center font-bold">16</td>
                  <td className="py-3 px-4 text-center text-green-dark font-medium">13</td>
                  <td className="py-3 px-4 text-center text-red-600">3</td>
                  <td className="py-3 px-4 text-right font-bold">1</td>
                </tr>
                <tr className="hover:bg-soft/50">
                  <td className="py-3 px-4 font-semibold text-ink">Tour 2</td>
                  <td className="py-3 px-4 text-mute">13 candidats réunis</td>
                  <td className="py-3 px-4 text-center font-bold">13</td>
                  <td className="py-3 px-4 text-center text-green-dark font-medium">10</td>
                  <td className="py-3 px-4 text-center text-red-600">3</td>
                  <td className="py-3 px-4 text-right font-bold">1</td>
                </tr>
                <tr className="hover:bg-soft/50">
                  <td className="py-3 px-4 font-semibold text-ink">Seizième de finale</td>
                  <td className="py-3 px-4 text-mute">10 candidats réunis</td>
                  <td className="py-3 px-4 text-center font-bold">10</td>
                  <td className="py-3 px-4 text-center text-green-dark font-medium">8</td>
                  <td className="py-3 px-4 text-center text-red-600">2</td>
                  <td className="py-3 px-4 text-right font-bold">1</td>
                </tr>
                <tr className="hover:bg-soft/50">
                  <td className="py-3 px-4 font-semibold text-ink">Huitième de finale</td>
                  <td className="py-3 px-4 text-mute">8 candidats réunis</td>
                  <td className="py-3 px-4 text-center font-bold">8</td>
                  <td className="py-3 px-4 text-center text-green-dark font-medium">6</td>
                  <td className="py-3 px-4 text-center text-red-600">2</td>
                  <td className="py-3 px-4 text-right font-bold">1</td>
                </tr>
                <tr className="hover:bg-soft/50">
                  <td className="py-3 px-4 font-semibold text-ink">Quart de finale</td>
                  <td className="py-3 px-4 text-mute">6 candidats réunis</td>
                  <td className="py-3 px-4 text-center font-bold">6</td>
                  <td className="py-3 px-4 text-center text-green-dark font-medium">4</td>
                  <td className="py-3 px-4 text-center text-red-600">2</td>
                  <td className="py-3 px-4 text-right font-bold">1</td>
                </tr>
                <tr className="hover:bg-soft/50">
                  <td className="py-3 px-4 font-semibold text-ink">Demi-finale</td>
                  <td className="py-3 px-4 text-mute">4 candidats réunis</td>
                  <td className="py-3 px-4 text-center font-bold">4</td>
                  <td className="py-3 px-4 text-center text-green-dark font-medium">2 finalistes</td>
                  <td className="py-3 px-4 text-center text-orange-dark">3e podium / 4e éliminé</td>
                  <td className="py-3 px-4 text-right font-bold">1</td>
                </tr>
                <tr className="hover:bg-green-pale/40 bg-green-pale/20">
                  <td className="py-3 px-4 font-bold text-green-dark flex items-center gap-1.5">
                    <TrophyIcon className="w-4 h-4 text-orange shrink-0" />
                    Grande Finale (HighFive)
                  </td>
                  <td className="py-3 px-4 text-mute">2 finalistes face à face</td>
                  <td className="py-3 px-4 text-center font-bold">2</td>
                  <td className="py-3 px-4 text-center font-bold text-green-dark">1 DevChampion</td>
                  <td className="py-3 px-4 text-center text-mute">1 finaliste</td>
                  <td className="py-3 px-4 text-right font-bold">1</td>
                </tr>
              </tbody>
              <tfoot className="bg-ink text-white font-bold">
                <tr>
                  <td colSpan={2} className="py-3 px-4 uppercase tracking-wider text-xs">
                    Total de la compétition
                  </td>
                  <td className="py-3 px-4 text-center">30 au départ</td>
                  <td className="py-3 px-4 text-center text-green-light">1 Champion</td>
                  <td className="py-3 px-4 text-center text-white/70">29 éliminés</td>
                  <td className="py-3 px-4 text-right text-orange text-sm font-extrabold">14 MATCHS</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
