import { defineConfig } from 'vite';

export default defineConfig({
  server: { port: 3000 },
  build: { target: 'es2020', sourcemap: false },
  optimizeDeps: {
    include: ['three', 'cannon-es', 'nipplejs'],
  },
});