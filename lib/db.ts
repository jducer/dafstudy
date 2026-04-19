// lib/db.ts
// Prisma Client singleton for the main schema.
// Prisma 7 with no 'url' in schema.prisma requires a driver adapter for local SQLite.
// We use @prisma/adapter-better-sqlite3 which satisfies the dynamic connection requirement.

import { PrismaClient } from './generated/main'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import path from 'path'

const dbPath = path.join(process.cwd(), 'prisma', 'main', 'dev.db')

const globalForPrisma = globalThis as unknown as { prismaMain: PrismaClient }

function createPrismaClient(): PrismaClient {
  // Prisma 7 driver adapter for better-sqlite3
  // This allows passing the database path dynamically at runtime.
  const adapter = new PrismaBetterSqlite3({ url: dbPath })
  return new PrismaClient({ adapter })
}

export const prismaMain = globalForPrisma.prismaMain ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prismaMain = prismaMain
}
