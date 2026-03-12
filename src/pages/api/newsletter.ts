import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const email = (formData.get('newsletter-email') as string)?.trim() ?? '';

    if (!email) {
      return new Response(JSON.stringify({ error: 'Email is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ error: 'Invalid email format' }), {
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
      subject: 'New Newsletter Subscription',
      text: `New subscriber: ${email}`,
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Newsletter error:', error);
    return new Response(JSON.stringify({ error: 'Failed to subscribe' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
