import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    cors: true,
    allowedHosts: ['b761-102-89-84-79.ngrok-free.app'],
    proxy: {
      '/api': {
        target: 'b761-102-89-84-79.ngrok-free.app',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
