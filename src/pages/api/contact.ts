import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';

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

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: import.meta.env.GMAIL_USER,
        clientId: import.meta.env.GOOGLE_CLIENT_ID,
        clientSecret: import.meta.env.GOOGLE_CLIENT_SECRET,
        refreshToken: import.meta.env.GOOGLE_REFRESH_TOKEN,
      },
    });

    await transporter.sendMail({
      from: `"Sophy Music" <${import.meta.env.GMAIL_USER}>`,
      to: import.meta.env.CONTACT_RECIPIENT || 'sophymusicdo@gmail.com',
      replyTo: `${firstName} ${lastName} <${email}>`,
      subject: `Contacto Web: ${subject}`,
      text: `Nombre: ${firstName} ${lastName}\nEmail: ${email}\n\nMensaje:\n${message}`,
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Contact form error:', error);
    return new Response(JSON.stringify({ error: 'Failed to send email' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
