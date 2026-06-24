// src/pages/memberDashboard/MemberDashboard.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaBars, FaTimes } from "react-icons/fa";
import {
  MdDashboard,
  MdFolder,
  MdTask,
  MdAnalytics,
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

// Components
import Dashboard from "../dashboardAdmin/components/dashboard";
import UploadProjectPage from "../dashboardAdmin/components/project";
import Progres from "../dashboardAdmin/components/progres";
import Revision from "../dashboardAdmin/components/revision";
import Analytics from "../dashboardAdmin/components/analytics";
import Profile from "../settings/profile";
import SettingsTema from "../settings/settingsTema";
import ChangePassword from "../settings/changepassword";

export default function MembersDashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("Dashboard");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [theme, setTheme] = useState("light");
  const [loggingOut, setLoggingOut] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const router = useRouter();

  const getDisplayPosition = (user) => {
    if (!user) return "Member";
    if (user.position) return user.position; // 🔥 Tampilkan position
    return user.role || "Member";
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/auth/me");
        const data = await response.json();

        if (!response.ok) {
          router.push("/components/login");
          return;
        }

        if (data.success && data.user) {
          setUserData(data.user);
          localStorage.setItem("user", JSON.stringify(data.user));
          
          if (data.user.role?.toUpperCase() === "ADMIN") {
            router.push("/dashboardAdmin/admin");
          }
        }
      } catch (error) {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUserData(parsedUser);
          if (parsedUser.role?.toUpperCase() === "ADMIN") {
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

  const clearAllStorage = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("auth_token");
    localStorage.removeItem("refresh_token");
    
    document.cookie.split(";").forEach((cookie) => {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
    });
  };

  const handleLogout = async () => {
    if (!confirm("Apakah Anda yakin ingin logout?")) return;

    try {
      setLoggingOut(true);
      toast.loading("Logging out...", { id: "logout" });

      await fetch("/api/auth/logout", { method: "POST" });
      clearAllStorage();
      setUserData(null);
      toast.success("Logout berhasil!", { id: "logout" });
      router.push("/components/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Terjadi kesalahan saat logout", { id: "logout" });
      clearAllStorage();
      router.push("/components/login");
    } finally {
      setLoggingOut(false);
    }
  };

  const memberMenus = [
    { icon: <MdDashboard size={22} />, label: "Dashboard" },
    { icon: <MdFolder size={22} />, label: "Projects" },
    { icon: <MdTask size={22} />, label: "Progress" },
    { icon: <RiGitPullRequestLine size={22} />, label: "Revision Issues" },
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
          <p className="mt-4 text-gray-600">Loading member dashboard...</p>
        </div>
      </div>
    );
  }

  const SidebarContent = ({ isMobile = false }) => (
    <div className={`flex flex-col h-full ${isMobile ? "pt-4" : ""}`}>
      <div className={`h-16 md:h-20 px-4 md:px-5 border-b border-white/10 flex items-center justify-between ${isMobile ? "mb-2" : ""}`}>
        {(!collapsed || isMobile) && (
          <h1 className="font-bold text-lg md:text-xl"><img src="/images/oip.png" alt="Logo" className="h-20 w-30" /></h1>
        )}
        {isMobile ? (
          <button onClick={() => setMobileSidebarOpen(false)} className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white">
            <FaTimes size={20} />
          </button>
        ) : (
          <button onClick={() => setCollapsed(!collapsed)} className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center">
            <FaBars />
          </button>
        )}
      </div>

      <div className="flex-1 px-2 md:px-3 py-3 md:py-5 overflow-y-auto">
        {memberMenus.map((menu) => (
          <button
            key={menu.label}
            onClick={() => {
              setSelectedMenu(menu.label);
              if (isMobile) setMobileSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 md:gap-4 px-3 md:px-4 py-2 md:py-3 rounded-xl mb-1 md:mb-2 text-sm md:text-base transition-all ${
              selectedMenu === menu.label ? "bg-white/15" : "hover:bg-white/5"
            }`}
          >
            {menu.icon}
            {(!collapsed || isMobile) && <span>{menu.label}</span>}
          </button>
        ))}

        <div className="mt-4">
          <button onClick={() => setSettingsOpen(!settingsOpen)} className="w-full flex items-center gap-3 md:gap-4 px-3 md:px-4 py-2 md:py-3 rounded-xl hover:bg-white/5 transition-all">
            <HiCog6Tooth size={22} />
            {(!collapsed || isMobile) && (
              <>
                <span className="flex-1 text-left">Settings</span>
                <HiChevronDown className={`transition-transform duration-300 ${settingsOpen ? "rotate-180" : ""}`} />
              </>
            )}
          </button>

          {settingsOpen && (
            <div className="pl-6 md:pl-8 flex flex-col gap-1 pt-2">
              {settingsSubMenus.map((sub) => (
                <button
                  key={sub.label}
                  onClick={() => {
                    setSelectedMenu(sub.label);
                    if (isMobile) setMobileSidebarOpen(false);
                  }}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                    selectedMenu === sub.label ? "bg-white/15" : "hover:bg-white/5"
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

      <div className="px-3 pb-3 mt-4">
        <button onClick={handleLogout} disabled={loggingOut} className="w-full flex items-center gap-3 md:gap-4 px-3 md:px-4 py-2 md:py-3 rounded-xl text-red-300 hover:bg-red-500/20 transition-all disabled:opacity-50">
          {loggingOut ? (
            <>
              <svg className="animate-spin h-5 w-5 text-red-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {(!collapsed || isMobile) && <span>Logging out...</span>}
            </>
          ) : (
            <>
              <HiArrowRightOnRectangle size={22} />
              {(!collapsed || isMobile) && <span>Logout</span>}
            </>
          )}
        </button>
      </div>

      <div className="border-t border-white/10 p-3 md:p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
            {userData?.name?.charAt(0)?.toUpperCase() || "M"}
          </div>
          {(!collapsed || isMobile) && (
            <div className="flex-1">
              <h3 className="font-semibold text-sm md:text-base truncate">{userData?.name || "Member"}</h3>
              <p className="text-xs text-blue-300">{getDisplayPosition(userData)}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Toaster position="top-right" />
      <div className={`h-screen flex flex-col md:flex-row overflow-hidden transition-all duration-300 ${
        theme === "dark" ? "bg-slate-950 text-white" : "bg-[#eef2f7] text-black"
      }`}>
        <aside className={`hidden md:flex flex-col transition-all duration-300 ${
          collapsed ? "w-20" : "w-72"
        } bg-gradient-to-b from-[#050b1f] via-[#071a3a] to-[#020617] text-white shadow-2xl flex-shrink-0 h-screen sticky top-0`}>
          <SidebarContent isMobile={false} />
        </aside>

        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden" onClick={() => setMobileSidebarOpen(false)} />
        )}
        <div className={`fixed top-0 left-0 z-50 h-full w-80 bg-gradient-to-b from-[#050b1f] via-[#071a3a] to-[#020617] text-white shadow-2xl transition-transform duration-300 md:hidden ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
          <SidebarContent isMobile={true} />
        </div>

        <main className="flex-1 overflow-auto p-3 md:p-6 relative">
          <div className={`md:hidden flex items-center justify-between mb-4 sticky top-0 z-30 py-2 ${
            theme === 'dark' ? 'bg-slate-950' : 'bg-[#eef2f7]'
          }`}>
            <button onClick={() => setMobileSidebarOpen(true)} className="p-2 rounded-lg bg-white dark:bg-slate-800 shadow-md">
              <FaBars size={22} className="text-[#001d55] dark:text-white" />
            </button>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">Posisi</p>
                <p className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-[#001d55]'}`}>
                  {getDisplayPosition(userData)}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                {userData?.name?.charAt(0)?.toUpperCase() || "M"}
              </div>
            </div>
          </div>

          {selectedMenu === "Dashboard" && <Dashboard theme={theme} setTheme={setTheme} />}
          {selectedMenu === "Progress" && <Progres theme={theme} setTheme={setTheme} />}
          {selectedMenu === "Revision Issues" && (
            <Revision userRole={userData?.role || "FRONTEND"} userName={userData?.name || "User"} theme={theme} />
          )}
          {selectedMenu === "Analytics" && <Analytics theme={theme} setTheme={setTheme} />}
          {selectedMenu === "Projects" && <UploadProjectPage theme={theme} setTheme={setTheme} />}
          {selectedMenu === "Settings Profile" && (
            <Profile userData={userData} onUpdate={setUserData} theme={theme} setTheme={setTheme} />
          )}
          {selectedMenu === "Settings Tema" && <SettingsTema theme={theme} setTheme={setTheme} />}
          {selectedMenu === "Change Password" && <ChangePassword theme={theme} setTheme={setTheme} />}
        </main>
      </div>
    </>
  );
}