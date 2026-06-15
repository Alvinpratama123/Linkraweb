"use client";

import React, { useState } from "react";
import { FaBars, FaUserCircle } from "react-icons/fa";
import {
  HiCog6Tooth,
  HiChevronDown,
  HiArrowRightOnRectangle,
} from "react-icons/hi2";
import { MdDashboard, MdFolder } from "react-icons/md";

export default function MemberDashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("Dashboard");

  const menus = [
    {
      label: "Dashboard",
      icon: <MdDashboard size={20} />,
    },
    {
      label: "Projects",
      icon: <MdFolder size={20} />,
    },
  ];

  const settingsSubMenus = [
    { label: "Profile" },
    { label: "Change Password" },
  ];

  const handleLogout = () => {
    console.log("logout");
  };

  return (
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
          className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center"
        >
          <FaBars />
        </button>
      </div>

      {/* MENU */}
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

        {/* SETTINGS */}
        <button
          onClick={() => setSettingsOpen(!settingsOpen)}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/10"
        >
          <HiCog6Tooth />

          {!collapsed && (
            <>
              <span className="flex-1 text-left">
                Settings
              </span>

              <HiChevronDown
                className={`transition ${
                  settingsOpen ? "rotate-180" : ""
                }`}
              />
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

      {/* LOGOUT */}
      <div className="p-3">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-red-500/20"
        >
          <HiArrowRightOnRectangle />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      {/* USER */}
      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3">
          <FaUserCircle size={36} />

          {!collapsed && (
            <div>
              <h3 className="font-semibold">Member</h3>
              <p className="text-xs text-blue-200">
                User
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}