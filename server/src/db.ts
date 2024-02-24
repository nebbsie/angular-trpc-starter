import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema/schema';

const connectionString = 'postgres://dev:dev@localhost:5432/<RENAME_ME>';
const sql = postgres(connectionString);
export const db = drizzle(sql, { schema });
