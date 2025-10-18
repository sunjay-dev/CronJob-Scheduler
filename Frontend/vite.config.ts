import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    VitePWA({
      devOptions: {
        enabled: false
      },
      registerType: "autoUpdate",
      includeAssets: [
        'index.html',
        'offline.html',
        '*.webp',
        'fonts/inter/*.woff2'
      ],
      manifest: {
        name: "CronJob Scheduler",
        short_name: "CronJob",
        description: "A lightweight cron job scheduler for managing and automating tasks.",
        theme_color: "#6b21a8",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/dashboard",
        scope: "/",
        orientation: "portrait-primary",
        icons: [
          {
            src: "/icons/web-app-manifest-512x512.webp",
            sizes: "512x512",
            type: "image/webp",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        navigateFallback: '/index.html',
        navigateFallbackAllowlist: [
          /^\/$/,
          /^\/dashboard/,
        ],
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.mode === 'navigate',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'pages-cache',
              networkTimeoutSeconds: 3,
              expiration: {
                maxEntries: 20,
              },
            },
          },
          {
            urlPattern: ({ request }) =>
              ['style', 'script', 'worker'].includes(request.destination),
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'assets-cache',
              expiration: { maxEntries: 50 },
            },
          },
          {
            urlPattern: ({ request }) =>
              ['image', 'font'].includes(request.destination),
            handler: 'CacheFirst',
            options: {
              cacheName: 'static-resources',
              expiration: { maxEntries: 50 },
            },
          },
        ],
        cleanupOutdatedCaches: true,
      },
    }),
  ],
})