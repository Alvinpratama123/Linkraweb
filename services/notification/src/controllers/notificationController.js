import { NotificationService } from "../services/notificationService.js";
import { NotificationBuilder } from "../services/notificationBuilder.js";

export const NotificationController = {
  async list(req, res, next) {
    try {
      const userId = req.headers["x-user-id"];
      if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
      const { limit, unreadOnly } = req.query;
      const notifications = await NotificationService.list(userId, { limit, unreadOnly: unreadOnly === "true" });
      res.json({ success: true, data: notifications });
    } catch (err) {
      next(err);
    }
  },

  async count(req, res, next) {
    try {
      const userId = req.headers["x-user-id"];
      if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
      const count = await NotificationService.count(userId);
      res.json({ success: true, data: { count } });
    } catch (err) {
      next(err);
    }
  },

  async markRead(req, res, next) {
    try {
      const userId = req.headers["x-user-id"];
      await NotificationService.markRead(req.params.id, userId);
      res.json({ success: true, message: "Notifikasi ditandai sudah dibaca" });
    } catch (err) {
      next(err);
    }
  },

  async markAllRead(req, res, next) {
    try {
      const userId = req.headers["x-user-id"];
      await NotificationService.markAllRead(userId);
      res.json({ success: true, message: "Semua notifikasi ditandai sudah dibaca" });
    } catch (err) {
      next(err);
    }
  },

  async delete(req, res, next) {
    try {
      const userId = req.headers["x-user-id"];
      await NotificationService.delete(req.params.id, userId);
      res.json({ success: true, message: "Notifikasi berhasil dihapus" });
    } catch (err) {
      next(err);
    }
  },

  async cleanup(req, res, next) {
    try {
      const userId = req.headers["x-user-id"];
      await NotificationService.cleanup(userId);
      res.json({ success: true, message: "Notifikasi lama berhasil dibersihkan" });
    } catch (err) {
      next(err);
    }
  },
};
