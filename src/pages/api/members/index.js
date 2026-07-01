// pages/api/members/index.js
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { sendMemberCredentialsEmail } from "@/lib/mailer";

export default async function handler(req, res) {
  // ─── GET ALL ────────────────────────────────────────────────
  if (req.method === "GET") {
    try {
      const members = await prisma.user.findMany({
        where: { role: { not: "admin" } },
        select: {
          id: true,
          name: true,
          email: true,
          position: true,
          profile: true,
          role: true,
          credentialEmailSent: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
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
  
  // ─── POST ────────────────────────────────────────────────────
  if (req.method === "POST") {
    try {
      const { name, email, password, position, profile } = req.body;

      if (!name || !email || !password || !position) {
        return res.status(400).json({ 
          success: false, 
          message: "Semua field wajib diisi" 
        });
      }

      const existingUser = await prisma.user.findUnique({
        where: { email: email.toLowerCase().trim() },
      });

      if (existingUser) {
        return res.status(400).json({ 
          success: false, 
          message: "Email sudah terdaftar" 
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newMember = await prisma.user.create({
        data: {
          name: name.trim(),
          email: email.toLowerCase().trim(),
          password: hashedPassword,
          position: position,
          profile: profile || null,
          role: "member",
          isVerified: true,
        },
      });

      let emailStatus = { sent: false };
      try {
        const emailResult = await sendMemberCredentialsEmail({
          to: newMember.email,
          name: newMember.name,
          email: newMember.email,
          password: password,
        });

        emailStatus.sent = emailResult.success;

        await prisma.user.update({
          where: { id: newMember.id },
          data: { credentialEmailSent: emailResult.success },
        });
      } catch (emailError) {
        console.error("Gagal kirim email credential:", emailError);
        emailStatus.error = emailError.message;
      }

      return res.status(201).json({
        success: true,
        message: `Member berhasil ditambahkan dengan posisi: ${position}`,
        member: newMember,
        email: emailStatus,
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
