export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      actualites: {
        Row: {
          auteur_id: string
          categorie: string | null
          contenu: string
          created_at: string | null
          id: string
          image_path: string | null
          publie_le: string | null
          resume: string | null
          statut: Database["public"]["Enums"]["statut_publication"]
          titre: string
          updated_at: string | null
        }
        Insert: {
          auteur_id: string
          categorie?: string | null
          contenu: string
          created_at?: string | null
          id?: string
          image_path?: string | null
          publie_le?: string | null
          resume?: string | null
          statut?: Database["public"]["Enums"]["statut_publication"]
          titre: string
          updated_at?: string | null
        }
        Update: {
          auteur_id?: string
          categorie?: string | null
          contenu?: string
          created_at?: string | null
          id?: string
          image_path?: string | null
          publie_le?: string | null
          resume?: string | null
          statut?: Database["public"]["Enums"]["statut_publication"]
          titre?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "actualites_auteur_id_fkey"
            columns: ["auteur_id"]
            isOneToOne: false
            referencedRelation: "profils"
            referencedColumns: ["id"]
          },
        ]
      }
      annonces: {
        Row: {
          auteur_id: string
          categorie: string | null
          cible: Database["public"]["Enums"]["cible_annonce"]
          contenu: string
          created_at: string | null
          edition_id: string
          id: string
          publie_le: string | null
          statut: Database["public"]["Enums"]["statut_publication"]
          titre: string
          updated_at: string | null
        }
        Insert: {
          auteur_id: string
          categorie?: string | null
          cible: Database["public"]["Enums"]["cible_annonce"]
          contenu: string
          created_at?: string | null
          edition_id: string
          id?: string
          publie_le?: string | null
          statut?: Database["public"]["Enums"]["statut_publication"]
          titre: string
          updated_at?: string | null
        }
        Update: {
          auteur_id?: string
          categorie?: string | null
          cible?: Database["public"]["Enums"]["cible_annonce"]
          contenu?: string
          created_at?: string | null
          edition_id?: string
          id?: string
          publie_le?: string | null
          statut?: Database["public"]["Enums"]["statut_publication"]
          titre?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "annonces_auteur_id_fkey"
            columns: ["auteur_id"]
            isOneToOne: false
            referencedRelation: "profils"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "annonces_edition_id_fkey"
            columns: ["edition_id"]
            isOneToOne: false
            referencedRelation: "editions"
            referencedColumns: ["id"]
          },
        ]
      }
      candidatures: {
        Row: {
          classe_niveau: string
          code_suivi: string
          commentaire_interne: string | null
          created_at: string | null
          date_naissance: string | null
          edition_id: string
          email: string
          etablissement: string
          id: string
          informations: string | null
          nom: string
          photo_path: string | null
          prenom: string
          sexe: string | null
          statut: Database["public"]["Enums"]["statut_candidatura"]
          telephone: string | null
          traite_le: string | null
          traite_par: string | null
          updated_at: string | null
        }
        Insert: {
          classe_niveau: string
          code_suivi: string
          commentaire_interne?: string | null
          created_at?: string | null
          date_naissance?: string | null
          edition_id: string
          email: string
          etablissement: string
          id?: string
          informations?: string | null
          nom: string
          photo_path?: string | null
          prenom: string
          sexe?: string | null
          statut?: Database["public"]["Enums"]["statut_candidatura"]
          telephone?: string | null
          traite_le?: string | null
          traite_par?: string | null
          updated_at?: string | null
        }
        Update: {
          classe_niveau?: string
          code_suivi?: string
          commentaire_interne?: string | null
          created_at?: string | null
          date_naissance?: string | null
          edition_id?: string
          email?: string
          etablissement?: string
          id?: string
          informations?: string | null
          nom?: string
          photo_path?: string | null
          prenom?: string
          sexe?: string | null
          statut?: Database["public"]["Enums"]["statut_candidatura"]
          telephone?: string | null
          traite_le?: string | null
          traite_par?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "candidatures_edition_id_fkey"
            columns: ["edition_id"]
            isOneToOne: false
            referencedRelation: "editions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "candidatures_traite_par_fkey"
            columns: ["traite_par"]
            isOneToOne: false
            referencedRelation: "profils"
            referencedColumns: ["id"]
          },
        ]
      }
      classements_finaux: {
        Row: {
          created_at: string | null
          edition_id: string
          id: string
          participant_id: string
          rang: number
          titre: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          edition_id: string
          id?: string
          participant_id: string
          rang: number
          titre?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          edition_id?: string
          id?: string
          participant_id?: string
          rang?: number
          titre?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "classements_finaux_edition_id_fkey"
            columns: ["edition_id"]
            isOneToOne: false
            referencedRelation: "editions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "classements_finaux_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "classements_finaux_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "v_participants_publics"
            referencedColumns: ["id"]
          },
        ]
      }
      editions: {
        Row: {
          annee: number
          candidatures_ouvertes: boolean
          created_at: string | null
          date_debut: string | null
          date_fin: string | null
          description: string | null
          id: string
          nom: string
          score_max_defaut: number
          statut: Database["public"]["Enums"]["statut_edition"]
          updated_at: string | null
        }
        Insert: {
          annee: number
          candidatures_ouvertes?: boolean
          created_at?: string | null
          date_debut?: string | null
          date_fin?: string | null
          description?: string | null
          id?: string
          nom: string
          score_max_defaut?: number
          statut?: Database["public"]["Enums"]["statut_edition"]
          updated_at?: string | null
        }
        Update: {
          annee?: number
          candidatures_ouvertes?: boolean
          created_at?: string | null
          date_debut?: string | null
          date_fin?: string | null
          description?: string | null
          id?: string
          nom?: string
          score_max_defaut?: number
          statut?: Database["public"]["Enums"]["statut_edition"]
          updated_at?: string | null
        }
        Relationships: []
      }
      journal_activite: {
        Row: {
          action: string
          anciennes_valeurs: Json | null
          created_at: string | null
          enregistrement_id: string | null
          id: string
          motif: string | null
          nouvelles_valeurs: Json | null
          profil_id: string | null
          table_cible: string
        }
        Insert: {
          action: string
          anciennes_valeurs?: Json | null
          created_at?: string | null
          enregistrement_id?: string | null
          id?: string
          motif?: string | null
          nouvelles_valeurs?: Json | null
          profil_id?: string | null
          table_cible: string
        }
        Update: {
          action?: string
          anciennes_valeurs?: Json | null
          created_at?: string | null
          enregistrement_id?: string | null
          id?: string
          motif?: string | null
          nouvelles_valeurs?: Json | null
          profil_id?: string | null
          table_cible?: string
        }
        Relationships: [
          {
            foreignKeyName: "journal_activite_profil_id_fkey"
            columns: ["profil_id"]
            isOneToOne: false
            referencedRelation: "profils"
            referencedColumns: ["id"]
          },
        ]
      }
      jury_membres: {
        Row: {
          created_at: string | null
          etablissement: string
          fonction: string
          id: string
          nom: string
          prenom: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          etablissement: string
          fonction: string
          id?: string
          nom: string
          prenom: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          etablissement?: string
          fonction?: string
          id?: string
          nom?: string
          prenom?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      match_jury: {
        Row: {
          jury_membre_id: string
          match_id: string
        }
        Insert: {
          jury_membre_id: string
          match_id: string
        }
        Update: {
          jury_membre_id?: string
          match_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "match_jury_jury_membre_id_fkey"
            columns: ["jury_membre_id"]
            isOneToOne: false
            referencedRelation: "jury_membres"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_jury_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matchs"
            referencedColumns: ["id"]
          },
        ]
      }
      matchs: {
        Row: {
          created_at: string | null
          date_heure: string | null
          deverrouille_le: string | null
          groupe: number | null
          id: string
          libelle: string
          lieu: string | null
          phase_id: string
          score_max: number
          statut: Database["public"]["Enums"]["statut_match"]
          updated_at: string | null
          valide_le: string | null
          valide_par: string | null
        }
        Insert: {
          created_at?: string | null
          date_heure?: string | null
          deverrouille_le?: string | null
          groupe?: number | null
          id?: string
          libelle: string
          lieu?: string | null
          phase_id: string
          score_max: number
          statut?: Database["public"]["Enums"]["statut_match"]
          updated_at?: string | null
          valide_le?: string | null
          valide_par?: string | null
        }
        Update: {
          created_at?: string | null
          date_heure?: string | null
          deverrouille_le?: string | null
          groupe?: number | null
          id?: string
          libelle?: string
          lieu?: string | null
          phase_id?: string
          score_max?: number
          statut?: Database["public"]["Enums"]["statut_match"]
          updated_at?: string | null
          valide_le?: string | null
          valide_par?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "matchs_phase_id_fkey"
            columns: ["phase_id"]
            isOneToOne: false
            referencedRelation: "phases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matchs_valide_par_fkey"
            columns: ["valide_par"]
            isOneToOne: false
            referencedRelation: "profils"
            referencedColumns: ["id"]
          },
        ]
      }
      modeles_phases: {
        Row: {
          created_at: string | null
          id: string
          nb_barrage_par_groupe: number
          nb_groupes: number
          nb_qualifies_par_groupe: number
          nom: string
          ordre: number
          type: Database["public"]["Enums"]["type_phase"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          nb_barrage_par_groupe?: number
          nb_groupes?: number
          nb_qualifies_par_groupe?: number
          nom: string
          ordre: number
          type: Database["public"]["Enums"]["type_phase"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          nb_barrage_par_groupe?: number
          nb_groupes?: number
          nb_qualifies_par_groupe?: number
          nom?: string
          ordre?: number
          type?: Database["public"]["Enums"]["type_phase"]
          updated_at?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          annonce_id: string | null
          created_at: string | null
          id: string
          lue: boolean
          message: string
          profil_id: string
          updated_at: string | null
        }
        Insert: {
          annonce_id?: string | null
          created_at?: string | null
          id?: string
          lue?: boolean
          message: string
          profil_id: string
          updated_at?: string | null
        }
        Update: {
          annonce_id?: string | null
          created_at?: string | null
          id?: string
          lue?: boolean
          message?: string
          profil_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_annonce_id_fkey"
            columns: ["annonce_id"]
            isOneToOne: false
            referencedRelation: "annonces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_profil_id_fkey"
            columns: ["profil_id"]
            isOneToOne: false
            referencedRelation: "profils"
            referencedColumns: ["id"]
          },
        ]
      }
      participants: {
        Row: {
          candidature_id: string | null
          classe_niveau: string
          created_at: string | null
          date_naissance: string | null
          edition_id: string
          elimine_en_phase_id: string | null
          email: string
          etablissement: string
          id: string
          nom: string
          numero: number
          photo_path: string | null
          prenom: string
          profil_id: string | null
          publie: boolean
          sexe: string | null
          statut: Database["public"]["Enums"]["statut_participant"]
          telephone: string | null
          updated_at: string | null
        }
        Insert: {
          candidature_id?: string | null
          classe_niveau: string
          created_at?: string | null
          date_naissance?: string | null
          edition_id: string
          elimine_en_phase_id?: string | null
          email: string
          etablissement: string
          id?: string
          nom: string
          numero: number
          photo_path?: string | null
          prenom: string
          profil_id?: string | null
          publie?: boolean
          sexe?: string | null
          statut?: Database["public"]["Enums"]["statut_participant"]
          telephone?: string | null
          updated_at?: string | null
        }
        Update: {
          candidature_id?: string | null
          classe_niveau?: string
          created_at?: string | null
          date_naissance?: string | null
          edition_id?: string
          elimine_en_phase_id?: string | null
          email?: string
          etablissement?: string
          id?: string
          nom?: string
          numero?: number
          photo_path?: string | null
          prenom?: string
          profil_id?: string | null
          publie?: boolean
          sexe?: string | null
          statut?: Database["public"]["Enums"]["statut_participant"]
          telephone?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "participants_candidature_id_fkey"
            columns: ["candidature_id"]
            isOneToOne: true
            referencedRelation: "candidatures"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "participants_edition_id_fkey"
            columns: ["edition_id"]
            isOneToOne: false
            referencedRelation: "editions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "participants_elimine_en_phase_id_fkey"
            columns: ["elimine_en_phase_id"]
            isOneToOne: false
            referencedRelation: "phases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "participants_profil_id_fkey"
            columns: ["profil_id"]
            isOneToOne: true
            referencedRelation: "profils"
            referencedColumns: ["id"]
          },
        ]
      }
      phases: {
        Row: {
          created_at: string | null
          edition_id: string
          id: string
          nb_barrage_par_groupe: number
          nb_groupes: number
          nb_qualifies_par_groupe: number
          nom: string
          ordre: number
          score_max_defaut: number | null
          type: Database["public"]["Enums"]["type_phase"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          edition_id: string
          id?: string
          nb_barrage_par_groupe?: number
          nb_groupes?: number
          nb_qualifies_par_groupe?: number
          nom: string
          ordre: number
          score_max_defaut?: number | null
          type: Database["public"]["Enums"]["type_phase"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          edition_id?: string
          id?: string
          nb_barrage_par_groupe?: number
          nb_groupes?: number
          nb_qualifies_par_groupe?: number
          nom?: string
          ordre?: number
          score_max_defaut?: number | null
          type?: Database["public"]["Enums"]["type_phase"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "phases_edition_id_fkey"
            columns: ["edition_id"]
            isOneToOne: false
            referencedRelation: "editions"
            referencedColumns: ["id"]
          },
        ]
      }
      profils: {
        Row: {
          actif: boolean
          created_at: string | null
          id: string
          nom: string
          permissions: string[] | null
          prenom: string
          role: Database["public"]["Enums"]["role_utilisateur"]
          updated_at: string | null
        }
        Insert: {
          actif?: boolean
          created_at?: string | null
          id: string
          nom: string
          permissions?: string[] | null
          prenom: string
          role?: Database["public"]["Enums"]["role_utilisateur"]
          updated_at?: string | null
        }
        Update: {
          actif?: boolean
          created_at?: string | null
          id?: string
          nom?: string
          permissions?: string[] | null
          prenom?: string
          role?: Database["public"]["Enums"]["role_utilisateur"]
          updated_at?: string | null
        }
        Relationships: []
      }
      resultats: {
        Row: {
          created_at: string | null
          id: string
          issue: Database["public"]["Enums"]["issue_resultat"] | null
          match_id: string
          participant_id: string
          rang: number | null
          rang_departage: number | null
          score: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          issue?: Database["public"]["Enums"]["issue_resultat"] | null
          match_id: string
          participant_id: string
          rang?: number | null
          rang_departage?: number | null
          score?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          issue?: Database["public"]["Enums"]["issue_resultat"] | null
          match_id?: string
          participant_id?: string
          rang?: number | null
          rang_departage?: number | null
          score?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "resultats_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matchs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resultats_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resultats_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "v_participants_publics"
            referencedColumns: ["id"]
          },
        ]
      }
      resultats_notes: {
        Row: {
          commentaire: string | null
          created_at: string | null
          resultat_id: string
          updated_at: string | null
        }
        Insert: {
          commentaire?: string | null
          created_at?: string | null
          resultat_id: string
          updated_at?: string | null
        }
        Update: {
          commentaire?: string | null
          created_at?: string | null
          resultat_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "resultats_notes_resultat_id_fkey"
            columns: ["resultat_id"]
            isOneToOne: true
            referencedRelation: "resultats"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      v_classement_match: {
        Row: {
          created_at: string | null
          est_egalite: boolean | null
          match_id: string | null
          nom: string | null
          numero: number | null
          participant_id: string | null
          prenom: string | null
          rang_departage: number | null
          rang_provisoire: number | null
          score: number | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "resultats_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matchs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resultats_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resultats_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "v_participants_publics"
            referencedColumns: ["id"]
          },
        ]
      }
      v_participants_publics: {
        Row: {
          classe_niveau: string | null
          etablissement: string | null
          id: string | null
          nom: string | null
          numero: number | null
          photo_path: string | null
          prenom: string | null
          statut: Database["public"]["Enums"]["statut_participant"] | null
        }
        Insert: {
          classe_niveau?: string | null
          etablissement?: string | null
          id?: string | null
          nom?: string | null
          numero?: number | null
          photo_path?: string | null
          prenom?: string | null
          statut?: Database["public"]["Enums"]["statut_participant"] | null
        }
        Update: {
          classe_niveau?: string | null
          etablissement?: string | null
          id?: string | null
          nom?: string | null
          numero?: number | null
          photo_path?: string | null
          prenom?: string | null
          statut?: Database["public"]["Enums"]["statut_participant"] | null
        }
        Relationships: []
      }
    }
    Functions: {
      a_permission: { Args: { permission_nom: string }; Returns: boolean }
      accepter_candidatura: {
        Args: { p_candidature_id: string }
        Returns: Json
      }
      autoriser_correction: {
        Args: { p_match_id: string; p_motif: string }
        Returns: Json
      }
      creer_edition: {
        Args: {
          p_annee: number
          p_description?: string
          p_nom: string
          p_score_max_defaut?: number
        }
        Returns: string
      }
      deposer_candidatura: {
        Args: {
          p_classe_niveau: string
          p_date_naissance?: string
          p_edition_id: string
          p_email: string
          p_etablissement: string
          p_informations?: string
          p_nom: string
          p_photo_path?: string
          p_prenom: string
          p_sexe?: string
          p_telephone?: string
        }
        Returns: Json
      }
      est_admin: { Args: never; Returns: boolean }
      est_super_admin: { Args: never; Returns: boolean }
      participants_proposes: {
        Args: { p_phase_id: string }
        Returns: {
          edition_id: string
          id: string
          nom: string
          numero: number
          prenom: string
        }[]
      }
      valider_match: { Args: { p_match_id: string }; Returns: Json }
    }
    Enums: {
      cible_annonce: "public" | "participants"
      issue_resultat:
        | "qualifie"
        | "barrage"
        | "elimine"
        | "finaliste"
        | "champion"
      role_utilisateur: "super_admin" | "admin" | "participant"
      statut_candidatura:
        | "en_attente"
        | "acceptee"
        | "refusee"
        | "liste_attente"
      statut_edition:
        | "preparation"
        | "candidatures_ouvertes"
        | "en_cours"
        | "terminee"
        | "archivee"
      statut_match: "planifie" | "en_cours" | "termine" | "valide"
      statut_participant:
        | "en_attente"
        | "en_competition"
        | "elimine"
        | "finaliste"
        | "champion"
      statut_publication: "brouillon" | "publiee"
      type_phase:
        | "qualification"
        | "barrage"
        | "tour"
        | "demi_finale"
        | "finale"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      cible_annonce: ["public", "participants"],
      issue_resultat: [
        "qualifie",
        "barrage",
        "elimine",
        "finaliste",
        "champion",
      ],
      role_utilisateur: ["super_admin", "admin", "participant"],
      statut_candidatura: [
        "en_attente",
        "acceptee",
        "refusee",
        "liste_attente",
      ],
      statut_edition: [
        "preparation",
        "candidatures_ouvertes",
        "en_cours",
        "terminee",
        "archivee",
      ],
      statut_match: ["planifie", "en_cours", "termine", "valide"],
      statut_participant: [
        "en_attente",
        "en_competition",
        "elimine",
        "finaliste",
        "champion",
      ],
      statut_publication: ["brouillon", "publiee"],
      type_phase: ["qualification", "barrage", "tour", "demi_finale", "finale"],
    },
  },
} as const
