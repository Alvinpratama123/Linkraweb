// pages/api/notifications/count.js
import { prismaMonitoring as prisma } from "@/lib/prismaMonitoring";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  // ─── CORS ────────────────────────────────────────────────────
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // ─── GET ─────────────────────────────────────────────────────
  if (req.method === "GET") {
    try {
      const token = req.cookies.auth_token;
      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.userId;

      // 🔥 Hitung notifikasi yang belum dibaca dalam 24 jam terakhir
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);

      const count = await prisma.notification.count({
        where: {
          userId: userId,
          isRead: false,
          createdAt: {
            gte: oneDayAgo,
          },
          link: {
            contains: "tab=progress",
          },
        },
      });

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