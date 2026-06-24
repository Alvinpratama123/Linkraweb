import React, { useEffect, useState } from "react";
import { FaSearch, FaBell } from "react-icons/fa";

export default function Dashboard({ userData }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  let userName = userData?.name || "Administrator";
  let userPhoto = userData?.photo || null;
  let userRole = userData?.role || "USER";

  if (!userData?.name && isMounted) {
    const localUser = JSON.parse(localStorage.getItem("user") || "{}");
    userName = localUser?.name || "Administrator";
    userPhoto = localUser?.photo || null;
    userRole = localUser?.role || "USER";
  }

  useEffect(() => {
    setIsMounted(true);
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        if (data.success) setProjects(data.projects);
      } catch (error) {
        console.error("Fetch projects error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Stats dinamis dari projects
  const totalProjects = projects.length;
  const approvedProjects = projects.filter((p) => p.decision === "approved").length;
  const pendingProjects = projects.filter((p) => !p.decision || p.decision === "pending").length;
  const finishedProjects = projects.filter((p) => p.finished).length;

  const stats = [
    { title: "Total Projects", value: String(totalProjects), color: "text-blue-600" },
    { title: "Approved", value: String(approvedProjects), color: "text-green-600" },
    { title: "Pending", value: String(pendingProjects), color: "text-yellow-600" },
    { title: "Finished", value: String(finishedProjects), color: "text-purple-600" },
  ];

  // Chart posisi dari projects
  const positionCounts = projects.reduce((acc, project) => {
    const pos = project.position || "Lainnya";
    acc[pos] = (acc[pos] || 0) + 1;
    return acc;
  }, {});

  const programStats = Object.entries(positionCounts).map(([label, count]) => ({ label, count }));
  const maxProgram = Math.max(...programStats.map((item) => item.count), 1);

  // Top 5 projects by progress
  const topProjects = [...projects]
    .sort((a, b) => b.progress - a.progress)
    .slice(0, 5);

  // Kategori project berdasarkan nama (IoT, Website, Mobile, API, dll)
  const categoryKeywords = {
    IoT: ["iot", "sensor", "arduino", "raspberry"],
    Website: ["web", "website", "landing", "portal", "dashboard", "erp", "hr", "cms"],
    "Mobile App": ["mobile", "android", "ios", "flutter", "react native", "app"],
    API: ["api", "backend", "service", "rest", "graphql"],
  };

  const categoryCounts = Object.entries(categoryKeywords).reduce((acc, [cat, keywords]) => {
    acc[cat] = projects.filter((p) =>
      keywords.some((kw) => p.name?.toLowerCase().includes(kw))
    ).length;
    return acc;
  }, {});

  const otherCount = projects.filter((p) => {
    const allKeywords = Object.values(categoryKeywords).flat();
    return !allKeywords.some((kw) => p.name?.toLowerCase().includes(kw));
  }).length;

  if (otherCount > 0) categoryCounts["Lainnya"] = otherCount;

  const categoryStats = Object.entries(categoryCounts)
    .filter(([, count]) => count > 0)
    .map(([label, count]) => ({ label, count }));

  const maxCategory = Math.max(...categoryStats.map((item) => item.count), 1);

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* WELCOME BANNER */}
      <div className="bg-gradient-to-r from-[#001d55] via-[#002a6e] to-[#003d9e] px-6 py-5 text-white shadow-lg rounded-b-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">Selamat Datang, {userName}! 👋</h1>
            <p className="text-blue-200 text-sm">Semoga harimu menyenangkan. Berikut ringkasan aktivitas hari ini.</p>
          </div>
          <div className="hidden md:block">
            <div className="w-14 h-14 bg-white/15 rounded-full flex items-center justify-center backdrop-blur-sm">
              <span className="text-2xl">🎯</span>
            </div>
          </div>
        </div>
      </div>

      {/* HEADER */}
      <header className="bg-white/95 backdrop-blur-md px-6 py-3 flex items-center justify-between shadow-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center bg-gray-50 px-4 py-2 rounded-xl border border-gray-200 w-80">
            <FaSearch className="text-gray-400" />
            <input type="text" placeholder="Search..." className="bg-transparent outline-none ml-3 w-full text-sm" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="relative w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-all group">
            <FaBell className="text-gray-600 group-hover:text-[#001d55] transition-colors" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <div className="flex items-center gap-3 cursor-pointer group">
            {userPhoto ? (
              <img src={userPhoto} alt="Profile" className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500/20 group-hover:ring-blue-500/50 transition-all" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#001d55] to-[#003d9e] flex items-center justify-center">
                <span className="text-white font-bold text-sm">{userName?.charAt(0)?.toUpperCase() || "A"}</span>
              </div>
            )}
            <div className="hidden md:block">
              <h3 className="font-semibold text-gray-800 text-sm">{userName}</h3>
              <p className="text-xs text-gray-500">
                {userRole === "ADMIN" ? "Super Admin" : userRole === "USER" ? "User" : userRole}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* BODY */}
      <div className="p-6">
        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
          {stats.map((item) => (
            <div key={item.title} className="group bg-white rounded-xl shadow-sm p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100">
              <p className="text-gray-500 text-sm mb-2">{item.title}</p>
              <h2 className={`text-3xl font-bold mt-1 ${item.color}`}>
                {loading ? "..." : item.value}
              </h2>
            </div>
          ))}
        </div>

        {/* CHARTS */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Kategori Project Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-all duration-300 border border-gray-100">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Program Analytics</p>
                <h2 className="mt-1 text-2xl font-bold bg-gradient-to-r from-[#001d55] to-[#003d9e] bg-clip-text text-transparent">
                  {totalProjects} Program
                </h2>
              </div>
              <div className="rounded-full bg-gradient-to-r from-[#001d55] to-[#003d9e] px-3 py-1 text-white text-xs font-semibold shadow-md">Total</div>
            </div>
            {loading ? (
              <div className="h-64 flex items-center justify-center text-gray-400">Memuat...</div>
            ) : categoryStats.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-gray-400">Belum ada data</div>
            ) : (
              <div className="mt-6 flex items-end justify-between gap-3 h-64">
                {categoryStats.map((item) => {
                  const heightPercent = (item.count / maxCategory) * 100;
                  return (
                    <div key={item.label} className="flex flex-col items-center justify-end gap-2 flex-1 h-full group">
                      <span className="text-sm font-bold text-gray-700 group-hover:scale-110 transition-transform">{item.count}</span>
                      <div className="relative w-full bg-gray-100 rounded-xl overflow-hidden flex items-end flex-1 group cursor-pointer">
                        <div
                          className="absolute bottom-0 left-0 w-full transition-all duration-500 group-hover:opacity-90 rounded-xl"
                          style={{ height: `${heightPercent}%`, background: "linear-gradient(180deg, #003d9e 0%, #001d55 100%)" }}
                        >
                          <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-t-xl"></div>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-gray-600 text-center">{item.label}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Posisi Member Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-all duration-300 border border-gray-100">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Posisi Analytics</p>
                <h2 className="mt-1 text-2xl font-bold bg-gradient-to-r from-[#001d55] to-[#003d9e] bg-clip-text text-transparent">
                  {programStats.length} Posisi
                </h2>
              </div>
              <div className="rounded-full bg-gradient-to-r from-[#001d55] to-[#003d9e] px-3 py-1 text-white text-xs font-semibold shadow-md">Total</div>
            </div>
            {loading ? (
              <div className="h-64 flex items-center justify-center text-gray-400">Memuat...</div>
            ) : programStats.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-gray-400">Belum ada data</div>
            ) : (
              <div className="mt-6 flex items-end justify-between gap-3 h-64">
                {programStats.map((item) => {
                  const heightPercent = (item.count / maxProgram) * 100;
                  return (
                    <div key={item.label} className="flex flex-col items-center justify-end gap-2 flex-1 h-full group">
                      <span className="text-sm font-bold text-gray-700 group-hover:scale-110 transition-transform">{item.count}</span>
                      <div className="relative w-full bg-gray-100 rounded-xl overflow-hidden flex items-end flex-1 group cursor-pointer">
                        <div
                          className="absolute bottom-0 left-0 w-full transition-all duration-500 group-hover:opacity-90 rounded-xl"
                          style={{ height: `${heightPercent}%`, background: "linear-gradient(180deg, #003d9e 0%, #001d55 100%)" }}
                        >
                          <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-t-xl"></div>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-gray-600 text-center">{item.label}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* PROJECT PROGRESS - dynamic dari API */}
        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-all duration-300 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-bold text-xl bg-gradient-to-r from-[#001d55] to-[#003d9e] bg-clip-text text-transparent">Project Progress</h2>
              <p className="text-sm text-gray-500 mt-1">Status perkembangan proyek aktif</p>
            </div>
            <div className="px-3 py-1 bg-blue-50 rounded-full">
              <span className="text-xs font-semibold text-[#001d55]">{totalProjects} Projects</span>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8 text-gray-400">Memuat data...</div>
          ) : topProjects.length === 0 ? (
            <div className="text-center py-8 text-gray-400">Belum ada project</div>
          ) : (
            <div className="space-y-5">
              {topProjects.map((p) => (
                <div key={p.id} className="group">
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-800">{p.name}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">{p.position}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${p.decision === "approved" ? "bg-green-100 text-green-700" : p.decision === "rejected" ? "bg-red-100 text-red-700" : "bg-yellow-50 text-yellow-700"}`}>
                        {p.decision || "pending"}
                      </span>
                    </div>
                    <div className="text-sm font-bold text-[#001d55]">{p.progress}%</div>
                  </div>
                  <div className="relative w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${p.progress}%`, background: "linear-gradient(90deg, #003d9e 0%, #001d55 100%)" }}
                    >
                      <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
          )}
        </div>
      </div>
    </div>
  );
}