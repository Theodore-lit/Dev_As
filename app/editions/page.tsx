import { createClient } from '@/src/utils/supabase/server';
import { EditionList } from '@/src/components/editions/edition-list';
import { ErrorState } from '@/src/components/ui/error-state';


export const instant = false;

export const metadata = {
  title: 'Éditions - Question pour un DevAs',
  description: 'Découvrez toutes les éditions de Question pour un DevAs',
};

export default async function EditionsPage() {
  try {
    const supabase = await createClient();

    const { data: editions, error } = await supabase
      .from('editions')
      .select('*')
      .order('annee', { ascending: false });

    if (error) throw error;

    return (
      <section className="s">
        <div className="wrap">
          {/* Header */}
          <div className="sh">
            <div>
              <h1>Éditions de Question pour un DevAs</h1>
              <p className="mute">
                Retrouvez toutes les éditions précédentes et consultez les résultats, les participants et les classements.
              </p>
            </div>
          </div>

          {/* Content */}
          {editions && editions.length > 0 ? (
            <EditionList editions={editions} />
          ) : (
            <ErrorState
              title="Aucune édition disponible"
              message="Il n'y a pas d'éditions disponibles pour le moment. Veuillez revenir plus tard."
            />
          )}
        </div>
      </section>
    );
  } catch (error) {
    console.error('Error fetching editions:', error);
    return (
      <ErrorState
        title="Erreur lors du chargement"
        message="Une erreur s'est produite lors du chargement des éditions. Veuillez réessayer."
      />
    );
  }
}
