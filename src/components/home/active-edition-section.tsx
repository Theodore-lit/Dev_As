import Link from 'next/link';
import {
  CalendarIcon,
  UsersIcon,
  CoinsIcon,
  SwordsIcon,
  ChevronRightIcon,
  CheckIcon,
} from '@/src/components/common/icons';
import { formatEditionDate } from '@/src/components/editions/edition-calendar';
import type { Database } from '@/src/types/database';

type EditionRow = Database['public']['Tables']['editions']['Row'];

interface ActiveEditionSectionProps {
  edition: EditionRow | null;
  candidaturesCount: number;
  participantsCount: number;
  phasesCount?: number;
}

export function ActiveEditionSection({
  edition,
  candidaturesCount,
  participantsCount,
  phasesCount = 0,
}: ActiveEditionSectionProps) {
  if (!edition) {
    return null;
  }

  const isCandidaturesOpen = edition.candidatures_ouvertes || edition.statut === 'candidatures_ouvertes';
  const startDateFormatted = edition.date_debut
    ? formatEditionDate(edition.date_debut, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : 'À venir';
  const endDateFormatted = edition.date_fin
    ? formatEditionDate(edition.date_fin, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : 'À confirmer';

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-[1180px] mx-auto px-4">
        <div className="rounded-3xl bg-gradient-to-br from-green-dark via-[#025c29] to-green text-white p-7 sm:p-10 lg:p-12 shadow-xl overflow-hidden relative">
          {/* Cercles d'ambiance en arrière-plan */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute right-40 -top-20 w-60 h-60 rounded-full bg-orange/10 pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center relative z-10">
            {/* Colonne gauche : infos principales de l'édition backend */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-xs font-bold uppercase tracking-wider text-green-light border border-white/10">
                <span className="w-2 h-2 rounded-full bg-orange animate-pulse" />
                {isCandidaturesOpen ? 'Candidatures ouvertes' : `Statut : ${edition.statut}`}
              </div>

              <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
                {edition.nom} · {edition.annee}
              </h2>

              <p className="text-white/85 text-sm sm:text-base leading-relaxed max-w-[50ch]">
                {edition.description ||
                  "Rejoignez les 30 candidats sélectionnés pour vivre l'aventure Question pour un DevChampion. 14 confrontations d'excellence pour décrocher le titre."}
              </p>

              {/* Badges chiffres clés de l'édition active */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                <div className="p-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10">
                  <span className="text-xs text-white/70 block flex items-center gap-1.5">
                    <UsersIcon className="w-3.5 h-3.5 text-green-light" />
                    Candidats
                  </span>
                  <span className="text-lg font-bold text-white">30 retenus</span>
                  <span className="text-[0.7rem] text-white/60 block mt-0.5">
                    {candidaturesCount} {candidaturesCount > 1 ? 'dossiers déposés' : 'dossier déposé'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10">
                  <span className="text-xs text-white/70 block flex items-center gap-1.5">
                    <CoinsIcon className="w-3.5 h-3.5 text-orange" />
                    Frais
                  </span>
                  <span className="text-lg font-bold text-white">500 FCFA</span>
                  <span className="text-[0.7rem] text-white/60 block mt-0.5">Par candidat</span>
                </div>

                <div className="p-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 col-span-2 sm:col-span-1">
                  <span className="text-xs text-white/70 block flex items-center gap-1.5">
                    <SwordsIcon className="w-3.5 h-3.5 text-green-light" />
                    Format
                  </span>
                  <span className="text-lg font-bold text-white">14 Matchs</span>
                  <span className="text-[0.7rem] text-white/60 block mt-0.5">
                    {phasesCount > 0 ? `${phasesCount} phases prévues` : 'Qualifications & Finales'}
                  </span>
                </div>
              </div>

              {/* Actions directes vers les routes backend */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {isCandidaturesOpen ? (
                  <Link
                    href="/candidacy"
                    className="inline-flex items-center gap-2 h-12 px-7 rounded-xl bg-orange text-white font-bold text-sm sm:text-base hover:bg-orange-dark shadow-md transition-all hover:scale-[1.02]"
                  >
                    <span>Déposer ma candidature</span>
                    <ChevronRightIcon className="w-4 h-4 text-white" />
                  </Link>
                ) : (
                  <Link
                    href={`/editions/${edition.id}`}
                    className="inline-flex items-center gap-2 h-12 px-7 rounded-xl bg-white text-green-dark font-bold text-sm sm:text-base hover:bg-green-pale shadow-md transition-all"
                  >
                    <span>Voir les détails de l&apos;édition</span>
                    <ChevronRightIcon className="w-4 h-4 text-green-dark" />
                  </Link>
                )}

                <Link
                  href="/editions"
                  className="inline-flex items-center gap-2 h-12 px-5 rounded-xl bg-white/10 text-white font-semibold text-sm hover:bg-white/20 border border-white/20 transition-colors"
                >
                  <span>Toutes les éditions</span>
                </Link>
              </div>
            </div>

            {/* Colonne droite : Encart dynamique des paramètres backend */}
            <div className="lg:col-span-5 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15 space-y-3.5">
              <h3 className="font-heading font-bold text-white text-base border-b border-white/10 pb-2.5">
                Données officielles en direct
              </h3>

              <div className="space-y-2.5 text-xs sm:text-sm">
                <div className="flex justify-between items-center py-1 border-b border-white/10">
                  <span className="text-white/70 flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-green-light" />
                    Lancement
                  </span>
                  <strong className="text-white font-semibold">{startDateFormatted}</strong>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-white/10">
                  <span className="text-white/70">Fin officielle</span>
                  <strong className="text-white font-semibold">{endDateFormatted}</strong>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-white/10">
                  <span className="text-white/70">Statut </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white text-green-dark">
                    {isCandidaturesOpen ? 'Inscriptions ouvertes' : edition.statut}
                  </span>
                </div>

                {/* <div className="flex justify-between items-center py-1 border-b border-white/10">
                  <span className="text-white/70">Recette prévisionnelle</span>
                  <strong className="text-white font-semibold">15 000 FCFA</strong>
                </div> */}

                

                <div className="flex justify-between items-center py-1">
                  <span className="text-white/70">Participants confirmés</span>
                  <strong className="text-white font-semibold">{participantsCount}</strong>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-black/20 text-xs text-white/80 flex items-center gap-2">
                <CheckIcon className="w-4 h-4 text-green-light shrink-0" />
                <span>Sélection officielle sur dossier validée par le jury</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
