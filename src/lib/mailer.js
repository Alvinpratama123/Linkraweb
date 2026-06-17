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

export async function verifyEmailConnection() {
  try {
    await transporter.verify();
    console.log("Email server is ready");
    return true;
  } catch (error) {
    console.error("Email connection error:", error);
    return false;
  }
}

export async function sendRegisterOtpEmail({ to, name, code }) {
  const logoPath = path.join(process.cwd(), "public/images/oip.png");
  const logoExists = fs.existsSync(logoPath);

  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>

  <body style="margin:0; padding:0; background:#f0f4f8; font-family:Arial,sans-serif;">

    <table width="100%" cellpadding="0" cellspacing="0" style="padding:30px 0;">
      <tr>
        <td align="center">

          <table width="600" cellpadding="0" cellspacing="0"
            style="background:#ffffff; border-radius:12px; overflow:hidden;">

            <!-- HEADER -->
            <tr>
              <td style="background:#001d55; padding:28px; text-align:center;">

                ${logoExists ? `
                  <img src="cid:logo"
                       alt="logo"
                       style="height:55px; display:block; margin:0 auto 10px auto;" />
                ` : ""}

                <div style="color:#fff; font-size:18px; font-weight:bold;">
                  PT Lintas Wahana Teknologi
                </div>

              </td>
            </tr>

            <!-- BODY -->
            <tr>
              <td style="padding:40px;">

                <h2 style="text-align:center; color:#001d55; margin:0;">
                  Verifikasi Akun
                </h2>

                <p style="text-align:center; color:#666; margin:8px 0 25px;">
                  Gunakan kode OTP di bawah ini
                </p>

                <p style="margin:0 0 10px;">
                  Halo <b>${name}</b>,
                </p>

                <p style="margin:0 0 25px; color:#555;">
                  Berikut kode OTP Anda:
                </p>

                <!-- OTP BOX -->
                <div style="text-align:center;
                            border:2px dashed #003399;
                            padding:25px;
                            border-radius:10px;
                            background:#f5f8ff;
                            margin-bottom:20px;">

                  <div style="font-size:34px;
                              letter-spacing:8px;
                              font-weight:bold;
                              color:#001d55;
                              font-family:monospace;">
                    ${code}
                  </div>

                </div>

                <!-- WARNING -->
                <div style="background:#fff8e1;
                            padding:10px 14px;
                            border-left:4px solid #f59e0b;
                            border-radius:6px;
                            margin-bottom:10px;
                            font-size:13px;
                            color:#92400e;">
                  ⏱ Berlaku 5 menit dan hanya bisa digunakan sekali
                </div>

                <!-- SECURITY -->
                <div style="background:#fef2f2;
                            padding:10px 14px;
                            border-left:4px solid #ef4444;
                            border-radius:6px;
                            font-size:13px;
                            color:#991b1b;">
                  🔒 Jangan bagikan kode OTP kepada siapa pun
                </div>

              </td>
            </tr>

            <!-- FOOTER -->
            <tr>
              <td style="text-align:center;
                         font-size:12px;
                         color:#94a3b8;
                         padding:20px;
                         background:#f8fafc;">
                Email otomatis, jangan dibalas.<br/>
                © ${new Date().getFullYear()} PT Lintas Wahana Teknologi
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

    // 🔥 anti spam improvement
    subject: "Kode Verifikasi Akun Anda (OTP)",
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

    headers: {
      "X-Priority": "1",
      "X-MSMail-Priority": "High",
      Importance: "high",
    },
  };

  await transporter.sendMail(mailOptions);
}