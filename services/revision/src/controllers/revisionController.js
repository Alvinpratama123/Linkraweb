import { prisma } from "../lib/prisma.js";
import { EventPublisher } from "../events/publisher.js";
import { SENDER_TARGET_MAP, PROGRESS_OPTIONS, APPROVAL_OPTIONS } from "../config/revisionConfig.js";

export const RevisionController = {
  async list(req, res, next) {
    try {
      const { targetRole, senderRole, approval, search, page = "1", limit = "10" } = req.query;
      const where = {};
      if (targetRole) where.targetRole = targetRole;
      if (senderRole) where.senderRole = senderRole;
      if (approval) where.approval = approval;
      if (search) where.projectName = { contains: search };

      const pageNum = Math.max(1, parseInt(page));
      const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
      const skip = (pageNum - 1) * limitNum;

      const [revisions, total] = await Promise.all([
        prisma.revisionReport.findMany({
          where, skip, take: limitNum,
          include: { comments: { orderBy: { createdAt: "asc" } } },
          orderBy: { createdAt: "desc" },
        }),
        prisma.revisionReport.count({ where }),
      ]);

      res.json({
        success: true,
        data: revisions,
        pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) },
      });
    } catch (err) {
      next(err);
    }
  },

  async getById(req, res, next) {
    try {
      const revision = await prisma.revisionReport.findUnique({
        where: { id: req.params.id },
        include: { comments: { orderBy: { createdAt: "asc" } } },
      });
      if (!revision) return res.status(404).json({ success: false, message: "Revision tidak ditemukan" });
      res.json({ success: true, data: revision });
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const userId = req.headers["x-user-id"];
      const role = req.headers["x-user-role"];
      const { projectName, issueType, description, targetRole, attachmentName, attachmentUrl, attachmentData } = req.body;

      if (!projectName || !targetRole) {
        return res.status(400).json({ success: false, message: "Project name dan target role wajib diisi" });
      }

      const allowedTargets = SENDER_TARGET_MAP[role] || [];
      if (!allowedTargets.includes(targetRole)) {
        return res.status(403).json({ success: false, message: `Role ${role} tidak bisa mengirim revisi ke ${targetRole}` });
      }

      const revision = await prisma.revisionReport.create({
        data: {
          projectName, issueType: issueType || "MODUL", description,
          senderRole: role, targetRole,
          sentById: userId,
          attachmentName, attachmentUrl, attachmentData,
        },
      });

      await EventPublisher.revisionCreated(revision);
      res.status(201).json({ success: true, data: revision });
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const { progress, approval, approvalNote, attachmentName, attachmentUrl, attachmentData } = req.body;
      const data = {};

      if (progress !== undefined) {
        if (!PROGRESS_OPTIONS.includes(progress)) {
          return res.status(400).json({ success: false, message: `Progress harus salah satu dari: ${PROGRESS_OPTIONS.join(", ")}` });
        }
        data.progress = progress;
      }
      if (approval !== undefined) {
        if (!APPROVAL_OPTIONS.includes(approval)) {
          return res.status(400).json({ success: false, message: `Approval harus salah satu dari: ${APPROVAL_OPTIONS.join(", ")}` });
        }
        data.approval = approval;
      }
      if (approvalNote !== undefined) data.approvalNote = approvalNote;
      if (attachmentName !== undefined) data.attachmentName = attachmentName;
      if (attachmentUrl !== undefined) data.attachmentUrl = attachmentUrl;
      if (attachmentData !== undefined) data.attachmentData = attachmentData;

      const revision = await prisma.revisionReport.update({ where: { id: req.params.id }, data });
      await EventPublisher.revisionUpdated(revision);
      res.json({ success: true, data: revision });
    } catch (err) {
      next(err);
    }
  },

  async listComments(req, res, next) {
    try {
      const comments = await prisma.revisionComment.findMany({
        where: { reportId: req.params.id },
        orderBy: { createdAt: "asc" },
      });
      res.json({ success: true, data: comments });
    } catch (err) {
      next(err);
    }
  },

  async addComment(req, res, next) {
    try {
      const userId = req.headers["x-user-id"];
      const { content } = req.body;
      if (!content) return res.status(400).json({ success: false, message: "Komentar wajib diisi" });

      const comment = await prisma.revisionComment.create({
        data: { content, authorId: userId, reportId: req.params.id },
      });

      await EventPublisher.revisionCommentAdded(req.params.id, comment);
      res.status(201).json({ success: true, data: comment });
    } catch (err) {
      next(err);
    }
  },

  async deleteComment(req, res, next) {
    try {
      await prisma.revisionComment.delete({ where: { id: req.params.commentId } });
      res.json({ success: true, message: "Komentar berhasil dihapus" });
    } catch (err) {
      next(err);
    }
  },
};
