import { createClient } from '@/src/utils/supabase/server';
import { ParticipantList } from '@/src/components/participants/participant-list';
import { ErrorState } from '@/src/components/ui/error-state';


export const instant = false;

export const metadata = {
  title: 'Participants - Question pour un DevAs',
  description: 'Découvrez les participants de Question pour un DevAs',
};

export default async function ParticipantsPage() {
  try {
    const supabase = await createClient();

    // Get the current/latest edition
    const { data: edition, error: editionError } = await supabase
      .from('editions')
      .select('*')
      .order('annee', { ascending: false })
      .limit(1)
      .single();

    if (editionError || !edition) {
      return (
        <section className="s">
          <div className="wrap">
            <ErrorState
              title="Aucune édition disponible"
              message="Il n'y a pas d'édition disponible pour afficher les participants."
            />
          </div>
        </section>
      );
    }

    // Get participants for this edition (only published)
    const { data: participants, error: participantsError } = await supabase
      .from('participants')
      .select('*')
      .eq('edition_id', edition.id)
      .eq('publie', true)
      .order('numero', { ascending: true });

    if (participantsError) {
      throw participantsError;
    }

    return (
      <section className="s alt">
        <div className="wrap stack">
          {/* Header */}
          <div className="sh">
            <div>
              <h2>Participants</h2>
              <p className="mute">Édition {edition.annee}</p>
            </div>
          </div>

          {/* Edition Info */}
          {edition.description && (
            <div className="card soft">
              <p>{edition.description}</p>
            </div>
          )}

          {/* Participants */}
          <ParticipantList
            participants={participants || []}
            editionId={edition.id}
          />
        </div>
      </section>
    );
  } catch (error) {
    console.error('Error fetching participants:', error);
    return (
      <section className="s">
        <div className="wrap">
          <ErrorState
            title="Erreur lors du chargement"
            message="Une erreur s'est produite lors du chargement des participants."
          />
        </div>
      </section>
    );
  }
}
