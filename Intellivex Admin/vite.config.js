import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, './src'),
      },
    },
    server: {
      port: 5174,
      // Dev only: the browser calls /api on localhost and Vite forwards it to the
      // Laravel server. `secure: false` lets that hop accept the server's
      // self-signed certificate, which browsers reject (ERR_CERT_AUTHORITY_INVALID).
      // Same origin also means no CORS. Set VITE_API_PROXY_TARGET in .env.development.
      // `/storage` serves uploaded images the same way (see VITE_MEDIA_URL).
      proxy: env.VITE_API_PROXY_TARGET
        ? {
            '/api': { target: env.VITE_API_PROXY_TARGET, changeOrigin: true, secure: false },
            '/storage': { target: env.VITE_API_PROXY_TARGET, changeOrigin: true, secure: false },
          }
        : undefined,
    },
    build: {
      rollupOptions: {
        output: {
          // Long-lived vendor chunks so admin page changes don't bust them.
          manualChunks: {
            react: ['react', 'react-dom', 'react-router-dom'],
            ui: ['radix-ui', 'lucide-react', 'sonner'],
            charts: ['recharts'],
          },
        },
      },
    },
  }
})
