import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Allow native modules to bundle correctly on the server
  serverExternalPackages: ['better-sqlite3'],
}

export default nextConfig
