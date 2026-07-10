import { PrismaClient } from "@/generated/prisma-auth";

const globalForPrismaAuth = globalThis;

export const prismaAuth =
  globalForPrismaAuth.prismaAuth ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrismaAuth.prismaAuth = prismaAuth;
}
