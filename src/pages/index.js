// ============================================================
// HALAMAN LANDING PAGE — PT Linkra Wahana Teknologi
// ============================================================
// ALUR EKSEKUSI:
// 1. Halaman publik — TIDAK memerlukan login/autentikasi
// 2. Menampilkan informasi perusahaan, layanan, teknologi, dan kontak
// 3. Terdapat tombol LOGIN / Dashboard (bergantung status auth)
// 4. TIDAK ada tombol Register — pendaftaran akun hanya dilakukan oleh admin
// 5. Navbar berubah transparan → putih saat user scroll ke bawah
// 6. Bagian utama: Navbar → Hero → About → Projects & Progress → Profile Teams → Footer
// 7. Navbar links smooth-scroll ke section masing-masing
// 8. Section Projects & Progress menampilkan grafik data real dari /api/stats/public
// 9. Mendukung dark mode — toggle di navbar, tersimpan di localStorage
// ============================================================

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Globe,
  Cloud,
  ShieldCheck,
  Database,
  BarChart3,
  Cpu,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Zap,
  Award,
  Users,
  Clock,
  ChevronRight,
  FolderOpen,
  TrendingUp,
  CheckCircle2,
  Sun,
  Moon,
} from "lucide-react";

export default function PTLintasWahanaLanding() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [projectStats, setProjectStats] = useState(null);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("lw-theme") === "dark";
    }
    return false;
  });

  const aboutRef = useRef(null);
  const projectsRef = useRef(null);
  const profileRef = useRef(null);
  const contactRef = useRef(null);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem("lw-theme", next ? "dark" : "light");
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        const data = await res.json();
        if (res.ok && data.success && data.user) {
          setIsLoggedIn(true);
          setUserRole(data.user.role);
        } else {
          setIsLoggedIn(false);
        }
      } catch {
        setIsLoggedIn(false);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/stats/public");
        const data = await res.json();
        if (data.success) setProjectStats(data.stats);
      } catch {}
    };
    fetchStats();
  }, []);

  const getDashboardPath = () => {
    if (userRole === "ADMIN") return "/dashboardAdmin/admin";
    return "/memberDashboard/MemberDashboard";
  };

  const scrollTo = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  const navLinks = [
    { label: "About", ref: aboutRef },
    { label: "Projects", ref: projectsRef },
    { label: "Profile", ref: profileRef },
    { label: "Contact", ref: contactRef },
  ];

  return (
    <div className={`${isDark ? "bg-slate-950 text-gray-100" : "bg-[#f5f7fb] text-gray-900"} font-sans overflow-x-hidden transition-colors duration-300`}>
      {/* ─── NAVBAR ────────────────────────────────────────────── */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isScrolled
            ? isDark
              ? "bg-slate-900/95 backdrop-blur-md shadow-xl py-3"
              : "bg-white/95 backdrop-blur-md shadow-xl py-3"
            : isDark
              ? "bg-slate-900 shadow-sm py-5"
              : "bg-white shadow-sm py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer flex-shrink-0">
            <div className={`block font-bold text-lg md:text-xl leading-tight ${isDark ? "text-blue-400" : "text-blue-700"}`}>PT</div>
            <div className="relative">
              <img
                src="/images/oip.png"
                alt="Logo"
                className="h-12 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
            </div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-lg md:text-xl leading-tight">
                <span className={`block ${isDark ? "text-blue-400" : "text-blue-700"}`}>Wahana Teknologi</span>
              </h1>
            </div>
          </div>

          <nav className="hidden md:flex gap-8 text-sm font-medium">
            {navLinks.map((item) => (
              <button
                key={item.label}
                onClick={() => scrollTo(item.ref)}
                className={`${isDark ? "text-gray-300 hover:text-blue-400" : "text-gray-700 hover:text-blue-700"} transition-all duration-300 hover:scale-105`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3 flex-shrink-0">
          
            {isLoggedIn ? (
              <Link href={getDashboardPath()}>
                <button className="bg-gradient-to-r from-blue-700 to-blue-600 text-white px-5 py-2 rounded-full hover:from-blue-800 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium text-sm">
                  Dashboard
                </button>
              </Link>
            ) : (
              <Link href="/components/login">
                <button className="bg-gradient-to-r from-blue-700 to-blue-600 text-white px-5 py-2 rounded-full hover:from-blue-800 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium text-sm">
                  Login
                </button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* ─── HERO SECTION ──────────────────────────────────────── */}
      <section className="relative h-screen overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/AA.png"
            alt="hero"
            className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-10000 animate-slowZoom"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex items-center">
          <div className="max-w-3xl text-white animate-fadeInUp">
           

            <h1 className="text-4xl md:text-7xl font-bold leading-tight mb-6 bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent">
              Platform Digital Tim Pengembangan Teknologi Linkra Wahana
            </h1>

            <p className="text-lg text-gray-200 mb-8 leading-relaxed">
              Empowering businesses with modern technology, secure systems, and
              enterprise-grade digital transformation services.
            </p>

            <div className="flex flex-wrap gap-4">
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-2 bg-white rounded-full mt-2 animate-scroll"></div>
          </div>
        </div>
      </section>

      {/* ─── ABOUT SECTION ─────────────────────────────────────── */}
      <section ref={aboutRef} id="about" className={`py-28 relative overflow-hidden transition-colors duration-300 ${isDark ? "bg-slate-900" : "bg-white"}`}>
        <div className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-30 ${isDark ? "bg-blue-900" : "bg-blue-100"}`}></div>
        <div className={`absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-30 ${isDark ? "bg-purple-900" : "bg-purple-100"}`}></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-slideInLeft">
              <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 mb-6 ${isDark ? "bg-blue-950" : "bg-blue-100"}`}>
                <ShieldCheck size={16} className={isDark ? "text-blue-400" : "text-blue-700"} />
                <p className={`uppercase tracking-widest text-xs font-semibold ${isDark ? "text-blue-400" : "text-blue-700"}`}>
                  About Us
                </p>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Teknologi Digital PT Linkra Wahana Teknologi
              </h2>

              <p className={`leading-8 mb-8 text-lg ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                PT Linkra Wahana Teknologi adalah perusahaan yang bergerak di bidang Teknologi Informasi dan Internet of Things (IoT). Kami hadir untuk memberikan solusi teknologi kelas enterprise yang inovatif, aman, dan berorientasi pada keunggulan operasional.

                Misi kami adalah mempercepat transformasi digital melalui solusi yang skalabel dan terintegrasi. Di balik setiap solusi yang kami hadirkan, terdapat tim teknologi internal yang solid, kolaboratif, dan berdedikasi tinggi.
              </p>
            </div>

            <div className="relative animate-slideInRight">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/images/dashboard.png"
                  alt="office"
                  className="w-full h-[500px] object-cover object-center transition-transform duration-700 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl -z-10 blur-2xl opacity-50"></div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PROJECTS & PROGRESS SECTION ──────────────────────── */}
      <section ref={projectsRef} id="projects" className={`py-28 relative overflow-hidden transition-colors duration-300 ${isDark ? "bg-slate-950" : "bg-gradient-to-br from-gray-50 to-blue-50"}`}>
        <div className={`absolute top-20 right-10 w-72 h-72 rounded-full blur-3xl opacity-20 ${isDark ? "bg-blue-900" : "bg-blue-200"}`}></div>
        <div className={`absolute bottom-20 left-10 w-96 h-96 rounded-full blur-3xl opacity-20 ${isDark ? "bg-purple-900" : "bg-purple-200"}`}></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 mb-4 ${isDark ? "bg-blue-950" : "bg-blue-100"}`}>
              <TrendingUp size={16} className={isDark ? "text-blue-400" : "text-blue-700"} />
              <p className={`uppercase tracking-widest text-xs font-semibold ${isDark ? "text-blue-400" : "text-blue-700"}`}>
                Our Projects
              </p>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Project Progress & Analytics
            </h2>
            <p className={`max-w-2xl mx-auto ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              Real-time overview of all projects managed across the team
            </p>
          </div>

          {/* Program Analytics + Member Analytics */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Program Analytics */}
            <div className={`rounded-2xl p-6 border hover:shadow-lg transition-all duration-300 ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"}`}>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className={`text-sm font-semibold uppercase tracking-wider ${isDark ? "text-slate-500" : "text-gray-400"}`}>
                    Program Analytics
                  </p>
                  <h2 className={`mt-1 text-2xl font-bold ${isDark ? "text-white" : "text-[#001d55]"}`}>
                    {projectStats?.totalProjects || 0} Program
                  </h2>
                  <p className={`text-xs mt-0.5 ${isDark ? "text-slate-600" : "text-gray-400"}`}>
                    Dikategorikan dari nama project
                  </p>
                </div>
                <div className="bg-gradient-to-r from-[#001d55] to-[#003d9e] text-white rounded-full px-3 py-1 text-xs font-semibold shadow-sm">
                  Total
                </div>
              </div>
              {(!projectStats?.programs || projectStats.programs.length === 0) ? (
                <div className={`h-64 flex items-center justify-center text-sm ${isDark ? "text-slate-600" : "text-gray-400"}`}>
                  Belum ada data program
                </div>
              ) : (
                <div className="mt-6 flex items-end justify-between gap-3 h-64">
                  {projectStats.programs.map((item) => {
                    const maxCat = Math.max(...projectStats.programs.map((p) => p.count), 1);
                    const heightPercent = (item.count / maxCat) * 100;
                    return (
                      <div key={item.label} className="flex flex-col items-center justify-end gap-2 flex-1 h-full group">
                        <span className={`text-sm font-bold transition-transform group-hover:scale-110 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                          {item.count}
                        </span>
                        <div className={`relative w-full rounded-xl overflow-hidden flex items-end flex-1 ${isDark ? "bg-slate-800" : "bg-gray-100"}`}>
                          <div
                            className="absolute bottom-0 left-0 w-full transition-all duration-500 group-hover:opacity-90 rounded-xl"
                            style={{ height: `${heightPercent}%`, background: "linear-gradient(180deg, #003d9e 0%, #001d55 100%)" }}
                          >
                            <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-t-xl" />
                          </div>
                        </div>
                        <span className={`text-xs font-medium text-center leading-tight ${isDark ? "text-slate-500" : "text-gray-600"}`}>
                          {item.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Member Analytics */}
            <div className={`rounded-2xl p-6 border hover:shadow-lg transition-all duration-300 ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"}`}>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className={`text-sm font-semibold uppercase tracking-wider ${isDark ? "text-slate-500" : "text-gray-400"}`}>
                    Member Analytics
                  </p>
                  <h2 className={`mt-1 text-2xl font-bold ${isDark ? "text-white" : "text-[#001d55]"}`}>
                    {projectStats?.totalMembers || 0} Member
                  </h2>
                  <p className={`text-xs mt-0.5 ${isDark ? "text-slate-600" : "text-gray-400"}`}>
                    Berdasarkan posisi member terdaftar
                  </p>
                </div>
                <div className="bg-gradient-to-r from-[#001d55] to-[#003d9e] text-white rounded-full px-3 py-1 text-xs font-semibold shadow-sm">
                  Total
                </div>
              </div>
              {(!projectStats?.members || projectStats.members.length === 0) ? (
                <div className={`h-64 flex items-center justify-center text-sm ${isDark ? "text-slate-600" : "text-gray-400"}`}>
                  Belum ada data member
                </div>
              ) : (
                <div className="mt-6 flex items-end justify-between gap-3 h-64">
                  {projectStats.members.map((item) => {
                    const maxMem = Math.max(...projectStats.members.map((m) => m.count), 1);
                    const heightPercent = (item.count / maxMem) * 100;
                    return (
                      <div key={item.label} className="flex flex-col items-center justify-end gap-2 flex-1 h-full group">
                        <span className={`text-sm font-bold transition-transform group-hover:scale-110 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                          {item.count}
                        </span>
                        <div className={`relative w-full rounded-xl overflow-hidden flex items-end flex-1 ${isDark ? "bg-slate-800" : "bg-gray-100"}`}>
                          <div
                            className="absolute bottom-0 left-0 w-full transition-all duration-500 group-hover:opacity-90 rounded-xl"
                            style={{ height: `${heightPercent}%`, background: "linear-gradient(180deg, #003d9e 0%, #001d55 100%)" }}
                          >
                            <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-t-xl" />
                          </div>
                        </div>
                        <span className={`text-xs font-medium text-center leading-tight ${isDark ? "text-slate-500" : "text-gray-600"}`}>
                          {item.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── PROFILE TEAMS SECTION ──────────────────────────────── */}
      <section className={`py-28 relative overflow-hidden transition-colors duration-300 ${isDark ? "bg-slate-900" : "bg-white"}`}>
        <div className={`absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-full`}>
          <div className={`absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl opacity-40 ${isDark ? "bg-blue-900" : "bg-blue-100"}`}></div>
          <div className={`absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl opacity-40 ${isDark ? "bg-purple-900" : "bg-purple-100"}`}></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="mb-16 text-center">
            <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 mb-4 ${isDark ? "bg-blue-950" : "bg-blue-100"}`}>
              <Cpu size={16} className={isDark ? "text-blue-400" : "text-blue-700"} />
              <p ref={profileRef} id="profile" className={`uppercase tracking-widest text-xs font-semibold ${isDark ? "text-blue-400" : "text-blue-700"}`}>
                Profile Teams
              </p>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Profile Teams Perusahaan
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 group relative overflow-hidden rounded-3xl shadow-2xl">
              <img
                src="/images/ka.jpeg"
                alt="cloud"
                className="w-full h-[400px] object-cover object-center transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>

              <div className="absolute bottom-0 left-0 right-0 p-10 text-white">
                <h3 className="text-3xl font-bold mb-4">
                  Pengembangan alat digital, Modern, dan Siap Mendukung Kebutuhan Digital Masa Kini bersama teams linkra
                </h3>
              </div>
            </div>

            <div className="flex flex-col gap-8">
              <div className="group bg-gradient-to-br from-blue-700 to-indigo-800 text-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <ShieldCheck size={32} />
                </div>

                <h3 className="text-2xl font-bold mb-4">Profile summary</h3>

                <p className="text-blue-100 leading-7">
                  Tim Digital Linkra tidak hanya berfokus pada pengembangan aplikasi, tetapi juga menyediakan berbagai solusi Internet of Things (IoT). Dengan struktur tim yang terorganisir dan kolaboratif, setiap proyek dikerjakan secara sistematis untuk menghasilkan solusi teknologi yang inovatif, efektif, dan sesuai dengan kebutuhan pengguna.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ────────────────────────────────────────────── */}
      <footer ref={contactRef} id="contact" className="bg-gradient-to-br from-[#04142c] to-[#061a3a] text-gray-300 pt-20 pb-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600 rounded-full blur-3xl opacity-10"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <img src="/images/oip.png" alt="Logo" className="h-10 w-auto" />
                <div>
                  <h2 className="text-xl font-bold text-white">PT Linkra Wahana</h2>
                  <p className="text-xs text-blue-300">Teknologi</p>
                </div>
              </div>

              <p className="leading-7 text-gray-400">
                Delivering trusted technology and infrastructure services across
                South East Asia since 2010.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold text-lg mb-5">Company</h3>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <button onClick={() => scrollTo(aboutRef)} className="hover:text-white hover:translate-x-1 transition-all cursor-pointer text-left">
                    About Us
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollTo(projectsRef)} className="hover:text-white hover:translate-x-1 transition-all cursor-pointer text-left">
                    Projects
                  </button>
                </li>
                <li className="hover:text-white hover:translate-x-1 transition-all cursor-pointer">Careers</li>
                <li>
                  <button onClick={() => scrollTo(contactRef)} className="hover:text-white hover:translate-x-1 transition-all cursor-pointer text-left">
                    Contact
                  </button>
                </li>
              </ul>
            </div>

          

            <div>
              <h3 className="text-white font-semibold text-lg mb-5">Contact</h3>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li className="flex items-start gap-2">
                  <Globe size={16} className="mt-0.5 flex-shrink-0" />
                  <span>www.linkrawahana.co.id</span>
                </li>
                <li className="flex items-start gap-2">
                  <Database size={16} className="mt-0.5 flex-shrink-0" />
                  <span>pt.linkra.wahana.teknologi@gmail.com</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-16 pt-8 text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} PT Lintas Wahana Teknologi. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* ─── ANIMATIONS CSS ────────────────────────────────────── */}
      <style jsx global>{`
        @keyframes slowZoom {
          from { transform: scale(1); }
          to { transform: scale(1.1); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes scroll {
          0% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(10px); }
        }
        .animate-slowZoom { animation: slowZoom 20s ease-out forwards; }
        .animate-fadeInUp { animation: fadeInUp 0.8s ease-out forwards; }
        .animate-slideInLeft { animation: slideInLeft 0.8s ease-out forwards; }
        .animate-slideInRight { animation: slideInRight 0.8s ease-out forwards; }
        .animate-scroll { animation: scroll 1.5s ease-in-out infinite; }
        .animate-bounce { animation: bounce 2s infinite; }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        html { scroll-behavior: smooth; }
      `}</style>
    </div>
  );
}
