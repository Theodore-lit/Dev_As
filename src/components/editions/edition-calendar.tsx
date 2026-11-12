import { DownloadIcon } from '@/src/components/common/icons';
import type { Database } from '@/src/types/database';

export type EditionCalendarEntry =
  Database['public']['Tables']['edition_calendrier']['Row'];

function getDate(value: string) {
  return new Date(/^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T12:00:00Z` : value);
}

export function formatEditionDate(
  value: string,
  options: Intl.DateTimeFormatOptions = {},
) {
  return getDate(value).toLocaleDateString('fr-FR', {
    ...options,
    timeZone: 'Africa/Porto-Novo',
  });
}

export function formatScheduleDate(value: string) {
  return formatEditionDate(value, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

function formatMilestoneDate(entry: EditionCalendarEntry) {
  if (!entry.repere_date_fin) {
    return formatEditionDate(entry.date_match, {
      day: 'numeric',
      month: 'short',
    });
  }

  const startMonth = formatEditionDate(entry.date_match, { month: 'short' });
  const endMonth = formatEditionDate(entry.repere_date_fin, { month: 'short' });
  const startDay = formatEditionDate(entry.date_match, { day: 'numeric' });
  const endDay = formatEditionDate(entry.repere_date_fin, { day: 'numeric' });

  return startMonth === endMonth
    ? `${startDay}–${endDay} ${endMonth}`
    : `${startDay} ${startMonth} – ${endDay} ${endMonth}`;
}

export function CalendarMilestones({
  entries,
  className = '',
}: {
  entries: EditionCalendarEntry[];
  className?: string;
}) {
  const milestones = entries.filter((entry) => entry.repere);

  if (milestones.length === 0) {
    return null;
  }

  return (
    <div className={`grid grid-cols-2 gap-2 sm:grid-cols-3 ${className}`}>
      {milestones.map((entry, index) => (
        <div
          key={entry.id}
          className={`rounded-2xl border p-3 ${
            index === milestones.length - 1
              ? 'border-orange/25 bg-orange-pale/60'
              : 'border-green/15 bg-green-pale/45'
          }`}
        >
          <p
            className={`font-display text-sm font-extrabold uppercase ${
              index === milestones.length - 1 ? 'text-orange-dark' : 'text-green-dark'
            }`}
          >
            {formatMilestoneDate(entry)}
          </p>
          <p className="mt-1 text-xs font-semibold leading-4 text-ink">{entry.repere}</p>
        </div>
      ))}
    </div>
  );
}

export function EditionCalendar({
  entries,
  variant = 'detail',
}: {
  entries: EditionCalendarEntry[];
  variant?: 'sidebar' | 'detail';
}) {
  const isSidebar = variant === 'sidebar';

  return (
    <section
      aria-labelledby="edition-calendar-title"
      className={`overflow-hidden rounded-3xl border border-line bg-white shadow-card ${
        isSidebar ? 'xl:sticky xl:top-24' : ''
      }`}
    >
      <div className="border-b border-line bg-gradient-to-r from-green-pale/70 via-white to-orange-pale/60 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-green-dark">
              {entries[0]
                ? `Calendrier officiel · édition ${entries[0].date_match.slice(0, 4)}`
                : 'Calendrier officiel'}
            </p>
            <h2
              id="edition-calendar-title"
              className="mt-1 font-display text-xl font-extrabold text-ink"
            >
              Les rendez-vous
            </h2>
          </div>
          <a
            href="/documents_officiels/Planning_officiel_DevChampion_2026.pdf"
            download="Planning_officiel_DevChampion_2026.pdf"
            aria-label="Télécharger le calendrier officiel de la compétition"
            title="Télécharger le calendrier officiel"
            className="inline-flex h-10 shrink-0 items-center gap-2 rounded-2xl border border-orange/25 bg-white px-3 text-xs font-bold text-orange-dark shadow-sm transition-colors hover:bg-orange-pale/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
          >
            <DownloadIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Calendrier PDF</span>
          </a>
        </div>
        <p className="mt-2 text-sm text-mute">
          {entries.length} matchs programmés · horaires locaux
        </p>
      </div>

      {entries.length > 0 ? (
        <ol
          className={`divide-y divide-line/70 ${
            isSidebar ? 'max-h-[min(68vh,720px)] overflow-y-auto' : 'grid sm:grid-cols-2'
          }`}
        >
          {entries.map((entry) => (
            <li
              key={entry.id}
              className={`flex gap-3 p-4 ${
                !isSidebar ? 'border-b border-line/70 last:border-b-0' : ''
              }`}
            >
              <span
                className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl text-xs font-extrabold ${
                  entry.intitule === 'Grande finale'
                    ? 'bg-orange-pale text-orange-dark'
                    : 'bg-green-pale text-green-dark'
                }`}
              >
                {String(entry.ordre).padStart(2, '0')}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <h3 className="font-bold leading-5 text-ink">{entry.intitule}</h3>
                  <time
                    className="text-xs font-bold capitalize text-green-dark"
                    dateTime={entry.date_match}
                  >
                    {formatScheduleDate(entry.date_match)}
                  </time>
                </div>
                <p className="mt-1 text-xs font-semibold text-orange-dark">{entry.horaire}</p>
                {entry.precision && (
                  <p className="mt-1 text-xs leading-5 text-mute">{entry.precision}</p>
                )}
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <p className="p-5 text-sm text-mute">
          Le calendrier de cette édition n’a pas encore été publié.
        </p>
      )}
    </section>
  );
}
