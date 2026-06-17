import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    const { email, password } = req.body;

    // Validasi input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email dan password wajib diisi",
      });
    }

    // Cari user di database
    const user = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase().trim(),
      },
    });

    // Jika user tidak ditemukan
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email atau password salah",
      });
    }

    // Verifikasi password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Email atau password salah",
      });
    }

    // Generate JWT Token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // Set cookie
    res.setHeader(
      "Set-Cookie",
      `auth_token=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Lax${
        process.env.NODE_ENV === "production" ? "; Secure" : ""
      }`
    );

    // Tentukan redirect berdasarkan role
    const redirectMap = {
      admin: "/dashboardAdmin/admin",
      member: "/memberDashboard/MemberDashboard",
      frontend: "/memberDashboard/MemberDashboard",
      backend: "/memberDashboard/MemberDashboard",
      uiux: "/memberDashboard/MemberDashboard",
      qa: "/memberDashboard/MemberDashboard",
      pm: "/memberDashboard/MemberDashboard",
      user: "/dashboard/user",
    };

    return res.status(200).json({
      success: true,
      message: "Login berhasil",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      redirect: redirectMap[user.role] || "/memberDashboard/MemberDashboard",
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server. Silakan coba lagi.",
    });
  }
}