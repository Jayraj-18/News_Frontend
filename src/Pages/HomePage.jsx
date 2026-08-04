import React from "react";
import { useNews } from "../context/NewsContext";
import { useLanguage } from "../context/LanguageContext";

export const HomePage = ({ currentPath = window.location.pathname }) => {
  const { articles = [] } = useNews();
  const { t } = useLanguage();

  // 1. Extract and normalize selected category from route
  const isCategoryPage = currentPath.startsWith('/category/');
  const rawCategory = isCategoryPage ? currentPath.replace('/category/', '') : null;
  const selectedCategory = rawCategory
    ? decodeURIComponent(rawCategory).trim().toLowerCase()
    : null;

  // 2. Filter only published articles
  const allPublished = articles.filter(
    (art) => !art.status || art.status === "published"
  );

  // 3. Filter articles matching the selected category (or return all if on main Home Page)
  const filteredArticles = selectedCategory
    ? allPublished.filter((art) => {
        const artCategory = (art.category || '').toString().trim().toLowerCase();
        return artCategory === selectedCategory;
      })
    : allPublished;

  // 4. Hero article logic: Displayed ONLY on the main Home Page
  const heroArticle = !selectedCategory
    ? filteredArticles.find((art) => art.isHero) || filteredArticles[0]
    : null;

  // 5. Grid articles excluding the hero article (if hero exists)
  const gridArticles = heroArticle
    ? filteredArticles.filter((art) => art.id !== heroArticle.id)
    : filteredArticles;

  // Display name for category badge/titles
  const categoryDisplayName = selectedCategory
    ? t(`categories.${selectedCategory}`) || selectedCategory
    : null;

  return (
    <div className="container mx-auto px-4 mt-6 mb-12">
      {/* Category Header Banner when on a Category Page */}
      {selectedCategory && (
        <div className="bg-white   border-l-4 border-red-600 rounded-md p-6 mb-8 shadow-xs">
          <span className="inline-block bg-red-600 text-white text-xs font-bold uppercase px-2.5 py-1 rounded mb-2">
            {categoryDisplayName}
          </span>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            {categoryDisplayName} बातम्या
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            या विभागातील सर्व ताजी अपडेट्स व विशेष बातम्या.
          </p>
        </div>
      )}

      {/* EMPTY STATE: Shown if no articles match the selected category */}
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
            <a
              href="/admin"
              className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-md transition-colors text-sm no-underline"
            >
              📝 अ‍ॅडमिन पॅनेलवर जा (Go to Admin CMS)
            </a>
          </div>
        </div>
      ) : (
        <>
          {/* Hero Story: Rendered only on Home Page */}
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

          {/* News Grid Section */}
          {gridArticles.length > 0 && (
            <section className="mb-8">
              {!selectedCategory && (
                <h2 className="text-2xl font-bold border-l-4 border-red-600 pl-3 mb-5 text-gray-900 dark:text-gray-100">
                  ताजा बातम्या (Latest News)
                </h2>
              )}
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {gridArticles.map((article) => {
                  const imgUrl = article.featuredImage?.url || article.image?.url;
                  const titleText = article.titleMr || (typeof article.title === 'object' ? article.title.mr : article.title);
                  const summaryText = article.summaryMr || (typeof article.summary === 'object' ? article.summary.mr : article.summary);

                  return (
                    <article 
                      key={article.id || article.slug} 
                      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden flex flex-col"
                    >
                      <a 
                        href={`/article/${article.id || article.slug}`} 
                        className="relative block aspect-video overflow-hidden bg-gray-100 dark:bg-gray-700"
                      >
                        {imgUrl ? (
                          <img 
                            src={imgUrl} 
                            alt={titleText} 
                            loading="lazy" 
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 font-bold text-sm">
                            न्यूज 24
                          </div>
                        )}
                        {article.category && (
                          <span className="absolute bottom-2 left-2 bg-black/75 text-white text-[11px] font-semibold uppercase px-2 py-0.5 rounded">
                            {t(`categories.${article.category.toLowerCase()}`) || article.category}
                          </span>
                        )}
                      </a>

                      <div className="p-4 flex flex-col flex-1">
                        {article.isBreaking && (
                          <span className="text-red-600 dark:text-red-400 text-xs font-bold mb-1 block">
                            🔴 ब्रेकिंग
                          </span>
                        )}
                        <h3 className="text-lg font-bold leading-snug mb-2">
                          <a 
                            href={`/article/${article.id || article.slug}`}
                            className="text-gray-900 dark:text-gray-100 hover:text-red-600 dark:hover:text-red-500 transition-colors"
                          >
                            {titleText}
                          </a>
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed">
                          {summaryText}
                        </p>
                        <span className="mt-auto text-xs text-gray-400 dark:text-gray-500">
                          {new Date(article.publishedAt || article.createdAt || Date.now()).toLocaleDateString('mr-IN')}
                        </span>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
};