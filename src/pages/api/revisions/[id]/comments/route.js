// pages/api/revisions/[id]/comments/route.js
import { prisma } from "@/lib/prisma";

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    // GET /api/revisions/[id]/comments
    if (req.method === "GET") {
      const comments = await prisma.revisionComment.findMany({
        where: { reportId: id },
        orderBy: { createdAt: "asc" },
        include: { author: { select: { id: true, name: true, role: true } } },
      });
      return res.status(200).json({ data: comments });
    }

    // POST /api/revisions/[id]/comments
    if (req.method === "POST") {
      const { content, authorId } = req.body;

      if (!content?.trim())
        return res.status(400).json({ error: "Komentar tidak boleh kosong" });
      if (!authorId)
        return res.status(400).json({ error: "Author wajib diisi" });

      const report = await prisma.revisionReport.findUnique({ where: { id } });
      if (!report)
        return res.status(404).json({ error: "Laporan tidak ditemukan" });

      const comment = await prisma.revisionComment.create({
        data: { content: content.trim(), authorId, reportId: id },
        include: { author: { select: { id: true, name: true, role: true } } },
      });

      return res.status(201).json({ data: comment });
    }

    return res.status(405).json({ error: "Method tidak diizinkan" });
  } catch (error) {
    console.error(`[${req.method} comments]`, error);
    return res.status(500).json({ error: "Gagal memproses komentar" });
  }
}
