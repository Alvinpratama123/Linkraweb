// src/components/NotificationBell.js
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { FaBell } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

export default function NotificationBell({ theme = "light" }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  const isDark = theme === "dark";

  
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/notifications?limit=20', {
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        setNotifications(data.data);
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error('Fetch notifications error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAsRead = async (id) => {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
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
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ markAll: true }),
      });
      fetchNotifications();
    } catch (error) {
      console.error('Mark all as read error:', error);
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    setIsOpen(false);
    if (notification.link) {
      router.push(notification.link);
    }
  };

  const getIcon = (type, icon) => {
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

  const getColor = (type, color) => {
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

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) fetchNotifications();
        }}
        className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all group ${
          isDark ? "bg-slate-800 hover:bg-slate-700" : "bg-gray-50 hover:bg-gray-100"
        }`}
      >
        <FaBell className={isDark ? "text-slate-400 group-hover:text-blue-400" : "text-gray-600 group-hover:text-[#001d55]"} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className={`absolute right-0 mt-2 w-96 max-h-[500px] rounded-2xl shadow-2xl overflow-hidden z-50 ${
          isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
        }`}>
          {/* Header */}
          <div className={`px-4 py-3 border-b flex justify-between items-center ${
            isDark ? 'border-slate-700' : 'border-gray-200'
          }`}>
            <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
              Notifikasi
            </span>
            {unreadCount > 0 && (
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

          {/* List */}
          <div className="overflow-y-auto max-h-[400px]">
            {loading ? (
              <div className="text-center py-8 text-gray-400">Memuat...</div>
            ) : notifications.length === 0 ? (
              <div className={`text-center py-8 ${isDark ? 'text-slate-400' : 'text-gray-400'}`}>
                <span className="text-4xl block mb-2">🔔</span>
                Tidak ada notifikasi
              </div>
            ) : (
              notifications.map((notif) => {
                const color = getColor(notif.type, notif.color);
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
                        {getIcon(notif.type, notif.icon)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-800'} ${!notif.isRead ? 'font-semibold' : ''}`}>
                          {notif.title}
                        </p>
                        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'} mt-0.5 line-clamp-2`}>
                          {notif.message}
                        </p>
                        <p className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-gray-400'} mt-1`}>
                          {formatTime(notif.createdAt)}
                        </p>
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

          {/* Footer */}
          {notifications.length > 0 && (
            <div className={`px-4 py-2 border-t text-center ${
              isDark ? 'border-slate-700' : 'border-gray-200'
            }`}>
              <button
                onClick={() => router.push('/notifications')}
                className={`text-xs font-medium ${
                  isDark ? 'text-slate-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Lihat semua notifikasi
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}