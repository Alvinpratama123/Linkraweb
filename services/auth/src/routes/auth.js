import { Router } from "express";
import { AuthController } from "../controllers/authController.js";

const router = Router();

router.post("/login", AuthController.login);
router.post("/register", AuthController.register);
router.post("/verify-register", AuthController.verifyRegister);
router.post("/resend-otp", AuthController.resendOtp);
router.post("/forgot-password", AuthController.forgotPassword);
router.post("/verify-reset-otp", AuthController.verifyResetOtp);
router.post("/reset-password", AuthController.resetPassword);
router.post("/logout", AuthController.logout);
router.get("/me", AuthController.getMe);
router.get("/verify", AuthController.verifyToken);
router.put("/profile", AuthController.updateProfile);
router.get("/profile", AuthController.getProfile);

export { router as authRouter };
