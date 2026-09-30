import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    proxy: {
      "/api": {
        target: process.env.HERMES_API_ORIGIN || "http://127.0.0.1:5000",
        changeOrigin: true,
      },
    },
  },
  preview: {
    host: "0.0.0.0",
    proxy: {
      "/api": {
        target: process.env.HERMES_API_ORIGIN || "http://127.0.0.1:5000",
        changeOrigin: true,
      },
    },
  },
})
