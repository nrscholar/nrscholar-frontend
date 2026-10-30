import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import compression from 'vite-plugin-compression'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    compression({ algorithm: 'gzip', ext: '.gz' }),
  ],
  esbuild: {
    drop: mode === 'production' ? ['console', 'debugger'] : [],
    legalComments: 'none',
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      }
    }
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      }
    }
  },
  build: {
    target: 'es2020',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
      },
      format: {
        comments: false,
      },
    },
    cssCodeSplit: true,
    cssMinify: true,
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Keep Vite's internal helpers and preload polyfills in vendor-core to avoid leaking into isolated chunks
          if (id.includes('vite/') || id.includes('preload-helper') || id.includes('\0')) {
            return 'vendor-core';
          }
          if (id.includes('/src/data/neuroplay/')) {
            const match = id.match(/class(\d+)Skills/);
            if (match) {
              return `neuroplay-class-${match[1]}-data`;
            }
            return 'neuroplay-skills-common';
          }
          if (id.includes('node_modules')) {
            if (id.includes('/three/') || id.includes('\\three\\')) {
              return 'vendor-three';
            }
            if (id.includes('framer-motion')) {
              return 'vendor-framer-motion';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-lucide';
            }
            if (id.includes('@tsparticles')) {
              return 'vendor-particles';
            }
            if (id.includes('react-pdf') || id.includes('pdfjs-dist') || id.includes('react-pageflip')) {
              return 'vendor-pdf';
            }
            if (id.includes('lottie-react') || id.includes('lottie-web')) {
              return 'vendor-lottie';
            }
            if (
              id.includes('i18next') ||
              id.includes('react-i18next') ||
              id.includes('/react/') ||
              id.includes('react-dom') ||
              id.includes('react-router') ||
              id.includes('@remix-run/router') ||
              id.includes('zustand') ||
              id.includes('use-sync-external-store')
            ) {
              return 'vendor-core';
            }
          }
        }
      }
    }
  }
}))

