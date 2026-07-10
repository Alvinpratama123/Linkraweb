import { PrismaClient } from "@/generated/prisma-project";

const globalForPrismaProject = globalThis;

export const prismaProject =
  globalForPrismaProject.prismaProject ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrismaProject.prismaProject = prismaProject;
}
