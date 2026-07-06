// pages/api/projects/index.js
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  // ─── CORS HEADERS ──────────────────────────────────────────
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

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
    decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key-change-in-production");
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

  // 🔥 Cek apakah user adalah ADMIN
  const isAdmin = userRole === "ADMIN" || userRole === "admin";

  // ─── 2. GET ─────────────────────────────────────────────────
  if (req.method === "GET") {
    try {
      let projects;

      // 🔥 SEMUA USER bisa melihat SEMUA project (tidak ada filter userId)
      // Ini agar member bisa melihat project yang diupload admin
      console.log(`📊 User ${userId} (${userRole}) fetching ALL projects`);
      
      projects = await prisma.project.findMany({
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
      
      console.log(`📊 Total projects fetched: ${projects.length}`);
      
      return res.status(200).json({
        success: true,
        projects: projects,
        count: projects.length,
        isAdmin: isAdmin,
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

      if (!name) {
        return res.status(400).json({
          success: false,
          message: "Nama project wajib diisi",
        });
      }

      console.log(`📝 Creating project for user ${userId}:`, { name, position });

      const project = await prisma.project.create({
        data: {
          name: name,
          position: position || "Frontend",
          repoLink: repoLink || null,
          date: date ? new Date(date) : new Date(),
          progress: progress || 0,
          userId: userId,
        },
        include: {
          attachments: true,
        },
      });

      console.log(`✅ Project created with ID: ${project.id}`);

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
      const { id, decision, finished, progress, position, name } = req.body;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: "ID project wajib diisi",
        });
      }

      const existingProject = await prisma.project.findUnique({
        where: { id: id },
      });

      if (!existingProject) {
        return res.status(404).json({
          success: false,
          message: "Project tidak ditemukan",
        });
      }

      // 🔥 ADMIN bisa update semua, MEMBER hanya project sendiri
      if (!isAdmin && existingProject.userId !== userId) {
        return res.status(403).json({
          success: false,
          message: "❌ Anda tidak memiliki akses ke project ini.",
        });
      }

      const updateData = {};
      if (decision !== undefined) updateData.decision = decision;
      if (finished !== undefined) updateData.finished = finished;
      if (progress !== undefined) {
        if (progress < 0 || progress > 100) {
          return res.status(400).json({
            success: false,
            message: "Progress harus antara 0-100",
          });
        }
        updateData.progress = progress;
      }
      if (position !== undefined) updateData.position = position;
      if (name !== undefined) updateData.name = name;

      console.log(`📝 Updating project ${id} by ${isAdmin ? 'Admin' : 'Member'}:`, updateData);

      const project = await prisma.project.update({
        where: { id: id },
        data: updateData,
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

      // 🔥 ADMIN bisa hapus semua, MEMBER hanya project sendiri
      if (!isAdmin && existingProject.userId !== userId) {
        return res.status(403).json({
          success: false,
          message: "❌ Anda tidak memiliki akses ke project ini.",
        });
      }

      await prisma.attachment.deleteMany({
        where: { projectId: id },
      });

      await prisma.project.delete({
        where: { id: id },
      });

      console.log(`🗑️ Project ${id} deleted by ${isAdmin ? 'Admin' : 'Member'}`);

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