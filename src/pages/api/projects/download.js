import fs from "fs";
import path from "path";

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const file = req.query.file;
  if (!file) {
    return res.status(400).json({ success: false, message: "Param file kosong" });
  }

  const uploadsDir = path.resolve(process.cwd(), "public/uploads");
  const cleanFile = file.replace(/^\/?uploads\//, "");
  const normalized = path.resolve(path.join(uploadsDir, cleanFile));

  console.log("📥 Download request:", { file, cleanFile, normalized, uploadsDir });

  if (!normalized.startsWith(uploadsDir)) {
    return res.status(403).json({ success: false, message: "Akses ditolak" });
  }

  if (!fs.existsSync(normalized)) {
    console.error("❌ File tidak ada:", normalized);
    const files = fs.readdirSync(uploadsDir).filter(f => f.startsWith("mod_"));
    console.log("📂 Available module files:", files);
    return res.status(404).json({ 
      success: false, 
      message: "File tidak ditemukan di server",
      requested: normalized,
      available: files.slice(0, 10)
    });
  }

  const ext = path.extname(normalized).toLowerCase();
  const mimeMap = {
    ".pdf": "application/pdf",
    ".doc": "application/msword",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".webp": "image/webp",
  };

  const contentType = mimeMap[ext] || "application/octet-stream";
  const fileName = path.basename(normalized);
  const fileBuffer = fs.readFileSync(normalized);

  console.log("✅ Downloading:", { fileName, ext, contentType, size: fileBuffer.length });

  res.setHeader("Content-Type", contentType);
  res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
  res.setHeader("Content-Length", fileBuffer.length);
  res.setHeader("Cache-Control", "no-cache");
  res.end(fileBuffer);
}
