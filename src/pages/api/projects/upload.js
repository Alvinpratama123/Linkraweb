// pages/api/projects/upload.js
import { prisma } from "@/lib/prisma";
import formidable from "formidable";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import { sendProjectNotificationToAllUsers } from "@/lib/notification"; // 🔥 Ganti import

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadDir = path.join(process.cwd(), "public/uploads");

// Pastikan folder uploads ada
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const allowedTypes = {
  image: ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"],
  module: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ 
      success: false,
      message: "Method not allowed" 
    });
  }

  // ─── VERIFIKASI TOKEN ──────────────────────────────────
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
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "❌ Token tidak valid atau sudah expired.",
    });
  }

  const userId = decoded.userId;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "❌ User ID tidak ditemukan dalam token.",
    });
  }

  // ─── AMBIL DATA USER UNTUK SENDER ROLE ────────────────
  let senderUser = null;
  try {
    senderUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { 
        id: true, 
        name: true, 
        email: true, 
        position: true, 
        role: true 
      },
    });
    console.log("👤 Sender user:", senderUser?.name, senderUser?.position || senderUser?.role);
  } catch (userError) {
    console.error("❌ Error fetching user:", userError);
  }

  // ─── PROSES FORM ────────────────────────────────────────
  const form = formidable({
    uploadDir,
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024,
    multiples: false,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Form parse error:", err);
      return res.status(400).json({ 
        success: false,
        message: "Gagal parse form", 
        detail: err.message 
      });
    }

    try {
      // ─── EKSTRAK FIELD ──────────────────────────────────
      const name = Array.isArray(fields.name) ? fields.name[0] : fields.name;
      const position = Array.isArray(fields.position) ? fields.position[0] : fields.position;
      const repoLink = Array.isArray(fields.repoLink) ? fields.repoLink[0] : fields.repoLink;
      const date = Array.isArray(fields.date) ? fields.date[0] : fields.date;
      const progress = parseInt(Array.isArray(fields.progress) ? fields.progress[0] : fields.progress) || 0;
      const imageDescription = Array.isArray(fields.imageDescription) ? fields.imageDescription[0] : fields.imageDescription || "";
      const imageDescription2 = Array.isArray(fields.imageDescription2) ? fields.imageDescription2[0] : fields.imageDescription2 || "";

      console.log("📝 Data project:", { 
        name, 
        position, 
        userId, 
        imageDescription, 
        imageDescription2,
        hasImageFile: !!files.imageFile,
        imageFileSize: files.imageFile?.size || 0
      });

      if (!name) {
        return res.status(400).json({ 
          success: false,
          message: "❌ Nama project wajib diisi" 
        });
      }

      // ─── HANDLE IMAGE UPLOAD ────────────────────────────
      let imageUrl = null;
      let moduleUrl = null;

      const imageFile = files.imageFile;
      if (imageFile) {
        const file = Array.isArray(imageFile) ? imageFile[0] : imageFile;
        
        if (file && file.size > 0) {
          console.log("🖼️ Processing image file:", file.originalFilename, file.size);
          
          if (!allowedTypes.image.includes(file.mimetype)) {
            return res.status(400).json({ 
              success: false,
              message: "❌ Format gambar tidak valid. Gunakan JPG, PNG, GIF, atau WEBP" 
            });
          }

          const ext = path.extname(file.originalFilename || '');
          const fileName = `img_${Date.now()}_${Math.random().toString(36).substring(7)}${ext}`;
          const newPath = path.join(uploadDir, fileName);
          
          fs.renameSync(file.filepath, newPath);
          imageUrl = `/uploads/${fileName}`;
          console.log("🖼️ Image saved:", imageUrl);
        }
      }

      // ─── HANDLE MODULE UPLOAD ──────────────────────────
      const moduleFile = files.moduleFile;
      if (moduleFile) {
        const file = Array.isArray(moduleFile) ? moduleFile[0] : moduleFile;
        
        if (file && file.size > 0) {
          console.log("📄 Processing module file:", file.originalFilename, file.size);
          
          if (!allowedTypes.module.includes(file.mimetype)) {
            return res.status(400).json({ 
              success: false,
              message: "❌ Format modul tidak valid. Gunakan PDF atau Word" 
            });
          }

          const ext = path.extname(file.originalFilename || '');
          const fileName = `mod_${Date.now()}_${Math.random().toString(36).substring(7)}${ext}`;
          const newPath = path.join(uploadDir, fileName);
          
          fs.renameSync(file.filepath, newPath);
          moduleUrl = `/uploads/${fileName}`;
          console.log("📄 Module saved:", moduleUrl);
        }
      }

      // ─── CEK PROJECT EXISTING ───────────────────────────
      const existingProject = await prisma.project.findFirst({
        where: {
          name: name,
          userId: userId,
        },
      });

      let project;

      // ─── CREATE OR UPDATE PROJECT ──────────────────────
      if (existingProject) {
        project = await prisma.project.update({
          where: { id: existingProject.id },
          data: {
            position: position || existingProject.position,
            repoLink: repoLink || existingProject.repoLink,
            date: date ? new Date(date) : existingProject.date,
            progress: progress || existingProject.progress,
            imageDescription: imageDescription || existingProject.imageDescription,
            imageDescription2: imageDescription2 || existingProject.imageDescription2,
            imageUrl: imageUrl || existingProject.imageUrl,
            moduleUrl: moduleUrl || existingProject.moduleUrl,
          },
        });
        console.log("📝 Project updated:", project.id);
      } else {
        project = await prisma.project.create({
          data: {
            name: name,
            position: position || "Frontend",
            repoLink: repoLink || null,
            date: date ? new Date(date) : new Date(),
            progress: progress || 0,
            imageUrl: imageUrl,
            moduleUrl: moduleUrl,
            imageDescription: imageDescription || null,
            imageDescription2: imageDescription2 || null,
            userId: userId,
          },
        });
        console.log("✅ Project created:", project.id);

        // ─── 🔥 KIRIM NOTIFIKASI KE SEMUA USER ─────────────
        try {
          // Dapatkan sender role dari user
          const senderRole = senderUser?.position || senderUser?.role || "User";
          
          // Kirim notifikasi ke semua user
          await sendProjectNotificationToAllUsers(project, "upload", senderRole);
          console.log(`📢 Notifikasi upload dikirim ke semua user oleh ${senderRole}`);
        } catch (notifError) {
          console.error("❌ Notification error:", notifError);
          // Notifikasi gagal tapi project tetap tersimpan
        }
      }

      console.log("📊 Final project data:", {
        id: project.id,
        name: project.name,
        imageUrl: project.imageUrl,
        imageDescription: project.imageDescription,
        moduleUrl: project.moduleUrl,
      });

      // ─── SIMPAN ATTACHMENT ─────────────────────────────
      if (imageUrl) {
        await prisma.attachment.create({
          data: {
            projectId: project.id,
            type: "image",
            name: "Gambar Project",
            url: imageUrl,
            status: "pending",
            description: imageDescription || null,
          },
        });

        if (imageDescription2 && imageDescription2.trim()) {
          await prisma.attachment.create({
            data: {
              projectId: project.id,
              type: "image",
              name: "Keterangan tambahan",
              url: imageUrl,
              status: "pending",
              description: imageDescription2,
              isAdditionalDescription: true,
            },
          });
        }
      }

      if (moduleUrl) {
        await prisma.attachment.create({
          data: {
            projectId: project.id,
            type: "module",
            name: "Modul Project",
            url: moduleUrl,
            status: "pending",
          },
        });
      }

      // ─── AMBIL SEMUA ATTACHMENT ────────────────────────
      const allAttachments = await prisma.attachment.findMany({
        where: { projectId: project.id },
      });

      return res.status(200).json({
        success: true,
        message: existingProject ? "✅ Project berhasil diupdate" : "✅ Project berhasil disimpan",
        project: {
          ...project,
          attachments: allAttachments,
        },
      });

    } catch (error) {
      console.error("❌ Upload error:", error);
      return res.status(500).json({ 
        success: false,
        message: "❌ Terjadi kesalahan pada server: " + error.message,
      });
    }
  });
}