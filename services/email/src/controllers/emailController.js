import { Sender } from "../services/sender.js";

export const EmailController = {
  async testSmtp(req, res, next) {
    try {
      const result = await Sender.testConnection();
      res.json({ success: true, message: "SMTP connection OK", data: result });
    } catch (err) {
      res.status(500).json({ success: false, message: "SMTP connection failed", error: err.message });
    }
  },

  async send(req, res, next) {
    try {
      const { to, subject, html, from } = req.body;
      if (!to || !subject || !html) {
        return res.status(400).json({ success: false, message: "to, subject, html wajib diisi" });
      }
      await Sender.send({ to, subject, html, from });
      res.json({ success: true, message: "Email berhasil dikirim" });
    } catch (err) {
      next(err);
    }
  },
};
