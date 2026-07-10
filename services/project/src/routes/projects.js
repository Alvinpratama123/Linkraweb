import { Router } from "express";
import { ProjectController } from "../controllers/projectController.js";
import { multipartParser } from "../middleware/upload.js";

const router = Router();

router.get("/", ProjectController.list);
router.get("/:id", ProjectController.getById);
router.post("/", ProjectController.create);
router.patch("/:id", ProjectController.update);
router.delete("/:id", ProjectController.delete);
router.patch("/:id/decision", ProjectController.updateDecision);
router.post("/upload", multipartParser, ProjectController.upload);

export { router as projectRouter };
