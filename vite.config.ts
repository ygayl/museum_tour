import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks for better caching
          vendor: ['react', 'react-dom'],
          icons: ['lucide-react'],
          // Separate analytics functionality
          analytics: ['src/hooks/useAnalytics.ts', 'src/lib/analytics.ts'],
          // Separate heavy audio components that aren't needed initially
          audio: ['src/components/CompactAudioPlayer.tsx'],
          // Separate tour components
          tour: ['src/components/TourPage.tsx', 'src/hooks/useTourProgress.ts'],
        },
      },
    },
    // Optimize bundle for faster parsing
    target: 'es2020',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: ['log'], // Only drop console.log, keep error/warn for debugging
        drop_debugger: true,
      },
    },
    // Inline critical CSS
    cssCodeSplit: true,
    // Experimental: inline styles in JS for faster initial paint
    assetsInlineLimit: 4096,
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    // Enable SPA routing - fallback to index.html for all routes
    host: true,
  },
  preview: {
    // Enable SPA routing for preview server too
    host: true,
  },
});
