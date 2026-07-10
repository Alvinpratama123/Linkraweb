import { createClient } from "redis";
import http from "http";
import { Sender } from "../services/sender.js";
import { TemplateEngine } from "../services/templateEngine.js";

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || "http://auth:3001";

const ROLE_LABELS = {
  admin: "Admin", frontend: "Frontend Developer", backend: "Backend Developer",
  uiux: "UI/UX Designer", qa: "QA (Quality Assurance)", pm: "Project Manager",
};

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch {
          reject(new Error("Invalid JSON response"));
        }
      });
    }).on("error", reject);
  });
}

function resolveUser(userId) {
  return fetchJson(`${AUTH_SERVICE_URL}/users/${userId}`).then((r) => r.data || r);
}

function resolveUsersByRole(role) {
  return fetchJson(`${AUTH_SERVICE_URL}/users?role=${role}`).then((r) => r.data || r || []);
}

export function startEventSubscriber() {
  const client = createClient({ url: process.env.REDIS_URL || "redis://localhost:6379" });
  client.on("error", (err) => console.error("[Email-Sub] Redis error:", err.message));

  client.connect().then(() => {
    console.log("[Email] Redis subscriber connected");

    client.subscribe("auth.otp.register", async (msg) => {
      try {
        const { email, code, name } = JSON.parse(msg);
        const html = TemplateEngine.otpRegister({ name, code });
        await Sender.send({ to: email, subject: "Kode OTP Registrasi - Lintas Wahana", html });
      } catch (err) { console.error("[Email] otp.register error:", err.message); }
    });

    client.subscribe("auth.otp.reset", async (msg) => {
      try {
        const { email, code, name } = JSON.parse(msg);
        const html = TemplateEngine.otpReset({ name, code });
        await Sender.send({ to: email, subject: "Kode OTP Reset Password - Lintas Wahana", html });
      } catch (err) { console.error("[Email] otp.reset error:", err.message); }
    });

    client.subscribe("auth.user.created", async (msg) => {
      try {
        const { email, name, password, role } = JSON.parse(msg);
        if (password) {
          const html = TemplateEngine.memberCredentials({ name, email, password, role: ROLE_LABELS[role] || role });
          await Sender.send({ to: email, subject: "Kredensial Akun - Lintas Wahana", html });
        }
      } catch (err) { console.error("[Email] user.created error:", err.message); }
    });

    client.subscribe("project.created", async (msg) => {
      try {
        const { projectId, name, userId, position } = JSON.parse(msg);
        const user = await resolveUser(userId);
        const userEmail = user?.email || user?.data?.email;
        const userName = user?.name || user?.data?.name || "User";
        if (userEmail) {
          const html = TemplateEngine.projectCreated({ name, position, userName });
          await Sender.send({ to: userEmail, subject: `Project "${name}" Berhasil Dibuat - Lintas Wahana`, html });
        }
      } catch (err) { console.error("[Email] project.created error:", err.message); }
    });

    client.subscribe("revision.created", async (msg) => {
      try {
        const { revisionId, projectName, senderRole, targetRole, sentById } = JSON.parse(msg);
        const sender = await resolveUser(sentById);
        const senderName = sender?.name || sender?.data?.name || "User";

        if (targetRole && targetRole !== "all") {
          const targets = await resolveUsersByRole(targetRole);
          for (const target of targets) {
            const targetEmail = target.email || target.data?.email;
            if (targetEmail) {
              const html = TemplateEngine.revisionCreated({ projectName, senderName, senderRole, targetRole });
              await Sender.send({ to: targetEmail, subject: `Revisi Baru untuk "${projectName}" - Lintas Wahana`, html });
            }
          }
        }
      } catch (err) { console.error("[Email] revision.created error:", err.message); }
    });
  }).catch((err) => {
    console.error("[Email] Failed to connect to Redis:", err.message);
  });
}
