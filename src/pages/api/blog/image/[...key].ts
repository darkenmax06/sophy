import type { APIRoute } from 'astro';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';

function hasR2Config() {
  return Boolean(
    process.env.R2_ENDPOINT &&
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY &&
    process.env.R2_BUCKET_NAME
  );
}

function createS3Client() {
  return new S3Client({
    region: 'auto',
    endpoint: process.env.R2_ENDPOINT,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });
}

export const GET: APIRoute = async ({ params }) => {
  const keyParam = params.key;
  if (!keyParam) {
    return new Response('Missing image key', { status: 400 });
  }

  const key = decodeURIComponent(keyParam).replace(/^\/+/, '');
  if (!key || key.includes('..')) {
    return new Response('Invalid image key', { status: 400 });
  }

  if (!hasR2Config()) {
    return new Response('R2 is not configured', { status: 404 });
  }

  try {
    const s3 = createS3Client();
    const result = await s3.send(new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
    }));

    if (!result.Body) {
      return new Response('Image not found', { status: 404 });
    }

    const headers = new Headers();
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    if (result.ContentType) headers.set('Content-Type', result.ContentType);
    if (typeof result.ContentLength === 'number') {
      headers.set('Content-Length', String(result.ContentLength));
    }

    return new Response(result.Body as BodyInit, { headers });
  } catch (error) {
    console.error('Image proxy error:', error);
    return new Response('Image not found', { status: 404 });
  }
};
