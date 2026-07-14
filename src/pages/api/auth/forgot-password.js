// =====================================================================
// ENDPOINT: POST /api/auth/forgot-password
// Deskripsi  : Mengirimkan kode OTP ke email user untuk keperluan
//              reset password. OTP berlaku selama 15 menit.
// =====================================================================
// Alur Eksekusi:
//   1. Menerima email dari body request
//   2. Mencari user di database berdasarkan email
//   3. Menghapus token reset password lama yang belum digunakan
//   4. Menghasilkan kode OTP acak 6 karakter (huruf + angka)
//   5. Menyimpan OTP ke tabel passwordResetToken (expire 15 menit)
//   6. Mengirim email berisi OTP ke user via nodemailer
//   7. Mengembalikan OTP di response jika mode development
//
// Database  : auth_db (tabel User, passwordResetToken)
// Method    : POST
// Body      : { email: string }
// =====================================================================

import { prismaAuth as prisma } from "@/lib/prismaAuth";
import { sendPasswordResetOtpEmail } from "@/lib/mailer";

// Fungsi helper: menghasilkan kode OTP acak 6 karakter
// Menggunakan kombinasi huruf besar (A-Z) dan angka (0-9)
function generateOTP() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let otp = '';
  for (let i = 0; i < 6; i++) {
    otp += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return otp;
}

export default async function handler(req, res) {
  // Hanya menerima metode POST
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

    // Validasi input: email wajib diisi
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email wajib diisi",
      });
    }

    // Normalisasi email (lowercase + trim spasi)
    const emailLower = email.toLowerCase().trim();

    // Langkah 2: Cari user di database berdasarkan email
    const user = await prisma.user.findUnique({
      where: { email: emailLower },
    });

    // Jika email tidak terdaftar, tetap return sukses untuk keamanan
    // (mencegah email enumeration), namun di sini mengembalikan 404
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Email tidak ditemukan",
      });
    }

    // Langkah 3: Hapus token reset password lama yang belum digunakan
    // Ini memastikan hanya ada satu OTP aktif per email
    await prisma.passwordResetToken.deleteMany({
      where: {
        email: emailLower,
        used: false,
      },
    });

    // Langkah 4 & 5: Generate OTP baru dan simpan ke database
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 menit dari sekarang

    console.log(`📧 OTP reset password untuk ${emailLower}: ${otp}`);
    console.log(`⏰ OTP berlaku hingga: ${expiresAt}`);

    // Simpan record OTP baru ke tabel passwordResetToken
    await prisma.passwordResetToken.create({
      data: {
        email: emailLower,
        code: otp,
        expiresAt: expiresAt,
        used: false,
      },
    });

    // Langkah 6: Kirim email berisi kode OTP ke user
    try {
      await sendPasswordResetOtpEmail({
        to: emailLower,
        name: user.name,
        code: otp,
      });
      console.log(`✅ Email reset password terkirim ke ${emailLower}`);
    } catch (emailError) {
      // Jika email gagal terkirim, OTP tetap tersimpan di database
      // User bisa meminta OTP baru jika email tidak sampai
      console.error('❌ Error sending reset password email:', emailError);
    }

    // Langkah 7: Kirim response — OTP disertakan hanya di environment development
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