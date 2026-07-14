// =====================================================================
// File       : pages/api/projects/attachments/[id].js
// Fungsi     : Manajemen detail attachment (GET, PATCH, DELETE)
// Alur Umum  :
//   1. Ambil ID attachment dari URL, validasi sebagai integer
//   2. Verifikasi JWT dari cookie auth_token
//   3. Cek status admin atau canApprove dari auth_db
//   4. Cari attachment di project_db beserta data project-nya
//   5. Cek akses: Admin ATAU canApprove ATAU pemilik project
//   6. DELETE → hapus file fisik dari disk, baru hapus record dari DB
//   7. PATCH  → ubah status attachment (pending / approved / rejected)
//   8. GET    → kembalikan detail attachment
//
// Catatan    :
//   - Status attachment berpengaruh pada approval workflow project
//   - Hanya user dengan canApprove yang bisa approve/reject attachment
//   - File dihapus dari disk (public/uploads) saat attachment dihapus
// =====================================================================

import { prismaProject as prisma } from "@/lib/prismaProject";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  // ─── 1. AMBIL ID DARI QUERY ──────────────────────────────
  const { id } = req.query;
  const attachmentId = parseInt(id);
  
  // ─── 2. VALIDASI ID ────────────────────────────────────────
  if (isNaN(attachmentId)) {
    return res.status(400).json({ 
      success: false, 
      message: "ID attachment tidak valid" 
    });
  }

  // ─── 3. VERIFIKASI TOKEN ──────────────────────────────────
  const token = req.cookies.auth_token;
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "❌ Token tidak ditemukan. Silakan login terlebih dahulu.",
    });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "❌ Token tidak valid atau sudah expired.",
    });
  }

  const userId = decoded.userId;
  const userRole = decoded.role || "USER";
  const isTokenAdmin = userRole.toLowerCase() === "admin";

  // ─── 3b. CEK canApprove dari DB ─────────────────────────────
  let isDbAdmin = isTokenAdmin;
  let canApprove = false;
  if (!isTokenAdmin) {
    try {
      const { prismaAuth } = await import("@/lib/prismaAuth");
      const dbUser = await prismaAuth.user.findUnique({
        where: { id: userId },
        select: { role: true, canApprove: true },
      });
      if (dbUser) {
        isDbAdmin = dbUser.role?.toLowerCase() === "admin";
        canApprove = dbUser.canApprove === true;
      }
    } catch (e) {
      console.error("❌ Gagal cek user dari DB:", e.message);
    }
  }
  const isAdmin = isTokenAdmin || isDbAdmin;

  // ─── 4. CEK ATTACHMENT ─────────────────────────────────────
  let attachment;
  try {
    attachment = await prisma.attachment.findUnique({
      where: { id: attachmentId },
      include: {
        project: {
          select: {
            userId: true,
            name: true,
          },
        },
      },
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: "Gagal mengambil data attachment" 
    });
  }

  if (!attachment) {
    return res.status(404).json({ 
      success: false, 
      message: "Attachment tidak ditemukan" 
    });
  }

  // ─── 5. CEK AKSES (Pemilik project, admin, atau user dengan canApprove) ──
  if (!isAdmin && !canApprove && attachment.project.userId !== userId) {
    return res.status(403).json({
      success: false,
      message: "❌ Anda tidak memiliki akses ke attachment ini.",
    });
  }

  // ─── 6. DELETE ─────────────────────────────────────────────
  if (req.method === "DELETE") {
    try {
      // Hapus file dari disk
      if (attachment.url) {
        const filePath = path.join(process.cwd(), "public", attachment.url);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log(`🗑️ File dihapus: ${filePath}`);
        }
      }
      
      // Hapus dari database
      await prisma.attachment.delete({
        where: { id: attachmentId },
      });
      
      console.log(`✅ Attachment ${attachmentId} dihapus oleh user ${userId}`);
      
      return res.status(200).json({
        success: true,
        message: "Attachment berhasil dihapus",
      });
    } catch (error) {
      console.error("❌ Delete attachment error:", error);
      return res.status(500).json({ 
        success: false, 
        message: "Gagal menghapus attachment: " + error.message 
      });
    }
  }

  // ─── 7. PATCH (Update Status) ──────────────────────────────
  if (req.method === "PATCH") {
    try {
      const { status } = req.body;
      
      // Validasi status
      const validStatus = ["pending", "approved", "rejected"];
      if (!validStatus.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Status tidak valid. Gunakan: pending, approved, atau rejected",
        });
      }
      
      const updatedAttachment = await prisma.attachment.update({
        where: { id: attachmentId },
        data: { status: status },
      });
      
      console.log(`✅ Attachment ${attachmentId} status diubah menjadi ${status}`);
      
      return res.status(200).json({
        success: true,
        message: `Status attachment berhasil diubah menjadi ${status}`,
        attachment: updatedAttachment,
      });
    } catch (error) {
      console.error("❌ Update attachment status error:", error);
      return res.status(500).json({ 
        success: false, 
        message: "Gagal update status attachment: " + error.message 
      });
    }
  }

  // ─── 8. GET (Ambil detail attachment) ──────────────────────
  if (req.method === "GET") {
    try {
      return res.status(200).json({
        success: true,
        attachment: {
          id: attachment.id,
          type: attachment.type,
          name: attachment.name,
          url: attachment.url,
          status: attachment.status,
          description: attachment.description,
          isAdditionalDescription: attachment.isAdditionalDescription,
          createdAt: attachment.createdAt,
          project: {
            id: attachment.projectId,
            name: attachment.project.name,
          },
        },
      });
    } catch (error) {
      console.error("❌ Get attachment error:", error);
      return res.status(500).json({ 
        success: false, 
        message: "Gagal mengambil data attachment" 
      });
    }
  }

  // ─── 9. METHOD NOT ALLOWED ─────────────────────────────────
  return res.status(405).json({ 
    success: false,
    message: "Method not allowed" 
  });
}