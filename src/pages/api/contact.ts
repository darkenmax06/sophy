import type { APIRoute } from 'astro';
import { sendEmail } from '../../lib/email';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const firstName = (formData.get('first-name') as string)?.trim() ?? '';
    const lastName = (formData.get('last-name') as string)?.trim() ?? '';
    const email = (formData.get('email') as string)?.trim() ?? '';
    const subject = (formData.get('subject') as string)?.trim() ?? '';
    const message = (formData.get('message') as string)?.trim() ?? '';

    if (!firstName || !lastName || !email || !subject || !message) {
      return new Response(JSON.stringify({ error: 'All fields are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const recipient = import.meta.env.CONTACT_RECIPIENT || 'sophymusicdo@gmail.com';
    await sendEmail(
      recipient,
      `Contacto Web: ${subject}`,
      `<p><strong>Nombre:</strong> ${firstName} ${lastName}</p>
       <p><strong>Email:</strong> ${email}</p>
       <p><strong>Mensaje:</strong></p>
       <p>${message}</p>`
    );

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Contact form error:', error?.response?.data ?? error?.message ?? error);
    return new Response(JSON.stringify({ error: 'Failed to send email' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
