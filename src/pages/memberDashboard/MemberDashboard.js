// src/pages/memberDashboard/MemberDashboard.js
"use client";

// Halaman dashboard member (non-admin).
// Alur: fetch data user dari /api/auth/me → jika admin, redirect ke admin dashboard
// → sidebar dengan 3 grup menu (Dashboard, Project Management, Reports)
//   — TIDAK ada menu User Management
// → penanganan notifikasi dan URL params sama seperti admin
// → render komponen berdasarkan selectedMenu

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
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
import Dashboard from "../componentsDashboard/dashboard";
import UploadProjectPage from "../componentsDashboard/projectManagement";
import Progres from "../componentsDashboard/projectReview";
import Revision from "../componentsDashboard/issues";
import Analytics from "../componentsDashboard/reports";
import Profile from "../settings/profile";
import SettingsTema from "../settings/settingsTema";

export default function MembersDashboard() {
  const router = useRouter();
  
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("Dashboard");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [theme, setTheme] = useState("light");
  const [loggingOut, setLoggingOut] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);

  const isDark = theme === "dark";

  const getDisplayPosition = (user) => {
    if (!user) return "Member";
    if (user.position) return user.position;
    if (user.role === "ADMIN") return "Administrator";
    return user.role || "Member";
  };

  // 🔥 FUNGSI UNTUK REFRESH DATA
  const refreshData = useCallback(() => {
    console.log('🔄 [MemberDashboard] Refreshing data...');
    setRefreshKey(prev => prev + 1);
    window.dispatchEvent(new CustomEvent('refresh-progress'));
    window.dispatchEvent(new Event('refresh-data'));
  }, []);

  // ✅ CEK PARAMETER URL UNTUK NOTIFIKASI DAN FORCE REFRESH
  useEffect(() => {
    if (!router.isReady) return;

    const tab = Array.isArray(router.query.tab)
      ? router.query.tab[0]
      : router.query.tab;
    const project = Array.isArray(router.query.project)
      ? router.query.project[0]
      : router.query.project;
    const refresh = Array.isArray(router.query.refresh)
      ? router.query.refresh[0]
      : router.query.refresh;

    console.log('📥 [MemberDashboard] URL params:', { tab, project, refresh });

    const tabMap = {
      dashboard: 'Dashboard',
      projects: 'Project Management',
      progress: 'Project Review',
      revision: 'Issues',
      analytics: 'Reports',
      profile: 'Settings Profile',
      settings: 'Settings Profile',
      theme: 'Settings Tema',
    };

    // 🔥 Set menu berdasarkan tab
    if (tab && tabMap[tab]) {
      console.log(`📋 [MemberDashboard] Setting selected menu to: ${tabMap[tab]}`);
      setSelectedMenu(tabMap[tab]);
    } else if (tab === 'progress') {
      setSelectedMenu('Project Review');
    }

    // 🔥 Set project jika ada
    if (project) {
      console.log(`📋 [MemberDashboard] Setting selected project to: ${decodeURIComponent(project)}`);
      setSelectedProject(decodeURIComponent(project));
    }

    // 🔥 Jika ada refresh, lakukan refresh data
    if (refresh) {
      console.log('🔄 [MemberDashboard] Force refresh detected, refreshing data...');
      setTimeout(() => {
        refreshData();
      }, 200);
      
      // 🔥 HAPUS PARAMETER REFRESH DARI URL TAPI PERTAHANKAN TAB DAN PROJECT
      let cleanUrl = '/memberDashboard/MemberDashboard';
      const params = new URLSearchParams();
      if (tab) params.append('tab', tab);
      if (project) params.append('project', project);
      if (params.toString()) {
        cleanUrl += `?${params.toString()}`;
      }
      window.history.replaceState({}, '', cleanUrl);
    }
  }, [router.isReady, router.query.tab, router.query.project, router.query.refresh, refreshData]);

  // 🔥 FETCH NOTIFICATION COUNT
  useEffect(() => {
    const fetchNotificationCount = async () => {
      try {
        const response = await fetch('/api/notifications/count', {
          credentials: 'include'
        });
        
        if (!response.ok) {
          if (response.status === 404) {
            console.log('ℹ️ Notification count endpoint not found');
            setNotificationCount(0);
            return;
          }
          console.error('Error fetching notification count:', response.status);
          setNotificationCount(0);
          return;
        }
        
        const data = await response.json();
        if (data.success) {
          setNotificationCount(data.count || 0);
        } else {
          setNotificationCount(0);
        }
      } catch (error) {
        console.error('Error fetching notification count:', error);
        setNotificationCount(0);
      }
    };

    if (userData) {
      fetchNotificationCount();
      const interval = setInterval(fetchNotificationCount, 30000);
      return () => clearInterval(interval);
    }
  }, [userData]);

  // 🔥 LISTEN FOR REFRESH EVENTS
  useEffect(() => {
    const handleRefresh = () => {
      console.log('🔄 [MemberDashboard] Refresh event received');
      refreshData();
    };

    window.addEventListener('refresh-data', handleRefresh);
    return () => window.removeEventListener('refresh-data', handleRefresh);
  }, [refreshData]);

  // 🔥 LISTEN FOR NOTIFICATION CLICK
  useEffect(() => {
    const handleNotificationClick = (event) => {
      console.log('🔔 [MemberDashboard] Notification clicked:', event.detail);
      const { tab, project, refresh } = event.detail || {};
      
      if (tab) {
        setSelectedMenu(tab);
      }
      
      if (project) {
        setSelectedProject(project);
      }
      
      if (refresh) {
        setTimeout(() => {
          refreshData();
        }, 300);
      }
    };

    window.addEventListener('notification-click', handleNotificationClick);
    return () => window.removeEventListener('notification-click', handleNotificationClick);
  }, [refreshData]);

  useEffect(() => {
    const syncUserData = async () => {
      try {
        const response = await fetch("/api/auth/me");
        const data = await response.json();

        if (response.ok && data.success && data.user) {
          setUserData(data.user);
        } else {
          setUserData(null);
          router.push("/components/login");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUserData(null);
        router.push("/components/login");
      }
    };

    syncUserData();
  }, [router]);

  // 🔥 FETCH USER DATA DARI API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/auth/me");
        const data = await response.json();

        if (!response.ok) {
          console.log("❌ Auth failed, redirecting to login");
          clearAllStorage();
          router.push("/components/login");
          return;
        }

        if (data.success && data.user) {
          console.log("✅ User data fetched:", data.user);
          setUserData(data.user);

          if (data.user.role?.toUpperCase() === "ADMIN") {
            console.log("🔀 User is ADMIN, redirecting to Admin Dashboard");
            router.push("/dashboardAdmin/admin");
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        clearAllStorage();
        router.push("/components/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  // 🔥 HANDLE UPDATE USER
  const handleUserUpdate = useCallback((updatedUser) => {
    console.log("🔄 Updating user data:", updatedUser);
    setUserData(updatedUser);
  }, []);

  const clearAllStorage = () => {
    document.cookie.split(";").forEach((cookie) => {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      document.cookie =
        name + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
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
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Terjadi kesalahan saat logout", { id: "logout" });
      clearAllStorage();
      router.push("/");
    } finally {
      setLoggingOut(false);
    }
  };

  const menuGroups = [
    {
      title: "MENU DASHBOARD",
      items: [
        { icon: <MdDashboard size={22} />, label: "Dashboard" },
      ],
    },
    {
      title: "MENU PROJECT MANAGEMENT",
      items: [
        { icon: <MdFolder size={22} />, label: "Project Management" },
        { icon: <MdTask size={22} />, label: "Project Review" },
        { icon: <RiGitPullRequestLine size={22} />, label: "Issues" },
      ],
    },
    {
      title: "MENU REPORTS",
      items: [
        { icon: <MdAnalytics size={22} />, label: "Reports" },
      ],
    },
  ];

  const settingsSubMenus = [
    { icon: <HiUserCircle size={18} />, label: "Settings Profile" },
    { icon: <HiSun size={18} />, label: "Settings Tema" },
  ];

  // 🔥 Mapping label menu ke URL tab param
  const menuToTab = {
    Dashboard: "dashboard",
    "Project Management": "projects",
    "Project Review": "progress",
    Issues: "revision",
    "Team Management": "members",
    Reports: "analytics",
    "Settings Profile": "profile",
    "Settings Tema": "theme",
  };

  const navigateToMenu = (label) => {
    setSelectedMenu(label);
    setSelectedProject(null);
    const tab = menuToTab[label] || "dashboard";
    router.push(`/memberDashboard/MemberDashboard?tab=${tab}`, undefined, { shallow: true });
  };

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
    <div className="flex flex-col h-full">
      <div className="h-16 md:h-20 px-4 md:px-5 border-b border-white/10 flex items-center justify-between">
        {(!collapsed || isMobile) && (
          <img src="/images/oip.png" alt="Logo" className="h-15 w-30" />
        )}
        {isMobile ? (
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
          >
            <FaTimes size={20} />
          </button>
        ) : (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center"
          >
            <FaBars />
          </button>
        )}
      </div>

      <div className="flex-1 px-2 md:px-3 py-3 md:py-5 overflow-y-auto">
        {(!collapsed || isMobile) && (
          <div className="px-3 md:px-4 mb-3 pb-3 border-b border-white/10">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-blue-400/50 mb-1">Halaman</p>
            <p className="text-sm font-bold text-white truncate">{selectedMenu}</p>
          </div>
        )}
        {menuGroups.map((group) => (
          <div key={group.title} className="mb-3">
            {(!collapsed || isMobile) && (
              <p className="px-3 md:px-4 mb-1 text-[10px] font-semibold uppercase tracking-widest text-blue-400/50">
                {group.title}
              </p>
            )}
            {group.items.map((menu) => (
              <button
                key={menu.label}
                onClick={() => {
                  navigateToMenu(menu.label);
                  if (isMobile) setMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 md:gap-4 px-3 md:px-4 py-2 md:py-3 rounded-xl mb-1 md:mb-1 text-sm md:text-base transition-all ${
                  selectedMenu === menu.label
                    ? "bg-white/15"
                    : "hover:bg-white/5"
                }`}
              >
                {menu.icon}
                {(!collapsed || isMobile) && (
                  <span className="flex-1 text-left">{menu.label}</span>
                )}
                {(!collapsed || isMobile) && menu.label === "Project Review" && notificationCount > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                    {notificationCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        ))}

        <div className="mb-3">
          {(!collapsed || isMobile) && (
            <p className="px-3 md:px-4 mb-1 text-[10px] font-semibold uppercase tracking-widest text-blue-400/50">
              MENU SETTINGS
            </p>
          )}
          <button
            onClick={() => setSettingsOpen(!settingsOpen)}
            className={`w-full flex items-center gap-3 md:gap-4 px-3 md:px-4 py-2 md:py-3 rounded-xl transition-all ${
              settingsSubMenus.some(s => selectedMenu === s.label) ? "bg-white/15" : "hover:bg-white/5"
            }`}
          >
            <HiCog6Tooth size={22} />
            {(!collapsed || isMobile) && (
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
            <div className="pl-6 md:pl-8 flex flex-col gap-1 pt-1">
              {settingsSubMenus.map((sub) => (
                <button
                  key={sub.label}
                  onClick={() => {
                    navigateToMenu(sub.label);
                    if (isMobile) setMobileSidebarOpen(false);
                  }}
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

      <div className="px-3 pb-3 mt-4">
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full flex items-center gap-3 md:gap-4 px-3 md:px-4 py-2 md:py-3 rounded-xl text-red-300 hover:bg-red-500/20 transition-all disabled:opacity-50"
        >
          {loggingOut ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-red-300"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
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
          {userData?.photo ? (
            <img
              src={userData.photo}
              alt="avatar"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-white/20 flex-shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
              {userData?.name?.charAt(0)?.toUpperCase() || "M"}
            </div>
          )}

          {(!collapsed || isMobile) && (
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm md:text-base truncate">
                {userData?.name || "Member"}
              </h3>
              <p className="text-xs text-blue-300 truncate">
                {getDisplayPosition(userData)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Toaster position="top-right" />
      <div
        className={`h-screen flex flex-col md:flex-row overflow-hidden transition-all duration-300 ${
          theme === "dark" ? "bg-slate-950 text-white" : "bg-[#eef2f7] text-black"
        }`}
      >
        <aside
          className={`hidden md:flex flex-col transition-all duration-300 ${
            collapsed ? "w-20" : "w-72"
          } bg-gradient-to-b from-[#050b1f] via-[#071a3a] to-[#020617] text-white shadow-2xl flex-shrink-0 h-screen sticky top-0`}
        >
          <SidebarContent isMobile={false} />
        </aside>

        {mobileSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}
        <div
          className={`fixed top-0 left-0 z-50 h-full w-80 bg-gradient-to-b from-[#050b1f] via-[#071a3a] to-[#020617] text-white shadow-2xl transition-transform duration-300 md:hidden ${
            mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <SidebarContent isMobile={true} />
        </div>

        <main className="flex-1 overflow-auto p-3 md:p-6 relative">
          <div
            className={`md:hidden flex items-center justify-between mb-4 sticky top-0 z-30 py-2 ${
              theme === "dark" ? "bg-slate-950" : "bg-[#eef2f7]"
            }`}
          >
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 rounded-lg bg-white dark:bg-slate-800 shadow-md"
            >
              <FaBars size={22} className="text-[#001d55] dark:text-white" />
            </button>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">Posisi</p>
                <p className={`text-sm font-bold ${theme === "dark" ? "text-white" : "text-[#001d55]"}`}>
                  {getDisplayPosition(userData)}
                </p>
              </div>
              {userData?.photo ? (
                <img
                  src={userData.photo}
                  alt="avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                  {userData?.name?.charAt(0)?.toUpperCase() || "M"}
                </div>
              )}
            </div>
          </div>

          {/* ─── PAGE CONTENT ───────────────────────────────────── */}
          {selectedMenu === "Dashboard" && (
            <Dashboard userData={userData} theme={theme} />
          )}
          {selectedMenu === "Project Review" && (
            <Progres 
              theme={theme} 
              setTheme={setTheme} 
              userData={userData}
              selectedProject={selectedProject}
              key={`progress-${refreshKey}`}
            />
          )}
          {selectedMenu === "Issues" && (
            <Revision
              userRole={userData?.role || "FRONTEND"}
              userName={userData?.name || "User"}
              theme={theme}
              setTheme={setTheme}
            />
          )}
          {selectedMenu === "Reports" && (
            <Analytics theme={theme} setTheme={setTheme} />
          )}
          {selectedMenu === "Project Management" && (
            <UploadProjectPage theme={theme} setTheme={setTheme} userData={userData} />
          )}
          {selectedMenu === "Settings Profile" && (
            <Profile
              userData={userData}
              onUpdate={handleUserUpdate}
              theme={theme}
              setTheme={setTheme}
            />
          )}
          {selectedMenu === "Settings Tema" && (
            <SettingsTema theme={theme} setTheme={setTheme} />
          )}
        </main>
      </div>
    </>
  );
}