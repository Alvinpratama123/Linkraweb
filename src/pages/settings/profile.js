import React, { useState, useRef } from "react";
import { HiCamera, HiCheckCircle } from "react-icons/hi2";
import { MdEmail, MdPerson, MdWork, MdEdit } from "react-icons/md";

export default function Profile() {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    fullName: "Administrator",
    email: "admin@lintaswahana.com",
    position: "Super Admin",
  });

  

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  // Inisial avatar dari nama
  const initials = form.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-[#eef2f7] p-6 md:p-10">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* HEADER */}
        <div>
          <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
            Settings
          </p>
          <h1 className="text-3xl font-bold text-[#001d55] mt-1">
            Profile Settings
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your personal information and account details.
          </p>
        </div>

        {/* CARD AVATAR */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col sm:flex-row items-center gap-6">
          {/* FOTO */}
          <div className="relative flex-shrink-0">
            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-[#001d55]/10 bg-[#001d55] flex items-center justify-center">
              {preview ? (
                <img
                  src={preview}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white text-3xl font-bold">{initials}</span>
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="absolute bottom-0 right-0 w-9 h-9 bg-[#001d55] hover:bg-[#003cb3] transition rounded-full flex items-center justify-center shadow-md"
            >
              <HiCamera size={16} className="text-white" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          {/* INFO SINGKAT */}
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-bold text-[#001d55]">{form.fullName}</h2>
            <p className="text-sm text-gray-500 mt-1">{form.email}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-[#001d55]/10 text-[#001d55] text-xs font-semibold rounded-full">
              {form.position}
            </span>
          </div>

          {/* UPLOAD BUTTON */}
          <div className="sm:ml-auto">
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="flex items-center gap-2 px-5 py-2.5 border-2 border-[#001d55] text-[#001d55] hover:bg-[#001d55] hover:text-white transition rounded-xl text-sm font-semibold"
            >
              <HiCamera size={16} />
              Upload Photo
            </button>
          </div>
        </div>

        {/* FORM CARD */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8">
          <div className="flex items-center gap-2 mb-6">
            <MdEdit size={20} className="text-[#001d55]" />
            <h3 className="text-lg font-bold text-[#001d55]">
              Personal Information
            </h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* FULL NAME */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Full Name
              </label>
              <div className="relative">
                <MdPerson
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full pl-11 pr-5 py-3.5 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#001d55]/40 text-gray-800 text-sm"
                  required
                />
              </div>
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Email Address
              </label>
              <div className="relative">
                <MdEmail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full pl-11 pr-5 py-3.5 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#001d55]/40 text-gray-800 text-sm"
                  required
                />
              </div>
            </div>

            {/* POSITION */}
        

            {/* DIVIDER */}
            <div className="border-t border-gray-100 pt-5 flex items-center justify-between">
              <p className="text-xs text-gray-400">
                Last updated: {new Date().toLocaleDateString("id-ID", {
                  day: "numeric", month: "long", year: "numeric"
                })}
              </p>

              {/* SUBMIT */}
              <button
                type="submit"
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 ${
                  saved
                    ? "bg-green-500 text-white"
                    : "bg-[#001d55] hover:bg-[#003cb3] text-white"
                }`}
              >
                {saved ? (
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
        <div className="bg-[#001d55] rounded-3xl p-6 text-white flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <MdEmail size={18} className="text-blue-200" />
          </div>
          <div>
            <p className="font-semibold text-sm">Email tidak bisa diubah sendiri</p>
            <p className="text-blue-200 text-xs mt-1 leading-relaxed">
              Untuk mengubah alamat email, silakan hubungi administrator sistem
              atau gunakan fitur Settings Akun.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}