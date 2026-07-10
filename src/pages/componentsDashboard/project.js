"use client";

import { useState, useEffect } from "react";

export default function UploadProjectPage({ theme, setTheme }) {
  const [projectName, setProjectName] = useState("");
  const [position, setPosition] = useState("Frontend");
  const [repoLink, setRepoLink] = useState("");
  const [inputDate, setInputDate] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageData, setImageData] = useState("");
  const [imageDescription, setImageDescription] = useState("");
  const [imageDescription2, setImageDescription2] = useState("");
  const [moduleFile, setModuleFile] = useState(null);
  const [moduleFileName, setModuleFileName] = useState("Belum ada file terpilih");
  const [savedMessage, setSavedMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    if (!inputDate) {
      const today = new Date().toISOString().slice(0, 10);
      setInputDate(today);
    }
  }, [inputDate]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImageData(reader.result || "");
    reader.readAsDataURL(file);
  };

  const handleModuleChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setModuleFile(file);
    setModuleFileName(file.name);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImageData(reader.result || "");
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    setSavedMessage("");
    setErrorMessage("");

    if (!projectName.trim()) {
      setErrorMessage("Nama project wajib diisi");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", projectName.trim());
      formData.append("position", position);
      formData.append("repoLink", repoLink);
      formData.append("date", inputDate);
      // 🔥 Progress tidak dikirim, akan dihitung otomatis dari attachment
      formData.append("progress", 0); // Default 0
      formData.append("imageDescription", imageDescription);
      formData.append("imageDescription2", imageDescription2);
      if (imageFile) formData.append("imageFile", imageFile);
      if (moduleFile) formData.append("moduleFile", moduleFile);

      const res = await fetch("/api/projects/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.message || "Gagal menyimpan project");
        return;
      }

      setSavedMessage("Project berhasil disimpan! Progress akan dihitung otomatis berdasarkan status attachment.");
      setProjectName("");
      setPosition("Frontend");
      setRepoLink("");
      setImageFile(null);
      setImageData("");
      setImageDescription("");
      setImageDescription2("");
      setModuleFile(null);
      setModuleFileName("Belum ada file terpilih");

    } catch (error) {
      console.error(error);
      setErrorMessage("Terjadi kesalahan saat menyimpan project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#1a1a2e]' : 'bg-[#eef2f7]'} p-4 md:p-8 transition-colors duration-200`}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className={`text-xs font-semibold tracking-widest ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} uppercase`}>
              Upload Project Baru
            </p>
            <h1 className={`text-3xl md:text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-[#001d55]'} mt-2`}>
              Upload Project Baru
            </h1>
          </div>
        </div>

        <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-sm border p-5 md:p-8 transition-colors duration-200`}>
          {savedMessage && (
            <div className={`mb-6 rounded-2xl ${theme === 'dark' ? 'bg-green-900/30 border-green-700 text-green-300' : 'bg-green-50 border-green-200 text-green-700'} border p-4`}>
              {savedMessage}
            </div>
          )}
          {errorMessage && (
            <div className={`mb-6 rounded-2xl ${theme === 'dark' ? 'bg-red-900/30 border-red-700 text-red-300' : 'bg-red-50 border-red-200 text-red-700'} border p-4`}>
              {errorMessage}
            </div>
          )}

          {/* NAMA PROJECT */}
          <div className="mb-6">
            <label className={`block text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              NAMA PROJECT <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Masukkan Nama Project"
              className={`w-full h-12 border ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400'} rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors duration-200`}
            />
          </div>

          {/* POSISI PROJECT */}
          <div className="mb-6">
            <label className={`block text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              POSISI PROJECT <span className="text-red-500">*</span>
            </label>
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className={`w-full h-12 border ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors duration-200`}
            >
              <option value="" disabled>Pilih Posisi</option>
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="UI/UX">UI/UX</option>
              <option value="QA">QA</option>
              <option value="PM">PM</option>
            </select>
          </div>

          {/* UPLOAD GAMBAR */}
          <div className="mb-6">
            <label className={`block text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              UPLOAD GAMBAR PROJECT <span className="text-red-500">*</span>
            </label>
            <div
              className={`border-2 ${dragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600'} rounded-2xl p-8 transition-all duration-200 ${theme === 'dark' ? 'bg-gray-700/30' : 'bg-gray-50'}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center justify-center text-center">
                <div className="flex items-center gap-2 mb-3">
                  <svg className={`w-8 h-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Upload Gambar Project
                  </span>
                </div>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-4`}>
                  {dragActive ? "Lepaskan file di sini" : "Seret & drop gambar di sini, atau"}
                </p>
                <label
                  htmlFor="project-image"
                  className={`cursor-pointer ${theme === 'dark' ? 'bg-gray-600 hover:bg-gray-500 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'} px-6 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200`}
                >
                  Pilih Gambar (max 10MB)
                </label>
                <input
                  id="project-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mt-3`}>
                  {imageFile ? imageFile.name : "Belum ada gambar terpilih"}
                </p>
              </div>
            </div>
          </div>

          {/* PREVIEW IMAGE */}
          <div className="mb-6">
            <label className={`block text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-3`}>
              Preview & Keterangan Gambar
            </label>
            <div className="grid md:grid-cols-2 gap-4">
              <div className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} rounded-xl h-28 flex items-center justify-center overflow-hidden transition-colors duration-200`}>
                {imageData ? (
                  <img
                    src={imageData}
                    alt="Preview Gambar Project"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <span className={`${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Preview Gambar</span>
                )}
              </div>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Keterangan Gambar 1..."
                  value={imageDescription}
                  onChange={(e) => setImageDescription(e.target.value)}
                  className={`w-full h-12 border ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400'} rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors duration-200`}
                />
                <input
                  type="text"
                  placeholder="Keterangan Gambar 2..."
                  value={imageDescription2}
                  onChange={(e) => setImageDescription2(e.target.value)}
                  className={`w-full h-12 border ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400'} rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors duration-200`}
                />
              </div>
            </div>
          </div>

          {/* LINK */}
          <div className="mb-6">
            <label className={`block text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              LINK PROGRAM / REPOSITORY
            </label>
            <input
              type="text"
              value={repoLink}
              onChange={(e) => setRepoLink(e.target.value)}
              placeholder="https://github.com/user/repo"
              className={`w-full h-12 border ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400'} rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors duration-200`}
            />
          </div>

          {/* FILE MODUL */}
          <div className="mb-6">
            <label className={`block text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              UPLOAD MODUL (PDF, WORD)
            </label>
            <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
              <label
                htmlFor="module-file"
                className={`cursor-pointer ${theme === 'dark' ? 'bg-gray-600 hover:bg-gray-500 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'} px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Upload Modul
              </label>
              <input
                id="module-file"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleModuleChange}
                className="hidden"
              />
              <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{moduleFileName}</span>
            </div>
          </div>

          {/* TANGGAL */}
          <div className="mb-8">
            <label className={`block text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              TANGGAL INPUT <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={inputDate}
              onChange={(e) => setInputDate(e.target.value)}
              className={`w-full md:w-72 h-12 border ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors duration-200`}
            />
          </div>

          {/* 🔥 INFO PROGRESS OTOMATIS */}
          <div className={`mb-10 p-4 rounded-xl border ${theme === 'dark' ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-200'}`}>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>
                  Progress Otomatis
                </p>
                <p className={`text-sm ${theme === 'dark' ? 'text-blue-200/70' : 'text-blue-600'}`}>
                  Progress project akan dihitung secara otomatis berdasarkan jumlah attachment yang sudah di-approve oleh admin. 
                  Setiap attachment (gambar, modul, link) yang di-approve akan menambah progress.
                </p>
                <div className="mt-2 flex items-center gap-4 text-xs">
                  <span className={`flex items-center gap-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
                    Approved = +progress
                  </span>
                  <span className={`flex items-center gap-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block"></span>
                    Pending = belum dihitung
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* BUTTON */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="bg-[#0066ff] hover:bg-[#0052cc] text-white px-8 py-3 rounded-xl font-semibold shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="inline animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Menyimpan...
                </>
              ) : (
                "SEND PROJECT"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}