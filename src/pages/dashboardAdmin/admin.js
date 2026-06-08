"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaBars, FaUserCircle } from "react-icons/fa";
import {
  MdDashboard,
  MdFolder,
  MdTask,
  MdAnalytics,
  MdPeople,
} from "react-icons/md";
import { RiGitPullRequestLine } from "react-icons/ri";

import {
  HiCog6Tooth,
  HiArrowRightOnRectangle,
  HiChevronDown,
  HiUserCircle,
  HiSun,
  HiShieldCheck,
  HiKey,
} from "react-icons/hi2";

// PAGES
import Dashboard from "./components/dashboard";
import UploadProjectPage from "./components/project";
import Progres from "./components/progres";
import Revision from "./components/revision";
import MembersModul from "./components/membersModul";
import Analytics from "./components/analytics";

// SETTINGS
import SettingsTema from "../settings/settingsTema";
import SettingsProfile from "../settings/profile";
import ChangePassword from "../settings/changepassword";

export default function DashboardAdmin() {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("Dashboard");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [theme, setTheme] = useState("light");

  const router = useRouter();

  const handleLogout = () => {
    router.push("/");
  };

  const menus = [
    { icon: <MdDashboard size={22} />, label: "Dashboard" },
    { icon: <MdFolder size={22} />, label: "Projects" },
    { icon: <MdTask size={22} />, label: "Progress" },
    { icon: <RiGitPullRequestLine size={22} />, label: "Revision Issues" },
    { icon: <MdPeople size={22} />, label: "MEMBER & MODUL" },
    { icon: <MdAnalytics size={22} />, label: "Analytics" },
  ];

  const settingsSubMenus = [
    { icon: <HiUserCircle size={18} />, label: "Settings Profile" },
    { icon: <HiSun size={18} />, label: "Settings Tema" },
    { icon: <HiShieldCheck size={18} />, label: "Settings Akun" },
    { icon: <HiKey size={18} />, label: "Change Password" },
  ];

  return (
    <div
      className={`h-screen flex flex-col md:flex-row overflow-hidden transition-all duration-300 ${
        theme === "dark"
          ? "bg-slate-950 text-white"
          : "bg-[#eef2f7] text-black"
      }`}
    >
      {/* SIDEBAR */}
      <aside
        className={`h-auto md:h-screen flex flex-col transition-all duration-300
        ${collapsed ? "w-full md:w-20" : "w-full md:w-72"}
        
        /* 🔥 DARK BLUE GRADIENT PREMIUM */
        bg-gradient-to-b from-[#050b1f] via-[#071a3a] to-[#020617]

        text-white shadow-2xl shadow-black/50
        `}
      >
        {/* HEADER */}
        <div className="h-16 md:h-20 px-4 md:px-5 border-b border-white/10 flex items-center justify-between">
          {!collapsed && (
            <div>
              <h1 className="font-bold text-lg md:text-xl flex items-center gap-2">
                <img
                  src="/images/oip.png"
                  alt="Logo"
                  className="w-30 inline-block"
                />
                
              </h1>
              <p className="text-xs text-blue-200">
                Admin Dashboard
              </p>
            </div>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center"
          >
            <FaBars />
          </button>
        </div>

        {/* MENU */}
        <div className="flex-1 px-2 md:px-3 py-3 md:py-5 overflow-y-auto">
          {menus.map((menu) => (
            <button
              key={menu.label}
              onClick={() => setSelectedMenu(menu.label)}
              className={`w-full flex items-center gap-3 md:gap-4 px-3 md:px-4 py-2 md:py-3 rounded-xl mb-1 md:mb-2 text-sm md:text-base transition ${
                selectedMenu === menu.label
                  ? "bg-white/15"
                  : "hover:bg-white/5"
              }`}
            >
              {menu.icon}
              {!collapsed && <span>{menu.label}</span>}
            </button>
          ))}

          {/* SETTINGS */}
          <div className="mt-4">
            <button
              onClick={() => setSettingsOpen(!settingsOpen)}
              className="w-full flex items-center gap-3 md:gap-4 px-3 md:px-4 py-2 md:py-3 rounded-xl hover:bg-white/5"
            >
              <HiCog6Tooth size={22} />
              {!collapsed && (
                <>
                  <span className="flex-1 text-left">Settings</span>
                  <HiChevronDown
                    className={`transition ${
                      settingsOpen ? "rotate-180" : ""
                    }`}
                  />
                </>
              )}
            </button>

            {settingsOpen && (
              <div className="pl-6 md:pl-8 flex flex-col gap-1 pt-2">
                {settingsSubMenus.map((sub) => (
                  <button
                    key={sub.label}
                    onClick={() => setSelectedMenu(sub.label)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
                      selectedMenu === sub.label
                        ? "bg-white/15"
                        : "hover:bg-white/5"
                    }`}
                  >
                    {sub.icon}
                    <span>{sub.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* LOGOUT */}
        <div className="px-3 pb-3 mt-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 md:gap-4 px-3 md:px-4 py-2 md:py-3 rounded-xl text-red-300 hover:bg-red-500/20 transition"
          >
            <HiArrowRightOnRectangle size={22} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>

        {/* USER */}
        <div className="border-t border-white/10 p-3 md:p-4">
          <div className="flex items-center gap-3">
            <FaUserCircle size={36} />
            {!collapsed && (
              <div>
                <h3 className="font-semibold text-sm md:text-base">
                  Administrator
                </h3>
                <p className="text-xs text-blue-200">
                  Super Admin
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* CONTENT */}
      <main className="flex-1 overflow-auto p-3 md:p-6">
        {selectedMenu === "Dashboard" && <Dashboard />}
        {selectedMenu === "Projects" && <UploadProjectPage />}
        {selectedMenu === "Progress" && <Progres />}
        {selectedMenu === "Revision Issues" && <Revision />}
        {selectedMenu === "MEMBER & MODUL" && <MembersModul />}
        {selectedMenu === "Analytics" && <Analytics />}

        {selectedMenu === "Settings Profile" && <SettingsProfile />}

        {selectedMenu === "Settings Tema" && (
          <SettingsTema theme={theme} setTheme={setTheme} />
        )}

        {selectedMenu === "Settings Akun" && (
          <div className="p-6 md:p-8 font-bold text-lg md:text-xl">
            Settings Akun
          </div>
        )}

        {selectedMenu === "Change Password" && <ChangePassword />}
      </main>
    </div>
  );
}