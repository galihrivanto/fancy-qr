import { defineConfig } from 'vite';

export default defineConfig({
    build: {
      outDir: 'dist',
      rollupOptions: {
        input: {
          main: 'index.html'
        }
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          includePaths: ['node_modules', 'src']
        }
      }
    }
});