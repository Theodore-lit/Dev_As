import { Card } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/src/components/ui/button';
import type { Database } from '@/src/types/database';

type Match = Database['public']['Tables']['matchs']['Row'];
type Phase = Database['public']['Tables']['phases']['Row'];
type Resultat = Database['public']['Tables']['resultats']['Row'];

interface ResultatDisplay {
  resultat: Resultat;
  participant_nom: string;
  participant_prenom: string;
  participant_numero: number;
}

interface MatchDetailProps {
  match: Match;
  phase: Phase;
  edition: { id: string; annee: number; nom: string };
  resultats: ResultatDisplay[];
}

export function MatchDetail({
  match,
  phase,
  edition,
  resultats,
}: MatchDetailProps) {
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

  const typeLabels: Record<Phase['type'], string> = {
    qualification: 'Qualifications',
    barrage: 'Barrage',
    tour: 'Tour',
    demi_finale: 'Demi-finale',
    finale: 'Finale',
  };

  const issueColors: Record<string, string> = {
    qualifie: 'bg-green-100 text-green-800',
    barrage: 'bg-yellow-100 text-yellow-800',
    elimine: 'bg-red-100 text-red-800',
    finaliste: 'bg-purple-100 text-purple-800',
    champion: 'bg-vert text-white',
  };

  const issueLabels: Record<string, string> = {
    qualifie: 'Qualifié',
    barrage: 'Barrage',
    elimine: 'Éliminé',
    finaliste: 'Finaliste',
    champion: 'Champion',
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {match.libelle}
            </h1>
            <p className="text-xl text-gray-600">
              {typeLabels[phase.type]} • Phase {phase.ordre}
            </p>
          </div>
          <Badge className={statusColors[match.statut]}>
            {statusLabels[match.statut]}
          </Badge>
        </div>
      </div>

      {/* Match Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Informations
          </h2>

          <div className="space-y-4 text-sm">
            {match.date_heure && (
              <div>
                <p className="font-medium text-gray-700 mb-1">Date et heure</p>
                <p className="text-gray-900">
                  {new Date(match.date_heure).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            )}

            {match.lieu && (
              <div>
                <p className="font-medium text-gray-700 mb-1">Lieu</p>
                <p className="text-gray-900">{match.lieu}</p>
              </div>
            )}

            {match.groupe && (
              <div>
                <p className="font-medium text-gray-700 mb-1">Groupe</p>
                <p className="text-gray-900">Groupe {match.groupe}</p>
              </div>
            )}

            {/* {match.score_max && (
              <div>
                <p className="font-medium text-gray-700 mb-1">Score maximum</p>
                <p className="text-gray-900">{match.score_max}</p>
              </div>
            )} */}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Édition
          </h2>

          <div className="space-y-4 text-sm">
            <div>
              <p className="font-medium text-gray-700 mb-1">Nom</p>
              <p className="text-gray-900">{edition.nom}</p>
            </div>
            <div>
              <p className="font-medium text-gray-700 mb-1">Année</p>
              <p className="text-gray-900">{edition.annee}</p>
            </div>
            <div>
              <p className="font-medium text-gray-700 mb-1">Phase</p>
              <p className="text-gray-900">
                {typeLabels[phase.type]} (Phase {phase.ordre})
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Resultats */}
      {resultats.length > 0 && (
        <Card className="p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Résultats ({resultats.length} participant{resultats.length > 1 ? 's' : ''})
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Participant
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">
                    Rang
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">
                    Score
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">
                    Résultat
                  </th>
                </tr>
              </thead>
              <tbody>
                {resultats
                  .sort((a, b) => (a.resultat.rang || 999) - (b.resultat.rang || 999))
                  .map((r, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">
                        <Link
                          href={`/participants/${r.resultat.participant_id}`}
                          className="text-vert hover:underline font-medium"
                        >
                          {r.participant_prenom} {r.participant_nom}
                        </Link>
                        <div className="text-xs text-gray-500">
                          N°{r.participant_numero}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-gray-900">
                        {r.resultat.rang || '-'}
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-vert">
                        {r.resultat.score || '-'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {r.resultat.issue ? (
                          <Badge className={issueColors[r.resultat.issue]}>
                            {issueLabels[r.resultat.issue]}
                          </Badge>
                        ) : (
                          '-'
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Validation Info */}
      {match.statut === 'valide' && match.valide_par && (
        <Card className="p-6 bg-green-50 border-green-200">
          <p className="text-green-900">
            <strong>Match validé</strong> par un administrateur le{' '}
            {match.valide_le &&
              new Date(match.valide_le).toLocaleDateString('fr-FR')}
          </p>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex gap-4">
        <Button variant="secondary" asChild>
          <Link href="/matchs">Retour aux matchs</Link>
        </Button>
      </div>
    </div>
  );
}
