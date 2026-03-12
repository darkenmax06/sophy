import type { APIRoute } from 'astro';
import prisma from '../../../../lib/prisma';
import { isAuthenticated } from '../../../../lib/auth';
import { sendNewBlogNotification } from '../../../../lib/email';

// GET single post
export const GET: APIRoute = async ({ params, request }) => {
  const { id } = params;
  
  const post = await prisma.blogPost.findUnique({
    where: { id },
    include: {
      translations: true,
      categories: { include: { category: { include: { translations: true } } } },
      _count: { select: { visits: true } },
    },
  });

  if (!post) {
    return new Response(JSON.stringify({ error: 'Post no encontrado' }), { status: 404 });
  }

  return new Response(JSON.stringify(post), {
    headers: { 'Content-Type': 'application/json' },
  });
};

// PUT update post
export const PUT: APIRoute = async ({ params, request }) => {
  const user = isAuthenticated(request);
  if (!user) {
    return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401 });
  }

  const { id } = params;

  try {
    const body = await request.json();
    const { slug, coverImage, published, translations, categoryIds } = body;

    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing) {
      return new Response(JSON.stringify({ error: 'Post no encontrado' }), { status: 404 });
    }

    const wasPublished = existing.published;

    // Update post
    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        slug: slug || undefined,
        coverImage: coverImage !== undefined ? coverImage : undefined,
        published: published !== undefined ? published : undefined,
        publishedAt: published && !existing.publishedAt ? new Date() : undefined,
      },
      include: { translations: true },
    });

    // Update translations
    if (translations && translations.length > 0) {
      for (const t of translations) {
        await prisma.blogTranslation.upsert({
          where: { postId_lang: { postId: id!, lang: t.lang } },
          update: { title: t.title, excerpt: t.excerpt, content: t.content },
          create: { postId: id!, lang: t.lang, title: t.title, excerpt: t.excerpt, content: t.content },
        });
      }
    }

    // Update categories
    if (categoryIds !== undefined) {
      await prisma.blogPostCategory.deleteMany({ where: { postId: id } });
      if (categoryIds.length > 0) {
        await prisma.blogPostCategory.createMany({
          data: categoryIds.map((catId: string) => ({ postId: id!, categoryId: catId })),
        });
      }
    }

    // If just published, notify subscribers
    if (published && !wasPublished) {
      const subscribers = await prisma.blogSubscriber.findMany({
        where: { confirmed: true, unsubscribedAt: null },
        select: { id: true, email: true },
      });

      if (subscribers.length > 0) {
        const esTranslation = translations?.find((t: any) => t.lang === 'es') || translations?.[0];
        const blogUrl = `${new URL(request.url).origin}/es/blog/${post.slug}`;
        sendNewBlogNotification(subscribers, esTranslation?.title || 'New post', blogUrl, esTranslation?.excerpt || '');
      }
    }

    const updated = await prisma.blogPost.findUnique({
      where: { id },
      include: {
        translations: true,
        categories: { include: { category: { include: { translations: true } } } },
      },
    });

    return new Response(JSON.stringify(updated), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return new Response(JSON.stringify({ error: 'Ya existe un post con ese slug' }), { status: 409 });
    }
    console.error('Update post error:', error);
    return new Response(JSON.stringify({ error: 'Error al actualizar' }), { status: 500 });
  }
};

// DELETE post
export const DELETE: APIRoute = async ({ params, request }) => {
  const user = isAuthenticated(request);
  if (!user) {
    return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401 });
  }

  const { id } = params;

  await prisma.blogPost.delete({ where: { id } });

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
