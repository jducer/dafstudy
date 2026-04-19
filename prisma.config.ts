import path from 'path'
import { defineConfig } from 'prisma/config'

// Prisma 7 configuration file
// Used for Prisma Migrate commands only.
// Runtime connection URL is passed via PrismaClient constructor in lib/db.ts.

export default defineConfig({
  schema: path.join(__dirname, 'prisma/main/schema.prisma'),
})
