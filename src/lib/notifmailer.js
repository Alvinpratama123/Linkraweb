// lib/notifmailer.js
import nodemailer from 'nodemailer';

// Konfigurasi transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || '172.30.21.8',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || 'no-reply@aiturbo.id',
    pass: process.env.SMTP_PASS || 'tQfPGruGvsELbaJ4Xn9Y5Cr3',
  },
  tls: {
    rejectUnauthorized: false,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

// Label untuk role
const roleLabels = {
  'QA': 'QA',
  'FRONTEND': 'Frontend Developer',
  'BACKEND': 'Backend Developer',
  'DEVOPS': 'DevOps',
  'ADMIN': 'Administrator',
  'MEMBER': 'Member',
};

// Icon berdasarkan tipe aksi
const iconMap = {
  upload: '📁',
  approved: '✅',
  rejected: '❌',
  finished: '🎉',
  member_added: '👤',
  revision: '📝',
  system: '🔔',
  project: '📁',
  member: '👤',
};

// Warna berdasarkan tipe aksi
const colorMap = {
  upload: '#3b82f6',
  approved: '#22c55e',
  rejected: '#ef4444',
  finished: '#22c55e',
  member_added: '#8b5cf6',
  revision: '#f59e0b',
  system: '#6b7280',
  project: '#3b82f6',
  member: '#8b5cf6',
};

// Label untuk tipe aksi
const actionLabels = {
  upload: 'PROJECT UPLOAD',
  approved: 'PROJECT APPROVED',
  rejected: 'PROJECT REJECTED',
  finished: 'PROJECT FINISHED',
  member_added: 'MEMBER ADDED',
  revision: 'REVISION',
  system: 'SYSTEM',
  project: 'PROJECT',
  member: 'MEMBER',
};

// ============================================================
// FUNGSI TEST SMTP CONNECTION
// ============================================================
export async function testSMTPConnection() {
  try {
    await transporter.verify();
    console.log('✅ [NotifMailer] SMTP Connection Success');
    return { success: true, message: 'SMTP Connected' };
  } catch (error) {
    console.error('❌ [NotifMailer] SMTP Connection Failed:', error.message);
    return { success: false, error: error.message };
  }
}

// ============================================================
// FUNGSI KIRIM EMAIL NOTIFIKASI INFORMASI
// ============================================================
export async function sendInfoNotification({
  to,
  name,
  title,
  message,
  link,
  senderRole,
  projectName,
  actionType,
  timestamp
}) {
  try {
    // Format waktu
    const now = timestamp || new Date();
    const dateStr = now.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    const timeStr = now.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    const icon = iconMap[actionType] || '📢';
    const color = colorMap[actionType] || '#001d55';
    const actionLabel = actionLabels[actionType] || 'INFORMATION';

    // Role display
    const senderDisplay = roleLabels[senderRole] || senderRole || 'User';

    // Subject berdasarkan tipe
    const subjectMap = {
      upload: `📁 Project Baru: ${projectName || 'Project'}`,
      approved: `✅ Project Disetujui: ${projectName || 'Project'}`,
      rejected: `❌ Project Ditolak: ${projectName || 'Project'}`,
      finished: `🎉 Project Selesai: ${projectName || 'Project'}`,
      member_added: `👤 Member Baru Ditambahkan`,
      revision: `📝 Revisi Baru: ${projectName || 'Project'}`,
      system: `🔔 Notifikasi Sistem`,
    };

    const emailSubject = subjectMap[actionType] || `🔔 ${title}`;

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
      background: #f4f7fb; 
      padding: 20px; 
      margin: 0;
    }
    .container { 
      max-width: 600px; 
      margin: 0 auto; 
      background: #ffffff; 
      border-radius: 16px; 
      padding: 40px; 
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    }
    .header { 
      background: linear-gradient(135deg, #001d55, #003d9e);
      margin: -40px -40px 0;
      padding: 30px 40px;
      border-radius: 16px 16px 0 0;
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
    }
    .header p {
      color: #8ab4f8;
      margin: 4px 0 0;
      font-size: 13px;
    }
    .body-content {
      padding: 30px 0 10px;
    }
    .greeting {
      font-size: 16px;
      color: #1a202c;
      margin-bottom: 16px;
    }
    .greeting strong {
      color: #001d55;
    }
    .message-box {
      background: #f7fafc;
      border-radius: 12px;
      padding: 20px 24px;
      margin: 16px 0;
      border-left: 4px solid ${color};
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
    }
    .badge-status {
      background: ${color}20;
      color: ${color};
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
    }
    .btn:hover {
      background: #002d6e;
    }
    .footer { 
      margin-top: 30px; 
      padding-top: 20px; 
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
  </style>
</head>
<body>
  <div class="container">
    <!-- HEADER -->
    <div class="header">
      <span class="header-icon">${icon}</span>
      <h1>${title}</h1>
      <p>PT Lintas Wahana Teknologi</p>
    </div>

    <!-- BODY -->
    <div class="body-content">
      <div class="greeting">
        Yth. <strong>${name}</strong>,
      </div>

      <div class="message-box">
        <p>${message}</p>
      </div>

      <!-- INFO CARD -->
      <div class="info-card">
        <div class="info-row">
          <span class="info-label">📌 Status</span>
          <span class="info-value">
            <span class="badge badge-status">${actionLabel}</span>
          </span>
        </div>
        ${senderRole ? `
        <div class="info-row">
          <span class="info-label">👤 Dari</span>
          <span class="info-value">${senderDisplay}</span>
        </div>
        ` : ''}
        ${projectName ? `
        <div class="info-row">
          <span class="info-label">📁 Project</span>
          <span class="info-value">${projectName}</span>
        </div>
        ` : ''}
        <div class="info-row">
          <span class="info-label">⏰ Waktu</span>
          <span class="info-value">${dateStr} • ${timeStr}</span>
        </div>
      </div>

      <!-- BUTTON -->
      ${link ? `
      <div style="text-align: center;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}${link}" class="btn">
          🔗 Lihat Detail
        </a>
      </div>
      ` : ''}

      <!-- FOOTER NOTE -->
      <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e5e7eb;">
        <p style="color: #9ca3af; font-size: 11px; line-height: 1.6; margin: 0;">
          ⚡ Email ini dikirim secara otomatis oleh sistem notifikasi.
          <br>Mohon tidak membalas email ini.
        </p>
      </div>
    </div>

    <!-- FOOTER -->
    <div class="footer">
      <p>© ${new Date().getFullYear()} <strong>PT Lintas Wahana Teknologi</strong></p>
      <p class="footer-note">Secure & Trusted Solution Provider</p>
    </div>
  </div>
</body>
</html>
    `;

    const text = `
${title}

Halo ${name},

${message}

--- Detail ---
Status: ${actionLabel}
${senderRole ? `Dari: ${senderDisplay}` : ''}
${projectName ? `Project: ${projectName}` : ''}
Waktu: ${dateStr} • ${timeStr}
${link ? `Link: ${process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}${link}` : ''}

---
PT Lintas Wahana Teknologi
    `;

    const mailOptions = {
      from: `"PT Lintas Wahana Teknologi" <${process.env.SMTP_USER || 'no-reply@aiturbo.id'}>`,
      to: to,
      subject: emailSubject,
      text: text,
      html: html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ [NotifMailer] Email terkirim ke ${to} - ${emailSubject}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ [NotifMailer] Gagal kirim ke ${to}:`, error.message);
    throw error;
  }
}

// ============================================================
// FUNGSI KIRIM NOTIFIKASI PROJECT
// ============================================================
export async function sendProjectNotification({
  to,
  name,
  projectName,
  actionType,
  senderRole,
  link,
  additionalMessage
}) {
  const titles = {
    upload: '📁 Project Baru Diupload',
    approved: '✅ Project Disetujui',
    rejected: '❌ Project Ditolak',
    finished: '🎉 Project Selesai',
  };

  const messages = {
    upload: `Project "${projectName}" telah berhasil diupload oleh ${senderRole || 'User'}. Silakan tinjau project tersebut.`,
    approved: `Project "${projectName}" telah disetujui oleh ${senderRole || 'Admin'}. Project siap untuk dilanjutkan.`,
    rejected: `Project "${projectName}" telah ditolak oleh ${senderRole || 'Admin'}. Silakan periksa kembali project tersebut.`,
    finished: `Project "${projectName}" telah selesai dikerjakan. Selamat! 🎉`,
  };

  const title = titles[actionType] || '🔔 Notifikasi Project';
  const message = additionalMessage || messages[actionType] || `Ada update pada project "${projectName}"`;

  return await sendInfoNotification({
    to,
    name,
    title,
    message,
    link,
    senderRole,
    projectName,
    actionType,
  });
}

// ============================================================
// FUNGSI KIRIM NOTIFIKASI KE BANYAK USER
// ============================================================
export async function sendBulkInfoNotification({
  users,
  title,
  message,
  link,
  senderRole,
  projectName,
  actionType,
  timestamp
}) {
  const results = [];
  
  for (const user of users) {
    try {
      const result = await sendInfoNotification({
        to: user.email,
        name: user.name || 'User',
        title,
        message,
        link,
        senderRole,
        projectName,
        actionType,
        timestamp,
      });
      results.push({ email: user.email, success: true });
    } catch (error) {
      console.error(`❌ Gagal kirim ke ${user.email}:`, error.message);
      results.push({ email: user.email, success: false, error: error.message });
    }
  }

  return {
    success: results.some(r => r.success),
    total: results.length,
    successCount: results.filter(r => r.success).length,
    failedCount: results.filter(r => !r.success).length,
    results: results,
  };
}