export const metadata = { title: 'Actualités – Question pour un DevAs' };

export default function ActualitesPage() {
  return (
    <div className="bg-soft min-h-screen">
      <div className="max-w-[1180px] mx-auto px-4 py-16">
        <span className="text-xs font-semibold uppercase tracking-widest text-green">Actualités</span>
        <h1 className="mt-2 mb-10">Dernières nouvelles</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { tag: "Candidatures", date: "2 octobre 2026", title: "Question pour un DevAs 2027 est ouverte", body: "Les candidatures pour la prochaine édition sont officiellement ouvertes. Déposez votre dossier avant la clôture." },
            { tag: "Résultats",    date: "15 oct. 2026",   title: "Session 3 : les résultats officiels publiés", body: "Retrouvez les scores et décisions du jury pour la troisième séance de qualification." },
            { tag: "Jury",          date: "20 oct. 2026",  title: "Un nouveau membre rejoint le jury", body: "L’organisation accueille un nouvel expert au sein du jury pour l’édition en cours." },
          ].map(({ tag, date, title, body }) => (
            <article key={title} className="bg-white rounded-2xl border border-line overflow-hidden">
              <div className="bg-green-pale h-36 flex items-center justify-center text-5xl">📰</div>
              <div className="p-5">
                <span className="inline-flex items-center h-6 px-2.5 rounded-full bg-green-pale text-green-dark text-xs font-semibold mb-2">{tag}</span>
                <p className="text-xs text-mute mb-1">{date}</p>
                <h3 className="font-bold mb-2">{title}</h3>
                <p className="text-sm text-mute">{body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}