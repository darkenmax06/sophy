// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// Use Vercel adapter in production, Node adapter in local dev
const isVercel = !!process.env.VERCEL;
const adapter = isVercel
  ? (await import('@astrojs/vercel')).default()
  : (await import('@astrojs/node')).default({ mode: 'standalone' });

export default defineConfig({
  output: 'server',
  adapter,
  security: {
    // Avoid false 403s for multipart uploads in local preview/dev environments.
    checkOrigin: isVercel ? true : false,
  },
  integrations: [react()],
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en', 'fr', 'pt'],
    routing: 'manual',
  },
});
