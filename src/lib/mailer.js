import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

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

export async function sendRegisterOtpEmail({ to, name, code }) {
  const logoPath = path.join(process.cwd(), "/images/oip.png");
  const logoExists = fs.existsSync(logoPath);

  const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Security Verification</title>
</head>

<body style="margin:0; padding:0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #030712; -webkit-font-smoothing: antialiased;">

<!-- BACKGROUND OUTER -->
<table width="100%" cellpadding="0" cellspacing="0" style="background: radial-gradient(circle at top, #0b1528, #030712); padding: 60px 0 80px 0;">
<tr>
<td align="center">

  <!-- TOP GLOW ACCENT LINE (Efek Garis Mewah Full-Color) -->
  <table width="560" cellpadding="0" cellspacing="0" style="margin-bottom: -4px;">
    <tr>
      <td style="height: 4px; background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899); border-radius: 4px 4px 0 0;"></td>
    </tr>
  </table>

  <!-- MAIN CARD CONTAINER -->
  <table width="560" cellpadding="0" cellspacing="0" style="background-color: #0f172a; border-left: 1px solid rgba(255, 255, 255, 0.08); border-right: 1px solid rgba(255, 255, 255, 0.08); border-bottom: 1px solid rgba(255, 255, 255, 0.08); border-radius: 0 0 24px 24px; overflow: hidden; box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.75);">
    
    <!-- HEADER BRANDING -->
    <tr>
      <td style="padding: 45px 40px 35px 40px; text-align: center; background: linear-gradient(180deg, rgba(30, 27, 75, 0.4) 0%, rgba(15, 23, 42, 0) 100%); border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
        
        ${logoExists ? `
        <img src="cid:logo" style="height: 58px; margin-bottom: 16px; display: inline-block; filter: drop-shadow(0 4px 12px rgba(0,0,0,0.5));" />
        ` : ""}
        
        <div style="color: #ffffff; font-size: 20px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase;">
          PT Lintas Wahana Teknologi
        </div>
        
        <div style="color: #38bdf8; font-size: 11px; font-weight: 600; margin-top: 6px; letter-spacing: 2px; text-transform: uppercase;">
          Secure Authentication System
        </div>

      </td>
    </tr>

    <!-- EMAIL BODY -->
    <tr>
      <td style="padding: 45px 45px 35px 45px;">
        
        <div style="font-size: 22px; font-weight: 700; color: #ffffff; text-align: center; letter-spacing: -0.2px; line-height: 1.3;">
          Verifikasi Keamanan Akun Anda
        </div>
        
        <p style="text-align: center; color: #94a3b8; margin-top: 8px; margin-bottom: 35px; font-size: 13.5px;">
          Gunakan kode OTP berikut untuk melanjutkan proses login
        </p>
        
        <div style="font-size: 14.5px; color: #e2e8f0; margin-bottom: 10px;">
          Halo <span style="color: #ffffff; font-weight: 600;">${name}</span>,
        </div>
        
        <p style="color: #94a3b8; font-size: 13.5px; line-height: 1.6; margin-top: 0;">
          Kami mendeteksi permintaan autentikasi dari akun Anda. Masukkan kode rahasia di bawah ini untuk memvalidasi identitas Anda.
        </p>

        <!-- PREMIUM OTP BOX (Gradien Full Color & Efek Glow) -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin: 35px 0; background: linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(147, 51, 234, 0.08) 100%); border: 1px solid rgba(59, 130, 246, 0.25); border-radius: 16px;">
          <tr>
            <td style="padding: 30px 20px; text-align: center;">
              
              <div style="font-size: 38px; letter-spacing: 12px; font-weight: 800; color: #3b82f6; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; text-shadow: 0 0 25px rgba(59, 130, 246, 0.4); padding-left: 12px;">
                ${code}
              </div>
              
              <div style="margin-top: 14px; font-size: 11px; color: #f43f5e; font-weight: 700; letter-spacing: 1.5px;">
                SECURITY CODE • VALID FOR 5 MINUTES
              </div>

            </td>
          </tr>
        </table>

        <!-- SECURITY NOTICE INNER BOX -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: rgba(30, 41, 59, 0.4); border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.04);">
          <tr>
            <td style="padding: 20px; font-size: 12.5px; color: #94a3b8; line-height: 1.7;">
              <div style="color: #cbd5e1; font-weight: 600; margin-bottom: 8px; font-size: 13px;">🔒 Catatan Keamanan Penting:</div>
              <div style="margin-bottom: 4px;">• Jangan pernah membagikan kode OTP ini kepada siapa pun.</div>
              <div style="margin-bottom: 4px;">• Tim kami tidak akan pernah meminta kode verifikasi Anda.</div>
              <div>• Kode ini akan kedaluwarsa secara otomatis dalam waktu 5 menit.</div>
            </td>
          </tr>
        </table>

      </td>
    </tr>

    <!-- FOOTER -->
    <tr>
      <td style="padding: 30px 40px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid rgba(255, 255, 255, 0.05); background-color: #090f1c;">
        <div style="font-weight: 500; color: #94a3b8; margin-bottom: 4px;">PT Lintas Wahana Teknologi</div>
        <div style="margin-bottom: 16px; color: #475569;">Secure & Trusted Solution Provider</div>
        <div>
          © ${new Date().getFullYear()} PT Lintas Wahana Teknologi — All rights reserved.
        </div>
      </td>
    </tr>

  </table>

</td>
</tr>
</table>

</body>
</html>
  `;

  const mailOptions = {
    from: `"PT Lintas Wahana Teknologi" <${process.env.MAIL_FROM_ADDRESS}>`,
    to,
    subject: "Security Code: Verifikasi Akun Anda",
    text: `Halo ${name}, kode OTP Anda adalah ${code}. Berlaku 5 menit.`,
    html,

    attachments: logoExists
      ? [
          {
            filename: "oip.png",
            path: logoPath,
            cid: "logo",
            contentDisposition: "inline",
          },
        ]
      : [],
  };

  await transporter.sendMail(mailOptions);
}