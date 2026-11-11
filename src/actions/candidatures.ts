'use server';

import { createClient } from '@/src/utils/supabase/server';
import { candidatureSchema } from '@/src/lib/validators';
import { z } from 'zod';
import { generateFollowUpCode } from '@/src/lib/helpers';

interface CandidatureResult {
  ok: boolean;
  data?: {
    id: string;
    code_suivi: string;
  };
  error?: string;
  errors?: Record<string, string>;
}

export async function submitCandidature(
  formData: FormData,
): Promise<CandidatureResult> {
  try {
    const supabase = await createClient();

    // Parse form data
    const data = {
      edition_id: formData.get('edition_id'),
      nom: formData.get('nom'),
      prenom: formData.get('prenom'),
      date_naissance: formData.get('date_naissance'),
      sexe: formData.get('sexe'),
      etablissement: formData.get('etablissement'),
      classe_niveau: formData.get('classe_niveau'),
      email: formData.get('email'),
      telephone: formData.get('telephone'),
      informations: formData.get('informations'),
    };

    // Validate
    const validationResult = candidatureSchema.safeParse(data);
    if (!validationResult.success) {
      const errors = validationResult.error.flatten().fieldErrors;
      return {
        ok: false,
        error: 'Erreur de validation',
        errors: Object.fromEntries(
          Object.entries(errors).map(([key, value]) => [
            key,
            value?.[0] || 'Erreur',
          ]),
        ),
      };
    }

    // Check if edition exists and accepts candidatures
    const { data: edition, error: editionError } = await supabase
      .from('editions')
      .select('candidatures_ouvertes')
      .eq('id', validationResult.data.edition_id)
      .single();

    if (editionError || !edition) {
      return {
        ok: false,
        error: "L'édition sélectionnée n'existe pas",
      };
    }

    if (!edition.candidatures_ouvertes) {
      return {
        ok: false,
        error: 'Les candidatures pour cette édition sont fermées',
      };
    }

    // Check if email already exists for this edition
    const { data: existing } = await supabase
      .from('candidatures')
      .select('id')
      .eq('edition_id', validationResult.data.edition_id)
      .eq('email', validationResult.data.email)
      .single();

    if (existing) {
      return {
        ok: false,
        error: 'Une candidature avec cet email existe déjà pour cette édition',
      };
    }

    // Generate follow-up code
    const codesuivi = generateFollowUpCode();

    // Insert candidature
    const { data: candidature, error: insertError } = await supabase
      .from('candidatures')
      .insert([
        {
          edition_id: validationResult.data.edition_id,
          nom: validationResult.data.nom,
          prenom: validationResult.data.prenom,
          date_naissance: validationResult.data.date_naissance
            ? validationResult.data.date_naissance.toISOString().split('T')[0]
            : null,
          sexe: validationResult.data.sexe || null,
          etablissement: validationResult.data.etablissement,
          classe_niveau: validationResult.data.classe_niveau,
          email: validationResult.data.email,
          telephone: validationResult.data.telephone || null,
          informations: validationResult.data.informations || null,
          code_suivi: codesuivi,
          statut: 'en_attente',
        },
      ])
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      return {
        ok: false,
        error: 'Erreur lors de la création de la candidature',
      };
    }

    return {
      ok: true,
      data: {
        id: candidature.id,
        code_suivi: candidature.code_suivi,
      },
    };
  } catch (error) {
    console.error('Submit candidature error:', error);
    return {
      ok: false,
      error: 'Une erreur interne s\'est produite',
    };
  }
}

export async function getCandidatureByCode(
  code: string,
): Promise<CandidatureResult> {
  try {
    const supabase = await createClient();

    const { data: candidature, error } = await supabase
      .from('candidatures')
      .select('*')
      .eq('code_suivi', code)
      .single();

    if (error || !candidature) {
      return {
        ok: false,
        error: 'Candidature non trouvée',
      };
    }

    return {
      ok: true,
      data: {
        id: candidature.id,
        code_suivi: candidature.code_suivi,
      },
    };
  } catch (error) {
    console.error('Get candidature error:', error);
    return {
      ok: false,
      error: 'Une erreur interne s\'est produite',
    };
  }
}
