// pages/api/revisions/index.js
import { prisma } from "@/lib/prisma";
import { sendNotificationToRole } from "@/lib/email";

export default async function handler(req, res) {
  console.log(`📌 /api/revisions ${req.method} called`);
  console.log("Query:", req.query);
  console.log("Body:", req.body);

  try {
    // ============ GET /api/revisions ============
    if (req.method === 'GET') {
      const { targetRole, senderRole, search, approval, page = 1, limit = 10 } = req.query;
      
      const where = {};
      if (targetRole) where.targetRole = targetRole;
      if (senderRole) where.senderRole = senderRole;
      if (approval) where.approval = approval;
      if (search) {
        where.OR = [
          { projectName: { contains: search } },
          { description: { contains: search } },
        ];
      }
      

      const pageNum = Math.max(1, parseInt(page) || 1);
      const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 10));

      const [reports, total] = await Promise.all([
        prisma.revisionReport.findMany({
          where,
          orderBy: { createdAt: "desc" },
          skip: (pageNum - 1) * limitNum,
          take: limitNum,
          include: {
            sentBy: { select: { id: true, name: true, role: true } },
            _count: { select: { comments: true } },
          },
        }),
        prisma.revisionReport.count({ where }),
      ]);

      return res.status(200).json({
        data: reports,
        meta: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      });
    }

    // ============ POST /api/revisions ============
    if (req.method === 'POST') {
      const {
        projectName,
        issueType,
        description,
        progress,
        senderRole,
        targetRole,
        sentById,
        attachmentName,
        attachmentUrl,
        attachmentData,
      } = req.body;

      if (!projectName?.trim()) {
        return res.status(400).json({ error: "Nama project wajib diisi" });
      }
      if (!senderRole || !targetRole) {
        return res.status(400).json({ error: "Role pengirim dan tujuan wajib diisi" });
      }
      if (senderRole === targetRole) {
        return res.status(400).json({ error: "Tidak bisa mengirim ke role yang sama" });
      }

      const report = await prisma.revisionReport.create({
        data: {
          projectName: projectName.trim(),
          issueType: issueType ?? "MODUL",
          description: description?.trim() || null,
          progress: progress ?? "BELUM_DILAKUKAN",
          approval: "PENDING",
          senderRole,
          targetRole,
          sentById: sentById ?? null,
          attachmentName: attachmentName ?? null,
          attachmentUrl: attachmentUrl ?? null,
          attachmentData: process.env.NODE_ENV !== "production" 
            ? (attachmentData ?? null) 
            : null,
        },
        include: {
          sentBy: { 
            select: { 
              id: true, 
              name: true, 
              role: true, 
              email: true 
            } 
          },
        },
      });

      console.log(`✅ Revisi berhasil dibuat: ${report.id}`);

      // Kirim notifikasi email
      let emailResult = null;
      try {
        emailResult = await sendNotificationToRole(report, targetRole, prisma);
        console.log('📧 Hasil kirim email:', emailResult);
      } catch (emailError) {
        console.error('❌ Gagal kirim notifikasi email:', emailError);
      }

      return res.status(201).json({ 
        data: report,
        message: "Revisi berhasil dibuat",
        email: emailResult || { success: false, message: 'Email tidak terkirim' }
      });
    }

    // ============ PATCH /api/revisions ============
    // 🔥 PASTIKAN METHOD PATCH ADA DI SINI
    if (req.method === 'PATCH') {
      const { id } = req.query;
      const body = req.body;

      console.log("🔧 PATCH - ID:", id);
      console.log("🔧 PATCH - Body:", body);

      if (!id) {
        return res.status(400).json({ error: "ID revisi wajib diisi" });
      }

      // Cek apakah data ada
      const existingReport = await prisma.revisionReport.findUnique({
        where: { id: id },
      });

      if (!existingReport) {
        return res.status(404).json({ error: "Revisi tidak ditemukan" });
      }

      console.log("📦 Data sebelum update:", existingReport);

      // Hanya update field yang diizinkan
      const allowedFields = ['progress', 'approval', 'description', 'projectName', 'issueType'];
      const updateData = {};
      
      for (const key of allowedFields) {
        if (body[key] !== undefined && body[key] !== null) {
          if (key === 'progress') {
            const validProgress = ['BELUM_DILAKUKAN', 'SEDANG_DIKERJAKAN', 'SELESAI'];
            if (validProgress.includes(body[key])) {
              updateData[key] = body[key];
            }
          } else if (key === 'approval') {
            const validApproval = ['PENDING', 'APPROVED', 'REJECTED'];
            if (validApproval.includes(body[key])) {
              updateData[key] = body[key];
            }
          } else {
            updateData[key] = body[key];
          }
        }
      }

      console.log("📝 Data yang akan diupdate:", updateData);

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ 
          error: "Tidak ada field yang valid untuk diupdate" 
        });
      }

      const updatedReport = await prisma.revisionReport.update({
        where: { id: id },
        data: updateData,
        include: {
          sentBy: { select: { id: true, name: true, role: true } },
        },
      });

      console.log("✅ Data setelah update:", updatedReport);

      return res.status(200).json({
        success: true,
        data: updatedReport,
        message: "Revisi berhasil diupdate"
      });
    }

    // ============ DELETE /api/revisions ============
    if (req.method === 'DELETE') {
      const { id } = req.query;
      
      console.log("🗑️ DELETE - ID:", id);

      if (!id) {
        return res.status(400).json({ error: "ID revisi wajib diisi" });
      }

      const existingReport = await prisma.revisionReport.findUnique({
        where: { id: id },
      });

      if (!existingReport) {
        return res.status(404).json({ error: "Revisi tidak ditemukan" });
      }

      await prisma.revisionReport.delete({
        where: { id: id },
      });

      return res.status(200).json({ 
        success: true, 
        message: "Revisi berhasil dihapus" 
      });
    }

    // ============ Method tidak diizinkan ============
    return res.status(405).json({ 
      error: `Method ${req.method} tidak diizinkan` 
    });

  } catch (error) {
    console.error(`[${req.method} /api/revisions] ERROR:`, error);
    return res.status(500).json({ 
      error: "Terjadi kesalahan pada server",
      details: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined
    });
  }
}