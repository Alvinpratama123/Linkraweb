// pages/api/auth/reset-password.js
import { prismaAuth as prisma } from "@/lib/prismaAuth";
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

    console.log("=== RESET PASSWORD ===");
    console.log("📝 Email:", email);
    console.log("🔑 Code:", code);

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
      // Cari OTP yang valid
      const otpData = await tx.passwordResetToken.findFirst({
        where: {
          email: emailLower,
          code: codeTrimmed,
          used: false,
          expiresAt: { gt: new Date() },
        },
      });

      if (!otpData) {
        // Cek apakah OTP expired
        const expiredOtp = await tx.passwordResetToken.findFirst({
          where: {
            email: emailLower,
            code: codeTrimmed,
            used: false,
            expiresAt: { lt: new Date() },
          },
        });

        if (expiredOtp) {
          throw new Error("Kode OTP sudah kadaluarsa. Silakan minta OTP baru.");
        }

        // Cek apakah OTP sudah digunakan
        const usedOtp = await tx.passwordResetToken.findFirst({
          where: {
            email: emailLower,
            code: codeTrimmed,
            used: true,
          },
        });

        if (usedOtp) {
          throw new Error("Kode OTP sudah digunakan. Silakan minta OTP baru.");
        }

        throw new Error("Kode OTP salah. Silakan coba lagi.");
      }

      // Hash password baru
      const hashedPassword = await bcrypt.hash(password, 10);

      // Update password user
      await tx.user.update({
        where: { email: emailLower },
        data: { password: hashedPassword },
      });

      // Mark OTP sebagai used
      await tx.passwordResetToken.update({
        where: { id: otpData.id },
        data: { used: true, usedAt: new Date() },
      });

      console.log(`✅ Password berhasil direset untuk ${emailLower}`);

      return true;
    });

    if (result) {
      return res.status(200).json({
        success: true,
        message: "Password berhasil direset. Silakan login dengan password baru Anda.",
      });
    }
  } catch (error) {
    console.error("❌ Reset password error:", error);

    if (error.message.includes("Kode OTP") || error.message.includes("kadaluarsa") || error.message.includes("salah")) {
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