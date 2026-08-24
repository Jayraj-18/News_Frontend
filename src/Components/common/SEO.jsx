// src/components/SEO.jsx
import React from 'react';
import { Helmet } from 'react-helmet-async';

const BASE_URL = 'https://palghardrushti.netlify.app';
const DEFAULT_TITLE = 'पालघर दृष्टी | महाराष्ट्रातील विश्वासार्ह बातमीपत्र';
const DEFAULT_DESCRIPTION = 'राजकारण, गुन्हेगारी, शेती, क्रीडा आणि स्थानिक घडामोडींच्या ताज्या व अचूक बातम्या.';
const DEFAULT_KEYWORDS = 'पालघर बातम्या, महाराष्ट्र बातम्या, Palghar News, Maharashtra News';
const TWITTER_HANDLE = '@PalgharDrushti';

/**
 * Cleanly truncates text to target character count limits for SEO standards.
 */
const truncateText = (text, maxLength) => {
  if (!text || typeof text !== 'string') return '';
  const clean = text.replace(/\s+/g, ' ').trim();
  return clean.length > maxLength ? `${clean.substring(0, maxLength - 3)}...` : clean;
};

/**
 * Safely resolves and validates image URLs for Google & Social Crawlers.
 * Fallbacks to logo.png if a Base64 string is detected (as meta tags reject Base64 strings).
 */
const getValidImageUrl = (imageSrc, baseUrl) => {
  if (!imageSrc || typeof imageSrc !== 'string') {
    return `${baseUrl}/logo.png`;
  }
  
  // 1. Base64 strings cannot be parsed inside Open Graph / Schema meta tags
  if (imageSrc.startsWith('data:image')) {
    return `${baseUrl}/logo.png`;
  }
  
  // 2. Full HTTP/HTTPS hosted links (Cloudinary, S3, Firebase Storage)
  if (imageSrc.startsWith('http://') || imageSrc.startsWith('https://')) {
    return imageSrc;
  }
  
  // 3. Relative local paths (e.g., /logo.png or images/news.webp)
  return `${baseUrl}${imageSrc.startsWith('/') ? imageSrc : `/${imageSrc}`}`;
};

/**
 * Ensures all dates convert cleanly to ISO 8601 string format required by Schema.org
 */
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
  article,
  isArticle = false,
  focusKeyword = '',
  noIndex = false,
  canonicalUrl = '',
  path = '',
}) => {
  // Extract values matching your Firebase NewsModel
  const rawTitle = article?.titleMr || DEFAULT_TITLE;
  const rawDescription = article?.summaryMr || article?.contentMr || DEFAULT_DESCRIPTION;
  const slug = article?.slug || article?.id || '';
  
  // Character count optimizations (Title ~60 chars, Description ~160 chars)
  const generatedTitle = isArticle && article?.titleMr ? `${rawTitle} | पालघर दृष्टी` : rawTitle;
  const metaTitle = truncateText(article?.metaTitle || generatedTitle, 60);
  const metaDescription = truncateText(article?.metaDescription || rawDescription, 160);
  const resolvedFocusKeyword = article?.focusKeyword || focusKeyword;
  const keywords = resolvedFocusKeyword ? `${resolvedFocusKeyword}, ${DEFAULT_KEYWORDS}` : DEFAULT_KEYWORDS;

  const imageUrl = getValidImageUrl(article?.featuredImage?.url, BASE_URL);
  
  // Canonical URL construction
  const currentPath = path || (slug ? `/article/${slug}` : '');
  const url = `${BASE_URL}${currentPath}`;
  const resolvedCanonicalUrl = article?.canonicalUrl || canonicalUrl || url;

  const robotsDirective = (article?.noIndex ?? noIndex)
    ? 'noindex, nofollow'
    : 'index, follow, max-image-preview:large, max-snippet:-1';

  // Default SEO fallback for non-article pages (Homepage, Category pages, etc.)
  if (!isArticle || !article) {
    return (
      <Helmet>
        {/* Primary Meta */}
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={keywords} />
        <link rel="canonical" href={resolvedCanonicalUrl} />
        <meta name="robots" content={robotsDirective} />

        {/* Open Graph / Facebook / WhatsApp */}
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
      </Helmet>
    );
  }

  // Schema.org NewsArticle JSON-LD Structure
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': resolvedCanonicalUrl,
    },
    headline: truncateText(rawTitle, 110),
    image: [imageUrl],
    datePublished: formatToISO(article?.publishedAt || article?.createdAt),
    dateModified: formatToISO(article?.updatedAt || article?.publishedAt || article?.createdAt),
    author: {
      '@type': 'Person',
      name: article?.author?.name || 'पालघर दृष्टी संपादक',
    },
    publisher: {
      '@type': 'Organization',
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
      {/* Primary HTML Meta Tags */}
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={resolvedCanonicalUrl} />
      <meta name="robots" content={robotsDirective} />

      {/* Open Graph / Facebook / WhatsApp */}
      <meta property="og:type" content="article" />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:alt" content={metaTitle} />
      <meta property="og:url" content={resolvedCanonicalUrl} />
      <meta property="og:site_name" content="पालघर दृष्टी" />
      <meta property="og:locale" content="mr_IN" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={TWITTER_HANDLE} />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={imageUrl} />

      {/* JSON-LD Schema Insertion */}
      <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
    </Helmet>
  );
};

export default SEO;