import React from "react";
import Link from "next/link";
import {
  Globe,
  Cloud,
  ShieldCheck,
  Database,
  BarChart3,
  Cpu,
} from "lucide-react";

export default function PTLintasWahanaLanding() {
  const services = [
    {
      title: "Software Development",
      desc: "Custom enterprise solutions with scalable architecture.",
      icon: <Cpu size={28} />,
    },
    {
      title: "Infrastructure Management",
      desc: "Reliable server and network monitoring solutions.",
      icon: <Database size={28} />,
    },
    {
      title: "IT Consulting",
      desc: "Helping businesses transform through technology.",
      icon: <BarChart3 size={28} />,
    },
    {
      title: "Data Security",
      desc: "Advanced protection for critical company systems.",
      icon: <ShieldCheck size={28} />,
    },
  ];

  return (
    <div className="bg-[#f5f7fb] text-gray-900 font-sans">
      {/* NAVBAR */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            
            <h1 className="font-bold text-xl text-blue-900">
               <img
                  src="/images/oip.png"
                  alt="Logo"
                  className="w-30 inline-block"
                />
                
            
            </h1>
          </div>

          <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-700">
            <a href="#">Services</a>
            <a href="#">Company</a>
            <a href="#">Projects</a>
            <a href="#">About</a>
            <a href="#">Contact</a>
          </nav>

          <Link href="/components/login">
  <button className="bg-blue-700 text-white px-5 py-2 rounded-full hover:bg-blue-800 transition">
    Login
  </button>
</Link>
        </div>
      </header>

      {/* HERO */}
      <section className="relative h-screen overflow-hidden">
        <img
          src="/images/Li.jpg"
          alt="hero"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex items-center">
          <div className="max-w-2xl text-white">
            <p className="uppercase tracking-[5px] text-sm text-blue-300 mb-5">
              IT Infrastructure & Digital Solutions
            </p>

            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
              Digital Transformation & Infrastructure Solutions
            </h1>

            <p className="text-lg text-gray-300 mb-8">
              Empowering businesses with modern technology, secure systems, and
              enterprise-grade digital transformation services.
            </p>

            <div className="flex gap-4">
              <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-full font-medium transition">
                Learn More
              </button>

              <button className="border border-white px-6 py-3 rounded-full hover:bg-white hover:text-black transition">
                Our Services
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-blue-600 uppercase tracking-widest text-sm mb-4">
              About Us
            </p>

            <h2 className="text-4xl font-bold mb-6 text-gray-900">
              Pioneering Technical Integrity in South East Asia
            </h2>

            <p className="text-gray-600 leading-8 mb-8">
              We deliver enterprise technology services with a focus on
              innovation, security, and operational excellence. Our mission is
              to accelerate digital transformation through scalable solutions.
            </p>

            <div className="grid grid-cols-3 gap-6">
              <div>
                <h3 className="text-3xl font-bold text-blue-700">150+</h3>
                <p className="text-gray-500 mt-2">Projects Completed</p>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-blue-700">98.9%</h3>
                <p className="text-gray-500 mt-2">Client Satisfaction</p>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-blue-700">24/7</h3>
                <p className="text-gray-500 mt-2">Support Service</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <img
              src="/images/oo.png"
              alt="office"
              className="rounded-3xl shadow-2xl w-full h-[500px] object-cover"
            />
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-24 bg-[#f5f7fb]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="uppercase tracking-widest text-blue-600 text-sm mb-4">
              Our Services
            </p>

            <h2 className="text-4xl font-bold">
              End-to-End Managed Solutions
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mb-6">
                  {service.icon}
                </div>

                <h3 className="text-xl font-semibold mb-4">
                  {service.title}
                </h3>

                <p className="text-gray-600 leading-7">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TECHNOLOGY SECTION */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <p className="uppercase tracking-widest text-blue-600 text-sm mb-4">
              Modern Technology
            </p>

            <h2 className="text-4xl font-bold">
              Mastering The Complexities of Modern Technology
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* BIG CARD */}
            <div className="lg:col-span-2 bg-gradient-to-br from-[#001d55] to-[#003cb3] rounded-3xl p-10 text-white relative overflow-hidden">
              <img
                src="/images/ka.jpeg"
                alt="cloud"
                className="absolute inset-0 w-full h-full object-cover opacity-20"
              />

              <div className="relative z-10">
                <p className="uppercase tracking-widest text-blue-200 mb-4">
                  Cloud Architecture
                </p>

                <h3 className="text-4xl font-bold mb-6">
                  Building Secure & Modern Cloud Infrastructure
                </h3>

                <button className="bg-white text-blue-700 px-6 py-3 rounded-full font-semibold">
                  Learn More
                </button>
              </div>
            </div>

            {/* SIDE CARDS */}
            <div className="flex flex-col gap-8">
              <div className="bg-blue-700 text-white rounded-3xl p-8">
                <Cloud size={40} className="mb-6" />

                <h3 className="text-2xl font-bold mb-4">
                  Cybersecurity Solutions
                </h3>

                <p className="text-blue-100 leading-7">
                  Enterprise-grade protection for modern digital ecosystems.
                </p>
              </div>

              <div className="bg-[#f5f7fb] rounded-3xl p-8">
                <h3 className="text-2xl font-bold mb-4">
                  Legacy Modernization
                </h3>

                <p className="text-gray-600 leading-7">
                  Upgrade outdated systems into scalable cloud-ready platforms.
                </p>

                <div className="mt-6 flex gap-4">
                  <div className="bg-white rounded-2xl p-4 shadow text-center flex-1">
                    <h4 className="text-2xl font-bold text-blue-700">30%</h4>
                    <p className="text-sm text-gray-500">Faster</p>
                  </div>

                  <div className="bg-white rounded-2xl p-4 shadow text-center flex-1">
                    <h4 className="text-2xl font-bold text-blue-700">99%</h4>
                    <p className="text-sm text-gray-500">Secure</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#04142c] text-gray-300 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-white mb-5">
              PT Lintas Wahana Teknologi
            </h2>

            <p className="leading-7 text-gray-400">
              Delivering trusted technology and infrastructure services across
              South East Asia.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-5">
              Services
            </h3>

            <ul className="space-y-3 text-gray-400">
              <li>Cloud Infrastructure</li>
              <li>IT Consulting</li>
              <li>Software Development</li>
              <li>Cybersecurity</li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-5">
              Company
            </h3>

            <ul className="space-y-3 text-gray-400">
              <li>About Us</li>
              <li>Projects</li>
              <li>Careers</li>
              <li>Contact</li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-5">
              Newsletter
            </h3>

            <p className="text-gray-400 mb-4">
              Subscribe to get technology updates and news.
            </p>

            <div className="flex">
              <input
                type="email"
                placeholder="Email Address"
                className="w-full px-4 py-3 rounded-l-xl outline-none text-black"
              />

              <button className="bg-blue-600 px-5 rounded-r-xl hover:bg-blue-700">
                Send
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-16 pt-8 text-center text-gray-500">
          © 2026 PT Lintas Wahana Teknologi. All rights reserved.
        </div>
      </footer>
    </div>
  );
}