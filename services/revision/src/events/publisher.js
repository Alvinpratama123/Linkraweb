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

  async revisionCreated(revision) {
    await this.publish("revision.created", {
      revisionId: revision.id,
      projectName: revision.projectName,
      senderRole: revision.senderRole,
      targetRole: revision.targetRole,
      sentById: revision.sentById,
    });
  },

  async revisionUpdated(revision) {
    await this.publish("revision.updated", {
      revisionId: revision.id,
      progress: revision.progress,
      approval: revision.approval,
    });
  },

  async revisionCommentAdded(reportId, comment) {
    await this.publish("revision.comment.added", {
      reportId,
      commentId: comment.id,
      authorId: comment.authorId,
    });
  },
};
