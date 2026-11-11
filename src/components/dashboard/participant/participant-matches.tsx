'use client';

import { Badge } from '@/src/components/ui/badge';
import { Card } from '@/src/components/ui/card';
import type { Database } from '@/src/types/database';

type Match = Database['public']['Tables']['matchs']['Row'];
type Resultat = Database['public']['Tables']['resultats']['Row'];

interface MatchDisplay {
  match: Match;
  resultat?: Resultat;
  opponent?: string;
}

interface ParticipantMatchesProps {
  matches: MatchDisplay[];
}

const statusColors: Record<Match['statut'], string> = {
  planifie: 'bg-gray-100 text-gray-800',
  en_cours: 'bg-blue-100 text-blue-800',
  termine: 'bg-orange-100 text-orange-800',
  valide: 'bg-green-100 text-green-800',
};

const statusLabels: Record<Match['statut'], string> = {
  planifie: 'Planifié',
  en_cours: 'En cours',
  termine: 'Terminé',
  valide: 'Validé',
};

const issueColors: Record<string, string> = {
  qualifie: 'bg-green-100 text-green-800',
  barrage: 'bg-yellow-100 text-yellow-800',
  elimine: 'bg-red-100 text-red-800',
  finaliste: 'bg-purple-100 text-purple-800',
  champion: 'bg-vert text-white',
};

export function ParticipantMatches({ matches }: ParticipantMatchesProps) {
  if (matches.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-center text-gray-600">Aucun match pour le moment.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {matches.map((m, index) => (
        <Card key={index} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            {/* Match Info */}
            <div>
              <p className="text-sm text-gray-600 mb-1">{m.match.libelle}</p>
              <p className="font-medium text-gray-900">
                {m.match.date_heure
                  ? new Date(m.match.date_heure).toLocaleDateString('fr-FR')
                  : 'Date TBD'}
              </p>
              {m.match.lieu && <p className="text-xs text-gray-500">{m.match.lieu}</p>}
            </div>

            {/* Result */}
            <div>
              {m.resultat ? (
                <>
                  <p className="text-sm text-gray-600 mb-1">Score</p>
                  <p className="text-xl font-bold text-vert">{m.resultat.score}</p>
                </>
              ) : (
                <p className="text-gray-500">-</p>
              )}
            </div>

            {/* Issue */}
            <div>
              {m.resultat?.issue ? (
                <>
                  <p className="text-sm text-gray-600 mb-1">Résultat</p>
                  <Badge className={issueColors[m.resultat.issue]}>
                    {m.resultat.issue === 'qualifie'
                      ? 'Qualifié'
                      : m.resultat.issue === 'elimine'
                        ? 'Éliminé'
                        : m.resultat.issue === 'barrage'
                          ? 'Barrage'
                          : m.resultat.issue === 'finaliste'
                            ? 'Finaliste'
                            : 'Champion'}
                  </Badge>
                </>
              ) : (
                <p className="text-gray-500">-</p>
              )}
            </div>

            {/* Status */}
            <div>
              <p className="text-sm text-gray-600 mb-1">Statut</p>
              <Badge className={statusColors[m.match.statut]}>
                {statusLabels[m.match.statut]}
              </Badge>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
