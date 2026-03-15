const ABSOLUTE_OR_PROTOCOL_RELATIVE = /^(https?:)?\/\//i;

export function normalizeBlogImageUrl(rawUrl?: string | null): string | null {
  if (!rawUrl) return null;

  let value = rawUrl.trim().replace(/\\/g, '/');
  if (!value) return null;

  if (value.startsWith('data:') || value.startsWith('blob:') || ABSOLUTE_OR_PROTOCOL_RELATIVE.test(value)) {
    return value;
  }

  // Legacy broken values like "undefined/blog/file.jpg".
  value = value.replace(/^undefined\//i, '');

  const clean = value.replace(/^\/+/, '');

  if (value.startsWith('/')) return `/${clean}`;
  if (clean.startsWith('blog/')) return `/api/blog/image/${clean}`;
  if (clean.startsWith('uploads/')) return `/${clean}`;

  return `/${clean}`;
}

export function normalizeBlogContentHtml(html?: string | null): string {
  if (!html) return '';

  return html.replace(
    /(<img\b[^>]*\bsrc=["'])([^"']+)(["'][^>]*>)/gi,
    (_, prefix: string, src: string, suffix: string) => {
      const normalizedSrc = normalizeBlogImageUrl(src);
      return `${prefix}${normalizedSrc ?? src}${suffix}`;
    }
  );
}
