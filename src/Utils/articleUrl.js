export const slugify = (value) => String(value || '')
  .normalize('NFKD')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')
  .replace(/-{2,}/g, '-');

export const getArticleSlug = (article = {}) => {
  const storedSlug = String(article.slug || '');
  return (storedSlug && !/^article-\d+$/.test(storedSlug) ? slugify(storedSlug) : '')
    || slugify(article.titleMr || article.titleEn)
    || String(article.id || '');
};

export const getArticleUrl = (article = {}) => `/news/${encodeURIComponent(getArticleSlug(article))}`;
