import { prismaAuth as prisma } from "@/lib/prismaAuth";
import { sendNewMemberCredentialsEmail } from "@/lib/mailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "ID member diperlukan",
    });
  }

  try {
    const member = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
<<<<<<< HEAD
        password: true,
=======
>>>>>>> 5983e0321aa9d7c1a60ecc5ae2c7d63bc188f5f9
        position: true,
      },
    });

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member tidak ditemukan",
      });
    }

<<<<<<< HEAD
    const emailResult = await sendNewMemberCredentialsEmail({
      to: member.email,
      name: member.name,
      email: member.email,
      password: "[PROTECTED - lihat password saat create]",
      position: member.position,
    });
=======
    let emailResult;
    try {
      emailResult = await sendNewMemberCredentialsEmail({
        to: member.email,
        name: member.name,
        email: member.email,
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
>>>>>>> 5983e0321aa9d7c1a60ecc5ae2c7d63bc188f5f9

    if (emailResult.success) {
      await prisma.user.update({
        where: { id },
        data: { credentialEmailSent: true },
      });
    }

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
