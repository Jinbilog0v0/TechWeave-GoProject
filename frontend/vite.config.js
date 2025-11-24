import { defineConfig } from 'vite'
import path from "path"
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Fix for __dirname in ES Modules
const __dirname = path.resolve();

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  }, 

  server: { 
    port: 5173,      
    strictPort: true, 
  },
})