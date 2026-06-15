import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";

function getRandomPassword(length = 10) {
  return crypto.randomBytes(length).toString("base64url").slice(0, length);
}

function generateEmail(name) {
  const slug = name.toLowerCase().replace(/[^a-z0-9]/g, ".");
  return `${slug}@mail.com`;
}

async function verifyAdmin(req, res) {
  const token = req.cookies.auth_token;
  if (!token) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return null;
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      res.status(403).json({ success: false, message: "Forbidden" });
      return null;
    }
    return decoded;
  } catch {
    res.status(401).json({ success: false, message: "Invalid token" });
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    const admin = await verifyAdmin(req, res);
    if (!admin) return;

    try {
      const members = await prisma.member.findMany({
        include: {
          user: {
            select: { id: true, email: true, name: true, photo: true, role: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });
      //member berhasil diambil
      return res.status(200).json({
        success: true,
        members: members,
      });
    } catch (error) {
      console.error("GET members error:", error);
      return res.status(500).json({ success: false, message: "Server Error" });
    }
  }

  if (req.method === "POST") {
    const admin = await verifyAdmin(req, res);
    if (!admin) return;

    try {
      const { name, position } = req.body;

      if (!name || !position) {
        return res.status(400).json({ success: false, message: "Nama dan posisi wajib diisi" });
      }

      const email = generateEmail(name);
      const rawPassword = getRandomPassword();
      const hashedPassword = await bcrypt.hash(rawPassword, 10);

      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: position,
          member: {
            create: {
              position,
            },
          },
        },
        include: {
          member: true,
        },
      });

      return res.status(201).json({
        success: true,
        message: "Member berhasil ditambahkan",
        member: {
          id: user.member.id,
          userId: user.id,
          name: user.name,
          email: user.email,
          position: user.member.position,
          role: user.role,
        },
        credentials: {
          email: user.email,
          password: rawPassword,
        },
      });
    } catch (error) {
      console.error("POST members error:", error);
      return res.status(500).json({ success: false, message: "Server Error" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
