// src/pages/dashboardAdmin/components/membersModul.js
import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';

export default function MembersModul({ theme = "light" }) {
  const [listMembers, setListMembers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [newMember, setNewMember] = useState({
    name: '',
    position: '',
    email: '',
    password: '',
    profile: '',
    role: 'member'
  });

  const isDark = theme === "dark";

  const positionOptions = [
    { value: 'Frontend', label: 'Frontend Developer' },
    { value: 'Backend', label: 'Backend Developer' },
    { value: 'UI/UX', label: 'UI/UX Designer' },
    { value: 'QA', label: 'QA Engineer' },
    { value: 'PM', label: 'Project Manager' },
  ];

  // 🔥 Role options dengan value lowercase
  const roleOptions = [
    { value: 'admin', label: 'Admin' },
    { value: 'member', label: 'Member' },
    { value: 'frontend', label: 'Frontend' },
    { value: 'backend', label: 'Backend' },
    { value: 'qa', label: 'QA' },
    { value: 'pm', label: 'PM' },
    { value: 'ui/ux', label: 'UI/UX' },
  ];

  const fetchMembers = async () => {
    try {
      const response = await fetch('/api/members');
      const data = await response.json();
      if (data.success) {
        setListMembers(data.members);
      }
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const getPositionColor = (position) => {
    const colors = {
      'Frontend': 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
      'Backend': 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
      'Fullstack': 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300',
      'UI/UX': 'bg-pink-100 text-pink-700 dark:bg-pink-900/50 dark:text-pink-300',
      'DevOps': 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300',
      'QA': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300',
      'PM': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300',
    };
    return colors[position] || 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
  };

  const getRoleBadge = (role) => {
    const roleUpper = role ? role.toUpperCase() : 'MEMBER';
    const colors = {
      ADMIN: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
      MEMBER: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
      FRONTEND: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
      BACKEND: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
      QA: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300',
      PM: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300',
      'UI/UX': 'bg-pink-100 text-pink-700 dark:bg-pink-900/50 dark:text-pink-300',
    };
    return colors[roleUpper] || 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
  };

  const handleChange = (field, value) => {
    setNewMember((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddMember = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    if (newMember.password.length < 6) {
      setMessage({ type: 'error', text: 'Password minimal 6 karakter' });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newMember.name,
          email: newMember.email,
          password: newMember.password,
          position: newMember.position,
          profile: newMember.profile || '',
          role: newMember.role || 'member',
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`✅ Member ${newMember.name} berhasil ditambahkan!`);
        setMessage({
          type: 'success',
          text: `✅ Member berhasil ditambahkan dengan posisi: ${newMember.position} dan role: ${newMember.role}!`
        });
        setNewMember({ name: '', position: '', email: '', password: '', profile: '', role: 'member' });
        setShowForm(false);
        fetchMembers();
        setTimeout(() => setMessage({ type: '', text: '' }), 5000);
      } else {
        toast.error(data.message || 'Gagal menambahkan member');
        setMessage({ type: 'error', text: data.message || 'Gagal menambahkan member' });
      }
    } catch (error) {
      console.error('Error adding member:', error);
      toast.error('Terjadi kesalahan pada server');
      setMessage({ type: 'error', text: 'Terjadi kesalahan pada server' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMember = async (memberId) => {
    if (!confirm('Apakah Anda yakin ingin menghapus member ini?')) return;

    try {
      const response = await fetch(`/api/members/${memberId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Member berhasil dihapus');
        setMessage({ type: 'success', text: 'Member berhasil dihapus' });
        fetchMembers();
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        toast.error(data.message || 'Gagal menghapus member');
        setMessage({ type: 'error', text: data.message || 'Gagal menghapus member' });
      }
    } catch (error) {
      console.error('Error deleting member:', error);
      toast.error('Terjadi kesalahan pada server');
      setMessage({ type: 'error', text: 'Terjadi kesalahan pada server' });
    }
  };

  const counts = listMembers.reduce((acc, m) => {
    acc[m.position] = (acc[m.position] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className={`p-6 min-h-screen ${isDark ? 'bg-slate-950 text-white' : 'bg-[#eef2f7]'}`}>
      <Toaster position="top-right" />
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-semibold">Manajemen Member</h2>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
            Kelola member dan posisi mereka di sistem.
          </p>
        </div>

        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          {showForm ? '✕ Tutup Form' : '➕ Tambah Member'}
        </button>
      </div>

      {message.text && (
        <div className={`mb-4 p-4 rounded-lg ${
          message.type === 'success'
            ? 'bg-green-100 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700'
            : 'bg-red-100 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700'
        }`}>
          {message.text}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleAddMember} className={`mb-6 rounded-lg p-6 shadow-lg border ${
          isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-[#001d55]'}`}>
            Tambah Member Baru
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="space-y-2">
              <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                Nama Member *
              </span>
              <input
                value={newMember.name}
                onChange={(e) => handleChange('name', e.target.value)}
                type="text"
                placeholder="Masukkan nama lengkap"
                className={`w-full rounded-lg border px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition ${
                  isDark
                    ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                required
              />
            </label>

            <label className="space-y-2">
              <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                Posisi *
              </span>
              <select
                value={newMember.position}
                onChange={(e) => handleChange('position', e.target.value)}
                className={`w-full rounded-lg border px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition ${
                  isDark
                    ? 'bg-slate-700 border-slate-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                required
              >
                <option value="">Pilih Posisi</option>
                {positionOptions.map((pos) => (
                  <option key={pos.value} value={pos.value}>
                    {pos.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                Email *
              </span>
              <input
                value={newMember.email}
                onChange={(e) => handleChange('email', e.target.value)}
                type="email"
                placeholder="email@domain.com"
                className={`w-full rounded-lg border px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition ${
                  isDark
                    ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                required
              />
            </label>

            <label className="space-y-2">
              <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                Password *
              </span>
              <input
                value={newMember.password}
                onChange={(e) => handleChange('password', e.target.value)}
                type="password"
                placeholder="Password untuk login"
                className={`w-full rounded-lg border px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition ${
                  isDark
                    ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                required
                minLength="6"
              />
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-400'}`}>
                Minimal 6 karakter
              </p>
            </label>

            <label className="space-y-2">
              <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                Role Sistem *
              </span>
              <select
                value={newMember.role}
                onChange={(e) => handleChange('role', e.target.value)}
                className={`w-full rounded-lg border px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition ${
                  isDark
                    ? 'bg-slate-700 border-slate-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                required
              >
                {roleOptions.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-400'}`}>
                Role untuk akses sistem dan pengiriman revisi
              </p>
            </label>

            <label className="space-y-2">
              <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                Profile Link (Opsional)
              </span>
              <input
                value={newMember.profile}
                onChange={(e) => handleChange('profile', e.target.value)}
                type="text"
                placeholder="Link profil / portfolio / GitHub"
                className={`w-full rounded-lg border px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition ${
                  isDark
                    ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </label>
          </div>

          <div className="mt-6 flex justify-end gap-3 border-t pt-4">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className={`rounded-lg px-6 py-2.5 text-sm font-semibold transition ${
                isDark
                  ? 'bg-slate-600 text-white hover:bg-slate-500'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-[#001d55] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#00307d] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Menyimpan...
                </>
              ) : (
                '💾 Simpan Member'
              )}
            </button>
          </div>
        </form>
      )}

      <div className={`rounded-lg shadow-lg border overflow-auto ${
        isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'
      }`}>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className={isDark ? 'bg-slate-700' : 'bg-gray-50'}>
            <tr>
              <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                isDark ? 'text-slate-400' : 'text-gray-500'
              }`}>
                Nama Member
              </th>
              <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                isDark ? 'text-slate-400' : 'text-gray-500'
              }`}>
                Posisi
              </th>
              <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                isDark ? 'text-slate-400' : 'text-gray-500'
              }`}>
                Role Sistem
              </th>
              <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                isDark ? 'text-slate-400' : 'text-gray-500'
              }`}>
                Profile
              </th>
              <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                isDark ? 'text-slate-400' : 'text-gray-500'
              }`}>
                Status Email
              </th>
              <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                isDark ? 'text-slate-400' : 'text-gray-500'
              }`}>
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDark ? 'divide-slate-700' : 'divide-gray-200'}`}>
            {listMembers.length === 0 ? (
              <tr>
                <td colSpan="5" className={`px-4 py-8 text-center ${
                  isDark ? 'text-slate-400' : 'text-gray-400'
                }`}>
                  Belum ada member. Tambahkan member baru!
                </td>
              </tr>
            ) : (
              listMembers.map((member) => (
                <tr key={member.id} className={isDark ? 'hover:bg-slate-700' : 'hover:bg-gray-50'}>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#001d55] to-[#003d9e] flex items-center justify-center text-white text-sm font-bold">
                        {member.name?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
                          {member.name}
                        </div>
                        <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-400'}`}>
                          {member.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPositionColor(member.position)}`}>
                      {member.position || 'Belum diatur'}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadge(member.role || 'member')}`}>
                      {(member.role || 'MEMBER').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {member.profile ? (
                      <a href={member.profile} className="text-blue-600 hover:underline text-sm font-medium" target="_blank" rel="noreferrer">
                        🔗 View
                      </a>
                    ) : (
                      <span className={`text-sm ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {member.credentialEmailSent ? (
                      <span className="inline-flex items-center gap-1 text-green-600 text-sm font-medium">
                        ✅ Terkirim
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-red-500 text-sm font-medium">
                        ❌ Gagal
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {!member.credentialEmailSent && (
                        <button
                          onClick={() => handleResendEmail(member.id, member.name)}
                          className="text-blue-500 hover:text-blue-700 text-sm font-medium transition"
                        >
                          📧 Kirim Ulang
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteMember(member.id)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium transition"
                      >
                        🗑️ Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {listMembers.length > 0 && (
        <div className={`mt-4 text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
          Total Member: <span className={`font-bold ${isDark ? 'text-white' : 'text-[#001d55]'}`}>
            {listMembers.length}
          </span>
          {' • '}
          Posisi: {Object.entries(counts).map(([pos, count]) => (
            <span key={pos} className="ml-2">
              <span className={`px-2 py-0.5 rounded-full text-xs ${getPositionColor(pos)}`}>
                {pos}: {count}
              </span>
            </span>
          ))}
        </div>
      )}
    </div>
    
  );
}