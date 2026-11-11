import Link from 'next/link';
import { Suspense } from 'react';
import { io } from 'next/cache';
import { createClient } from '@/src/utils/supabase/server';
import { TournamentBracket } from '@/src/components/home/tournament-bracket';
import { RewardsSection } from '@/src/components/home/rewards-section';
import {
  TrophyIcon,
  CrownIcon,
  SwordsIcon,
  UsersIcon,
  CoinsIcon,
  CheckIcon,
  ShieldCheckIcon,
  TargetIcon,
  ChartBarIcon,
  ChevronRightIcon,
  CalendarIcon,
} from '@/src/components/common/icons';


export const metadata = {
  title: 'La compétition – Question pour un DevChampion (DevAs)',
  description:
    'Règlement officiel, format en 14 matchs, phases éliminatoires, récompenses, principes d’équité et modalités de participation.',
};

// Membres accrédités de la Régie financière pour le règlement des frais
const REGIE_MEMBERS = [
  { name: 'Tomy AZONSI', role: 'Régie financière', initials: 'TA' },
  { name: 'Armel Kirchinot', role: 'Régie financière', initials: 'AK' },
  { name: 'Steeven Tossa', role: 'Régie financière', initials: 'ST' },
  { name: 'Alapini Primos', role: 'Régie financière', initials: 'AP' },
  { name: 'OROPONDE Christelle', role: 'Régie financière', initials: 'OC' },
];

export default function CompetitionPage() {
  return (
    <Suspense fallback={<CompetitionSkeleton />}>
      <CompetitionDynamic />
    </Suspense>
  );
}

