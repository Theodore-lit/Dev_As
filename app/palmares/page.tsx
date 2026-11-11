import { createClient } from '@/src/utils/supabase/server';
import { Podium } from '@/src/components/palmares/podium';
import { ErrorState } from '@/src/components/ui/error-state';


export const instant = false;

export const metadata = {
  title: 'Palmares - Question pour un DevAs',
  description: 'Découvrez les résultats et classements de Question pour un DevAs',
};

export default async function PalmaresPage() {
  try {
    const supabase = await createClient();

    // Get latest edition
    const { data: edition, error: editionError } = await supabase
      .from('editions')
      .select('*')
      .eq('statut', 'terminee')
      .order('annee', { ascending: false })
      .limit(1)
      .single();

    if (editionError || !edition) {
      return (
        <section className="s">
          <div className="wrap">
            <ErrorState
              title="Aucun palmares disponible"
              message="Il n'y a pas de palmares disponible pour le moment."
            />
          </div>
        </section>
      );
    }

    return (
      <section className="s">
        <div className="wrap stack">
          {/* Header */}
          <div className="sh">
            <div>
              <h1>Palmares</h1>
              <p className="mute">Édition {edition.annee}</p>
            </div>
          </div>

          {/* Podium */}
          <Podium editionId={edition.id} />
        </div>
      </section>
    );
  } catch (error) {
    console.error('Error fetching palmares:', error);
    return (
      <section className="s">
        <div className="wrap">
          <ErrorState
            title="Erreur lors du chargement"
            message="Une erreur s'est produite lors du chargement du palmares."
          />
        </div>
      </section>
    );
  }
}
