import { Suspense } from 'react';
import { io } from 'next/cache';
import { createClient } from '@/src/utils/supabase/server';
import { ActualitesList, type ActualiteCardData } from '@/src/components/actualites/actualites-list';
import { ErrorState } from '@/src/components/ui/error-state';

export const metadata = {
  title: 'Actualités – Question pour un DevAs',
  description: 'Suivez les nouvelles et les temps forts de la compétition.',
};

export default function ActualitesPage() {
  return (
    <>
      <header className="border-b border-line bg-soft py-12 md:py-16">
        <div className="wrap">
          <span className="eyebrow">Actualités</span>
          <h1 className="mt-2">Le journal de la compétition</h1>
        </div>
      </header>

      <section className="wrap flex-1 py-8 md:py-10">
        <Suspense fallback={<ActualitesSkeleton />}>
          <ActualitesDynamic />
        </Suspense>
      </section>
    </>
  );
}

function ActualitesSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((item) => (
        <div key={item} className="overflow-hidden rounded-xl border border-line">
          <div className="h-36 animate-pulse bg-line/40" />
          <div className="space-y-3 p-4">
            <div className="h-3 w-1/3 animate-pulse rounded bg-line/50" />
            <div className="h-5 w-4/5 animate-pulse rounded bg-line/50" />
            <div className="h-10 animate-pulse rounded bg-line/50" />
          </div>
        </div>
      ))}
    </div>
  );
}

async function ActualitesDynamic() {
  await io();

  let articles: ActualiteCardData[] | undefined;
  try {
    articles = await loadActualites();
  } catch (error) {
    console.error('Échec du chargement des actualités :', error);
  }

  if (articles === undefined) {
    return (
      <ErrorState
        title="Actualités indisponibles"
        message="Impossible de charger les articles pour le moment."
      />
    );
  }

  return <ActualitesList articles={articles} />;
}

async function loadActualites(): Promise<ActualiteCardData[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('actualites')
    .select('id, titre, resume, contenu, categorie, image_path, publie_le, created_at')
    .eq('statut', 'publiee')
    .order('publie_le', { ascending: false });

  if (error) throw error;

  return (data ?? []).map((article) => ({
    id: article.id,
    titre: article.titre,
    resume: article.resume,
    contenu: article.contenu,
    categorie: article.categorie,
    imageUrl: getImageUrl(supabase, article.image_path),
    publieLe: article.publie_le,
    createdAt: article.created_at,
  }));
}

function getImageUrl(
  supabase: Awaited<ReturnType<typeof createClient>>,
  imagePath: string | null,
): string | null {
  if (!imagePath) return null;
  if (/^https?:\/\//i.test(imagePath)) return imagePath;

  return supabase.storage.from('actualites-images').getPublicUrl(imagePath).data.publicUrl;
}
