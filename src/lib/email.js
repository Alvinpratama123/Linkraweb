// lib/email.js
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

const progressLabels = {
  'BELUM_DILAKUKAN': '⏳ Belum Dilakukan',
  'SEDANG_DIKERJAKAN': '🔄 Sedang Dikerjakan',
  'SELESAI': '✅ Selesai'
};

const approvalLabels = {
  'PENDING': '⏳ Pending',
  'APPROVED': '✅ Approved',
  'REJECTED': '❌ Rejected'
};

// 🔥 EXPORT fungsi testSMTPConnection
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

// Fungsi kirim email notifikasi revisi baru
export async function sendRevisionNotification(report, targetUsers) {
  if (!targetUsers || targetUsers.length === 0) {
    console.log('📧 Tidak ada user target untuk dikirim notifikasi');
    return { success: false, message: 'Tidak ada user target' };
  }

  // Filter user yang memiliki email
  const usersWithEmail = targetUsers.filter(user => user.email && user.email.trim() !== '');
  
  if (usersWithEmail.length === 0) {
    console.log('📧 Tidak ada user dengan email yang valid');
    return { success: false, message: 'Tidak ada email valid' };
  }

  console.log(`📧 Mengirim ke ${usersWithEmail.length} user:`, usersWithEmail.map(u => u.email).join(', '));

  const subject = `📋 Revisi Baru: ${report.projectName}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
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
          border-bottom: 3px solid #2563eb; 
          padding-bottom: 20px; 
          margin-bottom: 25px; 
        }
        .header h1 { 
          color: #001d55; 
          margin: 0; 
          font-size: 24px; 
          font-weight: 700;
        }
        .header p {
          color: #6b7280;
          margin: 5px 0 0;
          font-size: 14px;
        }
        .badge {
          display: inline-block; 
          padding: 4px 12px; 
          border-radius: 20px; 
          font-size: 12px; 
          font-weight: 600;
        }
        .badge-sender { 
          background: #dbeafe; 
          color: #1e40af; 
        }
        .badge-target { 
          background: #fef3c7; 
          color: #92400e; 
        }
        .badge-progress { 
          background: #d1fae5; 
          color: #065f46; 
        }
        .info-card {
          background: #f8fafc;
          border-radius: 12px;
          padding: 20px;
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
          font-size: 14px;
        }
        .info-value { 
          color: #1f2937; 
          font-size: 14px;
          word-break: break-word;
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
          background: #2563eb; 
          color: #ffffff; 
          padding: 12px 28px; 
          border-radius: 8px; 
          text-decoration: none; 
          font-weight: 600; 
          margin-top: 20px;
          font-size: 14px;
        }
        .btn:hover {
          background: #1d4ed8;
        }
        .footer { 
          margin-top: 30px; 
          padding-top: 20px; 
          border-top: 1px solid #e5e7eb; 
          text-align: center; 
          color: #6b7280; 
          font-size: 13px; 
        }
        .footer strong {
          color: #001d55;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📋 Notifikasi Revisi</h1>
          <p>Ada revisi baru yang perlu perhatian Anda</p>
        </div>

        <p style="font-size: 15px; color: #374151; margin-bottom: 20px;">
          <strong>${report.sentBy?.name || 'User'}</strong> telah mengirimkan revisi untuk <strong>${roleLabels[report.targetRole] || report.targetRole}</strong>.
        </p>

        <div class="info-card">
          <h2 style="color: #001d55; margin: 0 0 15px; font-size: 18px;">📌 ${report.projectName}</h2>
          
          <div class="info-row">
            <span class="info-label">Dari:</span>
            <span class="info-value">
              <span class="badge badge-sender">${roleLabels[report.senderRole] || report.senderRole}</span>
            </span>
          </div>
          
          <div class="info-row">
            <span class="info-label">Untuk:</span>
            <span class="info-value">
              <span class="badge badge-target">${roleLabels[report.targetRole] || report.targetRole}</span>
            </span>
          </div>
          
          <div class="info-row">
            <span class="info-label">Progress:</span>
            <span class="info-value">
              <span class="badge badge-progress">${progressLabels[report.progress] || report.progress}</span>
            </span>
          </div>
          
          <div class="info-row">
            <span class="info-label">Tipe:</span>
            <span class="info-value">${report.issueType || 'MODUL'}</span>
          </div>
          
          ${report.description ? `
            <div style="margin-top: 12px;">
              <span class="info-label" style="display: block; margin-bottom: 6px;">Deskripsi:</span>
              <div class="description-box">${report.description}</div>
            </div>
          ` : ''}
        </div>

        <div style="text-align: center;">
          <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/dashboardAdmin/admin?tab=Revision" class="btn">
            🔍 Lihat Revisi
          </a>
        </div>

        <div class="footer">
          <p>Dikirim dari <strong>Lintas Wahana</strong> - Revision Issue Management</p>
          <p style="font-size: 12px; color: #9ca3af;">Email ini dikirim secara otomatis, harap tidak membalas email ini.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
    Notifikasi Revisi Baru
    
    Judul: ${report.projectName}
    Dari: ${report.senderRole} → Untuk: ${report.targetRole}
    Progress: ${report.progress}
    Deskripsi: ${report.description || 'Tidak ada deskripsi'}
    
    Lihat di: ${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/dashboardAdmin/admin?tab=Revision
  `;

  const results = [];
  
  for (const user of usersWithEmail) {
    try {
      console.log(`📧 Mengirim ke ${user.email}...`);
      
      const info = await transporter.sendMail({
        from: `"${process.env.SMTP_FROM_NAME || 'Lintas Wahana'}" <${process.env.SMTP_USER || 'no-reply@aiturbo.id'}>`,
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

// Fungsi kirim notifikasi ke semua user dengan role tertentu
export async function sendNotificationToRole(report, targetRole, prisma) {
  try {
    console.log(`📧 Mencari user dengan role: ${targetRole}`);
    
    // Ambil semua user dengan role target
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

    console.log(`📧 Ditemukan ${users.length} user dengan role ${targetRole}`);
    console.log(`📧 User details:`, users.map(u => ({ name: u.name, email: u.email, role: u.role })));

    if (users.length === 0) {
      console.log(`📧 Tidak ada user dengan role ${targetRole}`);
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

// Fungsi kirim notifikasi email umum (untuk notification.js)
export async function sendNotificationEmail({ to, name, title, message, link }) {
  if (!to) {
    console.log('📧 Tidak ada email tujuan');
    return { success: false, message: 'Email tidak ada' };
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; background: #f4f7fb; padding: 20px; margin: 0; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 40px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
        .header { border-bottom: 3px solid #2563eb; padding-bottom: 20px; margin-bottom: 25px; }
        .header h1 { color: #001d55; margin: 0; font-size: 22px; }
        .content { color: #374151; font-size: 15px; line-height: 1.6; }
        .content .icon { font-size: 40px; text-align: center; margin-bottom: 16px; }
        .btn { display: inline-block; background: #2563eb; color: #ffffff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 20px; font-size: 14px; }
        .btn:hover { background: #1d4ed8; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 13px; }
        .footer strong { color: #001d55; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔔 Notifikasi</h1>
        </div>
        <div class="content">
          <p>Halo <strong>${name || 'User'}</strong>,</p>
          <p><strong>${title}</strong></p>
          ${message ? `<p>${message}</p>` : ''}
          ${link ? `<div style="text-align: center;"><a href="${link}" class="btn">🔍 Lihat Detail</a></div>` : ''}
        </div>
        <div class="footer">
          <p>Dikirim dari <strong>Lintas Wahana</strong></p>
          <p style="font-size: 12px; color: #9ca3af;">Email ini dikirim secara otomatis, harap tidak membalas email ini.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    console.log(`📧 Kirim notifikasi email ke ${to}: ${title}`);

    const info = await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME || 'Lintas Wahana'}" <${process.env.SMTP_USER || 'no-reply@aiturbo.id'}>`,
      to: to,
      subject: `🔔 ${title}`,
      html: html,
    });

    console.log(`✅ Email notifikasi terkirim ke ${to} (${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ Gagal kirim notifikasi email ke ${to}:`, error.message);
    return { success: false, error: error.message };
  }
}
