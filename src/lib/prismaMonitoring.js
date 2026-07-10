import { PrismaClient } from "@/generated/prisma-monitoring";

const globalForPrismaMonitoring = globalThis;

export const prismaMonitoring =
  globalForPrismaMonitoring.prismaMonitoring ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrismaMonitoring.prismaMonitoring = prismaMonitoring;
}
