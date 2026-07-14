// pages/api/members/[id].js
//
// =============================================
// ALUR EKSEKUSI API DELETE MEMBER
// =============================================
//
// API ini hanya menangani DELETE untuk menghapus member.
//
// --- DELETE /api/members/[id] ---
// 1. Baca parameter `id` dari URL path.
// 2. Baca token JWT dari cookie `auth_token`.
// 3. Verifikasi token JWT — jika tidak ada/invalid → tolak (401).
// 4. Periksa role user dari token → harus admin (403 jika bukan admin).
// 5. Cari member berdasarkan ID di auth_db.
// 6. Jika tidak ditemukan → kembalikan 404.
// 7. Hapus member dari auth_db.
// 8. Kembalikan response sukses.
//
// =============================================
import { prismaAuth as prisma } from "@/lib/prismaAuth";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  // Atur header CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Tangani preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Langkah 1: Ambil parameter ID dari URL
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "ID member wajib diisi",
    });
  }

  // Langkah 2 & 3: Baca dan verifikasi token JWT dari cookie
  const token = req.cookies.auth_token;
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "❌ Token tidak ditemukan.",
    });
  }

  // Verifikasi token — decode data user dari JWT
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "❌ Token tidak valid.",
    });
  }

  // Langkah 4: Pastikan yang melakukan request adalah admin
  const userRole = decoded.role || 'USER';
  const isAdmin = userRole.toLowerCase() === 'admin';

  if (!isAdmin) {
    return res.status(403).json({
      success: false,
      message: "❌ Hanya admin yang bisa menghapus member.",
    });
  }

  if (req.method === "DELETE") {
    try {
      // Langkah 5: Cari member berdasarkan ID di auth_db
      const user = await prisma.user.findUnique({
        where: { id },
      });

      // Langkah 6: Jika member tidak ditemukan
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Member tidak ditemukan",
        });
      }

      // Langkah 7: Hapus member dari database
      await prisma.user.delete({
        where: { id },
      });

      return res.status(200).json({
        success: true,
        message: "Member berhasil dihapus",
      });
    } catch (error) {
      console.error("DELETE member error:", error);
      return res.status(500).json({
        success: false,
        message: "Gagal menghapus member",
      });
    }
  }

  return res.status(405).json({
    success: false,
    message: "Method not allowed",
  });
}