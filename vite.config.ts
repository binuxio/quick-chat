import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv';
dotenv.config();

const SERVER_ADDRESS = process.env.SERVER_ADDRESS || 'http://localhost:4050';
const VITE_SERVER_PORT = parseInt(process.env.VITE_SERVER_PORT) || 3080;

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': './src',
    }
  },
  server: {
    host: "0.0.0.0",
    port: VITE_SERVER_PORT,
    proxy: {
      '/api': {
        target: SERVER_ADDRESS,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/ws': {
        target: SERVER_ADDRESS,
        // changeOrigin: true,
        ws: true,
      },
    }
  }
})
