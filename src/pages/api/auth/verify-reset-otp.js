// =====================================================================
// ENDPOINT: POST /api/auth/verify-reset-otp
// Deskripsi  : Memverifikasi kode OTP yang dikirim ke email user
//              sebelum mengizinkan reset password.
// =====================================================================
// Alur Eksekusi:
//   1. Menerima email dan kode OTP dari body request
//   2. Mencari record OTP yang cocok, belum digunakan, dan belum expired
//   3. Jika tidak ditemukan, menentukan penyebab spesifik:
//      a. OTP sudah kedaluwarsa (expire > waktu sekarang)
//      b. OTP sudah digunakan (used = true)
//      c. OTP tidak valid (tidak cocok dengan email/kode)
//   4. Jika valid, mengembalikan resetId untuk langkah reset password
//
// Database  : auth_db (tabel passwordResetToken)
// Method    : POST
// Body      : { email: string, otp: string }
// Catatan   : Endpoint ini adalah langkah ke-2 dari 3 alur reset password:
//             forgot-password → verify-reset-otp → reset-password
// =====================================================================

import { prismaAuth as prisma } from "@/lib/prismaAuth";

export default async function handler(req, res) {
  // Hanya menerima metode POST
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

    // Validasi input: email dan OTP wajib diisi
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email dan OTP wajib diisi",
      });
    }

    // Normalisasi input (lowercase email, uppercase OTP)
    const emailLower = email.toLowerCase().trim();
    const otpCode = otp.trim().toUpperCase();

    // Langkah 2: Cari OTP yang valid — harus cocok email, kode, belum dipakai, belum expired
    const otpData = await prisma.passwordResetToken.findFirst({
      where: {
        email: emailLower,
        code: otpCode,
        used: false,
        expiresAt: {
          gt: new Date()  // gt = greater than → belum expired
        }
      },
    });

    if (!otpData) {
      // OTP tidak ditemukan — tentukan penyebab spesifik untuk pesan error yang lebih jelas

      // Langkah 3a: Cek apakah OTP ada tapi sudah expired
      const expiredOtp = await prisma.passwordResetToken.findFirst({
        where: {
          email: emailLower,
          code: otpCode,
          used: false,
          expiresAt: {
            lt: new Date()  // lt = less than → sudah lewat waktu expire
          }
        }
      });

      if (expiredOtp) {
        return res.status(400).json({
          success: false,
          message: "OTP sudah kadaluarsa. Silakan minta OTP baru.",
        });
      }

      // Langkah 3b: Cek apakah OTP sudah pernah digunakan
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

      // Langkah 3c: OTP tidak cocok sama sekali (kode salah)
      return res.status(400).json({
        success: false,
        message: "Kode OTP tidak valid. Silakan coba lagi.",
      });
    }

    // Langkah 4: OTP valid — kembalikan resetId untuk digunakan di langkah berikutnya
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