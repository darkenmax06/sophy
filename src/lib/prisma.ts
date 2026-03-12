import { PrismaClient } from '../generated/prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import ws from 'ws';

// Required for Vercel Node.js 18/20 Lambda — no native WebSocket
neonConfig.webSocketConstructor = ws;

const globalForPrisma = globalThis as unknown as { prisma: InstanceType<typeof PrismaClient> };

function createPrismaClient(): InstanceType<typeof PrismaClient> {
  const connectionString = process.env.DATABASE_URL;

  if (process.env.VERCEL || connectionString?.includes('neon.tech')) {
    if (!connectionString) {
      throw new Error('[prisma] DATABASE_URL is not set. Check Vercel environment variables.');
    }
    const pool = new Pool({ connectionString });
    const adapter = new PrismaNeon(pool);
    return new PrismaClient({ adapter });
  }

  // Local dev: use standard pg driver
  const localUrl = connectionString || 'postgresql://postgres:dark@localhost:5432/sophymusic';
  const pool = new pg.Pool({ connectionString: localUrl });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
