// pages/components/forgot-password.js
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function ForgotPassword() {
  const router = useRouter();
  
  // Step: 1 = input email, 2 = verifikasi OTP, 3 = reset password
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetId, setResetId] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [canResend, setCanResend] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const inputRefs = [];

  // Countdown timer untuk resend OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setCanResend(true);
    }
  }, [countdown]);

  // Step 1: Kirim email untuk reset password
  const handleSendOTP = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError("Email wajib diisi");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Format email tidak valid");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal mengirim OTP");
      }

      setSuccess("OTP telah dikirim ke email Anda");
      setStep(2);
      setCountdown(60);
      setCanResend(false);

      if (data.otp) {
        console.log(`📧 OTP reset password: ${data.otp}`);
      }

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP input
  const handleOtpChange = (index, value) => {
    if (!/^[A-Za-z0-9]*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(0, 1).toUpperCase();
    setOtp(newOtp);
    
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const chars = pastedData.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 6);
    
    if (chars.length > 0) {
      const newOtp = [...otp];
      for (let i = 0; i < chars.length && i < 6; i++) {
        newOtp[i] = chars[i];
      }
      setOtp(newOtp);
    }
  };

  // Step 2: Verifikasi OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');

    if (otpCode.length !== 6) {
      setError("Mohon masukkan 6 digit kode OTP");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/auth/verify-reset-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Verifikasi OTP gagal");
      }

      setSuccess("OTP valid. Silakan buat password baru.");
      setResetId(data.resetId);
      setStep(3);
      setOtp(["", "", "", "", "", ""]);

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      setError("Password minimal 8 karakter");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Password tidak sama");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          otp: otp.join(''),
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal reset password");
      }

      setSuccess("✅ Password berhasil direset! Redirecting ke login...");

      setTimeout(() => {
        router.push("/components/login");
      }, 2000);

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    if (!canResend) return;
    
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal mengirim ulang OTP");
      }

      setSuccess("OTP baru telah dikirim ke email Anda");
      setCountdown(60);
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]);

      if (data.otp) {
        console.log(`📧 OTP baru: ${data.otp}`);
      }

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Render step 1: Input email
  const renderStep1 = () => (
    <form onSubmit={handleSendOTP} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your registered email"
          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          disabled={loading}
          required
        />
        <p className="mt-1 text-xs text-gray-400">
          Kami akan mengirimkan kode OTP ke email Anda untuk reset password.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-xl">
          <p className="text-sm text-green-600">{success}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#001d55] text-white py-3.5 rounded-xl font-semibold hover:bg-[#00307d] transition disabled:opacity-50"
      >
        {loading ? "Sending OTP..." : "Send OTP"}
      </button>

      <div className="text-center">
        <Link href="/components/login" className="text-sm text-gray-500 hover:text-[#001d55] transition">
          ← Back to Login
        </Link>
      </div>
    </form>
  );

  // Render step 2: Verifikasi OTP
  const renderStep2 = () => (
    <form onSubmit={handleVerifyOTP} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Kode OTP
        </label>
        <p className="text-xs text-gray-400 mb-3">
          Masukkan 6 digit kode yang dikirim ke <strong>{email}</strong>
        </p>
        <div className="flex justify-center gap-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleOtpKeyDown(index, e)}
              onPaste={index === 0 ? handleOtpPaste : undefined}
              disabled={loading}
              className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition uppercase"
              autoFocus={index === 0}
            />
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">
          Masukkan 6 digit kode OTP
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-xl">
          <p className="text-sm text-green-600">{success}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#001d55] text-white py-3.5 rounded-xl font-semibold hover:bg-[#00307d] transition disabled:opacity-50"
      >
        {loading ? "Verifying..." : "Verify OTP"}
      </button>

      <div className="text-center">
        <button
          type="button"
          onClick={handleResend}
          disabled={!canResend || loading}
          className={`text-sm font-medium transition ${
            canResend && !loading
              ? "text-[#001d55] hover:underline cursor-pointer"
              : "text-gray-400 cursor-not-allowed"
          }`}
        >
          {loading ? "Loading..." : canResend ? "Kirim Ulang OTP" : `Kirim Ulang (${countdown}s)`}
        </button>
      </div>

      <div className="text-center">
        <button
          type="button"
          onClick={() => setStep(1)}
          className="text-sm text-gray-500 hover:text-[#001d55] transition"
        >
          ← Ganti Email
        </button>
      </div>
    </form>
  );

  // Render step 3: Reset password
  const renderStep3 = () => (
    <form onSubmit={handleResetPassword} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password Baru
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Minimal 8 karakter"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition pr-12"
            disabled={loading}
            required
            minLength={8}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? "👁️" : "👁️‍🗨️"}
          </button>
        </div>
        <p className="mt-1 text-xs text-gray-400">
          Minimal 8 karakter, mengandung huruf dan angka
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Konfirmasi Password Baru
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Konfirmasi password baru"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition pr-12"
            disabled={loading}
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-xl">
          <p className="text-sm text-green-600">{success}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#001d55] text-white py-3.5 rounded-xl font-semibold hover:bg-[#00307d] transition disabled:opacity-50"
      >
        {loading ? "Resetting..." : "Reset Password"}
      </button>
    </form>
  );

  return (
    <div className="min-h-screen flex bg-gray-50">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <Image
          src="/images/ka.jpeg"
          alt="Forgot Password background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#001d55]/90 to-[#001d55]/70" />
        <div className="absolute inset-0 flex flex-col justify-center px-12 text-white">
          <h1 className="text-5xl font-bold leading-tight mb-6">
            Lupa Password?
          </h1>
          <p className="text-gray-200 text-lg leading-relaxed max-w-xl">
            Jangan khawatir! Kami akan membantu Anda mereset password.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 py-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <img src="/images/oip.png" alt="Logo" className="mx-auto h-16 w-auto mb-4" />
            <h1 className="text-3xl font-bold text-[#001d55]">
              {step === 1 && "Lupa Password"}
              {step === 2 && "Verifikasi OTP"}
              {step === 3 && "Reset Password"}
            </h1>
            <p className="text-gray-500 mt-2">
              {step === 1 && "Masukkan email Anda untuk reset password"}
              {step === 2 && "Masukkan kode OTP yang dikirim ke email Anda"}
              {step === 3 && "Buat password baru untuk akun Anda"}
            </p>
            <div className="flex justify-center mt-4 gap-2">
              <div className={`w-3 h-3 rounded-full ${step === 1 ? 'bg-[#001d55]' : 'bg-gray-300'}`} />
              <div className={`w-3 h-3 rounded-full ${step === 2 ? 'bg-[#001d55]' : 'bg-gray-300'}`} />
              <div className={`w-3 h-3 rounded-full ${step === 3 ? 'bg-[#001d55]' : 'bg-gray-300'}`} />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
          </div>
        </div>
      </div>
    </div>
  );
}