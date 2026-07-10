import { Router } from "express";
import { AttachmentController } from "../controllers/attachmentController.js";

const router = Router();

router.get("/:id", AttachmentController.getById);
router.patch("/:id", AttachmentController.update);
router.delete("/:id", AttachmentController.delete);

export { router as attachmentRouter };
