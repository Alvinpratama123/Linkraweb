// src/pages/settings/profile.js
import React, { useState, useRef, useEffect } from "react";
import { HiCamera, HiCheckCircle } from "react-icons/hi2";
import { MdEmail, MdPerson, MdEdit } from "react-icons/md";
import toast, { Toaster } from "react-hot-toast";

export default function Profile({ userData, onUpdate, theme = "light", setTheme }) {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
  });

  useEffect(() => {
    if (userData) {
      setForm({
        fullName: userData.name || "",
        email: userData.email || "",
      });
      setPreview(userData.photo || null);
    }
  }, [userData]);

  // ─── FIX: Merge data API response dengan userData lama ────────
  // Masalah sebelumnya: onUpdate(data.user) langsung mengganti
  // seluruh userData. Jika API tidak mengembalikan field `position`,
  // maka position hilang dan tampil "Member" di sidebar.
  //
  // Solusi: merge — pertahankan semua field lama, timpa hanya
  // field yang benar-benar dikembalikan API (name, email, photo).
  const mergeAndUpdate = (newData) => {
    if (!onUpdate) return;
    const merged = {
      ...userData,      // pertahankan semua field lama (termasuk position, role)
      ...newData,       // timpa hanya yang datang dari API
      // Pastikan position tidak pernah hilang:
      // Jika API kembalikan position baru → pakai itu.
      // Jika tidak → pertahankan userData.position yang lama.
      position: newData.position || userData?.position || userData?.role || "",
    };
    onUpdate(merged);
  };

  const getDisplayRole = (user) => {
    if (!user) return "Member";
    if (user.role?.toUpperCase() === "ADMIN") return "Administrator";
    if (user.position) return user.position;
    if (user.role) return user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase();
    return "Member";
  };

  const initials = form.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // ─── Upload foto ────────────────────────────────────────────
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Hanya gambar yang diperbolehkan (JPEG, PNG, GIF, WEBP)");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran gambar maksimal 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);

    await uploadPhoto(file);
  };

  const uploadPhoto = async (file) => {
    setUploading(true);
    toast.loading("Mengupload foto...", { id: "upload-photo" });

    try {
      const formData = new FormData();
      formData.append("photo", file);

      const response = await fetch("/api/auth/update-profile", {
        method: "PUT",
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) {
        toast.dismiss("upload-photo");
        toast.error(data.message || "Gagal mengupload foto");
        setPreview(userData?.photo || null);
        return;
      }

      toast.dismiss("upload-photo");
      toast.success("Foto profile berhasil diupdate!");

      if (data.user) {
        // ✅ Gunakan mergeAndUpdate — position/role tidak hilang
        mergeAndUpdate(data.user);
        setPreview(data.user.photo || preview);
      }
    } catch (error) {
      console.error("Upload photo error:", error);
      toast.dismiss("upload-photo");
      toast.error("Terjadi kesalahan saat mengupload foto");
      setPreview(userData?.photo || null);
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ─── Save name/email ────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.fullName === userData?.name && form.email === userData?.email) {
      toast("Tidak ada perubahan yang dilakukan");
      return;
    }

    setLoading(true);
    toast.loading("Menyimpan perubahan...", { id: "update-profile" });

    try {
      const formData = new FormData();
      if (form.fullName !== userData?.name) formData.append("name",  form.fullName);
      if (form.email   !== userData?.email) formData.append("email", form.email);

      const response = await fetch("/api/auth/update-profile", {
        method: "PUT",
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) {
        toast.dismiss("update-profile");
        toast.error(data.message || "Gagal memperbarui profile");
        return;
      }

      toast.dismiss("update-profile");
      toast.success("Profile berhasil diperbarui!");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);

      if (data.user) {
        // ✅ Gunakan mergeAndUpdate — position/role tidak hilang
        mergeAndUpdate(data.user);
      }
    } catch (error) {
      console.error("Update profile error:", error);
      toast.dismiss("update-profile");
      toast.error("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  // ─── Tema ───────────────────────────────────────────────────
  const isDark = theme === "dark";
  const bgColor        = isDark ? "bg-[#1a1a2e]"                 : "bg-[#eef2f7]";
  const cardBg         = isDark ? "bg-gray-800"                  : "bg-white";
  const cardBorder     = isDark ? "border-gray-700"              : "border-gray-100";
  const textPrimary    = isDark ? "text-white"                   : "text-[#001d55]";
  const textSecondary  = isDark ? "text-gray-400"                : "text-gray-500";
  const textMuted      = isDark ? "text-gray-500"                : "text-gray-400";
  const textLabel      = isDark ? "text-gray-300"                : "text-gray-600";
  const inputBg        = isDark ? "bg-gray-700"                  : "bg-white";
  const inputBorder    = isDark ? "border-gray-600"              : "border-gray-200";
  const inputText      = isDark ? "text-white"                   : "text-gray-800";
  const inputPlaceholder = isDark ? "placeholder-gray-400"       : "placeholder-gray-400";
  const iconColor      = isDark ? "text-gray-500"                : "text-gray-400";
  const borderDivider  = isDark ? "border-gray-700"              : "border-gray-100";
  const buttonPrimary  = isDark ? "bg-blue-600 hover:bg-blue-700": "bg-[#001d55] hover:bg-[#003cb3]";
  const buttonBorder   = isDark
    ? "border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-gray-900"
    : "border-[#001d55] text-[#001d55] hover:bg-[#001d55] hover:text-white";
  const roleBadge      = isDark ? "bg-[#001d55]/20 text-blue-300": "bg-[#001d55]/10 text-[#001d55]";
  const gradientCard   = isDark ? "from-gray-800 to-gray-700"    : "from-[#001d55] to-[#003cb3]";
  const infoText       = isDark ? "text-gray-400"                : "text-blue-200";
  const iconWrapper    = "bg-white/10";

  const displayRole = getDisplayRole(userData);

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: isDark ? "#1a1a2e" : "#363636",
            color: "#fff",
            borderRadius: "12px",
            padding: "16px",
          },
        }}
      />

      <div className={`min-h-screen ${bgColor} p-6 md:p-10 transition-colors duration-200`}>
        <div className="max-w-3xl mx-auto space-y-6">

          {/* HEADER */}
          <div>
            <p className={`text-xs font-semibold tracking-widest ${textMuted} uppercase`}>
              Settings
            </p>
            <h1 className={`text-3xl font-bold ${textPrimary} mt-1`}>Profile Settings</h1>
            <p className={`text-sm ${textSecondary} mt-1`}>
              Manage your personal information and account details.
            </p>
          </div>

          {/* CARD AVATAR */}
          <div className={`${cardBg} ${cardBorder} rounded-3xl border shadow-sm p-6 flex flex-col sm:flex-row items-center gap-6 transition-colors duration-200`}>
            <div className="relative flex-shrink-0">
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-[#001d55]/10 bg-gradient-to-br from-[#001d55] to-[#003cb3] flex items-center justify-center">
                {preview ? (
                  <img src={preview} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white text-3xl font-bold">{initials || "U"}</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                disabled={uploading}
                className="absolute bottom-0 right-0 w-9 h-9 bg-[#001d55] hover:bg-[#003cb3] transition rounded-full flex items-center justify-center shadow-md disabled:opacity-50"
              >
                {uploading ? (
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <HiCamera size={16} className="text-white" />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>

            <div className="text-center sm:text-left">
              <h2 className={`text-xl font-bold ${textPrimary}`}>{form.fullName || "User"}</h2>
              <p className={`text-sm ${textSecondary} mt-1`}>{form.email}</p>
              {/* Menampilkan position (QA, Frontend, dll) bukan role mentah */}
              <span className={`inline-block mt-2 px-3 py-1 ${roleBadge} text-xs font-semibold rounded-full`}>
                {displayRole}
              </span>
            </div>

            <div className="sm:ml-auto">
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                disabled={uploading}
                className={`flex items-center gap-2 px-5 py-2.5 border-2 ${buttonBorder} transition rounded-xl text-sm font-semibold disabled:opacity-50`}
              >
                <HiCamera size={16} />
                {uploading ? "Uploading..." : "Upload Photo"}
              </button>
            </div>
          </div>

          {/* FORM CARD */}
          <div className={`${cardBg} ${cardBorder} rounded-3xl border shadow-sm p-6 md:p-8 transition-colors duration-200`}>
            <div className="flex items-center gap-2 mb-6">
              <MdEdit size={20} className={isDark ? "text-blue-400" : "text-[#001d55]"} />
              <h3 className={`text-lg font-bold ${textPrimary}`}>Personal Information</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className={`block text-sm font-medium ${textLabel} mb-2`}>Full Name</label>
                <div className="relative">
                  <MdPerson size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 ${iconColor}`} />
                  <input
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className={`w-full pl-11 pr-5 py-3.5 rounded-2xl border ${inputBorder} ${inputBg} ${inputText} ${inputPlaceholder} focus:outline-none focus:ring-2 focus:ring-[#001d55]/40 text-sm transition-colors duration-200`}
                    required
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium ${textLabel} mb-2`}>Email Address</label>
                <div className="relative">
                  <MdEmail size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 ${iconColor}`} />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className={`w-full pl-11 pr-5 py-3.5 rounded-2xl border ${inputBorder} ${inputBg} ${inputText} ${inputPlaceholder} focus:outline-none focus:ring-2 focus:ring-[#001d55]/40 text-sm transition-colors duration-200`}
                    required
                  />
                </div>
              </div>

              {/* Read-only: tampilkan posisi saat ini, tidak bisa diubah dari sini */}
              <div>
                <label className={`block text-sm font-medium ${textLabel} mb-2`}>
                  Posisi / Role
                </label>
                <div className={`w-full pl-5 pr-5 py-3.5 rounded-2xl border ${inputBorder} ${isDark ? "bg-gray-750" : "bg-gray-50"} ${textSecondary} text-sm flex items-center justify-between`}>
                  <span>{displayRole}</span>
                  <span className={`text-xs ${textMuted}`}>Diatur oleh admin</span>
                </div>
              </div>

              <div className={`border-t ${borderDivider} pt-5 flex items-center justify-between flex-wrap gap-4`}>
                <p className={`text-xs ${textMuted}`}>
                  Last updated:{" "}
                  {new Date().toLocaleDateString("id-ID", {
                    day: "numeric", month: "long", year: "numeric",
                  })}
                </p>
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 ${
                    saved ? "bg-green-500 text-white" : `${buttonPrimary} text-white`
                  } disabled:opacity-50`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Saving...
                    </>
                  ) : saved ? (
                    <>
                      <HiCheckCircle size={18} />
                      Saved!
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* INFO CARD */}
          <div className={`bg-gradient-to-r ${gradientCard} rounded-3xl p-6 text-white flex items-start gap-4 transition-colors duration-200`}>
            <div className={`w-10 h-10 rounded-full ${iconWrapper} flex items-center justify-center flex-shrink-0 mt-0.5`}>
              <MdEmail size={18} className={isDark ? "text-gray-400" : "text-blue-200"} />
            </div>
            <div>
              <p className="font-semibold text-sm">Informasi Profile</p>
              <p className={`${infoText} text-xs mt-1 leading-relaxed`}>
                • Nama dan email dapat diubah kapan saja<br />
                • Foto profile maksimal 2MB dengan format JPG, PNG, atau GIF<br />
                • Posisi/role hanya dapat diubah oleh admin<br />
                • Perubahan akan langsung tampil di dashboard
              </p>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}