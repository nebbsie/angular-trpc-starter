import { initTRPC, TRPCError } from "@trpc/server";
import { CreateExpressContextOptions } from "@trpc/server/dist/adapters/express";
import { eq } from "drizzle-orm";
import { getAuth } from "firebase-admin/auth";
import superjson from "superjson";
import { db } from "./db";
import { AuthUser, authUsers, User, users } from "./schema";

export type ContextType = "http" | "ws";

type Context = {
  type: ContextType;
  Authorization: string | undefined;
  user: User;
  auth: AuthUser;
};

export async function createContext(
  opts: CreateExpressContextOptions,
): Promise<Context> {
  return {
    type: "http" satisfies ContextType,
    Authorization: opts.req.headers.authorization,
    user: {} as unknown as User,
    auth: {} as unknown as AuthUser,
  };
}

export async function createWSContext(): Promise<Context> {
  return {
    type: "ws" satisfies ContextType,
    Authorization: undefined,
    user: {} as unknown as User,
    auth: {} as unknown as AuthUser,
  };
}

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

const isAuthenticated = t.middleware(async (req) => {
  // Websockets don't currently have a way to pass headers.
  if (req.ctx.type === "ws") {
    return req.next();
  }

  const token = req.ctx.Authorization;
  if (!token) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  try {
    const response = await getAuth().verifyIdToken(token);

    if (response.uid) {
      const [user] = await db
        .select()
        .from(authUsers)
        .innerJoin(users, eq(authUsers.userId, users.id))
        .where(eq(authUsers.externalId, response.uid))
        .limit(1);

      if (user) {
        return req.next({ ctx: { user: user.users, auth: user.auth_users } });
      }
    }
  } catch (error: unknown) {
    if (error && typeof error === "object" && "code" in error) {
      if (error.code === "ECONNREFUSED") {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to connect to the database.",
          cause: error,
        });
      }
    }

    throw new TRPCError({ code: "UNAUTHORIZED", cause: error });
  }

  throw new TRPCError({ code: "UNAUTHORIZED" });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isAuthenticated);
