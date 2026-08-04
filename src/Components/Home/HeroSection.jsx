import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

export const HeroSection = ({ article }) => {
  const { lang, t } = useLanguage();

  if (!article) return null;

  const title = article.title[lang] || article.title.mr;
  const summary = article.summary[lang] || article.summary.mr;

  return (
    <section className="mb-10" aria-label="Featured News Story">
      <div className="group grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-0 lg:gap-8 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden transition-shadow hover:shadow-lg">
        
        {/* IMAGE WRAPPER */}
        <a href={`/article/${article.slug}`} className="relative block overflow-hidden aspect-video">
          <img 
            src={article.image.url} 
            alt={article.image.alt} 
            width="1200" 
            height="675" 
            loading="eager"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <span className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 text-xs font-bold rounded shadow-sm">
            {t(`categories.${article.category}`)}
          </span>
        </a>

        {/* CONTENT */}
        <div className="p-6 lg:py-8 lg:pr-8 lg:pl-0 flex flex-col justify-center">
          <h1 className="text-2xl lg:text-3xl font-bold leading-tight mb-4 text-gray-900 dark:text-gray-100">
            <a 
              href={`/article/${article.slug}`} 
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors no-underline"
            >
              {title}
            </a>
          </h1>
          
          <p className="text-base lg:text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
            {summary}
          </p>
          
          {/* META INFO */}
          <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 flex flex-wrap items-center gap-2">
            <span className="font-semibold text-gray-800 dark:text-gray-200">
              {article.author.name}
            </span>
            <span className="text-gray-400 dark:text-gray-600">•</span>
            <time dateTime={article.publishedAt}>
              {new Date(article.publishedAt).toLocaleDateString(lang === 'mr' ? 'mr-IN' : 'en-US')}
            </time>
            <span className="text-gray-400 dark:text-gray-600">•</span>
            <span className="flex items-center gap-1">
              ⏱️ {article.readingTime} {t('minRead')}
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};