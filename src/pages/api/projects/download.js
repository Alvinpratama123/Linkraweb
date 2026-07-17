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

  const decoded = decodeURIComponent(file);
  const filePath = path.join(process.cwd(), "public", decoded);

  const normalized = path.resolve(filePath);
  const uploadsDir = path.resolve(process.cwd(), "public/uploads");
  if (!normalized.startsWith(uploadsDir)) {
    return res.status(403).json({ success: false, message: "Akses ditolak" });
  }

  if (!fs.existsSync(normalized)) {
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
  res.setHeader("Content-Length", fs.statSync(normalized).size);

  const stream = fs.createReadStream(normalized);
  stream.pipe(res);
}
