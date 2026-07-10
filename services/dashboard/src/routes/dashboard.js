import { Router } from "express";
import { DashboardController } from "../controllers/dashboardController.js";

const router = Router();

router.get("/summary", DashboardController.summary);
router.get("/statistics", DashboardController.statistics);
router.get("/recent-projects", DashboardController.recentProjects);
router.get("/recent-revisions", DashboardController.recentRevisions);
router.get("/activity", DashboardController.activity);
router.get("/members", DashboardController.members);
router.get("/export/excel", DashboardController.exportExcel);
router.get("/export/pdf", DashboardController.exportPdf);

export { router as dashboardRouter };
