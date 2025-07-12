import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Redirige las peticiones que empiezan por /api a tu backend
      '/api': {
        target: 'http://localhost:8080', // La URL de tu servidor backend
        changeOrigin: true,
      }
    }
  }
})
