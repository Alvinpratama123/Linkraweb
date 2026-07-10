import { Router } from "express";
import { UserController } from "../controllers/userController.js";

const router = Router();

router.get("/", UserController.list);
router.get("/:id", UserController.getById);
router.post("/", UserController.create);
router.delete("/:id", UserController.delete);
router.post("/:id/resend-email", UserController.resendEmail);

export { router as userRouter };
