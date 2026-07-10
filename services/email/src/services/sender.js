import nodemailer from "nodemailer";

const config = {
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  user: process.env.SMTP_USER || "pt.linkra.wahana.teknologi@gmail.com",
  pass: process.env.SMTP_PASS || "jzhlrjserfeycpvu",
  from: process.env.EMAIL_FROM || '"Lintas Wahana" <pt.linkra.wahana.teknologi@gmail.com>',
};

let transporter = null;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: false,
      auth: { user: config.user, pass: config.pass },
    });
  }
  return transporter;
}

export const Sender = {
  async send({ to, subject, html, from }) {
    const t = getTransporter();
    return t.sendMail({ from: from || config.from, to, subject, html });
  },

  async testConnection() {
    const t = getTransporter();
    return t.verify();
  },
};
