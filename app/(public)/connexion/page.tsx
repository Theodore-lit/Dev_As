import Image from 'next/image';
import Link from 'next/link';
import { LoginForm } from '@/src/components/auth/login-form';

export const instant = false;

export const metadata = {
  title: 'Connexion - Question pour un DevAs',
  description: 'Connectez-vous à votre compte',
};

export default function ConnexionPage() {
  return (
    <section className="flex flex-1 items-center bg-gradient-to-br from-green-pale/50 via-white to-orange-pale/40 px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto w-full max-w-6xl">
        <div className="grid overflow-hidden rounded-[2rem] bg-white shadow-[0_28px_90px_-40px_rgba(2,107,48,0.35)] ring-1 ring-ink/5 md:min-h-[620px] md:grid-cols-[1.05fr_0.95fr]">
          <div className="relative isolate flex min-h-[300px] flex-col justify-end overflow-hidden bg-green-dark p-7 sm:p-10 md:min-h-full md:p-12">
            <Image
              src="/hero1.png"
              alt="Des candidats s'affrontent lors de la compétition Question pour un DevAs"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 55vw"
              className="absolute inset-0 -z-20 object-cover"
            />
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#041c13]/95 via-[#041c13]/55 to-[#041c13]/15" />
            <div className="mb-auto inline-flex w-fit items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-2 text-xs font-semibold tracking-wide text-white backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-orange" />
              Devenez LE DEVCHAMPION DE LA SAISON
            </div>

            <div className="max-w-lg text-white">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-green-light">
                Votre aventure continue
              </p>
              <h1 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
                Prêt à relever le défi ?
              </h1>
              <p className="mt-4 max-w-md text-sm leading-6 text-white/80 sm:text-base">
                Retrouvez votre espace et poursuivez votre parcours au cœur de la compétition.
              </p>
              <div className="mt-8 flex items-center gap-3 text-sm font-medium text-white/90">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/20">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <path d="M12 3 19 6v5c0 4.5-2.9 8-7 10-4.1-2-7-5.5-7-10V6l7-3Z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </span>
                Un espace personnel, un parcours à vous
              </div>
            </div>
          </div>

          <div className="flex items-center px-6 py-10 sm:px-10 lg:px-14">
            <div className="mx-auto w-full max-w-md">
              <div className="mb-8">
                <p className="eyebrow mb-3">Espace membre</p>
                <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
                  Heureux de vous revoir
                </h2>
                <p className="mt-3 text-sm leading-6 text-mute">
                  Connectez-vous pour accéder à votre espace personnel.
                </p>
              </div>

              <LoginForm />

              <div className="mt-8 border-t border-line pt-6 text-center">
                <p className="text-sm text-mute">
                  Vous n’avez pas encore de compte ?
                </p>
                <Link
                  href="/candidacy"
                  className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-green-dark transition-colors hover:text-green"
                >
                  Découvrir la candidature
                  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <path d="M4 10h12m-5-5 5 5-5 5" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
