// pages/api/notifications/index.js
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  // ─── CORS ────────────────────────────────────────────────────
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // ─── GET ─────────────────────────────────────────────────────
  if (req.method === "GET") {
    try {
      const { limit = 20, unreadOnly } = req.query;

      // 🔥 Hanya ambil notifikasi 24 jam terakhir
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);

      const where = { 
        userId,
        createdAt: {
          gte: oneDayAgo,
        }
      };
      
      if (unreadOnly === "true") {
        where.isRead = false;
      }

      const notifications = await prisma.notification.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: parseInt(limit),
      });

      const unreadCount = await prisma.notification.count({
        where: { 
          userId, 
          isRead: false,
          createdAt: {
            gte: oneDayAgo,
          }
        },
      });

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
  if (req.method === "POST") {
    try {
      const { userId, title, message, type, link, icon, color } = req.body;

      console.log(`📢 Creating notification for user ${userId}: ${title}`);

      if (!userId || !title || !message) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields: userId, title, message",
        });
      }

      // 🔥 Cek apakah user ada
      const userExists = await prisma.user.findUnique({
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

      const notification = await prisma.notification.create({
        data: {
          userId,
          title,
          message,
          type: type || "system",
          link: link || null,
          icon: icon || "📢",
          color: color || "blue",
          isRead: false,
        },
      });

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
  if (req.method === "PATCH") {
    try {
      const { id, markAll } = req.body;

      if (markAll) {
        const oneDayAgo = new Date();
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);
        
        await prisma.notification.updateMany({
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

  // ─── DELETE ───────────────────────────────────────────────────
  if (req.method === "DELETE") {
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

      const { id } = req.query;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: "Notification ID required",
        });
      }

      await prisma.notification.delete({
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
