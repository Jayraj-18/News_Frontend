import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

function deferGeneratedCss() {
  return {
    name: 'defer-generated-css',
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        return html.replace(
          /<link rel="stylesheet" crossorigin href="([^"]+\.css)">/g,
          '<link rel="preload" as="style" href="$1" crossorigin onload="this.onload=null;this.rel=\'stylesheet\'"><noscript><link rel="stylesheet" href="$1"></noscript>'
        )
      }
    }
  }
}

// NOTE: The old deferCss() plugin was REMOVED.
// It was deferring the main app CSS bundle, causing an unstyled flash on every
// page load which tanks FCP. Google Fonts are already loaded non-blocking via
// media="print"+onload in index.html. The app's own CSS (< 30 KB gzipped) must
// load normally so the first paint is styled.

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      tailwindcss(),
      deferGeneratedCss(),
    ],

    server: {
      host: '0.0.0.0',
      port: 5173,
      proxy: {
        '/api': {
          target: env.VITE_API_PROXY_TARGET || 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
        },
      },
    },

    build: {
      // Split vendor libraries into a separate cached chunk so the main bundle
      // is smaller and repeat visits are faster (vendor chunk stays cached).
      rollupOptions: {
        output: {
          manualChunks(id) {
            // Firebase is admin-only; keep it out of the public preload graph.
            if (id.includes('node_modules/firebase/')) {
              return 'firebase-vendor'
            }
            // React core — always needed, cache separately
            if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
              return 'react-vendor'
            }
            // Router — loaded on every page but smaller than react-dom
            if (id.includes('node_modules/react-router-dom/') || id.includes('node_modules/react-router/')) {
              return 'router-vendor'
            }
            // Everything else from node_modules → vendor
            if (id.includes('node_modules/')) {
              return 'vendor'
            }
          },
        },
      },
      // Increase chunk warning threshold slightly (Tailwind + React are expected to be > 500kb unminified)
      chunkSizeWarningLimit: 600,
    },
  }
})