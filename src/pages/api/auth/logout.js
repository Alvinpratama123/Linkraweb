// pages/api/auth/logout.js - Versi Bersih Tanpa Warning
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
    // Ambil token dari cookie
    let token = req.cookies.auth_token;
    
    // Jika token terenkripsi, dekripsi dulu
    if (token && token.startsWith('U2FsdGVkX1')) {
      token = decryptToken(token);
    }

    console.log(`User logged out successfully`);

    // Hapus semua cookie yang terkait dengan autentikasi
    const cookieOptions = [
      // Hapus auth_token
      `auth_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax; ${
        process.env.NODE_ENV === "production" ? "Secure; " : ""
      }`,
      // Hapus dengan domain localhost
      `auth_token=; HttpOnly; Path=/; Domain=localhost; Max-Age=0; SameSite=Lax; ${
        process.env.NODE_ENV === "production" ? "Secure; " : ""
      }`,
      // Hapus refresh_token
      `refresh_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax; ${
        process.env.NODE_ENV === "production" ? "Secure; " : ""
      }`,
      // Hapus encrypted_token
      `encrypted_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax; ${
        process.env.NODE_ENV === "production" ? "Secure; " : ""
      }`,
      // Hapus token
      `token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax; ${
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
    const fallbackCookies = [
      `auth_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax;`,
      `refresh_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax;`,
      `encrypted_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax;`,
      `token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax;`,
    ];
    
    res.setHeader("Set-Cookie", fallbackCookies);
    
    return res.status(200).json({ 
      success: true, 
      message: "Logout berhasil" 
    });
  }
}