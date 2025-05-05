import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    host: '0.0.0.0',
    hmr: {
      port: 3001,
      clientPort: 3001
    },
    watch: {
      usePolling: true,
      interval: 2000, // Increased interval to reduce file system load
      ignored: ['**/node_modules/**', '**/dist/**'] // Explicitly ignore heavy directories
    }
  },
  preview: {
    port: 3001,
    host: true
  },
  build: {
    target: 'es2020',
    sourcemap: true,
    chunkSizeWarningLimit: 4000, // Increased from 2000 to 4000
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: undefined // Disable manual chunk splitting to reduce complexity
      }
    }
  },
  optimizeDeps: {
    exclude: ['@tensorflow/tfjs']
  },
  clearScreen: false,
  logLevel: 'info'
});