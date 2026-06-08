"use client";

import { useEffect } from "react";
import { FaSearch, FaBell, FaUserCircle } from "react-icons/fa";

export default function Dashboard({ theme }) {
  // ✅ APPLY DARK MODE GLOBAL
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

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

  const statusColors = {
    Active:
      "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    Pending:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
    Review:
      "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100 transition-colors duration-300">

      {/* HEADER */}
      <header className="bg-white dark:bg-gray-800 h-20 px-6 flex items-center justify-between shadow-md">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Welcome back, Administrator
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-xl">
            <FaSearch className="text-gray-400 dark:text-gray-300" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent outline-none ml-3 text-sm"
            />
          </div>

          <button className="w-11 h-11 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition">
            <FaBell />
          </button>

          <div className="flex items-center gap-3">
            <FaUserCircle size={40} className="text-[#001d55]" />
            <div className="hidden md:block">
              <h3 className="font-semibold">Admin</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Administrator
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* BODY */}
      <div className="p-6">

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
          {stats.map((item) => (
            <div
              key={item.title}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 hover:shadow-md transition"
            >
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {item.title}
              </p>
              <h2 className="text-4xl font-bold mt-2 text-[#001d55] dark:text-blue-300">
                {item.value}
              </h2>
            </div>
          ))}
        </div>

        {/* CONTENT */}
        <div className="grid xl:grid-cols-3 gap-6">

          {/* LEFT */}
          <div className="xl:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
              <h2 className="font-bold text-lg mb-5">Recent Projects</h2>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300">
                      <th className="text-left py-3">Project</th>
                      <th className="text-left py-3">Team</th>
                      <th className="text-left py-3">Status</th>
                      <th className="text-left py-3">Progress</th>
                    </tr>
                  </thead>

                  <tbody>
                    {projects.map((p) => (
                      <tr
                        key={p.name}
                        className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                      >
                        <td className="py-4">{p.name}</td>
                        <td>{p.team}</td>
                        <td>
                          <span
                            className={`${statusColors[p.status]} px-3 py-1 rounded-full text-xs`}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td>{p.progress}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
            <h2 className="font-bold text-lg mb-5">Project Progress</h2>

            <div className="space-y-4">
              {projects.map((p) => (
                <div key={p.name}>
                  <div className="flex justify-between mb-2">
                    <div className="font-medium">{p.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {p.progress}%
                    </div>
                  </div>

                  <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full">
                    <div
                      className="h-2 rounded-full bg-[#001d55] dark:bg-blue-400 transition-all duration-500"
                      style={{ width: `${p.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}