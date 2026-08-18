import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useNews } from '../context/NewsContext';
import { SEO } from '../Components/common/SEO';
import { ControlsBar } from '../Components/article/ControlsBar';

export const ArticlePage = () => {
  const { lang, t } = useLanguage();
  const { getArticleByIdOrSlug, articles } = useNews();
  
  const [article, setArticle] = useState(null);
  const [loadingArticle, setLoadingArticle] = useState(true);
  const [fontSizeOffset, setFontSizeOffset] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Extract ID or Slug from pathname e.g. /article/1722176400000 or /article/my-slug
  const pathname = window.location.pathname;
  const pathParts = pathname.split('/article/').filter(Boolean);
  const articleIdOrSlug = pathParts[pathParts.length - 1] || '';

  useEffect(() => {
    const loadArticle = async () => {
      setLoadingArticle(true);

      if (!articleIdOrSlug) {
        setArticle(null);
        setLoadingArticle(false);
        return;
      }

      const fetched = await getArticleByIdOrSlug(articleIdOrSlug);
      if (fetched) {
        setArticle(fetched);
      } else {
        const fallback = articles.find(
          (art) => String(art.id) === String(articleIdOrSlug) || art.slug === articleIdOrSlug
        );
        setArticle(fallback || null);
      }

      setLoadingArticle(false);
    };

    loadArticle();
  }, [articleIdOrSlug, articles, getArticleByIdOrSlug]);

  // Scroll Progress calculation
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loadingArticle) {
    return (
      <div className="min-h-screen bg-[#1E2939] text-white flex items-center justify-center p-4">
        <div className="inline-flex items-center gap-3 bg-zinc-900 border border-zinc-800 p-8 rounded-lg shadow-sm">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-red-600 border-t-transparent"></div>
          <span className="text-white font-medium">बातमी लोड केली जात आहे...</span>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-[#1E2939] text-white flex items-center justify-center p-4">
        <div className="bg-zinc-900 p-8 sm:p-12 rounded-lg border border-zinc-800 max-w-lg mx-auto shadow-sm text-center">
          <span className="text-5xl block">📰</span>
          <h2 className="mt-4 text-2xl font-bold text-white">बातमी सापडली नाही</h2>
          <p className="text-zinc-400 mt-2 text-sm leading-relaxed">
            तुम्ही शोधत असलेली बातमी उपलब्ध नाही किंवा ती अजून प्रकाशित झालेली नाही.
          </p>
          <a
            href="/"
            className="inline-block mt-6 bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-md transition-colors no-underline"
          >
            🏠 मुख्य पानावर जा (Back to Home)
          </a>
        </div>
      </div>
    );
  }

  const articleTitle = article?.titleMr || (typeof article?.title === 'object' ? (article.title?.[lang] || article.title?.mr) : article?.title) || 'शीर्षक नाही';
  const articleSummary = article?.summaryMr || (typeof article?.summary === 'object' ? (article.summary?.[lang] || article.summary?.mr) : article?.summary) || '';
  const articleContent = article?.contentMr || (typeof article?.content === 'object' ? (article.content?.[lang] || article.content?.mr) : article?.content) || '';
  const imageUrl = article?.featuredImage?.url || article?.image?.url || '';
  const imageCaption = article?.featuredImage?.caption || article?.image?.caption || '';
  const imageCredit = article?.featuredImage?.credit || article?.image?.credit || '';
  const authorName = 'पालघर दृष्टी';
  const authorRole = article?.author?.role || 'Sampadak (Editor)';
  
  // Set /one.webp from the public folder as default when article avatar isn't specified
  const authorAvatar = article?.author?.avatar || '/one.webp';
  
  const publishedDate = article?.publishedAt || article?.createdAt || new Date().toISOString();
  const readingTime = 7;
  const galleryImages = article?.galleryImages || [];

  return (
    <div className="min-h-screen bg-[#1E2939] text-white py-1">
      <SEO article={article} isArticle={true} />

      {/* Reading Progress Indicator */}
      <div 
        className="fixed top-0 left-0 h-1 bg-red-600 z-50 transition-all duration-100 ease-out" 
        style={{ width: `${scrollProgress}%` }}
        role="progressbar"
        aria-valuenow={scrollProgress}
        aria-valuemin="0"
        aria-valuemax="100"
      />

      <article 
        className="container mx-auto px-4 max-w-[1100px] my-8 text-white"
        style={{ fontSize: `${18 + fontSizeOffset}px` }}
      >
        {/* Breadcrumb Navigation */}
        <nav className="text-xs sm:text-sm text-zinc-400 mb-4 print:hidden" aria-label="Breadcrumb">
          <a href="/" className="hover:underline hover:text-white">मुख्य पृष्ठ</a> &gt; {article.category && (
            <a href={`/category/${article.category}`} className="hover:underline hover:text-white ml-1">
              {t(`categories.${article.category}`) || article.category}
            </a>
          )}
        </nav>

        {/* Article Header */}
        <header className="mb-6">
          {article.category && (
            <span className="inline-block bg-red-600 text-white text-xs font-bold uppercase px-2.5 py-1 rounded-xs mb-3">
              {t(`categories.${article.category}`) || article.category}
            </span>
          )}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mt-2 mb-4">
            {articleTitle}
          </h1>
          {articleSummary && (
            <p className="text-lg sm:text-xl text-zinc-300 leading-relaxed mb-6">
              {articleSummary}
            </p>
          )}

          {/* Meta Information Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-y border-zinc-800 py-4 my-6">
            <div className="flex items-center gap-3">
              <img 
                src={authorAvatar} 
                alt={authorName} 
                className="w-11 h-11 rounded-full object-cover border border-zinc-700" 
                loading="lazy" 
              />
              <div>
                <strong className="block text-sm font-bold text-white">{authorName}</strong>
                <span className="text-xs text-zinc-400">{authorRole}</span>
              </div>
            </div>

            <div className="flex flex-col sm:items-end text-xs text-zinc-400 gap-1">
              <time dateTime={publishedDate}>
                {t('publishedOn')} {new Date(publishedDate).toLocaleDateString(lang === 'mr' ? 'mr-IN' : 'en-US')}
              </time>
              <span className="font-medium text-zinc-300">⏳ {readingTime} {t('minRead')}</span>
            </div>
          </div>
        </header>

        {/* Featured Hero Image */}
        {imageUrl && (
          <figure className="mb-8">
            <img 
              src={imageUrl} 
              alt={articleTitle} 
              width="1200" 
              height="675"
              loading="eager"
              className="w-full rounded-md object-cover aspect-video border border-zinc-800"
            />
            {(imageCaption || imageCredit) && (
              <figcaption className="flex justify-between items-center text-xs text-zinc-400 mt-2 px-1">
                <span>{imageCaption}</span>
                {imageCredit && <span className="font-semibold text-zinc-300">{imageCredit}</span>}
              </figcaption>
            )}
          </figure>
        )}

        {/* Main Grid: Body + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10">
          
          {/* Article Text Content */}
          <main className="leading-relaxed text-zinc-200 [&>p]:mb-6 [&>p]:text-zinc-200 [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mt-8 [&>h2]:mb-4 [&>h2]:border-b-2 [&>h2]:border-zinc-800 [&>h2]:pb-2 [&>h2]:text-white [&>a]:text-red-500">
            <div dangerouslySetInnerHTML={{ __html: articleContent }} />

            {/* Gallery Images if attached */}
            {galleryImages.length > 0 && (
              <div className="mt-10 pt-6 border-t border-zinc-800">
                <h3 className="text-xl font-bold mb-4 border-l-4 border-red-600 pl-2 text-white">
                  📸 फोटो गॅलरी (Gallery)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {galleryImages.map((gImg, idx) => (
                    <figure key={gImg.id || idx} className="m-0 border border-zinc-800 rounded overflow-hidden bg-zinc-900">
                      <img src={gImg.url} alt={gImg.caption || 'Gallery Image'} className="w-full h-44 object-cover" fetchpriority="high" loading="eager" />
                      {gImg.caption && (
                        <figcaption className="p-2 text-xs text-zinc-300">
                          {gImg.caption}
                        </figcaption>
                      )}
                    </figure>
                  ))}
                </div>
              </div>
            )}
          </main>

          {/* Sticky Contextual Sidebar */}
          <aside className="block print:hidden">
            <div className="lg:sticky lg:top-6 flex flex-col gap-6">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-3">
                  {t('shareArticle')}
                </h3>
                <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
                  <button 
                    className="w-full py-2 px-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded text-sm transition-colors cursor-pointer"
                    onClick={() => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(articleTitle + ' ' + window.location.href)}`)}
                  >
                    WhatsApp
                  </button>
                  <button 
                    className="w-full py-2 px-4 bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold rounded text-sm transition-colors cursor-pointer"
                    onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`)}
                  >
                    Facebook
                  </button>
                </div>
              </div>

              {/* Advertisement Placeholder */}
              <div className="h-64 bg-zinc-900 border border-dashed border-zinc-800 flex items-center justify-center text-xs text-zinc-500 rounded">
                <span>जाहिरात (Advertisement)</span>
              </div>
            </div>
          </aside>
        </div>

        {/* Author Bio Section */}
        <section className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 p-6 rounded-lg mt-12">
          <img 
            src={authorAvatar} 
            alt={authorName} 
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover shrink-0 border border-zinc-700" 
          />
          <div>
            <h3 className="text-lg font-bold text-white mb-1">{authorName}</h3>
            <p className="text-sm text-zinc-300 leading-relaxed">
              {authorRole} - निष्पक्ष, निर्भीड आणि लोकाभिमुख पत्रकारिता.
            </p>
          </div>
        </section>
      </article>
    </div>
  );
};