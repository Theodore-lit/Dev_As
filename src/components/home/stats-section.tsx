import {
  UsersIcon,
  SwordsIcon,
  CoinsIcon,
  CrownIcon,
} from '@/src/components/common/icons';

interface StatsSectionProps {
  totalEditions: number;
}

export function StatsSection({ totalEditions = 4 }: StatsSectionProps) {
  const stats = [
    {
      value: '30',
      label: 'Candidats au départ',
      subtext: 'Répartis en 2 groupes de 15 pour débuter',
      icon: UsersIcon,
      accent: 'green',
    },
    {
      value: '14',
      label: 'Matchs officiels',
      subtext: '7 en qualification + 7 en phase principale',
      icon: SwordsIcon,
      accent: 'orange',
    },
    {
      value: '500 F',
      label: 'Frais de participation',
      subtext: 'Recette prévisionnelle de 15 000 FCFA',
      icon: CoinsIcon,
      accent: 'green',
    },
    {
      value: '1 Titre',
      label: 'Le DevChampion',
      subtext: 'Sacré lors du Team Building HIGHFIVE',
      icon: CrownIcon,
      accent: 'orange',
    },
  ];

  return (
    <section className="py-12 bg-white">
      <div className="max-w-[1180px] mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((s) => {
            const Icon = s.icon;
            const isGreen = s.accent === 'green';
            return (
              <div
                key={s.label}
                className="p-5 sm:p-6 rounded-2xl border border-line bg-soft/30 hover:bg-white hover:border-green-light transition-all flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isGreen ? 'bg-green-pale text-green-dark' : 'bg-orange-pale text-orange-dark'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[0.7rem] uppercase font-bold text-mute tracking-wider">
                    Format
                  </span>
                </div>

                <div>
                  <div
                    className={`font-heading font-extrabold text-2xl sm:text-3xl leading-none mb-1.5 ${
                      isGreen ? 'text-green-dark' : 'text-orange-dark'
                    }`}
                  >
                    {s.value}
                  </div>
                  <div className="font-bold text-ink text-sm sm:text-base leading-snug">
                    {s.label}
                  </div>
                  <p className="text-xs text-mute mt-1 leading-normal">
                    {s.subtext}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
