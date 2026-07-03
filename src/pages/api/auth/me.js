// pages/api/auth/me.js
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const token = req.cookies.auth_token;
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: "Token tidak ditemukan" 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        position: true,
        profile: true,
        photo: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User tidak ditemukan" 
      });
    }

    console.log(`🔑 User authenticated: ${user.email} - role: ${user.role}`);

    return res.status(200).json({
      success: true,
      user: user,
    });
  } catch (error) {
    console.error("Auth me error:", error);
    return res.status(401).json({ 
      success: false, 
      message: "Token tidak valid" 
    });
  }
}