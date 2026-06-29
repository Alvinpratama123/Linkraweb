// lib/notification.js
import { prisma } from "./prisma";
import { sendInfoNotification, sendBulkInfoNotification } from "./notifmailer";

// ─── KIRIM NOTIFIKASI KE SATU USER ──────────────────────────
export async function createNotification({ userId, title, message, type, link, icon, color }) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type: type || "system",
        link: link || null,
        icon: icon || null,
        color: color || null,
        isRead: false,
      },
    });

    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { name: true, email: true, role: true, position: true },
      });

      if (user && user.email) {
        await sendInfoNotification({
          to: user.email,
          name: user.name || "User",
          title: title,
          message: message,
          link: link,
          senderRole: user.position || user.role || "User",
          actionType: type,
          timestamp: new Date(),
        });
        console.log(`📧 [Notif] Email ke ${user.email}: ${title}`);
      }
    } catch (emailError) {
      console.error("❌ [Notif] Email error:", emailError);
    }

    return notification;
  } catch (error) {
    console.error("Create notification error:", error);
    return null;
  }
}

// ─── KIRIM NOTIFIKASI KE SEMUA USER ──────────────────────────
export async function sendNotificationToAllUsers({ title, message, type, link, icon, color }) {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, position: true },
    });

    console.log(`📢 Kirim notifikasi ke ${users.length} user`);

    const results = [];
    for (const user of users) {
      const notification = await prisma.notification.create({
        data: {
          userId: user.id,
          title,
          message,
          type: type || "system",
          link: link || null,
          icon: icon || "📢",
          color: color || "blue",
          isRead: false,
        },
      });
      results.push(notification);
    }

    // Kirim email bulk
    const emailUsers = users.filter(u => u.email);
    if (emailUsers.length > 0) {
      await sendBulkInfoNotification({
        users: emailUsers,
        title,
        message,
        link,
        senderRole: "System",
        projectName: null,
        actionType: type,
        timestamp: new Date(),
      });
      console.log(`📧 [Notif] Email bulk ke ${emailUsers.length} user`);
    }

    return results;
  } catch (error) {
    console.error("Send notification to all users error:", error);
    return [];
  }
}

// ─── NOTIFIKASI PROJECT KE SEMUA USER ────────────────────────
export async function sendProjectNotificationToAllUsers(project, action, senderRole) {
  const notifications = {
    upload: {
      title: "📁 Project Baru",
      message: `Project "${project.name}" telah diupload oleh ${senderRole || 'User'}`,
      type: "project",
      link: `/dashboardAdmin/components/progres?id=${project.id}`,
      icon: "📁",
      color: "blue",
    },
    approved: {
      title: "✅ Project Disetujui",
      message: `Project "${project.name}" telah disetujui oleh ${senderRole || 'Admin'}`,
      type: "approved",
      link: `/dashboardAdmin/components/progres?id=${project.id}`,
      icon: "✅",
      color: "green",
    },
    rejected: {
      title: "❌ Project Ditolak",
      message: `Project "${project.name}" telah ditolak oleh ${senderRole || 'Admin'}`,
      type: "rejected",
      link: `/dashboardAdmin/components/progres?id=${project.id}`,
      icon: "❌",
      color: "red",
    },
    finished: {
      title: "🎉 Project Selesai",
      message: `Project "${project.name}" telah selesai dikerjakan! 🎉`,
      type: "finished",
     link: `/dashboardAdmin/components/progres?id=${project.id}`,
      icon: "🎉",
      color: "green",
    },
  };

  const notif = notifications[action];
  if (!notif) return null;

  return await sendNotificationToAllUsers({
    title: notif.title,
    message: notif.message,
    type: notif.type,
    link: notif.link,
    icon: notif.icon,
    color: notif.color,
  });
}