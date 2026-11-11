'use client';

import { useState } from 'react';
import { submitCandidature } from '@/src/actions/candidatures';
import type { Database } from '@/src/types/database';

type Edition = Database['public']['Tables']['editions']['Row'];

interface CandidatureFormProps {
  edition: Edition;
}

interface FormErrors { [key: string]: string; }

const inputClass = "w-full h-11 px-3 border-[1.5px] border-[#cfd4da] rounded-[10px] bg-white text-sm text-ink focus:border-green focus:outline-none focus:ring-2 focus:ring-green/10 hover:border-[#aab1ba] transition-colors disabled:opacity-50";
const inputErrClass = "w-full h-11 px-3 border-[1.5px] border-red rounded-[10px] bg-white text-sm text-ink focus:outline-none disabled:opacity-50";
const labelClass = "block text-sm font-semibold text-ink mb-1.5";
const legendClass = "w-full text-sm font-bold font-heading text-ink pb-2.5 mb-4 border-b border-line";

export function CandidatureForm({ edition }: CandidatureFormProps) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState(false);
  const [successData, setSuccessData] = useState<{ code: string; email: string } | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
      formData.set('edition_id', edition.id);
      const result = await submitCandidature(formData);
      if (result.ok && result.data) {
        setSuccess(true);
        setSuccessData({ code: result.data.code_suivi, email: formData.get('email') as string });
        form.reset();
      } else {
        setErrors(result.errors ?? { global: result.error ?? 'Une erreur s\'est produite' });
      }
    } catch {
      setErrors({ global: 'Une erreur inattendue s\'est produite' });
    } finally {
      setLoading(false);
    }
  }

  /* ── Succès ── */
  if (success && successData) {
    return (
      <div className="text-center py-8" role="alert">
        <div className="w-16 h-16 rounded-full bg-green-pale text-green-dark text-3xl font-bold grid place-items-center mx-auto mb-5">✓</div>
        <h2 className="text-xl font-bold mb-2">Candidature reçue !</h2>
        <p className="text-mute text-sm mb-6">Votre candidature a été enregistrée avec succès. Conservez votre code de suivi.</p>
        <div className="bg-soft border border-line rounded-xl p-5 mb-6 text-left">
          <span className="block text-xs text-mute uppercase tracking-widest mb-2">Code de suivi</span>
          <span className="block text-2xl font-extrabold font-heading text-green-dark tracking-widest mb-3">{successData.code}</span>
          <span className="block text-xs text-mute">Un email a été envoyé à <strong>{successData.email}</strong></span>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 h-11 px-6 rounded-[10px] bg-green text-white font-semibold text-sm hover:bg-green-dark transition-colors"
          onClick={() => { setSuccess(false); setSuccessData(null); }}
        >
          Soumettre une autre candidature
        </button>
      </div>
    );
  }

  /* ── Formulaire ── */
  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-0">

      {/* Erreur globale */}
      {errors.global && (
        <div className="flex gap-2.5 items-start bg-red-pale border border-red/30 rounded-xl p-3.5 mb-5 text-sm text-red" role="alert">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          {errors.global}
        </div>
      )}

      {/* Identité */}
      <fieldset className="mb-7 border-0 p-0">
        <legend className={legendClass}>Identité</legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="cand-prenom" className={labelClass}>Prénom <span className="text-green" aria-hidden="true">*</span></label>
            <input id="cand-prenom" name="prenom" type="text" placeholder="Jean" required disabled={loading} className={errors.prenom ? inputErrClass : inputClass} />
            {errors.prenom && <p className="mt-1 text-xs text-red">{errors.prenom}</p>}
          </div>
          <div>
            <label htmlFor="cand-nom" className={labelClass}>Nom <span className="text-green" aria-hidden="true">*</span></label>
            <input id="cand-nom" name="nom" type="text" placeholder="Dupont" required disabled={loading} className={errors.nom ? inputErrClass : inputClass} />
            {errors.nom && <p className="mt-1 text-xs text-red">{errors.nom}</p>}
          </div>
        </div>
        <div>
          <label htmlFor="cand-sexe" className={labelClass}>Sexe</label>
          <select id="cand-sexe" name="sexe" disabled={loading} className={inputClass}>
            <option value="">— Sélectionner —</option>
            <option value="M">Homme</option>
            <option value="F">Femme</option>
          </select>
        </div>
      </fieldset>

      {/* Contact */}
      <fieldset className="mb-7 border-0 p-0">
        <legend className={legendClass}>Contact</legend>
        <div className="space-y-4">
          <div>
            <label htmlFor="cand-email" className={labelClass}>Email <span className="text-green" aria-hidden="true">*</span></label>
            <input id="cand-email" name="email" type="email" placeholder="jean@exemple.com" required disabled={loading} className={errors.email ? inputErrClass : inputClass} />
            {errors.email && <p className="mt-1 text-xs text-red">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="cand-telephone" className={labelClass}>Téléphone</label>
            <input id="cand-telephone" name="telephone" type="tel" placeholder="+229 01 00 00 00 00" disabled={loading} className={inputClass} />
          </div>
        </div>
      </fieldset>

      {/* Formation */}
      <fieldset className="mb-7 border-0 p-0">
        <legend className={legendClass}>Formation</legend>
        <div className="space-y-4">
          {/* Établissement fixe — invisible pour l'utilisateur */}
          <input type="hidden" name="etablissement" value="Highfive University" />
          <div>
            <label htmlFor="cand-classe" className={labelClass}>
              Promotion <span className="text-green" aria-hidden="true">*</span>
            </label>
            <select
              id="cand-classe"
              name="classe_niveau"
              required
              disabled={loading}
              className={errors.classe_niveau ? inputErrClass : inputClass}
              defaultValue=""
            >
              <option value="" disabled>— Sélectionner une promotion —</option>
              <option value="Promotion 1">Promotion 1</option>
              <option value="Promotion 2">Promotion 2</option>
              <option value="Promotion 3">Promotion 3</option>
              <option value="Promotion 4">Promotion 4</option>
              <option value="Promotion 5">Promotion 5</option>
              <option value="Promotion 6">Promotion 6</option>
              <option value="Promotion 7">Promotion 7</option>
            </select>
            {errors.classe_niveau && <p className="mt-1 text-xs text-red">{errors.classe_niveau}</p>}
          </div>
        </div>
      </fieldset>

      {/* Motivation */}
      {/* <fieldset className="mb-7 border-0 p-0">
        <legend className={legendClass}>
          Motivation <span className="text-xs font-normal text-mute">(optionnel)</span>
        </legend>
        <div>
          <label htmlFor="cand-info" className={labelClass}>Message libre</label>
          <textarea
            id="cand-info"
            name="informations"
            placeholder="Parlez-nous de vous, de vos motivations, de votre parcours…"
            maxLength={1000}
            rows={4}
            disabled={loading}
            className="w-full px-3 py-2.5 border-[1.5px] border-[#cfd4da] rounded-[10px] bg-white text-sm text-ink focus:border-green focus:outline-none focus:ring-2 focus:ring-green/10 hover:border-[#aab1ba] transition-colors resize-y disabled:opacity-50"
          />
        </div>
      </fieldset> */}

      {/* Note info */}
      <div className="flex gap-2.5 items-start bg-blue-50 border border-blue-200 rounded-xl p-3.5 text-sm text-blue-900 mb-6">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5 text-blue-500" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        <p>Votre candidature sera examinée par notre comité. Vous recevrez un code de suivi par email pour suivre l'avancement.</p>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={loading}
          aria-busy={loading}
          className="inline-flex items-center gap-2 h-11 px-6 rounded-[10px] bg-green text-white font-semibold text-sm hover:bg-green-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              Envoi en cours…
            </>
          ) : 'Soumettre ma candidature'}
        </button>
        <button
          type="reset"
          disabled={loading}
          className="inline-flex items-center h-11 px-6 rounded-[10px] bg-white text-green-dark font-semibold text-sm border-[1.5px] border-green hover:bg-green-pale transition-colors disabled:opacity-50"
        >
          Réinitialiser
        </button>
      </div>

    </form>
  );
}
