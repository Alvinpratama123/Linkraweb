import React, { useState, useEffect } from "react";
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
} from "lucide-react";

export default function PTLintasWahanaLanding() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const services = [
    {
      title: "Software Development",
      desc: "Custom enterprise solutions with scalable architecture and cutting-edge technology.",
      icon: <Cpu size={28} />,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Infrastructure Management",
      desc: "Reliable server and network monitoring solutions with 99.9% uptime guarantee.",
      icon: <Database size={28} />,
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "IT Consulting",
      desc: "Helping businesses transform through technology and digital innovation.",
      icon: <BarChart3 size={28} />,
      color: "from-orange-500 to-red-500",
    },
    {
      title: "Data Security",
      desc: "Advanced protection for critical company systems with military-grade encryption.",
      icon: <ShieldCheck size={28} />,
      color: "from-green-500 to-emerald-500",
    },
  ];

  const stats = [
    { number: "150+", label: "Projects Completed", icon: <CheckCircle size={24} /> },
    { number: "98.9%", label: "Client Satisfaction", icon: <Award size={24} /> },
    { number: "24/7", label: "Support Service", icon: <Clock size={24} /> },
    { number: "50+", label: "Expert Teams", icon: <Users size={24} /> },
  ];

  return (
    <div className="bg-[#f5f7fb] text-gray-900 font-sans overflow-x-hidden">
      {/* NAVBAR */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-xl py-3"
            : "bg-white shadow-sm py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
             <div>
              <h1 className="font-bold text-xl bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">
               PT.
              </h1>
             
            </div>
            <div className="relative">
              <img
                src="/images/oip.png"
                alt="Logo"
                className="h-12 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
            </div>
            <div>
              <h1 className="font-bold text-xl bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">
               Wahana Teknologi
              </h1>
             
            </div>
          </div>

          <nav className="hidden md:flex gap-8 text-sm font-medium">
            {["Services", "Company", "Projects", "About", "Contact"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-gray-700 hover:text-blue-700 transition-all duration-300 hover:scale-105"
              >
                {item}
              </a>
            ))}
          </nav>

          <Link href="/components/login">
            <button className="bg-gradient-to-r from-blue-700 to-blue-600 text-white px-6 py-2.5 rounded-full hover:from-blue-800 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium">
              Login
            </button>
          </Link>
        </div>
      </header>

      {/* HERO SECTION */}
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
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Sparkles size={16} className="text-yellow-400" />
              <p className="uppercase tracking-[3px] text-xs font-semibold">
                IT Infrastructure & Digital Solutions
              </p>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent">
              Digital Transformation & Infrastructure Solutions
            </h1>

            <p className="text-lg text-gray-200 mb-8 leading-relaxed">
              Empowering businesses with modern technology, secure systems, and
              enterprise-grade digital transformation services.
            </p>

            <div className="flex gap-4">
              <button className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 px-8 py-3.5 rounded-full font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center gap-2 group">
                Learn More
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <button className="border-2 border-white/50 backdrop-blur-sm px-8 py-3.5 rounded-full font-semibold hover:bg-white hover:text-black transition-all duration-300 hover:border-white">
                Our Services
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-2 bg-white rounded-full mt-2 animate-scroll"></div>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="py-28 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-30"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-slideInLeft">
              <div className="inline-flex items-center gap-2 bg-blue-100 rounded-full px-4 py-2 mb-6">
                <ShieldCheck size={16} className="text-blue-700" />
                <p className="text-blue-700 uppercase tracking-widest text-xs font-semibold">
                  About Us
                </p>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Pioneering Technical Integrity in South East Asia
              </h2>

              <p className="text-gray-600 leading-8 mb-8 text-lg">
                We deliver enterprise technology services with a focus on
                innovation, security, and operational excellence. Our mission is
                to accelerate digital transformation through scalable solutions.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="text-center p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-white shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <div className="text-blue-600 mb-2 flex justify-center">{stat.icon}</div>
                    <h3 className="text-2xl font-bold text-blue-700">{stat.number}</h3>
                    <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative animate-slideInRight">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/images/Li.jpg"
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

      {/* SERVICES SECTION */}
      <section className="py-28 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-100 rounded-full px-4 py-2 mb-4">
              <Zap size={16} className="text-blue-700" />
              <p className="text-blue-700 uppercase tracking-widest text-xs font-semibold">
                Our Services
              </p>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              End-to-End Managed Solutions
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive technology solutions tailored to your business needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer animate-fadeInUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                >
                  {service.icon}
                </div>

                <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-blue-700 transition-colors">
                  {service.title}
                </h3>

                <p className="text-gray-600 leading-7">{service.desc}</p>
                
                <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-blue-600 text-sm font-semibold inline-flex items-center gap-1">
                    Learn More <ChevronRight size={16} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TECHNOLOGY SECTION */}
      <section className="py-28 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-full">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-40"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-40"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="mb-16 text-center">
            <div className="inline-flex items-center gap-2 bg-blue-100 rounded-full px-4 py-2 mb-4">
              <Cpu size={16} className="text-blue-700" />
              <p className="text-blue-700 uppercase tracking-widest text-xs font-semibold">
                Modern Technology
              </p>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Mastering The Complexities of Modern Technology
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* BIG CARD */}
            <div className="lg:col-span-2 group relative overflow-hidden rounded-3xl shadow-2xl">
              <img
                src="/images/ka.jpeg"
                alt="cloud"
                className="w-full h-[400px] object-cover object-center transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
              
              <div className="absolute bottom-0 left-0 right-0 p-10 text-white">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 mb-4">
                  <Cloud size={14} />
                  <p className="text-xs uppercase tracking-wider">Cloud Architecture</p>
                </div>

                <h3 className="text-3xl font-bold mb-4">
                  Building Secure & Modern Cloud Infrastructure
                </h3>

                <button className="bg-white text-blue-700 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 inline-flex items-center gap-2 group/btn">
                  Learn More
                  <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* SIDE CARDS */}
            <div className="flex flex-col gap-8">
              <div className="group bg-gradient-to-br from-blue-700 to-indigo-800 text-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <ShieldCheck size={32} />
                </div>

                <h3 className="text-2xl font-bold mb-4">Cybersecurity Solutions</h3>

                <p className="text-blue-100 leading-7">
                  Enterprise-grade protection for modern digital ecosystems with real-time threat detection.
                </p>
              </div>

              <div className="group bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Legacy Modernization</h3>

                <p className="text-gray-600 leading-7 mb-6">
                  Upgrade outdated systems into scalable cloud-ready platforms with minimal disruption.
                </p>

                <div className="flex gap-4">
                  <div className="bg-white rounded-2xl p-4 shadow-md text-center flex-1 group-hover:shadow-lg transition-all">
                    <h4 className="text-2xl font-bold text-blue-700">30%</h4>
                    <p className="text-xs text-gray-500">Faster Performance</p>
                  </div>

                  <div className="bg-white rounded-2xl p-4 shadow-md text-center flex-1 group-hover:shadow-lg transition-all">
                    <h4 className="text-2xl font-bold text-blue-700">99%</h4>
                    <p className="text-xs text-gray-500">Uptime Security</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gradient-to-br from-[#04142c] to-[#061a3a] text-gray-300 pt-20 pb-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600 rounded-full blur-3xl opacity-10"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <img src="/images/oip.png" alt="Logo" className="h-10 w-auto" />
                <div>
                  <h2 className="text-xl font-bold text-white">PT Lintas Wahana</h2>
                  <p className="text-xs text-blue-300">Teknologi</p>
                </div>
              </div>

              <p className="leading-7 text-gray-400">
                Delivering trusted technology and infrastructure services across
                South East Asia since 2010.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold text-lg mb-5">Services</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="hover:text-white hover:translate-x-1 transition-all cursor-pointer">Cloud Infrastructure</li>
                <li className="hover:text-white hover:translate-x-1 transition-all cursor-pointer">IT Consulting</li>
                <li className="hover:text-white hover:translate-x-1 transition-all cursor-pointer">Software Development</li>
                <li className="hover:text-white hover:translate-x-1 transition-all cursor-pointer">Cybersecurity</li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold text-lg mb-5">Company</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="hover:text-white hover:translate-x-1 transition-all cursor-pointer">About Us</li>
                <li className="hover:text-white hover:translate-x-1 transition-all cursor-pointer">Projects</li>
                <li className="hover:text-white hover:translate-x-1 transition-all cursor-pointer">Careers</li>
                <li className="hover:text-white hover:translate-x-1 transition-all cursor-pointer">Contact</li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold text-lg mb-5">Newsletter</h3>
              <p className="text-gray-400 mb-4">
                Subscribe to get technology updates and news.
              </p>

              <div className="flex">
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-4 py-3 rounded-l-xl outline-none text-black bg-white/90 focus:bg-white transition-all"
                />
                <button className="bg-gradient-to-r from-blue-600 to-blue-500 px-5 rounded-r-xl hover:from-blue-700 hover:to-blue-600 transition-all duration-300">
                  Send
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 mt-16 pt-8 text-center text-gray-500">
            <p>© {new Date().getFullYear()} PT Lintas Wahana Teknologi. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Animations CSS */}
      <style jsx global>{`
        @keyframes slowZoom {
          from {
            transform: scale(1);
          }
          to {
            transform: scale(1.1);
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes scroll {
          0% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(10px);
          }
        }
        
        .animate-slowZoom {
          animation: slowZoom 20s ease-out forwards;
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        
        .animate-slideInLeft {
          animation: slideInLeft 0.8s ease-out forwards;
        }
        
        .animate-slideInRight {
          animation: slideInRight 0.8s ease-out forwards;
        }
        
        .animate-scroll {
          animation: scroll 1.5s ease-in-out infinite;
        }
        
        .animate-bounce {
          animation: bounce 2s infinite;
        }
        
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
}