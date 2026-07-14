// pages/api/notifications/cleanup.js
//
// =============================================
// ALUR EKSEKUSI API CLEANUP NOTIFIKASI LAMA
// =============================================
//
// API ini membersihkan (menghapus) notifikasi yang sudah
// lebih dari 24 jam dari monitoring_db.
//
// --- DELETE /api/notifications/cleanup ---
// 1. Hanya menerima method DELETE (tolak selain DELETE → 405).
// 2. Baca token JWT dari cookie → verifikasi.
// 3. Jika token tidak ada/invalid → tolak (401).
// 4. Periksa role user dari token:
//    a. Jika ADMIN → hapus SEMUA notifikasi yang lebih dari 24 jam.
//    b. Jika BUKAN admin → hanya hapus notifikasi milik user
//       yang lebih dari 24 jam.
// 5. Kembalikan jumlah notifikasi yang berhasil dihapus.
//
// =============================================
import { prismaMonitoring as prisma } from "@/lib/prismaMonitoring";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  // Hanya izinkan method DELETE
  if (req.method !== "DELETE") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    // Langkah 2: Baca token JWT dari cookie
    const token = req.cookies.auth_token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "❌ Token tidak ditemukan.",
      });
    }

    // Verifikasi token JWT
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "❌ Token tidak valid.",
      });
    }

    // Langkah 4: Periksa role — admin atau bukan
    const userRole = decoded.role || 'USER';
    const isAdmin = userRole.toLowerCase() === 'admin';

    // Hitung waktu 24 jam yang lalu
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    let result;
    
    if (isAdmin) {
      // Admin: hapus SEMUA notifikasi yang lebih dari 24 jam
      result = await prisma.notification.deleteMany({
        where: {
          createdAt: {
            lt: oneDayAgo,
          },
        },
      });
    } else {
      // Non-admin: hanya hapus notifikasi milik user sendiri
      const userId = decoded.userId;
      result = await prisma.notification.deleteMany({
        where: {
          userId: userId,
          createdAt: {
            lt: oneDayAgo,
          },
        },
      });
    }

    console.log(`🗑️ Cleanup: ${result.count} notifikasi lama dihapus`);

    // Kembalikan jumlah notifikasi yang berhasil dihapus
    return res.status(200).json({
      success: true,
      message: `Berhasil menghapus ${result.count} notifikasi lama`,
      deletedCount: result.count,
    });
  } catch (error) {
    console.error("Error cleaning up notifications:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal membersihkan notifikasi lama",
      error: error.message,
    });
  }
}