'use client'
import { useState } from 'react'
import { Check } from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'

export default function AdminSettings() {
  const [settings, setSettings] = useState({ college_name: 'KDK College of Engineering', admin_email: 'admin@kdkcollege.edu.in', phone: '+91-712-1234567' })
  const [settingsSaved, setSettingsSaved] = useState(false)
  const [pw, setPw] = useState({ current: '', newPw: '', confirm: '' })
  const [pwMsg, setPwMsg] = useState('')
  const [pwError, setPwError] = useState('')
  const [pwLoading, setPwLoading] = useState(false)

  const handleSettingsSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSettingsSaved(true)
    setTimeout(() => setSettingsSaved(false), 3000)
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setPwMsg(''); setPwError('')
    if (pw.newPw !== pw.confirm) { setPwError('New passwords do not match'); return }
    if (pw.newPw.length < 6) { setPwError('Password must be at least 6 characters'); return }
    setPwLoading(true)
    try {
      const res = await fetch(`${API}/admin/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ current_password: pw.current, new_password: pw.newPw }),
      })
      if (!res.ok) { const d = await res.json(); throw new Error(d.detail) }
      setPwMsg('Password changed successfully!')
      setPw({ current: '', newPw: '', confirm: '' })
    } catch (err: any) {
      setPwError(err.message)
    }
    setPwLoading(false)
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500">Manage college and admin settings</p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* General Settings */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 mb-5">General Settings</h2>
          <form onSubmit={handleSettingsSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">College Name</label>
              <input value={settings.college_name} onChange={e => setSettings({...settings, college_name: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Admin Email</label>
              <input type="email" value={settings.admin_email} onChange={e => setSettings({...settings, admin_email: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input value={settings.phone} onChange={e => setSettings({...settings, phone: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <button type="submit" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-800 text-white font-bold rounded-xl hover:bg-blue-900 transition-colors">
              {settingsSaved ? <><Check className="w-4 h-4" /> Saved!</> : 'Update Settings'}
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 mb-5">Change Admin Password</h2>
          {pwMsg && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-4 text-sm">{pwMsg}</div>}
          {pwError && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">{pwError}</div>}
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
              <input type="password" required value={pw.current} onChange={e => setPw({...pw, current: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input type="password" required value={pw.newPw} onChange={e => setPw({...pw, newPw: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <input type="password" required value={pw.confirm} onChange={e => setPw({...pw, confirm: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <button type="submit" disabled={pwLoading} className="px-6 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-60">
              {pwLoading ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <h3 className="font-bold text-blue-900 mb-2">System Information</h3>
          <div className="space-y-1 text-sm text-blue-700">
            <div>Version: KDK College AI System v2.0</div>
            <div>Backend: FastAPI + MongoDB</div>
            <div>Frontend: Next.js 16 + Tailwind CSS</div>
            <div>Default Admin: admin@kdkcollege.edu.in / admin123</div>
          </div>
        </div>
      </div>
    </div>
  )
}
