import type { APIRoute } from 'astro';
import prisma from '../../../lib/prisma';
import crypto from 'crypto';

// POST subscribe
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ error: 'Email inválido' }), { status: 400 });
    }

    const existing = await prisma.blogSubscriber.findUnique({ where: { email } });
    if (existing) {
      if (existing.unsubscribedAt) {
        // Re-subscribe
        await prisma.blogSubscriber.update({
          where: { email },
          data: { unsubscribedAt: null, confirmed: true },
        });
        return new Response(JSON.stringify({ success: true, message: 'Re-suscrito exitosamente' }));
      }
      return new Response(JSON.stringify({ success: true, message: 'Ya estás suscrito' }));
    }

    const confirmToken = crypto.randomBytes(32).toString('hex');

    await prisma.blogSubscriber.create({
      data: {
        email,
        confirmed: true, // Auto-confirm for simplicity
        confirmToken,
      },
    });

    return new Response(JSON.stringify({ success: true, message: 'Suscripción exitosa' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Subscribe error:', error);
    return new Response(JSON.stringify({ error: 'Error al suscribirse' }), { status: 500 });
  }
};
