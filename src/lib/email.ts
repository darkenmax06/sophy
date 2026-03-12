import nodemailer from 'nodemailer';

function createTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.GMAIL_USER || import.meta.env.GMAIL_USER,
      clientId: process.env.GOOGLE_CLIENT_ID || import.meta.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || import.meta.env.GOOGLE_CLIENT_SECRET,
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN || import.meta.env.GOOGLE_REFRESH_TOKEN,
    },
  });
}

export async function sendEmail(to: string, subject: string, html: string) {
  const from = `"Sophy Music" <${process.env.GMAIL_USER || import.meta.env.GMAIL_USER}>`;
  return createTransporter().sendMail({ from, to, subject, html });
}

export async function sendNewBlogNotification(
  subscribers: { email: string; id: string }[],
  blogTitle: string,
  blogUrl: string,
  excerpt: string
) {
  const promises = subscribers.map((sub) =>
    sendEmail(
      sub.email,
      `Nuevo artículo: ${blogTitle}`,
      `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">Nuevo artículo en Sophy Music Blog</h2>
        <h3>${blogTitle}</h3>
        <p>${excerpt}</p>
        <a href="${blogUrl}" style="display:inline-block; padding: 12px 24px; background-color: #6c5ce7; color: white; text-decoration: none; border-radius: 4px;">Leer artículo</a>
        <hr style="margin-top: 30px;">
        <p style="font-size: 12px; color: #999;">
          Si no deseas recibir más notificaciones,
          <a href="${blogUrl.split('/blog')[0]}/api/blog/unsubscribe?id=${sub.id}">cancela tu suscripción aquí</a>.
        </p>
      </div>
      `
    ).catch((err: unknown) => {
      console.error(`Failed to send to ${sub.email}:`, err);
    })
  );
  await Promise.allSettled(promises);
}
