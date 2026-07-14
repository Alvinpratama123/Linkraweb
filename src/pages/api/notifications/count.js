// pages/api/notifications/count.js
//
// =============================================
// ALUR EKSEKUSI API COUNT NOTIFIKASI (SIDEBAR BADGE)
// =============================================
//
// API ini menghitung jumlah notifikasi yang belum dibaca
// untuk ditampilkan sebagai badge pada sidebar navigasi.
//
// --- GET /api/notifications/count ---
// 1. Baca token JWT dari cookie → decode untuk mendapatkan userId.
// 2. Jika token tidak ada → tolak (401 Unauthorized).
// 3. Hitung waktu 24 jam yang lalu sebagai batas waktu.
// 4. Query monitoring_db untuk menghitung notifikasi yang:
//    a. Milik user yang sedang login (userId).
//    b. Belum dibaca (isRead = false).
//    c. Dibuat dalam 24 jam terakhir.
//    d. Link mengandung "tab=progress" (notifikasi terkait progress).
// 5. Kembalikan jumlah count dalam JSON.
//
// =============================================
import { prismaMonitoring as prisma } from "@/lib/prismaMonitoring";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  // ─── CORS ────────────────────────────────────────────────────
  // Atur header CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Tangani preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // ─── GET ─────────────────────────────────────────────────────
  // Menghitung jumlah notifikasi belum dibaca untuk badge sidebar
  if (req.method === "GET") {
    try {
      // Langkah 1 & 2: Baca token JWT dari cookie
      const token = req.cookies.auth_token;
      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      // Decode JWT untuk mendapatkan userId
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.userId;

      // Langkah 3: Hitung waktu 24 jam yang lalu
      // 🔥 Hitung notifikasi yang belum dibaca dalam 24 jam terakhir
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);

      // Langkah 4: Query notifikasi dengan 4 filter sekaligus
      const count = await prisma.notification.count({
        where: {
          userId: userId,           // Milik user ini
          isRead: false,            // Belum dibaca
          createdAt: {
            gte: oneDayAgo,         // 24 jam terakhir
          },
          link: {
            contains: "tab=progress", // Link mengandung tab=progress
          },
        },
      });

      // Langkah 5: Kembalikan jumlah count
      return res.status(200).json({
        success: true,
        count: count,
      });
    } catch (error) {
      console.error("Count notifications error:", error);
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