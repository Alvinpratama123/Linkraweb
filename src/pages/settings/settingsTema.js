"use client";
import { useState } from "react";

export default function SettingsTema({ theme, setTheme }) {
  const [tempTheme, setTempTheme] = useState(theme);

  const handleConfirm = () => {
    setTheme(tempTheme); // baru apply saat klik "Anda yakin"
  };

  return (
    <div className="p-8">
      <div
        className={`p-6 rounded-2xl transition-all duration-300 shadow-md ${
          theme === "dark"
            ? "bg-slate-800 text-white"
            : "bg-white text-black"
        }`}
      >
        <h1 className="text-3xl font-bold mb-6">Settings Tema</h1>

        {/* PILIH TAPI BELUM APPLY */}
        <div className="flex gap-4">
          <button
            onClick={() => setTempTheme("light")}
            className={`px-4 py-2 rounded-lg transition ${
              tempTheme === "light"
                ? "bg-blue-500 text-white"
                : "border"
            }`}
          >
            Light Mode
          </button>

          <button
            onClick={() => setTempTheme("dark")}
            className={`px-4 py-2 rounded-lg transition ${
              tempTheme === "dark"
                ? "bg-blue-500 text-white"
                : "border"
            }`}
          >
            Dark Mode
          </button>
        </div>

        <p className="mt-6 text-sm opacity-80">
          Preview dipilih: <b>{tempTheme}</b>
        </p>

        {/* BUTTON CONFIRM */}
        <div className="mt-8">
          <button
            onClick={handleConfirm}
            className={`
              px-6 py-2 rounded-xl font-medium transition-all duration-200
              shadow-md hover:shadow-lg active:scale-95
              ${
                tempTheme === "dark"
                  ? "bg-green-500 text-white hover:bg-green-400"
                  : "bg-green-500 text-white hover:bg-green-600"
              }
            `}
          >
            Anda yakin
          </button>
        </div>
      </div>
    </div>
  );
}