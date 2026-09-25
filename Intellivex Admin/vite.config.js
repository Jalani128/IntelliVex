import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  server: {
    port: 5174,
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
})
