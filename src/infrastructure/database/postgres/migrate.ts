import { pool } from './connection'

async function migrate() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id uuid PRIMARY KEY,
      name text NOT NULL,
      email text UNIQUE NOT NULL,
      password text NOT NULL,
      "isActive" boolean NOT NULL DEFAULT true,
      "createdAt" timestamp NOT NULL DEFAULT now()
    )
  `)
  console.log('Migration complete')
  await pool.end()
}

migrate().catch((err) => {
  console.error('Migration failed', err)
  process.exit(1)
})
