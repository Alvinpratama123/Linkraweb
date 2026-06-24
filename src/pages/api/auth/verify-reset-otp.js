import { prisma } from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: "Email dan kode OTP harus diisi",
      });
    }

    const emailLower = email.toLowerCase().trim();
    const codeTrimmed = code.toUpperCase().trim();

    const otpData = await prisma.passwordResetToken.findFirst({
      where: {
        email: emailLower,
        code: codeTrimmed,
        used: false,
        expiresAt: { gt: new Date() },
      },
    });

    if (!otpData) {
      return res.status(400).json({
        success: false,
        message: "Kode OTP salah atau sudah kadaluarsa",
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP valid",
    });
  } catch (error) {
    console.error("Verify reset OTP error:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
    });
  }
}
