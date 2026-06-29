/**
 * ============================================================
 * DASHBOARD COMPONENT — Project Management System
 * ============================================================
 */
 
import React, { useEffect, useState, useRef } from "react";
import { FaSearch, FaBell, FaUsers, FaCheckDouble } from "react-icons/fa";
import { HiSparkles, HiFolder, HiCheckCircle, HiClock, HiFlag } from "react-icons/hi2";
 
export default function Dashboard({ userData = {}, theme = "light" }) {
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
 
  // ─── TEMA ───────────────────────────────────────────────────
  const isDark = theme === "dark";
 
  // ─── DATA USER ──────────────────────────────────────────────
  const safeParseUser = () => {
    try {
      return typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("user") || "{}")
        : {};
    } catch {
      return {};
    }
  };
  const localUser = safeParseUser();
 
  const userName  = userData?.name  || localUser?.name  || "User";
  const userPhoto = userData?.photo || localUser?.photo || null;
  const userRole  = userData?.role  || localUser?.role  || "USER";
  const userPosition = userData?.position || localUser?.position || null;
 
  // ─── FUNGSI GET DISPLAY ROLE ──────────────────────────────
  const getDisplayRole = (role, position) => {
    // Jika ada position, tampilkan position (prioritas)
    if (position) {
      return position; // Frontend, UI/UX, Backend, dll
    }
    
    // Jika tidak ada position, cek role
    const map = { 
      ADMIN: "Super Admin", 
      USER: "User", 
      FRONTEND: "Frontend",
      BACKEND: "Backend", 
      FULLSTACK: "Fullstack", 
      QA: "QA",
      MEMBER: "Member"
    };
    return map[role] || role || "User";
  };
 
  // ─── FETCH DATA ─────────────────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch projects
        const projectsRes = await fetch("/api/projects");
        const projectsData = await projectsRes.json();
        if (projectsData.success) {
          setProjects(projectsData.projects || []);
        }

        // Fetch members
        try {
          const membersRes = await fetch("/api/members");
          const membersData = await membersRes.json();
          console.log("📊 Members data:", membersData);
          if (membersData.success && membersData.members) {
            setMembers(membersData.members);
          } else {
            console.warn("No members data found");
            setMembers([]);
          }
        } catch (memberError) {
          console.error("Error fetching members:", memberError);
          setMembers([]);
        }

      } catch (error) {
        console.error("Fetch data error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
 
  // ─── STATISTIK ──────────────────────────────────────────────
  const totalProjects    = projects.length;
  const approvedProjects = projects.filter((p) => p.decision === "approved").length;
  const pendingProjects  = projects.filter((p) => !p.decision || p.decision === "pending").length;
  const finishedProjects = projects.filter((p) => p.finished).length;
  const totalMembers     = members.length;
 
  /**
   * STATS CARDS CONFIG
   */
  const stats = [
    {
      title: "Total Projects",
      value: String(totalProjects),
      lightText:   "text-blue-700",
      darkText:    "text-blue-300",
      lightBg:     "bg-blue-50",
      darkBg:      "bg-blue-950",
      lightBorder: "border-blue-200",
      darkBorder:  "border-blue-800",
      lightIcon:   "bg-blue-100",
      darkIcon:    "bg-blue-900",
      icon: <HiFolder size={22} className="text-blue-500" />,
    },
    {
      title: "Total Members",
      value: String(totalMembers),
      lightText:   "text-purple-700",
      darkText:    "text-purple-300",
      lightBg:     "bg-purple-50",
      darkBg:      "bg-purple-950",
      lightBorder: "border-purple-200",
      darkBorder:  "border-purple-800",
      lightIcon:   "bg-purple-100",
      darkIcon:    "bg-purple-900",
      icon: <FaUsers size={22} className="text-purple-500" />,
    },
    {
      title: "Approved",
      value: String(approvedProjects),
      lightText:   "text-emerald-700",
      darkText:    "text-emerald-300",
      lightBg:     "bg-emerald-50",
      darkBg:      "bg-emerald-950",
      lightBorder: "border-emerald-200",
      darkBorder:  "border-emerald-800",
      lightIcon:   "bg-emerald-100",
      darkIcon:    "bg-emerald-900",
      icon: <HiCheckCircle size={22} className="text-emerald-500" />,
    },
    {
      title: "Pending",
      value: String(pendingProjects),
      lightText:   "text-amber-700",
      darkText:    "text-amber-300",
      lightBg:     "bg-amber-50",
      darkBg:      "bg-amber-950",
      lightBorder: "border-amber-200",
      darkBorder:  "border-amber-800",
      lightIcon:   "bg-amber-100",
      darkIcon:    "bg-amber-900",
      icon: <HiClock size={22} className="text-amber-500" />,
    },
  ];
 
  // ─── CHART: MEMBER ANALYTICS ──────────────────────────────
  const memberPositionCounts = members.reduce((acc, member) => {
    const pos = member.position || "Lainnya";
    acc[pos] = (acc[pos] || 0) + 1;
    return acc;
  }, {});

  const memberStats = Object.entries(memberPositionCounts)
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
  const maxMember = Math.max(...memberStats.map((item) => item.count), 1);

  console.log("📊 Member Stats:", memberStats);
 
  // ─── CHART: PROGRAM ANALYTICS ──────────────────────────────
  const categoryKeywords = {
    IoT:          ["iot", "sensor", "arduino", "raspberry"],
    Website:      ["web", "website", "landing", "portal", "dashboard", "erp", "hr", "cms"],
    "Mobile App": ["mobile", "android", "ios", "flutter", "react native", "app"],
    API:          ["api", "backend", "service", "rest", "graphql"],
  };
 
  const categoryCounts = Object.entries(categoryKeywords).reduce((acc, [cat, keywords]) => {
    acc[cat] = projects.filter((p) =>
      keywords.some((kw) => p.name?.toLowerCase().includes(kw))
    ).length;
    return acc;
  }, {});
 
  const otherCount = projects.filter((p) => {
    const allKw = Object.values(categoryKeywords).flat();
    return !allKw.some((kw) => p.name?.toLowerCase().includes(kw));
  }).length;
  if (otherCount > 0) categoryCounts["Lainnya"] = otherCount;
 
  const categoryStats = Object.entries(categoryCounts)
    .filter(([, count]) => count > 0)
    .map(([label, count]) => ({ label, count }));
  const maxCategory = Math.max(...categoryStats.map((item) => item.count), 1);
 
  // ─── CHART: POSISI PROJECT ANALYTICS ────────────────────────
  const positionCounts = projects.reduce((acc, project) => {
    const pos = project.position || "Lainnya";
    acc[pos] = (acc[pos] || 0) + 1;
    return acc;
  }, {});
  const projectPositionStats = Object.entries(positionCounts)
    .map(([label, count]) => ({ label, count }));
  const maxProjectPosition = Math.max(...projectPositionStats.map((item) => item.count), 1);
 
  // ─── PROJECT PROGRESS ────────────────────────────────────────
  const topProjects = [...projects].sort((a, b) => b.progress - a.progress).slice(0, 5);
 
  // ─── DISPLAY ROLE ──────────────────────────────────────────
  const displayRole = getDisplayRole(userRole, userPosition);
 
  /**
   * WARNA GRAFIK
   */
  const barGradient = isDark
    ? "linear-gradient(180deg, #0051d3 0%, #01316c 100%)"
    : "linear-gradient(180deg, #003d9e 0%, #001d55 100%)";
 
  const progressGradient = isDark
    ? "linear-gradient(90deg, #01316c 0%, #0051d3 100%)"
    : "linear-gradient(90deg, #003d9e 0%, #001d55 100%)";

  // Color mapping untuk grafik
  const colorMap = {
    IoT: { bg: 'bg-blue-600', stroke: '#2563eb' },
    Website: { bg: 'bg-green-600', stroke: '#16a34a' },
    'Mobile App': { bg: 'bg-orange-500', stroke: '#f97316' },
    API: { bg: 'bg-purple-600', stroke: '#7c3aed' },
    'Lainnya': { bg: 'bg-gray-500', stroke: '#6b7280' },
    Frontend: { bg: 'bg-sky-500', stroke: '#0ea5e9' },
    Backend: { bg: 'bg-cyan-600', stroke: '#0891b2' },
    Fullstack: { bg: 'bg-green-600', stroke: '#16a34a' },
    'UI/UX': { bg: 'bg-violet-500', stroke: '#8b5cf6' },
    DevOps: { bg: 'bg-orange-500', stroke: '#f97316' },
    QA: { bg: 'bg-amber-500', stroke: '#f59e0b' },
    PM: { bg: 'bg-purple-600', stroke: '#7c3aed' },
  };
 
  // ─────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────
  return (
    <div className={`min-h-screen transition-all duration-300 ${
      isDark ? "bg-slate-950" : "bg-gradient-to-br from-gray-50 to-gray-100"
    }`}>
 
      {/* ── HEADER ────────────────────────────────────────────── */}
      <header className={`sticky top-0 z-10 px-6 py-3 flex items-center justify-between shadow-sm border-b transition-all duration-300 ${
        isDark
          ? "bg-slate-900 border-slate-800"
          : "bg-white/95 backdrop-blur-md border-gray-100"
      }`}>
        <div className="flex items-center gap-4">
          <div className={`hidden md:flex items-center px-4 py-2 rounded-xl border w-80 transition-all duration-300 ${
            isDark ? "bg-slate-800 border-slate-700" : "bg-gray-50 border-gray-200"
          }`}>
            <FaSearch className={isDark ? "text-slate-500" : "text-gray-400"} />
            <input
              type="text"
              placeholder="Search..."
              className={`bg-transparent outline-none ml-3 w-full text-sm ${
                isDark ? "text-white placeholder-slate-600" : "text-gray-700 placeholder-gray-400"
              }`}
            />
          </div>
        </div>
 
        <div className="flex items-center gap-4">
          {/* ── NOTIFICATION BELL ─────────────────────────────────── */}
          <NotificationBell theme={theme} isDark={isDark} />

          <div className={`flex items-center gap-3 cursor-pointer transition-all duration-300 rounded-xl px-3 py-1.5 ${
            isDark ? "hover:bg-slate-800" : "hover:bg-gray-50"
          }`}>
            {userPhoto ? (
              <img src={userPhoto} alt="Profile"
                className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500/20" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#001d55] to-[#003d9e] flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {userName?.charAt(0)?.toUpperCase() || "U"}
                </span>
              </div>
            )}
            <div className="hidden md:block">
              <h3 className={`font-semibold text-sm ${isDark ? "text-white" : "text-gray-800"}`}>
                {userName}
              </h3>
              {/* 🔥 PERBAIKAN: Tampilkan position bukan role */}
              <p className={`text-xs ${isDark ? "text-blue-400" : "text-gray-500"}`}>
                {displayRole}
              </p>
            </div>
          </div>
        </div>
      </header>
 
      {/* ── WELCOME BANNER ────────────────────────────────────── */}
      <div className={`mx-6 mt-5 mb-6 relative overflow-hidden px-6 py-5 rounded-2xl shadow-lg transition-all duration-300 ${
        isDark
          ? "bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 border border-slate-700"
          : "bg-gradient-to-r from-[#001d55] via-[#002a6e] to-[#003d9e]"
      }`}>
        <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full blur-2xl pointer-events-none bg-blue-500/10" />
        <div className="absolute -bottom-8 right-20 w-24 h-24 rounded-full blur-2xl pointer-events-none bg-blue-300/10" />
        <div className="flex items-center justify-between relative z-10">
          <div>
            <p className={`text-xs font-semibold mb-0.5 uppercase tracking-widest ${
              isDark ? "text-slate-400" : "text-sky-300/80"
            }`}>
              Dashboard {displayRole}
            </p>
            <h1 className="text-xl font-bold text-white">
              Selamat Datang, {userName}!
            </h1>
            <p className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-sky-200/70"}`}>
              Semoga harimu menyenangkan. Berikut ringkasan aktivitas hari ini.
            </p>
          </div>
          <div className={`hidden md:flex w-11 h-11 rounded-full items-center justify-center backdrop-blur-sm flex-shrink-0 border ${
            isDark ? "bg-white/5 border-white/10" : "bg-white/10 border-white/10"
          }`}>
            <HiSparkles size={22} className={isDark ? "text-slate-300" : "text-white"} />
          </div>
        </div>
      </div>
 
      {/* ── BODY ────────────────────────────────────────────────── */}
      <div className="px-6 pb-6">
 
        {/* ── STATS CARDS ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
          {stats.map((item) => (
            <div
              key={item.title}
              className={`group rounded-2xl p-5 border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                isDark
                  ? `${item.darkBg} ${item.darkBorder} hover:shadow-slate-900`
                  : `bg-white ${item.lightBorder} hover:shadow-md`
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <p className={`text-sm font-semibold ${isDark ? "text-slate-400" : "text-gray-500"}`}>
                  {item.title}
                </p>
                <div className={`p-2 rounded-xl ${isDark ? item.darkIcon : item.lightIcon}`}>
                  {item.icon}
                </div>
              </div>
              <h2 className={`text-3xl font-bold ${isDark ? item.darkText : item.lightText}`}>
                {loading ? (
                  <span className={`inline-block w-10 h-8 rounded-lg animate-pulse ${
                    isDark ? "bg-slate-700" : "bg-gray-200"
                  }`} />
                ) : item.value}
              </h2>
              <p className={`text-xs mt-1 font-medium ${isDark ? "text-slate-600" : "text-gray-400"}`}>
                {item.title === "Total Projects" && "semua proyek"}
                {item.title === "Total Members" && "anggota terdaftar"}
                {item.title === "Approved"       && "disetujui"}
                {item.title === "Pending"        && "menunggu keputusan"}
              </p>
            </div>
          ))}
        </div>
 
        {/* ── CHARTS ────────────────────────────────────────────── */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
 
          {/* Chart 1: Program Analytics */}
          <div className={`rounded-2xl p-6 border transition-all duration-300 hover:shadow-lg ${
            isDark
              ? "bg-slate-900 border-slate-800 hover:shadow-slate-950"
              : "bg-white border-gray-100 hover:shadow-md"
          }`}>
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className={`text-sm font-semibold uppercase tracking-wider ${
                  isDark ? "text-slate-500" : "text-gray-400"
                }`}>
                  Program Analytics
                </p>
                <h2 className={`mt-1 text-2xl font-bold ${isDark ? "text-white" : "text-[#001d55]"}`}>
                  {totalProjects} Program
                </h2>
                <p className={`text-xs mt-0.5 ${isDark ? "text-slate-600" : "text-gray-400"}`}>
                  Dikategorikan dari nama project
                </p>
              </div>
              <div className={`rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${
                isDark
                  ? "bg-blue-900 text-blue-300 border border-blue-800"
                  : "bg-gradient-to-r from-[#001d55] to-[#003d9e] text-white"
              }`}>
                Total
              </div>
            </div>
 
            {loading ? (
              <div className={`h-64 flex items-center justify-center text-sm ${
                isDark ? "text-slate-600" : "text-gray-400"
              }`}>Memuat...</div>
            ) : categoryStats.length === 0 ? (
              <div className={`h-64 flex items-center justify-center text-sm ${
                isDark ? "text-slate-600" : "text-gray-400"
              }`}>Belum ada data program</div>
            ) : (
              <div className="mt-6 flex items-end justify-between gap-3 h-64">
                {categoryStats.map((item) => {
                  const color = colorMap[item.label] || { bg: 'bg-gray-500' };
                  const heightPercent = (item.count / maxCategory) * 100;
                  return (
                    <div key={item.label} className="flex flex-col items-center justify-end gap-2 flex-1 h-full group">
                      <span className={`text-sm font-bold transition-transform group-hover:scale-110 ${
                        isDark ? "text-blue-300" : "text-gray-700"
                      }`}>
                        {item.count}
                      </span>
                      <div className={`relative w-full rounded-xl overflow-hidden flex items-end flex-1 ${
                        isDark ? "bg-slate-800" : "bg-gray-100"
                      }`}>
                        <div
                          className="absolute bottom-0 left-0 w-full transition-all duration-500 group-hover:opacity-90 rounded-xl"
                          style={{ height: `${heightPercent}%`, background: barGradient }}
                        >
                          <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-t-xl" />
                        </div>
                      </div>
                      <span className={`text-xs font-medium text-center leading-tight ${
                        isDark ? "text-slate-500" : "text-gray-600"
                      }`}>
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
 
          {/* Chart 2: Member Analytics */}
          <div className={`rounded-2xl p-6 border transition-all duration-300 hover:shadow-lg ${
            isDark
              ? "bg-slate-900 border-slate-800 hover:shadow-slate-950"
              : "bg-white border-gray-100 hover:shadow-md"
          }`}>
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className={`text-sm font-semibold uppercase tracking-wider ${
                  isDark ? "text-slate-500" : "text-gray-400"
                }`}>
                  Member Analytics
                </p>
                <h2 className={`mt-1 text-2xl font-bold ${isDark ? "text-white" : "text-[#001d55]"}`}>
                  {totalMembers} Member
                </h2>
                <p className={`text-xs mt-0.5 ${isDark ? "text-slate-600" : "text-gray-400"}`}>
                  Berdasarkan posisi member terdaftar
                </p>
              </div>
              <div className={`rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${
                isDark
                  ? "bg-purple-900 text-purple-300 border border-purple-800"
                  : "bg-gradient-to-r from-[#001d55] to-[#003d9e] text-white"
              }`}>
                Total
              </div>
            </div>
 
            {loading ? (
              <div className={`h-64 flex items-center justify-center text-sm ${
                isDark ? "text-slate-600" : "text-gray-400"
              }`}>Memuat...</div>
            ) : memberStats.length === 0 ? (
              <div className={`h-64 flex items-center justify-center text-sm ${
                isDark ? "text-slate-600" : "text-gray-400"
              }`}>
                <div className="text-center">
                  <p>Belum ada data member</p>
                  <p className="text-xs mt-1">Tambahkan member melalui halaman Member Modul</p>
                </div>
              </div>
            ) : (
              <div className="mt-6 flex items-end justify-between gap-3 h-64">
                {memberStats.map((item) => {
                  const color = colorMap[item.label] || { bg: 'bg-gray-500' };
                  const heightPercent = (item.count / maxMember) * 100;
                  return (
                    <div key={item.label} className="flex flex-col items-center justify-end gap-2 flex-1 h-full group">
                      <span className={`text-sm font-bold transition-transform group-hover:scale-110 ${
                        isDark ? "text-purple-300" : "text-gray-700"
                      }`}>
                        {item.count}
                      </span>
                      <div className={`relative w-full rounded-xl overflow-hidden flex items-end flex-1 ${
                        isDark ? "bg-slate-800" : "bg-gray-100"
                      }`}>
                        <div
                          className="absolute bottom-0 left-0 w-full transition-all duration-500 group-hover:opacity-90 rounded-xl"
                          style={{ 
                            height: `${heightPercent}%`, 
                            background: isDark 
                              ? "linear-gradient(180deg, #8b5cf6 0%, #6d28d9 100%)"
                              : "linear-gradient(180deg, #7c3aed 0%, #4f46e5 100%)"
                          }}
                        >
                          <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-t-xl" />
                        </div>
                      </div>
                      <span className={`text-xs font-medium text-center leading-tight ${
                        isDark ? "text-slate-500" : "text-gray-600"
                      }`}>
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
 
        {/* ── PROJECT PROGRESS ────────────────────────────────────── */}
        <div className={`rounded-2xl p-6 border transition-all duration-300 hover:shadow-lg ${
          isDark
            ? "bg-slate-900 border-slate-800 hover:shadow-slate-950"
            : "bg-white border-gray-100 hover:shadow-md"
        }`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className={`font-bold text-xl ${isDark ? "text-white" : "text-[#001d55]"}`}>
                Project Progress
              </h2>
              <p className={`text-sm mt-1 ${isDark ? "text-slate-500" : "text-gray-500"}`}>
                Top 5 proyek berdasarkan progress tertinggi
              </p>
            </div>
            <div className={`px-3 py-1 rounded-full ${
              isDark ? "bg-blue-900 border border-blue-800" : "bg-blue-50"
            }`}>
              <span className={`text-xs font-semibold ${isDark ? "text-blue-300" : "text-[#001d55]"}`}>
                {totalProjects} Projects
              </span>
            </div>
          </div>
 
          {loading ? (
            <div className={`text-center py-8 text-sm ${isDark ? "text-slate-600" : "text-gray-400"}`}>
              Memuat data...
            </div>
          ) : topProjects.length === 0 ? (
            <div className={`text-center py-8 text-sm ${isDark ? "text-slate-600" : "text-gray-400"}`}>
              Belum ada project
            </div>
          ) : (
            <div className="space-y-5">
              {topProjects.map((p) => (
                <div key={p.id} className="group">
                  <div className="flex justify-between mb-2 flex-wrap gap-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`font-semibold text-sm ${isDark ? "text-white" : "text-gray-800"}`}>
                        {p.name}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${
                        isDark
                          ? "bg-slate-800 text-slate-400 border-slate-700"
                          : "bg-gray-100 text-gray-500 border-gray-200"
                      }`}>
                        {p.position}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        p.decision === "approved"
                          ? isDark ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                                   : "bg-green-100 text-green-700"
                          : p.decision === "rejected"
                          ? isDark ? "bg-red-950 text-red-400 border border-red-800"
                                   : "bg-red-100 text-red-700"
                          : isDark ? "bg-amber-950 text-amber-400 border border-amber-800"
                                   : "bg-yellow-50 text-yellow-700"
                      }`}>
                        {p.decision || "pending"}
                      </span>
                    </div>
                    <div className={`text-sm font-bold ${isDark ? "text-blue-400" : "text-[#001d55]"}`}>
                      {p.progress}%
                    </div>
                  </div>
                  <div className={`relative w-full h-2 rounded-full overflow-hidden ${
                    isDark ? "bg-slate-800" : "bg-gray-100"
                  }`}>
                    <div
                      className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${p.progress}%`, background: progressGradient }}
                    >
                      <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent" />
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

// ─── NOTIFICATION BELL COMPONENT ──────────────────────────────────────────────
function NotificationBell({ theme, isDark }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const bellRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    const fetchNotif = async () => {
      try {
        const res = await fetch("/api/notifications?limit=10");
        const json = await res.json();
        if (!cancelled && json.success) {
          setNotifications(json.data || []);
          setUnreadCount(json.unreadCount || 0);
        }
      } catch (err) {
        console.error("Fetch notif error:", err);
      }
    };
    fetchNotif();
    const interval = setInterval(fetchNotif, 30000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAll: true }),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Mark all read error:", err);
    }
  };

  const handleNotifClick = async (notif) => {
    if (!notif.isRead) {
      try {
        await fetch("/api/notifications", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: notif.id }),
        });
        setNotifications((prev) =>
          prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (err) {
        console.error("Mark read error:", err);
      }
    }
    setShowDropdown(false);
    if (notif.link) {
      window.location.assign(notif.link);
    }
  };

  const formatTime = (iso) => {
    try {
      const d = new Date(iso);
      const now = new Date();
      const diff = now - d;
      if (diff < 60000) return "baru saja";
      if (diff < 3600000) return `${Math.floor(diff / 60000)}m lalu`;
      if (diff < 86400000) return `${Math.floor(diff / 3600000)}j lalu`;
      return d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
    } catch {
      return "";
    }
  };

  return (
    <div className="relative" ref={bellRef}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all group ${
          isDark ? "bg-slate-800 hover:bg-slate-700" : "bg-gray-50 hover:bg-gray-100"
        }`}
      >
        <FaBell className={isDark ? "text-slate-400 group-hover:text-blue-400" : "text-gray-600 group-hover:text-[#001d55]"} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full px-1">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className={`absolute right-0 top-12 w-80 md:w-96 rounded-2xl shadow-xl border overflow-hidden z-50 ${
          isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
        }`}>
          <div className={`flex items-center justify-between px-4 py-3 border-b ${
            isDark ? "border-slate-700" : "border-gray-200"
          }`}>
            <h3 className={`font-semibold text-sm ${isDark ? "text-white" : "text-gray-800"}`}>
              Notifikasi
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className={`flex items-center gap-1 text-xs font-medium ${
                  isDark ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-800"
                }`}
              >
                <FaCheckDouble size={12} />
                Tandai semua dibaca
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className={`px-4 py-8 text-center text-sm ${isDark ? "text-slate-500" : "text-gray-400"}`}>
                Tidak ada notifikasi
              </div>
            ) : (
              notifications.map((notif) => (
                <button
                  key={notif.id}
                  onClick={() => handleNotifClick(notif)}
                  className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors ${
                    !notif.isRead
                      ? isDark ? "bg-blue-900/20 hover:bg-blue-900/30" : "bg-blue-50 hover:bg-blue-100"
                      : isDark ? "hover:bg-slate-700" : "hover:bg-gray-50"
                  } ${isDark ? "border-slate-700" : "border-gray-100"} border-b last:border-b-0`}
                >
                  <span className="text-lg flex-shrink-0 mt-0.5">{notif.icon || "🔔"}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${isDark ? "text-white" : "text-gray-800"} truncate`}>
                      {notif.title}
                    </p>
                    {notif.message && (
                      <p className={`text-xs mt-0.5 line-clamp-2 ${isDark ? "text-slate-400" : "text-gray-500"}`}>
                        {notif.message}
                      </p>
                    )}
                    <p className={`text-[10px] mt-1 ${isDark ? "text-slate-500" : "text-gray-400"}`}>
                      {formatTime(notif.createdAt)}
                    </p>
                  </div>
                  {!notif.isRead && (
                    <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-2"></span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}