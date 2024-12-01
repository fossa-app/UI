import { defineConfig } from 'vite';
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
  build: {
    outDir: 'build',
    minify: 'esbuild',
    chunkSizeWarningLimit: 700,
    sourcemap: process.env.NODE_ENV !== 'production',
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            // NOTE: when a complex manualChunks is set, the npm serve script is not working
            // if (id.includes('react')) return 'react-vendor';
            // if (id.includes('@mui')) return 'mui-vendor';
            return 'vendor';
          }
        },
      },
    },
  },
});
