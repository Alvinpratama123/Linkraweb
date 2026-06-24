// pages/api/auth/verify-register.js
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ✅ PASTIKAN ADA export default
export default async function handler(req, res) {
  // Hanya menerima POST
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    const { name, email, role, password, otp } = req.body;

    console.log("=== VERIFY REGISTER ===");
    console.log("📝 Verify:", { name, email, role, otp });

    // Validasi input
    if (!name || !email || !role || !password || !otp) {
      return res.status(400).json({
        success: false,
        message: "Data tidak lengkap. Semua field harus diisi.",
      });
    }

    // Validasi email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Format email tidak valid",
      });
    }

    // Validasi role
    const validRoles = ["admin", "member", "user", "frontend", "backend", "uiux", "qa", "pm", "devops", "fullstack"];
    if (!validRoles.includes(role.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: "Role tidak valid",
      });
    }

    // Validasi password
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password minimal 8 karakter",
      });
    }

    const emailLower = email.toLowerCase().trim();
    const otpCode = otp.trim().toUpperCase();

    console.log(`🔍 Mencari OTP untuk email: ${emailLower}`);
    console.log(`🔑 Kode OTP input: ${otpCode}`);

    // Cari OTP yang valid
    const otpData = await prisma.registerOtp.findFirst({
      where: {
        email: emailLower,
        used: false,
        expiresAt: {
          gt: new Date()
        }
      },
    });

    console.log("OTP found in DB:", otpData ? otpData.code : "NOT FOUND");
    console.log("OTP expires at:", otpData?.expiresAt);
    console.log("Current time:", new Date());

    // Jika OTP tidak ditemukan
    if (!otpData) {
      // Cek apakah ada OTP yang expired
      const expiredOtp = await prisma.registerOtp.findFirst({
        where: {
          email: emailLower,
          used: false,
          expiresAt: {
            lt: new Date()
          }
        }
      });

      if (expiredOtp) {
        return res.status(400).json({
          success: false,
          message: "OTP sudah kadaluarsa. Silakan minta OTP baru.",
        });
      }

      // Cek apakah OTP sudah digunakan
      const usedOtp = await prisma.registerOtp.findFirst({
        where: {
          email: emailLower,
          used: true
        }
      });

      if (usedOtp) {
        return res.status(400).json({
          success: false,
          message: "OTP sudah digunakan. Silakan registrasi ulang.",
        });
      }

      return res.status(400).json({
        success: false,
        message: "Kode OTP tidak valid. Silakan coba lagi.",
      });
    }

    // Verifikasi OTP (case insensitive, toleransi 0/O)
    const isValid = 
      otpData.code === otpCode ||
      otpData.code === otpCode.replace(/0/g, "O") ||
      otpData.code === otpCode.replace(/O/g, "0");

    console.log(`OTP valid: ${isValid}`);
    console.log(`OTP in DB: ${otpData.code}, OTP input: ${otpCode}`);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Kode OTP salah. Silakan coba lagi.",
      });
    }

    // Cek apakah user sudah ada
    const existingUser = await prisma.user.findUnique({
      where: { email: emailLower },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email sudah terdaftar",
      });
    }

    // Hash password
    console.log("🔐 Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10);

    // Map role ke position
    const roleMap = {
      'frontend': 'Frontend',
      'backend': 'Backend',
      'fullstack': 'Fullstack',
      'uiux': 'UI/UX',
      'devops': 'DevOps',
      'qa': 'QA',
      'pm': 'PM',
      'admin': 'Administrator',
      'member': 'Member',
      'user': 'User'
    };

    const position = roleMap[role.toLowerCase()] || role;

    // Buat user baru
    console.log("👤 Creating user...");
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: emailLower,
        role: role.toLowerCase().trim(),
        password: hashedPassword,
        position: position,
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        position: true,
      },
    });

    console.log(`✅ User created: ${user.email} dengan posisi: ${position}`);

    // Update OTP menjadi used
    await prisma.registerOtp.update({
      where: { id: otpData.id },
      data: { used: true },
    });

    console.log(`✅ OTP marked as used`);

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET || "your-secret-key-change-in-production";
    console.log("🔑 Generating JWT token...");
    
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        position: user.position,
        name: user.name,
      },
      jwtSecret,
      { expiresIn: "7d" }
    );

    // Redirect berdasarkan role
    const redirectMap = {
      admin: "/dashboardAdmin/admin",
      member: "/memberDashboard/MemberDashboard",
      frontend: "/memberDashboard/MemberDashboard",
      backend: "/memberDashboard/MemberDashboard",
      uiux: "/memberDashboard/MemberDashboard",
      qa: "/memberDashboard/MemberDashboard",
      pm: "/memberDashboard/MemberDashboard",
      user: "/memberDashboard/MemberDashboard",
    };

    const redirectPath = redirectMap[user.role] || "/memberDashboard/MemberDashboard";

    console.log(`✅ Redirect to: ${redirectPath}`);

    // Set cookie
    res.setHeader(
      "Set-Cookie",
      `auth_token=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Lax${
        process.env.NODE_ENV === "production" ? "; Secure" : ""
      }`
    );

    return res.status(200).json({
      success: true,
      message: "Verifikasi berhasil. Akun berhasil dibuat.",
      user: user,
      redirect: redirectPath,
    });

  } catch (error) {
    console.error("❌ VERIFY REGISTER ERROR:", error);
    console.error("Error stack:", error.stack);
    
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server: " + error.message,
    });
  }
}