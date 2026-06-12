"use client";

import { useState, useEffect } from "react";
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
  HiKey,
} from "react-icons/hi2";
import toast, { Toaster } from "react-hot-toast";

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
  const [loggingOut, setLoggingOut] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

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
          router.push("/login");
          return;
        }

        if (data.success && data.user) {
          setUserData(data.user);
          localStorage.setItem("user", JSON.stringify(data.user));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUserData(JSON.parse(storedUser));
        } else {
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  // Fungsi untuk menghapus SEMUA data di storage
  const clearAllStorage = () => {
    // Hapus item spesifik
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("auth_token");
    localStorage.removeItem("refresh_token");
    
    // Hapus semua key yang mengandung kata tertentu
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes("auth") || key.includes("token") || key.includes("user"))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    // Hapus sessionStorage
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && (key.includes("auth") || key.includes("token") || key.includes("user"))) {
        sessionStorage.removeItem(key);
      }
    }
    
    // Hapus semua cookie
    document.cookie.split(";").forEach(cookie => {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;domain=localhost";
    });
  };

  // Fungsi logout
  const handleLogout = async () => {
    const confirm = window.confirm("Apakah Anda yakin ingin logout?");
    if (!confirm) return;

    try {
      setLoggingOut(true);
      toast.loading("Logging out...", { id: "logout" });

      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Bersihkan semua storage
      clearAllStorage();
      setUserData(null);

      if (response.ok) {
        toast.success("Logout berhasil!");
      } else {
        toast.error("Logout gagal");
      }
      
      // ✅ PERBAIKAN: Redirect ke /login
      router.push("/components/login");
      
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Terjadi kesalahan saat logout");
      clearAllStorage();
      // ✅ PERBAIKAN: Redirect ke /login
      router.push("/components/login");
    } finally {
      setLoggingOut(false);
    }
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
    { icon: <HiKey size={18} />, label: "Change Password" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '12px',
          },
        }}
      />
      
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
              </div>
            )}

            <button
              onClick={() => setCollapsed(!collapsed)}
              className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
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

            {/* SETTINGS */}
            <div className="mt-4">
              <button
                onClick={() => setSettingsOpen(!settingsOpen)}
                className="w-full flex items-center gap-3 md:gap-4 px-3 md:px-4 py-2 md:py-3 rounded-xl hover:bg-white/5 transition-all"
              >
                <HiCog6Tooth size={22} />
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left">Settings</span>
                    <HiChevronDown
                      className={`transition-transform duration-300 ${
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
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
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

          {/* LOGOUT BUTTON */}
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

          {/* USER PROFILE - Menampilkan Nama User dengan Foto */}
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
                  {userData?.name?.charAt(0)?.toUpperCase() || "A"}
                </div>
              )}
              {!collapsed && (
                <div className="flex-1">
                  <h3 className="font-semibold text-sm md:text-base truncate">
                    {userData?.name || "Administrator"}
                  </h3>
                  <p className="text-xs text-blue-300">
                    {userData?.role === "ADMIN" ? "Super Admin" : userData?.role || "Admin"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* CONTENT */}
        <main className="flex-1 overflow-auto p-3 md:p-6">
          {/* Header Welcome */}
          <div className="mb-6">
           
            
          </div>

          {/* Menu Content */}
          {selectedMenu === "Dashboard" && <Dashboard />}
          {selectedMenu === "Projects" && <UploadProjectPage />}
          {selectedMenu === "Progress" && <Progres />}
          {selectedMenu === "Revision Issues" && <Revision />}
          {selectedMenu === "MEMBER & MODUL" && <MembersModul />}
          {selectedMenu === "Analytics" && <Analytics />}

          {selectedMenu === "Settings Profile" && <SettingsProfile userData={userData} onUpdate={setUserData} />}
          {selectedMenu === "Settings Tema" && (
            <SettingsTema theme={theme} setTheme={setTheme} />
          )}
          {selectedMenu === "Change Password" && <ChangePassword />}
        </main>
      </div>
    </>
  );
}