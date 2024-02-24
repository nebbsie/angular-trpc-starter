import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import express from "express";
import ws from "ws";
import { initialiseFirebase } from "./firebase";
import { appRouter } from "./routes";
import { createContext, createWSContext } from "./trpc";
import cors from "cors";

const app = express();
app.use(cors());
app.use(
  "/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext: createContext,
  }),
);

const port = process.env["PORT"] || 3000;

const server = app.listen(port);

applyWSSHandler({
  router: appRouter,
  createContext: createWSContext,
  wss: new ws.Server({ server }),
});

initialiseFirebase();

console.log(`Server running on port http://localhost:${port}`);

// This is what is imported into the frontend.
export type AppRouter = typeof appRouter;
