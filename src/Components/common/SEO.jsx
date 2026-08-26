// src/components/SEO.jsx
import React from 'react';
import { Helmet } from 'react-helmet-async';

const BASE_URL = 'https://palghardrushti.netlify.app';
const DEFAULT_TITLE = 'पालघर दृष्टी | महाराष्ट्रातील विश्वासार्ह बातमीपत्र';
const DEFAULT_DESCRIPTION = 'राजकारण, गुन्हेगारी, शेती, क्रीडा आणि स्थानिक घडामोडींच्या ताज्या व अचूक बातम्या.';
const DEFAULT_KEYWORDS = 'पालघर बातम्या, महाराष्ट्र बातम्या, Palghar News, Maharashtra News';
const TWITTER_HANDLE = '@PalgharDrushti';

const truncateDescription = (text, maxLength = 160) => {
  if (!text || typeof text !== 'string') return '';
  const clean = text.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim();
  return clean.length > maxLength ? `${clean.substring(0, maxLength - 3)}...` : clean;
};

const getValidImageUrl = (featuredImage, baseUrl) => {
  let rawUrl = '';

  if (typeof featuredImage === 'string') {
    rawUrl = featuredImage;
  } else if (featuredImage && typeof featuredImage === 'object') {
    rawUrl = featuredImage.url || featuredImage.src || '';
  }

  // ALLOW BASE64 DATA STRINGS DIRECTLY:
  if (!rawUrl) {
    return `${baseUrl}/logo.png`;
  }

  if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://') || rawUrl.startsWith('data:image')) {
    return rawUrl;
  }

  return `${baseUrl}${rawUrl.startsWith('/') ? rawUrl : `/${rawUrl}`}`;
};

const formatToISO = (dateInput) => {
  if (!dateInput) return new Date().toISOString();
  try {
    const parsed = new Date(dateInput);
    return isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
  } catch {
    return new Date().toISOString();
  }
};

export const SEO = ({
  title = '',             // Direct title for non-article pages
  description = '',       // Direct description for non-article pages
  article = null,
  isArticle = false,
  focusKeyword = '',
  noIndex = false,
  canonicalUrl = '',
  path = '',
}) => {
  // Resolve non-article titles and descriptions with clean fallback hierarchy
  const rawTitle = title || article?.titleMr || DEFAULT_TITLE;
  const rawDescription = description || article?.summaryMr || article?.contentMr || DEFAULT_DESCRIPTION;
  const slug = article?.slug || article?.id || '';
  
  const metaTitle = article?.metaTitle || (isArticle && article?.titleMr ? `${rawTitle} | पालघर दृष्टी` : rawTitle);
  const metaDescription = truncateDescription(article?.metaDescription || rawDescription, 160);
  
  const resolvedFocusKeyword = article?.focusKeyword || focusKeyword;
  const keywords = resolvedFocusKeyword ? `${resolvedFocusKeyword}, ${DEFAULT_KEYWORDS}` : DEFAULT_KEYWORDS;

  const imageUrl = getValidImageUrl(article?.featuredImage?.url, BASE_URL);
  
  const currentPath = path || (slug ? `/article/${slug}` : '');
  const url = `${BASE_URL}${currentPath}`;
  const resolvedCanonicalUrl = article?.canonicalUrl || canonicalUrl || url;

  const robotsDirective = (article?.noIndex ?? noIndex)
    ? 'noindex, nofollow'
    : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

  const publisherSchema = {
    '@context': 'https://schema.org',
    '@type': 'NewsMediaOrganization',
    name: 'पालघर दृष्टी',
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    sameAs: [`https://twitter.com/${TWITTER_HANDLE.replace('@', '')}`]
  };

  // NON-ARTICLE PAGES (Home, About, Contact, Categories)
  if (!isArticle || !article) {
    return (
      <Helmet>
        {/* Primary Meta */}
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={resolvedCanonicalUrl} />
        <meta name="robots" content={robotsDirective} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={`${BASE_URL}/logo.png`} />
        <meta property="og:url" content={resolvedCanonicalUrl} />
        <meta property="og:site_name" content="पालघर दृष्टी" />
        <meta property="og:locale" content="mr_IN" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content={TWITTER_HANDLE} />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={`${BASE_URL}/logo.png`} />

        {/* JSON-LD Schema */}
        <script type="application/ld+json">{JSON.stringify(publisherSchema)}</script>
      </Helmet>
    );
  }

  // ARTICLE PAGES (NewsArticle Schema)
  const publishedDate = formatToISO(article?.publishedAt || article?.createdAt);
  const modifiedDate = formatToISO(article?.updatedAt || article?.publishedAt || article?.createdAt);

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': resolvedCanonicalUrl,
    },
    headline: rawTitle,
    image: [imageUrl],
    datePublished: publishedDate,
    dateModified: modifiedDate,
    inLanguage: 'mr',
    author: {
      '@type': 'Person',
      name: article?.author?.name || 'पालघर दृष्टी संपादक',
    },
    publisher: {
      '@type': 'NewsMediaOrganization',
      name: 'पालघर दृष्टी',
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/logo.png`,
      },
    },
    description: metaDescription,
  };

  return (
    <Helmet>
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={resolvedCanonicalUrl} />
      <meta name="robots" content={robotsDirective} />

      <meta property="og:type" content="article" />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={metaTitle} />
      <meta property="og:url" content={resolvedCanonicalUrl} />
      <meta property="og:site_name" content="पालघर दृष्टी" />
      <meta property="og:locale" content="mr_IN" />

      <meta property="article:published_time" content={publishedDate} />
      <meta property="article:modified_time" content={modifiedDate} />
      {article?.categoryMr && <meta property="article:section" content={article.categoryMr} />}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={TWITTER_HANDLE} />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={imageUrl} />

      <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
    </Helmet>
  );
};

export default SEO;