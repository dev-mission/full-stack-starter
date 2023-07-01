import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '~bootstrap': path.resolve(__dirname, '../node_modules/bootstrap'),
    }
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3100',
    }
  }
});

