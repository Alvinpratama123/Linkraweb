// pages/api/auth/verif/verif.js
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { token } = req.query;

  if (!token) {
    return res.redirect("/login?error=Token tidak valid");
  }

  try {
    const loginToken = await prisma.loginToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!loginToken) {
      return res.redirect("/login?error=Token tidak ditemukan");
    }

    if (loginToken.used) {
      return res.redirect("/login?error=Token sudah digunakan");
    }

    if (new Date() > loginToken.expiresAt) {
      return res.redirect("/login?error=Token sudah kadaluarsa");
    }

    await prisma.loginToken.update({
      where: { token },
      data: { used: true },
    });

    const sessionToken = jwt.sign(
      {
        userId: loginToken.user.id,
        email: loginToken.user.email,
        name: loginToken.user.name,
        role: loginToken.user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.setHeader(
      "Set-Cookie",
      `auth_token=${sessionToken}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Lax${
        process.env.NODE_ENV === "production" ? "; Secure" : ""
      }`
    );

    const redirectUrl =
      loginToken.user.role === "admin" ? "/dashboardAdmin/admin" : "/memberDashboard/MemberDashboard";
    return res.redirect(redirectUrl);
    
  } catch (error) {
    console.error("Verify token error:", error);
    return res.redirect("/login?error=Terjadi kesalahan server");
  }
}