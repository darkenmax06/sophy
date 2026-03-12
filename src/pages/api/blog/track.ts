import type { APIRoute } from 'astro';
import prisma from '../../../lib/prisma';

// POST track a visit
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { path, postId } = body;
    const userAgent = request.headers.get('user-agent') || undefined;
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : undefined;

    if (postId) {
      await prisma.blogVisit.create({
        data: { postId, userAgent, ip },
      });
    } else if (path) {
      await prisma.pageVisit.create({
        data: { path, userAgent, ip },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Track visit error:', error);
    return new Response(JSON.stringify({ error: 'Error' }), { status: 500 });
  }
};
