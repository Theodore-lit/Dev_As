'use client';

import Link from 'next/link';
import type { Database } from '@/src/types/database';

type Participant = Database['public']['Tables']['participants']['Row'];

interface RankingEntry {
  rang: number;
  participant: Participant;
  titre?: string;
  score?: number;
}

interface RankingTableProps {
  entries: RankingEntry[];
  editionId: string;
}

const medalEmojis: Record<number, string> = {
  1: '🥇',
  2: '🥈',
  3: '🥉',
};

export function RankingTable({ entries, editionId }: RankingTableProps) {
  return (
    <table>
      <thead>
        <tr>
          <th>Rang</th>
          <th>Participant</th>
          <th>Établissement</th>
          <th className="r">Titre</th>
        </tr>
      </thead>
      <tbody>
        {entries.map((entry, index) => (
          <tr key={entry.participant.id}>
            <td>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}>
                {medalEmojis[entry.rang] && (
                  <span style={{ fontSize: '1.1rem' }}>{medalEmojis[entry.rang]}</span>
                )}
                <span style={{ color: 'var(--green-d)' }}>{entry.rang}</span>
              </div>
            </td>

            <td style={{ minWidth: '0' }}>
              <Link
                href={`/participants/${entry.participant.id}`}
                style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}
                onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
              >
                <div style={{ fontWeight: '600', color: 'var(--ink)' }}>
                  {entry.participant.prenom} {entry.participant.nom}
                </div>
                <div className="xs mute">
                  N°{entry.participant.numero}
                </div>
              </Link>
            </td>

            <td>
              <div style={{ color: 'var(--ink)', fontWeight: '500' }}>
                {entry.participant.classe_niveau}
              </div>
              <div className="xs mute">
                {entry.participant.etablissement}
              </div>
            </td>

            <td className="r">
              {entry.titre && (
                <span className="bd gold">{entry.titre}</span>
              )}
              {entry.rang === 1 && !entry.titre && (
                <span className="bd gold">Champion</span>
              )}
              {entry.rang === 2 && !entry.titre && (
                <span className="bd ok">Vice-champion</span>
              )}
              {entry.rang === 3 && !entry.titre && (
                <span className="bd wait">Troisième</span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
