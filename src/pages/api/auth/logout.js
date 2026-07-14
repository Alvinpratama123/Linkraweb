// =====================================================================
// ENDPOINT: POST /api/auth/logout
// Deskripsi  : Melakukan logout dengan menghapus semua cookie
//              autentikasi yang terkait dengan sesi user.
// =====================================================================
// Alur Eksekusi:
//   1. Membaca cookie `auth_token` dari request
//   2. Jika token terenkripsi (AES), mendekripsi terlebih dahulu
//   3. Mengatur semua cookie terkait autentikasi ke Max-Age=0
//      (cara standar menghapus cookie di HTTP)
//   4. Mengirimkan response sukses
//
// Catatan   : Tidak ada database yang diakses — logout murni
//             penghapusan cookie di sisi server.
// Method    : POST
// Cookie    : auth_token, refresh_token, encrypted_token, token
// =====================================================================

import CryptoJS from "crypto-js";

// Secret key untuk dekripsi AES (sama dengan yang digunakan di frontend)
const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "lintas-wahana-secret-key-2026";

// Fungsi helper: mendekripsi token yang dienkripsi dengan AES
const decryptToken = (encryptedToken) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedToken, ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    return null;
  }
};

export default async function handler(req, res) {
  // Hanya menerima metode POST
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    // Langkah 1: Ambil token JWT dari cookie
    let token = req.cookies.auth_token;
    
    // Langkah 2: Jika token dienkripsi dengan AES (diawali prefix CryptoJS), dekripsi dulu
    // Prefix 'U2FsdGVkX1' adalah tanda token terenkripsi CryptoJS
    if (token && token.startsWith('U2FsdGVkX1')) {
      token = decryptToken(token);
    }

    console.log(`User logged out successfully`);

    // Langkah 3: Hapus SEMUA cookie terkait autentikasi dengan Max-Age=0
    // Max-Age=0 memberitahu browser untuk segera menghapus cookie
    // Beberapa variasi ditulis untuk mengakomodasi domain dan environment berbeda
    const cookieOptions = [
      // Hapus auth_token (HttpOnly agar tidak diakses JS frontend)
      `auth_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax; ${
        process.env.NODE_ENV === "production" ? "Secure; " : ""
      }`,
      // Hapus auth_token dengan domain localhost (edge case)
      `auth_token=; HttpOnly; Path=/; Domain=localhost; Max-Age=0; SameSite=Lax; ${
        process.env.NODE_ENV === "production" ? "Secure; " : ""
      }`,
      // Hapus refresh_token jika ada
      `refresh_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax; ${
        process.env.NODE_ENV === "production" ? "Secure; " : ""
      }`,
      // Hapus encrypted_token jika ada
      `encrypted_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax; ${
        process.env.NODE_ENV === "production" ? "Secure; " : ""
      }`,
      // Hapus cookie generic 'token' jika ada
      `token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax; ${
        process.env.NODE_ENV === "production" ? "Secure; " : ""
      }`,
    ];

    // Kirim header Set-Cookie untuk menghapus semua cookie di browser
    res.setHeader("Set-Cookie", cookieOptions);

    // Langkah 4: Kirim response sukses ke client
    return res.status(200).json({ 
      success: true, 
      message: "Logout berhasil",
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Logout error:", error);
    
    // Fallback: tetap hapus cookie meskipun terjadi error tak terduga
    // Ini memastikan user tetap bisa logout meskipun ada masalah
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