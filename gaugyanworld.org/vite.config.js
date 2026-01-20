import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    base: '/', // Changed to absolute path for sub-route support
    build: {
      sourcemap: true,
      // Enable code splitting
      rollupOptions: {
        output: {
          manualChunks: {
            // Vendor chunks
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'firebase-vendor': ['firebase/app', 'firebase/auth'],
            'ui-vendor': ['lucide-react'],
          },
        },
      },
      // Chunk size warnings
      chunkSizeWarningLimit: 5000,
      // Minification
      minify: false,
      terserOptions: {
        compress: {
          drop_console: false, // Keep logs for debugging
          drop_debugger: true,
        },
      },
    },
    server: {
      port: 5175,
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:5001',
          changeOrigin: true,
        },
      },
      // Define global constants for replacement
      define: {
        'process.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL),
      }
    },
  }
})
