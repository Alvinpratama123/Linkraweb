import { prisma } from "../lib/prisma.js";
import { EventPublisher } from "../events/publisher.js";

const NOTIFICATION_CONFIG = {
  project: {
    upload:       { icon: "📁", color: "blue", title: "Project Baru" },
    approved:     { icon: "✅", color: "green", title: "Project Disetujui" },
    rejected:     { icon: "❌", color: "red", title: "Project Ditolak" },
    finished:     { icon: "🎉", color: "green", title: "Project Selesai" },
  },
  member: {
    created:      { icon: "👤", color: "blue", title: "Member Baru" },
  },
  revision: {
    created:      { icon: "🔄", color: "orange", title: "Revisi Baru" },
    approved:     { icon: "✅", color: "green", title: "Revisi Disetujui" },
    commented:    { icon: "💬", color: "blue", title: "Komentar Baru" },
  },
  system: {
    default:      { icon: "🔔", color: "gray", title: "Notifikasi" },
  },
};

export const NotificationService = {
  async create({ userId, title, message, type = "system", link }) {
    return prisma.notification.create({ data: { userId, title, message, type, link } });
  },

  async list(userId, { limit = 10, unreadOnly = false } = {}) {
    const where = { userId };
    if (unreadOnly) where.isRead = false;

    const notifications = await prisma.notification.findMany({
      where, take: Math.min(parseInt(limit), 100),
      orderBy: { createdAt: "desc" },
    });

    const ids = notifications.filter(n => !n.isRead).map(n => n.id);
    if (ids.length > 0) {
      await prisma.notification.updateMany({ where: { id: { in: ids } }, data: { isRead: true } });
    }

    return notifications;
  },

  async count(userId) {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return prisma.notification.count({
      where: { userId, isRead: false, createdAt: { gte: twentyFourHoursAgo } },
    });
  },

  async markRead(id, userId) {
    return prisma.notification.updateMany({ where: { id, userId }, data: { isRead: true } });
  },

  async markAllRead(userId) {
    return prisma.notification.updateMany({ where: { userId, isRead: false }, data: { isRead: true } });
  },

  async delete(id, userId) {
    return prisma.notification.deleteMany({ where: { id, userId } });
  },

  async cleanup(userId) {
    return prisma.notification.deleteMany({ where: { userId, isRead: true } });
  },

  getConfig(type, subtype) {
    return NOTIFICATION_CONFIG[type]?.[subtype] || NOTIFICATION_CONFIG.system.default;
  },
};
