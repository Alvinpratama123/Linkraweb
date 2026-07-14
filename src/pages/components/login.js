
// ============================================================
// HALAMAN LOGIN - Frontend (Client Component)
// ============================================================
// ALUR EKSEKUSI:
// 1. User buka halaman login → form tampil (email + password)
// 2. User isi email & password → klik tombol "Login"
// 3. Fungsi handleLogin() dipanggil → kirim POST ke /api/auth/login
// 4. Backend proses: cek email di DB → bandingkan password (bcrypt)
// 5. Jika cocok → backend buat JWT token → set cookie HttpOnly
// 6. Backend kirim response { success, user, redirect }
// 7. Frontend terima response → redirect ke dashboard sesuai role:
//    - role "admin" → /dashboardAdmin/admin
//    - selain admin → /memberDashboard/MemberDashboard
// 8. Setelah redirect, dashboard akan panggil /api/auth/me
//    untuk ambil data user dari cookie JWT yang sudah tersimpan
// ============================================================
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  // useRouter = hook Next.js untuk navigasi halaman
  const router = useRouter();

  // ─── STATE FORM ────────────────────────────────────────────
  // email = input email user
  // password = input password user
  // loading = true saat proses login berjalan (disable tombol)
  // error = pesan error jika login gagal
  // showPassword = toggle tampilkan/sembunyikan password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // ─── FUNGSI LOGIN ──────────────────────────────────────────
  // Dipanggil saat form di-submit
  // Mengirim email & password ke API, lalu redirect sesuai role
  const handleLogin = async (e) => {
    // e.preventDefault() = mencegah form reload halaman
    e.preventDefault();
    setLoading(true); // Aktifkan loading, disable tombol login
    setError("");     // Bersihkan error sebelumnya

    try {
      // ─── STEP 1: Kirim request POST ke API login ──────────
      // fetch() = API bawaan browser untuk kirim HTTP request
      // method POST = mengirim data ke server
      // body = data yang dikirim (diubah ke JSON string)
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      // ─── STEP 2: Parse response dari server ───────────────
      // response.json() = ubah response body dari JSON string ke object
      const data = await response.json();

      // ─── STEP 3: Cek apakah login berhasil ────────────────
      // response.ok = true jika status 200-299
      // Jika gagal (401, 400, 500), lempar error
      if (!response.ok) {
        throw new Error(data.message || "Login gagal");
      }

      // ─── STEP 4: Redirect berdasarkan role user ───────────
      // data.user.role = "admin" → admin dashboard
      // data.user.role selain "admin" → member dashboard
      // Cookie auth_token sudah di-set oleh backend (HttpOnly)
      // Jadi browser otomatis kirim cookie di setiap request
      if (data.success && data.user) {
        if (data.user.role === "admin") {
          // Admin → halaman dashboard admin
          router.push("/dashboardAdmin/admin");
        } else {
          // Member → halaman dashboard member
          router.push("/memberDashboard/MemberDashboard");
        }
      }
    } catch (error) {
      // Jika ada error (network, server error, dll), tampilkan pesan
      setError(error.message);
    } finally {
      // finally = selalu dijalankan, baik berhasil maupun gagal
      // Matikan loading agar tombol bisa diklik lagi
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* ─── KOLOM KIRI: Background Image (hanya tampil di layar besar) ─── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <Image
          src="/images/ka.jpeg"
          alt="Login background"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay gelap supaya teks terbaca */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#001d55]/90 to-[#001d55]/70" />
        <div className="absolute inset-0 flex flex-col justify-center px-12 text-white">
          <h1 className="text-5xl font-bold leading-tight mb-6">Website Teknologi inovasi negri PT.Linkra Wahana Teknologi</h1>
          <p className="text-gray-200 text-lg leading-relaxed max-w-xl">
            Login to your account and manage your projects.
          </p>
        </div>
      </div>

      {/* ─── KOLOM KANAN: Form Login ─── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 py-8">
        <div className="w-full max-w-md">
          {/* Header: Logo + Judul */}
          <div className="text-center mb-8">
            <img src="/images/oip.png" alt="Logo" className="mx-auto h-16 w-auto mb-4" />
            <h1 className="text-3xl font-bold text-[#001d55]">Login</h1>
            <p className="text-gray-500 mt-2">Welcome back! Please login to your account.</p>
          </div>

          {/* ─── FORM LOGIN ─── */}
          {/* onSubmit = handleLogin dipanggil saat form di-submit (Enter atau klik tombol) */}
          <form className="space-y-4" onSubmit={handleLogin}>
            {/* Input Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              {/* value = email dari state, onChange = update state setiap ketik */}
              {/* required = wajib diisi, browser validasi otomatis */}
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                required
              />
            </div>

            {/* Input Password dengan toggle show/hide */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                {/* type toggle: "text" = terlihat, "password" = titik-titik */}
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition pr-12"
                  required
                />
                {/* Tombol toggle show/hide password */}
                {/* type="button" supaya tidak submit form */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            {/* Pesan error (muncul jika login gagal) */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Link Forgot Password */}
            <div className="flex justify-end">
              <Link href="/components/forgot-password" className="text-sm text-[#001d55] font-semibold hover:underline">
                Forgot Password?
              </Link>
            </div>

            {/* Tombol Submit Login */}
            <button
              type="submit"
              disabled={loading} /* Saat loading = true, tombol disabled (tidak bisa diklik) */
              className="w-full bg-[#001d55] text-white py-3.5 rounded-xl font-semibold hover:bg-[#00307d] transition disabled:opacity-50"
            >
              {loading ? "Loading..." : "Login"}
            </button>
          </form>

          {/* Info: Hubungi admin untuk buat akun */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Hubungi administrator untuk membuat akun
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}