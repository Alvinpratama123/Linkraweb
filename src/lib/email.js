// lib/email.js
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

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

// ─── AMBIL LOGO ────────────────────────────────────────────────
function getLogoBase64() {
  try {
    const logoPaths = [
      path.join(process.cwd(), 'public/images/logo.png'),
      path.join(process.cwd(), 'public/images/oip.png'),
      path.join(process.cwd(), 'public/logo.png'),
      path.join(process.cwd(), 'public/favicon.ico'),
    ];

    for (const logoPath of logoPaths) {
      if (fs.existsSync(logoPath)) {
        const imageBuffer = fs.readFileSync(logoPath);
        const base64 = imageBuffer.toString('base64');
        const ext = path.extname(logoPath).substring(1);
        return `data:image/${ext};base64,${base64}`;
      }
    }
    return null;
  } catch (error) {
    console.error('Error loading logo:', error);
    return null;
  }
}

// ─── LABEL UNTUK ROLE ──────────────────────────────────────────
const roleLabels = {
  'QA': 'QA',
  'FRONTEND': 'Frontend Developer',
  'BACKEND': 'Backend Developer',
  'DEVOPS': 'DevOps',
  'ADMIN': 'Administrator',
  'MEMBER': 'Member',
  'UI/UX': 'UI/UX Designer',
  'PM': 'Project Manager',
};

// ─── LABEL UNTUK PROGRESS ─────────────────────────────────────
const progressLabels = {
  'BELUM_DILAKUKAN': 'Belum Dilakukan',
  'SEDANG_DIKERJAKAN': 'Sedang Dikerjakan',
  'SELESAI': 'Selesai'
};

// ─── LABEL UNTUK APPROVAL ─────────────────────────────────────
const approvalLabels = {
  'PENDING': 'Pending',
  'APPROVED': 'Approved',
  'REJECTED': 'Rejected'
};

// ─── GET STYLED LABEL ──────────────────────────────────────────
function getStatusBadge(label, type) {
  const colors = {
    'Belum Dilakukan': 'background: #fef3c7; color: #92400e;',
    'Sedang Dikerjakan': 'background: #dbeafe; color: #1e40af;',
    'Selesai': 'background: #d1fae5; color: #065f46;',
    'Pending': 'background: #fef3c7; color: #92400e;',
    'Approved': 'background: #d1fae5; color: #065f46;',
    'Rejected': 'background: #fee2e2; color: #991b1b;',
  };
  return colors[label] || 'background: #f3f4f6; color: #4b5563;';
}

