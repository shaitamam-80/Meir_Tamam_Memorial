import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

// GitHub Pages serves the site from /<repo-name>/; Vercel serves from the root.
// Vercel sets the VERCEL env var automatically during its builds.
const BASE = process.env.VERCEL ? '/' : '/Meir_Tamam_Memorial/'
const publicSiteUrl = new URL(process.env.VITE_PUBLIC_SITE_URL || 'https://meir-tamam-memorial.vercel.app/')
if (publicSiteUrl.protocol !== 'https:') throw new Error('VITE_PUBLIC_SITE_URL must use HTTPS')
publicSiteUrl.search = ''
publicSiteUrl.hash = ''
const siteBaseUrl = publicSiteUrl.href.replace(/\/$/, '')

// https://vite.dev/config/
export default defineConfig({
  base: BASE,
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'memorial-site-metadata',
      transformIndexHtml: (html) => html.replaceAll('__PUBLIC_SITE_URL__', siteBaseUrl),
    },
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png', 'pwa-192x192.png', 'pwa-512x512.png'],
      manifest: {
        name: 'לזכרו של מאיר תמם ז״ל',
        short_name: 'מאיר תמם ז״ל',
        description: 'אתר הנצחה לזכרו של מאיר תמם ז״ל — סיפור חייו, תמונות ומילים לזכרו',
        lang: 'he',
        dir: 'rtl',
        start_url: BASE,
        scope: BASE,
        display: 'standalone',
        background_color: '#0f172a',
        theme_color: '#0f172a',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Keep the app shell available offline without downloading unopened albums.
        globPatterns: ['**/*.{js,css,html,woff2}'],
        navigateFallback: BASE + 'index.html',
        runtimeCaching: [
          {
            urlPattern: /\/images\/.*\.(?:webp|jpe?g|png)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'memorial-viewed-images',
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 30, purgeOnQuotaError: true },
              cacheableResponse: { statuses: [200] },
            },
          },
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
