import { unstable_noStore } from "next/cache";
import { createClient } from "@/src/utils/supabase/server";
import { MatchList } from "@/src/components/matchs/match-list";
import { ErrorState } from "@/src/components/ui/error-state";

export const metadata = {
  title: "Matchs - Question pour un DevAs",
  description: "Consultez les matchs et resultats de Question pour un DevAs.",
};

export default async function MatchsPage() {
  unstable_noStore();
  try {
    const supabase = await createClient();

    const { data: matchs, error } = await supabase
      .from("matchs")
      .select("*, phase:phases(nom, type)")
      .order("date_heure", { ascending: false });

    if (error) throw error;

    return (
      <div className="bg-soft min-h-screen">
        <div className="bg-white border-b border-line py-12">
          <div className="max-w-[1180px] mx-auto px-4">
            <span className="eyebrow">Competition</span>
            <h1 className="mt-2 mb-2">Matchs et Resultats</h1>
            <p className="mute">
              Consultez tous les matchs, les scores et les resultats de chaque phase.
            </p>
          </div>
        </div>
        <div className="max-w-[1180px] mx-auto px-4 py-10">
          <MatchList matchs={matchs ?? []} />
        </div>
      </div>
    );
  } catch (error) {
    console.error(error);
    return (
      <div className="py-20">
        <div className="max-w-[1180px] mx-auto px-4">
          <ErrorState title="Erreur" message="Impossible de charger les matchs." />
        </div>
      </div>
    );
  }
}
