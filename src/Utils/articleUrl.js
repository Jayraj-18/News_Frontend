export const slugify = (value) => String(value || '')
  .normalize('NFKD')
  .replace(/[^\p{L}\p{M}\p{N}\s-]/gu, '')
  .trim()
  .replace(/[\s-]+/g, '-')
  .toLowerCase();

export const getArticleSlug = (article = {}) => {
  const storedSlug = String(article.slug || '');
  return slugify(article.titleMr || article.titleEn)
    || (storedSlug && !/^article-\d+$/.test(storedSlug) ? storedSlug : '')
    || String(article.id || '');
};

export const getArticleUrl = (article = {}) => `/news/${encodeURIComponent(getArticleSlug(article))}`;
