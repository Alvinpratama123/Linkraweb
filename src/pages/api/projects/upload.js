// =====================================================================
// File       : pages/api/projects/upload.js
// Fungsi     : Upload project beserta file gambar dan modul (POST)
// Alur Umum  :
//   1. Verifikasi JWT dari cookie auth_token
//   2. Ambil data user dari auth_db untuk keperluan senderRole
//   3. Parse multipart form menggunakan formidable
//   4. Validasi tipe file:
//      - Gambar : jpg, png, gif, webp
//      - Modul  : pdf, doc, docx
//   5. Simpan file ke folder public/uploads dengan nama unik
//   6. Simpan/update project di project_db (upsert pattern)
//   7. Buat record attachment di database
//   8. Kirim notifikasi ke semua user bahwa ada project baru
//
// Catatan    :
//   - bodyParser dinonaktifkan (config export) agar formidable bisa
//     membaca stream multipart form secara langsung
//   - Ukuran file maksimal 10 MB
//   - Deskripsi gambar bisa disertakan untuk attachment
// =====================================================================

import { prismaAuth } from "@/lib/prismaAuth";
import { prismaProject } from "@/lib/prismaProject";
import { sendProjectNotificationToAllUsers } from "@/lib/notification";
import formidable from "formidable";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";

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
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ 
      success: false,
      message: "Method not allowed" 
    });
  }

  console.log("📤 === START UPLOAD PROJECT ===");

  // ─── VERIFIKASI TOKEN ──────────────────────────────────
  const token = req.cookies.auth_token;
  if (!token) {
    console.log("❌ No token found in cookies");
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
    console.error("❌ Token verification failed:", err.message);
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
    senderUser = await prismaAuth.user.findUnique({
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
      console.error("❌ Form parse error:", err);
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
        hasModuleFile: !!files.moduleFile
      });

      if (!name || !name.trim()) {
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
          
          try {
            fs.renameSync(file.filepath, newPath);
            imageUrl = `/uploads/${fileName}`;
            console.log("✅ Image saved:", imageUrl);
          } catch (renameError) {
            console.error("❌ Error renaming image:", renameError);
            // Coba copy file jika rename gagal
            fs.copyFileSync(file.filepath, newPath);
            fs.unlinkSync(file.filepath);
            imageUrl = `/uploads/${fileName}`;
          }
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
          
          try {
            fs.renameSync(file.filepath, newPath);
            moduleUrl = `/uploads/${fileName}`;
            console.log("✅ Module saved:", moduleUrl);
          } catch (renameError) {
            console.error("❌ Error renaming module:", renameError);
            fs.copyFileSync(file.filepath, newPath);
            fs.unlinkSync(file.filepath);
            moduleUrl = `/uploads/${fileName}`;
          }
        }
      }

      // ─── SIMPAN PROJECT KE DATABASE ──────────────────────
      console.log("💾 Saving project to database...");

      const normalizeProjectDate = (value) => {
        if (!value) return new Date();
        if (value instanceof Date) return value;
        if (typeof value === "string") {
          const trimmed = value.trim();
          if (!trimmed) return new Date();
          const parsed = new Date(trimmed);
          if (!Number.isNaN(parsed.getTime())) return parsed;
        }
        return new Date();
      };

      const projectData = {
        name: name.trim(),
        position: position || "Frontend",
        repoLink: repoLink || "",
        date: normalizeProjectDate(date),
        progress: progress || 0,
        decision: "pending",
        finished: false,
        imageUrl: imageUrl,
        moduleUrl: moduleUrl,
        imageDescription: imageDescription || null,
        imageDescription2: imageDescription2 || null,
        userId: userId,
      };

      console.log("📦 Project data:", projectData);

      const existingProject = await prismaProject.project.findFirst({
        where: {
          userId: userId,
          name: projectData.name,
        },
      });

      const project = existingProject
        ? await prismaProject.project.update({
            where: { id: existingProject.id },
            data: projectData,
          })
        : await prismaProject.project.create({
            data: projectData,
          });

      console.log(`✅ Project ${existingProject ? "updated" : "created"} with ID:`, project.id);

      await sendProjectNotificationToAllUsers(project, "upload", decoded.role || "member");

      // ─── SIMPAN ATTACHMENT ─────────────────────────────
      if (imageUrl) {
        await prismaProject.attachment.create({
          data: {
            projectId: project.id,
            type: "image",
            name: "Gambar Project",
            url: imageUrl,
            status: "pending",
            description: imageDescription || null,
          },
        });
        console.log("✅ Image attachment saved");
      }

      if (imageDescription2 && imageDescription2.trim()) {
        await prismaProject.attachment.create({
          data: {
            projectId: project.id,
            type: "image",
            name: "Keterangan tambahan",
            url: imageUrl || "",
            status: "pending",
            description: imageDescription2,
          },
        });
        console.log("✅ Additional description saved");
      }

      if (moduleUrl) {
        await prismaProject.attachment.create({
          data: {
            projectId: project.id,
            type: "module",
            name: "Modul Project",
            url: moduleUrl,
            status: "pending",
          },
        });
        console.log("✅ Module attachment saved");
      }

      // ─── AMBIL SEMUA ATTACHMENT ────────────────────────
      const allAttachments = await prismaProject.attachment.findMany({
        where: { projectId: project.id },
      });

      console.log("📊 Total attachments:", allAttachments.length);

      // ─── RESPONSE ────────────────────────────────────────
      return res.status(200).json({
        success: true,
        message: "✅ Project berhasil disimpan",
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
        error: process.env.NODE_ENV === "development" ? error.stack : undefined,
      });
    }
  });
}