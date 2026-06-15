import { prisma } from "@/lib/prisma";

export default async function handler(req, res) {
  const { id } = req.query;
  const projectId = parseInt(id);
  
  if (isNaN(projectId)) {
    return res.status(400).json({ success: false, message: "Invalid project ID" });
  }
  
  if (req.method === "GET") {
    try {
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: { attachments: true },
      });
      
      if (!project) {
        return res.status(404).json({ success: false, message: "Project not found" });
      }
      
      return res.status(200).json({
        success: true,
        project: project,
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
  
  if (req.method === "PATCH") {
    try {
      const { decision, finished, repoLink } = req.body;
      
      const updateData = {};
      if (decision !== undefined) updateData.decision = decision;
      if (finished !== undefined) updateData.finished = finished;
      if (repoLink !== undefined) updateData.repoLink = repoLink;
      
      const project = await prisma.project.update({
        where: { id: projectId },
        data: updateData,
        include: { attachments: true },
      });
      
      return res.status(200).json({
        success: true,
        project: project,
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
  
  if (req.method === "DELETE") {
    try {
      // Hapus attachments terlebih dahulu (cascade akan otomatis jika sudah diatur)
      await prisma.project.delete({
        where: { id: projectId },
      });
      
      return res.status(200).json({
        success: true,
        message: "Project deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
  //selesai
  return res.status(405).json({ message: "Method not allowed" });
}