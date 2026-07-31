// pages/api/notifications/index.js
//
// =============================================
// ALUR EKSEKUSI API NOTIFICATIONS (CRUD)
// =============================================
//
// API ini menangani operasi CRUD notifikasi lengkap:
//
// --- GET /api/notifications ---
// 1. Baca token JWT dari cookie → ambil userId.
// 2. Validasi: pastikan userId ada (401 jika tidak).
// 3. Hitung waktu 24 jam yang lalu sebagai batas data.
// 4. Query notifikasi dari monitoring_db (userId + 24 jam terakhir).
// 5. Jika param `unreadOnly=true` → filter hanya yang belum dibaca.
// 6. Ambil jumlah unread count secara terpisah.
// 7. Kembalikan daftar notifikasi + unreadCount.
//
// --- POST /api/notifications ---
// 1. Ambil data dari body: userId, title, message, type, link, icon, color.
// 2. Validasi: pastikan userId, title, message terisi.
// 3. Cek apakah user ada di auth_db (404 jika tidak).
// 4. Buat notifikasi baru di monitoring_db via createNotification().
// 5. Kembalikan notifikasi yang baru dibuat.
//
// --- PATCH /api/notifications ---
// 1. Baca token JWT → validasi userId.
// 2. Jika `markAll=true` → tandai SEMUA notifikasi user (24 jam) sebagai dibaca.
// 3. Jika ada `id` → tandai satu notifikasi sebagai dibaca.
//
// --- DELETE /api/notifications ---
// 1. Baca token JWT → validasi userId.
// 2. Ambil `id` dari query string.
// 3. Hapus notifikasi berdasarkan id DAN userId (keamanan).
//
// =============================================
import { prismaAuth } from "@/lib/prismaAuth";
import { prismaMonitoring } from "@/lib/prismaMonitoring";
import { createNotification } from "@/lib/notification";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  // ─── CORS ────────────────────────────────────────────────────
  // Atur header CORS agar frontend bisa mengakses API ini
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Tangani preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // ─── AUTH: extract userId from JWT ───────────────────────────
  // Baca token JWT dari cookie untuk mengidentifikasi user yang login
  let userId = null;
  const token = req.cookies.auth_token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.userId;
    } catch (err) {
      // token invalid, userId stays null
    }
  }

  // ─── GET ─────────────────────────────────────────────────────
  // Mengambil daftar notifikasi untuk user yang sedang login
  if (req.method === "GET") {
    try {
      // Pastikan user sudah login
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      // Baca parameter opsional: limit dan unreadOnly
      const { limit = 20, unreadOnly } = req.query;

      // Hitung waktu 24 jam yang lalu (hanya tampilkan notifikasi 24 jam terakhir)
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);

      // Bangun filter query
      const where = { 
        userId,
        createdAt: {
          gte: oneDayAgo,
        }
      };
      
      // Jika diminta hanya notifikasi yang belum dibaca
      if (unreadOnly === "true") {
        where.isRead = false;
      }

      // Query notifikasi dari monitoring_db, urutkan dari yang terbaru
      const notifications = await prismaMonitoring.notification.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: parseInt(limit),
      });

      // Hitung jumlah notifikasi yang belum dibaca untuk badge
      const unreadCount = await prismaMonitoring.notification.count({
        where: { 
          userId, 
          isRead: false,
          createdAt: {
            gte: oneDayAgo,
          }
        },
      });

      // Kembalikan data notifikasi beserta jumlah yang belum dibaca
      return res.status(200).json({
        success: true,
        data: notifications,
        unreadCount,
        total: notifications.length,
      });
    } catch (error) {
      console.error("GET notifications error:", error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  // ─── POST ────────────────────────────────────────────────────
  // Membuat notifikasi baru
  if (req.method === "POST") {
    try {
      // Ambil data notifikasi dari body request
      const { userId, title, message, type, link, icon, color } = req.body;

      console.log(`📢 Creating notification for user ${userId}: ${title}`);

      // Validasi field wajib
      if (!userId || !title || !message) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields: userId, title, message",
        });
      }

      // 🔥 Cek apakah user tujuan ada di auth_db
      const userExists = await prismaAuth.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true, name: true },
      });

      if (!userExists) {
        console.error(`❌ User with ID ${userId} not found`);
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // 🔥 Gunakan createNotification dari lib → simpan ke monitoring_db
      const notification = await createNotification({
        userId,
        title,
        message,
        type: type || "system",
        link: link || null,
        icon: icon || "",
        color: color || "blue",
      });

      if (!notification) {
        return res.status(500).json({
          success: false,
          message: "Gagal membuat notifikasi",
        });
      }

      console.log(`✅ Notification created: ${notification.id} for user ${userExists.email}`);

      return res.status(201).json({
        success: true,
        notification,
      });
    } catch (error) {
      console.error("Create notification error:", error);
      return res.status(500).json({
        success: false,
        message: "Server Error",
        error: error.message,
      });
    }
  }

  // ─── PATCH ───────────────────────────────────────────────────
  // Menandai notifikasi sebagai sudah dibaca
  if (req.method === "PATCH") {
    try {
      // Pastikan user sudah login
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const { id, markAll } = req.body;

      // Opsi 1: Tandai SEMUA notifikasi user (24 jam terakhir) sebagai dibaca
      if (markAll) {
        const oneDayAgo = new Date();
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);
        
        await prismaMonitoring.notification.updateMany({
          where: { 
            userId, 
            isRead: false,
            createdAt: {
              gte: oneDayAgo,
            }
          },
          data: { isRead: true },
        });
        return res.status(200).json({ success: true, message: "Semua notifikasi dibaca" });
      }

      // Opsi 2: Tandai satu notifikasi tertentu sebagai dibaca
      if (id) {
        await prismaMonitoring.notification.updateMany({
          where: { id, userId },
          data: { isRead: true },
        });
        return res.status(200).json({ success: true, message: "Notifikasi dibaca" });
      }

      // Jika tidak ada id maupun markAll → error
      return res.status(400).json({ success: false, message: "ID atau markAll diperlukan" });
    } catch (error) {
      console.error("PATCH notification error:", error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  // ─── DELETE ───────────────────────────────────────────────────
  // Menghapus satu notifikasi milik user yang sedang login
  if (req.method === "DELETE") {
    try {
      // Pastikan user sudah login
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      // Ambil ID notifikasi dari query string
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: "Notification ID required",
        });
      }

      // Hapus notifikasi — filter by id DAN userId (keamanan: hanya bisa hapus milik sendiri)
      await prismaMonitoring.notification.delete({
        where: { id, userId },
      });

      return res.status(200).json({
        success: true,
        message: "Notification deleted",
      });
    } catch (error) {
      console.error("Delete notification error:", error);
      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  }

  return res.status(405).json({
    success: false,
    message: "Method not allowed",
  });
}
