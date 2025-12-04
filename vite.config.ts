import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      // Use a relative base so the SPA still loads when hosted under a subpath
      // (e.g., GitHub Pages), preventing blank screens from missing /assets URLs.
      base: './',
      // Honor both Vite and Next-style prefixes so NEXT_PUBLIC_* values set on
      // Vercel get injected into the client bundle (needed for Supabase).
      envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
          '@src': path.resolve(__dirname, './src'),
        }
      }
    };
});
