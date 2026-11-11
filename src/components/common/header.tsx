'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BrandLogo } from './brand-logo';
import { Button } from '../ui/button';

interface HeaderProps {
  role?: 'public' | 'participant' | 'admin';
  userName?: string;
  onLogout?: () => void;
}

export function Header({ role = 'public', userName, onLogout }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = {
    public: [
      { label: 'Accueil', href: '/' },
      { label: 'Éditions', href: '/editions' },
      { label: 'Participants', href: '/participants' },
      { label: 'Résultats', href: '/resultats' },
      { label: 'Palmares', href: '/palmares' },
    ],
    participant: [
      { label: 'Tableau de bord', href: '/participant/dashboard' },
      { label: 'Profil', href: '/participant/profil' },
      { label: 'Parcours', href: '/participant/parcours' },
      { label: 'Statistiques', href: '/participant/statistiques' },
    ],
    admin: [
      { label: 'Tableau de bord', href: '/admin/dashboard' },
      { label: 'Éditions', href: '/admin/editions' },
      { label: 'Candidatures', href: '/admin/candidatures' },
      { label: 'Participants', href: '/admin/participants' },
      { label: 'Résultats', href: '/admin/resultats' },
    ],
  };

  const links = navLinks[role];

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <BrandLogo size="md" href="/" />

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-700 hover:text-brand-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth Section */}
          <div className="flex items-center gap-4">
            {userName ? (
              <>
                <span className="text-sm text-gray-600">{userName}</span>
                {onLogout && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onLogout}
                  >
                    Déconnexion
                  </Button>
                )}
              </>
            ) : (
              role === 'public' && (
                <Button asChild size="sm">
                  <Link href="/connexion">Connexion</Link>
                </Button>
              )
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 space-y-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-2 py-2 text-sm text-gray-700 hover:bg-brand-light-green rounded transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
