import React, { useState } from "react";
import { useRouter } from "next/router";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleRegister = (e) => {
    e.preventDefault();
    // nanti bisa tambah logic register di sini
    router.push("/dashboardAdmin/admin");
  };

  return (
    <div className="min-h-screen flex">
      {/* LEFT SIDE */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa"
          alt="register"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-[#001d55]/80" />

        <div className="absolute inset-0 flex flex-col justify-center px-16 text-white">
          <p className="uppercase tracking-[4px] text-blue-300 mb-4">
            PT Lintas Wahana Teknologi
          </p>

          <h1 className="text-5xl font-bold leading-tight mb-6">
            Join Our Enterprise Platform
          </h1>

          <p className="text-gray-200 text-lg leading-8 max-w-xl">
            Create your account and get access to our secure enterprise
            infrastructure and modern technology solutions.
          </p>

          {/* STEPS */}
          <div className="mt-10 space-y-4">
            {[
              "Fill in your personal information",
              "Set a secure password",
              "Start managing your projects",
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-500/30 border border-blue-400 flex items-center justify-center text-sm font-bold text-blue-200">
                  {i + 1}
                </div>
                <p className="text-gray-200 text-sm">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-[#f5f7fb] px-6 py-10">
        <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-xl">
          {/* LOGO */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#001d55]">
              Create Account
            </h1>
            <p className="text-gray-500 mt-3">
              Register to access the dashboard
            </p>
          </div>

          {/* FORM */}
          <form className="space-y-5" onSubmit={handleRegister}>
            {/* FULL NAME */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-700"
                required
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-700"
                required
              />
            </div>

            {/* ROLE */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role / Position
              </label>
              <select
                className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-700 text-gray-700 bg-white"
                required
              >
                <option value="">Select your role</option>
                <option value="frontend">Frontend Developer</option>
                <option value="backend">Backend Developer</option>
                <option value="uiux">UI/UX Designer</option>
                <option value="qa">QA Engineer</option>
                <option value="pm">Project Manager</option>
              </select>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-700 pr-14"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm font-medium"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm your password"
                  className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-700 pr-14"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm font-medium"
                >
                  {showConfirm ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* TERMS */}
            <div className="flex items-start gap-3 text-sm text-gray-600">
              <input
                type="checkbox"
                className="mt-1 accent-[#001d55]"
                required
              />
              <span>
                I agree to the{" "}
                <a href="#" className="text-blue-700 hover:text-blue-900 font-medium">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-blue-700 hover:text-blue-900 font-medium">
                  Privacy Policy
                </a>
              </span>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="w-full bg-[#001d55] hover:bg-[#003cb3] transition text-white py-4 rounded-2xl font-semibold text-lg"
            >
              Create Account
            </button>
          </form>

          {/* LINK KE LOGIN */}
          <div className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <button
              onClick={() => router.push("/")}
              className="text-blue-700 hover:text-blue-900 font-semibold"
            >
              Sign in here
            </button>
          </div>

          {/* FOOTER */}
          <div className="mt-6 text-center text-sm text-gray-500">
            © 2026 PT Lintas Wahana Teknologi
          </div>
        </div>
      </div>
    </div>
  );
}