import { createClient } from '@/src/utils/supabase/server';
import { Podium } from '@/src/components/palmares/podium';
import { RankingTable } from '@/src/components/palmares/ranking-table';
import { ErrorState } from '@/src/components/ui/error-state';

export const metadata = {
  title: 'Palmares – Question pour un DevAs',
  description: 'Découvrez les champions de Question pour un DevAs.',
};

export default async function PalmaresPage() {
  try {
    const supabase = await createClient();

    // Dernière édition terminée
    const { data: edition, error: editionError } = await supabase
      .from('editions')
      .select('*')
      .eq('statut', 'terminee')
      .order('annee', { ascending: false })
      .limit(1)
      .single();

    if (editionError || !edition) {
      return (
        <div className="py-20">
          <div className="max-w-[1180px] mx-auto px-4">
            <ErrorState
              title="Aucun palmares disponible"
              message="Il n’y a pas encore de palmares disponible."
            />
          </div>
        </div>
      );
    }

    // Récupérer le classement final de l’édition
    const { data: classement } = await supabase
      .from('classements_finaux')
      .select('*, participant:participants(*)')
      .eq('edition_id', edition.id)
      .order('rang', { ascending: true })
      .limit(10);

    const podiumData = (classement ?? []).slice(0, 3).map((entry: any) => ({
      rang: entry.rang,
      participant: entry.participant,
      titre: entry.titre,
    }));

    const rankingData = (classement ?? []).map((entry: any) => ({
      rang: entry.rang,
      participant: entry.participant,
      titre: entry.titre,
    }));

    return (
      <>
        {/* Hero */}
        <div className="bg-soft border-b border-line py-14">
          <div className="max-w-[1180px] mx-auto px-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-green">Palmares</span>
            <h1 className="mt-2 mb-2">{"Édition "}{edition.annee}</h1>
            <p className="text-mute text-base">{edition.nom}</p>
          </div>
        </div>

        <div className="py-12">
          <div className="max-w-[1180px] mx-auto px-4 flex flex-col gap-12">
            {podiumData.length > 0 ? (
              <Podium podium={podiumData} />
            ) : (
              <p className="text-mute text-center py-10">
                {"Le classement final n’est pas encore disponible."}
              </p>
            )}

            {rankingData.length > 0 && (
              <div>
                <h2 className="text-lg font-bold mb-4">Classement complet</h2>
                <RankingTable entries={rankingData} editionId={edition.id} />
              </div>
            )}
          </div>
        </div>
      </>
    );
  } catch (err) {
    console.error(err);
    return (
      <div className="py-20">
        <div className="max-w-[1180px] mx-auto px-4">
          <ErrorState title="Erreur" message="Impossible de charger le palmares." />
        </div>
      </div>
    );
  }
}