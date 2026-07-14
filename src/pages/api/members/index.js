// pages/api/members/index.js
//
// =============================================
// ALUR EKSEKUSI API MEMBERS (index.js)
// =============================================
//
// API ini menangani dua operasi utama untuk manajemen member:
//
// --- GET /api/members ---
// 1. Membaca query param `role` dari URL (opsional).
// 2. Jika ada filter role → ambil semua user dengan role tersebut dari auth_db.
// 3. Jika tanpa filter → ambil semua user NON-admin dari auth_db,
//    lalu ambil semua user admin secara terpisah.
// 4. Kembalikan data members dan admins dalam satu response JSON.
//
// --- POST /api/members ---
// 1. Terima data dari body request (name, email, password, position, dll).
// 2. Validasi input: pastikan semua field wajib terisi.
// 3. Cek keunikan email di database (auth_db).
// 4. Hash password menggunakan bcrypt (10 salt rounds).
// 5. Simpan user baru ke auth_db.
// 6. Kirim email berisi credential ke email member baru (via mailer).
// 7. Tandai flag credentialEmailSent berdasarkan hasil pengiriman email.
// 8. Kirim notifikasi ke SEMUA admin bahwa ada member baru.
// 9. Kirim notifikasi ke member baru bahwa akunnya telah dibuat.
// 10. Kembalikan response sukses 201.
//
// =============================================
import { prismaAuth as prisma } from "@/lib/prismaAuth";
import { createNotification } from "@/lib/notification";
import bcrypt from "bcryptjs";
import { sendNewMemberCredentialsEmail } from "@/lib/mailer";

export default async function handler(req, res) {
  // ─── CORS ────────────────────────────────────────────────────
  // Atur header CORS agar frontend bisa mengakses API ini dari domain berbeda
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Tangani preflight request (browser otomatis kirim OPTIONS sebelum request utama)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // ─── GET ALL ────────────────────────────────────────────────
  // Mengambil semua data member dari database
  if (req.method === "GET") {
    try {
      // Baca filter role dari query string (opsional)
      const { role } = req.query;
      
      // Inisialisasi array untuk menampung hasil query
      let members = [];
      let admins = [];
      
      if (role) {
        // Jika ada filter role → cari user sesuai role yang diminta
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
            canApprove: true,
            credentialEmailSent: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
        });
      } else {
        // Tanpa filter → ambil semua user yang BUKAN admin
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
            canApprove: true,
            credentialEmailSent: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
        });

        // Ambil data admin secara terpisah
        admins = await prisma.user.findMany({
          where: {
            role: 'admin'
          },
          select: {
            id: true,
            name: true,
            email: true,
            position: true,
            profile: true,
            role: true,
            photo: true,
            canApprove: true,
            credentialEmailSent: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
        });
      }

      console.log(`📋 GET members - role filter: ${role || 'all'}, found: ${members.length}, admins: ${admins.length}`);

      return res.status(200).json({
        success: true,
        members: members,
        admins: admins,
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
  // Membuat member baru
  if (req.method === "POST") {
    try {
      // Langkah 1: Ambil data dari body request
      const { name, email, password, position, profile, role, canApprove } = req.body;

      // Langkah 2: Validasi input — pastikan field wajib terisi
      if (!name || !email || !password || !position) {
        return res.status(400).json({ 
          success: false, 
          message: "Semua field wajib diisi" 
        });
      }

      // Langkah 3: Cek apakah email sudah terdaftar di database
      const existingUser = await prisma.user.findUnique({
        where: { email: email.toLowerCase().trim() },
      });

      if (existingUser) {
        return res.status(400).json({ 
          success: false, 
          message: "Email sudah terdaftar" 
        });
      }

      // Langkah 4: Hash password menggunakan bcrypt (10 salt rounds)
      const hashedPassword = await bcrypt.hash(password, 10);
      const userRole = role ? role.toLowerCase() : 'member';

      // Langkah 5: Simpan user baru ke database auth_db
      const newMember = await prisma.user.create({
        data: {
          name: name.trim(),
          email: email.toLowerCase().trim(),
          password: hashedPassword,
          position: position,
          profile: profile || null,
          role: userRole,
          isVerified: true,
          canApprove: canApprove === true,
        },
      });

      console.log(`✅ Member baru dibuat: ${name} (${email}) dengan role: ${userRole}, position: ${position}`);

      // Langkah 6: Kirim email credential ke member baru (via nodemailer)
      let emailSent = false;
      try {
        await sendNewMemberCredentialsEmail({
          to: newMember.email,
          name: newMember.name,
          email: newMember.email,
          password,
          position,
        });
        emailSent = true;
      } catch (emailError) {
        console.error("Failed to send credentials email:", emailError);
      }

      // Langkah 7: Update flag credentialEmailSent di database
      await prisma.user.update({
        where: { id: newMember.id },
        data: { credentialEmailSent: emailSent },
      });

      // Langkah 8 & 9: Kirim notifikasi ke admin dan member baru
      try {
        // Ambil semua admin untuk dikirim notifikasi
        const admins = await prisma.user.findMany({
          where: { role: { in: ["admin"] } },
          select: { id: true, email: true, role: true, name: true },
        });

        // Kirim notifikasi ke setiap admin tentang member baru
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

        // Kirim notifikasi ke member baru bahwa akunnya telah dibuat
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
