// pages/api/projects/index.js
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  // ─── 1. VERIFIKASI TOKEN ──────────────────────────────────
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

  // ─── 2. GET ─────────────────────────────────────────────────
  if (req.method === "GET") {
    try {
      const projects = await prisma.project.findMany({
        where: {
          userId: userId, // 🔥 Hanya ambil project milik user yang login
        },
        include: {
          attachments: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              position: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      
      return res.status(200).json({
        success: true,
        projects: projects,
        count: projects.length,
      });
    } catch (error) {
      console.error("❌ GET projects error:", error);
      return res.status(500).json({ 
        success: false, 
        message: "Server Error",
        detail: error.message 
      });
    }
  }

  // ─── 3. POST ─────────────────────────────────────────────────
  if (req.method === "POST") {
    try {
      const { name, position, repoLink, date, progress } = req.body;

      // Validasi
      if (!name) {
        return res.status(400).json({
          success: false,
          message: "Nama project wajib diisi",
        });
      }

      const project = await prisma.project.create({
        data: {
          name: name,
          position: position || "Frontend",
          repoLink: repoLink || null,
          date: date ? new Date(date) : new Date(),
          progress: progress || 0,
          userId: userId, // 🔥 Hubungkan dengan user
        },
        include: {
          attachments: true,
        },
      });

      return res.status(201).json({
        success: true,
        message: "Project berhasil dibuat",
        project: project,
      });
    } catch (error) {
      console.error("❌ POST project error:", error);
      return res.status(500).json({
        success: false,
        message: "Server Error",
        detail: error.message,
      });
    }
  }

  // ─── 4. PATCH ────────────────────────────────────────────────
  if (req.method === "PATCH") {
    try {
      const { id, decision, finished } = req.body;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: "ID project wajib diisi",
        });
      }

      // Cek project dan kepemilikan
      const existingProject = await prisma.project.findUnique({
        where: { id: id },
      });

      if (!existingProject) {
        return res.status(404).json({
          success: false,
          message: "Project tidak ditemukan",
        });
      }

      if (existingProject.userId !== userId) {
        return res.status(403).json({
          success: false,
          message: "❌ Anda tidak memiliki akses ke project ini.",
        });
      }

      // Data update
      const updateData = {};
      if (decision !== undefined) updateData.decision = decision;
      if (finished !== undefined) updateData.finished = finished;

      const project = await prisma.project.update({
        where: { id: id },
        data: updateData,
        include: {
          attachments: true,
        },
      });

      return res.status(200).json({
        success: true,
        message: "Project berhasil diupdate",
        project: project,
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

  // ─── 5. DELETE ───────────────────────────────────────────────
  if (req.method === "DELETE") {
    try {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: "ID project wajib diisi",
        });
      }

      // Cek project dan kepemilikan
      const existingProject = await prisma.project.findUnique({
        where: { id: id },
        include: {
          attachments: true,
        },
      });

      if (!existingProject) {
        return res.status(404).json({
          success: false,
          message: "Project tidak ditemukan",
        });
      }

      if (existingProject.userId !== userId) {
        return res.status(403).json({
          success: false,
          message: "❌ Anda tidak memiliki akses ke project ini.",
        });
      }

      // Hapus project (attachment akan terhapus otomatis karena cascade)
      await prisma.project.delete({
        where: { id: id },
      });

      return res.status(200).json({
        success: true,
        message: "Project berhasil dihapus",
      });
    } catch (error) {
      console.error("❌ DELETE project error:", error);
      return res.status(500).json({
        success: false,
        message: "Server Error",
        detail: error.message,
      });
    }
  }

  // ─── 6. METHOD NOT ALLOWED ──────────────────────────────────
  return res.status(405).json({ 
    success: false,
    message: "Method not allowed" 
  });
}