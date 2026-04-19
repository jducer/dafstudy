// lib/db.ts
import { PrismaClient } from './generated/main'

const globalForPrisma = globalThis as unknown as { 
  prismaMain: PrismaClient 
}

export const prismaMain = globalForPrisma.prismaMain ?? new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prismaMain = prismaMain
}
  globalForPrisma.prismaMain = prismaMain
}

