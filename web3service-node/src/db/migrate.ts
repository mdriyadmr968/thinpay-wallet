import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { db, pool } from './index';

async function runMigrations() {
  console.log('[Migration] Starting database migration...');
  try {
    await migrate(db, { migrationsFolder: './src/db/migrations' });
    console.log('[Migration] Migrations applied successfully.');
  } catch (error) {
    console.error('[Migration] Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigrations();
