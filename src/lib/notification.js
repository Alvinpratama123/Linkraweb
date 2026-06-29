// lib/notification.js
import { prisma } from "./prisma";
import { sendRevisionNotification, sendNotificationToRole } from "./email";

// ─── LABEL UNTUK TIPE NOTIFIKASI ─────────────────────────────
const typeLabels = {
  project: {
    label: '📁 Project',
    icon: '📁',
    color: '#3b82f6',
    bgColor: '#dbeafe',
  },
  member: {
    label: '👤 Member',
    icon: '👤',
    color: '#8b5cf6',
    bgColor: '#ede9fe',
  },
  revision: {
    label: '📝 Revisi',
    icon: '📝',
    color: '#f59e0b',
    bgColor: '#fef3c7',
  },
  system: {
    label: '🔔 Sistem',
    icon: '🔔',
    color: '#6b7280',
    bgColor: '#f3f4f6',
  },
  approved: {
    label: '✅ Disetujui',
    icon: '✅',
    color: '#22c55e',
    bgColor: '#dcfce7',
  },
  rejected: {
    label: '❌ Ditolak',
    icon: '❌',
    color: '#ef4444',
    bgColor: '#fee2e2',
  },
  finished: {
    label: '🎉 Selesai',
    icon: '🎉',
    color: '#22c55e',
    bgColor: '#dcfce7',
  },
  upload: {
    label: '📤 Upload',
    icon: '📤',
    color: '#3b82f6',
    bgColor: '#dbeafe',
  },
};

// ─── LABEL UNTUK POSISI / ROLE ──────────────────────────────
const roleLabels = {
  'frontend': 'Frontend Developer',
  'backend': 'Backend Developer',
  'fullstack': 'Fullstack Developer',
  'uiux': 'UI/UX Designer',
  'devops': 'DevOps Engineer',
  'qa': 'QA Engineer',
  'pm': 'Project Manager',
  'admin': 'Administrator',
  'member': 'Member',
  'user': 'User',
};

// ─── LABEL UNTUK KATEGORI PROJECT ────────────────────────────
const categoryLabels = {
  'website': 'Software',
  'web': 'Software',
  'software': 'Software',
  'iot': 'Internet of Things (IoT)',
  'mobile': 'Mobile App',
  'api': 'API Service',
  'desktop': 'Desktop App',
  'cloud': 'Cloud Service',
};

function getCategoryLabel(name) {
  if (!name) return 'Project';
  const lowerName = name.toLowerCase();
  for (const [key, label] of Object.entries(categoryLabels)) {
    if (lowerName.includes(key)) {
      return label;
    }
  }
  return 'Project';
}

