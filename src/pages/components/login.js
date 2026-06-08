import React from "react";
import { useRouter } from "next/router";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    router.push("/dashboardAdmin/admin");
  };

  return (
    <div className="min-h-screen flex">
      {/* LEFT SIDE */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa"
          alt="login"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-[#001d55]/80" />

        <div className="absolute inset-0 flex flex-col justify-center px-16 text-white">
          <p className="uppercase tracking-[4px] text-blue-300 mb-4">
            PT Lintas Wahana Teknologi
          </p>

          <h1 className="text-5xl font-bold leading-tight mb-6">
            Digital Transformation & Infrastructure Solutions
          </h1>

          <p className="text-gray-200 text-lg leading-8 max-w-xl">
            Secure enterprise infrastructure and modern technology solutions
            built for the future of digital business.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-[#f5f7fb] px-6">
        <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-xl">
          {/* LOGO */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-[#001d55]">
              PT Lintas Wahana
            </h1>
            <p className="text-gray-500 mt-3">Sign in to your account</p>
          </div>

          {/* FORM */}
          <form className="space-y-6" onSubmit={handleLogin}>
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

            {/* PASSWORD */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-700"
                required
              />
            </div>

            {/* REMEMBER */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600">
                <input type="checkbox" />
                Remember me
              </label>
              <a href="#" className="text-blue-700 hover:text-blue-900 font-medium">
                Forgot Password?
              </a>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="w-full bg-[#001d55] hover:bg-[#003cb3] transition text-white py-4 rounded-2xl font-semibold text-lg"
            >
              Sign In
            </button>
          </form>

          {/* ✅ LINK KE REGISTER */}
          <div className="mt-6 text-center text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <button
              onClick={() => router.push("/components/register")}
              className="text-blue-700 hover:text-blue-900 font-semibold"
            >
              Register here
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