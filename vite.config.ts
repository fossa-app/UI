import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  server: {
    port: 4211,
    host: '127.0.0.1',
  },
  // NOTE: preview prod build
  preview: {
    port: 4211,
    host: '127.0.0.1',
  },
  plugins: [
    react(),
    tsconfigPaths(),
    visualizer({
      filename: 'bundle-report.html',
      template: 'treemap',
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  resolve: {
    alias: {
      store: path.resolve(__dirname, 'src/store'),
      shared: path.resolve(__dirname, 'src/shared'),
      routes: path.resolve(__dirname, 'src/routes'),
      components: path.resolve(__dirname, 'src/components'),
      layout: path.resolve(__dirname, 'src/layout'),
      pages: path.resolve(__dirname, 'src/pages'),
      support: path.resolve(__dirname, 'cypress/support'),
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-redux', '@mui/material', '@mui/icons-material', '@reduxjs/toolkit', 'leaflet'],
  },
  build: {
    outDir: 'build',
    minify: 'esbuild',
    chunkSizeWarningLimit: 500,
    sourcemap: process.env.NODE_ENV !== 'production',
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('@mui')) return 'vendor-mui';
            if (id.includes('redux') || id.includes('@reduxjs')) return 'vendor-redux';
            if (id.includes('leaflet') || id.includes('react-leaflet')) return 'vendor-leaflet';
            return 'vendor';
          }
        },
      },
    },
  },
});
