import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

export const SEO = ({ article, isArticle = false }) => {
  const { lang } = useLanguage();

  if (!isArticle || !article) {
    return (
      <>
        <title>महाराष्ट्र न्यूज 24 | महाराष्ट्रातील विश्वासार्ह बातमीपत्र</title>
        <meta name="description" content="राजकारण, गुन्हेगारी, शेती, क्रीडा आणि स्थानिक घडामोडींच्या ताज्या व अचूक बातम्या." />
        <link rel="canonical" href={window.location.origin} />
      </>
    );
  }

  const title = article.title[lang] || article.title.mr;
  const description = article.summary[lang] || article.summary.mr;
  const url = `${window.location.origin}/article/${article.slug}`;

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    },
    "headline": title,
    "image": [article.image.url],
    "datePublished": article.publishedAt,
    "dateModified": article.updatedAt,
    "author": {
      "@type": "Person",
      "name": article.author.name
    },
    "publisher": {
      "@type": "Organization",
      "name": "Maharashtra News 24",
      "logo": {
        "@type": "ImageObject",
        "url": `${window.location.origin}/logo.png`
      }
    },
    "description": description
  };

  return (
    <>
      <title>{`${title} | महाराष्ट्र न्यूज 24`}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:type" content="article" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={article.image.url} />
      <meta property="og:url" content={url} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={article.image.url} />

      {/* JSON-LD Schema */}
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
    </>
  );
};