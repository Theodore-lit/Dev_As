'use client';

import { useRef, useState } from 'react';
import { CalendarIcon } from '@/src/components/common/icons';
import { formatScheduleDate, type EditionCalendarEntry } from './edition-calendar';
import { Badge } from '@/src/components/ui/badge';
import { Card } from '@/src/components/ui/card';
import type { Database } from '@/src/types/database';

type Phase = Database['public']['Tables']['phases']['Row'];

const PHASE_LABELS: Record<Phase['type'], string> = {
  qualification: 'Qualifications',
  barrage: 'Barrage',
  tour: 'Phase principale',
  demi_finale: 'Demi-finales',
  finale: 'Finale',
};

interface PhaseCalendarCardProps {
  phase: Phase;
  index: number;
  matches: EditionCalendarEntry[];
}

export function PhaseCalendarCard({ phase, index, matches }: PhaseCalendarCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const activePointer = useRef<string | null>(null);

  return (
    <div
      className="edition-phase-flip"
      tabIndex={0}
      role="group"
      aria-label={`${phase.nom}. Survolez ou placez le focus pour afficher son calendrier.`}
      onPointerDown={(event) => {
        activePointer.current = event.pointerType;
      }}
      onPointerEnter={(event) => {
        if (event.pointerType !== 'touch') setIsFlipped(true);
      }}
      onPointerLeave={(event) => {
        if (
          event.pointerType !== 'touch' &&
          !event.currentTarget.matches(':focus-within')
        ) {
          setIsFlipped(false);
        }
      }}
      onFocus={() => {
        if (activePointer.current !== 'touch') setIsFlipped(true);
      }}
      onBlur={(event) => {
        if (
          !(event.relatedTarget instanceof Node) ||
          !event.currentTarget.contains(event.relatedTarget)
        ) {
          if (!event.currentTarget.matches(':hover')) setIsFlipped(false);
        }
      }}
      onPointerUp={(event) => {
        if (event.pointerType === 'touch') {
          setIsFlipped((flipped) => !flipped);
        }
        activePointer.current = null;
      }}
    >
      <div className={`edition-phase-flip__inner${isFlipped ? ' is-flipped' : ''}`}>
        <div
          className="edition-phase-flip__face"
          aria-hidden={isFlipped}
          inert={isFlipped}
        >
          <Card className="relative flex h-full min-h-[310px] flex-col overflow-hidden rounded-3xl border-white/20 bg-white/10 p-5 text-white shadow-none backdrop-blur-md sm:p-6">
            <span
              className="pointer-events-none absolute -right-2 -top-8 select-none font-display text-[8rem] font-black leading-none text-white/[0.08]"
              aria-hidden="true"
            >
              {String(index + 1).padStart(2, '0')}
            </span>

            <div className="relative flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-white/70">
                <span className="h-2 w-2 rounded-full bg-orange" />
                Étape {String(index + 1).padStart(2, '0')}
              </span>
              <Badge
                variant="default"
                className="border border-white/20 bg-white/10 text-white"
              >
                {PHASE_LABELS[phase.type]}
              </Badge>
            </div>

            <div className="relative mt-8">
              <h3 className="font-display text-2xl font-extrabold leading-tight text-white sm:text-3xl">
                {phase.nom}
              </h3>
              <p className="mt-2 text-sm text-white/70">
                Phase {phase.ordre} de la compétition
              </p>
            </div>

            <div className="relative mt-auto grid grid-cols-2 gap-2 pt-8 text-sm">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-3">
                <p className="text-xs text-white/65">Groupes</p>
                <p className="mt-1 text-lg font-bold text-white">{phase.nb_groupes}</p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-3">
                <p className="text-xs text-white/65">Qualifiés / groupe</p>
                <p className="mt-1 text-lg font-bold text-white">
                  {phase.nb_qualifies_par_groupe}
                </p>
              </div>
              {phase.nb_barrage_par_groupe > 0 && (
                <div className="col-span-2 flex items-center justify-between gap-3 rounded-2xl border border-orange/30 bg-orange/15 px-3 py-2.5">
                  <span className="text-xs font-medium text-white/80">
                    Barrages par groupe
                  </span>
                  <span className="font-bold text-white">
                    {phase.nb_barrage_par_groupe}
                  </span>
                </div>
              )}
            </div>

            <span className="sr-only">Survolez pour afficher les matchs de cette phase.</span>
          </Card>
        </div>

        <div
          className="edition-phase-flip__face edition-phase-flip__back"
          aria-hidden={!isFlipped}
          inert={!isFlipped}
        >
          <Card className="flex h-full min-h-[310px] flex-col overflow-hidden rounded-3xl border-orange/30 bg-gradient-to-br from-white via-green-pale/30 to-orange-pale/70 p-5 text-ink shadow-none sm:p-6">
            <div className="flex items-start justify-between gap-3 border-b border-line/80 pb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-green-dark">
                  Étape {String(index + 1).padStart(2, '0')}
                </p>
                <h3 className="mt-1 font-display text-xl font-extrabold text-ink">
                  {phase.nom}
                </h3>
              </div>
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-orange-dark shadow-sm">
                <CalendarIcon className="h-5 w-5" />
              </span>
            </div>

            {matches.length > 0 ? (
              <ol className="mt-3 space-y-2 overflow-y-auto">
                {matches.map((match) => (
                  <li
                    key={match.id}
                    className="rounded-2xl border border-line/80 bg-white/90 p-3 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-bold leading-5 text-ink">{match.intitule}</p>
                      <span className="shrink-0 rounded-lg bg-green-pale px-2 py-1 text-xs font-extrabold text-green-dark">
                        {formatScheduleDate(match.date_match)}
                      </span>
                    </div>
                    <p className="mt-1 text-xs font-bold text-orange-dark">{match.horaire}</p>
                    {match.precision && (
                      <p className="mt-1 text-xs leading-4 text-mute">{match.precision}</p>
                    )}
                  </li>
                ))}
              </ol>
            ) : (
              <div className="mt-6 rounded-2xl border border-line bg-white/80 p-4">
                <p className="text-sm font-semibold text-ink">
                  Le calendrier des matchs de cette phase n’est pas encore publié.
                </p>
              </div>
            )}

            <p className="mt-auto pt-3 text-xs font-semibold text-green-dark">
              {matches.length} {matches.length === 1 ? 'match programmé' : 'matchs programmés'}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
