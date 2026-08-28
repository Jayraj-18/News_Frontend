import React, { useState, useEffect, useCallback } from "react";
import { useNews } from "../context/NewsContext";
import { useLanguage } from "../context/LanguageContext";
import { Link } from "react-router-dom";
import SEO from '../Components/common/SEO'; // Ensure the import path matches your project structure
// ─── Constants ───────────────────────────────────────────────────────────────
const PAGE_SIZE = 9;

// ─── Skeleton card shown while articles are loading ──────────────────────────
const SkeletonCard = () => (
  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden flex flex-col animate-pulse">
    <div className="h-[72px] sm:aspect-video sm:h-auto bg-gray-200 dark:bg-gray-700" />
    <div className="p-1.5 sm:p-4 flex flex-col gap-2">
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mt-1" />
    </div>
  </div>
);

// ─── Pagination bar ───────────────────────────────────────────────────────────
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  // Build page number array with ellipsis logic
  const getPageNumbers = () => {
    const pages = [];
    const delta = 1; // siblings on each side of current
    const left = currentPage - delta;
    const right = currentPage + delta;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= left && i <= right)) {
        pages.push(i);
      } else if (i === left - 1 || i === right + 1) {
        pages.push('…');
      }
    }
    // De-duplicate consecutive ellipses
    return pages.filter((p, idx) => !(p === '…' && pages[idx - 1] === '…'));
  };

  return (
    <nav
      className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mt-8 mb-2 select-none"
      aria-label="Pagination"
    >
      {/* Previous button */}
      <button
        id="pagination-prev"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`
          flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-sm font-semibold
          border transition-all duration-200
          ${currentPage === 1
            ? 'border-gray-200 dark:border-gray-700 text-gray-300 dark:text-gray-600 cursor-not-allowed bg-white dark:bg-gray-800'
            : 'border-red-600 text-red-600 hover:bg-red-600 hover:text-white dark:border-red-500 dark:text-red-400 dark:hover:bg-red-600 dark:hover:text-white cursor-pointer shadow-sm'
          }
        `}
        aria-label="Previous page"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        <span className="hidden sm:inline">मागील</span>
      </button>

      {/* Page number pills */}
      {getPageNumbers().map((page, idx) =>
        page === '…' ? (
          <span
            key={`ellipsis-${idx}`}
            className="w-9 h-9 flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm font-medium"
          >
            …
          </span>
        ) : (
          <button
            key={page}
            id={`pagination-page-${page}`}
            onClick={() => onPageChange(page)}
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
            className={`
              w-9 h-9 rounded-lg text-sm font-bold border transition-all duration-200
              ${page === currentPage
                ? 'bg-red-600 border-red-600 text-white shadow-md scale-105'
                : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-red-500 hover:text-red-600 dark:hover:text-red-400 bg-white dark:bg-gray-800 cursor-pointer'
              }
            `}
          >
            {page}
          </button>
        )
      )}

      {/* Next button */}
      <button
        id="pagination-next"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`
          flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-sm font-semibold
          border transition-all duration-200
          ${currentPage === totalPages
            ? 'border-gray-200 dark:border-gray-700 text-gray-300 dark:text-gray-600 cursor-not-allowed bg-white dark:bg-gray-800'
            : 'border-red-600 text-red-600 hover:bg-red-600 hover:text-white dark:border-red-500 dark:text-red-400 dark:hover:bg-red-600 dark:hover:text-white cursor-pointer shadow-sm'
          }
        `}
        aria-label="Next page"
      >
        <span className="hidden sm:inline">पुढील</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
    </nav>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export const HomePage = ({ currentPath = window.location.pathname }) => {
  const { articles = [], loading, slowFetch } = useNews();
  const { t } = useLanguage();

  // ── Pagination state ──────────────────────────────────────────────────────
  const [currentPage, setCurrentPage] = useState(1);

  // 1. Extract and normalize selected category from route
  const isCategoryPage = currentPath.startsWith('/category/');
  const rawCategory = isCategoryPage ? currentPath.replace('/category/', '') : null;
  const selectedCategory = rawCategory
    ? decodeURIComponent(rawCategory).trim().toLowerCase()
    : null;

  // Reset to page 1 when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  // 2. Filter only published articles
  const allPublished = articles.filter(
    (art) => !art.status || art.status === "published"
  );

  // 3. Filter articles matching the selected category (or return all)
  const filteredArticles = selectedCategory
    ? allPublished.filter((art) => {
        const artCategory = (art.category || '').toString().trim().toLowerCase();
        return artCategory === selectedCategory;
      })
    : allPublished;

  // 4. Hero article — Home Page only
  const heroArticle = !selectedCategory
    ? filteredArticles.find((art) => art.isHero) || filteredArticles[0]
    : null;

  // 5. Grid articles excluding the hero
  const gridArticles = heroArticle
    ? filteredArticles.filter((art) => art.id !== heroArticle.id)
    : filteredArticles;

  // 6. Pagination slicing
  const totalPages = Math.ceil(gridArticles.length / PAGE_SIZE);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pageEnd   = pageStart + PAGE_SIZE;
  const pageArticles = gridArticles.slice(pageStart, pageEnd);

  // Display name for category badge/titles
  const categoryDisplayName = selectedCategory
    ? t(`categories.${selectedCategory}`) || selectedCategory
    : null;

  // Page change handler — scrolls to the grid top smoothly
  const handlePageChange = useCallback((page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    // Scroll so the grid heading comes into view
    setTimeout(() => {
      const el = document.getElementById('news-grid-section');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 50);
  }, [totalPages]);

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (loading && articles.length === 0) {
    return (
      <div className="container mx-auto px-4 mt-6 mb-12">
        <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-6">
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        {slowFetch && (
          <div style={{
            textAlign: 'center',
            marginTop: '1.5rem',
            padding: '0.75rem 1.25rem',
            background: 'linear-gradient(135deg,#fff7ed,#fef3c7)',
            border: '1px solid #fbbf24',
            borderRadius: '0.75rem',
            fontSize: '0.875rem',
            color: '#92400e',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
          }}>
            <span style={{ fontSize: '1.1rem' }}>⏳</span>
            <span>सर्व्हर सुरू होत आहे, थोडी प्रतीक्षा करा… <em style={{ color: '#b45309' }}>(Server is waking up, please wait a moment…)</em></span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 mt-6 mb-12">
       <SEO 
              title="संपर्क साधा | पालघर दृष्टी"
              description="पालघर दृष्टी बातमीपत्राच्या संपादकीय टीमशी संपर्क साधा. बातम्या पाठवण्यासाठी, जाहिरातींसाठी किंवा अभिप्रायासाठी संपर्क माहिती."
              path="/contact"
              focusKeyword="पालघर दृष्टी संपर्क"
            />
      {/* Category Header Banner */}
      {selectedCategory && (
        <div className="bg-white border-l-4 border-red-600 rounded-md p-6 mb-8 shadow-xs">
          <span className="inline-block bg-red-600 text-white text-xs font-bold uppercase px-2.5 py-1 rounded mb-2">
            {categoryDisplayName}
          </span>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            {categoryDisplayName} बातम्या
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            या विभागातील सर्व ताजी अपडेट्स व विशेष बातम्या.{' '}
            <Link to="/" className="text-red-600 hover:underline">
              अधिक बातम्या
            </Link>
          </p>
        </div>
      )}

      {/* Empty state */}
      {filteredArticles.length === 0 ? (
        <div className="flex justify-center items-center py-16 px-4">
          <div className="bg-white dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 sm:p-12 text-center max-w-lg shadow-sm">
            <span className="text-5xl block mb-4">📰</span>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              {selectedCategory
                ? `"${categoryDisplayName}" वर्गात कोणतीही बातमी उपलब्ध नाही`
                : "सध्या कोणतीही बातमी उपलब्ध नाही"}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              {selectedCategory
                ? `"${categoryDisplayName}" या वर्गात अद्याप कोणतीही बातमी प्रकाशित करण्यात आलेली नाही. अ‍ॅडमिन पॅनेलवरून नवीन बातमी जोडा किंवा तिचा वर्ग बदला.`
                : "अजून कोणतीही बातमी प्रकाशित केलेली नाही. अ‍ॅडमिन पॅनेलवरून नवीन बातमी जोडा व प्रकाशित करा."}
            </p>
            <Link to="/" className="text-red-600 hover:underline bg-white p-5 font-bold rounded-2xl">
              अधिक बातम्या
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* ── Hero Story (Home only) ─────────────────────────────────────── */}
          {heroArticle && (
            <section className="group grid grid-cols-1 min-[850px]:grid-cols-[1.2fr_1fr] gap-0 min-[850px]:gap-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden mb-10 shadow-xs">
              <a
                href={`/article/${heroArticle.id || heroArticle.slug}`}
                className="relative block aspect-video overflow-hidden"
              >
                {(heroArticle.featuredImage?.url || heroArticle.image?.url) && (
                  <img
                    src={heroArticle.featuredImage?.url || heroArticle.image?.url}
                    alt={heroArticle.titleMr || heroArticle.title?.mr}
                    fetchpriority="high"
                    loading="eager"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                )}
                {heroArticle.category && (
                  <span className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold uppercase px-3 py-1 rounded shadow-sm">
                    {t(`categories.${heroArticle.category.toLowerCase()}`) || heroArticle.category}
                  </span>
                )}
              </a>

              <div className="p-6 min-[850px]:py-8 min-[850px]:pr-8 min-[850px]:pl-0 flex flex-col justify-center">
                {heroArticle.isBreaking && (
                  <span className="inline-block bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 text-xs font-bold px-2.5 py-1 rounded mb-3 w-fit">
                    🔴 ब्रेकिंग न्यूज
                  </span>
                )}
                <h1 className="text-2xl sm:text-3xl font-bold leading-tight mb-4">
                  <a
                    href={`/article/${heroArticle.id || heroArticle.slug}`}
                    className="text-gray-900 dark:text-gray-100 hover:text-red-600 dark:hover:text-red-500 transition-colors"
                  >
                    {heroArticle.titleMr || heroArticle.title?.mr}
                  </a>
                </h1>
                <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed mb-5 line-clamp-3">
                  {heroArticle.summaryMr || heroArticle.summary?.mr}
                </p>
                <div className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-2">
                  <span>📅 {new Date(heroArticle.publishedAt || heroArticle.createdAt || Date.now()).toLocaleDateString('mr-IN')}</span>
                  {heroArticle.readingTime && <span>• ⏱️ {heroArticle.readingTime} मि. वाचन</span>}
                </div>
              </div>
            </section>
          )}

          {/* ── News Grid + Pagination ─────────────────────────────────────── */}
          {gridArticles.length > 0 && (
            <section id="news-grid-section" className="mb-8 scroll-mt-4">

              {/* Section heading row with page info */}
              <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
                {!selectedCategory && (
                  <h2 className="text-2xl font-bold border-l-4 border-red-600 pl-3 text-gray-900 dark:text-gray-100">
                    ताजा बातम्या (Latest News)
                  </h2>
                )}
                {/* Page counter pill */}
                {totalPages > 1 && (
                  <span className="ml-auto text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded-full">
                    पृष्ठ {currentPage} / {totalPages}
                    &nbsp;·&nbsp;
                    {gridArticles.length} बातम्या
                  </span>
                )}
              </div>

              {/* Article grid — 3 cols mobile, 3 sm, 3 lg, auto xl */}
              <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-6">
                {pageArticles.map((article) => {
                  const imgUrl = article.featuredImage?.url || article.image?.url;
                  const titleText = article.titleMr || (typeof article.title === 'object' ? article.title.mr : article.title);
                  const summaryText = article.summaryMr || (typeof article.summary === 'object' ? article.summary.mr : article.summary);

                  return (
                    <article
                      key={article.id || article.slug}
                      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-200"
                    >
                      {/* Image */}
                      <a
                        href={`/article/${article.id || article.slug}`}
                        className="relative block h-[72px] sm:h-auto sm:aspect-video overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0"
                      >
                        {imgUrl ? (
                          <img
                            src={imgUrl}
                            alt={titleText}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 font-bold text-[9px] sm:text-sm">
                            न्यूज 24
                          </div>
                        )}
                        {article.category && (
                          <span className="hidden sm:inline absolute bottom-2 left-2 bg-black/75 text-white text-[11px] font-semibold uppercase px-2 py-0.5 rounded">
                            {t(`categories.${article.category.toLowerCase()}`) || article.category}
                          </span>
                        )}
                      </a>

                      {/* Text body */}
                      <div className="p-1.5 sm:p-4 flex flex-col flex-1">
                        {article.isBreaking && (
                          <span className="text-red-600 dark:text-red-400 text-[9px] sm:text-xs font-bold mb-0.5 sm:mb-1 block leading-tight">
                            🔴 <span className="hidden sm:inline">ब्रेकिंग</span>
                          </span>
                        )}
                        <h3 className="text-[11px] sm:text-base font-bold leading-snug mb-0 sm:mb-2">
                          <a
                            href={`/article/${article.id || article.slug}`}
                            className="text-gray-900 dark:text-gray-100 hover:text-red-600 dark:hover:text-red-500 transition-colors line-clamp-2 sm:line-clamp-3"
                          >
                            {titleText}
                          </a>
                        </h3>
                        <p className="hidden sm:block text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2 leading-relaxed">
                          {summaryText}
                        </p>
                        <span className="mt-auto text-[9px] sm:text-xs text-gray-400 dark:text-gray-500 pt-0.5">
                          {new Date(article.publishedAt || article.createdAt || Date.now()).toLocaleDateString('mr-IN')}
                        </span>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* ── Pagination controls ── */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </section>
          )}
        </>
      )}
    </div>
  );
};