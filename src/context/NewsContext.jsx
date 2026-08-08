import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';


const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';
const API_BASE_URL = rawApiBaseUrl.replace(/\/$/, '');
const ADMIN_TOKEN = import.meta.env.VITE_ADMIN_SECRET_TOKEN || '';

const buildApiUrl = (path) => {
  if (API_BASE_URL) {
    return `${API_BASE_URL}${path}`;
  }
  return path;
};

/** Returns headers for read requests */
const publicHeaders = { 'Content-Type': 'application/json' };

/** Returns headers for write requests (POST, PUT, DELETE) */
const adminHeaders = {
  'Content-Type': 'application/json',
  'x-admin-token': ADMIN_TOKEN,
};

// ─── Context ──────────────────────────────────────────────────────────────────
const NewsContext = createContext();

export const NewsProvider = ({ children }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ─── FETCH ALL ARTICLES ────────────────────────────────────────────────────
  const fetchArticles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(buildApiUrl('/api/articles'), {
        headers: publicHeaders,
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const json = await res.json();
      setArticles(json.data || []);
    } catch (err) {
      console.error('Failed to fetch articles from backend:', err);
      setError(err.message);
      // Graceful fallback: try loading from localStorage if backend is unreachable
      try {
        const cached = localStorage.getItem('news_articles_cache');
        if (cached) {
          setArticles(JSON.parse(cached));
          console.warn('⚠️ Loaded articles from local cache (backend unreachable).');
        }
      } catch {
        // ignore
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Load articles on mount
  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  // Keep a local cache in localStorage so the app works if the backend is temporarily down
  useEffect(() => {
    if (articles.length > 0) {
      try {
        localStorage.setItem('news_articles_cache', JSON.stringify(articles));
      } catch {
        // ignore storage quota errors
      }
    }
  }, [articles]);

  // ─── ADD ARTICLE ───────────────────────────────────────────────────────────
  const addArticle = async (newArticle) => {
    try {
const res = await fetch(buildApiUrl('/api/articles'), {
        method: 'POST',
        headers: adminHeaders,
        body: JSON.stringify(newArticle),
      });

      console.log('addArticle response status:', res.status);
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to create article');
      }
      const json = await res.json();
      // Prepend the newly created article to state
      setArticles((prev) => [json.data, ...prev]);
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
        headers: adminHeaders,
        body: JSON.stringify(updatedFields),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to update article');
      }
      const json = await res.json();
      setArticles((prev) =>
        prev.map((art) => (art.id === id ? json.data : art))
      );
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
        headers: adminHeaders,
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to delete article');
      }
      setArticles((prev) => prev.filter((art) => art.id !== id));
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