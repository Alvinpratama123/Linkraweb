// pages/api/members/resend-email/[id].js
//
// =============================================
// ALUR EKSEKUSI API RESEND CREDENTIAL EMAIL
// =============================================
//
// API ini mengirim ulang email berisi informasi credential
// kepada member yang sudah terdaftar.
//
// --- POST /api/members/resend-email/[id] ---
// 1. Hanya menerima method POST (tolak selain POST → 405).
// 2. Baca parameter `id` dari URL path.
// 3. Cari member berdasarkan ID di auth_db.
// 4. Jika tidak ditemukan → kembalikan 404.
// 5. Kirim ulang email credential ke member (via mailer/nodemailer).
//    Password ditampilkan sebagai placeholder karena password asli
//    di-hash dan tidak bisa dibaca.
// 6. Jika email berhasil dikirim → update flag credentialEmailSent = true.
// 7. Kembalikan response sukses atau gagal.
//
// =============================================
import { prismaAuth as prisma } from "@/lib/prismaAuth";
import { sendNewMemberCredentialsEmail } from "@/lib/mailer";

export default async function handler(req, res) {
  // Hanya izinkan method POST
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Langkah 2: Ambil parameter ID dari URL
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "ID member diperlukan",
    });
  }

  try {
    // Langkah 3: Cari member berdasarkan ID di auth_db
    const member = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        position: true,
      },
    });

    // Langkah 4: Jika member tidak ditemukan
    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member tidak ditemukan",
      });
    }

    // Langkah 5: Kirim ulang email credential ke member
    let emailResult;
    try {
      emailResult = await sendNewMemberCredentialsEmail({
        to: member.email,
        name: member.name,
        email: member.email,
        // Password asli tidak disimpan — tampilkan placeholder
        password: "Hubungi admin untuk reset password",
        position: member.position || "-",
      });
    } catch (mailError) {
      console.error("Mail error:", mailError);
      return res.status(500).json({
        success: false,
        message: "Gagal mengirim email",
      });
    }

    // Langkah 6: Jika email berhasil → update flag credentialEmailSent
    if (emailResult.success) {
      await prisma.user.update({
        where: { id },
        data: { credentialEmailSent: true },
      });
    }

    // Langkah 7: Kembalikan response
    return res.status(200).json({
      success: emailResult.success,
      message: emailResult.success
        ? "Email credential berhasil dikirim ulang"
        : "Gagal mengirim email",
    });
  } catch (error) {
    console.error("Resend email error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}
