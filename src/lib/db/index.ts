import { neon, neonConfig } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

// Konfigurasi Neon
neonConfig.fetchConnectionCache = true

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in environment variables')
}

// Create SQL client
const sql = neon(process.env.DATABASE_URL)

// Create Drizzle instance
export const db = drizzle(sql, { schema })

// Export schema untuk dipakai di tempat lain
export * from './schema'