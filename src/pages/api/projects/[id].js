import { prisma } from "@/lib/prisma";

export default async function handler(req, res) {
  const { id } = req.query;
  const projectId = parseInt(id);

  if (isNaN(projectId)) {
    return res.status(400).json({ message: "ID tidak valid" });
  }

  // UPDATE decision, finished, attachment status
  if (req.method === "PATCH") {
    try {
      const { decision, finished, attachments } = req.body;

      const updateData = {};
      if (decision !== undefined) updateData.decision = decision;
      if (finished !== undefined) updateData.finished = finished;

      const project = await prisma.project.update({
        where: { id: projectId },
        data: updateData,
        include: { attachments: true },
      });

      // Update status tiap attachment jika ada
      if (attachments && Array.isArray(attachments)) {
        for (const att of attachments) {
          if (att.id && att.status !== undefined) {
            await prisma.attachment.update({
              where: { id: att.id },
              data: { status: att.status },
            });
          }
        }
      }

      const updatedProject = await prisma.project.findUnique({
        where: { id: projectId },
        include: { attachments: true },
      });

      return res.status(200).json({ success: true, project: updatedProject });
    } catch (error) {
      console.error("Update project error:", error);
      return res.status(500).json({ message: "Server Error", detail: error.message });
    }
  }

  // DELETE project
  if (req.method === "DELETE") {
    try {
      await prisma.project.delete({ where: { id: projectId } });
      return res.status(200).json({ success: true, message: "Project dihapus" });
    } catch (error) {
      console.error("Delete project error:", error);
      return res.status(500).json({ message: "Server Error", detail: error.message });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}