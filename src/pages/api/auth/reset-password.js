import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    const { email, code, password } = req.body;

    if (!email || !code || !password) {
      return res.status(400).json({
        success: false,
        message: "Semua field harus diisi",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password minimal 8 karakter",
      });
    }

    const emailLower = email.toLowerCase().trim();
    const codeTrimmed = code.toUpperCase().trim();

    const result = await prisma.$transaction(async (tx) => {
      const otpData = await tx.passwordResetToken.findFirst({
        where: {
          email: emailLower,
          code: codeTrimmed,
          used: false,
          expiresAt: { gt: new Date() },
        },
      });

      if (!otpData) {
        throw new Error("Kode OTP salah atau sudah kadaluarsa");
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await tx.user.update({
        where: { email: emailLower },
        data: { password: hashedPassword },
      });

      await tx.passwordResetToken.update({
        where: { id: otpData.id },
        data: { used: true, usedAt: new Date() },
      });

      return true;
    });

    if (result) {
      return res.status(200).json({
        success: true,
        message: "Password berhasil direset. Silakan login dengan password baru Anda.",
      });
    }
  } catch (error) {
    console.error("Reset password error:", error);

    if (error.message.includes("Kode OTP")) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server. Silakan coba lagi nanti.",
    });
  }
}
