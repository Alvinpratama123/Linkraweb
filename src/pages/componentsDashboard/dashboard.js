// src/pages/dashboardAdmin/components/dashboard.js
/**
 * ============================================================
 * DASHBOARD COMPONENT — Project Management System
 * ============================================================
 */
 
import React, { useEffect, useMemo, useState, useRef } from "react";
import { useRouter } from "next/router";
import { FaSearch, FaBell, FaUsers } from "react-icons/fa";
import { HiSparkles, HiFolder, HiCheckCircle, HiClock, HiFlag } from "react-icons/hi2";
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
 
export default function Dashboard({ userData = {}, theme = "light" }) {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  
  // ─── STATE NOTIFIKASI ──────────────────────────────────────
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifError, setNotifError] = useState("");
  const notifRef = useRef(null);
 
  // ─── TEMA ───────────────────────────────────────────────────
  const isDark = theme === "dark";
 
  // ─── DATA USER ──────────────────────────────────────────────
  const effectiveUserData = userData && Object.keys(userData).length ? userData : currentUser || {};
  const userName  = effectiveUserData?.name || "User";
  const userPhoto = effectiveUserData?.photo || effectiveUserData?.profile || null;
  const userRole  = effectiveUserData?.role || "USER";
  const userPosition = effectiveUserData?.position || null;
 
  // ─── FUNGSI GET DISPLAY ROLE ──────────────────────────────
  const getDisplayRole = (role, position) => {
    if (position) {
      return position;
    }
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

  // ─── FUNGSI NOTIFIKASI ─────────────────────────────────────
  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications?limit=50', { credentials: 'include' });
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
        setNotifError("");
      } else {
        setNotifications([]);
        setUnreadCount(0);
        setNotifError(data.message || 'Gagal memuat notifikasi');
      }
    } catch (error) {
      console.error('Fetch notifications error:', error);
      setNotifications([]);
      setUnreadCount(0);
      setNotifError('Gagal memuat notifikasi');
    }
  };

  const markAsRead = async (id) => {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      fetchNotifications();
    } catch (error) {
      console.error('Mark as read error:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAll: true }),
      });
      fetchNotifications();
    } catch (error) {
      console.error('Mark all as read error:', error);
    }
  };

  const handleBellClick = async () => {
    const nextState = !isNotifOpen;
    setIsNotifOpen(nextState);
    if (nextState) {
      await fetchNotifications();
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    setIsNotifOpen(false);
    if (notification.link) {
      router.push(notification.link);
    }
  };

  const getNotifIcon = (type, icon) => {
    if (icon) return icon;
    const icons = {
      project: '📁',
      member: '👤',
      revision: '📝',
      system: '🔔',
      approved: '✅',
      rejected: '❌',
      finished: '🎉',
    };
    return icons[type] || '📢';
  };

  const getNotifColor = (type, color) => {
    if (color) return color;
    const colors = {
      project: 'blue',
      member: 'purple',
      revision: 'orange',
      system: 'gray',
      approved: 'green',
      rejected: 'red',
      finished: 'green',
    };
    return colors[type] || 'gray';
  };

  const formatTime = (date) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true, locale: id });
    } catch {
      return 'baru saja';
    }
  };

  // 🔥 TAMBAHKAN: Filter notifikasi 24 jam terakhir
  const getFilteredNotifications = (notifs) => {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    
    return notifs.filter(notif => {
      const notifDate = new Date(notif.createdAt);
      return notifDate >= oneDayAgo;
    });
  };

  // 🔥 TAMBAHKAN: Hitung sisa waktu notifikasi
  const getTimeRemaining = (createdAt) => {
    const now = new Date();
    const created = new Date(createdAt);
    const expiryTime = new Date(created.getTime() + 24 * 60 * 60 * 1000);
    const diff = expiryTime - now;
    
    if (diff <= 0) return '⏳ Kedaluwarsa';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  // 🔥 TAMBAHKAN: Cleanup notifikasi lama
  const cleanupOldNotifications = async () => {
    try {
      const res = await fetch('/api/notifications/cleanup', {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success && data.deletedCount > 0) {
        console.log(`🗑️ ${data.deletedCount} notifikasi lama dihapus`);
        // Refresh notifikasi
        await fetchNotifications();
      }
    } catch (error) {
      console.error('Cleanup notifications error:', error);
    }
  };

  // ─── CLOSE NOTIFICATION ON CLICK OUTSIDE ──────────────────
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
 
  // ─── FETCH DATA ─────────────────────────────────────────────
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.user) {
            setCurrentUser(data.user);
          }
        }
      } catch (error) {
        console.error("Fetch current user error:", error);
      }
    };

    if (!userData || Object.keys(userData).length === 0) {
      fetchCurrentUser();
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        
        const projectsRes = await fetch("/api/projects");
        const projectsData = await projectsRes.json();
        if (projectsData.success) {
          setProjects(projectsData.projects || []);
        }

        try {
          const membersRes = await fetch("/api/members");
          const membersData = await membersRes.json();
          if (membersData.success && membersData.members) {
            setMembers(membersData.members);
          } else {
            setMembers([]);
          }
        } catch (memberError) {
          console.error("Error fetching members:", memberError);
          setMembers([]);
        }

        await fetchNotifications();

      } catch (error) {
        console.error("Fetch data error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    // 🔥 Cleanup notifikasi lama saat pertama kali load
    setTimeout(cleanupOldNotifications, 5000);

    // 🔥 Interval cleanup setiap 1 jam
    const cleanupInterval = setInterval(cleanupOldNotifications, 3600000);

    const notifInterval = setInterval(fetchNotifications, 30000);
    
    return () => {
      clearInterval(notifInterval);
      clearInterval(cleanupInterval);
    };
  }, []);

  // ─── STATISTIK ──────────────────────────────────────────────
  const totalProjects    = projects.length;
  const approvedProjects = projects.filter((p) => p.decision === "approved").length;
  const pendingProjects  = projects.filter((p) => !p.decision || p.decision === "pending").length;
  const finishedProjects = projects.filter((p) => p.finished).length;
  const totalMembers     = members.length;

  // ─── GROUP PROJECTS BY MODULE ──────────────────────────────
  const moduleProjects = useMemo(() => {
    const grouped = new Map();

    projects.forEach((project) => {
      const moduleName = (project.name || "Untitled Module").trim();
      
      if (!grouped.has(moduleName)) {
        grouped.set(moduleName, {
          name: moduleName,
          projects: [],
          totalProgress: 0,
          count: 0,
          status: "pending",
          decisions: [],
        });
      }

      const module = grouped.get(moduleName);
      module.projects.push(project);
      module.totalProgress += (project.progress || 0);
      module.count += 1;
      module.decisions.push(project.decision || "pending");
    });

    const result = Array.from(grouped.values()).map((module) => {
      const avgProgress = module.count > 0 ? Math.round(module.totalProgress / module.count) : 0;
      
      const allApproved = module.decisions.every(d => d === "approved");
      const hasRejected = module.decisions.some(d => d === "rejected");
      
      let status = "pending";
      if (allApproved && module.count > 0) status = "approved";
      else if (hasRejected) status = "rejected";
      
      return {
        ...module,
        avgProgress,
        status,
      };
    });

    return result.sort((a, b) => b.avgProgress - a.avgProgress);
  }, [projects]);

  const topModules = moduleProjects.slice(0, 5);

  // ─── STATS CARDS ────────────────────────────────────────────
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
      lightText:   "text-blue-700",
      darkText:    "text-blue-300",
      lightBg:     "bg-blue-50",
      darkBg:      "bg-blue-950",
      lightBorder: "border-blue-200",
      darkBorder:  "border-blue-800",
      lightIcon:   "bg-blue-100",
      darkIcon:    "bg-blue-900",
      icon: <FaUsers size={22} className="text-blue-500" />,
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
 
  // ─── DISPLAY ROLE ──────────────────────────────────────────
  const displayRole = getDisplayRole(userRole, userPosition);
 
  // ─── GRAFIK ────────────────────────────────────────────────
  const barGradient = "linear-gradient(180deg, #003d9e 0%, #001d55 100%)";
  const progressGradient = "linear-gradient(90deg, #003d9e 0%, #001d55 100%)";
  const memberGradient = "linear-gradient(180deg, #003d9e 0%, #001d55 100%)";

  // 🔥 Filter notifikasi untuk 24 jam terakhir
  const filteredNotifications = getFilteredNotifications(notifications);
  const filteredUnreadCount = filteredNotifications.filter(n => !n.isRead).length;

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
          {/* ─── NOTIFICATION BELL ───────────────────────────── */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={handleBellClick}
              className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all group ${
                isDark ? "bg-slate-800 hover:bg-slate-700" : "bg-gray-50 hover:bg-gray-100"
              }`}
            >
              <FaBell className={isDark ? "text-slate-400 group-hover:text-blue-400" : "text-gray-600 group-hover:text-[#001d55]"} />
              {filteredUnreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                  {filteredUnreadCount > 9 ? '9+' : filteredUnreadCount}
                </span>
              )}
            </button>

            {/* ─── NOTIFICATION DROPDOWN ──────────────────────── */}
            {isNotifOpen && (
              <div className={`absolute right-0 mt-2 w-96 max-h-[500px] rounded-2xl shadow-2xl overflow-hidden z-50 ${
                isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
              }`}>
                <div className={`px-4 py-3 border-b flex justify-between items-center ${
                  isDark ? 'border-slate-700' : 'border-gray-200'
                }`}>
                  <div>
                    <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                      Notifikasi
                    </span>
                    <span className={`ml-2 text-xs ${isDark ? 'text-slate-400' : 'text-gray-400'}`}>
                      (24 jam terakhir)
                    </span>
                  </div>
                  {filteredUnreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className={`text-xs font-medium ${
                        isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
                      }`}
                    >
                      Tandai semua sudah dibaca
                    </button>
                  )}
                </div>

                <div className="overflow-y-auto max-h-[400px]">
                  {notifError ? (
                    <div className={`text-center py-8 ${isDark ? 'text-slate-400' : 'text-gray-400'}`}>
                      <span className="text-4xl block mb-2">🔔</span>
                      {notifError}
                    </div>
                  ) : filteredNotifications.length === 0 ? (
                    <div className={`text-center py-8 ${isDark ? 'text-slate-400' : 'text-gray-400'}`}>
                      <span className="text-4xl block mb-2">✨</span>
                      Tidak ada notifikasi baru (24 jam terakhir)
                      <p className="text-xs mt-1">Notifikasi akan otomatis terhapus setelah 1 hari</p>
                    </div>
                  ) : (
                    filteredNotifications.map((notif) => {
                      const color = getNotifColor(notif.type, notif.color);
                      const bgColor = {
                        blue: isDark ? 'bg-blue-900/30' : 'bg-blue-50',
                        purple: isDark ? 'bg-purple-900/30' : 'bg-purple-50',
                        orange: isDark ? 'bg-orange-900/30' : 'bg-orange-50',
                        green: isDark ? 'bg-green-900/30' : 'bg-green-50',
                        red: isDark ? 'bg-red-900/30' : 'bg-red-50',
                        gray: isDark ? 'bg-slate-700/50' : 'bg-gray-50',
                      }[color] || (isDark ? 'bg-slate-700/50' : 'bg-gray-50');

                      const borderColor = {
                        blue: isDark ? 'border-blue-700' : 'border-blue-200',
                        purple: isDark ? 'border-purple-700' : 'border-purple-200',
                        orange: isDark ? 'border-orange-700' : 'border-orange-200',
                        green: isDark ? 'border-green-700' : 'border-green-200',
                        red: isDark ? 'border-red-700' : 'border-red-200',
                        gray: isDark ? 'border-slate-600' : 'border-gray-200',
                      }[color] || (isDark ? 'border-slate-600' : 'border-gray-200');

                      return (
                        <div
                          key={notif.id}
                          onClick={() => handleNotificationClick(notif)}
                          className={`px-4 py-3 border-b cursor-pointer transition-all hover:bg-opacity-50 ${
                            isDark ? 'border-slate-700 hover:bg-slate-700' : 'border-gray-100 hover:bg-gray-50'
                          } ${!notif.isRead ? 'border-l-4 ' + borderColor : ''}`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${bgColor}`}>
                              {getNotifIcon(notif.type, notif.icon)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-800'} ${!notif.isRead ? 'font-semibold' : ''}`}>
                                {notif.title}
                              </p>
                              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'} mt-0.5 line-clamp-2`}>
                                {notif.message}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <p className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                                  {formatTime(notif.createdAt)}
                                </p>
                                <span className={`text-[10px] ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                                  ⏱ {getTimeRemaining(notif.createdAt)}
                                </span>
                              </div>
                            </div>
                            {!notif.isRead && (
                              <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-2"></span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
                
                {/* Footer dengan info auto delete */}
                <div className={`px-4 py-2 border-t text-center text-[10px] ${
                  isDark ? 'border-slate-700 text-slate-500' : 'border-gray-200 text-gray-400'
                }`}>
                  🔄 Notifikasi otomatis terhapus setelah 1 hari
                </div>
              </div>
            )}
          </div>
 
          {/* ─── USER PROFILE ─────────────────────────────────── */}
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
                  const heightPercent = (item.count / maxMember) * 100;
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
                          style={{ height: `${heightPercent}%`, background: memberGradient }}
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
 
        {/* ── PROJECT PROGRESS PER MODULE ─────────────────────── */}
        <div className={`rounded-2xl p-6 border transition-all duration-300 hover:shadow-lg ${
          isDark
            ? "bg-slate-900 border-slate-800 hover:shadow-slate-950"
            : "bg-white border-gray-100 hover:shadow-md"
        }`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className={`font-bold text-xl ${isDark ? "text-white" : "text-[#001d55]"}`}>
                Module Progress
              </h2>
              <p className={`text-sm mt-1 ${isDark ? "text-slate-500" : "text-gray-500"}`}>
                Top 5 module berdasarkan progress tertinggi (rata-rata dari semua role)
              </p>
            </div>
            <div className={`px-3 py-1 rounded-full ${
              isDark ? "bg-blue-900 border border-blue-800" : "bg-blue-50"
            }`}>
              <span className={`text-xs font-semibold ${isDark ? "text-blue-300" : "text-[#001d55]"}`}>
                {moduleProjects.length} Modules
              </span>
            </div>
          </div>
 
          {loading ? (
            <div className={`text-center py-8 text-sm ${isDark ? "text-slate-600" : "text-gray-400"}`}>
              Memuat data...
            </div>
          ) : topModules.length === 0 ? (
            <div className={`text-center py-8 text-sm ${isDark ? "text-slate-600" : "text-gray-400"}`}>
              Belum ada module
            </div>
          ) : (
            <div className="space-y-5">
              {topModules.map((module) => (
                <div key={module.name} className="group">
                  <div className="flex justify-between mb-2 flex-wrap gap-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`font-semibold text-sm ${isDark ? "text-white" : "text-gray-800"}`}>
                        {module.name}
                      </span>
                      <span className={`text-[11px] px-2 py-0.5 rounded-full border ${
                        isDark
                          ? "bg-slate-800 text-slate-400 border-slate-700"
                          : "bg-gray-100 text-gray-500 border-gray-200"
                      }`}>
                        {module.count} role
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        module.status === "approved"
                          ? isDark ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                                   : "bg-green-100 text-green-700"
                          : module.status === "rejected"
                          ? isDark ? "bg-red-950 text-red-400 border border-red-800"
                                   : "bg-red-100 text-red-700"
                          : isDark ? "bg-amber-950 text-amber-400 border border-amber-800"
                                   : "bg-yellow-50 text-yellow-700"
                      }`}>
                        {module.status === "approved" ? "✓ Approved" : 
                         module.status === "rejected" ? "✗ Rejected" : "○ Pending"}
                      </span>
                    </div>
                    <div className={`text-sm font-bold ${isDark ? "text-blue-400" : "text-[#001d55]"}`}>
                      {module.avgProgress}%
                    </div>
                  </div>
                  <div className={`relative w-full h-2 rounded-full overflow-hidden ${
                    isDark ? "bg-slate-800" : "bg-gray-100"
                  }`}>
                    <div
                      className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out"
                      style={{ 
                        width: `${module.avgProgress}%`, 
                        background: progressGradient 
                      }}
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