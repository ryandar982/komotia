import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // Jika sedang build (deploy), pakai /komotia/. Jika lokal, pakai /
  base: command === 'build' ? '/komotia/' : '/', 
}))