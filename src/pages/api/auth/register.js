import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { sendRegisterOtpEmail } from "@/lib/mailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      message: "Method not allowed",
    });
  }

  try {
    const { name, email, role, password } = req.body;

    const userExist = await prisma.user.findUnique({
      where: { email },
    });

    if (userExist) {
      return res.status(400).json({
        message: "Email sudah terdaftar",
      });
    }

    // OTP huruf
    const otp = crypto
      .randomBytes(4)
      .toString("hex")
      .substring(0, 6)
      .toUpperCase();

    await prisma.registerOtp.deleteMany({
      where: {
        email,
        used: false,
      },
    });

    await prisma.registerOtp.create({
      data: {
        email,
        code: otp,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      },
    });

    await sendRegisterOtpEmail({
      to: email,
      name,
      code: otp,
    });

    return res.status(200).json({
      success: true,
      message: "OTP dikirim",
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Server Error",
    });
  }
}