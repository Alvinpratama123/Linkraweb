// pages/api/auth/register.js
import { prisma } from "@/lib/prisma";
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
    const { name, email, role, password } = req.body;

    console.log("=== REGISTER API ===");
    console.log("📝 Register:", { name, email, role });

    // Validasi
    if (!name || !email || !role || !password) {
      return res.status(400).json({
        success: false,
        message: "Semua field wajib diisi",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Format email tidak valid",
      });
    }

    const validRoles = ["admin", "member", "user", "frontend", "backend", "uiux", "qa", "pm",];
    if (!validRoles.includes(role.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: "Role tidak valid",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password minimal 8 karakter",
      });
    }

    const emailLower = email.toLowerCase().trim();

    // Cek user sudah ada
    const userExist = await prisma.user.findUnique({
      where: { email: emailLower },
    });

    if (userExist) {
      return res.status(400).json({
        success: false,
        message: "Email sudah terdaftar",
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    console.log(`📧 OTP untuk ${emailLower}: ${otp}`);

    // Hapus OTP lama
    await prisma.registerOtp.deleteMany({
      where: { email: emailLower, used: false },
    });

    // Simpan OTP
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
        name: name,
        code: otp,
      });
      console.log(`✅ Email OTP terkirim ke ${emailLower}`);
    } catch (emailError) {
      console.error('❌ Error sending email:', emailError);
      // Email gagal tapi OTP tetap tersimpan
      // Bisa return error atau tetap lanjut
    }

    return res.status(200).json({
      success: true,
      message: "OTP berhasil dikirim ke email Anda",
      email: emailLower,
      otp: process.env.NODE_ENV === 'development' ? otp : undefined
    });

  } catch (error) {
    console.error("❌ REGISTER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server: " + error.message,
    });
  }
}