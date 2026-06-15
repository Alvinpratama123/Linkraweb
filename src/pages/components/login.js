// pages/login.js
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import toast, { Toaster } from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  // Cek apakah sudah login dan memiliki token verifikasi
  useEffect(() => {
    const checkVerification = async () => {
      const { token } = router.query;
      //user
      if (token) {
        setRedirecting(true);
        toast.loading("Memverifikasi login...", { id: "verify" });
        
        try {
          const response = await fetch(`/api/auth/verif/verify-login?token=${token}`);
          const data = await response.json();
          
          toast.dismiss("verify");
          
          if (data.success) {
            toast.success("Login berhasil!");
            
            // Simpan data user
            if (data.user) {
              localStorage.setItem("user", JSON.stringify(data.user));
            }
            
            // Redirect berdasarkan role
            setTimeout(() => {
              if (data.user?.role === "ADMIN") {
                router.push("/dashboardAdmin/admin");
              } else {
                router.push("/memberDashboard/MemberDashboard");
              }
            }, 1500);
          } else {
            toast.error(data.message || "Verifikasi gagal");
            // Hapus token dari URL
            router.replace("/components/login", undefined, { shallow: true });
          }
        } catch (error) {
          console.error("Verification error:", error);
          toast.error("Terjadi kesalahan saat verifikasi");
          router.replace("/components/login", undefined, { shallow: true });
        } finally {
          setRedirecting(false);
        }
      }
    };
    
    checkVerification();
  }, [router.query, router]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Email dan password harus diisi!");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Format email tidak valid!");
      return;
    }

    try {
      setLoading(true);
      toast.loading("Mengirim permintaan login...", { id: "login" });

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.dismiss("login");
        toast.error(data.message || "Login gagal");
        return;
      }

      // Handle remember me
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("rememberedEmail");
        localStorage.removeItem("rememberMe");
      }

      toast.dismiss("login");
      toast.success("Email verifikasi terkirim!");
      setEmailSent(true);

    } catch (error) {
      console.error("Login error:", error);
      toast.dismiss("login");
      toast.error("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  // Loading saat redirecting
  if (redirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memverifikasi login...</p>
        </div>
      </div>
    );
  }

  if (emailSent) {
    return (
      <>
        <Toaster position="top-center" />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 animate-fadeIn">
          <div className="w-full max-w-md bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl text-center animate-slideUp">
            <div className="text-7xl mb-6 animate-bounce">📧</div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-transparent mb-4">
              Cek Email Anda!
            </h2>
            <p className="text-gray-600 mb-3">
              Kami telah mengirimkan link verifikasi ke
            </p>
            <p className="text-lg font-semibold text-blue-700 bg-blue-50 py-2 px-4 rounded-full inline-block mb-6 break-all">
              {email}
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 mb-6">
              <span className="font-bold">⏱ Link verifikasi hanya berlaku selama 15 menit</span>
            </div>
            <button
              onClick={() => {
                setEmailSent(false);
                toast.success("Kembali ke form login");
              }}
              className="text-blue-600 hover:text-blue-800 font-medium transition-all inline-flex items-center gap-2"
            >
              <span>←</span> Kembali ke Login
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '12px',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      
      <div className="min-h-screen flex flex-col lg:flex-row animate-fadeIn">
        {/* LEFT SIDE - Hero Section */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden animate-slideLeft">
          <img
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
            alt="Digital transformation"
            className="w-full h-full object-cover scale-105 transition-transform duration-700 hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#001d55]/95 to-[#001d55]/80" />
          <div className="absolute inset-0 flex flex-col justify-center px-16 text-white">
            <div>
              <p className="uppercase tracking-[8px] text-blue-300 mb-4 text-sm font-light">
                PT Lintas Wahana Teknologi
              </p>
              <h1 className="text-5xl font-bold leading-tight mb-6">
                Digital Transformation & <br />
                <span className="text-blue-300">Infrastructure Solutions</span>
              </h1>
              <p className="text-gray-200 text-lg leading-relaxed max-w-xl">
                Secure enterprise infrastructure and modern technology solutions
                built for the future of digital business.
              </p>
              <div className="mt-8 flex gap-6">
                <div className="flex items-center gap-2 group cursor-pointer">
                  <div className="w-2 h-2 bg-blue-400 rounded-full group-hover:scale-150 transition-transform"></div>
                  <span className="text-sm text-gray-300">24/7 Support</span>
                </div>
                <div className="flex items-center gap-2 group cursor-pointer">
                  <div className="w-2 h-2 bg-blue-400 rounded-full group-hover:scale-150 transition-transform"></div>
                  <span className="text-sm text-gray-300">Enterprise Grade</span>
                </div>
                <div className="flex items-center gap-2 group cursor-pointer">
                  <div className="w-2 h-2 bg-blue-400 rounded-full group-hover:scale-150 transition-transform"></div>
                  <span className="text-sm text-gray-300">ISO Certified</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-8 animate-slideRight">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 transform transition-all duration-500 hover:shadow-3xl animate-scaleUp">
            {/* Logo Section */}
            <div className="text-center mb-8">
              <div className="w-40 h-40 flex items-center justify-center mx-auto mb-4">
                <img src="/images/oip.png" alt="Logo" className="w-80 h-40 object-contain" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#001d55] to-[#003cb3] bg-clip-text text-transparent">
                PT Lintas Wahana
              </h1>
              <p className="text-gray-500 mt-2">Welcome back! Please sign in</p>
            </div>

            <form className="space-y-5" onSubmit={handleLogin}>
              {/* Email Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-gray-600 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                  />
                  <span className="group-hover:text-gray-800 transition-colors">Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    toast.custom((t) => (
                      <div className="bg-white rounded-lg shadow-xl p-4 max-w-sm border-l-4 border-blue-600">
                        <div className="flex items-start gap-3">
                          <div className="text-2xl">🔐</div>
                          <div>
                            <h4 className="font-semibold text-gray-800">Lupa Password?</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              Silakan hubungi administrator untuk mereset password Anda.
                            </p>
                            <button
                              onClick={() => toast.dismiss(t.id)}
                              className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium"
                            >
                              Tutup
                            </button>
                          </div>
                        </div>
                      </div>
                    ), { duration: 5000 });
                  }}
                  className="text-blue-600 hover:text-blue-800 font-medium transition-all hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#001d55] to-[#003cb3] hover:from-[#003cb3] hover:to-[#0055dd] transition-all duration-300 text-white py-3.5 rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Mengirim Email...
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            {/* Register Link */}
            <div className="mt-6 text-center text-sm text-gray-500">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => router.push("/register")}
                className="text-blue-600 hover:text-blue-800 font-semibold transition-all hover:underline ml-1"
              >
                Register here
              </button>
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-gray-200 text-center text-xs text-gray-400">
              © {new Date().getFullYear()} PT Lintas Wahana Teknologi. All rights reserved.
            </div>
          </div>
        </div>
      </div>

      {/* Animations CSS */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes scaleUp {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.5s ease-out;
        }
        
        .animate-slideLeft {
          animation: slideLeft 0.6s ease-out;
        }
        
        .animate-slideRight {
          animation: slideRight 0.6s ease-out;
        }
        
        .animate-scaleUp {
          animation: scaleUp 0.4s ease-out;
        }
        
        .animate-bounce {
          animation: bounce 1s ease-in-out infinite;
        }
        
        .shadow-3xl {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </>
  );
}