import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { initialArticles } from '../data/initialArticle';

const rawApiBaseUrl = (import.meta.env.VITE_API_BASE_URL || '').trim();
const defaultLocalApiBaseUrl = typeof window !== 'undefined' && /localhost|127\.0\.0\.1/.test(window.location.hostname)
  ? 'http://localhost:5000'
  : '';
const productionApiBaseUrl = 'https://news-backend-sqmg.onrender.com';
const API_BASE_URL = (rawApiBaseUrl || defaultLocalApiBaseUrl || productionApiBaseUrl).replace(/\/$/, '');

const buildApiUrl = (path) => {
  if (!path.startsWith('/')) path = `/${path}`;
  if (API_BASE_URL) {
    return `${API_BASE_URL}${path}`;
  }
  return path;
};

const parseApiResponse = async (res, fallbackMessage = 'Unexpected server response') => {
  const text = await res.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    if (text.includes('<html') || text.includes('<!doctype')) {
      throw new Error(fallbackMessage);
    }
    throw new Error(text.slice(0, 180) || fallbackMessage);
  }
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
const CACHE_TTL_MS = 2 * 60 * 1000; // 2 minutes — keep news fresh

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

// Fire a lightweight ping to pre-warm the Render server before the main fetch.
// This means by the time fetchArticles() actually runs, the server is already awake.
async function pingServer() {
  try {
    await fetch(buildApiUrl('/ping'), { method: 'GET', cache: 'no-store' });
  } catch {
    // Ignore — ping is best-effort
  }
}

export const NewsProvider = ({ children }) => {
  // Seed articles from localStorage immediately so the first render shows data
  const { articles: cachedArticles, ts: cachedTs } = readCache();

  const [articles, setArticles] = useState(cachedArticles || initialArticles);
  // If we already have fresh-enough cache, skip the loading state entirely
  const isFresh = Boolean(cachedArticles) && Date.now() - cachedTs < CACHE_TTL_MS;
  const [loading, setLoading] = useState(!isFresh);
  const [error, setError] = useState(null);
  // True when a fetch is taking >5 s (server cold-start scenario)
  const [slowFetch, setSlowFetch] = useState(false);

  // Ref to prevent duplicate concurrent revalidation calls
  const revalidating = useRef(false);

  // ─── FETCH ALL ARTICLES ────────────────────────────────────────────────────
  const fetchArticles = useCallback(async ({ silent = false } = {}) => {
    if (revalidating.current) return;
    revalidating.current = true;

    if (!silent) {
      setLoading(true);
      setError(null);
      setSlowFetch(false);
    }

    // Show a "server waking up" hint if the request takes longer than 5 seconds
    const slowTimer = !silent
      ? setTimeout(() => setSlowFetch(true), 5000)
      : null;

    try {
      const res = await fetch(buildApiUrl('/api/articles'), {
        headers: publicHeaders,
        cache: 'no-store',
      });

      const json = await parseApiResponse(res, 'Backend is not reachable or returned an invalid response.');
      if (!res.ok) {
        throw new Error(json?.message || `Server error: ${res.status}`);
      }

      const fresh = json?.data || [];
      setArticles(fresh);
      writeCache(fresh);
    } catch (err) {
      console.error('Failed to fetch articles from backend:', err);
      if (!silent) {
        setError(err.message);
        const { articles: fallback } = readCache();
        if (fallback && fallback.length > 0) {
          setArticles(fallback);
          console.warn('⚠️ Loaded articles from local cache (backend unreachable).');
        }
      }
    } finally {
      clearTimeout(slowTimer);
      revalidating.current = false;
      if (!silent) {
        setLoading(false);
        setSlowFetch(false);
      }
    }
  }, []);

  useEffect(() => {
    // Let Render finish waking the process before opening the database request.
    // Starting both requests together still leaves the article request queued
    // behind the cold start, which is especially visible on mobile networks.
    const bootstrap = async () => {
      await pingServer();
      await fetchArticles({ silent: isFresh });
    };

    bootstrap();
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
      const json = await parseApiResponse(res, 'The article could not be published. Please check the backend URL and admin token.');
      if (!res.ok) {
        throw new Error(json?.message || `Failed to create article (${res.status})`);
      }

      const savedArticle = json?.data || newArticle;
      setArticles((prev) => {
        const next = [savedArticle, ...prev];
        writeCache(next);
        return next;
      });
      return savedArticle;
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

      const json = await parseApiResponse(res, 'The article update request failed because the backend is unavailable or returned an invalid response.');
      if (!res.ok) {
        throw new Error(json?.message || `Failed to update article (${res.status})`);
      }

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
      // The list endpoint intentionally contains summaries only. Fetch the
      // full record before opening an article page.
      if (cached && (cached.contentMr || cached.content || cached.galleryImages)) return cached;

      // Fetch from API
      try {
        const res = await fetch(buildApiUrl(`/api/articles/${identifier}`), {
          headers: publicHeaders,
          cache: 'no-store',
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
        slowFetch,
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