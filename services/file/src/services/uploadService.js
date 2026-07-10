import formidable from "formidable";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import crypto from "crypto";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STORAGE_DIR = path.join(__dirname, "../../storage");
const IMAGE_DIR = path.join(STORAGE_DIR, "images");
const MODULE_DIR = path.join(STORAGE_DIR, "modules");

[STORAGE_DIR, IMAGE_DIR, MODULE_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const ALLOWED_MODULE_TYPES = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export const UploadService = {
  handleUpload(req) {
    return new Promise((resolve, reject) => {
      const form = formidable({
        multiples: false,
        maxFileSize: MAX_FILE_SIZE,
        uploadDir: IMAGE_DIR,
        keepExtensions: true,
        filename: (name, ext, part) => {
          const timestamp = Date.now();
          const random = crypto.randomBytes(4).toString("hex");
          return `${part.name || "file"}_${timestamp}_${random}${ext}`;
        },
      });

      form.parse(req, (err, fields, files) => {
        if (err) return reject(Object.assign(err, { status: 400 }));

        const file = files.file?.[0] || files.file;
        if (!file) return reject(Object.assign(new Error("Tidak ada file yang diupload"), { status: 400 }));

        const isImage = ALLOWED_IMAGE_TYPES.includes(file.mimetype);
        const isModule = ALLOWED_MODULE_TYPES.includes(file.mimetype);

        if (!isImage && !isModule) {
          fs.unlinkSync(file.filepath);
          return reject(Object.assign(new Error("Tipe file tidak diizinkan. Hanya: JPG, PNG, GIF, WebP, PDF, DOC, DOCX"), { status: 400 }));
        }

        const targetDir = isImage ? IMAGE_DIR : MODULE_DIR;
        const newPath = path.join(targetDir, file.newFilename || path.basename(file.filepath));

        if (file.filepath !== newPath) {
          fs.renameSync(file.filepath, newPath);
        }

        resolve({
          filename: path.basename(newPath),
          url: `/files/${path.basename(newPath)}`,
          mimetype: file.mimetype,
          size: file.size,
          type: isImage ? "image" : "module",
        });
      });
    });
  },
};
