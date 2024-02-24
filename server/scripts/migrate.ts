import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import * as schema from '../src/schema/schema';

const connectionString = 'postgres://dev:dev@localhost:5432/<RENAME_ME>';
const sql = postgres(connectionString, { max: 1 });
const db = drizzle(sql, { schema });

async function doMigration() {
  await migrate(db, { migrationsFolder: 'drizzle' });
  await sql.end();
}

doMigration().then();
