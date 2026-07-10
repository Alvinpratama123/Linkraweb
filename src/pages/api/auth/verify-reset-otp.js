// pages/api/auth/verify-reset-otp.js
import { prismaAuth as prisma } from "@/lib/prismaAuth";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    const { email, otp } = req.body;

    console.log("=== VERIFY RESET OTP ===");
    console.log("📝 Email:", email);
    console.log("🔑 OTP:", otp);

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email dan OTP wajib diisi",
      });
    }

    const emailLower = email.toLowerCase().trim();
    const otpCode = otp.trim().toUpperCase();

    // Cari OTP yang valid
    const otpData = await prisma.passwordResetToken.findFirst({
      where: {
        email: emailLower,
        code: otpCode,
        used: false,
        expiresAt: {
          gt: new Date()
        }
      },
    });

    if (!otpData) {
      // Cek apakah OTP expired
      const expiredOtp = await prisma.passwordResetToken.findFirst({
        where: {
          email: emailLower,
          code: otpCode,
          used: false,
          expiresAt: {
            lt: new Date()
          }
        }
      });

      if (expiredOtp) {
        return res.status(400).json({
          success: false,
          message: "OTP sudah kadaluarsa. Silakan minta OTP baru.",
        });
      }

      // Cek apakah OTP sudah digunakan
      const usedOtp = await prisma.passwordResetToken.findFirst({
        where: {
          email: emailLower,
          code: otpCode,
          used: true
        }
      });

      if (usedOtp) {
        return res.status(400).json({
          success: false,
          message: "OTP sudah digunakan. Silakan minta OTP baru.",
        });
      }

      return res.status(400).json({
        success: false,
        message: "Kode OTP tidak valid. Silakan coba lagi.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP valid. Silakan reset password Anda.",
      resetId: otpData.id,
    });

  } catch (error) {
    console.error("❌ VERIFY RESET OTP ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server: " + error.message,
    });
  }
}