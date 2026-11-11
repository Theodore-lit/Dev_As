import Image from 'next/image';
import type { Database } from '@/src/types/database';

type Participant = Database['public']['Tables']['participants']['Row'];
type ClassementFinal = Database['public']['Tables']['classements_finaux']['Row'];

interface PodiumData {
  rang: number;
  participant: Participant;
  titre?: string;
}

interface PodiumProps {
  podium: PodiumData[];
}

const medalEmojis: Record<number, string> = {
  1: '🥇',
  2: '🥈',
  3: '🥉',
};

export function Podium({ podium }: PodiumProps) {
  // Guard: podium may be undefined/null
  if (!podium || podium.length === 0) {
    return <p className="text-center text-mute py-10">Aucun champion enregistré pour cette édition.</p>;
  }
  // Sort by rang (1, 2, 3) and arrange 2, 1, 3 for visual layout
  const sorted = [...podium].sort((a, b) => a.rang - b.rang);
  const arranged = [sorted[1], sorted[0], sorted[2]].filter(Boolean);

  return (
    <div style={{ paddingBlock: '48px' }}>
      <h2 style={{ fontSize: 'clamp(1.4rem,3vw,1.9rem)', fontWeight: '700', textAlign: 'center', marginBottom: '48px' }}>
        🏆 Podium 🏆
      </h2>

      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '24px', flexWrap: 'wrap' }}>
        {/* 2nd Place */}
        {arranged[0] && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ marginBottom: '16px' }}>
              {arranged[0].participant.photo_path ? (
                <div style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', border: '4px solid #aab1ba' }}>
                  <Image
                    src={arranged[0].participant.photo_path}
                    alt={`${arranged[0].participant.prenom} ${arranged[0].participant.nom}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(to bottom right, #a0a9b3, #788490)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '4px solid #aab1ba' }}>
                  <span style={{ fontSize: '1.8rem', color: '#fff' }}>
                    {arranged[0].participant.prenom[0]}
                    {arranged[0].participant.nom[0]}
                  </span>
                </div>
              )}
            </div>

            <div style={{ textAlign: 'center', marginBottom: '16px', width: '100%' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>🥈</div>
              <p style={{ fontWeight: '600', color: 'var(--ink)', marginBottom: '4px' }}>
                {arranged[0].participant.prenom} {arranged[0].participant.nom}
              </p>
              <p style={{ fontSize: '.85rem', color: 'var(--mute)' }}>
                N°{arranged[0].participant.numero}
              </p>
            </div>

            <div style={{ width: '80px', height: '96px', background: '#a0a9b3', borderRadius: '8px 8px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '1.4rem', fontWeight: '700', color: '#fff' }}>2ème</span>
            </div>
          </div>
        )}

        {/* 1st Place (Champion) */}
        {arranged[1] && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', transform: 'scale(1.1)' }}>
            <div style={{ marginBottom: '16px' }}>
              {arranged[1].participant.photo_path ? (
                <div style={{ position: 'relative', width: '112px', height: '112px', borderRadius: '50%', overflow: 'hidden', border: '4px solid #e8c547', boxShadow: '0 10px 30px rgba(31,41,55,.12)' }}>
                  <Image
                    src={arranged[1].participant.photo_path}
                    alt={`${arranged[1].participant.prenom} ${arranged[1].participant.nom}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div style={{ width: '112px', height: '112px', borderRadius: '50%', background: 'linear-gradient(to bottom right, var(--green), var(--orange))', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '4px solid #e8c547', boxShadow: '0 10px 30px rgba(31,41,55,.12)' }}>
                  <span style={{ fontSize: '3rem', color: '#fff' }}>
                    {arranged[1].participant.prenom[0]}
                    {arranged[1].participant.nom[0]}
                  </span>
                </div>
              )}
            </div>

            <div style={{ textAlign: 'center', marginBottom: '16px', width: '100%' }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🥇</div>
              <p style={{ fontWeight: '700', color: 'var(--ink)', fontSize: '1.05rem', marginBottom: '4px' }}>
                {arranged[1].participant.prenom} {arranged[1].participant.nom}
              </p>
              <p style={{ fontSize: '.85rem', color: 'var(--mute)' }}>
                N°{arranged[1].participant.numero}
              </p>
              <span className="bd gold" style={{ display: 'inline-block', marginTop: '8px' }}>Champion</span>
            </div>

            <div style={{ width: '112px', height: '160px', background: 'var(--green)', borderRadius: '8px 8px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '1.6rem', fontWeight: '700', color: '#fff' }}>1er</span>
            </div>
          </div>
        )}

        {/* 3rd Place */}
        {arranged[2] && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ marginBottom: '16px' }}>
              {arranged[2].participant.photo_path ? (
                <div style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', border: '4px solid #d97706' }}>
                  <Image
                    src={arranged[2].participant.photo_path}
                    alt={`${arranged[2].participant.prenom} ${arranged[2].participant.nom}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(to bottom right, #f97316, #d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '4px solid #d97706' }}>
                  <span style={{ fontSize: '1.8rem', color: '#fff' }}>
                    {arranged[2].participant.prenom[0]}
                    {arranged[2].participant.nom[0]}
                  </span>
                </div>
              )}
            </div>

            <div style={{ textAlign: 'center', marginBottom: '16px', width: '100%' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>🥉</div>
              <p style={{ fontWeight: '600', color: 'var(--ink)', marginBottom: '4px' }}>
                {arranged[2].participant.prenom} {arranged[2].participant.nom}
              </p>
              <p style={{ fontSize: '.85rem', color: 'var(--mute)' }}>
                N°{arranged[2].participant.numero}
              </p>
            </div>

            <div style={{ width: '80px', height: '64px', background: '#fed7aa', borderRadius: '8px 8px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '1.4rem', fontWeight: '700', color: '#d97706' }}>3ème</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
