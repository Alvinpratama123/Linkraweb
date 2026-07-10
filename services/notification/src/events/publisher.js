import { createClient } from "redis";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";
let client = null;

function getClient() {
  if (!client) {
    client = createClient({ url: REDIS_URL });
    client.on("error", (err) => console.error("[Redis]", err.message));
    client.connect().catch(() => {});
  }
  return client;
}

export const EventPublisher = {
  async publish(channel, message) {
    try {
      const c = getClient();
      await c.publish(channel, JSON.stringify(message));
    } catch (err) {
      console.error("[EventPublisher] Failed to publish:", channel, err.message);
    }
  },

  async notificationSent(notification) {
    await this.publish("notification.created", notification);
  },
};
