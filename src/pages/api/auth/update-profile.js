// =====================================================================
// ENDPOINT: PUT /api/auth/update-profile
// Deskripsi  : Memperbarui profil user (nama, email, foto) dengan
//              mendukung upload file menggunakan FormData.
// =====================================================================
// Alur Eksekusi:
//   1. Membaca & memverifikasi token JWT dari cookie
//   2. Menggunakan formidable untuk parse FormData (karena ada file upload)
//   3. Mengambil data user saat ini dari database
//   4. Membandingkan perubahan pada field nama, email, dan foto
//   5. Mengupload foto baru ke public/uploads/profiles/ (maks 2MB)
//   6. Menghapus foto lama jika ada foto baru
//   7. Mengupdate data user di database
//   8. Membuat JWT baru dengan data terbaru (agar cookie sinkron)
//   9. Mengatur cookie baru dan mengirimkan response
//
// Database  : auth_db (tabel User)
// Method    : PUT
// Cookie    : auth_token (JWT, HttpOnly)
// Body      : FormData — fields: name, email | files: photo (opsional)
// Folder    : public/uploads/profiles/ untuk menyimpan foto profil
// =====================================================================

import { prismaAuth as prisma } from "@/lib/prismaAuth";
import jwt from "jsonwebtoken";
import path from "path";
import fs from "fs";
import { IncomingForm } from "formidable";

// Menonaktifkan bodyParser bawaan Next.js karena kita menggunakan
// formidable untuk mem-parse FormData yang berisi file
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  // Hanya menerima metode PUT
  if (req.method !== "PUT") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    // ─── Langkah 1: Ambil & verifikasi token dari cookie ──────
    const token = req.cookies.auth_token;
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    let decoded;
    try {
      // Verifikasi JWT untuk mendapatkan userId
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ success: false, message: "Token tidak valid atau sudah expired" });
    }

    // ─── Langkah 2: Parse FormData menggunakan formidable ─────
    // Siapkan direktori upload jika belum ada
    const uploadDir = path.join(process.cwd(), "public/uploads/profiles");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Konfigurasi formidable: batas ukuran file 2MB
    const form = new IncomingForm({
      uploadDir,
      keepExtensions: true,
      maxFileSize: 2 * 1024 * 1024, // 2MB
    });

    // Parse FormData menjadi fields dan files
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

    // ─── Langkah 3: Ambil data user saat ini dari database ────
    // Ambil semua field termasuk position agar bisa dikembalikan
    // di response meskipun field tersebut tidak diupdate
    const currentUser = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id:        true,
        name:      true,
        email:     true,
        role:      true,
        photo:     true,
        position:  true,
        createdAt: true,
      },
    });

    if (!currentUser) {
      return res.status(404).json({ success: false, message: "User tidak ditemukan" });
    }

    // ─── Langkah 4: Bangun objek update secara dinamis ────────
    // Hanya field yang berubah akan dimasukkan ke objek update
    const updateData = {};

    // Cek perubahan nama
    const newName = fields.name?.[0]?.trim();
    if (newName && newName !== currentUser.name) {
      updateData.name = newName;
    }

    // Cek perubahan email + validasi tidak duplikat
    const newEmail = fields.email?.[0]?.trim().toLowerCase();
    if (newEmail && newEmail !== currentUser.email) {
      // Pastikan email baru belum digunakan user lain
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

    // ─── Langkah 5: Upload foto baru jika ada ─────────────────
    if (files.photo?.[0]) {
      const photo     = files.photo[0];
      // Buat nama file unik dengan timestamp dan angka random
      const extension = path.extname(photo.originalFilename || ".jpg");
      const fileName  = `profile-${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
      const newPath   = path.join(uploadDir, fileName);

      // Pindahkan file dari temporary ke direktori upload permanen
      fs.renameSync(photo.filepath, newPath);
      updateData.photo = `/uploads/profiles/${fileName}`;

      // ─── Langkah 6: Hapus foto lama jika ada ────────────────
      if (currentUser.photo) {
        const oldPath = path.join(process.cwd(), "public", currentUser.photo);
        if (fs.existsSync(oldPath)) {
          try { fs.unlinkSync(oldPath); } catch { /* abaikan jika gagal hapus */ }
        }
      }
    }

    // Jika tidak ada perubahan sama sekali, kembalikan user saat ini
    if (Object.keys(updateData).length === 0) {
      return res.status(200).json({
        success: true,
        message: "Tidak ada perubahan",
        user: currentUser,
      });
    }

    // ─── Langkah 7: Simpan perubahan ke database ──────────────
    const updatedUser = await prisma.user.update({
      where: { id: decoded.userId },
      data: updateData,
      select: {
        id:        true,
        name:      true,
        email:     true,
        role:      true,
        photo:     true,
        position:  true,
        createdAt: true,
      },
    });

    // ─── Langkah 8: Buat JWT baru dengan data yang sudah diupdate ──
    // Token baru diperlukan agar data di cookie (JWT) sinkron
    // dengan data terbaru di database
    const newToken = jwt.sign(
      {
        userId:   updatedUser.id,
        email:    updatedUser.email,
        name:     updatedUser.name,
        role:     updatedUser.role,
        photo:    updatedUser.photo,
        position: updatedUser.position,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ─── Langkah 9: Set cookie baru dengan token yang diperbarui ──
    // Cookie berlaku selama 7 hari (7 * 24 * 60 * 60 detik)
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