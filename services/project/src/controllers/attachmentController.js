import { prisma } from "../lib/prisma.js";

export const AttachmentController = {
  async getById(req, res, next) {
    try {
      const id = parseInt(req.params.id);
      const attachment = await prisma.attachment.findUnique({ where: { id } });
      if (!attachment) return res.status(404).json({ success: false, message: "Attachment tidak ditemukan" });
      res.json({ success: true, data: attachment });
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const id = parseInt(req.params.id);
      const { status, description, isAdditionalDescription } = req.body;
      const data = {};
      if (status !== undefined) data.status = status;
      if (description !== undefined) data.description = description;
      if (isAdditionalDescription !== undefined) data.isAdditionalDescription = isAdditionalDescription;

      const attachment = await prisma.attachment.update({ where: { id }, data });
      res.json({ success: true, data: attachment });
    } catch (err) {
      next(err);
    }
  },

  async delete(req, res, next) {
    try {
      const id = parseInt(req.params.id);
      await prisma.attachment.delete({ where: { id } });
      res.json({ success: true, message: "Attachment berhasil dihapus" });
    } catch (err) {
      next(err);
    }
  },
};
