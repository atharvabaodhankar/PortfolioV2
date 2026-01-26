import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    host: 'localhost',
    strictPort: false
  },
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          // Keep images in a predictable location for better caching
          if (assetInfo.name && /\.(png|jpe?g|svg|gif|webp|avif)$/i.test(assetInfo.name)) {
            return 'assets/images/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        }
      }
    },
    // Ensure assets are properly optimized
    assetsInlineLimit: 0, // Don't inline images, keep them as separate files for better caching
  }
})
