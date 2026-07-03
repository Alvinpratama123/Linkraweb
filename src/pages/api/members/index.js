// pages/api/members/index.js
import { prisma } from "@/lib/prisma";
import { createNotification } from "@/lib/notification";
import bcrypt from "bcryptjs";
import { sendNewMemberCredentialsEmail } from "@/lib/mailer";

export default async function handler(req, res) {
  // ─── CORS ────────────────────────────────────────────────────
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // ─── GET ALL ────────────────────────────────────────────────
  if (req.method === "GET") {
    try {
      const { role } = req.query;
      
      let members = [];
      
      if (role) {
        const roleLower = role.toLowerCase();
        console.log(`🔍 Filtering members by role: ${role} (lowercase: ${roleLower})`);
        
        members = await prisma.user.findMany({
          where: {
            role: roleLower,
          },
          select: {
            id: true,
            name: true,
            email: true,
            position: true,
            profile: true,
            role: true,
            photo: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
        });
      } else {
        console.log(`📋 Fetching all members`);
        members = await prisma.user.findMany({
          where: {
            role: {
              not: 'admin'
            }
          },
          select: {
            id: true,
            name: true,
            email: true,
            position: true,
            profile: true,
            role: true,
            photo: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
        });
      }

      console.log(`📋 GET members - role filter: ${role || 'all'}, found: ${members.length}`);

      return res.status(200).json({
        success: true,
        members: members,
      });
    } catch (error) {
      console.error("GET members error:", error);
      return res.status(500).json({ 
        success: false, 
        message: "Server Error",
        detail: error.message 
      });
    }
  }
  
  // ─── POST ────────────────────────────────────────────────────
  if (req.method === "POST") {
    try {
      const { name, email, password, position, profile, role } = req.body;

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
      const userRole = role ? role.toLowerCase() : 'member';

      const newMember = await prisma.user.create({
        data: {
          name: name.trim(),
          email: email.toLowerCase().trim(),
          password: hashedPassword,
          position: position,
          profile: profile || null,
          role: userRole,
          isVerified: true,
        },
      });

      console.log(`✅ Member baru dibuat: ${name} (${email}) dengan role: ${userRole}, position: ${position}`);

      try {
        await sendNewMemberCredentialsEmail({
          to: newMember.email,
          name: newMember.name,
          email: newMember.email,
          password,
          position,
        });
      } catch (emailError) {
        console.error("Failed to send credentials email:", emailError);
      }

      try {
        const admins = await prisma.user.findMany({
          where: { role: { in: ["admin"] } },
          select: { id: true, email: true, role: true, name: true },
        });

        for (const admin of admins) {
          await createNotification({
            userId: admin.id,
            title: `👤 Member Baru: ${newMember.name}`,
            message: `Member "${newMember.name}" telah ditambahkan dengan posisi ${position} dan role ${userRole.toUpperCase()}.`,
            type: "member",
            link: "/dashboardAdmin/admin?tab=members",
            icon: "👤",
            color: "purple",
          });
        }

        await createNotification({
          userId: newMember.id,
          title: `👤 Akun Anda Telah Dibuat`,
          message: `Akun Anda berhasil dibuat sebagai member dengan posisi ${position}. Silakan cek email untuk informasi login.`,
          type: "member",
          link: "/memberDashboard/MemberDashboard",
          icon: "👤",
          color: "purple",
        });
      } catch (notificationError) {
        console.error("Failed to create member notifications:", notificationError);
      }

      return res.status(201).json({
        success: true,
        message: `Member berhasil ditambahkan dengan posisi: ${position}`,
        member: newMember,
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