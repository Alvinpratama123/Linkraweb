import { prisma } from "../lib/prisma.js";
import { EventPublisher } from "../events/publisher.js";

export const ProjectController = {
  async list(req, res, next) {
    try {
      const { userId, position, decision, search, page = "1", limit = "10" } = req.query;
      const where = {};
      if (userId) where.userId = userId;
      if (position) where.position = position;
      if (decision) where.decision = decision;
      if (search) where.name = { contains: search };

      const pageNum = Math.max(1, parseInt(page));
      const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
      const skip = (pageNum - 1) * limitNum;

      const [projects, total] = await Promise.all([
        prisma.project.findMany({ where, skip, take: limitNum, include: { attachments: true }, orderBy: { createdAt: "desc" } }),
        prisma.project.count({ where }),
      ]);

      res.json({
        success: true,
        data: projects,
        pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) },
      });
    } catch (err) {
      next(err);
    }
  },

  async getById(req, res, next) {
    try {
      const project = await prisma.project.findUnique({
        where: { id: req.params.id },
        include: { attachments: true },
      });
      if (!project) return res.status(404).json({ success: false, message: "Project tidak ditemukan" });
      res.json({ success: true, data: project });
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const userId = req.headers["x-user-id"];
      const role = req.headers["x-user-role"] || "member";
      const { name, position, repoLink, date, progress } = req.body;

      if (!name || !position) {
        return res.status(400).json({ success: false, message: "Nama dan posisi wajib diisi" });
      }

      const project = await prisma.project.create({
        data: {
          name, position, repoLink, userId,
          date: date ? new Date(date) : new Date(),
          progress: progress || 0,
        },
      });

      await EventPublisher.projectCreated(project, userId);
      res.status(201).json({ success: true, data: project });
    } catch (err) {
      if (err.code === "P2002") {
        return res.status(409).json({ success: false, message: "Project dengan nama ini sudah ada" });
      }
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const { name, position, repoLink, date, progress, imageDescription, imageDescription2 } = req.body;
      const data = {};
      if (name !== undefined) data.name = name;
      if (position !== undefined) data.position = position;
      if (repoLink !== undefined) data.repoLink = repoLink;
      if (date !== undefined) data.date = new Date(date);
      if (progress !== undefined) data.progress = parseInt(progress);
      if (imageDescription !== undefined) data.imageDescription = imageDescription;
      if (imageDescription2 !== undefined) data.imageDescription2 = imageDescription2;

      const project = await prisma.project.update({ where: { id: req.params.id }, data });
      await EventPublisher.projectUpdated(project);
      res.json({ success: true, data: project });
    } catch (err) {
      next(err);
    }
  },

  async delete(req, res, next) {
    try {
      const project = await prisma.project.findUnique({ where: { id: req.params.id } });
      if (!project) return res.status(404).json({ success: false, message: "Project tidak ditemukan" });
      await prisma.project.delete({ where: { id: req.params.id } });
      await EventPublisher.projectDeleted(req.params.id);
      res.json({ success: true, message: "Project berhasil dihapus" });
    } catch (err) {
      next(err);
    }
  },

  async updateDecision(req, res, next) {
    try {
      const { decision, finished } = req.body;
      if (!["pending", "approved", "rejected"].includes(decision)) {
        return res.status(400).json({ success: false, message: "Decision harus pending/approved/rejected" });
      }
      const project = await prisma.project.update({
        where: { id: req.params.id },
        data: { decision, finished: finished !== undefined ? finished : decision === "approved" },
      });
      await EventPublisher.projectDecision(project, decision);
      res.json({ success: true, data: project });
    } catch (err) {
      next(err);
    }
  },

  async upload(req, res, next) {
    try {
      const userId = req.headers["x-user-id"];
      const { name, position, repoLink, date, progress, imageDescription, imageDescription2 } = req.body;
      const files = req.files || {};

      if (!name || !position) {
        return res.status(400).json({ success: false, message: "Nama dan posisi wajib diisi" });
      }

      const project = await prisma.project.create({
        data: {
          name, position, repoLink, userId,
          date: date ? new Date(date) : new Date(),
          progress: progress || 0,
          imageDescription, imageDescription2,
          imageUrl: files.imageUrl?.[0]?.filepath || null,
          moduleUrl: files.moduleUrl?.[0]?.filepath || null,
        },
      });

      if (files.attachments) {
        await prisma.attachment.createMany({
          data: files.attachments.map(f => ({
            projectId: project.id,
            type: f.mimetype?.startsWith("image/") ? "image" : "module",
            name: f.originalFilename,
            url: f.filepath,
          })),
        });
      }

      await EventPublisher.projectCreated(project, userId);
      res.status(201).json({ success: true, data: project });
    } catch (err) {
      next(err);
    }
  },
};
