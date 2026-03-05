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
      host: import.meta.env.SMTP_HOST || 'smtp.hostinger.com',
      port: Number(import.meta.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: import.meta.env.SMTP_USER || '',
        pass: import.meta.env.SMTP_PASS || '',
      },
    });

    await transporter.sendMail({
      from: `"Sophy Music Web" <${import.meta.env.SMTP_USER}>`,
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
