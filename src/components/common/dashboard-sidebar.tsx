'use client';

import { useRef, useState } from 'react';
import type { PointerEvent } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/src/utils/supabase/client';

type DashboardRole = 'admin' | 'participant';
type SidebarIcon = 'dashboard' | 'documents' | 'users' | 'results' | 'trophy';

interface SidebarItem {
  label: string;
  href: string;
  icon: SidebarIcon;
}

interface DashboardSidebarProps {
  role: DashboardRole;
  userName: string;
}

const sidebarItems: Record<DashboardRole, SidebarItem[]> = {
  admin: [
    { label: 'Tableau de bord', href: '/admin', icon: 'dashboard' },
    { label: 'Éditions', href: '/editions', icon: 'documents' },
    { label: 'Candidatures', href: '/candidacy', icon: 'documents' },
    { label: 'Participants', href: '/participants', icon: 'users' },
    { label: 'Résultats', href: '/matchs', icon: 'results' },
  ],
  participant: [
    { label: 'Mon espace', href: '/participant', icon: 'dashboard' },
    { label: 'Mes matchs', href: '/matchs', icon: 'results' },
    { label: 'Palmarès', href: '/palmares', icon: 'trophy' },
  ],
};

function SidebarIconView({ icon }: { icon: SidebarIcon }) {
  const common = {
    className: 'h-5 w-5 shrink-0',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    viewBox: '0 0 24 24',
    'aria-hidden': true as const,
  };

  switch (icon) {
    case 'dashboard':
      return (
        <svg {...common}>
          <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
          <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
          <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
          <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
        </svg>
      );
    case 'documents':
      return (
        <svg {...common}>
          <path d="M7 3.75h7l4.25 4.5v11A1.75 1.75 0 0 1 16.5 21h-9A1.75 1.75 0 0 1 5.75 19.25v-13.75A1.75 1.75 0 0 1 7.5 3.75Z" />
          <path d="M14 4v5h4.25M8.5 13h7m-7 3.5h7" />
        </svg>
      );
    case 'users':
      return (
        <svg {...common}>
          <path d="M16 20v-1.5a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4V20" />
          <circle cx="9.5" cy="7.5" r="3.5" />
          <path d="M17 11a3.5 3.5 0 0 0 0-7m4 16v-1.5a4 4 0 0 0-3-3.87" />
        </svg>
      );
    case 'results':
      return (
        <svg {...common}>
          <path d="M4 19.5h16M6.5 16V11m5.5 5V5m5.5 11V8" />
          <circle cx="6.5" cy="8" r="1.5" />
          <circle cx="17.5" cy="5" r="1.5" />
        </svg>
      );
    case 'trophy':
      return (
        <svg {...common}>
          <path d="M8 4h8v4a4 4 0 0 1-8 0V4Zm4 8v5m-4 3h8m-6-3h4" />
          <path d="M8 6H4v2a4 4 0 0 0 4 4m8-6h4v2a4 4 0 0 1-4 4" />
        </svg>
      );
  }
}

