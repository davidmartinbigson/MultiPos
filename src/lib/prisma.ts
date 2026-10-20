// Prisma Client Setup
let prisma: any = null;

try {
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.length > 10) {
    const { PrismaClient } = require('@prisma/client');
    
    const globalForPrisma = globalThis as unknown as {
      prisma: any | undefined;
    };

    prisma = globalForPrisma.prisma ?? new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['error'] : [],
    });

    if (process.env.NODE_ENV !== 'production') {
      globalForPrisma.prisma = prisma;
    }
    
    console.log('✅ Prisma Client initialized with Neon PostgreSQL');
  }
} catch (error: any) {
  console.warn('⚠️ Prisma init failed:', error?.message);
  prisma = null;
}

export { prisma };
