import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  const { id } = req.query;
  const attachmentId = parseInt(id);

  if (isNaN(attachmentId)) {
    return res.status(400).json({ message: "ID tidak valid" });
  }

  if (req.method === "DELETE") {
    try {
      const attachment = await prisma.attachment.findUnique({
        where: { id: attachmentId },
      });

      if (!attachment) {
        return res.status(404).json({ message: "Attachment tidak ditemukan" });
      }

      // Hapus file dari disk
      const filePath = path.join(process.cwd(), "public", attachment.url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      await prisma.attachment.delete({ where: { id: attachmentId } });
      return res.status(200).json({ success: true, message: "Attachment dihapus" });
    } catch (error) {
      console.error("Delete attachment error:", error);
      return res.status(500).json({ message: "Server Error", detail: error.message });
    }
  }

  if (req.method === "PATCH") {
    try {
      const { status } = req.body;
      const attachment = await prisma.attachment.update({
        where: { id: attachmentId },
        data: { status },
      });
      return res.status(200).json({ success: true, attachment });
    } catch (error) {
      console.error("Update attachment error:", error);
      return res.status(500).json({ message: "Server Error", detail: error.message });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}