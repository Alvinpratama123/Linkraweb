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

export const CacheService = {
  async get(key) {
    try {
      const c = getClient();
      const data = await c.get(key);
      return data ? JSON.parse(data) : null;
    } catch (err) {
      return null;
    }
  },

  async set(key, value, ttlSeconds = 60) {
    try {
      const c = getClient();
      await c.set(key, JSON.stringify(value), { EX: ttlSeconds });
    } catch (err) {
      console.error("[CacheService] Failed to set:", key, err.message);
    }
  },
};
