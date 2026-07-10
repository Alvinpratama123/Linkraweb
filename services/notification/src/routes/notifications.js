import { Router } from "express";
import { NotificationController } from "../controllers/notificationController.js";

const router = Router();

router.get("/", NotificationController.list);
router.get("/count", NotificationController.count);
router.patch("/:id/read", NotificationController.markRead);
router.patch("/read-all", NotificationController.markAllRead);
router.delete("/:id", NotificationController.delete);
router.delete("/cleanup", NotificationController.cleanup);

export { router as notificationRouter };
