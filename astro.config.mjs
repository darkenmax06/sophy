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
    // Disabled: Astro's checkOrigin causes 403 on multipart uploads in Vercel
    // when no `site` is configured. Each API route has its own auth checks.
    checkOrigin: false,
  },
  integrations: [react()],
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en', 'fr', 'pt'],
    routing: 'manual',
  },
});
