// =====================================================================
// ENDPOINT: GET /api/stats/public
// Deskripsi: Endpoint publik (tanpa auth) untuk menampilkan statistik
//            project & member di landing page — SAMA PERSIS dengan
//            data yang ditampilkan di dashboard admin/member.
// =====================================================================

import { prismaProject as prismaProject } from "@/lib/prismaProject";
import { prismaAuth } from "@/lib/prismaAuth";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const [projects, members] = await Promise.all([
      prismaProject.project.findMany({
        select: { name: true, progress: true, decision: true },
      }),
      prismaAuth.user.findMany({
        select: { position: true },
      }),
    ]);

    // ─── PROGRAM ANALYTICS ─────────────────────────────────
    const categoryKeywords = {
      IoT: ["iot", "sensor", "arduino", "raspberry"],
      Website: ["web", "website", "landing", "portal", "dashboard", "erp", "hr", "cms"],
      "Mobile App": ["mobile", "android", "ios", "flutter", "react native", "app"],
      API: ["api", "backend", "service", "rest", "graphql"],
    };

    const categoryCounts = {};
    Object.entries(categoryKeywords).forEach(([cat, keywords]) => {
      const count = projects.filter((p) =>
        keywords.some((kw) => p.name?.toLowerCase().includes(kw))
      ).length;
      if (count > 0) categoryCounts[cat] = count;
    });

    const allKw = Object.values(categoryKeywords).flat();
    const otherCount = projects.filter((p) =>
      !allKw.some((kw) => p.name?.toLowerCase().includes(kw))
    ).length;
    if (otherCount > 0) categoryCounts["Lainnya"] = otherCount;

    const programStats = Object.entries(categoryCounts)
      .map(([label, count]) => ({ label, count }));

    // ─── MEMBER ANALYTICS ──────────────────────────────────
    const memberPositionCounts = {};
    members.forEach((m) => {
      const pos = m.position || "Lainnya";
      memberPositionCounts[pos] = (memberPositionCounts[pos] || 0) + 1;
    });

    const memberStats = Object.entries(memberPositionCounts)
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count);

    // ─── MODULE PROGRESS ───────────────────────────────────
    const grouped = new Map();
    projects.forEach((project) => {
      const moduleName = (project.name || "Untitled Module").trim();
      if (!grouped.has(moduleName)) {
        grouped.set(moduleName, { name: moduleName, totalProgress: 0, count: 0, decisions: [] });
      }
      const mod = grouped.get(moduleName);
      mod.totalProgress += project.progress || 0;
      mod.count += 1;
      mod.decisions.push(project.decision || "pending");
    });

    const moduleStats = Array.from(grouped.values())
      .map((mod) => {
        const avgProgress = mod.count > 0 ? Math.round(mod.totalProgress / mod.count) : 0;
        const allApproved = mod.decisions.every((d) => d === "approved");
        const hasRejected = mod.decisions.some((d) => d === "rejected");
        let status = "pending";
        if (allApproved && mod.count > 0) status = "approved";
        else if (hasRejected) status = "rejected";
        return {
          name: mod.name,
          avgProgress,
          status,
        };
      })
      .sort((a, b) => b.avgProgress - a.avgProgress)
      .slice(0, 5);

    return res.status(200).json({
      success: true,
      stats: {
        totalProjects: projects.length,
        totalMembers: members.length,
        programs: programStats,
        members: memberStats,
        modules: moduleStats,
      },
    });
  } catch (error) {
    console.error("Public stats error:", error);
    return res.status(200).json({
      success: true,
      stats: {
        totalProjects: 0,
        totalMembers: 0,
        programs: [],
        members: [],
        modules: [],
      },
    });
  }
}
