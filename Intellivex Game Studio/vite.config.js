import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Served from the root of https://gamestudio.theintellivex.com/.
export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
  server: { port: 5176 },
})
