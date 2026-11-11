import React from 'react';
import Link from 'next/link';

export function Footer() {
  const currentYear = 2026;

  return (
    <footer className="mt-auto border-t border-line bg-soft">
      <div className="mx-auto w-full max-w-[1180px] px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="font-semibold text-ink mb-4">
              Question pour un DevChampion
            </h3>
            <p className="text-sm text-mute">
              Une compétition intellectuelle de culture générale pour les
              jeunes talents.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-ink mb-4">Liens</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/editions"
                  className="text-mute hover:text-green-dark transition-colors"
                >
                  Éditions
                </Link>
              </li>
              <li>
                <Link
                  href="/participants"
                  className="text-mute hover:text-green-dark transition-colors"
                >
                  Participants
                </Link>
              </li>
              <li>
                <Link
                  href="/palmares"
                  className="text-mute hover:text-green-dark transition-colors"
                >
                  Palmarès
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-ink mb-4">Légal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="text-mute hover:text-green-dark transition-colors"
                >
                  Mentions légales
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-mute hover:text-green-dark transition-colors"
                >
                  Politique de confidentialité
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-line pt-6 text-center text-sm text-mute">
          <p>
            &copy; {currentYear} Question pour un DevAs. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
