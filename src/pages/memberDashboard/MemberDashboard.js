"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaBars, FaUserCircle } from "react-icons/fa";
import {
  HiCog6Tooth,
  HiChevronDown,
  HiArrowRightOnRectangle,
} from "react-icons/hi2";
import { MdDashboard, MdFolder } from "react-icons/md";

export default function MemberDashboard() {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("Dashboard");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.success && data.user) {
          setUserData(data.user);
        } else {
          router.push("/components/login");
        }
      } catch {
        const stored = localStorage.getItem("user");
        if (stored) {
          setUserData(JSON.parse(stored));
        } else {
          router.push("/components/login");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    localStorage.removeItem("user");
    document.cookie.split(";").forEach((c) => {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/");
    });
    router.push("/components/login");
  };

  const menus = [
    { label: "Dashboard", icon: <MdDashboard size={20} /> },
    { label: "Projects", icon: <MdFolder size={20} /> },
  ];

  const settingsSubMenus = [
    { label: "Profile" },
    { label: "Change Password" },
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
    <div className="flex h-screen">
      <aside
        className={`h-screen flex flex-col transition-all duration-300 ${
          collapsed ? "w-20" : "w-72"
        } bg-gradient-to-b from-[#0f172a] via-[#14213d] to-[#1e3a5f] text-white`}
      >
        <div className="h-20 px-5 border-b border-white/10 flex items-center justify-between">
          {!collapsed && (
            <div>
              <img src="/images/oip.png" alt="Logo" className="h-10 w-auto" />
              <p className="text-xs text-blue-200 mt-1">Member Dashboard</p>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center"
          >
            <FaBars />
          </button>
        </div>

        <div className="flex-1 px-3 py-5">
          {menus.map((menu) => (
            <button
              key={menu.label}
              onClick={() => setSelectedMenu(menu.label)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl mb-2 ${
                selectedMenu === menu.label
                  ? "bg-blue-500/25 border border-blue-400/30"
                  : "hover:bg-white/10"
              }`}
            >
              {menu.icon}
              {!collapsed && <span>{menu.label}</span>}
            </button>
          ))}

          <button
            onClick={() => setSettingsOpen(!settingsOpen)}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/10"
          >
            <HiCog6Tooth />
            {!collapsed && (
              <>
                <span className="flex-1 text-left">Settings</span>
                <HiChevronDown className={`transition ${settingsOpen ? "rotate-180" : ""}`} />
              </>
            )}
          </button>

          {settingsOpen && (
            <div className="pl-8 mt-2">
              {settingsSubMenus.map((item) => (
                <button
                  key={item.label}
                  className="block w-full text-left py-2 hover:text-blue-300"
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="p-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-red-500/20"
          >
            <HiArrowRightOnRectangle />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>

        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3">
            {userData?.photo ? (
              <img src={userData.photo} alt="" className="w-9 h-9 rounded-full object-cover" />
            ) : (
              <FaUserCircle size={36} />
            )}
            {!collapsed && (
              <div>
                <h3 className="font-semibold">{userData?.name || "Member"}</h3>
                <p className="text-xs text-blue-200 capitalize">{userData?.role || "User"}</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-auto bg-[#eef2f7] p-6">
        <h1 className="text-2xl font-bold mb-6">
          {selectedMenu === "Dashboard" && "Dashboard"}
          {selectedMenu === "Projects" && "Projects"}
        </h1>
        {selectedMenu === "Dashboard" && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-gray-500">Selamat datang, {userData?.name || "Member"}!</p>
          </div>
        )}
        {selectedMenu === "Projects" && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-gray-500">Halaman projects.</p>
          </div>
        )}
      </main>
    </div>
  );
}
