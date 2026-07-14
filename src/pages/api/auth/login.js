// ============================================================
// API LOGIN - Backend (Server-Side)
// ============================================================
// ALUR EKSEKUSI:
// 1. Frontend kirim POST { email, password } ke /api/auth/login
// 2. Handler terima request → validasi input (email & password wajib)
// 3. Cari user di database auth_db berdasarkan email
// 4. Bandingkan password input dengan hash di DB pakai bcrypt.compare()
//    - bcrypt = library hashing aman, password di DB disimpan sebagai hash
//    - compare() = mengambil hash dari DB, lalu mengecek input terhadap hash
// 5. Jika cocok → buat JWT token (berisi userId, email, role, position, name)
// 6. Set token sebagai cookie HttpOnly (tidak bisa diakses JS di browser)
// 7. Kirim response { success: true, user, redirect }
// 8. Frontend terima → redirect ke dashboard sesuai role
// ============================================================
import { prismaAuth as prisma } from "@/lib/prismaAuth"; // Prisma client untuk auth_db
import bcrypt from "bcryptjs";   // Library untuk hash & bandingkan password
import jwt from "jsonwebtoken";  // Library untuk buat & verifikasi JWT token

export default async function handler(req, res) {
  // ─── CORS HANDLING ──────────────────────────────────────────
  // CORS = Cross-Origin Resource Sharing
  // Mengizinkan frontend di domain lain akses API ini
  // Dalam开发, frontend (localhost:3000) dan API (localhost:3000) sama origin
  // Tapi CORS tetap di-set untuk jaga-jaga jika ada akses dari domain lain
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // OPTIONS = preflight request, browser otomatis kirim sebelum POST/PUT/DELETE
  // Cukup balas 200 OK saja, tidak perlu proses apapun
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // ─── VALIDASI METHOD ────────────────────────────────────────
  // Hanya POST yang diizinkan (untuk login)
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    // ─── STEP 1: Ambil data dari request body ─────────────────
    // req.body berisi { email, password } yang dikirim frontend
    const { email, password } = req.body;

    console.log("=== LOGIN ===");
    console.log("📝 Email:", email);

    // ─── STEP 2: Validasi input kosong ────────────────────────
    // Jika email atau password tidak diisi, kirim error 400
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email dan password wajib diisi",
      });
    }

    // ─── STEP 3: Normalisasi email ────────────────────────────
    // toLowerCase() = "Admin@Email.COM" → "admin@email.com"
    // trim() = hapus spasi di awal/akhir (" admin " → "admin")
    // Penting agar pencarian email case-insensitive
    const emailLower = email.toLowerCase().trim();

    // ─── STEP 4: Cari user di database auth_db ────────────────
    // prisma.user.findUnique() = cari 1 record berdasarkan field unik (email)
    // Query: SELECT * FROM users WHERE email = 'emailLower' LIMIT 1
    // Database: auth_db (terpisah dari project_db & monitoring_db)
    const user = await prisma.user.findUnique({
      where: { email: emailLower },
    });

    // ─── STEP 5: Cek apakah user ditemukan ────────────────────
    // Jika user null → email tidak terdaftar di database
    if (!user) {
      console.log(`❌ Email tidak ditemukan: ${emailLower}`);
      return res.status(401).json({
        success: false,
        message: "Email tidak ditemukan",
      });
    }

    // ─── STEP 6: Bandingkan password ──────────────────────────
    // bcrypt.compare(inputPassword, hashedPasswordFromDB)
    // - inputPassword = plain text dari form login
    // - hashedPasswordFromDB = hash yang tersimpan di database
    // - bcrypt otomatis extract salt dari hash, lalu hash input dengan salt yang sama
    // - Jika hasil sama → return true (cocok)
    // - Jika beda → return false (salah)
    // Proses ini AMAN karena hash tidak bisa di-reverse ke plain text
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // Jika password salah, kirim error 401 (Unauthorized)
    if (!isPasswordValid) {
      console.log(`❌ Password salah untuk: ${emailLower}`);
      return res.status(401).json({
        success: false,
        message: "Password salah",
      });
    }

    // ─── STEP 7: Buat JWT Token ──────────────────────────────
    // JWT (JSON Web Token) = token yang berisi data user (payload)
    // jwt.sign(payload, secretKey, options)
    // - payload: data yang disimpan di dalam token
    // - secretKey: kunci rahasia untuk sign token (dari .env JWT_SECRET)
    // - expiresIn: masa berlaku token (7 hari = 7 * 24 * 60 * 60 detik)
    // Token ini yang disimpan di cookie HttpOnly
    const token = jwt.sign(
      {
        userId: user.id,     // ID user dari database
        email: user.email,   // Email user
        role: user.role,     // Role: "admin" atau "member"
        position: user.position, // Posisi: "PM", "UI/UX", "Frontend", dll
        name: user.name,     // Nama lengkap user
      },
      process.env.JWT_SECRET || "your-secret-key-change-in-production",
      { expiresIn: "7d" } // Token valid selama 7 hari
    );

    // ─── STEP 8: Tentukan redirect path berdasarkan role ──────
    // Admin → dashboard admin (bisa akses semua fitur)
    // Member → dashboard member (terbatas sesuai role)
    let redirectPath;
    if (user.role === "ADMIN" || user.role === "admin") {
      redirectPath = "/dashboardAdmin/admin";
    } else {
      redirectPath = "/memberDashboard/MemberDashboard";
    }

    console.log(`🔀 Redirect to: ${redirectPath} for role: ${user.role}`);

    // ─── STEP 9: Set Cookie HttpOnly ─────────────────────────
    // Cookie ini yang membuat user tetap login (session)
    // HttpOnly = TIDAK bisa diakses oleh JavaScript di browser (keamanan)
    // Path=/ = cookie berlaku untuk semua halaman
    // Max-Age = 7 hari dalam detik (7 * 24 * 60 * 60 = 604800)
    // SameSite=Lax = cookie hanya dikirim saat navigasi dari site yang sama
    // Secure = hanya dikirim via HTTPS (aktif di production)
    res.setHeader(
      "Set-Cookie",
      `auth_token=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Lax${
        process.env.NODE_ENV === "production" ? "; Secure" : ""
      }`
    );

    // ─── STEP 10: Kirim response sukses ──────────────────────
    // user object hanya berisi data yang aman di-expose ke frontend
    // Tidak ada password di response (keamanan)
    // redirect = path tujuan setelah login
    return res.status(200).json({
      success: true,
      message: "Login berhasil",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        position: user.position,
        photo: user.photo || null,
      },
      redirect: redirectPath,
    });

  } catch (error) {
    // ─── ERROR HANDLING ────────────────────────────────────────
    // Jika terjadi error tak terduga (DB down, dll)
    // error.message hanya ditampilkan di mode development (bukan production)
    console.error("❌ LOGIN ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}