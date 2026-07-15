// =====================================================================
// File       : pages/api/projects/[id].js
// Fungsi     : Detail satu project berdasarkan ID (GET, PATCH, DELETE)
// Alur Umum  :
//   1. Ambil ID dari URL parameter
//   2. Verifikasi JWT dari cookie auth_token
//   3. Cari project di project_db → enrich dengan data user dari auth_db
//   4. Cek akses: Admin ATAU pemilik project ATAU user dengan canApprove
//   5. GET    → kembalikan detail project
//   6. PATCH  → update field-field yang diizinkan (decision, finished, dll)
//   7. DELETE → hapus attachment dulu, baru hapus project (admin/pemilik saja)
//
// Catatan    :
//   - Otorisasi ketat: hanya admin, pemilik, atau user canApprove
//   - enrichProjectWithUser: mengambil data user dari auth_db
// =====================================================================

import { prismaProject as prisma } from "@/lib/prismaProject";
import { prismaAuth } from "@/lib/prismaAuth";
import jwt from "jsonwebtoken";

async function enrichProjectWithUser(project) {
  if (!project || !project.userId) return { ...project, user: null };
  const user = await prismaAuth.user.findUnique({
    where: { id: project.userId },
    select: { id: true, name: true, email: true, position: true },
  });
  return { ...project, user };
}

export default async function handler(req, res) {
  // ─── CORS HEADERS ──────────────────────────────────────────
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // ─── 1. AMBIL ID DARI QUERY ──────────────────────────────
  const { id } = req.query;
  
  if (!id) {
    return res.status(400).json({ 
      success: false, 
      message: "ID project wajib diisi" 
    });
  }

  // ─── 2. VERIFIKASI TOKEN ──────────────────────────────────
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
    console.log("🔑 Token berhasil diverifikasi untuk user:", decoded.email);
    console.log("👤 User ID:", decoded.userId);
    console.log("👤 User Role:", decoded.role);
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "❌ Token tidak valid atau sudah expired.",
    });
  }

  const userId = decoded.userId;
  const userRole = decoded.role || 'USER';

  // ─── 3. CEK PROJECT ─────────────────────────────────────────
  let project;
  try {
    project = await prisma.project.findUnique({
      where: { id: id },
      include: {
        attachments: true,
      },
    });
    project = await enrichProjectWithUser(project);
  } catch (error) {
    console.error("❌ Find project error:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal mencari project",
      detail: error.message,
    });
  }

  if (!project) {
    return res.status(404).json({
      success: false,
      message: "Project tidak ditemukan",
    });
  }

  // ─── 4. CEK AKSES ──────────────────────────────────────────
  // 🔥 ADMIN atau user dengan canApprove bisa akses semua project
  const isTokenAdmin = userRole === "ADMIN" || userRole === "admin";
  const isOwner = project.userId === userId;
  let canApprove = false;

  if (!isTokenAdmin && !isOwner) {
    try {
      const dbUser = await prismaAuth.user.findUnique({
        where: { id: userId },
        select: { role: true, canApprove: true },
      });
      if (dbUser) {
        canApprove = dbUser.canApprove === true;
      }
    } catch (e) {
      console.error("❌ Gagal cek user dari DB:", e.message);
    }
  }

  const isAdmin = isTokenAdmin;
  if (!isAdmin && !isOwner && !canApprove) {
    console.log(`❌ User ${userId} (${userRole}) tidak punya akses ke project ${id}`);
    return res.status(403).json({
      success: false,
      message: "❌ Anda tidak memiliki akses ke project ini.",
    });
  }

  console.log(`✅ User ${userId} (${userRole}) mengakses project ${id}`);

  // ─── 5. GET ─────────────────────────────────────────────────
  if (req.method === "GET") {
    try {
      return res.status(200).json({
        success: true,
        project: project,
      });
    } catch (error) {
      console.error("❌ GET project error:", error);
      return res.status(500).json({
        success: false,
        message: "Server Error",
        detail: error.message,
      });
    }
  }

  // ─── 6. PATCH ───────────────────────────────────────────────
  if (req.method === "PATCH") {
    try {
      const { decision, finished, repoLink, position, progress, date, name, skipNotification } = req.body;
      
      const updateData = {};
      
      // Validasi decision
      if (decision !== undefined) {
        const validDecisions = ["pending", "approved", "rejected"];
        if (!validDecisions.includes(decision)) {
          return res.status(400).json({
            success: false,
            message: "Decision tidak valid. Gunakan: pending, approved, atau rejected",
          });
        }
        updateData.decision = decision;
      }
      
      if (finished !== undefined) {
        if (typeof finished !== "boolean") {
          return res.status(400).json({
            success: false,
            message: "Finished harus berupa boolean (true/false)",
          });
        }
        updateData.finished = finished;
      }
      
      if (repoLink !== undefined) updateData.repoLink = repoLink || null;
      if (position !== undefined) updateData.position = position;
      if (name !== undefined) updateData.name = name;
      
      if (progress !== undefined) {
        if (progress < 0 || progress > 100) {
          return res.status(400).json({
            success: false,
            message: "Progress harus antara 0-100",
          });
        }
        updateData.progress = progress;
      }
      
      if (date !== undefined) {
        updateData.date = date ? new Date(date) : new Date();
      }

      // 🔥 Update project
      const updatedProjectRaw = await prisma.project.update({
        where: { id: id },
        data: updateData,
        include: {
          attachments: true,
        },
      });
      const updatedProject = await enrichProjectWithUser(updatedProjectRaw);
      
      console.log(`✅ Project ${id} diupdate oleh user ${userId} (${userRole})`);
      console.log("📊 Update data:", updateData);
      
      return res.status(200).json({
        success: true,
        message: "Project berhasil diupdate",
        project: updatedProject,
      });
    } catch (error) {
      console.error("❌ PATCH project error:", error);
      return res.status(500).json({
        success: false,
        message: "Server Error",
        detail: error.message,
      });
    }
  }

  // ─── 7. DELETE ──────────────────────────────────────────────
  if (req.method === "DELETE") {
    // 🔥 ADMIN bisa hapus semua project, MEMBER hanya project sendiri
    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        success: false,
        message: "❌ Anda tidak memiliki akses untuk menghapus project ini.",
      });
    }

    try {
      await prisma.attachment.deleteMany({
        where: { projectId: id },
      });

      await prisma.project.delete({
        where: { id: id },
      });
      
      console.log(`🗑️ Project ${id} dihapus oleh user ${userId} (${userRole})`);
      
      return res.status(200).json({
        success: true,
        message: "Project berhasil dihapus",
      });
    } catch (error) {
      console.error("❌ DELETE project error:", error);
      
      if (error.code === "P2025") {
        return res.status(404).json({
          success: false,
          message: "Project tidak ditemukan",
        });
      }
      
      return res.status(500).json({
        success: false,
        message: "Server Error",
        detail: error.message,
      });
    }
  }

  // ─── 8. METHOD NOT ALLOWED ──────────────────────────────────
  return res.status(405).json({
    success: false,
    message: "Method not allowed",
  });
}