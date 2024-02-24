import {
  pgEnum,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

const createdAt = () => timestamp("created_at").notNull().defaultNow();

const id = () => serial("id").primaryKey();

export const usersAuthType = pgEnum("users_auth_type", ["firebase"]);

export const users = pgTable("users", {
  id: id(),
  displayName: varchar("display_name").notNull(),
  createdAt: createdAt(),
});

export const authUsers = pgTable("auth_users", {
  id: id(),
  userId: serial("user_id")
    .references(() => users.id)
    .notNull(),
  email: varchar("email").unique().notNull(),
  type: usersAuthType("type").notNull(),
  externalId: varchar("external_id").notNull(),
  createdAt: createdAt(),
});
