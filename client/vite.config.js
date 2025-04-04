import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      exclude: [
        'fs',
      ],
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
    }),
  ],
  build: {
    rollupOptions: {
      external: [
        /^bcrypt(\/.*)?$/,
        /^@mapbox\/node-pre-gyp(\/.*)?$/,
        /^mock-aws-s3(\/.*)?$/,
        /^aws-sdk(\/.*)?$/,
        /^nock(\/.*)?$/,
        /^@mswjs\/interceptors(\/.*)?$/,
        /^node-pre-gyp(\/.*)?$/,
        /^\.\.\/server\/.*/,
      ],
    },
    sourcemap: true,
  },
  optimizeDeps: {
    exclude: [
      'react-toastify',
      'bcrypt',
      '@mapbox/node-pre-gyp',
      'mock-aws-s3',
      'aws-sdk',
      'nock',
      '@mswjs/interceptors',
    ],
    esbuildOptions: {
      define: {
        global: 'globalThis',
        'process.env': '{}',
        'process.platform': '"browser"',
        'process.version': '"0"',
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        timeout: 60000,
        ws: true,
      },
    },
    hmr: {
      overlay: false,
      timeout: 120000,
      clientPort: 5173,
      port: 5173,
    },
    watch: {
      usePolling: true,
      interval: 1000,
    },
  },
});
