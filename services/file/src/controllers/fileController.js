import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { UploadService } from "../services/uploadService.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STORAGE_DIR = path.join(__dirname, "../../storage");

export const FileController = {
  async upload(req, res, next) {
    try {
      const result = await UploadService.handleUpload(req);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },

  async get(req, res, next) {
    try {
      const filePath = path.join(STORAGE_DIR, req.params.filename);
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ success: false, message: "File tidak ditemukan" });
      }
      res.sendFile(filePath);
    } catch (err) {
      next(err);
    }
  },

  async delete(req, res, next) {
    try {
      const filePath = path.join(STORAGE_DIR, req.params.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      res.json({ success: true, message: "File berhasil dihapus" });
    } catch (err) {
      next(err);
    }
  },
};
