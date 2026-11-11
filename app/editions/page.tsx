import { unstable_noStore } from "next/cache";
import { createClient } from "@/src/utils/supabase/server";
import { EditionList } from "@/src/components/editions/edition-list";
import { ErrorState } from "@/src/components/ui/error-state";

export const metadata = {
  title: "Editions - Question pour un DevAs",
  description: "Decouvrez toutes les editions de Question pour un DevAs.",
};

export default async function EditionsPage() {
  unstable_noStore();
  try {
    const supabase = await createClient();

    const { data: editions, error } = await supabase
      .from("editions")
      .select("*")
      .order("annee", { ascending: false });

    if (error) throw error;

    return (
      <>
        <div className="bg-soft border-b border-line py-14">
          <div className="wrap">
            <span className="eyebrow">Historique</span>
            <h1 className="mt-2 mb-3">Toutes les editions</h1>
            <p className="mute max-w-[56ch]">
              Retrouvez toutes les editions de Question pour un DevAs, leurs resultats, participants et classements.
            </p>
          </div>
        </div>
        <div className="py-12">
          <div className="wrap">
            <EditionList editions={editions ?? []} />
          </div>
        </div>
      </>
    );
  } catch (error) {
    console.error(error);
    return (
      <div className="py-20">
        <div className="wrap">
          <ErrorState title="Erreur" message="Impossible de charger les editions." />
        </div>
      </div>
    );
  }
}
