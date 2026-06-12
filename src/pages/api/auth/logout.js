// pages/api/auth/logout.js
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import CryptoJS from "crypto-js";

// Secret key untuk enkripsi (sama dengan yang di frontend)
const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "lintas-wahana-secret-key-2026";

// Fungsi untuk mendekripsi token jika perlu
const decryptToken = (encryptedToken) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedToken, ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    return null;
  }
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    // Ambil token dari cookie (bisa dalam bentuk terenkripsi atau tidak)
    let token = req.cookies.auth_token;
    
    // Jika token terenkripsi, dekripsi dulu
    if (token && token.startsWith('U2FsdGVkX1')) {
      token = decryptToken(token);
    }

    // Jika token valid, blacklist token di database (opsional untuk keamanan)
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if (decoded && decoded.userId) {
          // Simpan token ke blacklist (opsional)
          // await prisma.blacklistedToken.create({
          //   data: {
          //     token: token,
          //     userId: decoded.userId,
          //     expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 hari
          //   }
          // });
          
          // Hapus semua loginToken yang sudah digunakan milik user ini
          await prisma.loginToken.deleteMany({
            where: {
              userId: decoded.userId,
              used: true
            }
          });
          
          console.log(`User ${decoded.userId} logged out successfully`);
        }
      } catch (jwtError) {
        console.error("Invalid token during logout:", jwtError);
      }
    }

    // Hapus cookie dengan multiple cara untuk memastikan hilang
    const cookieOptions = [
      // Hapus auth_token
      `auth_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax; ${
        process.env.NODE_ENV === "production" ? "Secure; " : ""
      }`,
      // Hapus dengan domain localhost
      `auth_token=; HttpOnly; Path=/; Domain=localhost; Max-Age=0; SameSite=Lax; ${
        process.env.NODE_ENV === "production" ? "Secure; " : ""
      }`,
      // Hapus dengan domain .localhost
      `auth_token=; HttpOnly; Path=/; Domain=.localhost; Max-Age=0; SameSite=Lax; ${
        process.env.NODE_ENV === "production" ? "Secure; " : ""
      }`,
      // Hapus refresh_token
      `refresh_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax; ${
        process.env.NODE_ENV === "production" ? "Secure; " : ""
      }`,
      // Hapus encrypted_token jika ada
      `encrypted_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax; ${
        process.env.NODE_ENV === "production" ? "Secure; " : ""
      }`,
    ];

    res.setHeader("Set-Cookie", cookieOptions);

    // Kirim response sukses
    return res.status(200).json({ 
      success: true, 
      message: "Logout berhasil",
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Logout error:", error);
    
    // Tetap hapus cookie meskipun ada error
    res.setHeader("Set-Cookie", [
      `auth_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax;`,
      `refresh_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax;`,
    ]);
    
    return res.status(500).json({ 
      success: false, 
      message: "Terjadi kesalahan saat logout" 
    });
  }
}