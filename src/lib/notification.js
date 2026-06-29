// lib/notification.js
import { prisma } from "./prisma";
import { sendNotificationEmail } from "./email";

// Kirim notifikasi ke satu user
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

    // Kirim email
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { name: true, email: true },
      });

      if (user && user.email) {
        await sendNotificationEmail({
          to: user.email,
          name: user.name || "User",
          title: title,
          message: message || undefined,
          link: link || undefined,
        });
        console.log(`📧 Email ke ${user.email}: ${title}`);
      }
    } catch (emailError) {
      console.error("❌ Email error:", emailError);
    }

    return notification;
  } catch (error) {
    console.error("Create notification error:", error);
    return null;
  }
}

// Kirim notifikasi ke semua user
export async function sendNotificationToAllUsers({ title, message, type, link, icon, color }) {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true },
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

      // Kirim email
      try {
        if (user.email) {
          await sendNotificationEmail({
            to: user.email,
            name: user.name || "User",
            title: title,
            message: message || undefined,
            link: link || undefined,
          });
        }
      } catch (emailError) {
        console.error(`❌ Email gagal ke ${user.email}:`, emailError);
      }
    }

    console.log(`✅ Notifikasi dikirim ke ${results.length} user`);
    return results;
  } catch (error) {
    console.error("Send notification to all users error:", error);
    return [];
  }
}

// Notifikasi project ke semua user
export async function sendProjectNotificationToAllUsers(project, action) {
  const notifications = {
    upload: {
      title: "📁 Project Baru",
      message: `Project "${project.name}" telah diupload`,
      type: "project",
      link: `/dashboardAdmin/admin?tab=Progress`,
      icon: "📁",
      color: "blue",
    },
    approved: {
      title: "✅ Project Disetujui",
      message: `Project "${project.name}" telah disetujui`,
      type: "approved",
      link: `/dashboardAdmin/admin?tab=Progress`,
      icon: "✅",
      color: "green",
    },
    rejected: {
      title: "❌ Project Ditolak",
      message: `Project "${project.name}" telah ditolak`,
      type: "rejected",
      link: `/dashboardAdmin/admin?tab=Progress`,
      icon: "❌",
      color: "red",
    },
    finished: {
      title: "🎉 Project Selesai",
      message: `Project "${project.name}" telah selesai`,
      type: "finished",
      link: `/dashboardAdmin/admin?tab=Progress`,
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

// Notifikasi project ke satu user
export async function createProjectNotification(project, userId, action) {
  const notifications = {
    upload: {
      title: "📁 Project Baru",
      message: `Project "${project.name}" telah diupload`,
      type: "project",
      link: `/dashboardAdmin/admin?tab=Progress`,
      icon: "📁",
      color: "blue",
    },
    approved: {
      title: "✅ Project Disetujui",
      message: `Project "${project.name}" telah disetujui`,
      type: "approved",
      link: `/dashboardAdmin/admin?tab=Progress`,
      icon: "✅",
      color: "green",
    },
    rejected: {
      title: "❌ Project Ditolak",
      message: `Project "${project.name}" telah ditolak`,
      type: "rejected",
      link: `/dashboardAdmin/admin?tab=Progress`,
      icon: "❌",
      color: "red",
    },
    finished: {
      title: "🎉 Project Selesai",
      message: `Project "${project.name}" telah selesai`,
      type: "finished",
      link: `/dashboardAdmin/admin?tab=Progress`,
      icon: "🎉",
      color: "green",
    },
  };

  const notif = notifications[action];
  if (!notif) return null;

  return await createNotification({
    userId,
    title: notif.title,
    message: notif.message,
    type: notif.type,
    link: notif.link,
    icon: notif.icon,
    color: notif.color,
  });
}
