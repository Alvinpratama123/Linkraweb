// pages/api/notifications/cleanup.js
import { prismaMonitoring as prisma } from "@/lib/prismaMonitoring";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    const token = req.cookies.auth_token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "❌ Token tidak ditemukan.",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "❌ Token tidak valid.",
      });
    }

    const userRole = decoded.role || 'USER';
    const isAdmin = userRole.toLowerCase() === 'admin';

    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    let result;
    
    if (isAdmin) {
      result = await prisma.notification.deleteMany({
        where: {
          createdAt: {
            lt: oneDayAgo,
          },
        },
      });
    } else {
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