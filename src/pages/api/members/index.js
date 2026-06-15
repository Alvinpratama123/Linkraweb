import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
// import { sendWelcomeEmail } from "@/lib/email"; // Comment dulu jika email belum siap

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const members = await prisma.user.findMany({
        where: {
          role: "MEMBER",
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
      });
      
      return res.status(200).json({
        success: true,
        members: members,
      });
    } catch (error) {
      console.error("GET members error:", error);
      return res.status(500).json({ 
        success: false, 
        message: "Server Error" 
      });
    }
  }
  
  if (req.method === "POST") {
    try {
      const { name, email, password, position, profile } = req.body;
      
      // Validasi input
      if (!name || !email || !password || !position) {
        return res.status(400).json({ 
          success: false, 
          message: "Semua field wajib diisi" 
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
          name,
          email,
          password: hashedPassword,
          position,
          profile: profile || null,
          role: "MEMBER",
        },
      });
      
      // Kirim email notifikasi (opsional - comment dulu jika error)
      /*
      try {
        await sendWelcomeEmail({ 
          to: email, 
          name: name, 
          email: email, 
          password: password 
        });
      } catch (emailError) {
        console.error("Email send error:", emailError);
        // Email gagal dikirim tapi user tetap terdaftar
      }
      */
      
      return res.status(201).json({
        success: true,
        message: "Member berhasil ditambahkan",
        member: {
          id: newMember.id,
          name: newMember.name,
          email: newMember.email,
          position: newMember.position,
          profile: newMember.profile,
        },
      });
    } catch (error) {
      console.error("POST member error:", error);
      return res.status(500).json({ 
        success: false, 
        message: "Server Error" 
      });
    }
  }
  
  return res.status(405).json({ message: "Method not allowed" });
}