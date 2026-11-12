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

const stages = [
  {
    id: 'inscriptions',
    step: 'Étape 01',
    title: 'Phase d’inscription',
    badge: 'Inscriptions',
    items: [
      { label: 'Dépôt des candidatures', count: 'En ligne' },
      { label: 'Places visées', count: '30 candidats' },
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
      { label: 'Groupes A & B', count: '30 cand.' },
      { label: 'Barrage', count: '10 cand.' },
    ],
    output: '16 qualifiés retenus',
  },
  {
    id: 'principale',
    step: 'Étape 03',
    title: 'Phase principale',
    badge: '4 matchs',
    items: [
      { label: 'Tours 1 & 2', count: '16 → 13' },
      { label: '16ᵉ & 8ᵉ de finale', count: '10 → 8' },
    ],
    output: '6 qualifiés pour les quarts',
  },
  {
    id: 'quarts',
    step: 'Étape 04',
    title: 'Quarts de finale',
    badge: '1 match',
    items: [
      { label: 'Confrontation Top 6', count: '6 cand.' },
      { label: 'Ticket dernier carré', count: '4 places' },
    ],
    output: '4 demi-finalistes',
  },
  {
    id: 'demis',
    step: 'Étape 05',
    title: 'Demi-finales',
    badge: '1 match',
    items: [
      { label: 'Dernier carré', count: '4 cand.' },
      { label: 'Match de podium', count: '3ᵉ place' },
    ],
    output: '2 finalistes pour le titre',
  },
  {
    id: 'finale',
    step: 'Étape 06',
    title: 'Grande finale',
    badge: 'Finale',
    items: [
      { label: 'Duel ultime au sommet', count: '2 finalistes' },
      { label: 'Team Building H5', count: 'En direct' },
    ],
    output: '1 DevChampion sacré',
    highlight: true,
  },
];

export function TournamentBracket({ registrationOpen }: { registrationOpen: boolean }) {
  return (
    <div className="w-full">
      <div className="mb-6 flex flex-col items-start justify-between gap-3 border-b border-line pb-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-1 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-700">
            <SwordsIcon className="h-3.5 w-3.5 text-slate-600" />
            Parcours du tournoi · 14 matchs
          </div>
          <h3 className="font-heading text-xl font-extrabold text-ink sm:text-2xl">
            Les étapes vers le titre
          </h3>
          <p className="mt-0.5 text-xs text-mute sm:text-sm">
            Des inscriptions au sacre du DevChampion.
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

      <ol className="relative mx-auto max-w-3xl space-y-4 before:absolute before:bottom-8 before:left-5 before:top-8 before:w-0.5 before:bg-gradient-to-b before:from-green-light before:via-line before:to-orange/60 sm:space-y-5 sm:before:left-6">
        {stages.map((stage, index) => {
          const isRegistration = 'registration' in stage;
          const isCurrent = isRegistration && registrationOpen;
          const isFinal = 'highlight' in stage && stage.highlight;

          return (
            <li key={stage.id} className="relative flex items-start gap-3 sm:gap-5">
              <span
                className={`relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border-4 border-white text-xs font-extrabold shadow-sm sm:h-12 sm:w-12 ${
                  isCurrent
                    ? 'bg-green text-white ring-4 ring-green-pale'
                    : isFinal
                      ? 'bg-orange text-white ring-4 ring-orange-pale'
                      : 'bg-white text-green-dark ring-1 ring-line'
                }`}
                aria-hidden="true"
              >
                {String(index + 1).padStart(2, '0')}
              </span>

              <article
                className={`min-w-0 flex-1 rounded-2xl border p-4 shadow-xs transition-shadow hover:shadow-card sm:p-5 ${
                  isCurrent
                    ? 'border-green/35 bg-gradient-to-br from-green-pale/70 via-white to-white ring-1 ring-green/10'
                    : isFinal
                      ? 'border-orange/40 bg-gradient-to-br from-orange-pale/80 via-white to-orange-pale/30'
                      : 'border-line bg-white'
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[0.68rem] font-bold uppercase tracking-wider text-slate-400">
                      {stage.step}
                    </p>
                    <h4 className="mt-0.5 font-heading text-base font-extrabold leading-tight text-ink sm:text-lg">
                      {stage.title}
                    </h4>
                  </div>
                  <span
                    className={`shrink-0 rounded-full border px-2.5 py-1 text-[0.68rem] font-bold ${
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
                      : stage.badge}
                  </span>
                </div>

                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {stage.items.map((item) => (
                    <div
                      key={item.label}
                      className="flex min-w-0 items-center justify-between gap-2 rounded-xl border border-slate-200/80 bg-slate-50 px-3 py-2.5 text-xs"
                    >
                      <span className="min-w-0 font-semibold text-slate-700">{item.label}</span>
                      <span className="shrink-0 rounded-md border border-slate-200 bg-white px-2 py-1 text-[0.68rem] font-extrabold text-slate-900 shadow-2xs">
                        {item.count}
                      </span>
                    </div>
                  ))}
                </div>

                <div
                  className={`mt-3 flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-bold ${
                    isFinal
                      ? 'bg-orange text-white'
                      : isCurrent
                        ? 'border border-green/15 bg-green-pale/60 text-green-dark'
                        : 'border border-slate-200 bg-slate-100 text-slate-800'
                  }`}
                >
                  {isFinal ? (
                    <TrophyIcon className="h-4 w-4 shrink-0" />
                  ) : (
                    <CheckIcon className="h-4 w-4 shrink-0" />
                  )}
                  <span>{stage.output}</span>
                </div>

                {isRegistration && (
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs text-mute">
                      {isCurrent
                        ? 'Candidatez dès maintenant pour tenter votre chance.'
                        : 'Suivez nos actualités pour connaître la prochaine ouverture.'}
                    </p>
                    {isCurrent && (
                      <Link
                        href="/candidacy"
                        className="inline-flex min-h-10 items-center justify-center rounded-xl bg-orange px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-orange-dark"
                      >
                        Candidater
                      </Link>
                    )}
                  </div>
                )}

                {isFinal && (
                  <div className="mt-3 grid grid-cols-2 gap-2 rounded-xl border border-amber-400/30 bg-slate-900 p-3 text-xs text-white">
                    <div className="flex items-center gap-2">
                      <CoinsIcon className="h-4 w-4 shrink-0 text-amber-300" />
                      <span className="font-bold text-amber-300">10 000 FCFA</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <UtensilsIcon className="h-4 w-4 shrink-0 text-emerald-400" />
                      <span>5 tickets resto</span>
                    </div>
                    <div className="col-span-2 flex items-center gap-2 border-t border-white/10 pt-2 font-bold text-amber-200">
                      <CrownIcon className="h-4 w-4 shrink-0" />
                      <span>DEVCHAMPION · Team Building HighFive</span>
                    </div>
                  </div>
                )}
              </article>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
