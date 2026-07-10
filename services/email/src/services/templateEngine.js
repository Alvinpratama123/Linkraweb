const LOGO_BASE64 = "";

const LAYOUT = (content) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
        <tr><td style="background:#1a56db;padding:20px;text-align:center;">
          <h1 style="color:#ffffff;margin:0;font-size:24px;">PT Lintas Wahana Teknologi</h1>
        </td></tr>
        <tr><td style="padding:30px;">${content}</td></tr>
        <tr><td style="background:#f9fafb;padding:20px;text-align:center;color:#6b7280;font-size:12px;">
          <p style="margin:0;">&copy; ${new Date().getFullYear()} PT Lintas Wahana Teknologi. All rights reserved.</p>
          <p style="margin:5px 0 0;">Email ini dikirim secara otomatis, jangan membalas email ini.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

export const TemplateEngine = {
  otpRegister({ name, code }) {
    return LAYOUT(`
      <h2 style="color:#111827;margin:0 0 20px;">Halo ${name || "User"}!</h2>
      <p style="color:#374151;font-size:14px;line-height:1.6;">Terima kasih telah mendaftar di PT Lintas Wahana Teknologi. Berikut adalah kode OTP untuk verifikasi registrasi Anda:</p>
      <div style="background:#f3f4f6;border-radius:8px;padding:20px;text-align:center;margin:20px 0;">
        <span style="font-size:32px;font-weight:bold;letter-spacing:8px;color:#1a56db;">${code}</span>
      </div>
      <p style="color:#6b7280;font-size:12px;">Kode ini berlaku selama 15 menit. Jangan bagikan kode ini kepada siapapun.</p>
    `);
  },

  otpReset({ name, code }) {
    return LAYOUT(`
      <h2 style="color:#111827;margin:0 0 20px;">Halo ${name || "User"}!</h2>
      <p style="color:#374151;font-size:14px;line-height:1.6;">Kami menerima permintaan reset password untuk akun Anda. Berikut kode OTP untuk mereset password:</p>
      <div style="background:#f3f4f6;border-radius:8px;padding:20px;text-align:center;margin:20px 0;">
        <span style="font-size:32px;font-weight:bold;letter-spacing:8px;color:#1a56db;">${code}</span>
      </div>
      <p style="color:#6b7280;font-size:12px;">Kode ini berlaku selama 15 menit. Jika Anda tidak meminta reset password, abaikan email ini.</p>
    `);
  },

  memberCredentials({ name, email, password, role }) {
    return LAYOUT(`
      <h2 style="color:#111827;margin:0 0 20px;">Selamat Bergabung, ${name}!</h2>
      <p style="color:#374151;font-size:14px;line-height:1.6;">Akun Anda telah dibuat oleh admin. Berikut adalah kredensial Anda:</p>
      <table width="100%" cellpadding="8" style="background:#f3f4f6;border-radius:8px;margin:20px 0;">
        <tr><td style="font-weight:bold;color:#374151;">Email</td><td style="color:#1a56db;">${email}</td></tr>
        <tr><td style="font-weight:bold;color:#374151;">Password</td><td style="color:#1a56db;">${password}</td></tr>
        <tr><td style="font-weight:bold;color:#374151;">Role</td><td style="color:#1a56db;">${role || "Member"}</td></tr>
      </table>
      <p style="color:#6b7280;font-size:12px;">Silakan login dan segera ganti password Anda.</p>
    `);
  },

  projectCreated({ name, position, userName }) {
    return LAYOUT(`
      <h2 style="color:#111827;margin:0 0 20px;">Halo ${userName}!</h2>
      <p style="color:#374151;font-size:14px;line-height:1.6;">Project baru telah berhasil dibuat di sistem PT Lintas Wahana Teknologi.</p>
      <table width="100%" cellpadding="8" style="background:#f3f4f6;border-radius:8px;margin:20px 0;">
        <tr><td style="font-weight:bold;color:#374151;">Nama Project</td><td style="color:#1a56db;">${name}</td></tr>
        <tr><td style="font-weight:bold;color:#374151;">Posisi</td><td style="color:#1a56db;">${position || "-"}</td></tr>
      </table>
      <p style="color:#374151;font-size:14px;line-height:1.6;">Project Anda akan direview oleh admin. Silakan pantau progress melalui dashboard.</p>
    `);
  },

  revisionCreated({ projectName, senderName, senderRole, targetRole }) {
    return LAYOUT(`
      <h2 style="color:#111827;margin:0 0 20px;">Revisi Baru!</h2>
      <p style="color:#374151;font-size:14px;line-height:1.6;">Sebuah revisi telah dikirimkan untuk project <strong>${projectName}</strong>.</p>
      <table width="100%" cellpadding="8" style="background:#f3f4f6;border-radius:8px;margin:20px 0;">
        <tr><td style="font-weight:bold;color:#374151;">Project</td><td style="color:#1a56db;">${projectName}</td></tr>
        <tr><td style="font-weight:bold;color:#374151;">Dikirim Oleh</td><td style="color:#1a56db;">${senderName} (${ROLE_LABELS[senderRole] || senderRole})</td></tr>
        <tr><td style="font-weight:bold;color:#374151;">Tujuan</td><td style="color:#1a56db;">${ROLE_LABELS[targetRole] || targetRole}</td></tr>
      </table>
      <p style="color:#374151;font-size:14px;line-height:1.6;">Silakan cek dashboard untuk melihat detail revisi.</p>
    `);
  },
};
