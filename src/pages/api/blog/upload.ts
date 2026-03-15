import type { APIRoute } from 'astro';
import { isAuthenticated } from '../../../lib/auth';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

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

async function saveLocalCopy(filename: string, buffer: Buffer) {
  const localRelativeDir = path.join('uploads', 'blog');
  const localAbsoluteDir = path.join(process.cwd(), 'public', localRelativeDir);
  const basename = path.basename(filename);

  await mkdir(localAbsoluteDir, { recursive: true });
  await writeFile(path.join(localAbsoluteDir, basename), buffer);

  return `/${localRelativeDir.replace(/\\/g, '/')}/${basename}`;
}

export const POST: APIRoute = async ({ request }) => {
  const user = isAuthenticated(request);
  if (!user) {
    return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return new Response(JSON.stringify({ error: 'No se proporcionó imagen' }), { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return new Response(JSON.stringify({ error: 'Tipo de archivo no permitido. Use JPG, PNG, WebP o GIF' }), { status: 400 });
    }

    // Max 5MB
    if (file.size > 5 * 1024 * 1024) {
      return new Response(JSON.stringify({ error: 'El archivo es muy grande. Máximo 5MB' }), { status: 400 });
    }

    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const sanitizedExt = ext.replace(/[^a-z0-9]/g, '');
    const filename = `blog/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${sanitizedExt}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    let url: string;

    if (hasR2Config()) {
      const s3 = createS3Client();
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      try {
        await s3.send(new PutObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME!,
          Key: filename,
          Body: buffer,
          ContentType: file.type,
        }), { abortSignal: controller.signal });

        // Use internal proxy route so files are visible even if bucket is private.
        url = `/api/blog/image/${filename}`;
      } catch (r2Error) {
        console.error('R2 upload failed, falling back to local storage:', r2Error);
        url = await saveLocalCopy(filename, buffer);
      } finally {
        clearTimeout(timeout);
      }
    } else {
      url = await saveLocalCopy(filename, buffer);
    }

    return new Response(JSON.stringify({ url }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Upload error:', error);
    return new Response(JSON.stringify({ error: 'Error al subir imagen' }), { status: 500 });
  }
};
