import { authUsers, users } from "./schema";

// User
export type User = typeof users.$inferSelect;
export type UserInsert = typeof users.$inferInsert;

// Auth User
export type AuthUser = typeof authUsers.$inferSelect;
export type AuthUserInsert = typeof authUsers.$inferInsert;
