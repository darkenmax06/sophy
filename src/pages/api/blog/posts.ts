import type { APIRoute } from 'astro';
import prisma from '../../../lib/prisma';
import { isAuthenticated } from '../../../lib/auth';

// GET all posts (admin)
export const GET: APIRoute = async ({ request, url }) => {
  const user = isAuthenticated(request);
  if (!user) {
    return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401 });
  }

  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '20');
  const skip = (page - 1) * limit;

  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        translations: true,
        categories: { include: { category: { include: { translations: true } } } },
        _count: { select: { visits: true } },
      },
    }),
    prisma.blogPost.count(),
  ]);

  return new Response(JSON.stringify({ posts, total, page, limit }), {
    headers: { 'Content-Type': 'application/json' },
  });
};

// POST create new post
export const POST: APIRoute = async ({ request }) => {
  const user = isAuthenticated(request);
  if (!user) {
    return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401 });
  }

  try {
    const body = await request.json();
    const { slug, coverImage, published, translations, categoryIds } = body;

    if (!slug || !translations || translations.length === 0) {
      return new Response(JSON.stringify({ error: 'Slug y al menos una traducción requeridos' }), { status: 400 });
    }

    // Validate slug format
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      return new Response(JSON.stringify({ error: 'Slug inválido. Use solo minúsculas, números y guiones' }), { status: 400 });
    }

    const post = await prisma.blogPost.create({
      data: {
        slug,
        coverImage: coverImage || null,
        published: published || false,
        publishedAt: published ? new Date() : null,
        translations: {
          create: translations.map((t: { lang: string; title: string; excerpt: string; content: string }) => ({
            lang: t.lang,
            title: t.title,
            excerpt: t.excerpt,
            content: t.content,
          })),
        },
        categories: categoryIds?.length
          ? { create: categoryIds.map((id: string) => ({ categoryId: id })) }
          : undefined,
      },
      include: {
        translations: true,
        categories: { include: { category: { include: { translations: true } } } },
      },
    });

    return new Response(JSON.stringify(post), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return new Response(JSON.stringify({ error: 'Ya existe un post con ese slug' }), { status: 409 });
    }
    console.error('Create post error:', error);
    return new Response(JSON.stringify({ error: 'Error al crear el post' }), { status: 500 });
  }
};
