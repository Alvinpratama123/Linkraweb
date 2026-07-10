import { prisma } from "../lib/prisma.js";
import crypto from "crypto";

export const OtpService = {
  generateCode() {
    return crypto.randomBytes(3).toString("hex").toUpperCase().slice(0, 6);
  },

  async createRegisterOtp(email) {
    await prisma.registerOtp.deleteMany({ where: { email, used: false } });
    const code = this.generateCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    return prisma.registerOtp.create({ data: { email, code, expiresAt } });
  },

  async createPasswordResetOtp(email) {
    await prisma.passwordResetToken.deleteMany({ where: { email, used: false } });
    const code = this.generateCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    return prisma.passwordResetToken.create({ data: { email, code, expiresAt } });
  },

  async verifyRegisterOtp(email, code) {
    const otp = await prisma.registerOtp.findFirst({
      where: { email, code, used: false, expiresAt: { gte: new Date() } },
    });
    if (!otp) throw Object.assign(new Error("Kode OTP tidak valid atau sudah kedaluwarsa"), { status: 400 });
    await prisma.registerOtp.update({ where: { id: otp.id }, data: { used: true, usedAt: new Date() } });
    return otp;
  },

  async verifyPasswordResetOtp(email, code) {
    const otp = await prisma.passwordResetToken.findFirst({
      where: { email, code, used: false, expiresAt: { gte: new Date() } },
    });
    if (!otp) throw Object.assign(new Error("Kode OTP tidak valid atau sudah kedaluwarsa"), { status: 400 });
    await prisma.passwordResetToken.update({ where: { id: otp.id }, data: { used: true, usedAt: new Date() } });
    return otp;
  },

  async cleanupUsedTokens(email) {
    await prisma.passwordResetToken.deleteMany({ where: { email } });
  },
};
