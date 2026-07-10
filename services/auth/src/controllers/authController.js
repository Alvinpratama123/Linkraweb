import { AuthService } from "../services/authService.js";
import { OtpService } from "../services/otpService.js";
import { JwtService } from "../services/jwtService.js";
import { EventPublisher } from "../events/publisher.js";

export const AuthController = {
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email dan password wajib diisi" });
      }
      const result = await AuthService.login(email, password);
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  },

  async register(req, res, next) {
    try {
      const { name, email, password, role, position } = req.body;
      if (!name || !email || !password || !role) {
        return res.status(400).json({ success: false, message: "Semua field wajib diisi" });
      }
      const validRoles = ["frontend", "backend", "uiux", "qa", "pm", "admin", "member"];
      if (!validRoles.includes(role)) {
        return res.status(400).json({ success: false, message: "Role tidak valid" });
      }
      const existing = await AuthService.findByEmail(email);
      if (existing) {
        return res.status(409).json({ success: false, message: "Email sudah terdaftar" });
      }
      const hashedPassword = await AuthService.hashPassword(password);
      const tempUser = { name, email, password: hashedPassword, role: role || "member", position };
      const otp = await OtpService.createRegisterOtp(email);
      await EventPublisher.otpRegister(email, otp.code, name);
      res.json({ success: true, message: "OTP berhasil dikirim", email });
    } catch (err) {
      next(err);
    }
  },

  async verifyRegister(req, res, next) {
    try {
      const { email, otp: code, name, password, role, position } = req.body;
      if (!email || !code) {
        return res.status(400).json({ success: false, message: "Email dan kode OTP wajib diisi" });
      }
      await OtpService.verifyRegisterOtp(email, code);
      const hashedPassword = password ? await AuthService.hashPassword(password) : null;
      const user = await AuthService.createUser({ name, email, password: hashedPassword, role: role || "member", position });
      const token = JwtService.sign({ id: user.id, email: user.email, role: user.role });
      await EventPublisher.userCreated(user);
      res.json({ success: true, message: "Registrasi berhasil", data: { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } } });
    } catch (err) {
      next(err);
    }
  },

  async resendOtp(req, res, next) {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ success: false, message: "Email wajib diisi" });
      const otp = await OtpService.createRegisterOtp(email);
      await EventPublisher.otpRegister(email, otp.code);
      res.json({ success: true, message: "OTP berhasil dikirim ulang" });
    } catch (err) {
      next(err);
    }
  },

  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ success: false, message: "Email wajib diisi" });
      const user = await AuthService.findByEmail(email);
      if (!user) return res.status(404).json({ success: false, message: "Email tidak ditemukan" });
      const otp = await OtpService.createPasswordResetOtp(email);
      await EventPublisher.otpReset(email, otp.code, user.name);
      res.json({ success: true, message: "OTP reset password berhasil dikirim", email });
    } catch (err) {
      next(err);
    }
  },

  async verifyResetOtp(req, res, next) {
    try {
      const { email, otp: code } = req.body;
      if (!email || !code) return res.status(400).json({ success: false, message: "Email dan kode OTP wajib diisi" });
      await OtpService.verifyPasswordResetOtp(email, code);
      res.json({ success: true, message: "OTP valid" });
    } catch (err) {
      next(err);
    }
  },

  async resetPassword(req, res, next) {
    try {
      const { email, otp: code, password } = req.body;
      if (!email || !code || !password) return res.status(400).json({ success: false, message: "Semua field wajib diisi" });
      await OtpService.verifyPasswordResetOtp(email, code);
      const hashedPassword = await AuthService.hashPassword(password);
      await AuthService.updatePassword(email, hashedPassword);
      await OtpService.cleanupUsedTokens(email);
      res.json({ success: true, message: "Password berhasil direset" });
    } catch (err) {
      next(err);
    }
  },

  async logout(req, res, next) {
    try {
      res.json({ success: true, message: "Logout berhasil" });
    } catch (err) {
      next(err);
    }
  },

  async getMe(req, res, next) {
    try {
      const userId = req.headers["x-user-id"];
      if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
      const user = await AuthService.findById(userId);
      if (!user) return res.status(404).json({ success: false, message: "User tidak ditemukan" });
      res.json({ success: true, user: { id: user.id, name: user.name, email: user.email, role: user.role, position: user.position, profile: user.profile, photo: user.photo, createdAt: user.createdAt } });
    } catch (err) {
      next(err);
    }
  },

  async verifyToken(req, res, next) {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.replace("Bearer ", "") || req.headers["x-auth-token"];
      if (!token) return res.status(401).json({ success: false, message: "No token" });
      const decoded = JwtService.verify(token);
      res.json({ success: true, data: decoded });
    } catch (err) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
  },

  async updateProfile(req, res, next) {
    try {
      const userId = req.headers["x-user-id"];
      if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
      const { name, email } = req.body;
      const user = await AuthService.updateUser(userId, { name, email });
      res.json({ success: true, message: "Profil berhasil diperbarui", user });
    } catch (err) {
      next(err);
    }
  },

  async getProfile(req, res, next) {
    try {
      const userId = req.headers["x-user-id"];
      if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
      const user = await AuthService.findById(userId);
      if (!user) return res.status(404).json({ success: false, message: "User tidak ditemukan" });
      res.json({ success: true, data: { ...user, updatedAt: user.updatedAt } });
    } catch (err) {
      next(err);
    }
  },
};
