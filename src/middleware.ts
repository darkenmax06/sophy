import { defineMiddleware } from 'astro:middleware';

const locales = ['es', 'en', 'fr', 'pt'];

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  // Skip API routes, admin routes, and static assets
  if (pathname.startsWith('/api/') || pathname.startsWith('/admin') || pathname.match(/\.(css|js|png|jpg|webp|svg|woff2|ttf|ico)$/)) {
    return next();
  }

  // Root redirect to default locale
  if (pathname === '/' || pathname === '') {
    return context.redirect('/es/');
  }

  // Check if URL has a valid locale prefix
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];

  if (firstSegment && !locales.includes(firstSegment)) {
    // No locale prefix - redirect to default locale
    return context.redirect(`/es${pathname}`);
  }

  return next();
});
