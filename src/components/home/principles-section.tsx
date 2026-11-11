import {
  ShieldCheckIcon,
  ChartBarIcon,
  SwordsIcon,
  TargetIcon,
  CrownIcon,
} from '@/src/components/common/icons';

export function PrinciplesSection() {
  const principles = [
    {
      title: 'Classement aux points',
      desc: 'Les participants sont classés avec précision selon leurs performances et les points obtenus au cours de chaque confrontation.',
      icon: ChartBarIcon,
    },
    {
      title: 'Élimination méritocratique',
      desc: 'À l’issue de chaque match, seuls les candidats occupant rigoureusement les positions qualificatives poursuivent l’aventure.',
      icon: SwordsIcon,
    },
    {
      title: 'Départage en cas d’égalité',
      desc: 'En cas d’égalité à une position décisive (qualification ou élimination), une série de questions de départage départage immédiatement les candidats.',
      icon: TargetIcon,
    },
    {
      title: 'Transparence & Équité',
      desc: 'Le barème, le fonctionnement des questions et les règles sont communiqués en amont. Dès les 16 qualifiés, tous concourent dans un classement général unique.',
      icon: ShieldCheckIcon,
    },
  ];

  return (
    <section className="py-16 md:py-20 bg-soft/50 border-y border-line">
      <div className="max-w-[1180px] mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Colonne gauche : Esprit et Enjeu */}
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-green-pale text-green-dark text-xs font-bold uppercase tracking-wider">
              <CrownIcon className="w-3.5 h-3.5 text-green-dark" />
              L’esprit & L’enjeu
            </div>

            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-ink leading-tight">
              30 candidats au départ.<br />
              14 matchs.<br />
              <span className="text-green-dark">Un seul </span>
              <span className="text-orange">DevChampion</span>.
            </h2>

            <p className="text-ink/80 text-sm sm:text-base leading-relaxed">
              Ce concours est bien plus qu’une simple succession de questions et de réponses. Il crée une véritable émulation intellectuelle, stimulant la curiosité, la rapidité et la réflexion tactique, tout en offrant au public un spectacle passionnant.
            </p>

            <div className="p-4 rounded-xl bg-white border border-line space-y-2">
              <div className="text-xs font-bold uppercase text-mute tracking-wider">
                L’ascension vers le titre :
              </div>
              <ul className="text-xs sm:text-sm text-ink/80 space-y-1.5 list-disc list-inside">
                <li>Sortir des groupes de qualification</li>
                <li>Saisir sa seconde chance au barrage</li>
                <li>Résister à la pression du classement général unique</li>
                <li>Triompher lors du duel ultime le jour du <strong>Team Building HIGHFIVE</strong></li>
              </ul>
            </div>
          </div>

          {/* Colonne droite : 4 Principes directeurs */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {principles.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.title}
                  className="p-5 rounded-2xl bg-white border border-line hover:border-green-light transition-all shadow-xs flex flex-col justify-start"
                >
                  <div className="w-10 h-10 rounded-xl bg-green-pale text-green-dark flex items-center justify-center mb-3 shrink-0">
                    <Icon className="w-5 h-5 text-green-dark" />
                  </div>
                  <h3 className="font-heading font-bold text-base text-ink mb-1.5">
                    {p.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-mute leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
