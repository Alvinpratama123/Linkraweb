import { prisma } from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const projects = await prisma.project.findMany({
      include: { attachments: true },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({ success: true, projects });
  } catch (error) {
    console.error("Get projects error:", error);
    return res.status(500).json({ message: "Server Error", detail: error.message });
  }
}