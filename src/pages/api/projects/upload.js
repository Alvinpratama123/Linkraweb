import { prisma } from "@/lib/prisma";
import formidable from "formidable";
import fs from "fs";
import path from "path";

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
    return res.status(405).json({ message: "Method not allowed" });
  }

  const form = formidable({
    uploadDir,
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Form parse error:", err);
      return res.status(400).json({ message: "Gagal parse form", detail: err.message });
    }

    try {
      // Extract field values
      const name = Array.isArray(fields.name) ? fields.name[0] : fields.name;
      const position = Array.isArray(fields.position) ? fields.position[0] : fields.position;
      const repoLink = Array.isArray(fields.repoLink) ? fields.repoLink[0] : fields.repoLink;
      const date = Array.isArray(fields.date) ? fields.date[0] : fields.date;
      const progress = parseInt(Array.isArray(fields.progress) ? fields.progress[0] : fields.progress) || 0;

      // Validasi required fields
      if (!name || !position || !date) {
        return res.status(400).json({ 
          success: false,
          message: "Nama, posisi, dan tanggal wajib diisi" 
        });
      }

      const allowedPositions = ["Frontend", "Backend", "Fullstack", "UI/UX", "DevOps", "QA", "PM"];
      if (!allowedPositions.includes(position)) {
        return res.status(400).json({ 
          success: false,
          message: "Posisi tidak valid" 
        });
      }

      // Cek apakah project dengan nama + posisi sudah ada
      const existingProject = await prisma.project.findFirst({
        where: {
          name: name,
          position: position,
        },
      });

      let project;

      if (existingProject) {
        // UPDATE project yang sudah ada
        project = await prisma.project.update({
          where: { id: existingProject.id },
          data: {
            repoLink: repoLink || existingProject.repoLink,
            date: date,
            progress: progress,
          },
        });
      } else {
        // BUAT project baru
        project = await prisma.project.create({
          data: {
            name: name,
            position: position,
            repoLink: repoLink || null,
            date: date,
            progress: progress,
          },
        });
      }

      const attachments = [];

      // Handle image upload
      const imageFile = files.imageFile ? (Array.isArray(files.imageFile) ? files.imageFile[0] : files.imageFile) : null;
      if (imageFile && imageFile.size > 0) {
        // Validasi tipe file image
        if (!allowedTypes.image.includes(imageFile.mimetype)) {
          return res.status(400).json({ 
            success: false,
            message: "Format gambar tidak valid. Gunakan JPG, PNG, GIF, atau WEBP" 
          });
        }

        const fileName = `img_${Date.now()}_${Math.random().toString(36).substring(7)}${path.extname(imageFile.originalFilename || '')}`;
        const newPath = path.join(uploadDir, fileName);
        
        // Pindahkan file
        fs.renameSync(imageFile.filepath, newPath);

        const attachment = await prisma.attachment.create({
          data: {
            projectId: project.id,
            type: "image",
            name: imageFile.originalFilename || fileName,
            url: `/uploads/${fileName}`,
            status: "pending",
          },
        });
        attachments.push(attachment);
      }

      // Handle module upload
      const moduleFile = files.moduleFile ? (Array.isArray(files.moduleFile) ? files.moduleFile[0] : files.moduleFile) : null;
      if (moduleFile && moduleFile.size > 0) {
        // Validasi tipe file module
        if (!allowedTypes.module.includes(moduleFile.mimetype)) {
          return res.status(400).json({ 
            success: false,
            message: "Format modul tidak valid. Gunakan PDF atau Word" 
          });
        }

        // Hapus modul lama dari disk dan DB jika project sudah ada
        if (existingProject) {
          const oldModules = await prisma.attachment.findMany({
            where: { 
              projectId: project.id, 
              type: "module" 
            },
          });
          
          for (const old of oldModules) {
            const oldPath = path.join(process.cwd(), "public", old.url);
            if (fs.existsSync(oldPath)) {
              fs.unlinkSync(oldPath);
            }
            await prisma.attachment.delete({ where: { id: old.id } });
          }
        }

        const fileName = `mod_${Date.now()}_${Math.random().toString(36).substring(7)}${path.extname(moduleFile.originalFilename || '')}`;
        const newPath = path.join(uploadDir, fileName);
        
        // Pindahkan file
        fs.renameSync(moduleFile.filepath, newPath);

        const attachment = await prisma.attachment.create({
          data: {
            projectId: project.id,
            type: "module",
            name: moduleFile.originalFilename || fileName,
            url: `/uploads/${fileName}`,
            status: "pending",
          },
        });
        attachments.push(attachment);
      }

      // Ambil semua attachment terbaru
      const allAttachments = await prisma.attachment.findMany({
        where: { projectId: project.id },
      });

      return res.status(200).json({
        success: true,
        message: existingProject ? "Project berhasil diupdate" : "Project berhasil disimpan",
        project: {
          ...project,
          attachments: allAttachments,
        },
      });

    } catch (error) {
      console.error("Upload error:", error);
      return res.status(500).json({ 
        success: false,
        message: "Server Error", 
        detail: error.message 
      });
    }
  });
}
//upload selesai