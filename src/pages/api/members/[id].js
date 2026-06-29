// pages/api/members/[id].js
import { prisma } from "@/lib/prisma";

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "ID member diperlukan"
    });
  }

  // ─── GET DETAIL ─────────────────────────────────────────────
  if (req.method === "GET") {
    try {
      const member = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
          position: true,
          profile: true,
          role: true,
          createdAt: true,
        },
      });

      if (!member) {
        return res.status(404).json({
          success: false,
          message: "Member tidak ditemukan"
        });
      }

      return res.status(200).json({
        success: true,
        member: member,
      });
    } catch (error) {
      console.error("GET member detail error:", error);
      return res.status(500).json({ 
        success: false, 
        message: "Server Error" 
      });
    }
  }

  // ─── PATCH ───────────────────────────────────────────────────
  if (req.method === "PATCH") {
    try {
      const { name, position, profile, role } = req.body;

      const existingMember = await prisma.user.findUnique({
        where: { id },
      });

      if (!existingMember) {
        return res.status(404).json({
          success: false,
          message: "Member tidak ditemukan"
        });
      }

      const updatedMember = await prisma.user.update({
        where: { id },
        data: {
          name: name || existingMember.name,
          position: position || existingMember.position,
          profile: profile !== undefined ? profile : existingMember.profile,
          role: role || existingMember.role,
        },
      });

      return res.status(200).json({
        success: true,
        message: "Member berhasil diupdate",
        member: updatedMember,
      });
    } catch (error) {
      console.error("PATCH member error:", error);
      return res.status(500).json({ 
        success: false, 
        message: "Server Error" 
      });
    }
  }

  // ─── DELETE ──────────────────────────────────────────────────
  if (req.method === "DELETE") {
    try {
      const existingMember = await prisma.user.findUnique({
        where: { id },
      });

      if (!existingMember) {
        return res.status(404).json({
          success: false,
          message: "Member tidak ditemukan"
        });
      }

      if (existingMember.role === "admin") {
        return res.status(403).json({
          success: false,
          message: "Tidak dapat menghapus admin"
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
        message: "Server Error" 
      });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}