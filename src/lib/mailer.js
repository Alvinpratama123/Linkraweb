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
export async function sendRegisterOtpEmail({
  to,
  name,
  code,
}) {
  const html = `
    <div style="font-family:Arial;padding:20px">
      <h2>Verifikasi Registrasi</h2>

      <p>Halo ${name},</p>

      <p>Masukkan kode OTP berikut:</p>

      <div style="
        font-size:32px;
        font-weight:bold;
        letter-spacing:8px;
        padding:20px;
        background:#f4f4f4;
        text-align:center;
        border-radius:10px;
      ">
        ${code}
      </div>

      <p>Berlaku 15 menit.</p>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.MAIL_FROM_ADDRESS,
    to,
    subject: "Kode OTP Registrasi",
    html,
  });
}