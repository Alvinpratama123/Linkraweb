import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  const { id } = req.query;
  const attachmentId = parseInt(id);
  
  if (isNaN(attachmentId)) {
    return res.status(400).json({ success: false, message: "Invalid attachment ID" });
  }
  
  if (req.method === "DELETE") {
    try {
      // Ambil attachment untuk mendapatkan URL file
      const attachment = await prisma.attachment.findUnique({
        where: { id: attachmentId },
      });
      
      if (!attachment) {
        return res.status(404).json({ success: false, message: "Attachment not found" });
      }
      
      
      const filePath = path.join(process.cwd(), "public", attachment.url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      
      // Hapus dari database
      await prisma.attachment.delete({
        where: { id: attachmentId },
      });
      
      return res.status(200).json({
        success: true,
        message: "Attachment deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
  
  if (req.method === "PATCH") {
    try {
      const { status } = req.body;
      
      const attachment = await prisma.attachment.update({
        where: { id: attachmentId },
        data: { status: status },
      });
      
      return res.status(200).json({
        success: true,
        attachment: attachment,
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
  
  return res.status(405).json({ message: "Method not allowed" });
}