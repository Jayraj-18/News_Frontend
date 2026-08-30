import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { getOptimizedImageUrl, getResponsiveImageSrcSet } from '../../Utils/imageUrl';

export const LatestGrid = ({ articles }) => {
  const { lang, t } = useLanguage();

  if (!articles || articles.length === 0) return null;

  return (
    <section className="mb-12">
      {/* SECTION HEADER */}
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold whitespace-nowrap border-l-4 border-red-600 pl-3 text-gray-900 dark:text-gray-100">
          {t('latest')}
        </h2>
        <div className="h-[2px] w-full bg-gray-200 dark:bg-gray-700"></div>
      </div>

      {/* CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((art) => {
          const title = art.title[lang] || art.title.mr;
          const summary = art.summary[lang] || art.summary.mr;

          return (
            <article 
              key={art.id} 
              className="group flex flex-col bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded overflow-hidden transition-shadow hover:shadow-md"
            >
              {/* MEDIA WRAPPER */}
              <a href={`/article/${art.slug}`} className="relative block aspect-video overflow-hidden">
                <img 
                  src={getOptimizedImageUrl(art.image.url, { width: 420, height: 240 })} 
                  srcSet={getResponsiveImageSrcSet(art.image.url, [320, 420, 640], 240)}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  alt={art.image.alt} 
                  loading="lazy" 
                  width="400" 
                  height="225"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute bottom-2 left-2 bg-black/75 text-white px-2 py-0.5 text-xs font-semibold rounded-sm">
                  {t(`categories.${art.category}`)}
                </span>
              </a>

              {/* CARD BODY */}
              <div className="p-4 flex flex-col flex-1">
                <h3 className="text-lg font-bold leading-snug mb-2 text-gray-900 dark:text-gray-100">
                  <a 
                    href={`/article/${art.slug}`}
                    className="hover:text-red-600 dark:hover:text-red-400 transition-colors no-underline"
                  >
                    {title}
                  </a>
                </h3>

                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 leading-relaxed">
                  {summary}
                </p>

                {/* CARD FOOTER */}
                <div className="mt-auto pt-2 flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700/50">
                  <time dateTime={art.publishedAt}>
                    {new Date(art.publishedAt).toLocaleDateString(lang === 'mr' ? 'mr-IN' : 'en-US')}
                  </time>
                  <span>•</span>
                  <span className="font-medium text-gray-700 dark:text-gray-300">{art.author.name}</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};