// ─── KIRIM EMAIL NOTIFIKASI ──────────────────────────────────
async function sendEmailNotification(user, title, message, type, link, icon) {
  try {
    if (!user?.email) return;

    const { default: nodemailer } = await import('nodemailer');
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || '172.30.21.8',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER || 'no-reply@aiturbo.id',
        pass: process.env.SMTP_PASS || 'tQfPGruGvsELbaJ4Xn9Y5Cr3',
      },
      tls: { rejectUnauthorized: false },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
    });

    const typeInfo = typeLabels[type] || typeLabels.system;
    const iconDisplay = icon || typeInfo.icon || '🔔';
    const roleDisplay = roleLabels[user.role?.toLowerCase()] || user.role || 'Member';

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Notifikasi</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
      background: #f0f4f8;
      padding: 20px;
      margin: 0;
      -webkit-font-smoothing: antialiased;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 16px;
      padding: 0;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #001d55, #003d9e);
      padding: 30px 40px;
      text-align: center;
    }
    .header-icon {
      font-size: 48px;
      display: block;
      margin-bottom: 8px;
    }
    .header h1 {
      color: #ffffff;
      margin: 0;
      font-size: 22px;
      font-weight: 700;
      letter-spacing: 0.5px;
    }
    .header p {
      color: #8ab4f8;
      margin: 4px 0 0;
      font-size: 13px;
    }
    .body-content {
      padding: 30px 40px 20px;
    }
    .greeting {
      font-size: 15px;
      color: #1a202c;
      margin-bottom: 16px;
    }
    .greeting strong {
      color: #001d55;
    }
    .message-box {
      background: #f7fafc;
      border-radius: 12px;
      padding: 16px 20px;
      margin: 16px 0;
      border-left: 4px solid ${typeInfo.color || '#3b82f6'};
    }
    .message-box p {
      color: #2d3748;
      font-size: 15px;
      line-height: 1.7;
      margin: 0;
    }
    .info-card {
      background: #f8fafc;
      border-radius: 12px;
      padding: 16px 20px;
      margin: 20px 0;
      border: 1px solid #e5e7eb;
    }
    .info-row {
      padding: 8px 0;
      border-bottom: 1px solid #e5e7eb;
      display: flex;
      align-items: flex-start;
    }
    .info-row:last-child {
      border-bottom: none;
    }
    .info-label {
      font-weight: 600;
      color: #4b5563;
      width: 100px;
      flex-shrink: 0;
      font-size: 13px;
    }
    .info-value {
      color: #1f2937;
      font-size: 13px;
      word-break: break-word;
    }
    .badge {
      display: inline-block;
      padding: 2px 12px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 600;
      background: ${typeInfo.bgColor || '#dbeafe'};
      color: ${typeInfo.color || '#3b82f6'};
    }
    .btn {
      display: inline-block;
      background: #001d55;
      color: #ffffff;
      padding: 12px 32px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      margin-top: 16px;
      font-size: 14px;
      transition: background 0.2s;
    }
    .btn:hover {
      background: #002d6e;
    }
    .footer {
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      color: #6b7280;
      font-size: 12px;
    }
    .footer strong {
      color: #001d55;
    }
    .footer-note {
      font-size: 11px;
      color: #9ca3af;
      margin-top: 4px;
    }
    @media (max-width: 480px) {
      .header { padding: 20px; }
      .body-content { padding: 20px; }
      .info-label { width: 80px; font-size: 12px; }
      .info-value { font-size: 12px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <span class="header-icon">${iconDisplay}</span>
      <h1>${title}</h1>
      <p>PT Lintas Wahana Teknologi</p>
    </div>
    <div class="body-content">
      <div class="greeting">
        Yth. <strong>${user.name || 'User'}</strong>,
      </div>
      <div class="message-box">
        <p>${message}</p>
      </div>
      <div class="info-card">
        <div class="info-row">
          <span class="info-label">📌 Status</span>
          <span class="info-value"><span class="badge">${typeInfo.label || type}</span></span>
        </div>
        <div class="info-row">
          <span class="info-label">👤 Role</span>
          <span class="info-value">${roleDisplay}</span>
        </div>
        <div class="info-row">
          <span class="info-label">⏰ Waktu</span>
          <span class="info-value">${new Date().toLocaleString('id-ID', { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</span>
        </div>
      </div>
      ${link ? `
      <div style="text-align: center;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}${link}" class="btn">
          🔍 Lihat Detail
        </a>
      </div>
      ` : ''}
      <div class="footer">
        <p>Dikirim dari <strong>PT Lintas Wahana Teknologi</strong></p>
        <p class="footer-note">Email ini dikirim secara otomatis oleh sistem notifikasi. Mohon tidak membalas email ini.</p>
      </div>
    </div>
  </div>
</body>
</html>
    `;

    await transporter.sendMail({
      from: `"PT Lintas Wahana Teknologi" <${process.env.SMTP_USER || 'no-reply@aiturbo.id'}>`,
      to: user.email,
      subject: `${iconDisplay} ${title}`,
      html: html,
    });
    console.log(`📧 [Notif] Email ke ${user.email}: ${title}`);
  } catch (error) {
    console.error(`❌ [Notif] Gagal kirim email ke ${user?.email}:`, error.message);
  }
}

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

      if (user?.email) {
        await sendEmailNotification(user, title, message, type, link, icon);
      }
    } catch (emailError) {
      console.error(`❌ [Notif] Email error:`, emailError.message);
    }

    return notification;
  } catch (error) {
    console.error("❌ [Notif] Create notification error:", error);
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
      let userLink = link;
      
      if (user.role?.toLowerCase() === 'member' || user.role?.toLowerCase() !== 'admin') {
        if (link && link.includes('/dashboardAdmin')) {
          userLink = link.replace('/dashboardAdmin', '/memberDashboard');
        }
      }

      const notification = await prisma.notification.create({
        data: {
          userId: user.id,
          title,
          message,
          type: type || "system",
          link: userLink,
          icon: icon || "📢",
          color: color || "blue",
          isRead: false,
        },
      });
      results.push(notification);

      try {
        if (user?.email) {
          await sendEmailNotification(user, title, message, type, userLink, icon);
        }
      } catch (emailError) {
        console.error(`❌ [Notif] Email error untuk ${user.email}:`, emailError.message);
      }
    }

    return results;
  } catch (error) {
    console.error("❌ [Notif] Send notification to all users error:", error);
    return [];
  }
}

// ─── NOTIFIKASI PROJECT KE SEMUA USER ────────────────────────
export async function sendProjectNotificationToAllUsers(project, action, senderRole) {
  const adminLink = `/dashboardAdmin/admin?tab=progress`;
  const memberLink = `/memberDashboard/MemberDashboard?tab=progress`;
  
  const category = getCategoryLabel(project.name);
  const senderDisplay = roleLabels[senderRole?.toLowerCase()] || senderRole || 'User';

  const notifications = {
    upload: {
      title: `📁 Project Baru: ${project.name}`,
      message: `Project "${project.name}" (${category}) telah diupload oleh ${senderDisplay}. Silakan tinjau project tersebut.`,
      type: "project",
      icon: "📁",
      color: "blue",
    },
    approved: {
      title: `✅ Project Disetujui: ${project.name}`,
      message: `Project "${project.name}" (${category}) telah disetujui oleh ${senderDisplay}. Project siap untuk dilanjutkan.`,
      type: "approved",
      icon: "✅",
      color: "green",
    },
    rejected: {
      title: `❌ Project Ditolak: ${project.name}`,
      message: `Project "${project.name}" (${category}) telah ditolak oleh ${senderDisplay}. Silakan periksa kembali project tersebut.`,
      type: "rejected",
      icon: "❌",
      color: "red",
    },
    finished: {
      title: `🎉 Project Selesai: ${project.name}`,
      message: `Project "${project.name}" (${category}) telah selesai dikerjakan! Selamat! 🎉`,
      type: "finished",
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
    link: adminLink,
    icon: notif.icon,
    color: notif.color,
  });
}

// ─── NOTIFIKASI PROJECT KE SATU USER ─────────────────────────
export async function createProjectNotification(project, userId, action, senderRole) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  const isAdmin = user?.role?.toLowerCase() === 'admin';
  const link = isAdmin 
    ? `/dashboardAdmin/admin?tab=progress`
    : `/memberDashboard/MemberDashboard?tab=progress`;
  
  const category = getCategoryLabel(project.name);
  const senderDisplay = roleLabels[senderRole?.toLowerCase()] || senderRole || 'User';

  const notifications = {
    upload: {
      title: `📁 Project Baru: ${project.name}`,
      message: `Project "${project.name}" (${category}) telah diupload oleh ${senderDisplay}.`,
      type: "project",
      icon: "📁",
      color: "blue",
    },
    approved: {
      title: `✅ Project Disetujui: ${project.name}`,
      message: `Project "${project.name}" (${category}) telah disetujui oleh ${senderDisplay}.`,
      type: "approved",
      icon: "✅",
      color: "green",
    },
    rejected: {
      title: `❌ Project Ditolak: ${project.name}`,
      message: `Project "${project.name}" (${category}) telah ditolak oleh ${senderDisplay}.`,
      type: "rejected",
      icon: "❌",
      color: "red",
    },
    finished: {
      title: `🎉 Project Selesai: ${project.name}`,
      message: `Project "${project.name}" (${category}) telah selesai dikerjakan! 🎉`,
      type: "finished",
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
    link: link,
    icon: notif.icon,
    color: notif.color,
  });
}

// ─── NOTIFIKASI MEMBER ────────────────────────────────────────
export async function createMemberNotification(member, userId, action) {
  if (action === "add") {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    const isAdmin = user?.role?.toLowerCase() === 'admin';
    const link = isAdmin ? '/dashboardAdmin/admin' : '/memberDashboard/MemberDashboard';
    const positionDisplay = roleLabels[member.position?.toLowerCase()] || member.position || 'Member';

    return await createNotification({
      userId,
      title: `👤 Member Baru: ${member.name}`,
      message: `Member "${member.name}" telah ditambahkan dengan posisi ${positionDisplay}.`,
      type: "member",
      link: link,
      icon: "👤",
      color: "purple",
    });
  }
  return null;
}

// ─── NOTIFIKASI REVISION ─────────────────────────────────────
export async function createRevisionNotification(revision, userId, action) {
  if (action === "add") {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    const isAdmin = user?.role?.toLowerCase() === 'admin';
    const link = isAdmin ? '/dashboardAdmin/revision' : '/memberDashboard/MemberDashboard';

    return await createNotification({
      userId,
      title: `📝 Revisi Baru: ${revision.projectName}`,
      message: `Ada revisi baru untuk project "${revision.projectName}". Silakan periksa dan tindak lanjuti.`,
      type: "revision",
      link: link,
      icon: "📝",
      color: "orange",
    });
  }
  return null;
}