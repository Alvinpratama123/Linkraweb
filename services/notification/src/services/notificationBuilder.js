import { NotificationService } from "./notificationService.js";

const typeLabels = {
  project:   "Project",
  member:    "Member",
  revision:  "Revisi",
  system:    "Sistem",
  approved:  "Disetujui",
  rejected:  "Ditolak",
  finished:  "Selesai",
  upload:    "Upload",
};

const roleLabels = {
  admin:    "Admin",
  frontend: "Frontend Developer",
  backend:  "Backend Developer",
  uiux:     "UI/UX Designer",
  qa:       "QA (Quality Assurance)",
  pm:       "Project Manager",
};

export const NotificationBuilder = {
  buildDashboardLink(userRole, type, id) {
    return `/dashboard${userRole === "admin" ? "Admin/admin" : "Member/MemberDashboard"}`;
  },

  async buildProjectUpload(project, userId) {
    const cfg = NotificationService.getConfig("project", "upload");
    return {
      userId, type: "upload",
      title: cfg.title,
      message: `Project "${project.name}" telah diupload.`,
      icon: cfg.icon, color: cfg.color,
      link: this.buildDashboardLink("admin", "project"),
    };
  },

  async buildProjectDecision(project, userId, decision) {
    const cfg = NotificationService.getConfig("project", decision);
    return {
      userId, type: "project",
      title: cfg.title,
      message: `Project "${project.name}" telah ${decision === "approved" ? "disetujui" : "ditolak"}.`,
      icon: cfg.icon, color: cfg.color,
      link: this.buildDashboardLink("admin", "project"),
    };
  },

  async buildRevisionCreated(revision, targetUserId) {
    const cfg = NotificationService.getConfig("revision", "created");
    return {
      userId: targetUserId, type: "revision",
      title: cfg.title,
      message: `Revisi untuk project "${revision.projectName}" dari ${roleLabels[revision.senderRole] || revision.senderRole}.`,
      icon: cfg.icon, color: cfg.color,
      link: this.buildDashboardLink("admin", "revision"),
    };
  },

  async buildRevisionComment(reportId, authorId) {
    const cfg = NotificationService.getConfig("revision", "commented");
    return {
      userId: authorId, type: "revision",
      title: cfg.title,
      message: "Ada komentar baru pada revisi.",
      icon: cfg.icon, color: cfg.color,
      link: this.buildDashboardLink("admin", "revision"),
    };
  },

  async buildMemberCreated(userId) {
    const cfg = NotificationService.getConfig("member", "created");
    return {
      userId, type: "member",
      title: cfg.title,
      message: "Member baru telah ditambahkan.",
      icon: cfg.icon, color: cfg.color,
      link: this.buildDashboardLink("admin", "member"),
    };
  },
};
