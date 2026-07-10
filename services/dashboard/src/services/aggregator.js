const SERVICE_URLS = {
  auth: process.env.AUTH_SERVICE_URL || "http://localhost:3001",
  project: process.env.PROJECT_SERVICE_URL || "http://localhost:3002",
  revision: process.env.REVISION_SERVICE_URL || "http://localhost:3003",
  notification: process.env.NOTIFICATION_SERVICE_URL || "http://localhost:3004",
};

async function fetch(svc, path) {
  try {
    const resp = await fetch(`${SERVICE_URLS[svc]}${path}`);
    const json = await resp.json();
    return json.data || json;
  } catch (err) {
    console.error(`[Aggregator] Failed to fetch ${svc}${path}:`, err.message);
    return null;
  }
}

export const Aggregator = {
  async getSummary() {
    const [projects, members, notifCount] = await Promise.all([
      fetch("project", "/projects?limit=1"),
      fetch("auth", "/users"),
      fetch("notification", "/notifications/count"),
    ]);

    return {
      totalProjects: projects?.pagination?.total || 0,
      totalMembers: Array.isArray(members) ? members.length : 0,
      unreadNotifications: notifCount?.count || 0,
      lastUpdated: new Date().toISOString(),
    };
  },

  async getStatistics() {
    const allProjects = await this.getAllProjects();
    if (!allProjects) return {};

    return {
      total: allProjects.length,
      approved: allProjects.filter(p => p.decision === "approved").length,
      rejected: allProjects.filter(p => p.decision === "rejected").length,
      pending: allProjects.filter(p => p.decision === "pending").length,
      finished: allProjects.filter(p => p.finished).length,
      byPosition: allProjects.reduce((acc, p) => {
        acc[p.position] = (acc[p.position] || 0) + 1;
        return acc;
      }, {}),
    };
  },

  async getAllProjects() {
    return fetch("project", "/projects?limit=1000") || [];
  },

  async getRecentProjects() {
    return fetch("project", "/projects?limit=10") || [];
  },

  async getRecentRevisions() {
    return fetch("revision", "/revisions?limit=10") || [];
  },

  async getActivity() {
    const [projects, revisions] = await Promise.all([
      this.getRecentProjects(),
      this.getRecentRevisions(),
    ]);

    const activities = [];

    if (Array.isArray(projects)) {
      projects.forEach(p => {
        activities.push({ type: "project", action: "created", text: `Project "${p.name}" dibuat`, date: p.createdAt });
      });
    }

    if (Array.isArray(revisions)) {
      revisions.forEach(r => {
        activities.push({ type: "revision", action: "created", text: `Revisi untuk "${r.projectName}"`, date: r.createdAt });
      });
    }

    activities.sort((a, b) => new Date(b.date) - new Date(a.date));
    return activities.slice(0, 20);
  },

  async getMembers() {
    return fetch("auth", "/users") || [];
  },
};
