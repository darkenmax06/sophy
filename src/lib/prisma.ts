import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

// Required for Node runtimes without native WebSocket support
neonConfig.webSocketConstructor = ws;

const globalForPrisma = globalThis as {
  prisma?: PrismaClient;
};

function getConnectionString() {
  const url =
    process.env.DATABASE_URL_POOLED ||
    process.env.DATABASE_URL ||
    process.env.NEON_DATABASE_URL ||
    process.env.NEON_URL;

    console.log({url})

  if (!url) {
    throw new Error(
      '[prisma] Missing DATABASE_URL_POOLED / DATABASE_URL / NEON_DATABASE_URL / NEON_URL'
    );
  }

  return url.trim().replace(/^['"]|['"]$/g, '');
}

function createPrismaClient() {
  const connectionString = getConnectionString();

  console.log({
    hasDatabaseUrl: !!connectionString,
    usesPooler: connectionString.includes('-pooler'),
  });

  const adapter = new PrismaNeon({
    connectionString,
  });

  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;