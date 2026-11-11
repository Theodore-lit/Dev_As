import { Card } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/src/components/ui/button';
import type { Database } from '@/src/types/database';

type Participant = Database['public']['Tables']['participants']['Row'];

interface ParticipantDetailProps {
  participant: Participant;
  edition: { id: string; annee: number; nom: string };
  stats?: {
    matchsJoues: number;
    victories: number;
    scoreTotal: number;
  };
}

export function ParticipantDetail({
  participant,
  edition,
  stats,
}: ParticipantDetailProps) {
  const statusColors: Record<Participant['statut'], string> = {
    en_attente: 'bg-gray-100 text-gray-800',
    en_competition: 'bg-blue-100 text-blue-800',
    elimine: 'bg-red-100 text-red-800',
    finaliste: 'bg-purple-100 text-purple-800',
    champion: 'bg-green-100 text-green-800',
  };

  const statusLabels: Record<Participant['statut'], string> = {
    en_attente: 'En attente',
    en_competition: 'En compétition',
    elimine: 'Éliminé',
    finaliste: 'Finaliste',
    champion: 'Champion',
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Photo */}
        <div>
          {participant.photo_path ? (
            <div className="relative w-full aspect-square bg-gray-200 rounded-lg overflow-hidden">
              <Image
                src={participant.photo_path}
                alt={`${participant.prenom} ${participant.nom}`}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-full aspect-square bg-gradient-to-br from-vert to-orange rounded-lg flex items-center justify-center">
              <span className="text-8xl text-white">
                {participant.prenom[0]}
                {participant.nom[0]}
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="md:col-span-2 space-y-6">
          {/* Name & Status */}
          <div>
            <div className="flex items-start justify-between mb-2">
              <h1 className="text-4xl font-bold text-gray-900">
                {participant.prenom} {participant.nom}
              </h1>
              <Badge className={statusColors[participant.statut]}>
                {statusLabels[participant.statut]}
              </Badge>
            </div>
            <p className="text-xl text-gray-600">
              N°{participant.numero} • Édition {edition.annee}
            </p>
          </div>

          {/* Basic Info */}
          <Card className="p-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-gray-700 mb-1">Établissement</p>
                <p className="text-gray-900">{participant.etablissement}</p>
              </div>
              <div>
                <p className="font-medium text-gray-700 mb-1">Classe/Niveau</p>
                <p className="text-gray-900">{participant.classe_niveau}</p>
              </div>
              {participant.date_naissance && (
                <div>
                  <p className="font-medium text-gray-700 mb-1">Né(e) le</p>
                  <p className="text-gray-900">
                    {new Date(participant.date_naissance).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              )}
              {participant.sexe && (
                <div>
                  <p className="font-medium text-gray-700 mb-1">Sexe</p>
                  <p className="text-gray-900">
                    {participant.sexe === 'M' ? 'Homme' : 'Femme'}
                  </p>
                </div>
              )}
              <div>
                <p className="font-medium text-gray-700 mb-1">Email</p>
                <p className="text-gray-900">{participant.email}</p>
              </div>
              {participant.telephone && (
                <div>
                  <p className="font-medium text-gray-700 mb-1">Téléphone</p>
                  <p className="text-gray-900">{participant.telephone}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Matchs joués
                </p>
                <p className="text-2xl font-bold text-vert">{stats.matchsJoues}</p>
              </Card>
              <Card className="p-4">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Victoires
                </p>
                <p className="text-2xl font-bold text-vert">{stats.victories}</p>
              </Card>
              <Card className="p-4">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Score total
                </p>
                <p className="text-2xl font-bold text-vert">{stats.scoreTotal}</p>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Details Section */}
      {participant.elimine_en_phase_id && (
        <Card className="p-6 bg-red-50 border-red-200">
          <p className="text-red-900">
            <strong>Élimination :</strong> Cet participant a été éliminé au cours de la compétition.
          </p>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex gap-4">
        <Button variant="secondary" asChild>
          <Link href="/participants">Retour aux participants</Link>
        </Button>
      </div>
    </div>
  );
}
