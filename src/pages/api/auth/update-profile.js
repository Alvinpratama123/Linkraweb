// pages/api/auth/update-profile.js
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import path from "path";
import fs from "fs";
import { IncomingForm } from "formidable";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ 
      success: false, 
      message: "Method not allowed" 
    });
  }

  try {
    // Ambil token dari cookie
    const token = req.cookies.auth_token;

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: "Unauthorized" 
      });
    }

    // Verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Parse form data dengan formidable
    const form = new IncomingForm();
    form.uploadDir = path.join(process.cwd(), "public/uploads/profiles");
    form.keepExtensions = true;
    form.maxFileSize = 2 * 1024 * 1024; // 2MB

    // Buat folder jika belum ada
    if (!fs.existsSync(form.uploadDir)) {
      fs.mkdirSync(form.uploadDir, { recursive: true });
    }

    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    const updateData = {};
    
    // Handle name
    if (fields.name && fields.name[0] !== decoded.name) {
      updateData.name = fields.name[0];
    }
    
    // Handle email
    if (fields.email && fields.email[0] !== decoded.email) {
      // Cek email sudah dipakai
      const existingUser = await prisma.user.findFirst({
        where: {
          email: fields.email[0],
          id: { not: decoded.userId },
        },
      });
      if (existingUser) {
        return res.status(400).json({ 
          success: false, 
          message: "Email sudah digunakan" 
        });
      }
      updateData.email = fields.email[0];
    }

    // Handle photo
    let newPhotoPath = null;
    if (files.photo && files.photo[0]) {
      const photo = files.photo[0];
      const extension = path.extname(photo.originalFilename);
      const fileName = `profile-${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
      const newPath = path.join(form.uploadDir, fileName);
      
      // Rename file
      fs.renameSync(photo.filepath, newPath);
      newPhotoPath = `/uploads/profiles/${fileName}`;
      updateData.photo = newPhotoPath;

      // Hapus foto lama
      const oldUser = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { photo: true },
      });
      
      if (oldUser?.photo) {
        const oldPhotoPath = path.join(process.cwd(), "public", oldUser.photo);
        if (fs.existsSync(oldPhotoPath)) {
          fs.unlinkSync(oldPhotoPath);
        }
      }
    }

    // Update database
    const updatedUser = await prisma.user.update({
      where: { id: decoded.userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        photo: true,
        createdAt: true,
      },
    });

    // Generate token baru dengan data terbaru
    const newToken = jwt.sign(
      {
        userId: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
        photo: updatedUser.photo,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Update cookie dengan token baru
    res.setHeader(
      "Set-Cookie",
      `auth_token=${newToken}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Lax${
        process.env.NODE_ENV === "production" ? "; Secure" : ""
      }`
    );

    return res.status(200).json({
      success: true,
      message: "Profile berhasil diperbarui",
      user: updatedUser,
    });

  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({ 
      success: false, 
      message: error.message || "Terjadi kesalahan server" 
    });
  }
}