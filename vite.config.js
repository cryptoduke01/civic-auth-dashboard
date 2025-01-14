import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      
      // Add this alias to polyfill process in the browser
      process: 'process/browser',
    },
  },
  define: {
    // Optionally define process in the global scope if needed
    'process.env': {},
  },
  plugins: [react()],
})
