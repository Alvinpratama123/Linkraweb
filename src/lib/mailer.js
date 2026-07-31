// lib/mailer.js
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

// Konfigurasi transporter
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: parseInt(process.env.MAIL_PORT || "587"),
  secure: process.env.MAIL_SECURE === "true",
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
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

// ─── HELPER: HTML EMAIL TEMPLATE ─────────────────────────────
function getEmailTemplate({ 
  title, 
  subtitle, 
  content, 
  buttonText, 
  buttonLink, 
  footerNote,
  showAudio = false,
   audioUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/sounds/sounds.mp3`,
}) {
  const logoBase64 = getLogoBase64();
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
      background-color: #f4f7fb;
      -webkit-font-smoothing: antialiased;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 8px 24px rgba(0,0,0,0.08);
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
      font-size: 24px;
      font-weight: 700;
      margin: 0;
    }
    .header-subtitle {
      font-size: 13px;
      margin-top: 6px;
      opacity: 0.9;
    }
    .body-content {
      padding: 32px;
      color: #1f2937;
    }
    .greeting {
      margin: 0 0 12px;
      font-size: 16px;
    }
    .greeting strong {
      color: #001d55;
    }
    .message-text {
      margin: 0 0 16px;
      line-height: 1.6;
      color: #374151;
    }
    .code-box {
      background: #f8fafc;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 16px;
      margin: 16px 0;
    }
    .code-box .label {
      font-size: 12px;
      color: #6b7280;
      font-weight: 500;
    }
    .code-box .value {
      font-size: 28px;
      font-weight: 700;
      color: #001d55;
      letter-spacing: 4px;
      font-family: ui-monospace, monospace;
    }
    .info-grid {
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
      justify-content: space-between;
    }
    .info-row:last-child {
      border-bottom: none;
    }
    .info-label {
      color: #6b7280;
      font-size: 13px;
    }
    .info-value {
      color: #1f2937;
      font-size: 13px;
      font-weight: 500;
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
    .audio-player {
      background: #f1f5f9;
      border-radius: 8px;
      padding: 10px 16px;
      margin: 16px 0;
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }
    .audio-player .label {
      font-size: 12px;
      color: #64748b;
      font-weight: 500;
      white-space: nowrap;
    }
    .audio-player audio {
      flex: 1;
      min-width: 200px;
      height: 36px;
      border-radius: 4px;
    }
    .security-note {
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 12px;
      padding: 16px 20px;
      margin: 16px 0;
    }
    .security-note .title {
      color: #dc2626;
      font-weight: 600;
      font-size: 13px;
      margin-bottom: 8px;
    }
    .security-note .item {
      color: #6b7280;
      font-size: 12.5px;
      margin-bottom: 4px;
      padding-left: 16px;
      position: relative;
    }
    .security-note .item:before {
      content: "•";
      position: absolute;
      left: 0;
      color: #dc2626;
    }
    .footer {
      padding: 20px 32px 32px;
      font-size: 12px;
      color: #6b7280;
      border-top: 1px solid #e5e7eb;
      text-align: center;
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
    @media (max-width: 480px) {
      .body-content { padding: 20px; }
      .header { padding: 20px; }
      .code-box .value { font-size: 22px; }
      .audio-player { flex-direction: column; align-items: stretch; }
      .audio-player .label { text-align: center; }
      .audio-player audio { min-width: auto; }
    }
  </style>
</head>
<body style="margin:0; padding:32px 16px; background-color:#f4f7fb;">
  <div class="container">
    <!-- Header -->
    <div class="header">
      ${logoBase64 ? `
        <img src="${logoBase64}" alt="PT Lintas Wahana Teknologi" class="header-logo" />
      ` : `
        <div style="font-size: 28px; font-weight: 700;">LWT</div>
      `}
      <div class="header-title">${title}</div>
      <div class="header-subtitle">${subtitle}</div>
    </div>
    
    <!-- Body -->
    <div class="body-content">
      ${content}
      
      ${showAudio ? `
      <!-- Audio Notification -->
      <div class="audio-player">
        <span class="label">Notifikasi Suara</span>
        <audio controls>
          <source src="${audioUrl}" type="audio/mpeg">
          Browser Anda tidak mendukung pemutar audio.
        </audio>
      </div>
      ` : ''}
      
      ${buttonText && buttonLink ? `
      <div style="text-align: center; margin-top: 16px;">
        <a href="${buttonLink}" class="btn">${buttonText} →</a>
      </div>
      ` : ''}
    </div>
    
    <!-- Footer -->
    <div class="footer">
      ${logoBase64 ? `
        <img src="${logoBase64}" alt="PT Lintas Wahana Teknologi" class="footer-logo" />
      ` : ''}
      <div class="footer-company">PT Lintas Wahana Teknologi</div>
      <div style="color:#9ca3af; font-size:11px; margin-bottom:4px;">Secure & Trusted Solution Provider</div>
      <div style="color:#9ca3af; font-size:11px;">
        © ${new Date().getFullYear()} PT Lintas Wahana Teknologi — All rights reserved.
      </div>
      ${footerNote ? `<div class="footer-note">${footerNote}</div>` : ''}
    </div>
  </div>
</body>
</html>
  `;
}

// ─── SEND NEW MEMBER CREDENTIALS ─────────────────────────────
export async function sendNewMemberCredentialsEmail({ to, name, email, password, position }) {
  try {
    const html = getEmailTemplate({
      title: 'Akun Anda Telah Dibuat',
      subtitle: 'PT Lintas Wahana Teknologi',
      content: `
        <p class="greeting">Halo <strong>${name}</strong>,</p>
        <p class="message-text">
          Admin telah membuat akun Anda untuk akses sistem. Berikut adalah informasi login Anda:
        </p>
        <div class="info-grid">
          <div class="info-row">
            <span class="info-label">Email</span>
            <span class="info-value">${email}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Password</span>
            <span class="info-value">${password}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Posisi</span>
            <span class="info-value">${position}</span>
          </div>
        </div>
        <p class="message-text">
          Silakan login ke sistem dan segera ganti password setelah masuk untuk keamanan akun Anda.
        </p>
        <div class="security-note">
          <div class="title">Catatan Penting</div>
          <div class="item">Segera ganti password setelah login pertama kali.</div>
          <div class="item">Jangan berikan kredensial ini kepada siapa pun.</div>
          <div class="item">Hubungi admin jika ada masalah dengan akun Anda.</div>
        </div>
      `,
      buttonText: 'Login ke Sistem',
      buttonLink: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000/login',
      footerNote: 'Email ini dikirim secara otomatis. Mohon tidak membalas email ini.',
    });

    const info = await transporter.sendMail({
      from: `"PT Lintas Wahana Teknologi" <${process.env.MAIL_FROM_ADDRESS || process.env.MAIL_USERNAME}>`,
      to,
      subject: "Akun Anda Telah Dibuat - PT Lintas Wahana Teknologi",
      text: `Halo ${name}, akun Anda telah dibuat. Email: ${email}, Password: ${password}`,
      html,
    });

    console.log(`✅ Credentials email sent to ${to}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Error sending credentials email:", error);
    throw error;
  }
}

// ─── SEND PASSWORD RESET OTP ─────────────────────────────────
export async function sendPasswordResetOtpEmail({ to, name, code }) {
  try {
    const html = getEmailTemplate({
      title: 'Reset Password',
      subtitle: 'PT Lintas Wahana Teknologi',
      content: `
        <p class="greeting">Halo <strong>${name}</strong>,</p>
        <p class="message-text">
          Kami menerima permintaan reset password untuk akun Anda. Masukkan kode verifikasi di bawah ini untuk melanjutkan proses reset password.
        </p>
        <div class="code-box">
          <div class="label">Kode Reset Password</div>
          <div class="value">${code}</div>
          <div style="margin-top:8px; font-size:11px; color:#ef4444; font-weight:600; letter-spacing:1px;">
            VALID UNTUK 15 MENIT
          </div>
        </div>
        <div class="security-note">
          <div class="title">Catatan Keamanan Penting</div>
          <div class="item">Jangan pernah membagikan kode OTP ini kepada siapa pun.</div>
          <div class="item">Tim kami tidak akan pernah meminta kode verifikasi Anda.</div>
          <div class="item">Kode ini akan kedaluwarsa secara otomatis dalam waktu 15 menit.</div>
        </div>
      `,
      buttonText: 'Reset Password',
      buttonLink: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000/reset-password',
      footerNote: 'Email ini dikirim secara otomatis. Mohon tidak membalas email ini.',
    });

    const info = await transporter.sendMail({
      from: `"PT Lintas Wahana Teknologi" <${process.env.MAIL_FROM_ADDRESS || process.env.MAIL_USERNAME}>`,
      to: to,
      subject: "Reset Password - PT Lintas Wahana Teknologi",
      text: `Halo ${name}, kode OTP reset password Anda adalah ${code}. Berlaku 15 menit.`,
      html,
    });

    console.log(`✅ Reset password email sent to ${to}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Error sending reset password email:", error);
    throw error;
  }
}

// ─── SEND NOTIFICATION EMAIL WITH AUDIO ──────────────────────
export async function sendNotificationEmail({ to, name, title, message, type, link, icon }) {
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
      subtitle: `PT Lintas Wahana Teknologi • ${typeInfo.label}`,
      content: `
        <p class="greeting">Yth. <strong>${name}</strong>,</p>
        <div style="background: #f7fafc; border-left: 4px solid ${typeInfo.color}; border-radius: 8px; padding: 16px 20px; margin: 16px 0;">
          <p style="margin:0; color:#2d3748; line-height:1.7;">${message}</p>
        </div>
        <div class="info-grid">
          <div class="info-row">
            <span class="info-label">Status</span>
            <span class="info-value">${typeInfo.label}</span>
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
      footerNote: 'Email ini dikirim secara otomatis oleh sistem notifikasi. Mohon tidak membalas email ini.',
    });

    const info = await transporter.sendMail({
      from: `"PT Lintas Wahana Teknologi" <${process.env.MAIL_FROM_ADDRESS || process.env.MAIL_USERNAME}>`,
      to: to,
      subject: `${title}`,
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
  getEmailTemplate,
  getLogoBase64,
};
