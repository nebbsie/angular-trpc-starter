import { z } from "zod";
import { UsersService } from "../services/users.service";
import { privateProcedure, publicProcedure, router } from "../trpc";

const usersService = new UsersService();

export const authRouter = router({
  createUser: publicProcedure
    .input(
      z.object({
        displayName: z.string(),
        email: z.string(),
        uid: z.string(),
      }),
    )
    .mutation(async (opts) => {
      const { displayName, email, uid } = opts.input;

      // If the user already exists, return it.
      const existingUser = await usersService.getUserByAuthExternalId(uid);
      if (existingUser) {
        return existingUser;
      }

      // Create the new user.
      const createdUser = await usersService.createUser({
        displayName,
      });

      // Create the auth user.
      await usersService.createAuthUser({
        userId: createdUser.id,
        email,
        type: "firebase",
        externalId: uid,
      });

      return createdUser;
    }),

  getUser: privateProcedure.query(async (opts) => {
    return opts.ctx.user;
  }),
});
