// pages/api/notifications/index.js
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
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

      const { limit = 20, unreadOnly = false } = req.query;

      const where = { userId };
      if (unreadOnly === "true") {
        where.isRead = false;
      }

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
        notifications,
        unreadCount,
      });
    } catch (error) {
      console.error("Get notifications error:", error);
      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  }

  // ─── POST ────────────────────────────────────────────────────
  if (req.method === "POST") {
    try {
      const { userId, title, message, type, link, icon, color } = req.body;

      if (!userId || !title || !message) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields",
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

      return res.status(201).json({
        success: true,
        notification,
      });
    } catch (error) {
      console.error("Create notification error:", error);
      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  }

  // ─── PATCH ───────────────────────────────────────────────────
  if (req.method === "PATCH") {
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

      const { id, markAll } = req.body;

      if (markAll) {
        await prisma.notification.updateMany({
          where: { userId, isRead: false },
          data: { isRead: true },
        });
      } else if (id) {
        await prisma.notification.update({
          where: { id, userId },
          data: { isRead: true },
        });
      }

      return res.status(200).json({
        success: true,
        message: "Notifications updated",
      });
    } catch (error) {
      console.error("Update notification error:", error);
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