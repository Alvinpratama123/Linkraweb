// pages/api/revisions/[id]/route.js
import { prisma } from "@/lib/prisma";

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    // GET /api/revisions/[id]
    if (req.method === "GET") {
      const report = await prisma.revisionReport.findUnique({
        where: { id },
        include: {
          sentBy: { select: { id: true, name: true, role: true } },
          comments: {
            orderBy: { createdAt: "asc" },
            include: { author: { select: { id: true, name: true, role: true } } },
          },
        },
      });
      if (!report)
        return res.status(404).json({ error: "Laporan tidak ditemukan" });
      return res.status(200).json({ data: report });
    }

    // PATCH /api/revisions/[id]
    if (req.method === "PATCH") {
      const { progress, approval, approvalNote, attachmentName, attachmentUrl, attachmentData } = req.body;

      const existing = await prisma.revisionReport.findUnique({ where: { id } });
      if (!existing)
        return res.status(404).json({ error: "Laporan tidak ditemukan" });

      const updated = await prisma.revisionReport.update({
        where: { id },
        data: {
          ...(progress !== undefined && { progress }),
          ...(approval !== undefined && { approval }),
          ...(approvalNote !== undefined && { approvalNote }),
          ...(attachmentName !== undefined && { attachmentName }),
          ...(attachmentUrl !== undefined && { attachmentUrl }),
          ...(attachmentData !== undefined &&
              process.env.NODE_ENV !== "production" && { attachmentData }),
        },
        include: { sentBy: { select: { id: true, name: true, role: true } } },
      });

      return res.status(200).json({ data: updated });
    }

    // DELETE /api/revisions/[id]
    if (req.method === "DELETE") {
      const existing = await prisma.revisionReport.findUnique({ where: { id } });
      if (!existing)
        return res.status(404).json({ error: "Laporan tidak ditemukan" });

      await prisma.revisionReport.delete({ where: { id } });
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: "Method tidak diizinkan" });
  } catch (error) {
    console.error(`[${req.method} /api/revisions/:id]`, error);
    return res.status(500).json({ error: "Gagal memproses permintaan" });
  }
}
