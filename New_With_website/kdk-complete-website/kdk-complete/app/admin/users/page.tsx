'use client'
import { useEffect, useState } from 'react'
import { Search, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const load = async (p = page, s = search) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(p), limit: '10' })
      if (s) params.set('search', s)
      const res = await fetch(`${API}/admin/users?${params}`)
      const data = await res.json()
      setUsers(data.users || [])
      setTotal(data.total || 0)
      setPages(data.pages || 1)
    } catch {}
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); setPage(1); load(1, search) }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this user and all their data?')) return
    await fetch(`${API}/admin/users/${id}`, { method: 'DELETE' })
    setDeleteId(null)
    load()
  }

  const goPage = (p: number) => { setPage(p); load(p, search) }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-500">Total: {total} users</p>
        </div>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by email..."
            className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <button type="submit" className="p-2 bg-blue-800 text-white rounded-xl hover:bg-blue-900">
            <Search className="w-5 h-5" />
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-gray-400">Loading...</div>
        ) : users.length === 0 ? (
          <div className="py-20 text-center text-gray-400">No users found</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['#','Email','Joined','Actions'].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((u, i) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-500">{(page - 1) * 10 + i + 1}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-800 text-white rounded-full flex items-center justify-center text-xs font-bold">{u.email?.[0]?.toUpperCase()}</div>
                      <span className="text-sm font-medium text-gray-900">{u.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{u.created_at ? new Date(u.created_at).toLocaleDateString('en-IN') : 'N/A'}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleDelete(u.id)} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {pages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-gray-500">Page {page} of {pages}</span>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => goPage(page - 1)} className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40">
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: Math.min(pages, 5) }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => goPage(p)} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${p === page ? 'bg-blue-800 text-white' : 'border border-gray-200 hover:bg-gray-50'}`}>{p}</button>
            ))}
            <button disabled={page >= pages} onClick={() => goPage(page + 1)} className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
