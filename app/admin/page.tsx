import { createClient } from '@/src/utils/supabase/server';
import { AdminStats } from '@/src/components/dashboard/admin/admin-stats';
import { EditionsTable } from '@/src/components/dashboard/admin/editions-table';
import { CandidaturesTable } from '@/src/components/dashboard/admin/candidatures-table';
import { Card } from '@/src/components/ui/card';


export const instant = false;

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Fetch stats
  const [
    { data: editions },
    { data: participants },
    { data: candidatures },
    { data: matchs },
  ] = await Promise.all([
    supabase.from('editions').select('*').order('annee', { ascending: false }),
    supabase.from('participants').select('*'),
    supabase
      .from('candidatures')
      .select('*, editions!edition_id(nom)')
      .order('created_at', { ascending: false })
      .limit(10),
    supabase.from('matchs').select('*'),
  ]);

  return (
    <div className="stack" style={{ marginBottom: '32px' }}>
      {/* Page Title */}
      <div>
        <h1>Tableau de bord administrateur</h1>
        <p className="mute">
          Gérez tous les aspects de la compétition depuis ce tableau de bord
        </p>
      </div>

      {/* Stats */}
      <AdminStats
        editionsCount={editions?.length || 0}
        candidaturesCount={candidatures?.length || 0}
        participantsCount={participants?.length || 0}
        matchsCount={matchs?.length || 0}
      />

      {/* Recent Candidatures */}
      <div className="card">
        <h2 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '16px' }}>
          Candidatures récentes
        </h2>
        {candidatures && candidatures.length > 0 ? (
          <div className="tw">
            <CandidaturesTable
              candidatures={candidatures.map((c) => ({
                ...c,
                edition_nom: Array.isArray(c.editions)
                  ? c.editions[0]?.nom
                  : c.editions?.nom,
              }))}
            />
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: 'var(--mute)', paddingBlock: '32px' }}>
            Aucune candidature pour le moment
          </p>
        )}
      </div>

      {/* Éditions */}
      <div className="card">
        <h2 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '16px' }}>
          Éditions
        </h2>
        {editions && editions.length > 0 ? (
          <div className="tw">
            <EditionsTable editions={editions} />
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: 'var(--mute)', paddingBlock: '32px' }}>
            Aucune édition pour le moment
          </p>
        )}
      </div>
    </div>
  );
}
