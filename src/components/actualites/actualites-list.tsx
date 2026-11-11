'use client';

import Image from 'next/image';
import { useState } from 'react';
import { NewspaperIcon } from '@/src/components/common/icons';
import { EmptyState } from '@/src/components/ui/empty-state';

export interface ActualiteCardData {
  id: string;
  titre: string;
  resume: string | null;
  contenu: string;
  categorie: string | null;
  imageUrl: string | null;
  publieLe: string | null;
  createdAt: string | null;
}

interface ActualitesListProps {
  articles: ActualiteCardData[];
}

const ALL_CATEGORIES = 'Toutes';

const categoryLabels: Record<string, string> = {
  candidatures: 'Candidatures',
  resultats: 'Résultats',
  organisation: 'Organisation',
  evenement: 'Événement',
  jury: 'Organisation',
};

function displayCategory(category: string): string {
  const normalized = category
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

  return categoryLabels[normalized] ?? `${category.charAt(0).toUpperCase()}${category.slice(1)}`;
}

function formatDate(value: string | null): string {
  if (!value) return 'Date non communiquée';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Date non communiquée';

  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function ArticleImage({ article }: { article: ActualiteCardData }) {
  const [failed, setFailed] = useState(false);

  if (!article.imageUrl || failed) {
    return (
      <div className="grid h-36 place-items-center bg-green-pale text-green-dark">
        <NewspaperIcon className="h-9 w-9" />
      </div>
    );
  }

  return (
    <div className="relative h-36 overflow-hidden bg-soft">
      <Image
        src={article.imageUrl}
        alt={article.titre}
        fill
        unoptimized
        sizes="(max-width: 768px) 100vw, (max-width: 1180px) 50vw, 360px"
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        onError={() => setFailed(true)}
      />
    </div>
  );
}

export function ActualitesList({ articles }: ActualitesListProps) {
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORIES);
  const categories = [
    ...new Set(
      articles
        .map((article) => article.categorie?.trim())
        .filter((category): category is string => Boolean(category)),
    ),
  ];

  const filteredArticles =
    selectedCategory === ALL_CATEGORIES
      ? articles
      : articles.filter((article) => article.categorie?.trim() === selectedCategory);

  if (articles.length === 0) {
    return (
      <EmptyState
        icon={<NewspaperIcon className="h-7 w-7" />}
        title="Aucune actualité pour le moment"
        description="Les nouvelles de la compétition seront publiées ici."
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2" aria-label="Filtrer les actualités">
        {[ALL_CATEGORIES, ...categories].map((category) => (
          <button
            key={category}
            type="button"
            aria-pressed={selectedCategory === category}
            onClick={() => setSelectedCategory(category)}
            className={[
              'rounded-full border px-4 py-2 text-xs font-semibold transition-colors',
              selectedCategory === category
                ? 'border-green bg-green text-white'
                : 'border-line bg-white text-ink hover:bg-soft',
            ].join(' ')}
          >
            {category === ALL_CATEGORIES ? ALL_CATEGORIES : displayCategory(category)}
          </button>
        ))}
      </div>

      {filteredArticles.length === 0 ? (
        <EmptyState
          icon={<NewspaperIcon className="h-7 w-7" />}
          title="Aucun article dans cette rubrique"
          description="Choisissez une autre catégorie pour consulter les actualités."
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.map((article) => {
            const date = article.publieLe ?? article.createdAt;
            const summary = (article.resume || article.contenu).trim();

            return (
              <article
                key={article.id}
                className="group overflow-hidden rounded-xl border border-line bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <ArticleImage article={article} />
                <div className="p-4">
                  <div className="mb-2 flex flex-wrap items-center gap-1.5 text-xs">
                    {article.categorie && (
                      <span className="font-semibold text-green-dark">
                        {displayCategory(article.categorie)}
                      </span>
                    )}
                    {article.categorie && <span className="text-mute">·</span>}
                    <time className="text-mute" dateTime={date ?? undefined}>
                      {formatDate(date)}
                    </time>
                  </div>
                  <h2 className="text-base font-bold leading-snug text-ink">
                    {article.titre}
                  </h2>
                  <p className="mt-2 line-clamp-3 text-sm text-mute">
                    {summary}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
