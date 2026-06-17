import { prisma } from "@/lib/prisma";
import { sendRegisterOtpEmail } from "@/lib/mailer";

export default async function handler(req, res) {
  console.log("=== RESEND OTP API CALLED ===");

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const { email } = req.body;

    console.log("Email received:", email);

    if (!email) {
      return res.status(400).json({ success: false, message: "Email wajib diisi" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: "Format email tidak valid" });
    }

    const emailLower = email.toLowerCase().trim();

    const existingUser = await prisma.user.findUnique({
      where: { email: emailLower },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email sudah terdaftar. Silakan login.",
      });
    }

    const generateOtp = () => {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let otp = "";
      for (let i = 0; i < 6; i++) {
        otp += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return otp;
    };

    const newOtp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    console.log("Generated OTP:", newOtp);

    // Tandai OTP lama sebagai used
    await prisma.registerOtp.updateMany({
      where: { email: emailLower, used: false },
      data: { used: true },
    });

    // Simpan OTP baru
    await prisma.registerOtp.create({
      data: {
        email: emailLower,
        code: newOtp,
        expiresAt,
        used: false,
      },
    });

    console.log("OTP saved to database");

    // Kirim via mailer yang sudah ada
    try {
      await sendRegisterOtpEmail({
        to: emailLower,
        name: emailLower, // nama tidak tersedia, pakai email
        code: newOtp,
      });
      console.log("Email sent successfully");
    } catch (emailError) {
      console.error("Failed to send email:", emailError.message);
      return res.status(500).json({
        success: false,
        message: "OTP berhasil dibuat tapi gagal dikirim ke email. Periksa konfigurasi MAIL_* di .env.local",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Kode OTP baru telah dikirim ke email Anda",
    });

  } catch (error) {
    console.error("RESEND OTP ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server. Silakan coba lagi.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}