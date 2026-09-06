export const slugify = (value) => String(value || '')
  .normalize('NFKD')
  .replace(/[^\p{L}\p{N}\s-]/gu, '')
  .trim()
  .replace(/[\s-]+/g, '-')
  .toLowerCase();

export const getArticleSlug = (article = {}) => {
  const storedSlug = String(article.slug || '');
  if (storedSlug && !/^article-\d+$/.test(storedSlug)) return storedSlug;

  return slugify(article.titleEn || article.titleMr) || storedSlug || String(article.id || '');
};

export const getArticleUrl = (article = {}) => `/news/${encodeURIComponent(getArticleSlug(article))}`;
