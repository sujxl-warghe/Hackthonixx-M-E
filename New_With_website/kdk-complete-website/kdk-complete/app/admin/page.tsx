'use client'
import { useEffect, useState } from 'react'
import { Users, MessageSquare, FileText, TrendingUp } from 'lucide-react'
import Link from 'next/link'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, chats: 0, documents: 0 })
  const [recentUsers, setRecentUsers] = useState<any[]>([])
  const [recentChats, setRecentChats] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}/admin/stats`)
      .then(r => r.json())
      .then(data => {
        setStats(data.stats)
        setRecentUsers(data.recent_users || [])
        setRecentChats(data.recent_chats || [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const cards = [
    { label: 'Total Users', value: stats.users, icon: <Users className="w-7 h-7" />, color: 'bg-blue-500', href: '/admin/users' },
    { label: 'Total Chats', value: stats.chats, icon: <MessageSquare className="w-7 h-7" />, color: 'bg-green-500', href: '/admin/chats' },
    { label: 'Documents', value: stats.documents, icon: <FileText className="w-7 h-7" />, color: 'bg-orange-500', href: '/admin/documents' },
    { label: 'Avg. Chats/User', value: stats.users ? Math.round(stats.chats / (stats.users || 1)) : 0, icon: <TrendingUp className="w-7 h-7" />, color: 'bg-purple-500', href: '/admin/chats' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Welcome to the KDK College Admin Panel</p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading stats...</div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {cards.map((c, i) => (
              <Link key={i} href={c.href} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${c.color} text-white rounded-xl flex items-center justify-center`}>{c.icon}</div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{c.value}</div>
                <div className="text-gray-500 text-sm">{c.label}</div>
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Users */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-900">Recent Users</h2>
                <Link href="/admin/users" className="text-blue-600 text-sm hover:underline">View All →</Link>
              </div>
              {recentUsers.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-6">No users yet</p>
              ) : (
                <div className="space-y-3">
                  {recentUsers.map((u, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="w-8 h-8 bg-blue-800 text-white rounded-full flex items-center justify-center text-xs font-bold">{u.email?.[0]?.toUpperCase()}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">{u.email}</div>
                        <div className="text-xs text-gray-500">{u.created_at ? new Date(u.created_at).toLocaleDateString() : 'Recently'}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Chats */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-900">Recent Chats</h2>
                <Link href="/admin/chats" className="text-blue-600 text-sm hover:underline">View All →</Link>
              </div>
              {recentChats.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-6">No chats yet</p>
              ) : (
                <div className="space-y-3">
                  {recentChats.map((c, i) => (
                    <div key={i} className="p-3 bg-gray-50 rounded-xl">
                      <div className="text-xs text-orange-500 font-semibold mb-1">{c.user_email}</div>
                      <div className="text-sm text-gray-700 truncate">{c.message}</div>
                      <div className="text-xs text-gray-400 mt-1">{c.timestamp ? new Date(c.timestamp).toLocaleString() : ''}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="flex flex-wrap gap-3">
              {[
                { label: 'Manage Users', href: '/admin/users', color: 'bg-blue-800 text-white' },
                { label: 'View Chats', href: '/admin/chats', color: 'bg-green-600 text-white' },
                { label: 'View Documents', href: '/admin/documents', color: 'bg-orange-500 text-white' },
                { label: 'Settings', href: '/admin/settings', color: 'bg-gray-600 text-white' },
                { label: 'Go to Website', href: '/home', color: 'bg-gray-100 text-gray-700' },
              ].map((a, i) => (
                <Link key={i} href={a.href} className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-opacity hover:opacity-80 ${a.color}`}>{a.label}</Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
