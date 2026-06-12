import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { name, email, role, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, dan password wajib diisi" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Format email tidak valid" });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password minimal 8 karakter" });
    }

    // Sesuaikan dengan option di frontend
    const allowedRoles = ["frontend", "backend", "uiux", "qa", "pm", "admin"];
    const userRole = role && allowedRoles.includes(role) ? role : "frontend";

    const userExist = await prisma.user.findUnique({
      where: { email },
    });

    if (userExist) {
      return res.status(400).json({ message: "Email sudah terdaftar" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        role: userRole,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Registrasi berhasil",
      user,
    });

  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: "Server Error", detail: error.message });
  }
}