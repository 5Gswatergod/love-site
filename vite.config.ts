import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// Use dynamic base: GH Pages needs "/<repo>/", local dev/build can use "/"
const repoBase = '/love-site/';
const base = process.env.GITHUB_PAGES ? repoBase : '/';

export default defineConfig({
  base: "/",
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      // files in public/ will be copied as-is; list extra assets to precache
      includeAssets: [
        'running-kirby.gif',
        'favicon.svg',
        'assets/sfx/pop.mp3',
        'assets/img/cover-512.png'
      ],
      manifest: {
        name: 'For 可愛腳小朋友',
        short_name: 'For Her',
        lang: 'zh-Hant',
        theme_color: '#0b1026',
        background_color: '#0b1026',
        display: 'standalone',
        scope: base,
        start_url: base,
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,jpg,jpeg,webp,gif,woff2}'],
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: { cacheName: 'images', expiration: { maxEntries: 120, maxAgeSeconds: 60 * 60 * 24 * 30 } }
          },
          {
            urlPattern: ({ url }) => /\.(mp3|m4a)$/i.test(url.pathname),
            handler: 'CacheFirst',
            options: { cacheName: 'audio', expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 30 } }
          }
        ]
      },
      // Enable service worker in dev if needed: `SW_DEV=true npm run dev`
      devOptions: { enabled: process.env.SW_DEV === 'true' }
    })
  ],
})
