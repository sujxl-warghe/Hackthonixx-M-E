'use client'
import { useEffect, useState } from 'react'
import { Trash2, Eye, ChevronLeft, ChevronRight } from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'
const FILTERS = ['all','today','week','month']

export default function AdminChats() {
  const [chats, setChats] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [viewChat, setViewChat] = useState<any>(null)

  const load = async (p = page, f = filter) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(p), limit: '10', filter: f })
      const res = await fetch(`${API}/admin/chats?${params}`)
      const data = await res.json()
      setChats(data.chats || [])
      setTotal(data.total || 0)
      setPages(data.pages || 1)
    } catch {}
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleFilter = (f: string) => { setFilter(f); setPage(1); load(1, f) }
  const goPage = (p: number) => { setPage(p); load(p, filter) }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this chat?')) return
    await fetch(`${API}/admin/chats/${id}`, { method: 'DELETE' })
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Chats</h1>
          <p className="text-gray-500">Total: {total} messages</p>
        </div>
        <div className="flex gap-2">
          {FILTERS.map(f => (
            <button key={f} onClick={() => handleFilter(f)} className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-colors ${filter === f ? 'bg-blue-800 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>{f}</button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-gray-400">Loading...</div>
        ) : chats.length === 0 ? (
          <div className="py-20 text-center text-gray-400">No chats found</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['User','Message','Time','Actions'].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {chats.map(c => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <span className="text-sm text-orange-600 font-medium">{c.user_email}</span>
                  </td>
                  <td className="px-6 py-4 max-w-xs">
                    <span className="text-sm text-gray-700 truncate block">{c.message}</span>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500 whitespace-nowrap">
                    {c.timestamp ? new Date(c.timestamp).toLocaleString('en-IN') : 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => setViewChat(c)} className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 border border-blue-200 rounded-lg">
                        <Eye className="w-3 h-3" /> View
                      </button>
                      <button onClick={() => handleDelete(c.id)} className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 border border-red-200 rounded-lg">
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </div>
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
            <button disabled={page <= 1} onClick={() => goPage(page - 1)} className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40"><ChevronLeft className="w-4 h-4" /></button>
            {Array.from({ length: Math.min(pages, 5) }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => goPage(p)} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${p === page ? 'bg-blue-800 text-white' : 'border border-gray-200 hover:bg-gray-50'}`}>{p}</button>
            ))}
            <button disabled={page >= pages} onClick={() => goPage(page + 1)} className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      )}

      {/* View modal */}
      {viewChat && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setViewChat(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-gray-900 mb-4">Chat Message</h3>
            <div className="space-y-2 text-sm">
              <div><span className="font-medium text-gray-500">User:</span> <span className="text-orange-600">{viewChat.user_email}</span></div>
              <div><span className="font-medium text-gray-500">Time:</span> {viewChat.timestamp ? new Date(viewChat.timestamp).toLocaleString('en-IN') : 'N/A'}</div>
              <div className="mt-4 p-4 bg-blue-50 rounded-xl"><span className="font-medium text-gray-500 block mb-1">Message:</span><p className="text-gray-700">{viewChat.message}</p></div>
            </div>
            <button onClick={() => setViewChat(null)} className="mt-4 w-full py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium">Close</button>
          </div>
        </div>
      )}
    </div>
  )
}
