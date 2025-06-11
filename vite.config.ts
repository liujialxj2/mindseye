import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    headers: {
      'Content-Security-Policy': "default-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.gamedistribution.com https://*.crazygames.com https://cdnjs.cloudflare.com https://www.googletagmanager.com https://pagead2.googlesyndication.com; frame-ancestors 'self' https://*.gamedistribution.com https://*.crazygames.com; frame-src 'self' https://*.gamedistribution.com https://*.crazygames.com; img-src 'self' data: https://*.gamedistribution.com https://*.crazygames.com https://imgs.crazygames.com; connect-src 'self' https://*.gamedistribution.com https://*.crazygames.com https://www.google-analytics.com;",
      'X-Frame-Options': 'SAMEORIGIN',
      'Permissions-Policy': 'interest-cohort=()'
    }
  },
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        format: 'es',
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',
        manualChunks: undefined
      }
    }
  }
});
