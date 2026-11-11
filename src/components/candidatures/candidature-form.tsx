'use client';

import { useState } from 'react';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Card } from '@/src/components/ui/card';
import { LoadingSpinner } from '@/src/components/ui/loading-spinner';
import { submitCandidature } from '@/src/actions/candidatures';
import { candidatureSchema } from '@/src/lib/validators';
import type { Database } from '@/src/types/database';

type Edition = Database['public']['Tables']['editions']['Row'];

interface CandidatureFormProps {
  edition: Edition;
}

interface FormErrors {
  [key: string]: string;
}

export function CandidatureForm({ edition }: CandidatureFormProps) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState(false);
  const [successData, setSuccessData] = useState<{ code: string; email: string } | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSuccess(false);

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
      formData.set('edition_id', edition.id);

      const result = await submitCandidature(formData);

      if (result.ok && result.data) {
        setSuccess(true);
        setSuccessData({
          code: result.data.code_suivi,
          email: formData.get('email') as string,
        });
        form.reset();
      } else {
        if (result.errors) {
          setErrors(result.errors);
        } else {
          setErrors({ global: result.error || 'Une erreur s\'est produite' });
        }
      }
    } catch (error) {
      setErrors({
        global: 'Une erreur inattendue s\'est produite',
      });
    } finally {
      setLoading(false);
    }
  }

  if (success && successData) {
    return (
      <Card className="p-8 bg-green-50 border-green-200">
        <div className="text-center">
          <div className="mb-4 text-5xl">✓</div>
          <h2 className="text-2xl font-bold text-green-900 mb-2">
            Candidature reçue !
          </h2>
          <p className="text-green-800 mb-6">
            Votre candidature a été enregistrée avec succès. Conservez votre code de suivi pour consulter l'état de votre candidature.
          </p>

          <div className="bg-white p-6 rounded-lg border border-green-200 mb-6">
            <p className="text-sm text-gray-600 mb-2">Code de suivi</p>
            <p className="text-2xl font-mono font-bold text-vert">{successData.code}</p>
            <p className="text-sm text-gray-600 mt-4">
              Un email de confirmation a été envoyé à <strong>{successData.email}</strong>
            </p>
          </div>

          <Button
            variant="primary"
            onClick={() => setSuccess(false)}
          >
            Soumettre une autre candidature
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Global Error */}
      {errors.global && (
        <Card className="p-4 bg-red-50 border-red-200">
          <p className="text-red-800">{errors.global}</p>
        </Card>
      )}

      {/* Identity */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold text-gray-900">
          Identité
        </legend>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            name="prenom"
            label="Prénom *"
            placeholder="Jean"
            required
            disabled={loading}
            error={errors.prenom}
          />
          <Input
            name="nom"
            label="Nom *"
            placeholder="Dupont"
            required
            disabled={loading}
            error={errors.nom}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            name="date_naissance"
            label="Date de naissance"
            type="date"
            disabled={loading}
            error={errors.date_naissance}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sexe
            </label>
            <select
              name="sexe"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-vert focus:border-vert"
              disabled={loading}
            >
              <option value="">-- Sélectionner --</option>
              <option value="M">Homme</option>
              <option value="F">Femme</option>
            </select>
          </div>
        </div>
      </fieldset>

      {/* Contact */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold text-gray-900">
          Contact
        </legend>

        <Input
          name="email"
          label="Email *"
          type="email"
          placeholder="jean@example.com"
          required
          disabled={loading}
          error={errors.email}
        />

        <Input
          name="telephone"
          label="Téléphone"
          type="tel"
          placeholder="+33 6 12 34 56 78"
          disabled={loading}
          error={errors.telephone}
        />
      </fieldset>

      {/* Education */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold text-gray-900">
          Formation
        </legend>

        <Input
          name="etablissement"
          label="Établissement *"
          placeholder="Lycée/Université/École"
          required
          disabled={loading}
          error={errors.etablissement}
        />

        <Input
          name="classe_niveau"
          label="Classe / Niveau *"
          placeholder="Terminale / L2 / 2ème année"
          required
          disabled={loading}
          error={errors.classe_niveau}
        />
      </fieldset>

      {/* Additional Info */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold text-gray-900">
          Informations supplémentaires
        </legend>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message libre
          </label>
          <textarea
            name="informations"
            placeholder="Parlez-nous de vous, de vos motivations, de votre parcours (500 caractères max)"
            maxLength={1000}
            rows={5}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-vert focus:border-vert font-sans"
            disabled={loading}
          />
          {errors.informations && (
            <p className="mt-1 text-sm text-red-600">{errors.informations}</p>
          )}
        </div>
      </fieldset>

      {/* Actions */}
      <div className="flex gap-4 pt-4">
        <Button
          type="submit"
          variant="primary"
          loading={loading}
          disabled={loading}
        >
          {loading ? <LoadingSpinner /> : 'Soumettre ma candidature'}
        </Button>
        <Button
          type="reset"
          variant="secondary"
          disabled={loading}
        >
          Réinitialiser
        </Button>
      </div>

      {/* Info Box */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <p className="text-sm text-blue-900">
          <strong>Note :</strong> Votre candidature sera examinée par notre jury. Vous recevrez un email de confirmation avec un code de suivi. Conservez ce code pour consulter l'état de votre candidature.
        </p>
      </Card>
    </form>
  );
}
