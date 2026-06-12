import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: parseInt(process.env.MAIL_PORT || "587"),
  secure: false,
  tls: {
    rejectUnauthorized: false,
  },
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});

export async function sendLoginVerificationEmail({ to, name, token }) {
  const verifyUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/verif/verify-login?token=${token}`;

  const html = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8" />
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
        .expiry { font-size: 13px; color: #888; text-align: center; margin-top: 10px; }
        .footer { background: #f4f4f4; padding: 16px; text-align: center; font-size: 12px; color: #888; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header"><h1>Konfirmasi Login</h1></div>
        <div class="body">
          <p>Halo, <strong>${name}</strong>!</p>
          <p>Kami mendeteksi percobaan login ke akun Anda. Apakah ini benar-benar Anda?</p>
          <div class="warning">
            Jika Anda <strong>tidak merasa melakukan login</strong>, abaikan email ini dan segera ganti password Anda.
          </div>
          <p>Jika ya, klik tombol di bawah untuk masuk ke dashboard:</p>
          <div class="btn-container">
            <a href="${verifyUrl}" class="btn">Ya, Saya Login</a>
          </div>
          <p class="expiry">Link ini hanya berlaku selama <strong>15 menit</strong>.</p>
        </div>
        <div class="footer">Email ini dikirim otomatis, harap jangan membalas.</div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
    to,
    subject: "Konfirmasi Login - Lintas Wahana",
    html,
  });
}