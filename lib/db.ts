// lib/db.ts
// Prisma Client singleton for the main schema.
// Prisma 7 uses the "client" engine, which requires a driver adapter.
// We use @prisma/adapter-better-sqlite3 for local SQLite access.

import { PrismaClient } from './generated/main'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import Database from 'better-sqlite3'
import path from 'path'

const dbPath = path.join(process.cwd(), 'prisma', 'main', 'dev.db')

const globalForPrisma = globalThis as unknown as { prismaMain: PrismaClient }

function createPrismaClient(): PrismaClient {
  const sqlite = new Database(dbPath)
  const adapter = new PrismaBetterSqlite3(sqlite)
  return new PrismaClient({ adapter })
}

export const prismaMain = globalForPrisma.prismaMain ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prismaMain = prismaMain
}
