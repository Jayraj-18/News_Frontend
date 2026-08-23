import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';
const API_BASE_URL = rawApiBaseUrl.replace(/\/$/, '');
const buildApiUrl = (path) => {
  if (API_BASE_URL) {
    return `${API_BASE_URL}${path}`;
  }
  return path;
};

/** Returns headers for read requests */
const publicHeaders = { 'Content-Type': 'application/json' };

/** Returns headers for authenticated write requests. */
const getAdminHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('adminToken') || ''}`,
});

// ─── Cache helpers ─────────────────────────────────────────────────────────────
const CACHE_KEY = 'news_articles_cache';
const CACHE_TS_KEY = 'news_articles_cache_ts';
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function readCache() {
  try {
    const ts = parseInt(localStorage.getItem(CACHE_TS_KEY) || '0', 10);
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return { articles: null, ts: 0 };
    return { articles: JSON.parse(raw), ts };
  } catch {
    return { articles: null, ts: 0 };
  }
}

let writeTimer = null;
function writeCache(articles) {
  clearTimeout(writeTimer);
  writeTimer = setTimeout(() => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(articles));
      localStorage.setItem(CACHE_TS_KEY, String(Date.now()));
    } catch {
      // ignore storage quota errors
    }
  }, 300); // debounce 300 ms to avoid storage thrashing
}

// ─── Context ──────────────────────────────────────────────────────────────────
const NewsContext = createContext();

export const NewsProvider = ({ children }) => {
  // Seed articles from localStorage immediately so the first render shows data
  const { articles: cachedArticles, ts: cachedTs } = readCache();

  const [articles, setArticles] = useState(cachedArticles || []);
  // If we already have fresh-enough cache, skip the loading state entirely
  const isFresh = Boolean(cachedArticles) && Date.now() - cachedTs < CACHE_TTL_MS;
  const [loading, setLoading] = useState(!isFresh);
  const [error, setError] = useState(null);

  // Ref to prevent duplicate concurrent revalidation calls
  const revalidating = useRef(false);

  // ─── FETCH ALL ARTICLES ────────────────────────────────────────────────────
  const fetchArticles = useCallback(async ({ silent = false } = {}) => {
    if (revalidating.current) return;
    revalidating.current = true;

    if (!silent) {
      setLoading(true);
      setError(null);
    }

    try {
      const res = await fetch(buildApiUrl('/api/articles'), {
        headers: publicHeaders,
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const json = await res.json();
      const fresh = json.data || [];
      setArticles(fresh);
      writeCache(fresh);
    } catch (err) {
      console.error('Failed to fetch articles from backend:', err);
      if (!silent) {
        setError(err.message);
        // Graceful fallback: show cache if network failed on hard load
        const { articles: fallback } = readCache();
        if (fallback && fallback.length > 0) {
          setArticles(fallback);
          console.warn('⚠️ Loaded articles from local cache (backend unreachable).');
        }
      }
    } finally {
      revalidating.current = false;
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isFresh) {
      // Cache is fresh: render immediately, still revalidate silently in background
      fetchArticles({ silent: true });
    } else {
      // Cache is stale or empty: show loading indicator, fetch properly
      fetchArticles({ silent: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── ADD ARTICLE ───────────────────────────────────────────────────────────
  const addArticle = async (newArticle) => {
    try {
      const res = await fetch(buildApiUrl('/api/articles'), {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify(newArticle),
      });

      console.log('addArticle response status:', res.status);
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to create article');
      }
      const json = await res.json();
      // Prepend the newly created article to state
      setArticles((prev) => {
        const next = [json.data, ...prev];
        writeCache(next);
        return next;
      });
      return json.data;
    } catch (err) {
      console.error('addArticle error:', err);
      throw err;
    }
  };

  // ─── UPDATE ARTICLE ────────────────────────────────────────────────────────
  const updateArticle = async (id, updatedFields) => {
    try {
      const res = await fetch(buildApiUrl(`/api/articles/${id}`), {
        method: 'PUT',
        headers: getAdminHeaders(),
        body: JSON.stringify(updatedFields),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to update article');
      }
      const json = await res.json();
      setArticles((prev) => {
        const next = prev.map((art) => (art.id === id ? json.data : art));
        writeCache(next);
        return next;
      });
      return json.data;
    } catch (err) {
      console.error('updateArticle error:', err);
      throw err;
    }
  };

  // ─── DELETE ARTICLE ────────────────────────────────────────────────────────
  const deleteArticle = async (id) => {
    try {
      const res = await fetch(buildApiUrl(`/api/articles/${id}`), {
        method: 'DELETE',
        headers: getAdminHeaders(),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to delete article');
      }
      setArticles((prev) => {
        const next = prev.filter((art) => art.id !== id);
        writeCache(next);
        return next;
      });
    } catch (err) {
      console.error('deleteArticle error:', err);
      throw err;
    }
  };

  // ─── GET ARTICLE BY ID OR SLUG ─────────────────────────────────────────────
  // First checks the in-memory array (fast), falls back to an API call
  const getArticleByIdOrSlug = useCallback(
    async (identifier) => {
      if (!identifier) return null;

      // Check in-memory cache first
      const cached = articles.find(
        (art) => String(art.id) === String(identifier) || art.slug === identifier
      );
      if (cached) return cached;

      // Fetch from API
      try {
        const res = await fetch(buildApiUrl(`/api/articles/${identifier}`), {
          headers: publicHeaders,
        });
        if (!res.ok) return null;
        const json = await res.json();
        return json.data || null;
      } catch {
        return null;
      }
    },
    [articles]
  );

  return (
    <NewsContext.Provider
      value={{
        articles,
        loading,
        error,
        fetchArticles,
        addArticle,
        updateArticle,
        deleteArticle,
        getArticleByIdOrSlug,
      }}
    >
      {children}
    </NewsContext.Provider>
  );
};

export const useNews = () => useContext(NewsContext);