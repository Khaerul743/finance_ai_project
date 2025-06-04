import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/ 
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // Mengizinkan akses dari semua network interfaces (0.0.0.0)
    port: 5173, // Port default Vite
    strictPort: true, // Gunakan port yang spesifik
    hmr: {
      clientPort: 443 // Port untuk Hot Module Replacement ketika menggunakan HTTPS (ngrok)
    },
    cors: true, // Mengizinkan CORS
    allowedHosts: [
      'saving.my.id',
      'www.saving.my.id',
      'localhost',
      '127.0.0.1',
      '.ngrok-free.app', // Mengizinkan semua subdomain ngrok-free.app
      '.ngrok.io', // Untuk kompatibilitas dengan domain ngrok lama
    ]
  }
})
