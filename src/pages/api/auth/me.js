// =====================================================================
// ENDPOINT: GET /api/auth/me
// Deskripsi  : Memverifikasi token JWT dari cookie dan mengembalikan
//              data user yang sedang login beserta hak aksesnya.
// =====================================================================
// Alur Eksekusi:
//   1. Membaca cookie `auth_token` dari request
//   2. Memverifikasi JWT menggunakan secret key
//   3. Mencari user di database berdasarkan userId dari token
//   4. Mengembalikan data user termasuk role, position, canApprove
//
// Database : auth_db (tabel User)
// Method   : GET
// Cookie   : auth_token (JWT, HttpOnly)
// =====================================================================

import { prismaAuth as prisma } from "@/lib/prismaAuth";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  // Hanya menerima metode GET
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  // Langkah 1: Ambil token JWT dari cookie auth_token
  const token = req.cookies.auth_token;
  if (!token) {
    // Jika tidak ada token, user belum login
    return res.status(401).json({ 
      success: false, 
      message: "Token tidak ditemukan" 
    });
  }

  try {
    // Langkah 2: Verifikasi JWT — jika valid, dapatkan data userId dari payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Langkah 3: Cari data user di database berdasarkan userId dari token
    // Pilih hanya field yang diperlukan untuk keamanan
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        position: true,
        profile: true,
        photo: true,
        canApprove: true,  // Menunjukkan apakah user bisa menyetujui
        createdAt: true,
      },
    });

    // Jika user tidak ditemukan di database (akun mungkin sudah dihapus)
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User tidak ditemukan" 
      });
    }

    console.log(`🔑 User authenticated: ${user.email} - role: ${user.role}`);

    // Langkah 4: Kembalikan data user ke client
    return res.status(200).json({
      success: true,
      user: user,
    });
  } catch (error) {
    // Token tidak valid atau sudah expired
    console.error("Auth me error:", error);
    return res.status(401).json({ 
      success: false, 
      message: "Token tidak valid" 
    });
  }
}