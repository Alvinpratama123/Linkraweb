// =====================================================================
// ENDPOINT: GET /api/auth/get-profile
// Deskripsi  : Mengambil data profil user berdasarkan token JWT
//              yang dikirim melalui cookie.
// =====================================================================
// Alur Eksekusi:
//   1. Membaca cookie `auth_token` dari request
//   2. Memverifikasi JWT dan mengekstrak userId
//   3. Mencari user di database berdasarkan userId
//   4. Mengembalikan data profil user
//
// Database : auth_db (tabel User)
// Method   : GET
// Cookie   : auth_token (JWT, HttpOnly)
// Catatan  : Mirip dengan /api/auth/me, namun field yang dikembalikan
//            sedikit berbeda (menyertakan updatedAt, tanpa canApprove/position)
// =====================================================================

import { prismaAuth as prisma } from "@/lib/prismaAuth";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  // Hanya menerima metode GET
  if (req.method !== "GET") {
    return res.status(405).json({ 
      success: false, 
      message: "Method not allowed" 
    });
  }

  try {
    // Langkah 1: Ambil token JWT dari cookie
    const token = req.cookies.auth_token;

    // Jika tidak ada token, user belum terautentikasi
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: "Unauthorized" 
      });
    }

<<<<<<< HEAD
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key-change-in-production");
=======
    // Langkah 2: Verifikasi JWT — dapatkan payload berisi userId
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
>>>>>>> efec13ea65a39974fa09497fb20812bfbefff5f8

    // Langkah 3: Query database untuk data profil user
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        photo: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Jika user tidak ditemukan di database
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    // Langkah 4: Kembalikan data profil ke client
    return res.status(200).json({
      success: true,
      user: user,
    });

  } catch (error) {
    // Token invalid / expired atau error server lainnya
    console.error("Get profile error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Terjadi kesalahan server" 
    });
  }
}