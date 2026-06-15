import nodemailer from "nodemailer";

// Konfigurasi transporter dengan error handling
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: parseInt(process.env.MAIL_PORT || "587"),
  secure: process.env.MAIL_SECURE === "true", // true untuk port 465, false untuk port 587
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false, // Hanya untuk development
  },
});

// Verifikasi koneksi transporter
export async function verifyEmailConnection() {
  try {
    await transporter.verify();
    console.log("Email server is ready to send messages");
    return true;
  } catch (error) {
    console.error("Email server connection error:", error);
    return false;
  }
}

// Kirim email verifikasi login
export async function sendLoginVerificationEmail({ to, name, token }) {
  const verifyUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/verif/verify-login?token=${token}`;

  const html = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Konfirmasi Login</title>
      <style>
        body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 500px; margin: 40px auto; background: #fff; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); overflow: hidden; }
        .header { background: #001d55; padding: 30px; text-align: center; }
        .header h1 { color: #fff; margin: 0; font-size: 22px; }
        .body { padding: 30px; color: #333; }
        .body p { font-size: 15px; line-height: 1.6; }
        .warning { background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 12px 16px; border-radius: 4px; margin: 20px 0; font-size: 14px; color: #92400E; }
        .btn-container { text-align: center; margin: 30px 0; }
        .btn { display: inline-block; background: #001d55; color: #fff !important; text-decoration: none; padding: 14px 36px; border-radius: 8px; font-size: 16px; font-weight: bold; }
        .btn:hover { background: #00327a; }
        .expiry { font-size: 13px; color: #888; text-align: center; margin-top: 10px; }
        .footer { background: #f4f4f4; padding: 16px; text-align: center; font-size: 12px; color: #888; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Konfirmasi Login</h1>
        </div>
        <div class="body">
          <p>Halo, <strong>${name}</strong>!</p>
          <p>Kami mendeteksi percobaan login ke akun Anda. Apakah ini benar-benar Anda?</p>
          <div class="warning">
            ⚠️ Jika Anda <strong>tidak merasa melakukan login</strong>, abaikan email ini dan segera ganti password Anda.
          </div>
          <p>Jika ya, klik tombol di bawah untuk masuk ke dashboard:</p>
          <div class="btn-container">
            <a href="${verifyUrl}" class="btn">Ya, Saya Login</a>
          </div>
          <p class="expiry">🔐 Link ini hanya berlaku selama <strong>15 menit</strong>.</p>
          <p style="font-size: 12px; color: #999; margin-top: 20px;">Atau copy link ini ke browser: ${verifyUrl}</p>
        </div>
        <div class="footer">
          <p>Email ini dikirim otomatis oleh sistem Lintas Wahana.</p>
          <p>Harap tidak membalas email ini.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
Konfirmasi Login - Lintas Wahana

Halo, ${name}!

Kami mendeteksi percobaan login ke akun Anda. Apakah ini benar-benar Anda?

Jika Anda TIDAK merasa melakukan login, abaikan email ini dan segera ganti password Anda.

Jika ya, klik link berikut untuk masuk ke dashboard:
${verifyUrl}

Link ini hanya berlaku selama 15 menit.

Email ini dikirim otomatis, harap jangan membalas.
  `;

  try {
    const info = await transporter.sendMail({
      from: `"${process.env.MAIL_FROM_NAME || "Lintas Wahana"}" <${process.env.MAIL_FROM_ADDRESS || process.env.MAIL_USERNAME}>`,
      to,
      subject: "🔐 Konfirmasi Login - Lintas Wahana",
      html,
      text,
    });
    
    console.log("Email sent: %s", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Email send error:", error);
    return { success: false, error: error.message };
  }
}

// Kirim email welcome untuk member baru
export async function sendWelcomeEmail({ to, name, email, password }) {
  const loginUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/login`;

  const html = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Selamat Datang</title>
      <style>
        body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 500px; margin: 40px auto; background: #fff; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); overflow: hidden; }
        .header { background: #001d55; padding: 30px; text-align: center; }
        .header h1 { color: #fff; margin: 0; font-size: 22px; }
        .body { padding: 30px; color: #333; }
        .body p { font-size: 15px; line-height: 1.6; }
        .credentials { background: #f0f9ff; border: 1px solid #bae6fd; padding: 16px; border-radius: 8px; margin: 20px 0; }
        .credentials p { margin: 8px 0; }
        .credentials strong { color: #001d55; }
        .btn-container { text-align: center; margin: 30px 0; }
        .btn { display: inline-block; background: #001d55; color: #fff !important; text-decoration: none; padding: 14px 36px; border-radius: 8px; font-size: 16px; font-weight: bold; }
        .btn:hover { background: #00327a; }
        .warning { background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 12px 16px; border-radius: 4px; margin: 20px 0; font-size: 14px; color: #92400E; }
        .footer { background: #f4f4f4; padding: 16px; text-align: center; font-size: 12px; color: #888; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Selamat Datang!</h1>
        </div>
        <div class="body">
          <p>Halo, <strong>${name}</strong>!</p>
          <p>Selamat! Akun Anda telah berhasil dibuat di sistem Lintas Wahana.</p>
          
          <div class="credentials">
            <p><strong>📧 Email:</strong> ${email}</p>
            <p><strong>🔑 Password:</strong> ${password}</p>
          </div>
          
          <div class="warning">
            ⚠️ <strong>Penting!</strong> Kami sarankan Anda mengganti password setelah login pertama kali untuk keamanan.
          </div>
          
          <p>Klik tombol di bawah untuk login ke dashboard:</p>
          <div class="btn-container">
            <a href="${loginUrl}" class="btn">Login Sekarang</a>
          </div>
          <p style="font-size: 12px; color: #999; margin-top: 20px;">Atau copy link ini ke browser: ${loginUrl}</p>
        </div>
        <div class="footer">
          <p>Email ini dikirim otomatis oleh sistem Lintas Wahana.</p>
          <p>Harap simpan informasi login Anda dengan aman.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
Selamat Datang di Lintas Wahana!

Halo ${name},

Selamat! Akun Anda telah berhasil dibuat.

Berikut adalah informasi login Anda:
Email: ${email}
Password: ${password}

⚠️ Penting: Kami sarankan Anda mengganti password setelah login pertama kali untuk keamanan.

Klik link berikut untuk login:
${loginUrl}

Email ini dikirim otomatis, harap simpan informasi login Anda dengan aman.
  `;

  try {
    const info = await transporter.sendMail({
      from: `"${process.env.MAIL_FROM_NAME || "Lintas Wahana"}" <${process.env.MAIL_FROM_ADDRESS || process.env.MAIL_USERNAME}>`,
      to,
      subject: "🎉 Selamat Datang di Lintas Wahana",
      html,
      text,
    });
    
    console.log("Welcome email sent: %s", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Welcome email send error:", error);
    return { success: false, error: error.message };
  }
}

// Kirim email reset password
export async function sendResetPasswordEmail({ to, name, token }) {
  const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}`;

  const html = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Reset Password</title>
      <style>
        body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 500px; margin: 40px auto; background: #fff; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); overflow: hidden; }
        .header { background: #001d55; padding: 30px; text-align: center; }
        .header h1 { color: #fff; margin: 0; font-size: 22px; }
        .body { padding: 30px; color: #333; }
        .body p { font-size: 15px; line-height: 1.6; }
        .btn-container { text-align: center; margin: 30px 0; }
        .btn { display: inline-block; background: #001d55; color: #fff !important; text-decoration: none; padding: 14px 36px; border-radius: 8px; font-size: 16px; font-weight: bold; }
        .btn:hover { background: #00327a; }
        .warning { background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 12px 16px; border-radius: 4px; margin: 20px 0; font-size: 14px; color: #92400E; }
        .expiry { font-size: 13px; color: #888; text-align: center; margin-top: 10px; }
        .footer { background: #f4f4f4; padding: 16px; text-align: center; font-size: 12px; color: #888; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Reset Password</h1>
        </div>
        <div class="body">
          <p>Halo, <strong>${name}</strong>!</p>
          <p>Kami menerima permintaan untuk mereset password akun Anda.</p>
          
          <div class="warning">
            ⚠️ Jika Anda <strong>tidak meminta reset password</strong>, abaikan email ini. Password Anda tidak akan berubah.
          </div>
          
          <p>Klik tombol di bawah untuk mereset password:</p>
          <div class="btn-container">
            <a href="${resetUrl}" class="btn">Reset Password</a>
          </div>
          <p class="expiry">🔐 Link ini hanya berlaku selama <strong>1 jam</strong>.</p>
        </div>
        <div class="footer">
          <p>Email ini dikirim otomatis oleh sistem Lintas Wahana.</p>
          <p>Harap tidak membalas email ini.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"${process.env.MAIL_FROM_NAME || "Lintas Wahana"}" <${process.env.MAIL_FROM_ADDRESS || process.env.MAIL_USERNAME}>`,
      to,
      subject: "🔐 Reset Password - Lintas Wahana",
      html,
      text: `Halo ${name},\n\nKlik link berikut untuk reset password: ${resetUrl}\n\nLink ini berlaku 1 jam.`,
    });
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Reset password email error:", error);
    return { success: false, error: error.message };
  }
}