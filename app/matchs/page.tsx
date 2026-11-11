import { createClient } from '@/src/utils/supabase/server';
import { MatchList } from '@/src/components/matchs/match-list';
import { ErrorState } from '@/src/components/ui/error-state';


export const instant = false;

export const metadata = {
  title: 'Matchs - Question pour un DevAs',
  description: 'Consultez tous les matchs et résultats de Question pour un DevAs',
};

export default async function MatchsPage() {
  try {
    const supabase = await createClient();

    // Get all seances (matchs)
    const { data: seances, error } = await supabase
      .from('seances')
      .select('*')
      .order('date', { ascending: false });

    if (error) throw error;

    return (
      <section className="s alt">
        <div className="wrap stack">
          {/* Header */}
          <div className="sh">
            <div>
              <h1>Matchs et Résultats</h1>
              <p className="mute">
                Consultez tous les matchs, les scores et les résultats de chaque phase.
              </p>
            </div>
          </div>

          {/* Content */}
          {seances && seances.length > 0 ? (
            <MatchList seances={seances} />
          ) : (
            <ErrorState
              title="Aucun match disponible"
              message="Il n'y a pas de matchs disponibles pour le moment."
            />
          )}
        </div>
      </section>
    );
  } catch (error) {
    console.error('Error fetching matchs:', error);
    return (
      <section className="s">
        <div className="wrap">
          <ErrorState
            title="Erreur lors du chargement"
            message="Une erreur s'est produite lors du chargement des matchs."
          />
        </div>
      </section>
    );
  }
}
