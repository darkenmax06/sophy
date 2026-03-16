import { google } from 'googleapis';

function createGmailClient() {
  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID || import.meta.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET || import.meta.env.GOOGLE_CLIENT_SECRET,
  );
  auth.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN || import.meta.env.GOOGLE_REFRESH_TOKEN,
  });
  return google.gmail({ version: 'v1', auth });
}

function encodeSubject(subject: string): string {
  return `=?UTF-8?B?${Buffer.from(subject).toString('base64')}?=`;
}

function buildRawEmail(to: string, from: string, subject: string, html: string): string {
  const message = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${encodeSubject(subject)}`,
    `MIME-Version: 1.0`,
    `Content-Type: text/html; charset=UTF-8`,
    ``,
    html,
  ].join('\r\n');
  return Buffer.from(message).toString('base64url');
}

export async function sendEmail(to: string, subject: string, html: string) {
  const user = process.env.GMAIL_USER || import.meta.env.GMAIL_USER;
  const from = `"Sophy Music" <${user}>`;
  const gmail = createGmailClient();
  await gmail.users.messages.send({
    userId: 'me',
    requestBody: { raw: buildRawEmail(to, from, subject, html) },
  });
}

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export async function sendNewBlogNotification(
  subscribers: { email: string; id: string }[],
  blogTitle: string,
  blogUrl: string,
  excerpt: string
) {
  for (const sub of subscribers) {
    await sendEmail(
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
    });
    await delay(600); // Resend permite 2 req/seg — esperamos 600ms entre emails
  }
}
