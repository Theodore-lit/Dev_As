import Image from 'next/image';
import Link from 'next/link';
import {
  AwardIcon,
  CalendarIcon,
  ChartBarIcon,
  ChevronRightIcon,
  TrophyIcon,
  UsersIcon,
} from '@/src/components/common/icons';
import { Badge } from '@/src/components/ui/badge';
import { Card } from '@/src/components/ui/card';
import type { Database } from '@/src/types/database';

type Edition = Database['public']['Tables']['editions']['Row'];
type Phase = Database['public']['Tables']['phases']['Row'];

interface EditionDetailProps {
  edition: Edition;
  phases: Phase[];
  stats: {
    candidatures: number;
    participants: number;
    matchs: number;
  };
}

const STATUS_MAP: Record<
  Edition['statut'],
  { label: string; variant: 'ok' | 'wait' | 'gold' | 'no' | 'default' }
> = {
  preparation: { label: 'En préparation', variant: 'default' },
  candidatures_ouvertes: { label: 'Candidatures ouvertes', variant: 'ok' },
  en_cours: { label: 'En cours', variant: 'wait' },
  terminee: { label: 'Terminée', variant: 'gold' },
  archivee: { label: 'Archivée', variant: 'no' },
};

const PHASE_LABELS: Record<Phase['type'], string> = {
  qualification: 'Qualifications',
  barrage: 'Barrage',
  tour: 'Tour',
  demi_finale: 'Demi-finales',
  finale: 'Finale',
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function StatCard({
  label,
  value,
  kind,
}: {
  label: string;
  value: string | number;
  kind: 'applications' | 'participants' | 'matches' | 'score';
}) {
  const icons = {
    applications: AwardIcon,
    participants: UsersIcon,
    matches: ChartBarIcon,
    score: TrophyIcon,
  };
  const Icon = icons[kind];

  return (
    <Card className="flex items-center gap-4 rounded-2xl border-white/70 p-4 shadow-card sm:p-5">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-green-pale text-green-dark">
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="text-sm text-mute">{label}</p>
        <p className="mt-0.5 truncate font-display text-2xl font-extrabold text-ink">
          {value}
        </p>
      </div>
    </Card>
  );
}

export function EditionDetail({ edition, phases, stats }: EditionDetailProps) {
  const status = STATUS_MAP[edition.statut];

  return (
    <div className="bg-soft/50 pb-14">
      <div className="relative isolate min-h-[390px] overflow-hidden bg-green-dark sm:min-h-[440px]">
        <Image
          src="/hero1.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 -z-20 object-cover object-center"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-green-dark/95 via-green-dark/75 to-green-dark/30" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-green-dark/65 to-transparent" />

        <div className="wrap flex min-h-[390px] flex-col justify-center py-10 sm:min-h-[440px] sm:py-14">
          <Link
            href="/editions"
            className="mb-8 inline-flex w-fit items-center gap-2 text-sm font-semibold text-white/80 transition-colors hover:text-white"
          >
            <ChevronRightIcon className="h-4 w-4 rotate-180" />
            Toutes les éditions
          </Link>

          <div className="max-w-3xl">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-white backdrop-blur-sm">
                Saison {edition.annee}
              </span>
              <Badge variant={status.variant}>{status.label}</Badge>
            </div>
            <h1 className="font-display text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
              {edition.nom}
            </h1>
            {edition.description && (
              <p className="mt-5 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">
                {edition.description}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="wrap relative -mt-7">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Candidatures" value={stats.candidatures} kind="applications" />
          <StatCard label="Participants" value={stats.participants} kind="participants" />
          <StatCard label="Matchs" value={stats.matchs} kind="matches" />
          <StatCard label="Score maximum" value={`${edition.score_max_defaut} pts`} kind="score" />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(260px,0.8fr)]">
          <Card className="rounded-3xl p-5 shadow-card sm:p-7">
            <div className="flex items-start gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-orange-pale text-orange-dark">
                <CalendarIcon className="h-5 w-5" />
              </span>
              <div>
                <p className="eyebrow">À retenir</p>
                <h2 className="mt-1 text-xl font-bold text-ink">Calendrier de l’édition</h2>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-line bg-soft/50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-mute">Début</p>
                <p className="mt-2 font-semibold capitalize text-ink">
                  {edition.date_debut ? formatDate(edition.date_debut) : 'Date à confirmer'}
                </p>
              </div>
              <div className="rounded-2xl border border-line bg-soft/50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-mute">Fin</p>
                <p className="mt-2 font-semibold capitalize text-ink">
                  {edition.date_fin ? formatDate(edition.date_fin) : 'Date à confirmer'}
                </p>
              </div>
            </div>
          </Card>

          <Card className="flex flex-col justify-between rounded-3xl bg-gradient-to-br from-orange-pale/60 to-white p-5 shadow-card sm:p-7">
            <div>
              <p className="eyebrow">Candidatures</p>
              <h2 className="mt-1 text-xl font-bold text-ink">
                {edition.candidatures_ouvertes ? 'Rejoignez la compétition' : 'Suivez la compétition'}
              </h2>
              <p className="mt-3 text-sm leading-6 text-mute">
                {edition.candidatures_ouvertes
                  ? 'Les inscriptions sont ouvertes pour cette édition.'
                  : 'Les inscriptions sont fermées pour cette édition.'}
              </p>
            </div>
            <div className="mt-6">
              {edition.candidatures_ouvertes ? (
                <Link
                  href="/candidacy"
                  className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-orange px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-orange-dark"
                >
                  Déposer une candidature
                  <ChevronRightIcon className="h-4 w-4" />
                </Link>
              ) : (
                <span className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-soft px-4 py-2.5 text-sm font-semibold text-mute">
                  Candidatures fermées
                </span>
              )}
            </div>
          </Card>
        </div>

        <section className="mt-12" aria-labelledby="phases-title">
          <div className="relative isolate overflow-hidden rounded-[2rem] bg-green-dark px-5 py-8 shadow-card sm:px-8 sm:py-10 lg:px-10">
            <Image
              src="/hero1.png"
              alt=""
              fill
              sizes="(max-width: 1280px) 100vw, 1180px"
              className="absolute inset-0 -z-20 object-cover object-center"
            />
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-green-dark/95 via-green-dark/85 to-green-dark/65" />

            <div className="relative mb-7 flex flex-wrap items-end justify-between gap-4 sm:mb-9">
              <div className="max-w-2xl">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-light">
                  Le parcours
                </p>
                <h2 id="phases-title" className="mt-2 font-display text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
                  Les étapes vers le titre
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-white/75 sm:text-base">
                  Découvrez le déroulement de la compétition, des premières qualifications jusqu’aux phases décisives.
                </p>
              </div>
              <span className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm">
                {phases.length} {phases.length === 1 ? 'phase' : 'phases'}
              </span>
            </div>

            {phases.length > 0 ? (
              <ol className="relative grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {phases.map((phase, index) => (
                  <li key={phase.id}>
                    <Card className="relative flex h-full min-h-[280px] flex-col overflow-hidden rounded-3xl border-white/20 bg-white/10 p-5 text-white shadow-none backdrop-blur-md transition duration-200 hover:-translate-y-1 hover:bg-white/15 sm:p-6">
                      <span
                        className="pointer-events-none absolute -right-2 -top-8 select-none font-display text-[8rem] font-black leading-none text-white/[0.08]"
                        aria-hidden="true"
                      >
                        {String(index + 1).padStart(2, '0')}
                      </span>

                      <div className="relative flex items-center justify-between gap-3">
                        <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-white/70">
                          <span className="h-2 w-2 rounded-full bg-orange" />
                          Étape {String(index + 1).padStart(2, '0')}
                        </span>
                        <Badge
                          variant="default"
                          className="border border-white/20 bg-white/10 text-white"
                        >
                          {PHASE_LABELS[phase.type]}
                        </Badge>
                      </div>

                      <div className="relative mt-8">
                        <h3 className="font-display text-2xl font-extrabold leading-tight text-white sm:text-3xl">
                          {phase.nom}
                        </h3>
                        <p className="mt-2 text-sm text-white/70">
                          Phase {phase.ordre} de la compétition
                        </p>
                      </div>

                      <div className="relative mt-auto grid grid-cols-2 gap-2 pt-8 text-sm">
                        <div className="rounded-2xl border border-white/15 bg-white/10 p-3">
                          <p className="text-xs text-white/65">Groupes</p>
                          <p className="mt-1 text-lg font-bold text-white">{phase.nb_groupes}</p>
                        </div>
                        <div className="rounded-2xl border border-white/15 bg-white/10 p-3">
                          <p className="text-xs text-white/65">Qualifiés / groupe</p>
                          <p className="mt-1 text-lg font-bold text-white">{phase.nb_qualifies_par_groupe}</p>
                        </div>
                        {phase.nb_barrage_par_groupe > 0 && (
                          <div className="col-span-2 flex items-center justify-between gap-3 rounded-2xl border border-orange/30 bg-orange/15 px-3 py-2.5">
                            <span className="text-xs font-medium text-white/80">Barrages par groupe</span>
                            <span className="font-bold text-white">{phase.nb_barrage_par_groupe}</span>
                          </div>
                        )}
                      </div>
                    </Card>
                  </li>
                ))}
              </ol>
            ) : (
              <Card className="relative rounded-3xl border-white/20 bg-white/10 p-6 text-white shadow-none backdrop-blur-md">
                <p className="font-semibold">Les phases ne sont pas encore définies.</p>
                <p className="mt-1 text-sm text-white/70">Le programme de la compétition sera affiché ici.</p>
              </Card>
            )}
          </div>
        </section>

        <div className="mt-8 flex flex-wrap gap-3">
          {edition.statut === 'terminee' && (
            <Link
              href={`/palmares/${edition.id}`}
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-green px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-green-dark"
            >
              Voir le palmarès
            </Link>
          )}
          <Link
            href="/editions"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-line bg-white px-5 py-2.5 text-sm font-bold text-ink transition-colors hover:bg-soft"
          >
            Retour aux éditions
          </Link>
        </div>
      </div>
    </div>
  );
}
