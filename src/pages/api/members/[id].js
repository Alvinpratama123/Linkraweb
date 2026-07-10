// pages/api/members/[id].js
import { prismaAuth as prisma } from "@/lib/prismaAuth";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "ID member wajib diisi",
    });
  }

  const token = req.cookies.auth_token;
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "❌ Token tidak ditemukan.",
    });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "❌ Token tidak valid.",
    });
  }

  const userRole = decoded.role || 'USER';
  const isAdmin = userRole.toLowerCase() === 'admin';

  if (!isAdmin) {
    return res.status(403).json({
      success: false,
      message: "❌ Hanya admin yang bisa menghapus member.",
    });
  }

  if (req.method === "DELETE") {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Member tidak ditemukan",
        });
      }

      await prisma.user.delete({
        where: { id },
      });

      return res.status(200).json({
        success: true,
        message: "Member berhasil dihapus",
      });
    } catch (error) {
      console.error("DELETE member error:", error);
      return res.status(500).json({
        success: false,
        message: "Gagal menghapus member",
      });
    }
  }

  return res.status(405).json({
    success: false,
    message: "Method not allowed",
  });
}