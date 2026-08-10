import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

// GitHub Pages serves the site from /<repo-name>/
const BASE = '/Meir_Tamam_Memorial/'

// https://vite.dev/config/
export default defineConfig({
  base: BASE,
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'לזכרו של מאיר תמם ז״ל',
        short_name: 'מאיר תמם ז״ל',
        description: 'אתר הנצחה לזכרו של מאיר תמם ז״ל — סיפור חייו, תמונות ומילים לזכרו',
        lang: 'he',
        dir: 'rtl',
        start_url: BASE,
        scope: BASE,
        display: 'standalone',
        background_color: '#faf8f3',
        theme_color: '#1e2b4b',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Precache the whole site (pages, styles, placeholder images) so it
        // works offline at the cemetery after the first visit
        globPatterns: ['**/*.{js,css,html,svg,png,jpg,jpeg,webp,woff2}'],
        navigateFallback: BASE + 'index.html',
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'google-fonts-css' },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-files',
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
