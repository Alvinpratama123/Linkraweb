
import React, { useState } from "react";
import { useRouter } from "next/router";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Password tidak sama!");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          role: form.role,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Register gagal");
        return;
      }

      alert("Register berhasil");
      router.push("/");
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
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
            Create your account and get access to secure enterprise systems.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-[#f5f7fb] px-6 py-10">
        <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#001d55]">
              Create Account
            </h1>
            <p className="text-gray-500 mt-3">
              Register to access the dashboard
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleRegister}>
            {/* NAME */}
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full px-5 py-4 rounded-2xl border"
              required
            />

            {/* EMAIL */}
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full px-5 py-4 rounded-2xl border"
              required
            />

            {/* ROLE */}
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full px-5 py-4 rounded-2xl border"
              required
            >
              <option value="">Select Role</option>
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="uiux">UI/UX</option>
              <option value="qa">QA</option>
              <option value="pm">PM</option>
            </select>

            {/* PASSWORD */}
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full px-5 py-4 rounded-2xl border"
              required
            />

            {/* CONFIRM PASSWORD */}
            <input
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="w-full px-5 py-4 rounded-2xl border"
              required
            />

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#001d55] text-white py-4 rounded-2xl font-semibold disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <button
              onClick={() => router.push("/")}
              className="text-blue-700 font-semibold"
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

