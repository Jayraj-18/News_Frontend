import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

const defaultDescription = 'राजकारण, गुन्हेगारी, शेती, क्रीडा आणि स्थानिक घडामोडींच्या ताज्या व अचूक बातम्या.';
const defaultTitle = 'पालघर दृष्टी | महाराष्ट्रातील विश्वासार्ह बातमीपत्र';

export const SEO = ({ article, isArticle = false }) => {
  const { lang } = useLanguage();

  const title =
    article?.title?.[lang] ||
    article?.title?.mr ||
    defaultTitle;
  const description =
    article?.summary?.[lang] ||
    article?.summary?.mr ||
    defaultDescription;
  const slug = article?.slug || '';
  const imageUrl = article?.image?.url || `${window.location.origin}/logo.png`;
  const url = `${window.location.origin}${slug ? `/article/${slug}` : ''}`;

  if (!isArticle || !article) {
    return (
      <>
        <title>{defaultTitle}</title>
        <meta name="description" content={defaultDescription} />
        <link rel="canonical" href={window.location.origin} />
      </>
    );
  }

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    headline: title,
    image: [imageUrl],
    datePublished: article?.publishedAt || new Date().toISOString(),
    dateModified: article?.updatedAt || article?.publishedAt || new Date().toISOString(),
    author: {
      '@type': 'Person',
      name: article?.author?.name || 'Maharashtra News 24',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Maharashtra News 24',
      logo: {
        '@type': 'ImageObject',
        url: `${window.location.origin}/logo.png`,
      },
    },
    description,
  };

  return (
    <>
      <title>{`${title} | पालघर दृष्टी`}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:type" content="article" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={url} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {/* JSON-LD Schema */}
      <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
    </>
  );
};
