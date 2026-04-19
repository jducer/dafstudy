// lib/db.ts
import { PrismaClient } from './generated/main'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = globalThis as unknown as { 
  prismaMain: PrismaClient 
}

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)

export const prismaMain = globalForPrisma.prismaMain ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prismaMain = prismaMain
}

