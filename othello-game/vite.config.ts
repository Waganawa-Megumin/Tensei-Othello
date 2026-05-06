import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  // Use relative asset paths so the same dist/ works for Cloudflare Pages,
  // file:// previews and Capacitor's Android WebView.
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      workbox: {
        // Allow caching of avatar images (the largest static assets).
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        // v0.33.6: take over immediately so users running an older
        // service worker get the new bundle on next page load instead
        // of having to reload twice. Without these, the new SW stays
        // in `waiting` state — the historical cause of "I deployed the
        // freeze fix but the user still hits the same freeze".
        skipWaiting: true,
        clientsClaim: true,
      },
      manifest: {
        name: '召喚されたらオセロ世界でした！',
        short_name: '召喚オセロ',
        description: '異界『盤上世界』に召喚され、20人の達人を打ち破るオセロアドベンチャー',
        lang: 'ja',
        start_url: '.',
        scope: '.',
        display: 'standalone',
        // Allow rotation. Phones default to portrait via the device, but
        // landscape works for users who prefer it. Capacitor Phase 3
        // similarly uses screenOrientation="user" so the OS decides.
        orientation: 'any',
        background_color: '#1c1810',
        theme_color: '#1c1810',
        icons: [
          {
            src: 'favicon.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
});
