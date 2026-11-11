'use client';

import { useState } from 'react';
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
  { label: 'Résultats',      href: '/resultats' },
  { label: 'Palmarès',       href: '/palmares' },
  { label: 'Actualités',     href: '/actualites' },
];

const adminLinks = [
  { label: 'Dashboard',    href: '/admin' },
  { label: 'Éditions',     href: '/editions' },
  { label: 'Candidatures', href: '/candidacy' },
  { label: 'Participants', href: '/participants' },
  { label: 'Résultats',    href: '/matchs' },
];

const participantLinks = [
  { label: 'Mon espace', href: '/participant' },
  { label: 'Mes matchs', href: '/matchs' },
  { label: 'Palmarès',   href: '/palmares' },
];

export function Header({ role = 'public', userName, onLogout }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const links =
    role === 'admin'       ? adminLinks :
    role === 'participant' ? participantLinks :
    publicLinks;

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

        {/* Nav desktop */}
        <nav
          className={[
            'items-center gap-0.5',
            'hidden md:flex',
            open ? '!flex absolute left-0 right-0 top-full flex-col bg-white border-b border-line px-4 py-3 shadow-sm z-40' : '',
          ].join(' ')}
          aria-label="Navigation principale"
        >
          {links.map(link => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={[
                  'relative px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  active
                    ? 'text-green-dark font-semibold bg-green-pale'
                    : 'text-ink hover:bg-soft',
                ].join(' ')}
              >
                {link.label}
                {active && (
                  <span className="hidden md:block absolute bottom-[-14px] left-3 right-3 h-[3px] bg-green rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex-1" />

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
              <Link
                href="/connexion"
                className="px-4 py-2 rounded-lg text-sm font-semibold text-ink hover:bg-soft transition-colors"
              >
                Connexion
              </Link>
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
          className="md:hidden p-2 rounded-lg text-ink hover:bg-soft transition-colors"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
        >
          {open
            ? <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          }
        </button>

      </div>

      {/* Mobile nav dropdown */}
      {open && (
        <div className="md:hidden border-t border-line bg-white px-4 py-3 flex flex-col gap-1 shadow-sm">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={[
                'px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive(link.href)
                  ? 'text-green-dark bg-green-pale font-semibold'
                  : 'text-ink hover:bg-soft',
              ].join(' ')}
            >
              {link.label}
            </Link>
          ))}
          {role === 'public' && (
            <div className="flex gap-2 mt-3 pt-3 border-t border-line">
              <Link href="/connexion" className="flex-1 py-2 text-center rounded-lg text-sm font-semibold text-ink bg-soft hover:bg-line transition-colors">Connexion</Link>
              <Link href="/candidacy" className="flex-1 py-2 text-center rounded-[10px] text-sm font-bold !text-white bg-orange hover:bg-orange-dark hover:!text-white transition-colors">Candidater</Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
