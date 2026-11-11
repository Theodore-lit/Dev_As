import Image from 'next/image';
import Link from 'next/link';
import {
  TrophyIcon,
  CodeIcon,
  ChartBarIcon,
  CalendarIcon,
  PlayIcon,
  ChevronRightIcon,
  CrownIcon,
  SwordsIcon,
  UsersIcon,
  SparklesIcon,
} from '@/src/components/common/icons';

interface HeroSectionProps {
  totalEditions?: number;
}

export function HeroSection({ totalEditions = 4 }: HeroSectionProps) {
  return (
    <div className="relative overflow-hidden">
      {/* Hero principal agrandi avec décors immersifs */}
      <section
        className="relative overflow-hidden min-h-[580px] lg:min-h-[640px] flex items-center"
        style={{
          backgroundImage: 'url(/hero1.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Layer 1: Overlay lumineux de base */}
        <div className="absolute inset-0 bg-white/82 backdrop-blur-[1px]" aria-hidden="true" />

        {/* Layer 2: Trame géométrique tech (grille subtile) */}
        <div
          className="absolute inset-0 opacity-[0.45] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(3, 152, 70, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(3, 152, 70, 0.08) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
          }}
          aria-hidden="true"
        />

        {/* Layer 3: Halos lumineux d'ambiance */}
        <div
          className="absolute top-10 right-1/4 w-[460px] h-[460px] rounded-full bg-gradient-to-br from-green-300/30 via-emerald-400/20 to-transparent blur-3xl pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-10 left-10 w-[380px] h-[380px] rounded-full bg-gradient-to-tr from-orange/20 via-amber-300/20 to-transparent blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        {/* Contenu principal */}
        <div className="relative max-w-[1180px] mx-auto px-4 py-20 md:py-28 lg:py-32 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            
            {/* Colonne gauche (7 cols) : texte & boutons */}
            <div className="lg:col-span-7 flex flex-col gap-6 text-left relative z-10">
              
              {/* Badge supérieur */}
              {/* <div className="inline-flex items-center gap-2.5 bg-white/90 backdrop-blur-md text-green-dark text-xs sm:text-sm font-bold px-4 py-2 rounded-full w-fit border border-green-light/60 shadow-xs">
                <span className="p-1 rounded-full bg-green-pale text-green-dark">
                  <TrophyIcon className="w-3.5 h-3.5" />
                </span>
                <span>Grande compétition de culture générale</span>
                <span className="w-1.5 h-1.5 rounded-full bg-orange animate-ping" />
              </div> */}

              {/* Titre monumental */}
              <div className="space-y-1">
                <span className="text-xs sm:text-sm font-mono tracking-widest text-green-dark uppercase font-bold block opacity-75">
                  &lt;Dev_As /&gt;
                </span>
                <h1 className="font-heading font-extrabold leading-[1.04] tracking-tight text-green-dark text-4xl sm:text-6xl lg:text-[4.2rem]">
                  Question<br />
                  pour un <span className="text-green-dark">Dev</span>
                  <span className="text-orange drop-shadow-xs">Champion</span>
                </h1>
              </div>

              {/* Sous-titre aéré */}
              <p className="text-ink/85 text-base sm:text-lg lg:text-xl leading-relaxed max-w-[48ch]">
                Le rendez-vous incontournable des développeurs passionnés de savoir, de réflexion, de rapidité et d’innovation.
              </p>

              {/* Badges d'accroche express */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs text-ink/80">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/70 backdrop-blur-xs border border-line">
                  <UsersIcon className="w-3.5 h-3.5 text-green-dark" />
                  <strong>30 candidats</strong>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/70 backdrop-blur-xs border border-line">
                  <SwordsIcon className="w-3.5 h-3.5 text-orange" />
                  <strong>14 matchs éliminatoires</strong>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/70 backdrop-blur-xs border border-line">
                  <CrownIcon className="w-3.5 h-3.5 text-green-dark" />
                  <strong>1 seul DevChampion</strong>
                </span>
              </div>

              {/* Boutons d'action */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#competition"
                  className="inline-flex items-center gap-3 h-13 px-8 rounded-xl bg-gradient-to-r from-green-dark to-green text-white font-bold text-base hover:shadow-lg hover:shadow-green/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <PlayIcon className="w-4 h-4 text-white fill-white shrink-0" />
                  <span>Découvrir la compétition</span>
                  <ChevronRightIcon className="w-4 h-4 text-white/80 shrink-0" />
                </a>

                <Link
                  href="/editions"
                  className="inline-flex items-center gap-2.5 h-13 px-7 rounded-xl bg-white/95 backdrop-blur-md text-green-dark font-bold text-base border-2 border-green/60 hover:border-green hover:bg-green-pale/40 transition-all shadow-xs"
                >
                  <CalendarIcon className="w-4 h-4 text-green shrink-0" />
                  <span>Voir les éditions</span>
                </Link>
              </div>
            </div>

            {/* Colonne droite (5 cols) : Logo avec piédestal décoratif et badges flottants */}
            <div className="lg:col-span-5 flex justify-center items-center relative">
              
              {/* Carte glassmorphism décorative en arrière plan */}
              <div className="relative w-full max-w-[440px]">
                {/* Carte de support translucide */}
                <div className="absolute inset-0 bg-white/45 backdrop-blur-md rounded-3xl border border-white/80 shadow-2xl transform -rotate-1 pointer-events-none" />

                {/* Badge flottant 1 : Haut droite */}
                <div className="absolute -top-4 -right-4 z-20 bg-white shadow-lg border border-line rounded-2xl px-3.5 py-2 flex items-center gap-2 animate-bounce [animation-duration:4s]">
                  <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                    <TrophyIcon className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="text-[0.65rem] font-bold text-mute uppercase tracking-wider block">Événement</span>
                    <strong className="text-xs text-ink block leading-none">Team Building HighFive</strong>
                  </div>
                </div>

                {/* Badge flottant 2 : Bas gauche */}
                <div className="absolute -bottom-4 -left-4 z-20 bg-white shadow-lg border border-line rounded-2xl px-3.5 py-2 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-green-pale flex items-center justify-center text-green-dark">
                    <CrownIcon className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="text-[0.65rem] font-bold text-mute uppercase tracking-wider block">Titre décerné</span>
                    <strong className="text-xs text-green-dark block leading-none">Le DevChampion</strong>
                  </div>
                </div>

                {/* Conteneur principal du Logo DevAs */}
                <div className="relative z-10 p-6 md:p-8 flex items-center justify-center">
                  <Image
                    src="/logo.png"
                    alt="DevAs – Génie en Herbe, Question pour un DevChampion"
                    width={540}
                    height={400}
                    priority
                    className="w-full h-auto object-contain drop-shadow-xl hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Bande atouts (reprise fidèle de la maquette avec icônes fines) */}
      <section className="bg-white border-y border-line py-7 shadow-xs relative z-20">
        <div className="max-w-[1180px] mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Carte 1 */}
            <div className="flex items-center gap-3.5 p-2 rounded-xl">
              <div className="w-12 h-12 rounded-full bg-green-pale text-green-dark flex items-center justify-center shrink-0 border border-green-light/40">
                <TrophyIcon className="w-5 h-5 text-green-dark" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-sm text-ink leading-snug">Une compétition prestigieuse</p>
                <p className="text-xs text-mute mt-0.5 leading-normal">Mettez vos connaissances à l’épreuve.</p>
              </div>
            </div>

            {/* Carte 2 */}
            <div className="flex items-center gap-3.5 p-2 rounded-xl">
              <div className="w-12 h-12 rounded-full bg-orange-pale text-orange-dark flex items-center justify-center shrink-0 border border-orange/20">
                <CodeIcon className="w-5 h-5 text-orange-dark" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-sm text-ink leading-snug">Une aventure tech</p>
                <p className="text-xs text-mute mt-0.5 leading-normal">Pour les esprits passionnés du savoir.</p>
              </div>
            </div>

            {/* Carte 3 */}
            <div className="flex items-center gap-3.5 p-2 rounded-xl">
              <div className="w-12 h-12 rounded-full bg-green-pale text-green-dark flex items-center justify-center shrink-0 border border-green-light/40">
                <ChartBarIcon className="w-5 h-5 text-green-dark" />
              </div> 
              <div className="min-w-0">
                <p className="font-bold text-sm text-ink leading-snug">Un classement officiel</p>
                <p className="text-xs text-mute mt-0.5 leading-normal">Suivez votre progression et découvrez les champions.</p>
              </div>
            </div>

            {/* Carte 4 */}
            <div className="flex items-center gap-3.5 p-2 rounded-xl">
              <div className="w-12 h-12 rounded-full bg-orange-pale text-orange-dark flex items-center justify-center shrink-0 border border-orange/20">
                <CalendarIcon className="w-5 h-5 text-orange-dark" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-sm text-ink leading-snug">Des éditions mémorables</p>
                <p className="text-xs text-mute mt-0.5 leading-normal">
                  {totalEditions > 0 ? `${totalEditions} éditions organisées à revivre.` : 'Revivez l’histoire de la compétition.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
