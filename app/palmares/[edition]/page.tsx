import { notFound } from 'next/navigation';
import { createClient } from '@/src/utils/supabase/server';
import { Podium } from '@/src/components/palmares/podium';
import { RankingTable } from '@/src/components/palmares/ranking-table';
import { ErrorState } from '@/src/components/ui/error-state';
import { Card } from '@/src/components/ui/card';

export const instant = false;

interface PalmaresDetailPageProps {
  params: {
    edition: string;
  };
}

export async function generateMetadata({ params }: PalmaresDetailPageProps) {
  try {
    const supabase = await createClient();
    const { data: edition } = await supabase
      .from('editions')
      .select('*')
      .eq('id', params.edition)
      .single();

    if (!edition) {
      return {
        title: 'Édition non trouvée',
      };
    }

    return {
      title: `Palmares ${edition.annee} - Question pour un DevAs`,
      description: `Classement final de l'édition ${edition.annee}`,
    };
  } catch {
    return {
      title: 'Palmares - Question pour un DevAs',
    };
  }
}

export default async function PalmaresDetailPage({
  params,
}: PalmaresDetailPageProps) {
  try {
    const supabase = await createClient();

    // Fetch edition
    const { data: edition, error: editionError } = await supabase
      .from('editions')
      .select('*')
      .eq('id', params.edition)
      .single();

    if (editionError || !edition) {
      notFound();
    }

    // Get ranking (classements_finaux with participants)
    const { data: classements, error: classementsError } = await supabase
      .from('classements_finaux')
      .select(
        `
        id,
        rang,
        titre,
        participants:participant_id(*)
      `,
      )
      .eq('edition_id', edition.id)
      .order('rang', { ascending: true });

    if (classementsError) {
      throw classementsError;
    }

    // Transform data
    const podium = classements
      ?.filter((c) => c.rang <= 3)
      .map((c) => ({
        rang: c.rang,
        participant: (Array.isArray(c.participants) ? c.participants[0] : c.participants) as any,
        titre: c.titre ?? undefined,
      })) || [];

    const ranking = classements
      ?.map((c) => ({
        rang: c.rang,
        participant: (Array.isArray(c.participants) ? c.participants[0] : c.participants) as any,
        titre: c.titre ?? undefined,
      })) || [];

    if (ranking.length === 0) {
      notFound();
    }

    return (
      <div className="bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Palmares
            </h1>
            <p className="text-lg text-gray-600">
              Édition {edition.annee}
            </p>
          </div>

          {/* Podium */}
          {podium.length >= 3 && (
            <div className="mb-16 bg-gradient-to-b from-gray-50 to-white rounded-lg p-8">
              <Podium podium={podium} />
            </div>
          )}

          {/* Edition Info */}
          {edition.description && (
            <Card className="p-6 mb-12 border-l-4 border-l-vert">
              <p className="text-gray-700">{edition.description}</p>
            </Card>
          )}

          {/* Full Ranking */}
          {ranking.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Classement complet
              </h2>
              <Card className="overflow-hidden">
                <RankingTable entries={ranking} editionId={edition.id} />
              </Card>
            </div>
          )}

          {/* Edition Stats */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <p className="text-sm font-medium text-gray-600 mb-2">
                Édition
              </p>
              <p className="text-3xl font-bold text-vert">{edition.annee}</p>
            </Card>

            <Card className="p-6">
              <p className="text-sm font-medium text-gray-600 mb-2">
                Total participants
              </p>
              <p className="text-3xl font-bold text-vert">{ranking.length}</p>
            </Card>

            <Card className="p-6">
              <p className="text-sm font-medium text-gray-600 mb-2">
                Statut
              </p>
              <p className="text-lg font-semibold text-vert">Terminée</p>
            </Card>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching palmares:', error);
    return (
      <div className="bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <ErrorState
            title="Erreur lors du chargement"
            message="Une erreur s'est produite lors du chargement du palmares."
          />
        </div>
      </div>
    );
  }
}
