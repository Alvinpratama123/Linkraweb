import { createClient } from "redis";
import { NotificationService } from "../services/notificationService.js";
import { NotificationBuilder } from "../services/notificationBuilder.js";
import { EventPublisher } from "./publisher.js";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

export function startEventSubscriber() {
  const client = createClient({ url: REDIS_URL });
  client.on("error", (err) => console.error("[Notif-Sub] Redis error:", err.message));

  client.connect().then(() => {
    console.log("[Notification] Redis subscriber connected");

    client.subscribe("project.created", async (msg) => {
      try {
        const data = JSON.parse(msg);
        const notif = await NotificationBuilder.buildProjectUpload(data, data.userId);
        await NotificationService.create(notif);
        await EventPublisher.notificationSent(notif);
      } catch (err) { console.error("[Notif] project.created handler error:", err.message); }
    });

    client.subscribe("project.decision.approved", async (msg) => {
      try {
        const data = JSON.parse(msg);
        const notif = await NotificationBuilder.buildProjectDecision(data, data.userId, "approved");
        await NotificationService.create(notif);
        await EventPublisher.notificationSent(notif);
      } catch (err) { console.error("[Notif] project.decision handler error:", err.message); }
    });

    client.subscribe("project.decision.rejected", async (msg) => {
      try {
        const data = JSON.parse(msg);
        const notif = await NotificationBuilder.buildProjectDecision(data, data.userId, "rejected");
        await NotificationService.create(notif);
        await EventPublisher.notificationSent(notif);
      } catch (err) { console.error("[Notif] project.decision handler error:", err.message); }
    });

    client.subscribe("revision.created", async (msg) => {
      try {
        const data = JSON.parse(msg);
        const notif = await NotificationBuilder.buildRevisionCreated(data, data.sentById);
        await NotificationService.create(notif);
        await EventPublisher.notificationSent(notif);
      } catch (err) { console.error("[Notif] revision.created handler error:", err.message); }
    });

    client.subscribe("revision.comment.added", async (msg) => {
      try {
        const data = JSON.parse(msg);
        const notif = await NotificationBuilder.buildRevisionComment(data.reportId, data.authorId);
        await NotificationService.create(notif);
        await EventPublisher.notificationSent(notif);
      } catch (err) { console.error("[Notif] revision.comment handler error:", err.message); }
    });

    client.subscribe("auth.user.created", async (msg) => {
      try {
        const data = JSON.parse(msg);
        const notif = await NotificationBuilder.buildMemberCreated(data.id);
        await NotificationService.create(notif);
        await EventPublisher.notificationSent(notif);
      } catch (err) { console.error("[Notif] auth.user.created handler error:", err.message); }
    });
  }).catch((err) => {
    console.error("[Notification] Failed to connect to Redis:", err.message);
  });
}
