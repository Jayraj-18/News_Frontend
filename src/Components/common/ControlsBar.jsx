import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

export const ControlsBar = ({ onFontChange, onToggleTheme, isDark }) => {
  const { t } = useLanguage();

  return (
    <div
      className="flex flex-wrap items-center gap-6 p-3 mb-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded print:hidden"
      aria-label="Reader Accessibility Options"
    >
      {/* FONT SIZE CONTROLS */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
          {t('fontSize')}:
        </span>
        <button
          type="button"
          onClick={() => onFontChange(1)}
          aria-label="Increase Font Size"
          className="px-2.5 py-1 text-xs font-semibold rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          A+
        </button>
        <button
          type="button"
          onClick={() => onFontChange(-1)}
          aria-label="Decrease Font Size"
          className="px-2.5 py-1 text-xs font-semibold rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          A-
        </button>
      </div>

      {/* THEME TOGGLE */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onToggleTheme}
          aria-label="Toggle Dark Theme"
          className="px-2.5 py-1 text-xs font-semibold rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          {isDark ? '☀️ Light' : '🌙 Dark'}
        </button>
      </div>

      {/* PRINT ACTION */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => window.print()}
          aria-label="Print Article"
          className="px-2.5 py-1 text-xs font-semibold rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          🖨️ {t('print')}
        </button>
      </div>
    </div>
  );
};