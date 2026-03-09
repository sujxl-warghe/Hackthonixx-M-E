'use client'
import { useEffect, useState } from 'react'
import { Trash2, ChevronLeft, ChevronRight, FileText } from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'

function formatSize(bytes?: number) {
  if (!bytes) return 'N/A'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

export default function AdminDocuments() {
  const [docs, setDocs] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [loading, setLoading] = useState(true)

  const load = async (p = page) => {
    setLoading(true)
    try {
      const res = await fetch(`${API}/admin/documents?page=${p}&limit=10`)
      const data = await res.json()
      setDocs(data.documents || [])
      setTotal(data.total || 0)
      setPages(data.pages || 1)
    } catch {}
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this document?')) return
    await fetch(`${API}/admin/documents/${id}`, { method: 'DELETE' })
    load()
  }

  const goPage = (p: number) => { setPage(p); load(p) }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
        <p className="text-gray-500">Total: {total} documents uploaded</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-gray-400">Loading...</div>
        ) : docs.length === 0 ? (
          <div className="py-20 text-center">
            <FileText className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400">No documents uploaded yet</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['User','Filename','Size','Uploaded','Actions'].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {docs.map(d => (
                <tr key={d.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-orange-600 font-medium">{d.user_email}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-gray-900 font-medium">{d.filename}</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">{d.content_type}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{formatSize(d.size)}</td>
                  <td className="px-6 py-4 text-xs text-gray-500">{d.uploaded_at ? new Date(d.uploaded_at).toLocaleDateString('en-IN') : 'N/A'}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleDelete(d.id)} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition-colors">
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
            <button disabled={page <= 1} onClick={() => goPage(page - 1)} className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40"><ChevronLeft className="w-4 h-4" /></button>
            <button disabled={page >= pages} onClick={() => goPage(page + 1)} className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      )}
    </div>
  )
}
