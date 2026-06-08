"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("⚠️ Semua field wajib diisi");
      return;
    }

    if (newPassword.length < 6) {
      setError("⚠️ Password baru minimal 6 karakter");
      return;
    }

    if (oldPassword === newPassword) {
      setError("⚠️ Password baru tidak boleh sama dengan password lama");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("⚠️ Konfirmasi password tidak cocok");
      return;
    }

    setMessage("✅ Password berhasil diubah!");
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-black dark:via-zinc-900 dark:to-zinc-800">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-zinc-700"
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-700 dark:text-blue-400">
          🔒 Change Password
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
              Password Lama
            </label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:text-white transition"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
              Password Baru
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:text-white transition"
              placeholder="Minimal 6 karakter"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
              Konfirmasi Password Baru
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:text-white transition"
              placeholder="Ulangi password baru"
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm font-medium"
            >
              {error}
            </motion.p>
          )}

          {message && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-green-600 text-sm font-medium"
            >
              {message}
            </motion.p>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold shadow-md transition"
          >
            Ubah Password
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
