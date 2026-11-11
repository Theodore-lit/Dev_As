'use client';

import { StatsCard } from '../stats-card';

interface AdminStatsProps {
  editionsCount: number;
  candidaturesCount: number;
  participantsCount: number;
  matchsCount: number;
}

export function AdminStats({
  editionsCount,
  candidaturesCount,
  participantsCount,
  matchsCount,
}: AdminStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatsCard label="Éditions" value={editionsCount} icon="📚" />
      <StatsCard label="Candidatures" value={candidaturesCount} icon="📝" />
      <StatsCard label="Participants" value={participantsCount} icon="👥" />
      <StatsCard label="Matchs" value={matchsCount} icon="⚔️" />
    </div>
  );
}
