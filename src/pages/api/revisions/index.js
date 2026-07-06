// pages/api/revisions/index.js
import { prisma } from "@/lib/prisma";
import { sendNotificationToRole } from "@/lib/email";
import { createNotification } from "@/lib/notification";

export default async function handler(req, res) {
  console.log(`📌 /api/revisions ${req.method} called`);

  try {
    // ============ GET ============
    if (req.method === 'GET') {
      const { targetRole, senderRole, search, approval, page = 1, limit = 10 } = req.query;
      
      const where = {};
      if (targetRole) where.targetRole = targetRole.toUpperCase();
      if (senderRole) where.senderRole = senderRole.toUpperCase();
      if (approval) where.approval = approval.toUpperCase();
      if (search) {
        where.OR = [
          { projectName: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ];
      }
      
      const [reports, total] = await Promise.all([
        prisma.revisionReport.findMany({
          where,
          orderBy: { createdAt: "desc" },
          skip: (parseInt(page) - 1) * parseInt(limit),
          take: parseInt(limit),
          include: {
            sentBy: { 
              select: { 
                id: true, 
                name: true, 
                role: true,
                email: true,
                position: true,
              } 
            },
            targetUser: {
              select: { 
                id: true, 
                name: true, 
                role: true,
                email: true,
                position: true,
              } 
            },
            _count: { select: { comments: true } },
          },
        }),
        prisma.revisionReport.count({ where }),
      ]);

      return res.status(200).json({
        data: reports,
        meta: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit)),
        },
      });
    }

    // ============ POST ============
    if (req.method === 'POST') {
      const {
        projectName,
        issueType,
        description,
        progress,
        senderRole,
        targetRole,
        targetUserId,
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

      // Validasi target user
      let targetUserData = null;
      if (targetUserId) {
        targetUserData = await prisma.user.findUnique({
          where: { id: targetUserId },
          select: { id: true, name: true, email: true, role: true }
        });
        
        if (!targetUserData) {
          return res.status(400).json({ 
            error: "Target user tidak ditemukan" 
          });
        }
        
        if (targetUserData.role.toLowerCase() !== targetRole.toLowerCase()) {
          return res.status(400).json({ 
            error: `User ${targetUserData.name} memiliki role ${targetUserData.role}, bukan ${targetRole}` 
          });
        }
      }

      const report = await prisma.revisionReport.create({
        data: {
          projectName: projectName.trim(),
          issueType: issueType ?? "MODUL",
          description: description?.trim() || null,
          progress: progress ?? "BELUM_DILAKUKAN",
          approval: "PENDING",
          senderRole: senderRole.toUpperCase(),
          targetRole: targetRole.toUpperCase(),
          targetUserId: targetUserId || null,
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
          targetUser: {
            select: { 
              id: true, 
              name: true, 
              role: true, 
              email: true 
            } 
          },
        },
      });

      // Kirim notifikasi ke target user
      if (targetUserData) {
        try {
          await createNotification({
            userId: targetUserData.id,
            title: `📝 Revisi Baru: ${projectName}`,
            message: `Anda menerima revisi dari ${senderRole} untuk project "${projectName}".`,
            type: "revision",
            link: "/dashboardAdmin/admin?tab=revision",
            icon: "📝",
            color: "blue",
          });
        } catch (notifError) {
          console.error("Notifikasi error:", notifError);
        }
      }

      // Kirim email
      let emailResult = null;
      try {
        emailResult = await sendNotificationToRole(report, targetRole, prisma);
      } catch (emailError) {
        console.error('Email error:', emailError);
      }

      return res.status(201).json({ 
        data: report,
        message: "Revisi berhasil dibuat",
        email: emailResult || { success: false }
      });
    }

    // ============ PATCH ============
    if (req.method === 'PATCH') {
      const { id } = req.query;
      const body = req.body;

      if (!id) {
        return res.status(400).json({ error: "ID revisi wajib diisi" });
      }

      const existingReport = await prisma.revisionReport.findUnique({
        where: { id: id },
      });

      if (!existingReport) {
        return res.status(404).json({ error: "Revisi tidak ditemukan" });
      }

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

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ 
          error: "Tidak ada field yang valid untuk diupdate" 
        });
      }

      const updatedReport = await prisma.revisionReport.update({
        where: { id: id },
        data: updateData,
        include: {
          sentBy: { 
            select: { 
              id: true, 
              name: true, 
              role: true,
              email: true,
              position: true,
            } 
          },
          targetUser: {
            select: { 
              id: true, 
              name: true, 
              role: true,
              email: true,
              position: true,
            } 
          },
        },
      });

      return res.status(200).json({
        success: true,
        data: updatedReport,
        message: "Revisi berhasil diupdate"
      });
    }

    // ============ DELETE ============
    if (req.method === 'DELETE') {
      const { id } = req.query;

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

    return res.status(405).json({ 
      error: `Method ${req.method} tidak diizinkan` 
    });

  } catch (error) {
    console.error(`[${req.method} /api/revisions] ERROR:`, error);
    return res.status(500).json({ 
      error: "Terjadi kesalahan pada server",
      details: error.message
    });
  }
}