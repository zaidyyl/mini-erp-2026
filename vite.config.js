import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 3000,
    open: true,
    base: '/mini-erp-2026/'
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
