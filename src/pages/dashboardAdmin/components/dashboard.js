import React from "react";
import { FaSearch, FaBell, FaUserCircle } from "react-icons/fa";

export default function Dashboard() {
  const stats = [
    { title: "Total Projects", value: "124" },
    { title: "Active Tasks", value: "38" },
    { title: "Open Issues", value: "12" },
    { title: "Team Members", value: "48" },
  ];

  const projects = [
    { name: "ERP System", team: "Frontend", status: "Active", progress: 80 },
    { name: "HR Dashboard", team: "Backend", status: "Pending", progress: 45 },
    { name: "Mobile Apps", team: "Mobile", status: "Review", progress: 92 },
  ];

  // Data untuk grafik batang
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
    <>
      {/* HEADER */}
      <header className="bg-white/80 backdrop-blur-md h-20 px-6 flex items-center justify-between shadow-sm border-b border-gray-100">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#001d55] to-[#003d9e] bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-sm text-gray-500">Welcome back, Administrator</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center bg-gray-50 px-4 py-2 rounded-xl border border-gray-200">
            <FaSearch className="text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent outline-none ml-3"
            />
          </div>

          <button className="w-11 h-11 rounded-xl bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-all">
            <FaBell className="text-gray-600" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#001d55] to-[#003d9e] flex items-center justify-center">
              <FaUserCircle size={36} className="text-white" />
            </div>
            <div className="hidden md:block">
              <h3 className="font-semibold text-gray-800">Admin</h3>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>
        </div>
      </header>

      {/* BODY */}
      <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
          {stats.map((item, index) => (
            <div 
              key={item.title} 
              className="group bg-white rounded-2xl shadow-sm p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
            >
              <p className="text-gray-500 text-sm">{item.title}</p>
              <h2 className="text-4xl font-bold mt-2 bg-gradient-to-r from-[#001d55] to-[#003d9e] bg-clip-text text-transparent">
                {item.value}
              </h2>
            </div>
          ))}
        </div>

        {/* GRAFIK BATANG MODERN DENGAN GRADIEN */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Grafik Program */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Program Analytics</p>
                <h2 className="mt-2 text-3xl font-bold bg-gradient-to-r from-[#001d55] to-[#003d9e] bg-clip-text text-transparent">
                  {programStats.reduce((sum, item) => sum + item.count, 0)} Program
                </h2>
                <p className="mt-1 text-sm text-gray-500">Distribusi program berdasarkan kategori</p>
              </div>
              <div className="rounded-full bg-gradient-to-r from-[#001d55] to-[#003d9e] px-4 py-2 text-white text-sm font-semibold shadow-md">
                Total: {programStats.reduce((sum, item) => sum + item.count, 0)}
              </div>
            </div>

            <div className="mt-6 flex items-end justify-between gap-4 h-80">
              {programStats.map((item, idx) => {
                const heightPercent = (item.count / maxProgram) * 100;
                return (
                  <div key={item.label} className="flex flex-col items-center justify-end gap-3 flex-1 h-full group">
                    <span className="text-lg font-bold text-gray-700 group-hover:scale-110 transition-transform">
                      {item.count}
                    </span>
                    <div className="relative w-full bg-gray-100 rounded-2xl overflow-hidden flex items-end flex-1 group cursor-pointer">
                      <div
                        className="absolute bottom-0 left-0 w-full transition-all duration-500 group-hover:opacity-90 rounded-2xl"
                        style={{ 
                          height: `${heightPercent}%`,
                          background: `linear-gradient(180deg, #003d9e 0%, #001d55 100%)`
                        }}
                      >
                        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-t-2xl"></div>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-600 text-center">{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Grafik Member */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Member Analytics</p>
                <h2 className="mt-2 text-3xl font-bold bg-gradient-to-r from-[#001d55] to-[#003d9e] bg-clip-text text-transparent">
                  {memberStats.reduce((sum, item) => sum + item.count, 0)} Anggota
                </h2>
                <p className="mt-1 text-sm text-gray-500">Distribusi member berdasarkan posisi</p>
              </div>
              <div className="rounded-full bg-gradient-to-r from-[#001d55] to-[#003d9e] px-4 py-2 text-white text-sm font-semibold shadow-md">
                Total: {memberStats.reduce((sum, item) => sum + item.count, 0)}
              </div>
            </div>

            <div className="mt-6 flex items-end justify-between gap-4 h-80">
              {memberStats.map((item, idx) => {
                const heightPercent = (item.count / maxMember) * 100;
                return (
                  <div key={item.label} className="flex flex-col items-center justify-end gap-3 flex-1 h-full group">
                    <span className="text-lg font-bold text-gray-700 group-hover:scale-110 transition-transform">
                      {item.count}
                    </span>
                    <div className="relative w-full bg-gray-100 rounded-2xl overflow-hidden flex items-end flex-1 group cursor-pointer">
                      <div
                        className="absolute bottom-0 left-0 w-full transition-all duration-500 group-hover:opacity-90 rounded-2xl"
                        style={{ 
                          height: `${heightPercent}%`,
                          background: `linear-gradient(180deg, #003d9e 0%, #001d55 100%)`
                        }}
                      >
                        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-t-2xl"></div>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-600 text-center">{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Project Progress - Modern Style */}
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100">
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

          <div className="space-y-6">
            {projects.map((p, idx) => (
              <div key={p.name} className="group">
                <div className="flex justify-between mb-2">
                  <div className="font-semibold text-gray-800">{p.name}</div>
                  <div className="text-sm font-bold text-[#001d55]">{p.progress}%</div>
                </div>
                <div className="relative w-full bg-gray-100 h-3 rounded-full overflow-hidden">
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
    </>
  );
}