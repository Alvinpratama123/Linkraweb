import fs from "fs";
import path from "path";

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const { file } = req.query;
  if (!file) {
    return res.status(400).json({ success: false, message: "File tidak ditemukan" });
  }

  const uploadsDir = path.resolve(process.cwd(), "public/uploads");
  let normalized;

  if (file.startsWith("/uploads/")) {
    const fileName = file.replace(/^\/uploads\//, "");
    normalized = path.join(uploadsDir, fileName);
  } else {
    normalized = path.join(uploadsDir, file);
  }

  normalized = path.resolve(normalized);
  if (!normalized.startsWith(uploadsDir)) {
    return res.status(403).json({ success: false, message: "Akses ditolak" });
  }

  if (!fs.existsSync(normalized)) {
    console.error("❌ Download: file not found:", normalized);
    return res.status(404).json({ success: false, message: "File tidak ditemukan di server" });
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

  res.setHeader("Content-Type", contentType);
  res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
  res.setHeader("Cache-Control", "no-cache");

  const fileBuffer = fs.readFileSync(normalized);
  res.setHeader("Content-Length", fileBuffer.length);
  res.end(fileBuffer);
}
