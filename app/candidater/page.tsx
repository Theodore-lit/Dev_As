import { CandidatureForm } from '@/src/components/candidatures/candidature-form';

export const metadata = {
  title: 'Postuler - Question pour un DevAs',
  description: 'Déposez votre candidature pour Question pour un DevAs',
};

export default function CandidaterPage() {
  return (
    <section className="s">
      <div className="wrap">
        <div className="sh" style={{ maxWidth: '560px', margin: '0 auto' }}>
          <h1>Postuler</h1>
          <p className="mute">
            Remplissez le formulaire ci-dessous pour déposer votre candidature.
          </p>
        </div>

        <div style={{ maxWidth: '560px', margin: '32px auto' }}>
          <div className="card">
            <CandidatureForm />
          </div>
        </div>
      </div>
    </section>
  );
}
