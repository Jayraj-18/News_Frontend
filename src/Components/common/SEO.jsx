// src/components/SEO.jsx
import React from 'react';
import { Helmet } from 'react-helmet-async';

const BASE_URL = 'https://palghardrushti.netlify.app';
const DEFAULT_TITLE = 'पालघर दृष्टी | महाराष्ट्रातील विश्वासार्ह बातमीपत्र';
const DEFAULT_DESCRIPTION = 'राजकारण, गुन्हेगारी, शेती, क्रीडा आणि स्थानिक घडामोडींच्या ताज्या व अचूक बातम्या.';

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
    return new Date(dateInput).toISOString();
  } catch {
    return new Date().toISOString();
  }
};

export const SEO = ({ article, isArticle = false }) => {
  // Extract values directly matching your Firebase NewsModel
  const title = article?.titleMr || DEFAULT_TITLE;
  const description = article?.summaryMr || article?.contentMr || DEFAULT_DESCRIPTION;
  const slug = article?.slug || article?.id || '';
  
  const imageUrl = getValidImageUrl(article?.featuredImage?.url, BASE_URL);
  const url = `${BASE_URL}${slug ? `/article/${slug}` : ''}`;

  // Default SEO fallback for non-article pages (Homepage, Category pages, etc.)
  if (!isArticle || !article) {
    return (
      <Helmet>
        <title>{DEFAULT_TITLE}</title>
        <meta name="description" content={DEFAULT_DESCRIPTION} />
        <link rel="canonical" href={BASE_URL} />

        {/* Open Graph / Facebook / WhatsApp */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={DEFAULT_TITLE} />
        <meta property="og:description" content={DEFAULT_DESCRIPTION} />
        <meta property="og:image" content={`${BASE_URL}/logo.png`} />
        <meta property="og:url" content={BASE_URL} />
        <meta property="og:site_name" content="पालघर दृष्टी" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={DEFAULT_TITLE} />
        <meta name="twitter:description" content={DEFAULT_DESCRIPTION} />
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
      '@id': url,
    },
    headline: title,
    image: [imageUrl],
    datePublished: formatToISO(article?.publishedAt),
    dateModified: formatToISO(article?.updatedAt || article?.publishedAt),
    author: {
      '@type': 'Person',
      name: article?.author?.name || 'पालघर दृष्टी',
    },
    publisher: {
      '@type': 'Organization',
      name: 'पालघर दृष्टी',
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/logo.png`,
      },
    },
    description,
  };

  return (
    <Helmet>
      {/* Primary HTML Meta Tags */}
      <title>{`${title} | पालघर दृष्टी`}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook / WhatsApp */}
      <meta property="og:type" content="article" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="पालघर दृष्टी" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {/* JSON-LD Schema Insertion */}
      <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
    </Helmet>
  );
};

export default SEO;