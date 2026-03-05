import { defineMiddleware } from 'astro:middleware';

const locales = ['es', 'en', 'fr', 'pt'];

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  // Skip API routes and static assets
  if (pathname.startsWith('/api/') || pathname.match(/\.(css|js|png|jpg|webp|svg|woff2|ttf|ico)$/)) {
    return next();
  }

  // Root redirect
  if (pathname === '/' || pathname === '') {
    return context.redirect('/es/');
  }

  return next();
});