// ─── EMAIL TEMPLATE DENGAN LOGO ──────────────────────────────
function getEmailTemplate({ title, content, buttonText, buttonLink, showAudio = false }) {
  const logoBase64 = getLogoBase64();
  
  // 🔥 MULTIPLE AUDIO FORMATS untuk kompatibilitas
  const audioUrls = {
    mp3: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/sounds/notification.mp3`,
    ogg: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/sounds/notification.ogg`,
    wav: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/sounds/notification.wav`,
  };
  
  // Fallback ke CDN jika file lokal tidak ada
  const fallbackAudio = 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_c8c8a8f3c6.mp3';
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
      background: #f4f7fb;
      padding: 20px;
      margin: 0;
      -webkit-font-smoothing: antialiased;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    }
    .header {
      background: linear-gradient(135deg, #001d55, #003d9e);
      padding: 24px 32px;
      text-align: center;
      color: #ffffff;
    }
    .header-logo {
      max-height: 50px;
      margin-bottom: 12px;
      filter: brightness(0) invert(1);
    }
    .header-title {
      font-size: 22px;
      font-weight: 700;
      margin: 0;
    }
    .header-subtitle {
      font-size: 13px;
      margin-top: 4px;
      opacity: 0.8;
    }
    .body-content {
      padding: 32px;
    }
    .greeting {
      font-size: 15px;
      color: #1a202c;
      margin: 0 0 16px;
    }
    .greeting strong {
      color: #001d55;
    }
    .message-text {
      color: #374151;
      font-size: 14px;
      line-height: 1.7;
      margin: 0 0 20px;
    }
    .info-card {
      background: #f8fafc;
      border-radius: 12px;
      padding: 16px 20px;
      margin: 16px 0;
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
    .description-box {
      background: #f1f5f9;
      border-radius: 8px;
      padding: 12px 16px;
      margin-top: 8px;
      color: #1f2937;
      font-size: 14px;
      border-left: 3px solid #2563eb;
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
    .btn-container {
      text-align: center;
      margin-top: 8px;
    }
    .audio-player {
      background: #f1f5f9;
      border-radius: 8px;
      padding: 12px 16px;
      margin: 16px 0;
      border: 1px solid #e5e7eb;
    }
    .audio-player .header-audio {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 8px;
    }
    .audio-player .label {
      font-size: 13px;
      color: #1e293b;
      font-weight: 600;
    }
    .audio-player .sub-label {
      font-size: 11px;
      color: #64748b;
    }
    .audio-player audio {
      width: 100%;
      height: 40px;
      border-radius: 6px;
      background: #f8fafc;
    }
    .audio-player .btn-play {
      display: inline-block;
      background: #001d55;
      color: #ffffff;
      padding: 8px 20px;
      border-radius: 6px;
      text-decoration: none;
      font-size: 13px;
      font-weight: 500;
      margin-top: 8px;
      border: none;
      cursor: pointer;
    }
    .audio-player .btn-play:hover {
      background: #002d6e;
    }
    .footer {
      padding: 20px 32px;
      text-align: center;
      font-size: 12px;
      color: #6b7280;
      border-top: 1px solid #e5e7eb;
    }
    .footer-logo {
      max-height: 30px;
      margin-bottom: 8px;
      opacity: 0.6;
    }
    .footer-company {
      font-weight: 500;
      color: #001d55;
      margin-bottom: 4px;
    }
    .footer-note {
      font-size: 11px;
      color: #9ca3af;
      margin-top: 4px;
    }
    .audio-fallback {
      font-size: 12px;
      color: #64748b;
      margin-top: 6px;
      padding: 8px;
      background: #f1f5f9;
      border-radius: 6px;
      text-align: center;
    }
    @media (max-width: 480px) {
      .body-content { padding: 20px; }
      .header { padding: 20px; }
      .info-label { width: 80px; font-size: 12px; }
      .info-value { font-size: 12px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      ${logoBase64 ? `
        <img src="${logoBase64}" alt="PT Lintas Wahana Teknologi" class="header-logo" />
      ` : `
        <div style="font-size: 28px; font-weight: 700;">LWT</div>
      `}
      <div class="header-title">${title}</div>
      <div class="header-subtitle">PT Lintas Wahana Teknologi</div>
    </div>
    <div class="body-content">
      ${content}
      
      ${showAudio ? `
      <!-- 🔥 AUDIO NOTIFICATION -->
      <div class="audio-player">
        <div class="header-audio">
          <span style="font-size: 20px; font-weight: 700;">NOTIFIKASI SUARA</span>
          <div>
            <div class="label">Notifikasi Suara</div>
            <div class="sub-label">Klik tombol play untuk mendengar notifikasi</div>
          </div>
        </div>
        
        <!-- Multiple format audio untuk kompatibilitas -->
        <audio controls preload="none">
          <source src="${audioUrls.mp3}" type="audio/mpeg">
          <source src="${audioUrls.ogg}" type="audio/ogg">
          <source src="${audioUrls.wav}" type="audio/wav">
          <source src="${fallbackAudio}" type="audio/mpeg">
          Browser Anda tidak mendukung pemutar audio.
        </audio>
        
        <!-- Fallback link jika audio tidak bisa diputar -->
        <div class="audio-fallback">
          Tidak bisa memutar audio?
          <a href="${audioUrls.mp3}" download="notification.mp3" style="color: #001d55; font-weight: 600;">
            Download file audio
          </a>
        </div>
      </div>
      ` : ''}
      
      ${buttonText && buttonLink ? `
      <div class="btn-container">
        <a href="${buttonLink}" class="btn">${buttonText} →</a>
      </div>
      ` : ''}
    </div>
    <div class="footer">
      ${logoBase64 ? `
        <img src="${logoBase64}" alt="PT Lintas Wahana Teknologi" class="footer-logo" />
      ` : ''}
      <div class="footer-company">PT Lintas Wahana Teknologi</div>
      <div style="font-size:11px; color:#9ca3af; margin-bottom:4px;">Secure & Trusted Solution Provider</div>
      <div>© ${new Date().getFullYear()} PT Lintas Wahana Teknologi — All rights reserved.</div>
      <div class="footer-note">Email ini dikirim secara otomatis oleh sistem. Mohon tidak membalas email ini.</div>
    </div>
  </div>
</body>
</html>
  `;
}

// ─── TEST SMTP CONNECTION ─────────────────────────────────────
export async function testSMTPConnection() {
  try {
    await transporter.verify();
    console.log('✅ SMTP Connection Success');
    return { success: true, message: 'SMTP Connected' };
  } catch (error) {
    console.error('❌ SMTP Connection Failed:', error.message);
    return { success: false, error: error.message };
  }
}

// ─── SEND REVISION NOTIFICATION ──────────────────────────────
export async function sendRevisionNotification(report, targetUsers) {
  if (!targetUsers || targetUsers.length === 0) {
    console.log(' Tidak ada user target untuk dikirim notifikasi');
    return { success: false, message: 'Tidak ada user target' };
  }

  const usersWithEmail = targetUsers.filter(user => user.email && user.email.trim() !== '');
  
  if (usersWithEmail.length === 0) {
    console.log(' Tidak ada user dengan email yang valid');
    return { success: false, message: 'Tidak ada email valid' };
  }

  console.log(` Mengirim ke ${usersWithEmail.length} user:`, usersWithEmail.map(u => u.email).join(', '));

  const subject = `Revisi Baru: ${report.projectName}`;
  const senderLabel = roleLabels[report.senderRole] || report.senderRole;
  const targetLabel = roleLabels[report.targetRole] || report.targetRole;
  const progressLabel = progressLabels[report.progress] || report.progress;
  const progressBadge = getStatusBadge(progressLabel, 'progress');

  const html = getEmailTemplate({
    title: 'Notifikasi Revisi Baru',
    content: `
      <p class="greeting">Yth. <strong>${targetLabel}</strong>,</p>
      <p class="message-text">
        <strong>${report.sentBy?.name || 'User'}</strong> telah mengirimkan revisi untuk project <strong>${report.projectName}</strong>.
      </p>
      
      <div class="info-card">
        <div class="info-row">
          <span class="info-label">Project</span>
          <span class="info-value"><strong>${report.projectName}</strong></span>
        </div>
        <div class="info-row">
          <span class="info-label">Dari</span>
          <span class="info-value"><span class="badge" style="${getStatusBadge(senderLabel)}">${senderLabel}</span></span>
        </div>
        <div class="info-row">
          <span class="info-label">Untuk</span>
          <span class="info-value"><span class="badge" style="${getStatusBadge(targetLabel)}">${targetLabel}</span></span>
        </div>
        <div class="info-row">
          <span class="info-label">Progress</span>
          <span class="info-value"><span class="badge" style="${progressBadge}">${progressLabel}</span></span>
        </div>
        <div class="info-row">
          <span class="info-label">Tipe</span>
          <span class="info-value">${report.issueType || 'MODUL'}</span>
        </div>
        ${report.description ? `
          <div style="margin-top: 12px;">
            <span class="info-label" style="display: block; margin-bottom: 6px;">Deskripsi</span>
            <div class="description-box">${report.description}</div>
          </div>
        ` : ''}
      </div>
    `,
    buttonText: 'Lihat Revisi',
    buttonLink: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/dashboardAdmin?tab=revision`,
    showAudio: true,
  });

  const text = `
    Notifikasi Revisi Baru
    
    Project: ${report.projectName}
    Dari: ${report.senderRole} → Untuk: ${report.targetRole}
    Progress: ${report.progress}
    Tipe: ${report.issueType || 'MODUL'}
    Deskripsi: ${report.description || 'Tidak ada deskripsi'}
    
    Lihat di: ${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/dashboardAdmin/admin?tab=Revision
  `;

  const results = [];
  
  for (const user of usersWithEmail) {
    try {
      console.log(` Mengirim ke ${user.email}...`);
      
      const info = await transporter.sendMail({
        from: `"PT Lintas Wahana Teknologi" <${process.env.SMTP_USER || 'no-reply@aiturbo.id'}>`,
        to: user.email,
        subject: subject,
        text: text,
        html: html,
      });
      
      console.log(`✅ Email terkirim ke ${user.email} (${info.messageId})`);
      results.push({ 
        email: user.email, 
        success: true, 
        messageId: info.messageId 
      });
    } catch (error) {
      console.error(`❌ Gagal kirim ke ${user.email}:`, error.message);
      results.push({ 
        email: user.email, 
        success: false, 
        error: error.message 
      });
    }
  }

  return {
    success: results.some(r => r.success),
    total: results.length,
    successCount: results.filter(r => r.success).length,
    failedCount: results.filter(r => !r.success).length,
    results: results
  };
}

// ─── SEND NOTIFICATION TO ROLE ──────────────────────────────
export async function sendNotificationToRole(report, targetRole, prisma) {
  try {
    console.log(` Mencari user dengan role: ${targetRole}`);
    
    const users = await prisma.user.findMany({
      where: { 
        role: targetRole,
      },
      select: { 
        id: true, 
        email: true, 
        name: true,
        role: true 
      }
    });

    console.log(` Ditemukan ${users.length} user dengan role ${targetRole}`);
    console.log(` User details:`, users.map(u => ({ name: u.name, email: u.email, role: u.role })));

    if (users.length === 0) {
      console.log(` Tidak ada user dengan role ${targetRole}`);
      return { 
        success: false, 
        message: `Tidak ada user dengan role ${targetRole}`,
        users: [] 
      };
    }

    const results = await sendRevisionNotification(report, users);
    
    return { 
      success: results.success,
      message: `Notifikasi dikirim ke ${results.successCount} dari ${results.total} user`,
      total: results.total,
      successCount: results.successCount,
      failedCount: results.failedCount,
      results: results.results 
    };
  } catch (error) {
    console.error('❌ Gagal kirim notifikasi ke role:', error);
    return { success: false, error: error.message };
  }
}

// ─── SEND NOTIFICATION EMAIL WITH AUDIO ──────────────────────
export async function sendNotificationEmail({ to, name, title, message, type, link }) {
  try {
    const typeLabels = {
      project: { label: 'Project', color: '#3b82f6' },
      member: { label: 'Member', color: '#8b5cf6' },
      revision: { label: 'Revisi', color: '#f59e0b' },
      system: { label: 'Sistem', color: '#6b7280' },
      approved: { label: 'Disetujui', color: '#22c55e' },
      rejected: { label: 'Ditolak', color: '#ef4444' },
      finished: { label: 'Selesai', color: '#22c55e' },
    };

    const typeInfo = typeLabels[type] || typeLabels.system;

    const html = getEmailTemplate({
      title: title,
      content: `
        <p class="greeting">Yth. <strong>${name}</strong>,</p>
        <p class="message-text">${message}</p>
        <div class="info-card">
          <div class="info-row">
            <span class="info-label">Status</span>
            <span class="info-value"><span class="badge" style="${getStatusBadge(typeInfo.label)}">${typeInfo.label}</span></span>
          </div>
          <div class="info-row">
            <span class="info-label">Waktu</span>
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
      `,
      buttonText: 'Lihat Detail',
      buttonLink: link ? `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}${link}` : null,
      showAudio: true,
    });

    const info = await transporter.sendMail({
      from: `"PT Linkra  Wahana Teknologi" <${process.env.SMTP_USER || 'no-reply@aiturbo.id'}>`,
      to: to,
      subject: title,
      html,
    });

    console.log(`✅ Notification email sent to ${to}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Error sending notification email:", error);
    throw error;
  }
}

// ─── EXPORT ────────────────────────────────────────────────────
export {
  transporter,
  roleLabels,
  progressLabels,
  approvalLabels,
  getStatusBadge,
  getEmailTemplate,
  getLogoBase64,
};
