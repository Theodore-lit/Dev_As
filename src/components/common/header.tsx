'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

interface HeaderProps {
  role?: 'public' | 'participant' | 'admin';
  userName?: string;
  onLogout?: () => void;
}

const publicLinks = [
  { label: 'Accueil',        href: '/' },
  { label: 'La compétition', href: '/competition' },
  { label: 'Éditions',       href: '/editions' },
  { label: 'Participants',   href: '/participants' },
  // { label: 'Résultats',      href: '/resultats' },
  // { label: 'Palmarès',       href: '/palmares' },
  // { label: 'Actualités',     href: '/actualites' },
];

export function Header({ role = 'public', userName, onLogout }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const links = publicLinks;

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const isActive = (href: string) =>
    href === '/resultats'
      ? pathname === href || pathname === '/matchs' || pathname.startsWith('/matchs/')
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-line">
      <div className="max-w-[1180px] mx-auto px-4 flex items-center gap-6 h-[68px] relative">

        {/* Logo */}
        <Link href="/" aria-label="Accueil DevAs" className="flex items-center shrink-0">
          <Image
            src="/logo.png"
            alt="DevAs – Question pour un Champion"
            width={120}
            height={52}
            priority
            className="h-[52px] w-auto object-contain"
          />
        </Link>

        {/* Navigation desktop */}
        <nav className="hidden flex-1 items-center justify-center gap-0.5 md:flex" aria-label="Navigation principale">
          {links.map(link => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={[
                  'relative px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  active
                    ? 'text-green-dark font-semibold bg-green-pale'
                    : 'text-ink hover:bg-soft',
                ].join(' ')}
                aria-current={active ? 'page' : undefined}
              >
                {link.label}
                {active && (
                  <span className="hidden md:block absolute bottom-[-14px] left-3 right-3 h-[3px] bg-green rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Auth */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          {userName ? (
            <>
              <span className="text-sm text-mute">{userName}</span>
              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium text-ink hover:bg-soft transition-colors"
                >
                  Déconnexion
                </button>
              )}
            </>
          ) : role === 'public' ? (
            <>
              {/* <Link
                href="/connexion"
                className="px-4 py-2 rounded-lg text-sm font-semibold text-ink hover:bg-soft transition-colors"
              >
                Connexion
              </Link> */}
              <Link
                href="/candidacy"
                className="px-4 py-2 rounded-[10px] bg-orange !text-white text-sm font-bold hover:bg-orange-dark hover:!text-white transition-colors"
              >
                Candidater
              </Link>
            </>
          ) : null}
        </div>

        {/* Burger mobile */}
        <button
          type="button"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-ink transition-colors hover:bg-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-dark md:hidden"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
        >
          {open
            ? <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          }
        </button>

      </div>

      {/* Mobile navigation */}
      {open && (
        <>
          <button
            type="button"
            className="fixed inset-x-0 bottom-0 top-[68px] z-30 bg-ink/35 md:hidden"
            aria-label="Fermer le menu"
            onClick={() => setOpen(false)}
          />
          <div
            id="mobile-navigation"
            className="fixed inset-x-0 bottom-0 top-[68px] z-40 flex max-h-[calc(100dvh-68px)] flex-col overflow-y-auto border-t border-line bg-white shadow-xl md:hidden"
          >
            <nav aria-label="Navigation mobile" className="flex flex-col items-center gap-1 px-5 py-5">
              {links.map(link => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? 'page' : undefined}
                    className={[
                      'flex min-h-12 w-full max-w-sm items-center justify-center rounded-xl px-4 py-3 text-center text-base font-medium transition-colors',
                      active
                        ? 'bg-green-pale text-green-dark font-semibold'
                        : 'text-ink hover:bg-soft active:bg-soft',
                    ].join(' ')}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
            {role === 'public' && (
              <div className="sticky bottom-0 mt-auto border-t border-line bg-white px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                <div className="mx-auto grid w-full max-w-sm grid-cols-2 gap-2">
                  <Link
                    href="/connexion"
                    onClick={() => setOpen(false)}
                    className="inline-flex min-h-12 items-center justify-center rounded-xl bg-soft px-4 text-sm font-semibold text-ink transition-colors hover:bg-line"
                  >
                    Connexion
                  </Link>
                  <Link
                    href="/candidacy"
                    onClick={() => setOpen(false)}
                    className="inline-flex min-h-12 items-center justify-center rounded-xl bg-orange px-4 text-sm font-bold !text-white transition-colors hover:bg-orange-dark hover:!text-white"
                  >
                    Candidater
                  </Link>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </header>
  );
}
