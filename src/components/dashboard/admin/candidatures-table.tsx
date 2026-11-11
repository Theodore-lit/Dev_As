'use client';

import Link from 'next/link';
import type { Database } from '@/src/types/database';

type Candidature = Database['public']['Tables']['candidatures']['Row'];

interface CandidaturesTableProps {
  candidatures: (Candidature & { edition_nom?: string })[];
}

const statusColors: Record<Candidature['statut'], string> = {
  en_attente: 'wait',
  acceptee: 'ok',
  refusee: 'no',
  liste_attente: 'ok',
};

const statusLabels: Record<Candidature['statut'], string> = {
  en_attente: 'En attente',
  acceptee: 'Acceptée',
  refusee: 'Refusée',
  liste_attente: 'Liste d\'attente',
};

export function CandidaturesTable({ candidatures }: CandidaturesTableProps) {
  return (
    <table>
      <thead>
        <tr>
          <th>Candidat</th>
          <th>Email</th>
          <th>Édition</th>
          <th className="r">Statut</th>
          <th>Code suivi</th>
        </tr>
      </thead>
      <tbody>
        {candidatures.map((cand) => (
          <tr key={cand.id}>
            <td>
              <div style={{ fontWeight: '500' }}>
                {cand.prenom} {cand.nom}
              </div>
            </td>
            <td>
              <a
                href={`mailto:${cand.email}`}
                style={{ color: 'var(--green-d)', textDecoration: 'none' }}
                onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
              >
                {cand.email}
              </a>
            </td>
            <td>{cand.edition_nom}</td>
            <td className="r">
              <span className={`bd ${statusColors[cand.statut]}`}>
                {statusLabels[cand.statut]}
              </span>
            </td>
            <td>
              <code style={{ fontSize: '.75rem', background: 'var(--soft)', padding: '4px 8px', borderRadius: 'var(--r)', fontFamily: 'monospace' }}>
                {cand.code_suivi}
              </code>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
