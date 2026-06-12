import React from "react";
import { FaSearch, FaBell } from "react-icons/fa";

export default function Dashboard({ userData }) {
  // Debug: log data user
  console.log("Dashboard received userData:", userData);
  
  // Ambil nama dari userData, fallback ke localStorage
  const userName = userData?.name || 
                   (typeof window !== 'undefined' && JSON.parse(localStorage.getItem('user') || '{}')?.name) || 
                   "Administrator";
  
  const userPhoto = userData?.photo || 
                    (typeof window !== 'undefined' && JSON.parse(localStorage.getItem('user') || '{}')?.photo) || 
                    null;
  
  const userRole = userData?.role || 
                   (typeof window !== 'undefined' && JSON.parse(localStorage.getItem('user') || '{}')?.role) || 
                   "USER";

  const stats = [
    { title: "Total Projects", value: "124", icon: "📁", trend: "+12%" },
    { title: "Active Tasks", value: "38", icon: "✅", trend: "+5%" },
    { title: "Open Issues", value: "12", icon: "⚠️", trend: "-3%" },
    { title: "Team Members", value: "48", icon: "👥", trend: "+8%" },
  ];

  const projects = [
    { name: "ERP System", team: "Frontend", status: "Active", progress: 80 },
    { name: "HR Dashboard", team: "Backend", status: "Pending", progress: 45 },
    { name: "Mobile Apps", team: "Mobile", status: "Review", progress: 92 },
  ];

  const programStats = [
    { label: 'IoT', count: 14 },
    { label: 'Website', count: 9 },
    { label: 'Mobile App', count: 6 },
    { label: 'API', count: 4 },
  ];

  const memberStats = [
    { label: 'Frontend', count: 8 },
    { label: 'Backend', count: 6 },
    { label: 'UI/UX', count: 5 },
    { label: 'QA', count: 3 },
  ];

  const maxProgram = Math.max(...programStats.map((item) => item.count), 1);
  const maxMember = Math.max(...memberStats.map((item) => item.count), 1);

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* WELCOME BANNER - TANPA ROUNDED DI ATAS */}
      <div className="bg-gradient-to-r from-[#001d55] via-[#002a6e] to-[#003d9e] px-6 py-5 text-white shadow-lg rounded-b-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">
              Selamat Datang, {userName}! 👋
            </h1>
            <p className="text-blue-200 text-sm">
              Semoga harimu menyenangkan. Berikut ringkasan aktivitas hari ini.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-14 h-14 bg-white/15 rounded-full flex items-center justify-center backdrop-blur-sm">
              <span className="text-2xl">🎯</span>
            </div>
          </div>
        </div>
      </div>

      {/* HEADER - Search, Notif, Profile */}
      <header className="bg-white/95 backdrop-blur-md px-6 py-3 flex items-center justify-between shadow-sm border-b border-gray-100 sticky top-0 z-10">
        {/* Search Bar */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center bg-gray-50 px-4 py-2 rounded-xl border border-gray-200 w-80">
            <FaSearch className="text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent outline-none ml-3 w-full text-sm"
            />
          </div>
        </div>

        {/* Right Section - Notifications & Profile */}
        <div className="flex items-center gap-4">
          {/* Notification Bell */}
          <button className="relative w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-all group">
            <FaBell className="text-gray-600 group-hover:text-[#001d55] transition-colors" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* USER PROFILE */}
          <div className="flex items-center gap-3 cursor-pointer group">
            {userPhoto ? (
              <img
                src={userPhoto}
                alt="Profile"
                className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500/20 group-hover:ring-blue-500/50 transition-all"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = `
                    <div class="w-9 h-9 rounded-full bg-gradient-to-br from-[#001d55] to-[#003d9e] flex items-center justify-center">
                      <span class="text-white font-bold text-sm">${userName?.charAt(0)?.toUpperCase() || "A"}</span>
                    </div>
                  `;
                }}
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#001d55] to-[#003d9e] flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {userName?.charAt(0)?.toUpperCase() || "A"}
                </span>
              </div>
            )}
            <div className="hidden md:block">
              <h3 className="font-semibold text-gray-800 text-sm">
                {userName}
              </h3>
              <p className="text-xs text-gray-500">
                {userRole === "ADMIN" ? "Super Admin" : userRole === "USER" ? "User" : userRole}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* BODY - KONTEN UTAMA */}
      <div className="p-6">
        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
          {stats.map((item) => (
            <div 
              key={item.title} 
              className="group bg-white rounded-xl shadow-sm p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{item.icon}</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  item.trend.startsWith('+') ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                }`}>
                  {item.trend}
                </span>
              </div>
              <p className="text-gray-500 text-sm">{item.title}</p>
              <h2 className="text-3xl font-bold mt-1 bg-gradient-to-r from-[#001d55] to-[#003d9e] bg-clip-text text-transparent">
                {item.value}
              </h2>
            </div>
          ))}
        </div>

        {/* CHARTS SECTION */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Program Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-all duration-300 border border-gray-100">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Program Analytics</p>
                <h2 className="mt-1 text-2xl font-bold bg-gradient-to-r from-[#001d55] to-[#003d9e] bg-clip-text text-transparent">
                  {programStats.reduce((sum, item) => sum + item.count, 0)} Program
                </h2>
              </div>
              <div className="rounded-full bg-gradient-to-r from-[#001d55] to-[#003d9e] px-3 py-1 text-white text-xs font-semibold shadow-md">
                Total
              </div>
            </div>

            <div className="mt-6 flex items-end justify-between gap-3 h-64">
              {programStats.map((item) => {
                const heightPercent = (item.count / maxProgram) * 100;
                return (
                  <div key={item.label} className="flex flex-col items-center justify-end gap-2 flex-1 h-full group">
                    <span className="text-sm font-bold text-gray-700 group-hover:scale-110 transition-transform">
                      {item.count}
                    </span>
                    <div className="relative w-full bg-gray-100 rounded-xl overflow-hidden flex items-end flex-1 group cursor-pointer">
                      <div
                        className="absolute bottom-0 left-0 w-full transition-all duration-500 group-hover:opacity-90 rounded-xl"
                        style={{ 
                          height: `${heightPercent}%`,
                          background: `linear-gradient(180deg, #003d9e 0%, #001d55 100%)`
                        }}
                      >
                        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-t-xl"></div>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-gray-600 text-center">{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Member Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-all duration-300 border border-gray-100">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Member Analytics</p>
                <h2 className="mt-1 text-2xl font-bold bg-gradient-to-r from-[#001d55] to-[#003d9e] bg-clip-text text-transparent">
                  {memberStats.reduce((sum, item) => sum + item.count, 0)} Anggota
                </h2>
              </div>
              <div className="rounded-full bg-gradient-to-r from-[#001d55] to-[#003d9e] px-3 py-1 text-white text-xs font-semibold shadow-md">
                Total
              </div>
            </div>

            <div className="mt-6 flex items-end justify-between gap-3 h-64">
              {memberStats.map((item) => {
                const heightPercent = (item.count / maxMember) * 100;
                return (
                  <div key={item.label} className="flex flex-col items-center justify-end gap-2 flex-1 h-full group">
                    <span className="text-sm font-bold text-gray-700 group-hover:scale-110 transition-transform">
                      {item.count}
                    </span>
                    <div className="relative w-full bg-gray-100 rounded-xl overflow-hidden flex items-end flex-1 group cursor-pointer">
                      <div
                        className="absolute bottom-0 left-0 w-full transition-all duration-500 group-hover:opacity-90 rounded-xl"
                        style={{ 
                          height: `${heightPercent}%`,
                          background: `linear-gradient(180deg, #003d9e 0%, #001d55 100%)`
                        }}
                      >
                        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-t-xl"></div>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-gray-600 text-center">{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* PROJECT PROGRESS */}
        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-all duration-300 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-bold text-xl bg-gradient-to-r from-[#001d55] to-[#003d9e] bg-clip-text text-transparent">
                Project Progress
              </h2>
              <p className="text-sm text-gray-500 mt-1">Status perkembangan proyek aktif</p>
            </div>
            <div className="px-3 py-1 bg-blue-50 rounded-full">
              <span className="text-xs font-semibold text-[#001d55]">3 Active Projects</span>
            </div>
          </div>

          <div className="space-y-5">
            {projects.map((p) => (
              <div key={p.name} className="group">
                <div className="flex justify-between mb-2">
                  <div className="font-semibold text-gray-800">{p.name}</div>
                  <div className="text-sm font-bold text-[#001d55]">{p.progress}%</div>
                </div>
                <div className="relative w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ 
                      width: `${p.progress}%`,
                      background: `linear-gradient(90deg, #003d9e 0%, #001d55 100%)`
                    }}
                  >
                    <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}