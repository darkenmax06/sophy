import type { APIRoute } from 'astro';
import prisma from '../../../lib/prisma';

export const GET: APIRoute = async ({ url }) => {
  const id = url.searchParams.get('id');

  if (!id) {
    return new Response('ID requerido', { status: 400 });
  }

  try {
    await prisma.blogSubscriber.update({
      where: { id },
      data: { unsubscribedAt: new Date() },
    });

    return new Response(
      `<html><body style="font-family:Arial;text-align:center;padding:50px;"><h2>Suscripción cancelada</h2><p>Has sido removido de nuestra lista de correos.</p></body></html>`,
      { headers: { 'Content-Type': 'text/html' } }
    );
  } catch {
    return new Response('Suscriptor no encontrado', { status: 404 });
  }
};
