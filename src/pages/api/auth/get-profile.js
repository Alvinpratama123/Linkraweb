// pages/api/auth/get-profile.js
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ 
      success: false, 
      message: "Method not allowed" 
    });
  }

  try {
    const token = req.cookies.auth_token;

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: "Unauthorized" 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        photo: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    return res.status(200).json({
      success: true,
      user: user,
    });

  } catch (error) {
    console.error("Get profile error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Terjadi kesalahan server" 
    });
  }
}