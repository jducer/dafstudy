import path from 'path'
import { defineConfig } from 'prisma/config'

// Prisma 7 configuration file
// Used for Prisma CLI commands (generate, db push, migrate).

export default defineConfig({
  schema: path.join(__dirname, 'prisma/main/schema.prisma'),
  datasource: {
    url: process.env.DATABASE_URL || '',
  },
})
