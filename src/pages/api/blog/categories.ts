import type { APIRoute } from 'astro';
import prisma from '../../../lib/prisma';
import { isAuthenticated } from '../../../lib/auth';

// GET all categories
export const GET: APIRoute = async ({ request }) => {
  const categories = await prisma.blogCategory.findMany({
    include: { translations: true },
    orderBy: { slug: 'asc' },
  });

  return new Response(JSON.stringify(categories), {
    headers: { 'Content-Type': 'application/json' },
  });
};

// POST create category (admin only)
export const POST: APIRoute = async ({ request }) => {
  const user = isAuthenticated(request);
  if (!user) {
    return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401 });
  }

  try {
    const body = await request.json();
    const { slug, translations } = body;

    if (!slug || !translations || translations.length === 0) {
      return new Response(JSON.stringify({ error: 'Slug y traducciones requeridos' }), { status: 400 });
    }

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      return new Response(JSON.stringify({ error: 'Slug inválido' }), { status: 400 });
    }

    const category = await prisma.blogCategory.create({
      data: {
        slug,
        translations: {
          create: translations.map((t: { lang: string; name: string }) => ({
            lang: t.lang,
            name: t.name,
          })),
        },
      },
      include: { translations: true },
    });

    return new Response(JSON.stringify(category), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return new Response(JSON.stringify({ error: 'Ya existe una categoría con ese slug' }), { status: 409 });
    }
    console.error('Create category error:', error);
    return new Response(JSON.stringify({ error: 'Error al crear categoría' }), { status: 500 });
  }
};
