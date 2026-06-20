// Prisma client singleton.
// In dev, Next.js hot-reloads modules, which would otherwise create a new
// PrismaClient (and a new DB connection) on every reload. We stash the
// client on the global object so it survives reloads.

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
