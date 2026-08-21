import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { WorldNewsMarquee } from './WorldNewsMarquee';

export const Header = () => {
  const { lang, setLang, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const categories = [
    'politics',
    'agri',
    'crime',
    'education',
    'sports',
    'business',
    'tech',
    'health',
    'entertainment',
    'local',
    'world'
  ];

  const currentPath = window.location.pathname;

  const currentDate = new Date().toLocaleDateString(lang === 'mr' ? 'mr-IN' : 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <header className="border-b-2 border-red-600 bg-white dark:bg-gray-900">
      
      {/* TOP UTILITY BAR */}
      <div className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 text-xs sm:text-sm py-1.5 print:hidden">
        <div className="container mx-auto px-4 flex justify-between items-center">
          
          {/* DATE & WEATHER */}
          <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
            <time dateTime={new Date().toISOString()}>{currentDate}</time>
            <span className="hidden sm:inline-block text-gray-300 dark:text-gray-600">|</span>
            <span className="font-medium">☀️ मुंबई 31°C</span>
          </div>

          {/* LANGUAGE SWITCHER */}
          <div className="flex items-center" role="radiogroup" aria-label="Language selection">
            <button
              className={`font-semibold px-1.5 transition-colors ${
                lang === 'mr'
                  ? 'text-red-600 dark:text-red-500'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
              onClick={() => setLang('mr')}
              aria-checked={lang === 'mr'}
              role="radio"
            >
              मराठी
            </button>
            <span className="text-gray-300 dark:text-gray-600 px-1">|</span>
            <button
              className={`font-semibold px-1.5 transition-colors ${
                lang === 'en'
                  ? 'text-red-600 dark:text-red-500'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
              onClick={() => setLang('en')}
              aria-checked={lang === 'en'}
              role="radio"
            >
              English
            </button>
          </div>

        </div>
      </div>

      {/* WORLD NEWS MARQUEE TICKER */}
      <WorldNewsMarquee />

      {/* MAIN BRANDING HEADER */}
      <div className="py-4">
        <div className="container mx-auto px-4 flex justify-between md:justify-center items-center relative">
          
          {/* MOBILE TOGGLE BUTTON */}
          <button
            className="md:hidden text-2xl text-gray-800 dark:text-gray-200 p-1 print:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            ☰
          </button>

          {/* BRAND LOGO */}
          <a href="/" className="flex flex-col items-center text-center no-underline ">
            <span className="text-3xl sm:text-4xl font-black text-red-600 tracking-tight leading-none">
              {t('siteTitle')}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">
              {t('tagline')}
            </span>
          </a>

        </div>
      </div>

      {/* NAVIGATION BAR */}
      <nav
        className={`bg-gray-900 dark:bg-gray-950 transition-all duration-200 ${
          mobileMenuOpen ? 'block' : 'hidden md:block'
        }`}
        aria-label="Primary Navigation"
      >
        <div className="container mx-auto px-0 md:px-4">
          <ul className="flex flex-col md:flex-row md:overflow-x-auto whitespace-nowrap list-none m-0 p-0">
            <li>
              <a
                href="/"
                className={`block px-4 py-3 text-sm font-medium text-white transition-colors no-underline ${
                  currentPath === '/' ? 'bg-red-600 font-bold' : 'hover:bg-red-600 hover:font-bold'
                }`}
              >
                {lang === 'mr' ? 'मुख्य पृष्ठ' : 'Home'}
              </a>
            </li>
            {categories.map((cat) => {
              const catPath = `/category/${cat}`;
              const isActive = currentPath === catPath;
              return (
                <li key={cat}>
                  <a
                    href={catPath}
                    className={`block px-4 py-3 text-sm font-medium text-white transition-colors no-underline ${
                      isActive ? 'bg-red-600 font-bold' : 'hover:bg-red-600 hover:font-bold'
                    }`}
                  >
                    {t(`categories.${cat}`) || cat}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

    </header>
  );
};