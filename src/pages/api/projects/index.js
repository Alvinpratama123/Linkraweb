// =====================================================================
// File       : pages/api/projects/index.js
// Fungsi     : CRUD untuk data project (GET, POST, PATCH, DELETE)
// Alur Umum  :
//   1. Verifikasi JWT dari cookie auth_token
//   2. GET    → Semua user bisa melihat seluruh project (tanpa filter userId)
//   3. POST   → Cek apakah project sudah ada (upsert) → buat baru atau update
//   4. PATCH  → Admin bisa update semua, member hanya project sendiri;
//              kirim notifikasi jika ada perubahan decision/finished
//   5. DELETE → Admin bisa hapus semua, member hanya project sendiri;
//              hapus attachment terlebih dahulu baru hapus project
//
// Catatan    :
//   - enrichProjectsWithUsers: mengambil data user dari auth_db
//     untuk melengkapi data project (karena project di DB terpisah)
//   - Semua project terlihat oleh semua user (tidak ada filter userId di GET)
// =====================================================================

import { prismaProject as prisma } from "@/lib/prismaProject";
import { prismaAuth } from "@/lib/prismaAuth";
import { sendProjectNotificationToAllUsers } from "@/lib/notification";
import jwt from "jsonwebtoken";

async function enrichProjectsWithUsers(projects) {
  const userIds = [...new Set(projects.map(p => p.userId).filter(Boolean))];
  let usersMap = {};
  if (userIds.length > 0) {
    const users = await prismaAuth.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, email: true, position: true },
    });
    usersMap = Object.fromEntries(users.map(u => [u.id, u]));
  }
  return projects.map(p => ({
    ...p,
    user: usersMap[p.userId] || null,
  }));
}

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
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      projects = await enrichProjectsWithUsers(projects);
      
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

      const parseProjectDate = (value) => {
        if (!value) return new Date();
        if (value instanceof Date) return value;
        if (typeof value === "string") {
          const trimmed = value.trim();
          if (!trimmed) return new Date();

          const parsed = new Date(trimmed);
          if (!Number.isNaN(parsed.getTime())) {
            return parsed;
          }

          const fallback = new Date(trimmed.replace(/\s+/g, " "));
          if (!Number.isNaN(fallback.getTime())) {
            return fallback;
          }
        }
        return new Date();
      };

      if (!name) {
        return res.status(400).json({
          success: false,
          message: "Nama project wajib diisi",
        });
      }

      const normalizedName = name.trim();
      console.log(`📝 Creating/updating project for user ${userId}:`, { name: normalizedName, position });

      const existingProject = await prisma.project.findFirst({
        where: {
          userId: userId,
          name: normalizedName,
        },
        include: {
          attachments: true,
        },
      });

      const projectData = {
        name: normalizedName,
        position: position || "Frontend",
        repoLink: repoLink || null,
        date: date ? parseProjectDate(date) : existingProject?.date || new Date(),
        progress: progress === undefined || progress === null || progress === "" ? existingProject?.progress ?? 0 : Number(progress),
        userId: userId,
      };

      const project = existingProject
        ? await prisma.project.update({
            where: { id: existingProject.id },
            data: projectData,
            include: {
              attachments: true,
            },
          })
        : await prisma.project.create({
            data: projectData,
            include: {
              attachments: true,
            },
          });

      console.log(`✅ Project ${existingProject ? "updated" : "created"} with ID: ${project.id}`);

      if (!existingProject) {
        await sendProjectNotificationToAllUsers(project, "upload", userRole);
      }

      return res.status(existingProject ? 200 : 201).json({
        success: true,
        message: existingProject ? "Project berhasil diperbarui" : "Project berhasil dibuat",
        project: project,
        existed: Boolean(existingProject),
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
        },
      });

      const enrichedProject = await enrichProjectWithUser(project);

      if (updateData.decision || updateData.finished !== undefined) {
        const action = updateData.finished ? "finished" : updateData.decision === "approved" ? "approved" : updateData.decision === "rejected" ? "rejected" : null;
        if (action) {
          await sendProjectNotificationToAllUsers(enrichedProject, action, userRole);
        }
      }

      return res.status(200).json({
        success: true,
        message: "Project berhasil diupdate",
        project: enrichedProject,
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