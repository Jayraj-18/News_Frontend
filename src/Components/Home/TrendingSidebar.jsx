import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

export const TrendingSidebar = ({ articles }) => {
  const { lang, t } = useLanguage();

  if (!articles || articles.length === 0) return null;

  return (
    <aside className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5 rounded">
      {/* HEADER */}
      <div className="mb-4">
        <h2 className="text-xl font-bold border-b-2 border-red-600 pb-2 text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
          <span>🔥</span> {t('trending')}
        </h2>
      </div>

      {/* LIST */}
      <ol className="list-none p-0 m-0">
        {articles.map((art, index) => {
          const title = art.title[lang] || art.title.mr;

          return (
            <li 
              key={art.id} 
              className="flex gap-4 py-3 border-b border-dashed border-gray-200 dark:border-gray-700 last:border-b-0"
            >
              {/* RANK NUMBER */}
              <span className="text-2xl font-extrabold text-red-600 leading-none w-6 shrink-0 text-center">
                {index + 1}
              </span>

              {/* CONTENT */}
              <div className="flex flex-col gap-0.5">
                <span className="text-[0.75rem] text-gray-400 dark:text-gray-400 uppercase font-semibold tracking-wider">
                  {t(`categories.${art.category}`)}
                </span>
                
                <h3 className="text-sm font-medium leading-snug m-0 text-gray-900 dark:text-gray-100">
                  <a 
                    href={`/article/${art.slug}`}
                    className="hover:text-red-600 dark:hover:text-red-400 transition-colors no-underline"
                  >
                    {title}
                  </a>
                </h3>
              </div>
            </li>
          );
        })}
      </ol>
    </aside>
  );
};