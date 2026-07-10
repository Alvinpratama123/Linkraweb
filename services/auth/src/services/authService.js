import { prisma } from "../lib/prisma.js";
import bcrypt from "bcryptjs";

export const AuthService = {
  async login(email, password) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw Object.assign(new Error("Email tidak terdaftar"), { status: 401 });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw Object.assign(new Error("Password salah"), { status: 401 });

    return {
      token: (await import("../services/jwtService.js")).JwtService.sign({ id: user.id, email: user.email, role: user.role }),
      user: { id: user.id, name: user.name, email: user.email, role: user.role, position: user.position, photo: user.photo },
    };
  },

  async findByEmail(email) {
    return prisma.user.findUnique({ where: { email } });
  },

  async findById(id) {
    return prisma.user.findUnique({ where: { id } });
  },

  async createUser(data) {
    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password || "",
        role: data.role || "member",
        position: data.position || null,
        profile: data.profile || null,
        photo: data.photo || null,
        isVerified: true,
        credentialEmailSent: false,
      },
    });
  },

  async updateUser(id, data) {
    return prisma.user.update({ where: { id }, data });
  },

  async updatePassword(email, hashedPassword) {
    return prisma.user.update({ where: { email }, data: { password: hashedPassword } });
  },

  async hashPassword(password) {
    return bcrypt.hash(password, 10);
  },

  async listUsers(filters = {}) {
    return prisma.user.findMany({
      where: filters.role ? { role: filters.role } : undefined,
      select: { id: true, name: true, email: true, role: true, position: true, photo: true, isVerified: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });
  },

  async deleteUser(id) {
    return prisma.user.delete({ where: { id } });
  },
};
