import { createClient } from '@/src/utils/supabase/server';
import { redirect } from 'next/navigation';
import { ParticipantMatches } from '@/src/components/dashboard/participant/participant-matches';
import { Card } from '@/src/components/ui/card';
import { StatsCard } from '@/src/components/dashboard/stats-card';
import { Badge } from '@/src/components/ui/badge';


export const instant = false;

export default async function ParticipantDashboard() {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user?.id) {
    redirect('/connexion');
  }

  // Fetch participant
  const { data: participant } = await supabase
    .from('participants')
    .select('*')
    .eq('profil_id', session.user.id)
    .single();

  if (!participant) {
    return (
      <div style={{ textAlign: 'center', paddingBlock: '48px', color: 'var(--mute)' }}>
        <p>
          Vous n'êtes pas enregistré en tant que participant pour cette édition.
        </p>
      </div>
    );
  }

  // Fetch edition
  const { data: edition } = await supabase
    .from('editions')
    .select('*')
    .eq('id', participant.edition_id)
    .single();

  // Fetch matches and results
  const { data: phases } = await supabase
    .from('phases')
    .select('id')
    .eq('edition_id', participant.edition_id);

  let matchsData: any[] = [];
  if (phases && phases.length > 0) {
    const phaseIds = phases.map((p) => p.id);
    const { data: matchs } = await supabase
      .from('matchs')
      .select('*')
      .in('phase_id', phaseIds);
    matchsData = matchs || [];
  }

  // Fetch results for this participant
  const { data: results } = await supabase
    .from('resultats')
    .select('*')
    .eq('participant_id', participant.id);

  // Map matches with results
  const matchesWithResults = matchsData.map((match) => {
    const result = results?.find((r) => r.match_id === match.id);
    return { match, resultat: result };
  });

  const statusColors: Record<typeof participant.statut, string> = {
    en_attente: 'wait',
    en_competition: 'ok',
    elimine: 'no',
    finaliste: 'ok',
    champion: 'gold',
  };

  const statusLabels: Record<typeof participant.statut, string> = {
    en_attente: 'En attente',
    en_competition: 'En compétition',
    elimine: 'Éliminé',
    finaliste: 'Finaliste',
    champion: 'Champion',
  };

  return (
    <div className="stack" style={{ marginBottom: '32px' }}>
      {/* Page Title */}
      <div>
        <h1>Bienvenue, {participant.prenom}!</h1>
        <p className="mute">
          {edition?.nom} - Édition {edition?.annee}
        </p>
      </div>

      {/* Status Cards */}
      <div className="grid c3">
        <div className="card">
          <div style={{ paddingBottom: '16px', borderBottom: '1px solid var(--line)', marginBottom: '12px' }}>
            <span className={`bd ${statusColors[participant.statut]}`}>
              {statusLabels[participant.statut]}
            </span>
          </div>
          <div className="kpi">
            <span style={{ fontSize: '.8rem', fontWeight: '600' }}>Statut</span>
          </div>
        </div>

        <div className="card">
          <div className="kpi">
            <b className="fig">#{participant.numero}</b>
            <span>Numéro</span>
          </div>
        </div>

        <div className="card">
          <div className="kpi">
            <b style={{ fontWeight: '600', fontSize: '1rem' }}>
              {participant.classe_niveau}
            </b>
            <span>{participant.etablissement}</span>
          </div>
        </div>
      </div>

      {/* Matches */}
      <div className="card">
        <h2 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '24px' }}>
          Mes matchs
        </h2>
        {matchesWithResults.length > 0 ? (
          <ParticipantMatches matches={matchesWithResults} />
        ) : (
          <p style={{ textAlign: 'center', color: 'var(--mute)', paddingBlock: '32px' }}>
            Aucun match pour le moment
          </p>
        )}
      </div>

      {/* Personal Info Card */}
      <div className="card">
        <h2 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '16px' }}>
          Mes informations
        </h2>
        <div className="kv">
          <dt>Email</dt>
          <dd>{participant.email}</dd>

          {participant.telephone && (
            <>
              <dt>Téléphone</dt>
              <dd>{participant.telephone}</dd>
            </>
          )}

          {participant.date_naissance && (
            <>
              <dt>Date de naissance</dt>
              <dd>
                {new Date(participant.date_naissance).toLocaleDateString('fr-FR')}
              </dd>
            </>
          )}

          {participant.sexe && (
            <>
              <dt>Sexe</dt>
              <dd>
                {participant.sexe === 'M' ? 'Homme' : 'Femme'}
              </dd>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
