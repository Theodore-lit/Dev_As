import { createClient } from '@/src/utils/supabase/server';
import { connection } from 'next/server';
import { ParticipantList } from '@/src/components/participants/participant-list';
import { ErrorState } from '@/src/components/ui/error-state';


// export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Participants – Question pour un DevAs',
  description: 'Découvrez les candidats et participants de Question pour un DevAs.',
};

export default async function ParticipantsPage() {
  try {
    await connection();
    const supabase = await createClient();

    // Latest edition
    const { data: edition, error: editionError } = await supabase
      .from('editions')
      .select('*')
      .order('annee', { ascending: false })
      .limit(1)
      .single();

    if (editionError || !edition) {
      return (
        <div className="py-20">
          <div className="wrap">
            <ErrorState title="Aucune édition" message="Aucune édition trouvée." />
          </div>
        </div>
      );
    }

    // All candidatures for this edition
    const { data: candidatures } = await supabase
      .from('candidatures')
      .select('id, nom, prenom, email, etablissement, classe_niveau, statut, created_at')
      .eq('edition_id', edition.id)
      .order('created_at', { ascending: false });

    // Confirmed participants (candidature_id links back to candidatures)
    const { data: participants } = await supabase
      .from('participants')
      .select('id, candidature_id, nom, prenom, numero, statut, etablissement, classe_niveau')
      .eq('edition_id', edition.id)
      .order('numero', { ascending: true });

    // Build a Set of candidature_ids that are already participants
    const participantCandidatureIds = (participants ?? [])
      .map((p) => p.candidature_id)
      .filter((id): id is string => id !== null);

    return (
      <>
        {/* Hero */}
        <div className="bg-soft border-b border-line py-14">
          <div className="wrap">
            <span className="eyebrow">Édition {edition.annee}</span>
            <h1 className="mt-2 mb-3">Candidats &amp; Participants</h1>
            {edition.description && (
              <p className="mute max-w-[56ch]">{edition.description}</p>
            )}
            {/* Stats pills */}
            <div className="flex flex-wrap gap-4 mt-5">
              <div className="inline-flex items-center gap-2 bg-white border border-line rounded-xl px-4 py-2 text-sm">
                <span className="font-bold text-ink">{(candidatures ?? []).length}</span>
                <span className="text-mute">candidature(s)</span>
              </div>
              <div className="inline-flex items-center gap-2 bg-white border border-line rounded-xl px-4 py-2 text-sm">
                <span className="font-bold text-green-dark">{(participants ?? []).length}</span>
                <span className="text-mute">participant(s) confirmé(s)</span>
              </div>
            </div>
          </div>
        </div>

        {/* List */}
        <div className="py-12">
          <div className="wrap">
            <ParticipantList
              candidatures={candidatures ?? []}
              participants={participants ?? []}
              participantCandidatureIds={participantCandidatureIds}
            />
          </div>
        </div>
      </>
    );
  } catch (error) {
    console.error(error);
    return (
      <div className="py-20">
        <div className="wrap">
          <ErrorState title="Erreur" message="Impossible de charger les participants." />
        </div>
      </div>
    );
  }
}
