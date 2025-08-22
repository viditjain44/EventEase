// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

declare global {
  // allow global `var prisma` in TS
  // (avoid "Cannot redeclare block-scoped variable" error)
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ["query"], // optional, helps debug queries
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
