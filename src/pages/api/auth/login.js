import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { sendLoginVerificationEmail } from "@/lib/mailer";
import crypto from "crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email dan password wajib diisi" });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ message: "Email tidak ditemukan" });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: "Password salah" });
    }

    // Buat token verifikasi login (berlaku 15 menit)
    const loginToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    // Hapus token lama yang belum dipakai milik user ini
    await prisma.loginToken.deleteMany({
      where: { userId: user.id, used: false },
    });

    // Simpan token baru
    await prisma.loginToken.create({
      data: {
        token: loginToken,
        userId: user.id,
        expiresAt,
        used: false,
      },
    });

    // Kirim email konfirmasi
    await sendLoginVerificationEmail({
      to: user.email,
      name: user.name,
      token: loginToken,
    });

    // TAMBAHKAN: Kirim data user ke frontend
    return res.status(200).json({
      success: true,
      message: "Email konfirmasi telah dikirim. Silakan cek inbox Anda.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ 
      success: false,
      message: "Server Error" 
    });
  }
}