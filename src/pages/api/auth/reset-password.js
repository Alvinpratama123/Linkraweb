// =====================================================================
// ENDPOINT: POST /api/auth/reset-password
// Deskripsi  : Mengubah password user setelah OTP terverifikasi.
//              Menggunakan Prisma transaction untuk memastikan
//              konsistensi data (update password + tandai OTP terpakai).
// =====================================================================
// Alur Eksekusi:
//   1. Menerima email, kode OTP, dan password baru dari body request
//   2. Memvalidasi input (field wajib diisi, password minimal 8 karakter)
//   3. Menggunakan Prisma transaction untuk:
//      a. Mencari OTP yang valid (belum expired, belum digunakan)
//      b. Jika OTP tidak valid, menentukan penyebab (expired/used/salah)
//      c. Hash password baru menggunakan bcrypt (salt rounds: 10)
//      d. Update password user di tabel User
//      e. Tandai OTP sebagai sudah digunakan (used=true)
//   4. Transaction memastikan kedua operasi (d+e) berhasil atau gagal bersama
//
// Database  : auth_db (tabel User, passwordResetToken)
// Method    : POST
// Body      : { email: string, code: string, password: string }
// Catatan   : Ini adalah langkah terakhir dari alur reset password:
//             forgot-password → verify-reset-otp → reset-password
// =====================================================================

import { prismaAuth as prisma } from "@/lib/prismaAuth";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  // Hanya menerima metode POST
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

    // Langkah 2: Validasi semua field wajib diisi
    if (!email || !code || !password) {
      return res.status(400).json({
        success: false,
        message: "Semua field harus diisi",
      });
    }

    // Validasi keamanan: password minimal 8 karakter
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password minimal 8 karakter",
      });
    }

    // Normalisasi input
    const emailLower = email.toLowerCase().trim();
    const codeTrimmed = code.toUpperCase().trim();

    // Langkah 3: Gunakan Prisma transaction untuk konsistensi data
    // Transaction memastikan update password + tandai OTP terpakai dilakukan
    // secara atomik — jika salah satu gagal, yang lain juga dibatalkan
    const result = await prisma.$transaction(async (tx) => {
      // Langkah 3a: Cari OTP yang valid (cocok email+kode, belum dipakai, belum expired)
      const otpData = await tx.passwordResetToken.findFirst({
        where: {
          email: emailLower,
          code: codeTrimmed,
          used: false,
          expiresAt: { gt: new Date() },
        },
      });

      if (!otpData) {
        // OTP tidak valid — tentukan penyebab spesifik untuk pesan error

        // Langkah 3b-i: Cek apakah OTP sudah expired
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

        // Langkah 3b-ii: Cek apakah OTP sudah pernah digunakan
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

        // Langkah 3b-iii: Kode OTP salah / tidak ditemukan
        throw new Error("Kode OTP salah. Silakan coba lagi.");
      }

      // Langkah 3c: Hash password baru dengan bcrypt (10 salt rounds)
      const hashedPassword = await bcrypt.hash(password, 10);

      // Langkah 3d: Update password user di database
      await tx.user.update({
        where: { email: emailLower },
        data: { password: hashedPassword },
      });

      // Langkah 3e: Tandai OTP sebagai sudah digunakan
      // Ini mencegah OTP yang sama digunakan dua kali
      await tx.passwordResetToken.update({
        where: { id: otpData.id },
        data: { used: true, usedAt: new Date() },
      });

      console.log(`✅ Password berhasil direset untuk ${emailLower}`);

      return true;
    });

    // Transaction berhasil — kirimkan response sukses
    if (result) {
      return res.status(200).json({
        success: true,
        message: "Password berhasil direset. Silakan login dengan password baru Anda.",
      });
    }
  } catch (error) {
    console.error("❌ Reset password error:", error);

    // Tangani error terkait OTP (expired, used, salah) dengan response 400
    if (error.message.includes("Kode OTP") || error.message.includes("kadaluarsa") || error.message.includes("salah")) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    // Error server lainnya
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server. Silakan coba lagi nanti.",
    });
  }
}