import { Suspense } from 'react';
import { io } from 'next/cache';
import { createClient } from '@/src/utils/supabase/server';
import { CandidatureForm } from '@/src/components/candidatures/candidature-form';
import { ErrorState } from '@/src/components/ui/error-state';
import Link from 'next/link';

export const metadata = {
  title: 'Candidater – Question pour un DevAs',
  description: 'Déposez votre candidature pour participer à Question pour un DevAs.',
};

export default function CandidaturePage() {
  return (
    <Suspense fallback={<CandidatureSkeleton />}>
      <CandidatureDynamic />
    </Suspense>
  );
}

function CandidatureSkeleton() {
  return (
    <div className="bg-soft">
      <div className="bg-gradient-to-br from-green-dark to-green py-14">
        <div className="max-w-[1180px] mx-auto px-4">
          <div className="animate-pulse space-y-3">
            <div className="h-4 w-24 bg-white/30 rounded" />
            <div className="h-10 w-72 bg-white/30 rounded" />
            <div className="h-4 w-96 bg-white/30 rounded" />
          </div>
        </div>
      </div>
      <div className="bg-soft py-12">
        <div className="max-w-[1180px] mx-auto px-4">
          <div className="animate-pulse h-96 rounded-2xl bg-line/40" />
        </div>
      </div>
    </div>
  );
}

async function CandidatureDynamic() {
  await io();
  try {
    const supabase = await createClient();

    const { data: edition, error } = await supabase
      .from('editions')
      .select('*')
      .eq('candidatures_ouvertes', true)
      .order('annee', { ascending: false })
      .limit(1)
      .single();

    if (error || !edition) {
      return (
        <div className="py-20">
          <div className="max-w-[1180px] mx-auto px-4">
            <ErrorState
              title="Candidatures fermées"
              message="Aucune édition n&#39;accepte actuellement de candidatures."
            />
          </div>
        </div>
      );
    }

    return (
      <>
        <div className="bg-gradient-to-br from-green-dark to-green py-14">
          <div className="max-w-[1180px] mx-auto px-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-white/70">
              {'Édition '}{edition.annee}
            </span>
            <h1 className="text-white mt-2 mb-3 text-3xl md:text-4xl font-extrabold">
              {'Déposer ma candidature'}
            </h1>
            <p className="text-white/75 text-base max-w-[48ch]">
              {'Rejoignez la compétition de culture générale pour les passionnés du développement.'}
            </p>
            <nav aria-label="Fil d&#39;Ariane" className="mt-5 flex items-center gap-2 text-sm text-white/60">
              <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
              <span>/</span>
              <span className="text-white">Candidater</span>
            </nav>
          </div>
        </div>

        <div className="bg-soft py-12">
          <div className="max-w-[1180px] mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">

              <div className="flex flex-col gap-4">
                <div className="bg-white rounded-xl border border-line shadow-card p-8">
                  <div className="mb-7">
                    <h2 className="text-lg font-bold mb-1">Informations personnelles</h2>
                    <p className="text-sm text-mute">
                      {'Les champs marqués '}
                      <span className="text-green font-semibold">*</span>
                      {' sont obligatoires.'}
                    </p>
                  </div>
                  <CandidatureForm edition={edition} />
                </div>
                <div className="flex items-center gap-2 text-sm text-mute">
                  <span>{'Vous avez déjà candidaté ?'}</span>
                  <Link href="/candidacy/suivi" className="text-green-dark font-semibold hover:underline">
                    {'Suivre ma candidature →'}
                  </Link>
                </div>
              </div>

              <aside className="flex flex-col gap-5">
                <div className="bg-white rounded-xl border-t-4 border-green border-x border-b border-line p-5">
                  <div className="flex justify-between items-start gap-3 mb-3">
                    <h3 className="text-sm font-bold">{edition.nom}</h3>
                    <span className="inline-flex items-center h-6 px-3 rounded-full bg-green-pale text-green-dark text-xs font-semibold">
                      {edition.annee}
                    </span>
                  </div>
                  {edition.description && (
                    <p className="text-sm text-mute">{edition.description}</p>
                  )}
                </div>

                <div className="bg-white rounded-xl border border-line p-5">
                  <h3 className="text-sm font-bold mb-4">{'Questions fréquentes'}</h3>
                  <div className="flex flex-col gap-4">
                    {[
                      { q: 'Qui peut participer ?', a: "Tout étudiant ou passionné, sans limite d'âge." },
                      { q: 'Comment suivre ma candidature ?', a: 'Vous recevrez un code de suivi par email après soumission.' },
                      { q: 'Y a-t-il des frais ?', a: 'Oui, les frais de souscription s\'éleve à 500.' },
                      { q: "Quand aurai-je une réponse ?", a: 'Vous serez notifié par email selon le calendrier.' },
                    ].map(({ q, a }) => (
                      <div key={q}>
                        <strong className="block text-xs font-semibold text-ink mb-1">{q}</strong>
                        <p className="text-xs text-mute">{a}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </>
    );
  } catch (err) {
    console.error(err);
    return (
      <div className="py-20">
        <div className="max-w-[1180px] mx-auto px-4">
          <ErrorState title="Erreur" message="Une erreur s&#39;est produite." />
        </div>
      </div>
    );
  }
}
