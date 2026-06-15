import React, { useState, useEffect, useCallback } from "react";
import toast, { Toaster } from "react-hot-toast";

function generatePassword(length = 10) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function generateEmail(name) {
  const slug = name.toLowerCase().replace(/[^a-z0-9]/g, ".");
  return `${slug}@mail.com`;
}

export default function MembersModul() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newMember, setNewMember] = useState({ name: "", position: "" });
  const [autoEmail, setAutoEmail] = useState("");
  const [autoPassword, setAutoPassword] = useState(generatePassword());
  const [lastCreated, setLastCreated] = useState(null);

  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/members");
      const data = await res.json();
      if (data.success) setMembers(data.members);
    } catch (err) {
      console.error("Fetch members error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const handleNameChange = (value) => {
    setNewMember((prev) => ({ ...prev, name: value }));
    if (value.trim()) {
      setAutoEmail(generateEmail(value));
    } else {
      setAutoEmail("");
    }
  };

  const handleRegeneratePassword = () => {
    setAutoPassword(generatePassword());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMember.name || !newMember.position) {
      toast.error("Nama dan posisi harus diisi!");
      return;
    }

    try {
      toast.loading("Menambahkan member...", { id: "add-member" });
      const res = await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newMember.name,
          position: newMember.position,
        }),
      });
      const data = await res.json();

      toast.dismiss("add-member");

      if (!res.ok) {
        toast.error(data.message || "Gagal menambahkan member");
        return;
      }

      setLastCreated({
        name: newMember.name,
        email: data.credentials.email,
        password: data.credentials.password,
      });

      toast.success("Member berhasil ditambahkan!");
      setNewMember({ name: "", position: "" });
      setAutoEmail("");
      setAutoPassword(generatePassword());
      setShowForm(false);
      fetchMembers();
    } catch (err) {
      toast.dismiss("add-member");
      toast.error("Terjadi kesalahan");
    }
  };

  const positionCounts = members.reduce((acc, m) => {
    const pos = m.position || "Lainnya";
    acc[pos] = (acc[pos] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="p-6">
      <Toaster position="top-right" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-semibold">Member & Modul</h2>
          <p className="text-sm text-gray-500">Hanya admin yang dapat menambahkan member baru.</p>
        </div>
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          {showForm ? "Tutup Form" : "Tambah Member"}
        </button>
      </div>

      {/* Credential success banner */}
      {lastCreated && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-green-800">Member berhasil dibuat!</h3>
              <p className="mt-1 text-sm text-green-700">
                <strong>Nama:</strong> {lastCreated.name}
              </p>
              <p className="text-sm text-green-700">
                <strong>Email:</strong> {lastCreated.email}
              </p>
              <p className="text-sm text-green-700">
                <strong>Password:</strong> {lastCreated.password}
              </p>
              <p className="mt-1 text-xs text-green-600">Simpan credential ini dan berikan ke member.</p>
            </div>
            <button
              onClick={() => setLastCreated(null)}
              className="text-green-700 hover:text-green-900 font-medium text-sm"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Position summary chips */}
      {Object.keys(positionCounts).length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {Object.entries(positionCounts).map(([pos, count]) => (
            <span
              key={pos}
              className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700"
            >
              {pos} <span className="font-bold">{count}</span>
            </span>
          ))}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 rounded-lg bg-white p-6 shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="space-y-2">
              <span className="text-sm font-medium text-gray-700">Nama Member</span>
              <input
                value={newMember.name}
                onChange={(e) => handleNameChange(e.target.value)}
                type="text"
                placeholder="Masukkan nama"
                className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                required
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-gray-700">Posisi</span>
              <select
                value={newMember.position}
                onChange={(e) => setNewMember((prev) => ({ ...prev, position: e.target.value }))}
                className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                required
              >
                <option value="">Pilih posisi</option>
                <option value="frontend">Frontend</option>
                <option value="backend">Backend</option>
                <option value="uiux">UI/UX</option>
                <option value="qa">QA</option>
                <option value="pm">Project Manager</option>
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-gray-700">Email (auto)</span>
              <input
                value={autoEmail}
                readOnly
                type="email"
                className="w-full rounded border border-gray-200 bg-gray-50 px-3 py-2 text-gray-600 cursor-not-allowed"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-gray-700">Password (auto)</span>
              <div className="flex gap-2">
                <input
                  value={autoPassword}
                  readOnly
                  type="text"
                  className="flex-1 rounded border border-gray-200 bg-gray-50 px-3 py-2 text-gray-600 cursor-not-allowed font-mono"
                />
                <button
                  type="button"
                  onClick={handleRegeneratePassword}
                  className="rounded bg-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
                >
                  Generate Ulang
                </button>
              </div>
            </label>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
            >
              Simpan Member
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-lg shadow overflow-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Nama</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Email</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Posisi</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Profile</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-400">Memuat...</td>
              </tr>
            ) : members.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-400">Belum ada member</td>
              </tr>
            ) : (
              members.map((m) => (
                <tr key={m.id}>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm text-gray-600">
                        {m.user.name
                          .split(" ")
                          .map((word) => word[0])
                          .slice(0, 2)
                          .join("")}
                      </div>
                      <div>
                        <div className="font-medium">{m.user.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{m.user.email}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                      {m.position}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {m.profile ? (
                      <a
                        href={m.profile}
                        className="text-blue-600 hover:underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        View
                      </a>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
