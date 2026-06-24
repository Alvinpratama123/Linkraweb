// pages/componentsOtp/verify-register.js
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function VerifyRegister() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [otpStatus, setOtpStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [registerData, setRegisterData] = useState(null);
  
  const inputRefs = useRef([]);

  // Load register data dari session storage
  useEffect(() => {
    try {
      const data = sessionStorage.getItem('registerData');
      if (data) {
        const parsed = JSON.parse(data);
        setRegisterData(parsed);
        console.log('📝 Register data loaded:', parsed);
      } else {
        console.warn('⚠️ No register data found in sessionStorage');
        setErrorMessage('Data registrasi tidak ditemukan. Silakan registrasi ulang.');
      }
    } catch (error) {
      console.error('Error loading register data:', error);
      setErrorMessage('Gagal memuat data registrasi');
    }
  }, []);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0 && !canResend) {
      const timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setCanResend(true);
    }
  }, [countdown, canResend]);

  // Focus ke input pertama saat mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // 🔥 PERBAIKI: Terima huruf dan angka (alfanumerik)
  const handleOtpChange = (index, value) => {
    // Hanya terima alfanumerik (huruf besar/kecil dan angka)
    // Ubah ke huruf besar untuk konsistensi
    const cleanedValue = value.slice(0, 1).toUpperCase();
    
    // Cek apakah karakter adalah huruf atau angka
    if (cleanedValue && !/^[A-Z0-9]$/.test(cleanedValue)) {
      return;
    }
    
    const newOtp = [...otp];
    newOtp[index] = cleanedValue;
    setOtp(newOtp);
    
    // Auto focus ke input berikutnya
    if (cleanedValue && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Backspace: pindah ke input sebelumnya
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    
    // Arrow kiri
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    
    // Arrow kanan
    if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // 🔥 PERBAIKI: Paste bisa menerima huruf dan angka
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    // Hanya ambil huruf dan angka, ubah ke huruf besar
    const chars = pastedData.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 6);
    
    if (chars.length > 0) {
      const newOtp = [...otp];
      for (let i = 0; i < chars.length && i < 6; i++) {
        newOtp[i] = chars[i];
      }
      setOtp(newOtp);
      
      // Focus ke input terakhir yang terisi
      const lastIndex = Math.min(chars.length - 1, 5);
      if (lastIndex < 6) {
        inputRefs.current[lastIndex]?.focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');

    if (otpCode.length !== 6) {
      setErrorMessage('Mohon masukkan 6 digit kode OTP');
      return;
    }

    if (!email) {
      setErrorMessage('Email tidak ditemukan');
      return;
    }

    if (!registerData) {
      setErrorMessage('Data registrasi tidak ditemukan. Silakan registrasi ulang.');
      return;
    }

    setLoading(true);
    setOtpStatus('verifying');
    setErrorMessage('');

    try {
      const payload = {
        name: registerData.name,
        email: decodeURIComponent(email),
        role: registerData.role,
        password: registerData.password,
        otp: otpCode
      };

      console.log('📤 Verifying with payload:', { ...payload, password: '********' });

      const response = await fetch('/api/auth/verify-register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('📥 Verify response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Verifikasi gagal');
      }

      setOtpStatus('verified');
      setSuccessMessage('✅ Verifikasi berhasil! Redirecting...');

      // Clear session storage
      sessionStorage.removeItem('registerData');

      // Redirect setelah 2 detik
      setTimeout(() => {
        if (data.redirect) {
          router.push(data.redirect);
        } else {
          router.push('/');
        }
      }, 2000);

    } catch (error) {
      console.error('❌ Verification error:', error);
      setOtpStatus('error');
      setErrorMessage(error.message || 'Gagal verifikasi. Silakan coba lagi.');
      setOtp(['', '', '', '', '', '']);
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    if (!email) {
      setErrorMessage('Email tidak ditemukan');
      return;
    }

    setResendLoading(true);
    setErrorMessage('');

    try {
      console.log('📤 Resending OTP for:', decodeURIComponent(email));

      const response = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: decodeURIComponent(email)
        }),
      });

      const data = await response.json();
      console.log('📥 Resend response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Gagal mengirim ulang OTP');
      }

      // Reset countdown
      setCountdown(60);
      setCanResend(false);
      setSuccessMessage('📧 OTP baru telah dikirim ke email Anda');
      setOtp(['', '', '', '', '', '']);
      
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);

      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);

      if (data.otp) {
        console.log(`📧 OTP baru: ${data.otp}`);
      }

    } catch (error) {
      console.error('❌ Resend error:', error);
      setErrorMessage(error.message || 'Gagal mengirim ulang OTP');
    } finally {
      setResendLoading(false);
    }
  };

  useEffect(() => {
    if (!email) {
      router.push('/components/register');
    }
  }, [email, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-2xl mb-4">
              <svg className="w-8 h-8 text-[#001d55]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-[#001d55]">Verifikasi Email</h1>
            <p className="text-gray-500 mt-2 text-sm">
              Kami telah mengirimkan kode OTP ke
            </p>
            <p className="text-gray-700 font-medium text-sm">{email}</p>
          </div>

          {/* Status Messages */}
          {successMessage && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl">
              <p className="text-sm text-green-700">{successMessage}</p>
            </div>
          )}

          {errorMessage && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-700">{errorMessage}</p>
            </div>
          )}

          {/* OTP Input */}
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                Masukkan 6 Digit Kode OTP
              </label>
              <div className="flex justify-center gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    disabled={loading || otpStatus === 'verified'}
                    className={`w-12 h-14 text-center text-xl font-bold border-2 rounded-xl focus:outline-none focus:ring-2 transition-all uppercase
                      ${otpStatus === 'error' ? 'border-red-500 focus:ring-red-500' : ''}
                      ${otpStatus === 'verified' ? 'border-green-500 bg-green-50' : ''}
                      ${!otpStatus || otpStatus === 'idle' ? 'border-gray-300 focus:ring-blue-500' : ''}
                    `}
                    autoFocus={index === 0}
                    style={{ textTransform: 'uppercase' }}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-3 text-center">
                Masukkan 6 digit kode yang dikirim ke email Anda
              </p>
              <p className="text-xs text-gray-400 text-center">
                (Huruf dan angka, tidak case sensitive)
              </p>
              {process.env.NODE_ENV === 'development' && (
                <p className="text-xs text-blue-500 mt-2 text-center">
                  📝 Dev: Cek console untuk OTP
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || otpStatus === 'verified'}
              className={`w-full py-3 rounded-xl font-semibold transition-all
                ${loading || otpStatus === 'verified' 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-[#001d55] hover:bg-[#002d6e] text-white'
                }
              `}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Memverifikasi...
                </span>
              ) : otpStatus === 'verified' ? (
                '✅ Terverifikasi'
              ) : (
                'Verifikasi Email'
              )}
            </button>
          </form>

          {/* Resend OTP */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Tidak menerima kode?{' '}
              <button
                onClick={handleResend}
                disabled={!canResend || resendLoading}
                className={`font-medium transition-all
                  ${canResend && !resendLoading
                    ? 'text-[#001d55] hover:underline cursor-pointer'
                    : 'text-gray-400 cursor-not-allowed'
                  }
                `}
              >
                {resendLoading ? (
                  <span className="flex items-center justify-center gap-1">
                    <svg className="animate-spin h-4 w-4 text-[#001d55]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Mengirim...
                  </span>
                ) : canResend ? (
                  'Kirim Ulang OTP'
                ) : (
                  `Kirim Ulang (${countdown}s)`
                )}
              </button>
            </p>
          </div>

          {/* Back to Register */}
          <div className="mt-4 text-center">
            <Link href="/components/register" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
              ← Kembali ke Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}