import { PrismaClient } from '../generated/prisma/client';

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:dark@localhost:5432/sophymusic?schema=public';

const globalForPrisma = globalThis as unknown as { prisma: InstanceType<typeof PrismaClient> };

async function createPrismaClient() {
  // In production (Vercel), use Neon's serverless driver
  if (process.env.VERCEL || process.env.DATABASE_URL?.includes('neon.tech')) {
    const { PrismaNeon } = await import('@prisma/adapter-neon');
    const { Pool } = await import('@neondatabase/serverless');
    const pool = new Pool({ connectionString });
    const adapter = new PrismaNeon(pool);
    return new PrismaClient({ adapter });
  }
  // Local dev: use standard pg driver
  const { PrismaPg } = await import('@prisma/adapter-pg');
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma || await createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
