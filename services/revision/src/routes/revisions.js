import { Router } from "express";
import { RevisionController } from "../controllers/revisionController.js";

const router = Router();

router.get("/", RevisionController.list);
router.get("/:id", RevisionController.getById);
router.post("/", RevisionController.create);
router.patch("/:id", RevisionController.update);
router.get("/:id/comments", RevisionController.listComments);
router.post("/:id/comments", RevisionController.addComment);
router.delete("/:id/comments/:commentId", RevisionController.deleteComment);

export { router as revisionRouter };
