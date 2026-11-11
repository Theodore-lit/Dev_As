import React from 'react';
import Link from 'next/link';

export function Footer() {
  // Use a fixed year for consistency, or calculate at build time
  const currentYear = 2026;

  return (
    <footer className="border-t border-gray-200 bg-gray-50 mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="font-semibold text-neutral-dark mb-4">
              Question pour un DevAs
            </h3>
            <p className="text-sm text-gray-600">
              Une compétition intellectuelle de culture générale pour les
              jeunes talents.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-neutral-dark mb-4">Liens</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/editions"
                  className="text-gray-600 hover:text-brand-primary transition-colors"
                >
                  Éditions
                </Link>
              </li>
              <li>
                <Link
                  href="/participants"
                  className="text-gray-600 hover:text-brand-primary transition-colors"
                >
                  Participants
                </Link>
              </li>
              <li>
                <Link
                  href="/palmares"
                  className="text-gray-600 hover:text-brand-primary transition-colors"
                >
                  Palmarès
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-neutral-dark mb-4">Légal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-brand-primary transition-colors"
                >
                  Mentions légales
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-brand-primary transition-colors"
                >
                  Politique de confidentialité
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-200 pt-6 text-center text-sm text-gray-600">
          <p>
            &copy; {currentYear} Question pour un DevAs. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
