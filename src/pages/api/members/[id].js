import { prisma } from "@/lib/prisma";

export default async function handler(req, res) {
  const { id } = req.query;
  const memberId = parseInt(id);
  
  if (isNaN(memberId)) {
    return res.status(400).json({ 
      success: false, 
      message: "Invalid member ID" 
    });
  }
  
  if (req.method === "DELETE") {
    try {
      // Cek apakah member ada
      const member = await prisma.user.findUnique({
        where: { id: memberId },
      });
      
      if (!member) {
        return res.status(404).json({ 
          success: false, 
          message: "Member not found" 
        });
      }
      
      // Hapus member
      await prisma.user.delete({
        where: { id: memberId },
      });
      
      return res.status(200).json({
        success: true,
        message: "Member berhasil dihapus",
      });
    } catch (error) {
      console.error("DELETE member error:", error);
      return res.status(500).json({ 
        success: false, 
        message: "Server Error" 
      });
    }
  }
  //selesai
  return res.status(405).json({ message: "Method not allowed" });
}