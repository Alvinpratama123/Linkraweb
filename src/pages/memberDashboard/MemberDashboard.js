// src/pages/memberDashboard/MemberDashboard.js
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FaBars, FaUserCircle } from "react-icons/fa";
import {
  HiCog6Tooth,
  HiChevronDown,
  HiArrowRightOnRectangle,
} from "react-icons/hi2";
import { MdDashboard, MdFolder, MdTask, MdAnalytics } from "react-icons/md";
import { RiGitPullRequestLine } from "react-icons/ri";


// Components
import Dashboard from "../dashboardAdmin/components/dashboard";
import UploadProjectPage from "../dashboardAdmin/components/project";
import Progres from "../dashboardAdmin/components/progres";
import Revision from "../dashboardAdmin/components/revision";
import Analytics from "../dashboardAdmin/components/analytics";
// Settings
import SettingsProfile from "../settings/profile";
import SettingsTema from "../settings/settingsTema";
import ChangePassword from "../settings/changepassword";

export default function MembersDashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("Dashboard");
  
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [theme, setTheme] = useState("light");
  
  const router = useRouter();

  // Ambil data user dari API saat load
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/auth/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (!response.ok) {
          console.error("Failed to fetch user:", data.message);
          router.push("/components/login");
          return;
        }
        

        if (data.success && data.user) {
          setUserData(data.user);
          localStorage.setItem("user", JSON.stringify(data.user));
          
          if (data.user.role === "ADMIN") {
            router.push("/dashboardAdmin/admin");
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUserData(parsedUser);
          
          if (parsedUser.role === "ADMIN") {
            router.push("/dashboardAdmin/admin");
          }
        } else {
          router.push("/components/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  // Fungsi untuk menghapus semua data di storage
  const clearAllStorage = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("auth_token");
    localStorage.removeItem("refresh_token");
    
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes("auth") || key.includes("token") || key.includes("user"))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && (key.includes("auth") || key.includes("token") || key.includes("user"))) {
        sessionStorage.removeItem(key);
      }
    }
    
    document.cookie.split(";").forEach(cookie => {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
    });
  };

  // Fungsi logout
  const handleLogout = async () => {
    const confirm = window.confirm("Apakah Anda yakin ingin logout?");
    if (!confirm) return;

    try {
      setLoggingOut(true);
      toast.loading("Logging out...", { id: "logout" });

      await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      clearAllStorage();
      setUserData(null);
      toast.success("Logout berhasil!");
      router.push("/components/login");
      
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Terjadi kesalahan saat logout");
      clearAllStorage();
      router.push("/components/login");
    } finally {
      setLoggingOut(false);
    }
  };

  // Menu untuk MEMBER
  const memberMenus = [
    { icon: <MdDashboard size={22} />, label: "Dashboard" },
    { icon: <MdFolder size={22} />, label: "Projects" },
    { icon: <MdTask size={22} />, label: "Progress" },
    { icon: <RiGitPullRequestLine size={22} />, label: "Revision Issues" },
    { icon: <MdAnalytics size={22} />, label: "Analytics" },
  ];

  const settingsSubMenus = [
    { label: "Profile" },
    { label: "Change Password" },
  ];

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden text-slate-800">
      <aside
        className={`
          h-screen flex flex-col transition-all duration-300
          ${collapsed ? "w-20" : "w-72"}
          bg-gradient-to-b
          from-[#0f172a]
          via-[#14213d]
          to-[#1e3a5f]
          text-white
        `}
      >
        {/* HEADER */}
        <div className="h-20 px-5 border-b border-white/10 flex items-center justify-between">
          {!collapsed && (
            <div>
              <img
                src="/images/oip.png"
                alt="Logo"
                className="h-10 w-auto"
              />
              <p className="text-xs text-blue-200 mt-1">
                Member Dashboard
              </p>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <FaBars size={20} />
          </button>
        </div>

        {/* MENU */}
        <div className="flex-1 px-2 md:px-3 py-3 md:py-5 overflow-y-auto">
          {memberMenus.map((menu) => (
            <button
              key={menu.label}
              onClick={() => setSelectedMenu(menu.label)}
              className={`w-full flex items-center gap-3 md:gap-4 px-3 md:px-4 py-2 md:py-3 rounded-xl mb-1 md:mb-2 text-sm md:text-base transition-all ${
                selectedMenu === menu.label
                  ? "bg-white/15"
                  : "hover:bg-white/5"
              }`}
            >
              {menu.icon}
              {!collapsed && <span>{menu.label}</span>}
            </button>
          ))}

          {/* Settings Menu */}
          <button
            onClick={() => setSettingsOpen(!settingsOpen)}
            className={`w-full flex items-center justify-between px-3 md:px-4 py-2 md:py-3 rounded-xl mb-1 md:mb-2 text-sm md:text-base transition-all hover:bg-white/5`}
          >
            <div className="flex items-center gap-3 md:gap-4">
              <HiCog6Tooth size={22} />
              {!collapsed && <span>Settings</span>}
            </div>
            {!collapsed && (
              <HiChevronDown
                size={18}
                className={`transition-transform duration-200 ${
                  settingsOpen ? "rotate-180" : ""
                }`}
              />
            )}
          </button>

          {settingsOpen && !collapsed && (
            <div className="pl-8 mt-2 space-y-1">
              {settingsSubMenus.map((item) => (
                <button
                  key={item.label}
                  onClick={() => setSelectedMenu(`Settings ${item.label}`)}
                  className="block w-full text-left py-2 px-3 text-sm rounded-lg hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* LOGOUT */}
        <div className="px-3 pb-3 mt-4">
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center gap-3 md:gap-4 px-3 md:px-4 py-2 md:py-3 rounded-xl text-red-300 hover:bg-red-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loggingOut ? (
              <>
                <svg className="animate-spin h-5 w-5 text-red-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {!collapsed && <span>Logging out...</span>}
              </>
            ) : (
              <>
                <HiArrowRightOnRectangle size={22} />
                {!collapsed && <span>Logout</span>}
              </>
            )}
          </button>
        </div>

        {/* USER PROFILE */}
        <div className="border-t border-white/10 p-3 md:p-4">
          <div className="flex items-center gap-3">
            {userData?.photo ? (
              <img
                src={userData.photo}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                {userData?.name?.charAt(0)?.toUpperCase() || "M"}
              </div>
            )}
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm md:text-base truncate">
                  {userData?.name || "Member"}
                </h3>
                <p className="text-xs text-blue-300 truncate">
                  {userData?.role || "Member"}
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* CONTENT */}
      <main className="flex-1 overflow-auto p-3 md:p-6 bg-slate-50">
        {selectedMenu === "Dashboard" && <Dashboard userData={userData} />}
        {selectedMenu === "Progress" && <Progres />}
        {selectedMenu === "Revision Issues" && (
          <Revision 
            userRole={userData?.role || "FRONTEND"} 
            userName={userData?.name || "User"} 
          />
        )}
        {selectedMenu === "Analytics" && <Analytics />}
        {selectedMenu === "Projects" && <UploadProjectPage />}

        {/* Settings */}
        {selectedMenu === "Settings Profile" && (
          <SettingsProfile userData={userData} onUpdate={setUserData} />
        )}
        {selectedMenu === "Settings Tema" && (
          <SettingsTema theme={theme} setTheme={setTheme} />
        )}
        {selectedMenu === "Settings Change Password" && <ChangePassword />}
      </main>
    </div>
  );
}