export function DashboardSidebar({ role, userName }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [expanded, setExpanded] = useState(true);
  const [position, setPosition] = useState({ x: 20, y: 112 });
  const [error, setError] = useState<string | null>(null);
  const [signingOut, setSigningOut] = useState(false);
  const dragOrigin = useRef<{
    pointerX: number;
    pointerY: number;
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  const isActive = (href: string) =>
    pathname === href || (href !== '/admin' && href !== '/participant' && pathname.startsWith(`${href}/`));

  const startDragging = (event: PointerEvent<HTMLButtonElement>) => {
    const bounds = event.currentTarget.closest('aside')?.getBoundingClientRect();
    if (!bounds) return;

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragOrigin.current = {
      pointerX: event.clientX,
      pointerY: event.clientY,
      x: position.x,
      y: position.y,
      width: bounds.width,
      height: bounds.height,
    };
  };

  const drag = (event: PointerEvent<HTMLButtonElement>) => {
    if (!dragOrigin.current) return;

    const origin = dragOrigin.current;
    const maxX = Math.max(8, window.innerWidth - origin.width - 8);
    const maxY = Math.max(8, window.innerHeight - origin.height - 8);
    setPosition({
      x: Math.min(maxX, Math.max(8, origin.x + event.clientX - origin.pointerX)),
      y: Math.min(maxY, Math.max(8, origin.y + event.clientY - origin.pointerY)),
    });
  };

  const stopDragging = () => {
    dragOrigin.current = null;
  };

  const signOut = async () => {
    setError(null);
    setSigningOut(true);

    try {
      const supabase = createClient();
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) throw signOutError;

      router.replace('/connexion');
      router.refresh();
    } catch (signOutError) {
      setError('La déconnexion a échoué. Veuillez réessayer.');
      console.error(signOutError);
      setSigningOut(false);
    }
  };

  return (
    <aside
      className="fixed z-50 w-[min(256px,calc(100vw-16px))] touch-pan-y"
      style={{ left: position.x, top: position.y }}
      aria-label={`Navigation ${role === 'admin' ? 'administrateur' : 'participant'}`}
    >
      {expanded && (
        <nav className="rounded-2xl border border-line bg-white p-2 shadow-[0_20px_50px_-24px_rgba(15,23,42,0.35)]">
          <p className="px-3 pb-2 pt-1 text-[11px] font-bold uppercase tracking-[0.14em] text-mute">
            {role === 'admin' ? 'Administration' : 'Espace participant'}
          </p>
          <div className="flex flex-col gap-1">
            {sidebarItems[role].map((item) => {
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={[
                    'flex min-h-12 items-center gap-3 rounded-xl px-3.5 text-sm font-semibold transition-colors',
                    active
                      ? 'bg-green text-white shadow-sm'
                      : 'text-ink hover:bg-green-pale hover:text-green-dark',
                  ].join(' ')}
                >
                  <SidebarIconView icon={item.icon} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="mt-2 border-t border-line pt-2">
            <p className="truncate px-3 py-2 text-xs font-medium text-mute" title={userName}>
              {userName}
            </p>
            <button
              type="button"
              onClick={signOut}
              disabled={signingOut}
              className="flex min-h-10 w-full items-center gap-3 rounded-xl px-3.5 text-sm font-semibold text-ink transition-colors hover:bg-soft disabled:opacity-50"
            >
              <svg
                className="h-5 w-5 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M10 17l5-5-5-5m5 5H3m9-9h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5" />
              </svg>
              {signingOut ? 'Déconnexion…' : 'Déconnexion'}
            </button>
            {error && (
              <p className="px-3 py-2 text-xs text-red" role="alert">
                {error}
              </p>
            )}
          </div>
        </nav>
      )}

      <div className="mt-2 flex h-[52px] items-center gap-2 rounded-2xl border border-line bg-white px-2 shadow-[0_16px_38px_-22px_rgba(15,23,42,0.4)]">
        <button
          type="button"
          onPointerDown={startDragging}
          onPointerMove={drag}
          onPointerUp={stopDragging}
          onPointerCancel={stopDragging}
          className="flex h-9 w-7 shrink-0 cursor-grab touch-none items-center justify-center rounded-lg text-mute hover:bg-soft active:cursor-grabbing"
          aria-label="Déplacer le menu"
          title="Faire glisser pour déplacer le menu"
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 16 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <circle cx="5" cy="5" r="1.5" />
            <circle cx="11" cy="5" r="1.5" />
            <circle cx="5" cy="12" r="1.5" />
            <circle cx="11" cy="12" r="1.5" />
            <circle cx="5" cy="19" r="1.5" />
            <circle cx="11" cy="19" r="1.5" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
          className="flex min-w-0 flex-1 items-center gap-2.5 rounded-xl py-1 text-left text-sm font-bold text-ink"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green text-white">
            <SidebarIconView icon="dashboard" />
          </span>
          <span className="flex-1">Menu</span>
          <svg
            className={`mr-1 h-4 w-4 text-mute transition-transform ${expanded ? 'rotate-180' : ''}`}
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
          >
            <path d="m5 7.5 5 5 5-5" />
          </svg>
        </button>
      </div>
    </aside>
  );
}
