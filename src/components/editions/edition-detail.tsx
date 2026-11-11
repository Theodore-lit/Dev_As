import { Card } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/src/components/ui/button';
import type { Database } from '@/src/types/database';

type Edition = Database['public']['Tables']['editions']['Row'];
type Phase = Database['public']['Tables']['phases']['Row'];

interface EditionDetailProps {
  edition: Edition;
  phases: Phase[];
  stats?: {
    candidatures: number;
    participants: number;
    matchs: number;
  };
}

export function EditionDetail({ edition, phases, stats }: EditionDetailProps) {
  const statusColors: Record<Edition['statut'], string> = {
    preparation: 'bg-gray-100 text-gray-800',
    candidatures_ouvertes: 'bg-blue-100 text-blue-800',
    en_cours: 'bg-purple-100 text-purple-800',
    terminee: 'bg-green-100 text-green-800',
    archivee: 'bg-gray-100 text-gray-600',
  };

  const statusLabels: Record<Edition['statut'], string> = {
    preparation: 'En préparation',
    candidatures_ouvertes: 'Candidatures ouvertes',
    en_cours: 'En cours',
    terminee: 'Terminée',
    archivee: 'Archivée',
  };

  const typeLabels: Record<Phase['type'], string> = {
    qualification: 'Qualifications',
    barrage: 'Barrage',
    tour: 'Tour',
    demi_finale: 'Demi-finales',
    finale: 'Finale',
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{edition.nom}</h1>
          <p className="text-xl text-gray-600">Édition {edition.annee}</p>
        </div>
        <Badge className={statusColors[edition.statut]}>
          {statusLabels[edition.statut]}
        </Badge>
      </div>

      {/* Description */}
      {edition.description && (
        <Card className="p-6 bg-blue-50 border-blue-200">
          <p className="text-gray-700">{edition.description}</p>
        </Card>
      )}

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <p className="text-sm font-medium text-gray-600 mb-2">Candidatures</p>
            <p className="text-3xl font-bold text-vert">{stats.candidatures}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm font-medium text-gray-600 mb-2">Participants</p>
            <p className="text-3xl font-bold text-vert">{stats.participants}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm font-medium text-gray-600 mb-2">Matchs</p>
            <p className="text-3xl font-bold text-vert">{stats.matchs}</p>
          </Card>
        </div>
      )}

      {/* Dates */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Dates importantes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {edition.date_debut && (
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Début</p>
              <p className="text-lg text-gray-900">
                {new Date(edition.date_debut || '').toLocaleDateString('fr-FR', {
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
          {edition.date_fin && (
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Fin</p>
              <p className="text-lg text-gray-900">
                {new Date(edition.date_fin || '').toLocaleDateString('fr-FR', {
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
        </div>
      </Card>

      {/* Phases */}
      {phases.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Phases de compétition</h2>
          <div className="space-y-4">
            {phases.map((phase) => (
              <div
                key={phase.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{phase.nom}</h3>
                    <p className="text-sm text-gray-600">{typeLabels[phase.type]}</p>
                  </div>
                  <Badge className="bg-gray-100 text-gray-800">Phase {phase.ordre}</Badge>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm text-gray-600 mt-4">
                  <div>
                    <p className="font-medium text-gray-700">Groupes</p>
                    <p>{phase.nb_groupes}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Qualifiés/groupe</p>
                    <p>{phase.nb_qualifies_par_groupe}</p>
                  </div>
                  {phase.nb_barrage_par_groupe > 0 && (
                    <div>
                      <p className="font-medium text-gray-700">Barrages/groupe</p>
                      <p>{phase.nb_barrage_par_groupe}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Info Box */}
      <Card className="p-6 bg-gray-50">
        <h3 className="font-semibold text-gray-900 mb-3">Informations</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p>
            <strong>Score maximum :</strong> {edition.score_max_defaut} points
          </p>
          <p>
            <strong>Candidatures :</strong>{' '}
            {edition.candidatures_ouvertes ? '✓ Ouvertes' : '✗ Fermées'}
          </p>
          <p>
            <strong>Créée le :</strong>{' '}
            {new Date(edition.created_at || '').toLocaleDateString('fr-FR')}
          </p>
        </div>
      </Card>

      {/* Navigation */}
      <div className="flex gap-4">
        {edition.statut === 'terminee' && (
          <Button variant="primary" asChild>
            <Link href={`/palmares/${edition.id}`}>Voir le palmares</Link>
          </Button>
        )}
        <Button variant="secondary" asChild>
          <Link href="/editions">Retour aux éditions</Link>
        </Button>
      </div>
    </div>
  );
}
