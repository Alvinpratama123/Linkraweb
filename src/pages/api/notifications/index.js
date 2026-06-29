// pages/api/notifications/index.js
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  const token = req.cookies.auth_token;
  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key-change-in-production");
  } catch (err) {
    return res.status(401).json({ success: false, message: "Token tidak valid" });
  }

  const userId = decoded.userId;

  // GET /api/notifications — ambil notifikasi user
  if (req.method === "GET") {
    try {
      const { limit = 20, unreadOnly } = req.query;

      const where = { userId };
      if (unreadOnly === "true") where.isRead = false;

      const notifications = await prisma.notification.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: parseInt(limit),
      });

      const unreadCount = await prisma.notification.count({
        where: { userId, isRead: false },
      });

      return res.status(200).json({
        success: true,
        data: notifications,
        unreadCount,
      });
    } catch (error) {
      console.error("GET notifications error:", error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  // PATCH /api/notifications — mark as read
  if (req.method === "PATCH") {
    try {
      const { id, markAll } = req.body;

      if (markAll) {
        await prisma.notification.updateMany({
          where: { userId, isRead: false },
          data: { isRead: true },
        });
        return res.status(200).json({ success: true, message: "Semua notifikasi dibaca" });
      }

      if (id) {
        await prisma.notification.updateMany({
          where: { id, userId },
          data: { isRead: true },
        });
        return res.status(200).json({ success: true, message: "Notifikasi dibaca" });
      }

      return res.status(400).json({ success: false, message: "ID atau markAll diperlukan" });
    } catch (error) {
      console.error("PATCH notification error:", error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  return res.status(405).json({ success: false, message: "Method not allowed" });
}
