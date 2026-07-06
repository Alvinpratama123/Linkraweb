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
      message: "Method not allowed",
    });
  }

  try {
    // ─── Ambil & verifikasi token dari cookie ─────────────────
    const token = req.cookies.auth_token;
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key-change-in-production");
    } catch (err) {
      return res.status(401).json({ success: false, message: "Token tidak valid atau sudah expired" });
    }

    // ─── Parse FormData ───────────────────────────────────────
    const uploadDir = path.join(process.cwd(), "public/uploads/profiles");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const form = new IncomingForm({
      uploadDir,
      keepExtensions: true,
      maxFileSize: 2 * 1024 * 1024, // 2MB
    });

    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

    // ─── Ambil user saat ini dari DB ──────────────────────────
    // FIX: ambil dulu user lengkap termasuk position, agar bisa
    // dikembalikan di response meskipun field itu tidak diupdate.
    const currentUser = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id:        true,
        name:      true,
        email:     true,
        role:      true,
        photo:     true,
        position:  true,   // ← FIX: field ini harus diambil
        createdAt: true,
      },
    });

    if (!currentUser) {
      return res.status(404).json({ success: false, message: "User tidak ditemukan" });
    }

    // ─── Bangun objek update ──────────────────────────────────
    const updateData = {};

    // Update name jika berubah
    const newName = fields.name?.[0]?.trim();
    if (newName && newName !== currentUser.name) {
      updateData.name = newName;
    }

    // Update email jika berubah + cek duplikat
    const newEmail = fields.email?.[0]?.trim().toLowerCase();
    if (newEmail && newEmail !== currentUser.email) {
      const emailTaken = await prisma.user.findFirst({
        where: {
          email: newEmail,
          id: { not: decoded.userId },
        },
      });
      if (emailTaken) {
        return res.status(400).json({
          success: false,
          message: "Email sudah digunakan oleh akun lain",
        });
      }
      updateData.email = newEmail;
    }

    // Update foto jika ada file baru
    if (files.photo?.[0]) {
      const photo     = files.photo[0];
      const extension = path.extname(photo.originalFilename || ".jpg");
      const fileName  = `profile-${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
      const newPath   = path.join(uploadDir, fileName);

      fs.renameSync(photo.filepath, newPath);
      updateData.photo = `/uploads/profiles/${fileName}`;

      // Hapus foto lama jika ada
      if (currentUser.photo) {
        const oldPath = path.join(process.cwd(), "public", currentUser.photo);
        if (fs.existsSync(oldPath)) {
          try { fs.unlinkSync(oldPath); } catch { /* abaikan jika gagal */ }
        }
      }
    }

    // Tidak ada yang berubah
    if (Object.keys(updateData).length === 0) {
      return res.status(200).json({
        success: true,
        message: "Tidak ada perubahan",
        // FIX: tetap kembalikan user lengkap termasuk position
        user: currentUser,
      });
    }

    // ─── Update DB ────────────────────────────────────────────
    const updatedUser = await prisma.user.update({
      where: { id: decoded.userId },
      data: updateData,
      select: {
        id:        true,
        name:      true,
        email:     true,
        role:      true,
        photo:     true,
        position:  true,   // ← FIX: wajib ada agar posisi tidak hilang di frontend
        createdAt: true,
      },
    });

    // ─── Buat token baru ──────────────────────────────────────
    const newToken = jwt.sign(
      {
        userId:   updatedUser.id,
        email:    updatedUser.email,
        name:     updatedUser.name,
        role:     updatedUser.role,
        photo:    updatedUser.photo,
        position: updatedUser.position, // ← FIX: sertakan position di token
      },
      process.env.JWT_SECRET || "your-secret-key-change-in-production",
      { expiresIn: "7d" }
    );

    // Update cookie
    res.setHeader(
      "Set-Cookie",
      `auth_token=${newToken}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Lax${
        process.env.NODE_ENV === "production" ? "; Secure" : ""
      }`
    );

    return res.status(200).json({
      success: true,
      message: "Profile berhasil diperbarui",
      user: updatedUser, // ← sekarang sudah menyertakan position
    });
  } catch (error) {
    console.error("Update profile error:", error);

    // Tangani error spesifik dari formidable (file terlalu besar)
    if (error.code === 1009 || error.message?.includes("maxFileSize")) {
      return res.status(400).json({
        success: false,
        message: "Ukuran file melebihi batas 2MB",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Terjadi kesalahan server",
    });
  }
}