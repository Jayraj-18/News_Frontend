import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

export const BreakingTicker = ({ newsItems }) => {
  const { lang, t } = useLanguage();

  if (!newsItems || newsItems.length === 0) return null;

  // Duplicate items array to ensure a smooth, seamless infinite ticker loop
  const tickerItems = [...newsItems, ...newsItems];

  return (
    <div
      className="bg-red-50 dark:bg-red-950/30 border-b border-red-200 dark:border-red-900/50 overflow-hidden print:hidden"
      role="region"
      aria-label={t('breaking')}
    >
      <div className="container mx-auto px-4 flex items-center h-11">
        
        {/* BREAKING BADGE */}
        <div className="bg-red-600 text-white px-3 py-1 text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap z-10 shadow-md rounded-r-sm">
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          <span>{t('breaking')}</span>
        </div>

        {/* MARQUEE CONTENT AREA */}
        <div className="flex-1 overflow-hidden relative whitespace-nowrap">
          <div className="inline-flex items-center animate-[marquee_28s_linear_infinite] hover:[animation-play-state:paused]">
            {tickerItems.map((item, index) => {
              const title = item.title[lang] || item.title.mr;
              return (
                <a
                  key={`${item.id || index}-${index}`}
                  href={`/article/${item.slug}`}
                  className="text-gray-900 dark:text-gray-100 text-sm sm:text-base font-semibold no-underline inline-flex items-center px-6 transition-colors hover:text-blue-600 dark:hover:text-blue-400 hover:underline"
                >
                  <span className="text-red-600 mr-2 font-bold">•</span>
                  <span className="ticker-text">{title}</span>
                </a>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};