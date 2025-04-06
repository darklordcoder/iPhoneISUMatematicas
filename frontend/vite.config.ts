import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/weatherforecast': {
        target: 'https://localhost:7168',
        secure: false,
        changeOrigin: true,
        
      }
    },
    open: true,


  }
})
