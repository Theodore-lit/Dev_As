import {
  TrophyIcon,
  AwardIcon,
  HeadphonesIcon,
  UtensilsIcon,
  CoinsIcon,
  SparklesIcon,
} from '@/src/components/common/icons';

export function RewardsSection() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-[1180px] mx-auto px-4">
        {/* En-tête de section */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-pale text-orange-dark text-xs font-bold uppercase tracking-wider mb-3">
            <SparklesIcon className="w-3.5 h-3.5 text-orange-dark" />
            Récompenses Officielles
          </div>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-ink">
            Des récompenses à la hauteur du talent
          </h2>
          <p className="text-mute text-sm sm:text-base mt-2">
            À l&apos;issue des 14 confrontations, les trois meilleurs candidats de la compétition se hissent sur le podium.
          </p>
        </div>

        {/* Grille des 3 prix */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {/* 2ème PRIX (Argent) */}
          <div className="order-2 md:order-1 rounded-2xl border border-line bg-soft/40 p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-200 text-slate-700">
                  2ème Prix · Finaliste
                </span>
                <AwardIcon className="w-6 h-6 text-slate-500" />
              </div>

              <h3 className="font-heading font-extrabold text-xl text-ink mb-1">
                Deuxième Place
              </h3>
              <p className="text-xs text-mute mb-5">
                Finaliste de la compétition lors du duel ultime.
              </p>

              <div className="space-y-3 pt-3 border-t border-line">
                <div className="flex items-start gap-3 text-sm">
                  <div className="p-2 rounded-lg bg-white border border-line shrink-0 text-orange-dark">
                    <CoinsIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-ink block">Enveloppe de 5 000 FCFA</span>
                    <span className="text-xs text-mute">Attribuée en direct après la finale</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-sm">
                  <div className="p-2 rounded-lg bg-white border border-line shrink-0 text-green-dark">
                    <UtensilsIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-ink block">10 tickets resto badgés</span>
                    <span className="text-xs text-mute">Partenariat restauration officielle</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-line text-xs font-medium text-mute text-center">
              Podium officiel DevAs
            </div>
          </div>

          {/* 1er PRIX (Or / Vainqueur) - Mis en avant au centre */}
          <div className="order-1 md:order-2 rounded-2xl border-2 border-green bg-gradient-to-b from-green-pale/40 via-white to-white p-7 flex flex-col justify-between shadow-lg relative md:-translate-y-2">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-green-dark text-white text-xs font-bold px-4 py-1 rounded-full tracking-wide uppercase flex items-center gap-1.5 shadow-sm">
              <TrophyIcon className="w-3.5 h-3.5 text-white" />
              Sacre DevChampion
            </div>

            <div>
              <div className="flex items-center justify-between mb-4 mt-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                  1er Prix · Vainqueur Ultime
                </span>
                <TrophyIcon className="w-7 h-7 text-amber-500" />
              </div>

              <h3 className="font-heading font-extrabold text-2xl text-green-dark mb-1">
                Le DevChampion
              </h3>
              <p className="text-xs text-mute mb-5">
                Couronné le jour du Team Building de HIGHFIVE devant toute la communauté.
              </p>

              <div className="space-y-3.5 pt-3 border-t border-green-light/40">
                <div className="flex items-start gap-3 text-sm">
                  <div className="p-2 rounded-lg bg-green-pale text-green-dark shrink-0">
                    <CoinsIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-ink block">Enveloppe de 10 000 FCFA</span>
                    <span className="text-xs text-mute">Prix d&apos;excellence du vainqueur</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-sm">
                  <div className="p-2 rounded-lg bg-green-pale text-green-dark shrink-0">
                    <UtensilsIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-ink block">5 tickets resto badgés</span>
                    <span className="text-xs text-mute">Restauration partenaire</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-sm">
                  <div className="p-2 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
                    <TrophyIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-ink block">Titre & Trophée DevChampion</span>
                    <span className="text-xs text-mute">Inscription éternelle au palmarès</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-green-light/40 text-xs font-bold text-green-dark text-center">
              Reconnaissance suprême de la saison
            </div>
          </div>

          {/* 3ème PRIX (Bronze) */}
          <div className="order-3 rounded-2xl border border-line bg-soft/40 p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100/70 text-amber-900">
                  3ème Prix · Podium
                </span>
                <AwardIcon className="w-6 h-6 text-amber-700" />
              </div>

              <h3 className="font-heading font-extrabold text-xl text-ink mb-1">
                Troisième Place
              </h3>
              <p className="text-xs text-mute mb-5">
                Vainqueur du match de classement en demi-finale.
              </p>

              <div className="space-y-3 pt-3 border-t border-line">
                <div className="flex items-start gap-3 text-sm">
                  <div className="p-2 rounded-lg bg-white border border-line shrink-0 text-orange-dark">
                    <HeadphonesIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-ink block">Un Headphone (Casque Audio)</span>
                    <span className="text-xs text-mute">Équipement tech haute fidélité</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-sm">
                  <div className="p-2 rounded-lg bg-white border border-line shrink-0 text-green-dark">
                    <UtensilsIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-ink block">5 tickets resto</span>
                    <span className="text-xs text-mute">Partenariat restauration</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-line text-xs font-medium text-mute text-center">
              Podium officiel DevAs
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
