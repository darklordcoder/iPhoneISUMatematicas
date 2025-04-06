import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/weatherforecast': {
        target: 'http://localhost:8080',
        secure: false,
        changeOrigin: true,
        
      }
    },
    open: true,


  }
})
