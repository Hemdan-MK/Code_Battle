import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    host: '0.0.0.0', // allows access from other devices on the same network
    port: 5173,       // default Vite port (you can change it)
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