function CompetitionSkeleton() {
  return (
    <div className="flex flex-col bg-white">
      <div className="bg-gradient-to-b from-soft/80 via-white to-white border-b border-line py-10 md:py-14">
        <div className="max-w-[1180px] mx-auto px-4">
          <div className="animate-pulse space-y-4">
            <div className="h-4 w-48 bg-line/60 rounded" />
            <div className="h-10 w-96 bg-line/60 rounded" />
            <div className="h-4 w-72 bg-line/60 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

async function CompetitionDynamic() {
  await io();
  const supabase = await createClient();

  // 1. Récupération de l'édition active depuis le backend
  const { data: openEdition } = await supabase
    .from('editions')
    .select('*')
    .eq('candidatures_ouvertes', true)
    .order('annee', { ascending: false })
    .limit(1)
    .maybeSingle();

  let activeEdition = openEdition;

  if (!activeEdition) {
    const { data: inProgress } = await supabase
      .from('editions')
      .select('*')
      .eq('statut', 'en_cours')
      .order('annee', { ascending: false })
      .limit(1)
      .maybeSingle();
    activeEdition = inProgress;
  }

  if (!activeEdition) {
    const { data: latest } = await supabase
      .from('editions')
      .select('*')
      .order('annee', { ascending: false })
      .limit(1)
      .maybeSingle();
    activeEdition = latest;
  }

  // 2. Données dynamiques de l'édition en cours
  let candidaturesCount = 0;
  let participantsCount = 0;
  if (activeEdition) {
    const [candRes, partRes] = await Promise.all([
      supabase
        .from('candidatures')
        .select('*', { count: 'exact', head: true })
        .eq('edition_id', activeEdition.id),
      supabase
        .from('participants')
        .select('*', { count: 'exact', head: true })
        .eq('edition_id', activeEdition.id),
    ]);
    candidaturesCount = candRes.count || 0;
    participantsCount = partRes.count || 0;
  }

  const isCandidaturesOpen = activeEdition?.candidatures_ouvertes || activeEdition?.statut === 'candidatures_ouvertes';

  return (
    <div className="flex flex-col bg-white">
          
      {/* ── 2. En-tête épuré de sous-page (Design Institutionnel & Accès Rapide) ── */}
      <section className="bg-gradient-to-b from-soft/80 via-white to-white border-b border-line py-10 md:py-14">
        <div className="max-w-[1180px] mx-auto px-4">
          {/* Fil d'Ariane */}
          <nav aria-label="Fil d'Ariane" className="flex items-center gap-2 text-xs text-mute mb-3">
            <Link href="/" className="hover:text-green-dark transition-colors font-medium">Accueil</Link>
            <span>/</span>
            <span className="text-ink font-semibold">La compétition</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-pale text-green-dark text-xs font-bold uppercase tracking-wider mb-2.5 border border-green-light/40">
                <TrophyIcon className="w-3.5 h-3.5 text-green-dark" />
                Règlement Officiel · Édition {activeEdition?.annee || 2026}
              </div>

              <h1 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-[2.6rem] text-ink tracking-tight leading-tight">
                Organisation & Déroulement du Concours
              </h1>

              <p className="text-mute text-sm sm:text-base mt-2.5 leading-relaxed">
                Retrouvez l&apos;intégralité du fonctionnement : les 14 confrontations éliminatoires, le barème des récompenses, les principes d&apos;équité et les modalités de paiement auprès de la régie.
              </p>
            </div>

            {/* Puces de navigation d'ancrage rapide */}
            <div className="flex flex-wrap gap-2 lg:max-w-xs shrink-0 text-xs">
              <a
                href="#tableau"
                className="px-3 py-1.5 rounded-lg bg-white border border-line text-ink hover:border-green hover:text-green-dark font-semibold transition-all shadow-2xs"
              >
                Schéma du Tournoi ↓
              </a>
              <a
                href="#recompenses"
                className="px-3 py-1.5 rounded-lg bg-white border border-line text-ink hover:border-green hover:text-green-dark font-semibold transition-all shadow-2xs"
              >
                Récompenses ↓
              </a>
              <a
                href="#principes"
                className="px-3 py-1.5 rounded-lg bg-white border border-line text-ink hover:border-green hover:text-green-dark font-semibold transition-all shadow-2xs"
              >
                Principes d&apos;équité ↓
              </a>
              <a
                href="#modalites"
                className="px-3 py-1.5 rounded-lg bg-white border border-line text-ink hover:border-orange hover:text-orange-dark font-semibold transition-all shadow-2xs"
              >
                Frais & Régie ↓
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Principes d'organisation et d'équité ── */}
      <section id="principes" className="py-14 md:py-18 bg-soft/40 border-y border-line scroll-mt-12">
        <div className="max-w-[1180px] mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-green-dark block mb-1">
              Règlement intérieur
            </span>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-ink">
              Principes d&apos;organisation et d&apos;équité
            </h2>
            <p className="text-xs sm:text-sm text-mute mt-1">
              Les critères intangibles garantissant l&apos;impartialité et l&apos;esprit sportif tout au long de la compétition.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            <div className="p-5 rounded-2xl bg-white border border-line flex flex-col justify-start shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-green-pale text-green-dark flex items-center justify-center mb-3">
                <ChartBarIcon className="w-4 h-4 text-green-dark" />
              </div>
              <h3 className="font-heading font-bold text-base text-ink mb-1">
                Classement aux points
              </h3>
              <p className="text-xs sm:text-sm text-mute leading-relaxed">
                Les participants sont classés selon leurs performances et les points exacts obtenus au cours de chaque match.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-line flex flex-col justify-start shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mb-3 border border-slate-200">
                <SwordsIcon className="w-4 h-4 text-slate-700" />
              </div>
              <h3 className="font-heading font-bold text-base text-ink mb-1">
                Élimination directe
              </h3>
              <p className="text-xs sm:text-sm text-mute leading-relaxed">
                À la fin de chaque séance, seuls les candidats occupant les positions qualificatives poursuivent l&apos;aventure.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-line flex flex-col justify-start shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-orange-pale text-orange-dark flex items-center justify-center mb-3 border border-orange/20">
                <TargetIcon className="w-4 h-4 text-orange-dark" />
              </div>
              <h3 className="font-heading font-bold text-base text-ink mb-1">
                Questions de départage
              </h3>
              <p className="text-xs sm:text-sm text-mute leading-relaxed">
                En cas d&apos;égalité à une position décisive pour la qualification ou l&apos;élimination, une série de questions de départage est organisée immédiatement.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-line flex flex-col justify-start shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-green-pale text-green-dark flex items-center justify-center mb-3">
                <ShieldCheckIcon className="w-4 h-4 text-green-dark" />
              </div>
              <h3 className="font-heading font-bold text-base text-ink mb-1">
                Équité et transparence
              </h3>
              <p className="text-xs sm:text-sm text-mute leading-relaxed">
                Les règles, le barème des points, le fonctionnement des questions et les éventuelles pénalités sont communiqués avant le coup d&apos;envoi.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-line flex flex-col justify-start shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-3 border border-emerald-200">
                <UsersIcon className="w-4 h-4 text-emerald-800" />
              </div>
              <h3 className="font-heading font-bold text-base text-ink mb-1">
                Classement général unique
              </h3>
              <p className="text-xs sm:text-sm text-mute leading-relaxed">
                À partir des 16 qualifiés, tous les candidats jouent ensemble et sont classés dans un classement général unique sans distinction de groupe.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-orange-pale/50 to-amber-50/50 border border-orange/30 flex flex-col justify-start shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-orange text-white flex items-center justify-center mb-3 shadow-2xs">
                <CrownIcon className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-heading font-bold text-base text-ink mb-1">
                Le couronnement
              </h3>
              <p className="text-xs sm:text-sm text-mute leading-relaxed">
                Le grand vainqueur est sacré DEVCHAMPION en direct devant toute la communauté lors du TEAM BUILDING de HIGHFIVE.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Modalités de participation, Frais & Membres de la Régie ── */}
      <section id="modalites" className="py-14 md:py-18 bg-white scroll-mt-12">
        <div className="max-w-[1180px] mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Colonne gauche : Conditions & Modalités */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white rounded-3xl border border-line p-6 sm:p-8 shadow-xs">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider mb-2.5">
                  <CoinsIcon className="w-3.5 h-3.5 text-slate-600" />
                  Participation & Engagement
                </div>

                <h3 className="font-heading font-extrabold text-2xl text-ink mb-1.5">
                  Modalités de participation
                </h3>
                <p className="text-xs sm:text-sm text-mute mb-5">
                  Chaque candidat sélectionné valide sa participation en respectant les critères officiels :
                </p>

                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-soft/50 border border-line/70">
                    <div className="p-1 rounded-full bg-green-pale text-green-dark mt-0.5 shrink-0">
                      <CheckIcon className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-xs sm:text-sm">
                      <strong className="text-ink block">Frais de participation : 500 FCFA</strong>
                      <span className="text-mute">
                        Montant unique par candidat sélectionné pour les 14 confrontations (recette brute prévisionnelle globale de 15 000 FCFA).
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-soft/50 border border-line/70">
                    <div className="p-1 rounded-full bg-green-pale text-green-dark mt-0.5 shrink-0">
                      <CheckIcon className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-xs sm:text-sm">
                      <strong className="text-ink block">Dossier de candidature officiel</strong>
                      <span className="text-mute">
                        Dépôt complet sur le formulaire en ligne avec données vérifiées durant la période d&apos;ouverture.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-soft/50 border border-line/70">
                    <div className="p-1 rounded-full bg-green-pale text-green-dark mt-0.5 shrink-0">
                      <CheckIcon className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-xs sm:text-sm">
                      <strong className="text-ink block">Validation par le comité</strong>
                      <span className="text-mute">
                        Les 30 meilleurs profils sont retenus pour disputer la Première Qualification en 2 groupes de 15.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-soft/50 border border-line/70">
                    <div className="p-1 rounded-full bg-green-pale text-green-dark mt-0.5 shrink-0">
                      <CheckIcon className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-xs sm:text-sm">
                      <strong className="text-ink block">Présence physique aux matchs</strong>
                      <span className="text-mute">
                        Disponibilité impérative pour les séances de confrontation et la grande finale au Team Building HighFive.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bloc spécial : Membres accrédités de la Régie */}
              <div className="bg-gradient-to-br from-amber-50/70 via-white to-orange-pale/40 rounded-3xl border-2 border-amber-300/80 p-6 sm:p-7 shadow-xs">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
                    <CoinsIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-heading font-extrabold text-base sm:text-lg text-ink">
                      Règlement des frais auprès de la Régie
                    </h4>
                    <p className="text-xs text-mute">
                      Les frais de <strong>500 FCFA</strong> doivent être réglés directement et exclusivement auprès de l&apos;un des membres accrédités :
                    </p>
                  </div>
                </div>

                {/* Grille stylisée des 5 membres de la régie */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-3">
                  {REGIE_MEMBERS.map((member) => (
                    <div
                      key={member.name}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white border border-amber-200/70 shadow-2xs hover:border-amber-400 transition-colors"
                    >
                      <div className="w-9 h-9 rounded-full bg-amber-100 border border-amber-300/60 text-amber-800 font-extrabold text-xs flex items-center justify-center shrink-0">
                        {member.initials}
                      </div>
                      <div className="min-w-0">
                        <strong className="block text-xs sm:text-sm font-bold text-ink truncate">
                          {member.name}
                        </strong>
                        <span className="text-[0.68rem] text-amber-800 font-semibold uppercase tracking-wider block">
                          {member.role}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* <div className="mt-4 p-2.5 rounded-xl bg-white/80 border border-amber-200/60 text-[0.72rem] text-amber-900 flex items-center gap-2">
                  <ShieldCheckIcon className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Un reçu officiel ou une validation de paiement vous sera délivré pour confirmer votre place.</span>
                </div> */}
              </div>
            </div>

            {/* Colonne droite : Encart dynamique de l'édition en cours (Backend) */}
            <div className="lg:col-span-5 bg-gradient-to-br from-green-dark via-[#025c29] to-green text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-4 lg:sticky lg:top-24">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-white/15 text-xs font-bold uppercase tracking-wider text-green-light border border-white/10">
                  {isCandidaturesOpen ? 'Inscriptions ouvertes' : activeEdition?.statut || 'Session active'}
                </span>
                <span className="text-xs font-bold text-white/70">
                  {activeEdition?.annee || 2026}
                </span>
              </div>

              <h4 className="font-heading font-extrabold text-2xl text-white">
                {activeEdition?.nom || 'Édition 2026'}
              </h4>

              <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
                {activeEdition?.description ||
                  "Rejoignez les 30 candidats pour disputer les 14 confrontations d'excellence et tenter de décrocher le titre suprême de DevChampion."}
              </p>

              <div className="space-y-2.5 text-xs sm:text-sm pt-2 border-t border-white/15">
                <div className="flex justify-between py-1 border-b border-white/10">
                  <span className="text-white/75 flex items-center gap-1.5">
                    <CalendarIcon className="w-3.5 h-3.5 text-green-light" />
                    Lancement officiel
                  </span>
                  <strong className="text-white font-semibold">
                    {activeEdition?.date_debut
                      ? new Date(activeEdition.date_debut).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })
                      : 'Prochainement'}
                  </strong>
                </div>

                <div className="flex justify-between py-1 border-b border-white/10">
                  <span className="text-white/75">Candidatures reçues</span>
                  <strong className="text-white font-semibold">{candidaturesCount}</strong>
                </div>

                <div className="flex justify-between py-1 border-b border-white/10">
                  <span className="text-white/75">Places retenues</span>
                  <strong className="text-white font-semibold">30 candidats</strong>
                </div>

                <div className="flex justify-between py-1 border-b border-white/10">
                  <span className="text-white/75">Participants validés</span>
                  <strong className="text-white font-semibold">{participantsCount}</strong>
                </div>

                <div className="flex justify-between py-1">
                  <span className="text-white/75">Participation unitaire</span>
                  <strong className="text-orange font-bold">500 FCFA</strong>
                </div>
              </div>

              <div className="pt-2">
                {isCandidaturesOpen ? (
                  <Link
                    href="/candidacy"
                    className="w-full inline-flex items-center justify-center gap-2 h-12 rounded-xl bg-orange text-white font-bold text-sm hover:bg-orange-dark shadow-md transition-all hover:scale-[1.02]"
                  >
                    <span>Déposer ma candidature</span>
                    <ChevronRightIcon className="w-4 h-4 text-white" />
                  </Link>
                ) : (
                  <Link
                    href="/editions"
                    className="w-full inline-flex items-center justify-center gap-2 h-12 rounded-xl bg-white text-green-dark font-bold text-sm hover:bg-green-pale shadow-md transition-all"
                  >
                    <span>Consulter toutes les éditions</span>
                    <ChevronRightIcon className="w-4 h-4 text-green-dark" />
                  </Link>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 3. Récompenses officielles du Podium ── */}
      <div id="recompenses" className="scroll-mt-12">
        <RewardsSection />
      </div>

      {/* ── 1. Schéma de déroulement façon tournoi (14 Matchs compacts) ── */}
      <section id="tableau" className="py-14 md:py-18 bg-white scroll-mt-12">
        <div className="max-w-[1180px] mx-auto px-4">
          <div className="bg-white rounded-3xl border border-line p-6 sm:p-8 md:p-10 shadow-xs">
            <TournamentBracket />
          </div>
        </div>
      </section>

      

      {/* ── 6. CTA final ── */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#013517] via-[#025024] to-[#012812] py-14 md:py-16 text-white border-t border-green-900">
        <div className="max-w-[1180px] mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <span className="text-orange text-xs font-bold tracking-wider uppercase block mb-1">
              — Prêt à relever le défi ? —
            </span>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
              Tentez l&apos;aventure Question pour un DevChampion !
            </h2>
            <p className="text-white/75 text-xs sm:text-sm mt-1 max-w-xl">
              Rejoignez les 30 compétiteurs et défendez votre place jusqu&apos;à la grande finale lors du Team Building de HighFive.
            </p>
          </div>

          <Link
            href="/candidacy"
            className="inline-flex items-center gap-2 h-12 px-8 rounded-full bg-orange hover:bg-orange-dark text-white font-bold text-sm sm:text-base shadow-xl transition-all hover:scale-105 shrink-0"
          >
            <span>S&apos;inscrire maintenant</span>
            <ChevronRightIcon className="w-4 h-4 text-white" />
          </Link>
        </div>
      </section>
    </div>
  );
}
