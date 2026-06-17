"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";

export default function VerifyRegister() {
  const router = useRouter();
  const { email } = router.query;
  const formRef = useRef(null);

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [registerData, setRegisterData] = useState(null);
  const [error, setError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  // "idle" | "verified" | "error"
  const [otpStatus, setOtpStatus] = useState("idle");

  useEffect(() => {
    try {
      const sessionData = sessionStorage.getItem("registerData");
      if (!sessionData) {
        setError("Data registrasi tidak ditemukan. Silakan daftar ulang.");
        setTimeout(() => router.push("/components/register"), 3000);
        return;
      }
      const data = JSON.parse(sessionData);
      if (!data || !data.email) {
        setError("Data registrasi tidak valid. Silakan daftar ulang.");
        setTimeout(() => router.push("/components/register"), 3000);
        return;
      }
      if (email && email !== data.email) {
        setError("Email tidak sesuai. Silakan daftar ulang.");
        setTimeout(() => router.push("/components/register"), 3000);
        return;
      }
      if (data.timestamp) {
        const elapsed = Date.now() - data.timestamp;
        if (elapsed > 10 * 60 * 1000) {
          setError("Sesi registrasi telah kadaluarsa. Silakan daftar ulang.");
          sessionStorage.removeItem("registerData");
          setTimeout(() => router.push("/components/register"), 3000);
          return;
        }
      }
      setRegisterData(data);
      setCountdown(30);
    } catch (err) {
      console.error("Error loading register data:", err);
      setError("Terjadi kesalahan. Silakan daftar ulang.");
      setTimeout(() => router.push("/components/register"), 3000);
    }
  }, [email, router]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleOtpChange = (e) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    setOtp(value);
    // Reset semua status setiap kali user mengetik
    setOtpStatus("idle");
    setOtpError("");
    setError("");
  };

  const getOtpBorderClass = () => {
    if (otpError) return "border-red-500 ring-2 ring-red-500 ring-opacity-50";
    if (otpStatus === "verified") return "border-green-500 ring-2 ring-green-500 ring-opacity-50";
    if (otpStatus === "error") return "border-red-500 ring-2 ring-red-500 ring-opacity-50";
    if (otp.length === 6) return "border-yellow-500 ring-2 ring-yellow-500 ring-opacity-50";
    return "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (!otp.trim()) { setOtpError("Masukkan kode OTP"); return; }
    if (otp.length !== 6) { setOtpError("Kode OTP harus 6 karakter"); return; }
    if (!registerData) { setError("Data registrasi tidak ditemukan"); return; }

    try {
      setLoading(true);
      setError("");
      setOtpError("");

      const response = await fetch("/api/auth/verif/verify-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...registerData, otp: otp.trim() }),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server mengembalikan response yang tidak valid.");
      }

      const data = await response.json();

      if (!response.ok) {
        setOtpStatus("error");
        throw new Error(data.message || "Verifikasi gagal");
      }

      setOtpStatus("verified");
      sessionStorage.removeItem("registerData");

      const role = data.user?.role?.toLowerCase() || "";
      setSuccessMessage("✅ Verifikasi berhasil! Mengalihkan...");

      setTimeout(() => {
        if (role === "admin") {
          router.push("/dashboardAdmin/admin");
        } else {
          router.push("/memberDashboard/MemberDashboard");
        }
      }, 1500);

    } catch (err) {
      console.error("Verify error:", err);
      setError(err.message || "Terjadi kesalahan saat verifikasi");
      // TIDAK reset otp — hindari race condition
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0 || !registerData) {
      if (countdown > 0) setError(`Tunggu ${countdown} detik untuk mengirim ulang`);
      return;
    }

    try {
      setResendLoading(true);
      setError("");
      setSuccessMessage("");
      setOtpStatus("idle");
      setOtp("");
      setOtpError("");

      const response = await fetch("/api/auth/send/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: registerData.email }),
      });

      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch {
        if (responseText.includes("<!DOCTYPE") || responseText.includes("<html")) {
          throw new Error("API endpoint tidak ditemukan.");
        }
        throw new Error("Server mengembalikan response tidak valid");
      }

      if (!response.ok) {
        throw new Error(data.message || `Server error (${response.status})`);
      }

      // TIDAK gunakan data.otp — OTP hanya dikirim ke email, tidak ditampilkan di UI
      setCountdown(30);
      setSuccessMessage("✅ Kode OTP baru telah dikirim ke email Anda");
      setTimeout(() => setSuccessMessage(""), 5000);

    } catch (err) {
      console.error("Resend OTP error:", err);
      setError(err.message || "Gagal mengirim ulang OTP. Silakan coba lagi nanti.");
    } finally {
      setResendLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && otp.length === 6) handleSubmit(e);
  };

  if (error && error.includes("Data registrasi")) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Sesi Kadaluarsa</h2>
          <p className="text-gray-600">{error}</p>
          <p className="text-sm text-gray-400 mt-4">Redirecting to register page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* LEFT SIDE */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80"
          alt="Email verification"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#001d55]/90 to-[#001d55]/70" />
        <div className="absolute inset-0 flex flex-col justify-center px-12 text-white">
          <div className="mb-8">
            <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium tracking-wider text-blue-200">
              PT Lintas Wahana Teknologi
            </span>
          </div>
          <h1 className="text-5xl font-bold leading-tight mb-6">Verify Your Email</h1>
          <p className="text-gray-200 text-lg leading-relaxed max-w-xl mb-8">
            Enter the OTP code we sent to your email to complete your account registration.
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Secure verification
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              OTP protected
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 py-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-50 rounded-2xl mb-4 relative">
              <svg className="w-10 h-10 text-[#001d55]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
                2
              </span>
            </div>
            <h1 className="text-3xl font-bold text-[#001d55]">Verify OTP</h1>
            <p className="text-gray-500 mt-2">
              Enter the 6-digit code sent to{" "}
              <span className="font-semibold text-[#001d55]">
                {registerData?.email || "your email"}
              </span>
            </p>
            <p className="text-xs text-gray-400 mt-1">
              ⏱ Sesi registrasi akan kadaluarsa dalam 10 menit
            </p>
          </div>

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">OTP Code</label>
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={handleOtpChange}
                onKeyPress={handleKeyPress}
                placeholder="Enter 6-digit OTP"
                className={`w-full text-center text-3xl tracking-[12px] font-mono font-bold px-4 py-4 rounded-xl border transition-all duration-200 ${getOtpBorderClass()} focus:outline-none bg-white uppercase`}
                disabled={loading}
                autoFocus
              />

              {otpError && (
                <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {otpError}
                </p>
              )}

              {otpStatus === "idle" && otp.length === 6 && !otpError && (
                <p className="mt-2 text-sm text-yellow-600 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Klik Verify untuk verifikasi OTP
                </p>
              )}

              {otpStatus === "verified" && (
                <p className="mt-2 text-sm text-green-500 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  ✅ OTP benar! Verifikasi berhasil.
                </p>
              )}

              <div className="mt-3 flex items-center justify-between text-sm text-gray-400">
                <span>Enter the 6-digit code</span>
                <span className="font-mono">{otp.length}/6</span>
              </div>
            </div>

            {successMessage && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-xl">
                <p className="text-sm text-green-600 flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {successMessage}
                </p>
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-600 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className={`w-full py-4 rounded-xl font-semibold transition flex items-center justify-center gap-2 ${
                otp.length === 6 && !loading
                  ? "bg-[#001d55] text-white hover:bg-[#00307d] shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </>
              ) : (
                "Verify Account"
              )}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={countdown > 0 || resendLoading}
                className={`text-sm transition ${
                  countdown > 0 || resendLoading
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-blue-700 hover:text-blue-800 hover:underline"
                }`}
              >
                {resendLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-blue-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : countdown > 0 ? (
                  `Resend OTP in ${countdown}s`
                ) : (
                  "Resend OTP"
                )}
              </button>
            </div>

            <div className="text-center pt-4 border-t border-gray-200">
              <Link
                href="/components/register"
                className="text-sm text-gray-500 hover:text-gray-700 transition flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Register
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}