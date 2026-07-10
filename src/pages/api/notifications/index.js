// pages/api/notifications/index.js
import { prismaAuth } from "@/lib/prismaAuth";
import { prismaMonitoring } from "@/lib/prismaMonitoring";
import { createNotification } from "@/lib/notification";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  // ─── CORS ────────────────────────────────────────────────────
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // ─── AUTH: extract userId from JWT ───────────────────────────
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
  if (req.method === "GET") {
    try {
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const { limit = 20, unreadOnly } = req.query;

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

      const notifications = await prismaMonitoring.notification.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: parseInt(limit),
      });

      const unreadCount = await prismaMonitoring.notification.count({
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

      // 🔥 Gunakan createNotification dari lib (DB + email)
      const notification = await createNotification({
        userId,
        title,
        message,
        type: type || "system",
        link: link || null,
        icon: icon || "📢",
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
  if (req.method === "PATCH") {
    try {
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const { id, markAll } = req.body;

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

      if (id) {
        await prismaMonitoring.notification.updateMany({
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
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const { id } = req.query;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: "Notification ID required",
        });
      }

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
