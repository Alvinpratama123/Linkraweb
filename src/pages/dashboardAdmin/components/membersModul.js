import React, { useState } from 'react'
import { sampleMembers } from './memberData'

export default function MembersModul({ members = null }) {
  const [listMembers, setListMembers] = useState(members || sampleMembers)
  const [showForm, setShowForm] = useState(false)
  const [newMember, setNewMember] = useState({ name: '', position: '', email: '', password: '', profile: '' })

  const counts = listMembers.reduce((acc, m) => {
    acc[m.position] = (acc[m.position] || 0) + 1
    return acc
  }, {})

  const handleChange = (field, value) => {
    setNewMember((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddMember = (event) => {
    event.preventDefault()
    const nextId = listMembers.length ? Math.max(...listMembers.map((m) => m.id)) + 1 : 1

    setListMembers((prev) => [
      ...prev,
      {
        id: nextId,
        name: newMember.name,
        position: newMember.position,
        email: newMember.email,
        profile: newMember.profile,
        bio: 'Member baru',
      },
    ])

    setNewMember({ name: '', position: '', email: '', password: '', profile: '' })
    setShowForm(false)
  }

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

      {showForm && (
        <form onSubmit={handleAddMember} className="mb-6 rounded-lg bg-white p-6 shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="space-y-2">
              <span className="text-sm font-medium text-gray-700">Nama Member</span>
              <input
                value={newMember.name}
                onChange={(e) => handleChange('name', e.target.value)}
                type="text"
                placeholder="Masukkan nama"
                className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                required
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-gray-700">Posisi</span>
              <input
                value={newMember.position}
                onChange={(e) => handleChange('position', e.target.value)}
                type="text"
                placeholder="Developer, Designer, QA..."
                className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                required
              />
            </label>
            

            <label className="space-y-2">
              <span className="text-sm font-medium text-gray-700">Email</span>
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
              <span className="text-sm font-medium text-gray-700">Password</span>
              <input
                value={newMember.password}
                onChange={(e) => handleChange('password', e.target.value)}
                type="password"
                placeholder="Password member"
                className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                required
              />
            </label>

            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-medium text-gray-700">Profile</span>
              <input
                value={newMember.profile}
                onChange={(e) => handleChange('profile', e.target.value)}
                type="text"
                placeholder="Link profil / akun"
                className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
              />
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
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Nama Member</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Posisi</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Profile</th>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
