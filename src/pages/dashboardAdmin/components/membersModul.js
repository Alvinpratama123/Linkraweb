import React, { useState, useEffect } from 'react';
import { sampleMembers } from './memberData';

export default function MembersModul({ members = null }) {
  const [listMembers, setListMembers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [newMember, setNewMember] = useState({ 
    name: '', 
    position: '', 
    email: '', 
    password: '', 
    profile: '' 
  });

  // Fetch members from database
  const fetchMembers = async () => {
    try {
      const response = await fetch('/api/members');
      const data = await response.json();
      if (data.success) {
        setListMembers(data.members);
      } else {
        // Fallback ke sample data jika API error
        setListMembers(members || sampleMembers);
      }
    } catch (error) {
      console.error('Error fetching members:', error);
      setListMembers(members || sampleMembers);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const counts = listMembers.reduce((acc, m) => {
    acc[m.position] = (acc[m.position] || 0) + 1;
    return acc;
  }, {});

  const handleChange = (field, value) => {
    setNewMember((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddMember = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMember),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Member berhasil ditambahkan! Email konfirmasi telah dikirim.' });
        setNewMember({ name: '', position: '', email: '', password: '', profile: '' });
        setShowForm(false);
        // Refresh member list
        fetchMembers();
        
        // Hilangkan pesan setelah 5 detik
        setTimeout(() => setMessage({ type: '', text: '' }), 5000);
      } else {
        setMessage({ type: 'error', text: data.message || 'Gagal menambahkan member' });
      }
    } catch (error) {
      console.error('Error adding member:', error);
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
        setMessage({ type: 'success', text: 'Member berhasil dihapus' });
        fetchMembers();
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: data.message || 'Gagal menghapus member' });
      }
    } catch (error) {
      console.error('Error deleting member:', error);
      setMessage({ type: 'error', text: 'Terjadi kesalahan pada server' });
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-semibold">Member & Modul</h2>
          <p className="text-sm text-gray-500">Hanya admin yang dapat menambahkan member baru.</p>
        </div>

        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          {showForm ? 'Tutup Form' : 'Tambah Member'}
        </button>
      </div>

      {/* Pesan notifikasi */}
      {message.text && (
        <div className={`mb-4 p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleAddMember} className="mb-6 rounded-lg bg-white p-6 shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="space-y-2">
              <span className="text-sm font-medium text-gray-700">Nama Member *</span>
              <input
                value={newMember.name}
                onChange={(e) => handleChange('name', e.target.value)}
                type="text"
                placeholder="Masukkan nama lengkap"
                className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                required
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-gray-700">Posisi *</span>
              <select
                value={newMember.position}
                onChange={(e) => handleChange('position', e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                required
              >
                <option value="">Pilih Posisi</option>
                <option value="Frontend">Frontend Developer</option>
                <option value="Backend">Backend Developer</option>
                <option value="Fullstack">Fullstack Developer</option>
                <option value="UI/UX">UI/UX Designer</option>
                <option value="DevOps">DevOps Engineer</option>
                <option value="QA">QA Engineer</option>
                <option value="PM">Project Manager</option>
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-gray-700">Email *</span>
              <input
                value={newMember.email}
                onChange={(e) => handleChange('email', e.target.value)}
                type="email"
                placeholder="email@domain.com"
                className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                required
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-gray-700">Password *</span>
              <input
                value={newMember.password}
                onChange={(e) => handleChange('password', e.target.value)}
                type="password"
                placeholder="Password untuk login"
                className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                required
                minLength="6"
              />
              <p className="text-xs text-gray-500">Minimal 6 karakter</p>
            </label>

            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-medium text-gray-700">Profile Link (Opsional)</span>
              <input
                value={newMember.profile}
                onChange={(e) => handleChange('profile', e.target.value)}
                type="text"
                placeholder="Link profil / portfolio / GitHub"
                className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
              />
            </label>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-lg bg-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-400"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Menyimpan...' : 'Simpan Member'}
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-lg shadow overflow-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Nama Member</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Posisi</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Profile</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {listMembers.map((member) => (
              <tr key={member.id}>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm text-gray-600">
                      {member.name
                        .split(' ')
                        .map((word) => word[0])
                        .slice(0, 2)
                        .join('')}
                    </div>
                    <div>
                      <div className="font-medium">{member.name}</div>
                      <div className="text-xs text-gray-500">{member.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">{member.position}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {member.profile ? (
                    <a href={member.profile} className="text-blue-600 hover:underline" target="_blank" rel="noreferrer">
                      View
                    </a>
                  ) : (
                    <span className="text-sm text-gray-500">-</span>
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <button
                    onClick={() => handleDeleteMember(member.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}