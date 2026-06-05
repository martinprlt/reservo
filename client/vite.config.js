import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /\/api\/.*/i,
            handler: 'NetworkFirst',
            options: { cacheName: 'api-cache', networkTimeoutSeconds: 5 }
          }
        ]
      },
      manifest: {
        name: 'Slotify - Panel de Admin',
        short_name: 'Slotify',
        description: 'Sistema de turnos para tu negocio',
        theme_color: '#4648d4',
        background_color: '#fcf8ff',
        display: 'standalone',
        scope: '/',
        start_url: '/admin',
        icons: [
          { src: '/icon.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      },
      devOptions: { enabled: false }
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          dates: ['date-fns'],
          state: ['zustand'],
        }
      }
    }
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true
      }
    }
  }
});
