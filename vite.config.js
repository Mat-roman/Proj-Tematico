import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 1420,
    strictPort: true,
    // Sem isso o Vite tenta vigiar os binarios que o Rust esta compilando e morre com EBUSY.
    watch: { ignored: ['**/src-tauri/**'] },
  },
})
