import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { sendPasswordResetOtpEmail } from "@/lib/mailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email harus diisi" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Format email tidak valid" });
    }

    const emailLower = email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { email: emailLower },
    });

    await prisma.passwordResetToken.deleteMany({
      where: { email: emailLower, used: false },
    });

    const otp = crypto
      .randomBytes(4)
      .toString("hex")
      .substring(0, 6)
      .toUpperCase();

    await prisma.passwordResetToken.create({
      data: {
        email: emailLower,
        code: otp,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      },
    });

    if (user) {
      await sendPasswordResetOtpEmail({
        to: emailLower,
        name: user.name,
        code: otp,
      });
    }

    console.log(`[OTP Reset Password] Email: ${emailLower} | OTP: ${otp}`);

    return res.status(200).json({
      success: true,
      message: "Jika email terdaftar, kode OTP telah dikirim ke email Anda",
      otp,
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
}
