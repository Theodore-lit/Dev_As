import { Suspense } from 'react';
import { io } from 'next/cache';
import { createClient } from '@/src/utils/supabase/server';
import { HeroSection } from '@/src/components/home/hero-section';
import { TournamentBracket } from '@/src/components/home/tournament-bracket';
import { RewardsSection } from '@/src/components/home/rewards-section';
import { PrinciplesSection } from '@/src/components/home/principles-section';
import { ActiveEditionSection } from '@/src/components/home/active-edition-section';
import { CtaSection } from '@/src/components/home/cta-section';
import { TrophyIcon } from '@/src/components/common/icons';
import Image from 'next/image';

export const metadata = {
  title: 'DevAs – Question pour un DevChampion',
  description:
    'Concours de culture générale, réflexion et rapidité pour les développeurs passionnés de savoir.',
};

export default async function HomePage() {
  return (
    <div className="flex flex-col">
      {/* 1. Hero agrandi avec atouts et décors immersifs */}
      <HeroSection totalEditions={4} />

      {/* 2. Présentation officielle du concours */}
      <section id="competition" className="py-16 md:py-24 bg-soft/30 scroll-mt-16">
        <div className="max-w-[1180px] mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-16">
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-green-pale text-green-dark text-xs font-bold uppercase tracking-wider border border-green-light/40">
                <TrophyIcon className="w-3.5 h-3.5 text-green-dark" />
                Présentation officielle
              </div>

              <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-ink leading-tight">
                DevAs ou Question pour un <span className="text-green-dark">Dev</span><span className="text-orange">Champion</span>
              </h2>

              <p className="text-ink/85 text-base sm:text-lg leading-relaxed">
                DevAs est un concours de culture générale, de réflexion, de rapidité et de connaissances, organisé autour d&apos;une succession de matchs de qualification et de phases éliminatoires.
              </p>

              <p className="text-mute text-sm sm:text-base leading-relaxed">
                L&apos;objectif est de réunir <strong>30 candidats</strong> autour d&apos;une compétition intellectuelle dynamique, captivante et pleine de suspense, afin de désigner le meilleur candidat : <strong>le DevChampion</strong>.
              </p>

              <div className="text-xs sm:text-sm text-ink/80 bg-white p-4 sm:p-5 rounded-2xl border border-line shadow-xs">
                Au-delà de la compétition, ce rendez-vous vise à stimuler la curiosité, encourager l&apos;apprentissage, développer la capacité de réflexion et de réaction des participants, tout en offrant au public un véritable spectacle intellectuel.
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border border-line shadow-xl aspect-4/3">
                <Image
                  src="/trophy.jpg"
                  alt="Trophée et compétition Question pour un DevChampion"
                  fill
                  sizes="(max-width: 1024px) 100vw, 480px"
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <span className="text-xs uppercase font-bold tracking-wider text-green-light block mb-1">
                    Le couronnement
                  </span>
                  <p className="text-sm sm:text-base font-bold leading-snug">
                    Un seul vainqueur sacré DevChampion lors du Team Building de HIGHFIVE
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Schéma officiel de déroulement (Arbre façon football / Ligue des Champions) */}
          <div className="bg-white rounded-3xl border border-line p-6 sm:p-8 md:p-10 shadow-xs">
            <TournamentBracket />
          </div>
        </div>
      </section>

      {/* 3. Récompenses officielles */}
      <RewardsSection />

      {/* 4. Principes d'organisation */}
      <PrinciplesSection />

      {/* 5. Édition en cours — données dynamiques via io() + Suspense */}
      <Suspense fallback={<ActiveEditionSkeleton />}>
        <ActiveEditionDynamic />
      </Suspense>

      {/* 6. Bandeau CTA final */}
      <CtaSection />
    </div>
  );
}

/** Squelette affiché pendant le streaming de l'édition active */
function ActiveEditionSkeleton() {
  return (
    <section className="py-16 md:py-20 bg-soft/50">
      <div className="max-w-[1180px] mx-auto px-4">
        <div className="animate-pulse h-48 rounded-3xl bg-line/40" />
      </div>
    </section>
  );
}

/** Composant serveur dynamique — se charge via io() hors du shell statique */
async function ActiveEditionDynamic() {
  await io();

  const supabase = await createClient();

  // Priorité : candidatures_ouvertes → en_cours → la plus récente
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

  let candidaturesCount = 0;
  let participantsCount = 0;
  let phasesCount = 0;

  if (activeEdition) {
    const [candRes, partRes, phasRes] = await Promise.all([
      supabase
        .from('candidatures')
        .select('*', { count: 'exact', head: true })
        .eq('edition_id', activeEdition.id),
      supabase
        .from('participants')
        .select('*', { count: 'exact', head: true })
        .eq('edition_id', activeEdition.id),
      supabase
        .from('phases')
        .select('*', { count: 'exact', head: true })
        .eq('edition_id', activeEdition.id),
    ]);
    candidaturesCount = candRes.count ?? 0;
    participantsCount = partRes.count ?? 0;
    phasesCount = phasRes.count ?? 0;
  }

  return (
    <ActiveEditionSection
      edition={activeEdition}
      candidaturesCount={candidaturesCount}
      participantsCount={participantsCount}
      phasesCount={phasesCount}
    />
  );
}
