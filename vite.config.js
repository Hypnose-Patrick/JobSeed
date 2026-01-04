import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@data': path.resolve(__dirname, './src/data'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@context': path.resolve(__dirname, './src/context'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@constants': path.resolve(__dirname, './src/constants'),
    },
  },
  server: {
    port: 3000,
    open: true,
    host: '0.0.0.0',
    allowedHosts: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    emptyOutDir: true,
    chunkSizeWarningLimit: 1000,
  },
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
});
