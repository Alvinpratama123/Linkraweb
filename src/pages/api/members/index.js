// pages/api/members.js
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  // GET - Ambil semua user kecuali admin
  if (req.method === "GET") {
    const admin = await verifyAdmin(req, res);
    if (!admin) return;

    try {
      // 🔥 AMBIL SEMUA USER KECUALI ADMIN
      const members = await prisma.user.findMany({
        where: {
          role: {
            not: "admin" // Ambil semua user kecuali admin
          }
        },
        select: {
          id: true,
          name: true,
          email: true,
          position: true,
          profile: true,
          role: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        orderBy: { createdAt: "desc" },
      });

      // 🔥 Format response: jika position null, gunakan role sebagai fallback
      const formattedMembers = members.map(member => ({
        ...member,
        position: member.position || member.role || "Member"
      }));
      
      console.log(`✅ Found ${formattedMembers.length} members`);
      
      return res.status(200).json({
        success: true,
        members: formattedMembers,
      });
    } catch (error) {
      console.error("GET members error:", error);
      return res.status(500).json({ 
        success: false, 
        message: "Server Error: " + error.message
      });
    }
  }
  
  // POST - Tambah member baru
  if (req.method === "POST") {
    const admin = await verifyAdmin(req, res);
    if (!admin) return;

    try {
      const { name, position } = req.body;

      if (!name || !position) {
        return res.status(400).json({ success: false, message: "Nama dan posisi wajib diisi" });
      }
      
      // Validasi email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: "Format email tidak valid"
        });
      }
      
      // Validasi password
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Password minimal 6 karakter"
        });
      }
      
      // Cek apakah email sudah terdaftar
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });
      
      if (existingUser) {
        return res.status(400).json({ 
          success: false, 
          message: "Email sudah terdaftar" 
        });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Buat user baru dengan role MEMBER
      const newMember = await prisma.user.create({
        data: {
          name: name.trim(),
          email: email.toLowerCase().trim(),
          password: hashedPassword,
          position: position,
          profile: profile || null,
          role: "member", // lowercase konsisten
          isVerified: true,
        },
      });
      
      console.log(`✅ Member created: ${newMember.email} with position: ${position}`);
      
      return res.status(201).json({
        success: true,
        message: `Member berhasil ditambahkan dengan posisi: ${position}`,
        member: {
          id: newMember.id,
          name: newMember.name,
          email: newMember.email,
          position: newMember.position,
          role: newMember.role,
          profile: newMember.profile,
        },
      });
    } catch (error) {
      console.error("POST member error:", error);
      return res.status(500).json({ 
        success: false, 
        message: "Server Error: " + error.message
      });
    }
  }
  
  // DELETE - Hapus member
  if (req.method === "DELETE") {
    try {
      const { id } = req.query;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: "ID member diperlukan"
        });
      }
      
      // Cek apakah user ada
      const user = await prisma.user.findUnique({
        where: { id },
      });
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Member tidak ditemukan"
        });
      }
      
      // Jangan izinkan menghapus admin
      if (user.role === "admin") {
        return res.status(403).json({
          success: false,
          message: "Tidak dapat menghapus admin"
        });
      }
      
      await prisma.user.delete({
        where: { id },
      });
      
      console.log(`✅ Member deleted: ${id}`);
      
      return res.status(200).json({
        success: true,
        message: "Member berhasil dihapus",
      });
    } catch (error) {
      console.error("DELETE member error:", error);
      return res.status(500).json({ 
        success: false, 
        message: "Server Error: " + error.message
      });
    }
  }
  
  return res.status(405).json({ 
    success: false,
    message: "Method not allowed" 
  });
}
