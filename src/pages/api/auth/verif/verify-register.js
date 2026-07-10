import { prismaAuth as prisma } from "@/lib/prismaAuth";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    const { name, email, role, password, otp } = req.body;

    console.log("=== VERIFY REGISTER ===");
    console.log("Email:", email);
    console.log("OTP received:", otp);

    
    // Validasi input
    if (!name || !email || !role || !password || !otp) {
      return res.status(400).json({
        success: false,
        message: "Data tidak lengkap. Semua field harus diisi.",
      });
    }

    // Validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Format email tidak valid",
      });
    }

    // Validasi role
    const validRoles = ["admin", "member", "user", "frontend", "backend", "uiux", "qa", "pm"];
    if (!validRoles.includes(role.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: "Role tidak valid",
      });
    }

    // Validasi password minimal 8 karakter
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password minimal 8 karakter",
      });
    }

    const emailLower = email.toLowerCase().trim();
    const otpTrimmed = otp.toUpperCase().trim();

    // Gunakan transaction untuk atomic operation
    const result = await prisma.$transaction(async (tx) => {
      // Cari OTP dengan validasi ketat
      const otpData = await tx.registerOtp.findFirst({
        where: {
          email: emailLower,
          code: otpTrimmed,
          used: false,
          expiresAt: {
            gt: new Date(),
          },
        },
      });

      console.log("OTP found in DB:", otpData ? otpData.code : "NOT FOUND");

      // Jika OTP tidak ditemukan
      if (!otpData) {
        // Cek apakah ada OTP untuk email ini (untuk debug)
        const existingOtp = await tx.registerOtp.findFirst({
          where: {
            email: emailLower,
            used: false,
          },
        });
        
        console.log("Existing OTP for this email:", existingOtp?.code || "NONE");
        
        throw new Error("Kode OTP salah atau sudah digunakan");
      }

      // Cek email sudah ada
      const existingUser = await tx.user.findUnique({
        where: {
          email: emailLower,
        },
      });

      if (existingUser) {
        throw new Error("Email sudah terdaftar");
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Buat user
      const user = await tx.user.create({
        data: {
          name: name.trim(),
          email: emailLower,
          role: role.toLowerCase().trim(),
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      });

      // Tandai OTP sudah dipakai
      await tx.registerOtp.update({
        where: {
          id: otpData.id,
        },
        data: {
          used: true,
        },
      });

      return user;
    });

    // Generate JWT Token
    const token = jwt.sign(
      {
        userId: result.id,
        email: result.email,
        role: result.role,
        name: result.name,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // Set cookie
    res.setHeader(
      "Set-Cookie",
      `auth_token=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Lax${
        process.env.NODE_ENV === "production" ? "; Secure" : ""
      }`
    );

    // Tentukan redirect berdasarkan role
    const redirectMap = {
      admin: "/dashboardAdmin/admin",
      member: "/memberDashboard/MemberDashboard",
      frontend: "/memberDashboard/MemberDashboard",
      backend: "/memberDashboard/MemberDashboard",
      uiux: "/memberDashboard/MemberDashboard",
      qa: "/memberDashboard/MemberDashboard",
      pm: "/memberDashboard/MemberDashboard",
      user: "/dashboard/user",
    };

    return res.status(200).json({
      success: true,
      message: "Verifikasi berhasil. Akun berhasil dibuat.",
      user: result,
      redirect: redirectMap[result.role] || "/memberDashboard/MemberDashboard",
    });

  } catch (error) {
    console.error("VERIFY REGISTER ERROR:", error);

    // Handle error spesifik
    if (error.message.includes("OTP") || error.message.includes("Kode OTP")) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    if (error.message.includes("Email sudah terdaftar")) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    // Prisma error handling
    if (error.code === "P2002") {
      return res.status(400).json({
        success: false,
        message: "Email atau data lain sudah terdaftar",
      });
    }

    // Generic error
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server. Silakan coba lagi nanti.",
    });
  }
}