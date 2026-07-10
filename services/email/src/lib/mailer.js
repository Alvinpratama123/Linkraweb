import { Sender } from "./services/sender.js";

const config = {
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  user: process.env.SMTP_USER || "pt.linkra.wahana.teknologi@gmail.com",
  pass: process.env.SMTP_PASS || "jzhlrjserfeycpvu",
  from: process.env.EMAIL_FROM || '"Lintas Wahana" <pt.linkra.wahana.teknologi@gmail.com>',
};

export { config, Sender };
