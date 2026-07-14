import { PrismaClient } from "../src/generated/prisma-auth/index.js";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const email = "admin@gmail.com";
const name = "admin";
const password = "12345678";
const role = "admin";

const existing = await prisma.user.findUnique({ where: { email } });
if (existing) {
  console.log("Admin sudah ada:", existing.email);
  await prisma.$disconnect();
  process.exit(0);
}

const hashedPassword = await bcrypt.hash(password, 10);

const user = await prisma.user.create({
  data: { email, name, password: hashedPassword, role, isVerified: true },
});

console.log("Akun admin berhasil dibuat:");
console.log("  Email:", user.email);
console.log("  Name:", user.name);
console.log("  Role:", user.role);

await prisma.$disconnect();
