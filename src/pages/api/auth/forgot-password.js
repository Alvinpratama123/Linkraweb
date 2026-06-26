// pages/api/auth/forgot-password.js
import { prisma } from "@/lib/prisma";
import { sendPasswordResetOtpEmail } from "@/lib/mailer"; // ✅ Gunakan fungsi yang sudah ada

function generateOTP() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let otp = '';
  for (let i = 0; i < 6; i++) {
    otp += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return otp;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    const { email } = req.body;

    console.log("=== FORGOT PASSWORD ===");
    console.log("📝 Email:", email);

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email wajib diisi",
      });
    }

    const emailLower = email.toLowerCase().trim();

    // Cek apakah user ada
    const user = await prisma.user.findUnique({
      where: { email: emailLower },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Email tidak ditemukan",
      });
    }

    // Hapus token lama
    await prisma.passwordResetToken.deleteMany({
      where: {
        email: emailLower,
        used: false,
      },
    });

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 menit

    console.log(`📧 OTP reset password untuk ${emailLower}: ${otp}`);
    console.log(`⏰ OTP berlaku hingga: ${expiresAt}`);

    // Simpan OTP
    await prisma.passwordResetToken.create({
      data: {
        email: emailLower,
        code: otp,
        expiresAt: expiresAt,
        used: false,
      },
    });

    // ✅ KIRIM EMAIL MENGGUNAKAN FUNGSI YANG SUDAH ADA
    try {
      await sendPasswordResetOtpEmail({
        to: emailLower,
        name: user.name,
        code: otp,
      });
      console.log(`✅ Email reset password terkirim ke ${emailLower}`);
    } catch (emailError) {
      console.error('❌ Error sending reset password email:', emailError);
      // Email gagal tapi OTP tetap tersimpan
    }

    return res.status(200).json({
      success: true,
      message: "OTP reset password telah dikirim ke email Anda",
      email: emailLower,
      otp: process.env.NODE_ENV === 'development' ? otp : undefined
    });

  } catch (error) {
    console.error("❌ FORGOT PASSWORD ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server: " + error.message,
    });
  }
}