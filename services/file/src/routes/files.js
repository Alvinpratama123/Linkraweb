import { Router } from "express";
import { FileController } from "../controllers/fileController.js";

const router = Router();

router.post("/upload", FileController.upload);
router.get("/:filename", FileController.get);
router.delete("/:filename", FileController.delete);

export { router as fileRouter };
