import { prisma } from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const projects = await prisma.project.findMany({
        include: {
          attachments: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      
      return res.status(200).json({
        success: true,
        projects: projects,
      });
    } catch (error) {
      console.error("GET projects error:", error);
      return res.status(500).json({ 
        success: false, 
        message: "Server Error",
        detail: error.message 
      });
    }
  }
  //selesai
  return res.status(405).json({ message: "Method not allowed" });
}