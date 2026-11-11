import { notFound } from 'next/navigation';
import { createClient } from '@/src/utils/supabase/server';
import { MatchDetail } from '@/src/components/matchs/match-detail';
import { ErrorState } from '@/src/components/ui/error-state';

export const instant = false;

interface MatchDetailPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: MatchDetailPageProps) {
  try {
    const supabase = await createClient();
    const { data: match } = await supabase
      .from('matchs')
      .select('*')
      .eq('id', params.id)
      .single();

    if (!match) {
      return {
        title: 'Match non trouvé',
      };
    }

    return {
      title: `${match.libelle} - Question pour un DevAs`,
      description: match.libelle,
    };
  } catch {
    return {
      title: 'Match - Question pour un DevAs',
    };
  }
}

export default async function MatchDetailPage({
  params,
}: MatchDetailPageProps) {
  try {
    const supabase = await createClient();

    // Fetch match
    const { data: match, error: matchError } = await supabase
      .from('matchs')
      .select('*')
      .eq('id', params.id)
      .single();

    if (matchError || !match) {
      notFound();
    }

    // Fetch phase
    const { data: phase } = await supabase
      .from('phases')
      .select('*')
      .eq('id', match.phase_id)
      .single();

    if (!phase) {
      notFound();
    }

    // Fetch edition
    const { data: edition } = await supabase
      .from('editions')
      .select('*')
      .eq('id', phase.edition_id)
      .single();

    if (!edition) {
      notFound();
    }

    // Fetch resultats with participant info
    const { data: resultats } = await supabase
      .from('resultats')
      .select(
        `
        *,
        participants:participant_id(prenom, nom, numero)
      `,
      )
      .eq('match_id', match.id);

    const resultatDisplay = resultats?.map((r) => ({
      resultat: r,
      participant_nom: Array.isArray(r.participants)
        ? r.participants[0]?.nom
        : r.participants?.nom,
      participant_prenom: Array.isArray(r.participants)
        ? r.participants[0]?.prenom
        : r.participants?.prenom,
      participant_numero: Array.isArray(r.participants)
        ? r.participants[0]?.numero
        : r.participants?.numero,
    })) || [];

    return (
      <div className="bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <MatchDetail
            match={match}
            phase={phase}
            edition={{
              id: edition.id,
              annee: edition.annee,
              nom: edition.nom,
            }}
            resultats={resultatDisplay}
          />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching match:', error);
    return (
      <div className="bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <ErrorState
            title="Erreur lors du chargement"
            message="Une erreur s'est produite lors du chargement du match."
          />
        </div>
      </div>
    );
  }
}
