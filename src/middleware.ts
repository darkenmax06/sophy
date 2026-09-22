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
  const hasLocale = locales.includes(firstSegment);
  const lang = hasLocale ? firstSegment : 'es';

  // Resolve the request internally first (no client-visible redirect yet),
  // so we only ever need to send ONE redirect back to the browser instead
  // of chaining "add locale" + "not found" redirects.
  const response = hasLocale ? await next() : await next(`/es${pathname}`);

  if (response.status === 404) {
    // Avoid redirect loop if the 404 page itself is missing
    if (pathname === `/${lang}/404` || pathname === `/${lang}/404/`) {
      return response;
    }
    return context.redirect(`/${lang}/404`);
  }

  if (!hasLocale) {
    // No locale prefix - redirect to the canonical locale-prefixed URL
    return context.redirect(`/es${pathname}`);
  }

  return response;
});
