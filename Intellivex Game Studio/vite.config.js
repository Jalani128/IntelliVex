import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const API_ORIGIN = 'https://api.theintellivex.com/intellivex/public'

// Served from the root of https://gamestudio.theintellivex.com/.
export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
  server: {
    port: 5176,
    // Dev only: Cloudflare hotlink protection rejects images requested from localhost (403),
    // so .env.development points VITE_STUDIO_MEDIA_URL at /storage and this forwards it.
    proxy: { '/storage': { target: API_ORIGIN, changeOrigin: true, headers: { referer: `${API_ORIGIN}/` } } },
  },
})
