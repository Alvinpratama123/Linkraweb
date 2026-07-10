import { AuthService } from "../services/authService.js";
import { JwtService } from "../services/jwtService.js";
import { EventPublisher } from "../events/publisher.js";

export const UserController = {
  async list(req, res, next) {
    try {
      const { role } = req.query;
      const users = await AuthService.listUsers({ role });
      res.json({ success: true, data: users });
    } catch (err) {
      next(err);
    }
  },

  async getById(req, res, next) {
    try {
      const user = await AuthService.findById(req.params.id);
      if (!user) return res.status(404).json({ success: false, message: "User tidak ditemukan" });
      res.json({ success: true, data: user });
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const { name, email, password, role, position } = req.body;
      if (!name || !email || !password || !role) {
        return res.status(400).json({ success: false, message: "Semua field wajib diisi" });
      }
      const existing = await AuthService.findByEmail(email);
      if (existing) return res.status(409).json({ success: false, message: "Email sudah terdaftar" });
      const hashedPassword = await AuthService.hashPassword(password);
      const user = await AuthService.createUser({ name, email, password: hashedPassword, role, position });
      await EventPublisher.userCreated(user);
      res.status(201).json({ success: true, message: "Member berhasil dibuat", data: user });
    } catch (err) {
      next(err);
    }
  },

  async delete(req, res, next) {
    try {
      const user = await AuthService.findById(req.params.id);
      if (!user) return res.status(404).json({ success: false, message: "User tidak ditemukan" });
      await AuthService.deleteUser(req.params.id);
      await EventPublisher.userDeleted(req.params.id);
      res.json({ success: true, message: "User berhasil dihapus" });
    } catch (err) {
      next(err);
    }
  },

  async resendEmail(req, res, next) {
    try {
      const user = await AuthService.findById(req.params.id);
      if (!user) return res.status(404).json({ success: false, message: "User tidak ditemukan" });
      await EventPublisher.userCreated(user);
      res.json({ success: true, message: "Email kredensial berhasil dikirim ulang" });
    } catch (err) {
      next(err);
    }
  },
};
