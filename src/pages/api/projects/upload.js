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

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const allowedTypes = {
  image: ["image/jpeg", "image/png", "image/gif", "image/webp"],
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
    maxFileSize: 10 * 1024 * 1024, // 10MB
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({ message: "Gagal parse form", detail: err.message });
    }

    try {
      const name = Array.isArray(fields.name) ? fields.name[0] : fields.name;
      const position = Array.isArray(fields.position) ? fields.position[0] : fields.position;
      const repoLink = Array.isArray(fields.repoLink) ? fields.repoLink[0] : fields.repoLink;
      const date = Array.isArray(fields.date) ? fields.date[0] : fields.date;
      const progress = parseInt(Array.isArray(fields.progress) ? fields.progress[0] : fields.progress) || 0;

      if (!name || !position || !date) {
        return res.status(400).json({ message: "Nama, posisi, dan tanggal wajib diisi" });
      }

      const allowedPositions = ["Frontend", "Backend", "Fullstack", "UI/UX", "DevOps", "QA", "PM"];
      if (!allowedPositions.includes(position)) {
        return res.status(400).json({ message: "Posisi tidak valid" });
      }

      // Simpan project ke DB
      const project = await prisma.project.create({
        data: {
          name,
          position,
          repoLink: repoLink || null,
          date,
          progress,
        },
      });

      const attachments = [];

      // Handle image upload
      const imageFile = files.imageFile?.[0] || files.imageFile;
      if (imageFile && imageFile.size > 0) {
        if (!allowedTypes.image.includes(imageFile.mimetype)) {
          return res.status(400).json({ message: "Format gambar tidak valid" });
        }
        const fileName = `img_${Date.now()}${path.extname(imageFile.originalFilename || "")}`;
        const newPath = path.join(uploadDir, fileName);
        fs.renameSync(imageFile.filepath, newPath);

        const attachment = await prisma.attachment.create({
          data: {
            projectId: project.id,
            type: "image",
            name: imageFile.originalFilename || fileName,
            url: `/uploads/${fileName}`,
          },
        });
        attachments.push(attachment);
      }

      // Handle module upload
      const moduleFile = files.moduleFile?.[0] || files.moduleFile;
      if (moduleFile && moduleFile.size > 0) {
        if (!allowedTypes.module.includes(moduleFile.mimetype)) {
          return res.status(400).json({ message: "Format modul tidak valid. Gunakan PDF atau Word" });
        }
        const fileName = `mod_${Date.now()}${path.extname(moduleFile.originalFilename || "")}`;
        const newPath = path.join(uploadDir, fileName);
        fs.renameSync(moduleFile.filepath, newPath);

        const attachment = await prisma.attachment.create({
          data: {
            projectId: project.id,
            type: "module",
            name: moduleFile.originalFilename || fileName,
            url: `/uploads/${fileName}`,
          },
        });
        attachments.push(attachment);
      }

      return res.status(201).json({
        success: true,
        message: "Project berhasil disimpan",
        project: { ...project, attachments },
      });

    } catch (error) {
      console.error("Upload error:", error);
      return res.status(500).json({ message: "Server Error", detail: error.message });
    }
  });
}