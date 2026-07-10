import { Router } from "express";
import { EmailController } from "../controllers/emailController.js";

const router = Router();

router.get("/health", EmailController.testSmtp);
router.post("/send", EmailController.send);

export { router as emailRouter };
