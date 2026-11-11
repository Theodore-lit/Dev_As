import Link from 'next/link';
import Image from 'next/image';
import { ChevronRightIcon } from '@/src/components/common/icons';

export function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[#013517] via-[#025024] to-[#012812] py-14 md:py-16 text-white border-t border-green-900">
      {/* Halo lumineux d'ambiance */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-72 h-72 bg-green/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-72 h-72 bg-orange/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-[1180px] mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Côté gauche avec mini visuel trophée */}
          <div className="flex items-center gap-6 text-center md:text-left">
            <div className="hidden sm:block relative w-20 h-20 md:w-24 md:h-24 shrink-0 rounded-2xl overflow-hidden border border-white/10 shadow-lg">
              <Image
                src="/trophy.jpg"
                alt="Trophée DevAs"
                fill
                sizes="96px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-green-950/30" />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="h-[2px] w-6 bg-orange rounded-full" />
                <span className="text-orange text-xs sm:text-sm font-bold tracking-wider uppercase">
                  Prêt à relever le défi ?
                </span>
                <span className="h-[2px] w-6 bg-orange rounded-full" />
              </div>

              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight">
                Rejoignez dès maintenant la communauté DevAs !
              </h2>

              <p className="text-white/70 text-xs sm:text-sm max-w-xl">
                Inscrivez-vous pour tenter de décrocher le titre suprême de DevChampion lors du prochain rendez-vous.
              </p>
            </div>
          </div>

          {/* Côté droit avec le bouton d'inscription orange éclatant */}
          <div className="shrink-0">
            <Link
              href="/candidacy"
              className="inline-flex items-center gap-2.5 h-13 px-8 rounded-full bg-orange hover:bg-orange-dark text-white font-bold text-sm sm:text-base shadow-xl hover:shadow-orange/30 transition-all hover:scale-105 active:scale-95"
            >
              <span>S&apos;inscrire maintenant</span>
              <ChevronRightIcon className="w-4 h-4 text-white" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
