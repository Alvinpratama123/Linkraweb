import { Aggregator } from "../services/aggregator.js";
import { CacheService } from "../services/cacheService.js";
import { ExportService } from "../services/exportService.js";

export const DashboardController = {
  async summary(req, res, next) {
    try {
      const cacheKey = "dashboard:summary";
      let data = await CacheService.get(cacheKey);
      if (!data) {
        data = await Aggregator.getSummary();
        await CacheService.set(cacheKey, data, 60);
      }
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  async statistics(req, res, next) {
    try {
      const cacheKey = "dashboard:statistics";
      let data = await CacheService.get(cacheKey);
      if (!data) {
        data = await Aggregator.getStatistics();
        await CacheService.set(cacheKey, data, 120);
      }
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  async recentProjects(req, res, next) {
    try {
      const data = await Aggregator.getRecentProjects();
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  async recentRevisions(req, res, next) {
    try {
      const data = await Aggregator.getRecentRevisions();
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  async activity(req, res, next) {
    try {
      const data = await Aggregator.getActivity();
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  async members(req, res, next) {
    try {
      const data = await Aggregator.getMembers();
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  async exportExcel(req, res, next) {
    try {
      const projects = await Aggregator.getAllProjects();
      const buffer = await ExportService.toExcel(projects);
      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      res.setHeader("Content-Disposition", "attachment; filename=laporan-proyek.xlsx");
      res.send(buffer);
    } catch (err) {
      next(err);
    }
  },

  async exportPdf(req, res, next) {
    try {
      const projects = await Aggregator.getAllProjects();
      const buffer = await ExportService.toPdf(projects);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=laporan-proyek.pdf");
      res.send(buffer);
    } catch (err) {
      next(err);
    }
  },
};
