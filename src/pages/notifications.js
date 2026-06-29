// pages/notifications.js
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

export default function NotificationsPage({ theme = "light" }) {
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const isDark = theme === "dark";

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications?limit=50');
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      fetchNotifications();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAll: true }),
      });
      fetchNotifications();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getIcon = (type) => {
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

  const getColor = (type) => {
    const colors = {
      project: 'bg-blue-100 text-blue-700',
      member: 'bg-purple-100 text-purple-700',
      revision: 'bg-orange-100 text-orange-700',
      system: 'bg-gray-100 text-gray-700',
      approved: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
      finished: 'bg-green-100 text-green-700',
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  const formatTime = (date) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true, locale: id });
    } catch {
      return 'baru saja';
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-slate-950' : 'bg-gray-50'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-950' : 'bg-gray-50'} p-4 md:p-8`}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Notifikasi
            </h1>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
              {notifications.length} notifikasi
            </p>
          </div>
          {notifications.some(n => !n.isRead) && (
            <button
              onClick={markAllAsRead}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                isDark ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              Tandai semua sudah dibaca
            </button>
          )}
        </div>

        <div className={`rounded-2xl shadow-sm border ${
          isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
        }`}>
          {notifications.length === 0 ? (
            <div className={`text-center py-12 ${isDark ? 'text-slate-400' : 'text-gray-400'}`}>
              <span className="text-6xl block mb-4">🔔</span>
              <p className="text-lg font-medium">Belum ada notifikasi</p>
              <p className="text-sm">Notifikasi akan muncul di sini</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-slate-700">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => {
                    if (!notif.isRead) markAsRead(notif.id);
                    if (notif.link) router.push(notif.link);
                  }}
                  className={`p-4 cursor-pointer transition-colors ${
                    !notif.isRead ? (isDark ? 'bg-slate-700/50' : 'bg-blue-50') : ''
                  } ${isDark ? 'hover:bg-slate-700' : 'hover:bg-gray-50'}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${getColor(notif.type)}`}>
                      {getIcon(notif.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'} ${!notif.isRead ? 'font-semibold' : ''}`}>
                        {notif.title}
                      </p>
                      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'} mt-0.5`}>
                        {notif.message}
                      </p>
                      <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'} mt-1`}>
                        {formatTime(notif.createdAt)}
                      </p>
                    </div>
                    {!notif.isRead && (
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500 flex-shrink-0 mt-2"></span>
                    )}
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