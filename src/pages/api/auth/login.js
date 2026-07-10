// pages/api/auth/login.js
import { prismaAuth as prisma } from "@/lib/prismaAuth";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    const { email, password } = req.body;

    console.log("=== LOGIN ===");
    console.log("📝 Email:", email);

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email dan password wajib diisi",
      });
    }

    const emailLower = email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { email: emailLower },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email tidak ditemukan",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Password salah",
      });
    }

    // Buat token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        position: user.position,
        name: user.name,
      },
      process.env.JWT_SECRET || "your-secret-key-change-in-production",
      { expiresIn: "7d" }
    );

    // 🔥 Tentukan redirect berdasarkan role
    let redirectPath;
    if (user.role === "ADMIN" || user.role === "admin") {
      redirectPath = "/dashboardAdmin/admin";
    } else {
      redirectPath = "/memberDashboard/MemberDashboard";
    }

    console.log(`🔀 Redirect to: ${redirectPath} for role: ${user.role}`);

    // Set cookie
    res.setHeader(
      "Set-Cookie",
      `auth_token=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Lax${
        process.env.NODE_ENV === "production" ? "; Secure" : ""
      }`
    );

    return res.status(200).json({
      success: true,
      message: "Login berhasil",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        position: user.position,
        photo: user.photo || null,
      },
      redirect: redirectPath,
    });

  } catch (error) {
    console.error("❌ LOGIN ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}