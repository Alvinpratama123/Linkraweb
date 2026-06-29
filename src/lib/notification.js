// lib/notification.js
import { prisma } from "./prisma";
import { sendRegisterOtpEmail } from "./mailer";

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
    return notification;
  } catch (error) {
    console.error("Create notification error:", error);
    return null;
  }
}

export async function createProjectNotification(project, userId, action) {
  const notifications = {
    upload: {
      title: "📁 Project Baru",
      message: `Project "${project.name}" telah diupload`,
      type: "project",
      link: `/dashboardAdmin/progress?id=${project.id}`,
      icon: "📁",
      color: "blue",
    },
    approved: {
      title: "✅ Project Disetujui",
      message: `Project "${project.name}" telah disetujui`,
      type: "approved",
      link: `/dashboardAdmin/progress?id=${project.id}`,
      icon: "✅",
      color: "green",
    },
    rejected: {
      title: "❌ Project Ditolak",
      message: `Project "${project.name}" telah ditolak`,
      type: "rejected",
      link: `/dashboardAdmin/progress?id=${project.id}`,
      icon: "❌",
      color: "red",
    },
    finished: {
      title: "🎉 Project Selesai",
      message: `Project "${project.name}" telah selesai`,
      type: "finished",
      link: `/dashboardAdmin/progress?id=${project.id}`,
      icon: "🎉",
      color: "green",
    },
  };

  const notif = notifications[action];
  if (!notif) return;

  // ─── BUAT NOTIFIKASI DI DATABASE ──────────────────────────
  const notification = await createNotification({
    userId,
    title: notif.title,
    message: notif.message,
    type: notif.type,
    link: notif.link,
    icon: notif.icon,
    color: notif.color,
  });

  // ─── KIRIM EMAIL ───────────────────────────────────────────
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true },
    });

    if (user && user.email) {
      await sendRegisterOtpEmail({
        to: user.email,
        name: user.name || "User",
        code: `Notifikasi: ${notif.title}`,
      });
      console.log(`📧 Email notifikasi dikirim ke ${user.email}`);
    }
  } catch (emailError) {
    console.error("❌ Email notification error:", emailError);
  }

  return notification;
}

export async function createMemberNotification(member, userId, action) {
  if (action === "add") {
    const notification = await createNotification({
      userId,
      title: "👤 Member Baru",
      message: `Member "${member.name}" telah ditambahkan dengan posisi ${member.position}`,
      type: "member",
      link: `/dashboardAdmin/members`,
      icon: "👤",
      color: "purple",
    });

    // Kirim email
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { name: true, email: true },
      });

      if (user && user.email) {
        await sendRegisterOtpEmail({
          to: user.email,
          name: user.name || "User",
          code: `Member Baru: ${member.name}`,
        });
      }
    } catch (emailError) {
      console.error("❌ Email notification error:", emailError);
    }

    return notification;
  }
}

export async function createRevisionNotification(revision, userId, action) {
  if (action === "add") {
    const notification = await createNotification({
      userId,
      title: "📝 Revisi Baru",
      message: `Ada revisi baru untuk project "${revision.projectName}"`,
      type: "revision",
      link: `/dashboardAdmin/revision`,
      icon: "📝",
      color: "orange",
    });

    // Kirim email
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { name: true, email: true },
      });

      if (user && user.email) {
        await sendRegisterOtpEmail({
          to: user.email,
          name: user.name || "User",
          code: `Revisi Baru: ${revision.projectName}`,
        });
      }
    } catch (emailError) {
      console.error("❌ Email notification error:", emailError);
    }

    return notification;
  }
}