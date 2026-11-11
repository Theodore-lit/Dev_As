'use client';

import Link from 'next/link';
import type { Database } from '@/src/types/database';

type Candidature = Database['public']['Tables']['candidatures']['Row'];

interface EditionsTableProps {
  editions: Candidature[];
}

const statusColors: Record<Edition['statut'], string> = {
  preparation: 'wait',
  candidatures_ouvertes: 'ok',
  en_cours: 'ok',
  terminee: 'ok',
  archivee: 'no',
};

const statusLabels: Record<Edition['statut'], string> = {
  preparation: 'En préparation',
  candidatures_ouvertes: 'Candidatures ouvertes',
  en_cours: 'En cours',
  terminee: 'Terminée',
  archivee: 'Archivée',
};

export function EditionsTable({ editions }: EditionsTableProps) {
  return (
    <table>
      <thead>
        <tr>
          <th>Année</th>
          <th>Nom</th>
          <th className="r">Statut</th>
          <th>Dates</th>
          <th className="r">Candidatures</th>
        </tr>
      </thead>
      <tbody>
        {editions.map((edition) => (
          <tr key={edition.id}>
            <td>
              <Link
                href={`/editions/${edition.id}`}
                style={{ fontWeight: '700', color: 'var(--green-d)', textDecoration: 'none' }}
                onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
              >
                {edition.annee}
              </Link>
            </td>
            <td>{edition.nom}</td>
            <td className="r">
              <span className={`bd ${statusColors[edition.statut]}`}>
                {statusLabels[edition.statut]}
              </span>
            </td>
            <td style={{ fontSize: '.8rem' }}>
              {edition.date_debut && (
                <>
                  {new Date(edition.date_debut).toLocaleDateString('fr-FR')}
                  {edition.date_fin && ` - ${new Date(edition.date_fin).toLocaleDateString('fr-FR')}`}
                </>
              )}
            </td>
            <td className="r">
              {edition.candidatures_ouvertes ? '✓ Ouvertes' : '✗ Fermées'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
