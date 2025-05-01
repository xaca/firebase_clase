import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

//base:"/firebase_clase/", -> Para que funcione en github

// https://vite.dev/config/
export default defineConfig({
  base:"/",
  plugins: [react(),tailwindcss(),],
})
