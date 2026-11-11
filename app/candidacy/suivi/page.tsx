'use client';

import { useState } from 'react';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Card } from '@/src/components/ui/card';
import { createClient } from '@/src/utils/supabase/client';
import { Badge } from '@/src/components/ui/badge';

interface CandidatureStatus {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  statut: 'en_attente' | 'acceptee' | 'refusee' | 'liste_attente';
  edition_nom: string;
  edition_annee: number;
  traite_le: string | null | undefined;
  commentaire_interne: string | null | undefined;
}

const statusColors: Record<string, string> = {
  en_attente: 'bg-yellow-100 text-yellow-800',
  acceptee: 'bg-green-100 text-green-800',
  refusee: 'bg-red-100 text-red-800',
  liste_attente: 'bg-blue-100 text-blue-800',
};

const statusLabels: Record<string, string> = {
  en_attente: 'En attente',
  acceptee: 'Acceptée',
  refusee: 'Refusée',
  liste_attente: 'Liste d\'attente',
};

export default function SuiviPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [candidature, setCandidature] = useState<CandidatureStatus | null>(null);
  const [searchCode, setSearchCode] = useState('');

  async function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setCandidature(null);

    try {
      const supabase = createClient();
      const { data, error: queryError } = await supabase
        .from('candidatures')
        .select(
          `
          id,
          nom,
          prenom,
          email,
          statut,
          traite_le,
          commentaire_interne,
          editions:edition_id(nom, annee)
        `,
        )
        .eq('code_suivi', searchCode.toUpperCase())
        .single();

      if (queryError || !data) {
        setError('Code de suivi non trouvé. Veuillez vérifier votre code.');
        return;
      }

      const edition = Array.isArray(data.editions) ? data.editions[0] : data.editions;
      setCandidature({
        id: data.id,
        nom: data.nom,
        prenom: data.prenom,
        email: data.email,
        statut: data.statut,
        edition_nom: edition?.nom || 'Édition inconnue',
        edition_annee: edition?.annee || 0,
        traite_le: data.traite_le,
        commentaire_interne: data.commentaire_interne,
      });
    } catch (err) {
      setError('Une erreur s\'est produite. Veuillez réessayer.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Suivi de candidature
          </h1>
          <p className="text-lg text-gray-600">
            Entrez votre code de suivi pour connaître l'état de votre candidature
          </p>
        </div>

        {/* Search Form */}
        <Card className="p-8 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <Input
              name="code"
              label="Code de suivi *"
              placeholder="DVDS-XXXX-XXXX"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value.toUpperCase())}
              disabled={loading}
              required
              type="text"
            />

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              loading={loading}
              disabled={loading || !searchCode}
            >
              Rechercher
            </Button>
          </form>
        </Card>

        {/* Results */}
        {candidature && (
          <Card className="p-8">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {candidature.prenom} {candidature.nom}
                </h2>
                <Badge className={statusColors[candidature.statut]}>
                  {statusLabels[candidature.statut]}
                </Badge>
              </div>

              <div className="space-y-2 text-gray-600">
                <p>
                  <strong>Email :</strong> {candidature.email}
                </p>
                <p>
                  <strong>Édition :</strong> {candidature.edition_nom} ({candidature.edition_annee})
                </p>
                {candidature.traite_le && (
                  <p>
                    <strong>Traité le :</strong>{' '}
                    {new Date(candidature.traite_le).toLocaleDateString('fr-FR')}
                  </p>
                )}
              </div>
            </div>

            {/* Status Message */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              {candidature.statut === 'en_attente' && (
                <p className="text-blue-900">
                  Votre candidature est actuellement en attente d'examen par le jury. Nous vous informerons dès que possible.
                </p>
              )}
              {candidature.statut === 'acceptee' && (
                <p className="text-green-900">
                  Félicitations ! Votre candidature a été acceptée. Vous recevrez bientôt les informations pratiques pour la compétition.
                </p>
              )}
              {candidature.statut === 'refusee' && (
                <p className="text-red-900">
                  Malheureusement, votre candidature n'a pas été retenue cette année. N'hésitez pas à candidater à la prochaine édition.
                </p>
              )}
              {candidature.statut === 'liste_attente' && (
                <p className="text-yellow-900">
                  Votre candidature est en liste d'attente. Vous serez contacté si une place se libère.
                </p>
              )}
            </div>
          </Card>
        )}

        {/* Info Box */}
        {!candidature && !error && (
          <Card className="p-6 bg-blue-50 border-blue-200">
            <p className="text-sm text-blue-900">
              <strong>Conseil :</strong> Vous avez reçu votre code de suivi par email après avoir soumis votre candidature. Si vous l'avez perdu, veuillez consulter votre email ou contacter l'équipe organisatrice.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
