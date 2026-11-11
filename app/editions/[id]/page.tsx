import { notFound } from 'next/navigation';
import { createClient } from '@/src/utils/supabase/server';
import { EditionDetail } from '@/src/components/editions/edition-detail';
import { ErrorState } from '@/src/components/ui/error-state';

export const instant = false;

interface EditionDetailPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: EditionDetailPageProps) {
  try {
    const supabase = await createClient();
    const { data: edition } = await supabase
      .from('editions')
      .select('*')
      .eq('id', params.id)
      .single();

    if (!edition) {
      return {
        title: 'Édition non trouvée',
      };
    }

    return {
      title: `${edition.nom} - Question pour un DevAs`,
      description: edition.description || `Édition ${edition.annee}`,
    };
  } catch {
    return {
      title: 'Édition - Question pour un DevAs',
    };
  }
}

export default async function EditionDetailPage({
  params,
}: EditionDetailPageProps) {
  try {
    const supabase = await createClient();

    // Fetch edition
    const { data: edition, error: editionError } = await supabase
      .from('editions')
      .select('*')
      .eq('id', params.id)
      .single();

    if (editionError || !edition) {
      notFound();
    }

    // Fetch phases
    const { data: phases } = await supabase
      .from('phases')
      .select('*')
      .eq('edition_id', edition.id)
      .order('ordre', { ascending: true });

    // Fetch stats
    const { data: candidatures } = await supabase
      .from('candidatures')
      .select('id', { count: 'exact' })
      .eq('edition_id', edition.id);

    const { data: participants } = await supabase
      .from('participants')
      .select('id', { count: 'exact' })
      .eq('edition_id', edition.id);

    // Count matchs via phases
    let matchsCount = 0;
    if (phases && phases.length > 0) {
      for (const phase of phases) {
        const { data: phasesMatchs, count } = await supabase
          .from('matchs')
          .select('id', { count: 'exact' })
          .eq('phase_id', phase.id);
        matchsCount += count || 0;
      }
    }

    const stats = {
      candidatures: candidatures?.length || 0,
      participants: participants?.length || 0,
      matchs: matchsCount,
    };

    return (
      <div className="bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <EditionDetail
            edition={edition}
            phases={phases || []}
            stats={stats}
          />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching edition:', error);
    return (
      <div className="bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <ErrorState
            title="Erreur lors du chargement"
            message="Une erreur s'est produite lors du chargement de l'édition."
          />
        </div>
      </div>
    );
  }
}
