import { eq } from "drizzle-orm";
import { db } from "../db";
import {
  AuthUser,
  AuthUserInsert,
  authUsers,
  User,
  UserInsert,
  users,
} from "../schema";

export class UsersService {
  async getUserByAuthExternalId(uid: string): Promise<User | undefined> {
    const [existingUser] = await db
      .select({
        id: users.id,
        displayName: users.displayName,
        createdAt: users.createdAt,
      })
      .from(authUsers)
      .innerJoin(users, eq(authUsers.userId, users.id))
      .where(eq(authUsers.externalId, uid))
      .limit(1);

    return existingUser;
  }

  async createUser(newUser: UserInsert): Promise<User> {
    const [createdUser] = await db.insert(users).values(newUser).returning();
    return createdUser;
  }

  async createAuthUser(newAuthUser: AuthUserInsert): Promise<AuthUser> {
    const [authUser] = await db
      .insert(authUsers)
      .values(newAuthUser)
      .returning();

    return authUser;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [row] = await db
      .select()
      .from(users)
      .innerJoin(authUsers, eq(users.id, authUsers.userId))
      .where(eq(authUsers.email, email))
      .limit(1);

    return row?.users;
  }
}
