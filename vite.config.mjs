import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiTarget = env.VITE_DEV_API_PROXY || 'http://localhost:3000';

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), 'src'),
      },
    },
    server: {
      port: 5173,
      strictPort: false,
      proxy: {
        // En dev, el cliente Vite proxya `/api` y `/uploads` al backend Express.
        '/api': { target: apiTarget, changeOrigin: false },
        '/uploads': { target: apiTarget, changeOrigin: false },
      },
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      sourcemap: false,
      target: 'es2020',
      rollupOptions: {
        output: {
          // Separa dependencias de terceros estables en chunks cacheables
          // aparte del código de la app (V2 Fase 3 — code splitting).
          manualChunks: {
            'vendor-react': ['react', 'react-dom', 'react-router-dom'],
            'vendor-icons': ['lucide-react'],
            'vendor-http': ['axios'],
            'vendor-ui': ['class-variance-authority', 'clsx', 'tailwind-merge'],
          },
        },
      },
    },
  };
});
