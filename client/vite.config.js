import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '~bootstrap': path.resolve(__dirname, '../node_modules/bootstrap'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://0.0.0.0:3000',
      }
    }
  },
  ssr: {
    noExternal: ['react-helmet-async'],
  },
});
