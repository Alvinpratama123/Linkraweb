// pages/api/auth/resend-otp.js
import { prismaAuth as prisma } from "@/lib/prismaAuth";
import { sendRegisterOtpEmail } from "@/lib/mailer";

function generateOTP() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let otp = '';
  for (let i = 0; i < 6; i++) {
    otp += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return otp;
}

export default async function handler(req, res) {
  // Hanya menerima POST
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    const { email } = req.body;

    console.log("=== RESEND OTP ===");
    console.log("📝 Email:", email);

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email wajib diisi",
      });
    }

    const emailLower = email.toLowerCase().trim();

    // Cek apakah user sudah terverifikasi
    const existingUser = await prisma.user.findUnique({
      where: { email: emailLower },
    });

    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Email sudah terverifikasi. Silakan login.",
      });
    }

    // Hapus OTP lama yang belum digunakan
    await prisma.registerOtp.deleteMany({
      where: {
        email: emailLower,
        used: false,
      },
    });

    // Generate OTP baru
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 menit

    console.log(`📧 OTP baru untuk ${emailLower}: ${otp}`);
    console.log(`⏰ OTP berlaku hingga: ${expiresAt}`);

    // Simpan OTP baru
    await prisma.registerOtp.create({
      data: {
        email: emailLower,
        code: otp,
        expiresAt: expiresAt,
        used: false,
      },
    });

    // ✅ KIRIM EMAIL
    try {
      await sendRegisterOtpEmail({
        to: emailLower,
        name: existingUser?.name || "User",
        code: otp,
      });
      console.log(`✅ Email OTP terkirim ke ${emailLower}`);
    } catch (emailError) {
      console.error('❌ Error sending email:', emailError);
      // Email gagal tapi OTP tetap tersimpan
    }

    return res.status(200).json({
      success: true,
      message: "OTP baru telah dikirim ke email Anda",
      otp: process.env.NODE_ENV === 'development' ? otp : undefined
    });

  } catch (error) {
    console.error("❌ RESEND OTP ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server: " + error.message,
    });
  }
}