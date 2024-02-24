import type { Config } from 'drizzle-kit';

export default {
  schema: './src/schema/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: `postgres://dev:dev@localhost:5432/<RENAME_ME>`,
  },
  verbose: true,
  strict: true,
} satisfies Config;
