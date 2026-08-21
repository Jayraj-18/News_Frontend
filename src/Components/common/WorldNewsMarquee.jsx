import React, { useEffect, useRef } from 'react';
import { useNews } from '../../context/NewsContext';
import { useLanguage } from '../../context/LanguageContext';

/**
 * WorldNewsMarquee
 * ─────────────────────────────────────────────────────────────────────────────
 * Displays a continuously scrolling marquee of the latest 4 "world" category
 * articles. The marquee updates in real-time whenever a new world article is
 * added (because it reads directly from NewsContext state).
 */
export const WorldNewsMarquee = () => {
  const { articles } = useNews();
  const { lang } = useLanguage();
  const trackRef = useRef(null);

  // ─── Derive latest 4 world articles ────────────────────────────────────────
  const worldNews = articles
    .filter((a) => (a.category || '').toLowerCase() === 'world' && a.status !== 'draft')
    .slice(0, 4);

  // Re-trigger animation when articles change (reset → play)
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    track.style.animation = 'none';
    // Force reflow so removing the animation takes effect before re-adding it
    void track.offsetWidth;
    track.style.animation = '';
  }, [worldNews.length]);

  if (worldNews.length === 0) return null;

  const label = lang === 'mr' ? 'जागतिक' : 'WORLD';

  // Duplicate items so the marquee loops seamlessly
  const items = [...worldNews, ...worldNews];

  return (
    <div
      className="world-marquee-bar"
      role="marquee"
      aria-label={lang === 'mr' ? 'जागतिक बातम्या' : 'World News Ticker'}
    >
      {/* ── Label badge ── */}
      <span className="world-marquee-label" aria-hidden="true">
        <span className="world-marquee-dot" />
        {label}
      </span>

      {/* ── Scrolling track ── */}
      <div className="world-marquee-viewport" aria-live="polite">
        <div className="world-marquee-track" ref={trackRef}>
          {items.map((article, idx) => (
            <a
              key={`${article.id}-${idx}`}
              href={`/article/${article.slug || article.id}`}
              className="world-marquee-item"
              tabIndex={idx < worldNews.length ? 0 : -1}
            >
              <span className="world-marquee-separator" aria-hidden="true">◆</span>
              <span className="world-marquee-title">
                {article.titleMr || article.titleEn || 'Untitled'}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
