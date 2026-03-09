'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { GraduationCap, LayoutDashboard, Users, MessageSquare, FileText, Settings, LogOut } from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { href: '/admin/users', label: 'Users', icon: <Users className="w-5 h-5" /> },
  { href: '/admin/chats', label: 'Chats', icon: <MessageSquare className="w-5 h-5" /> },
  { href: '/admin/documents', label: 'Documents', icon: <FileText className="w-5 h-5" /> },
  { href: '/admin/settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [admin, setAdmin] = useState<{email: string} | null>(null)

  useEffect(() => {
    if (pathname === '/admin/login') return
    const stored = localStorage.getItem('adminUser')
    if (!stored) { router.push('/admin/login'); return }
    setAdmin(JSON.parse(stored))
  }, [pathname, router])

  const handleLogout = () => {
    localStorage.removeItem('adminUser')
    router.push('/admin/login')
  }

  if (pathname === '/admin/login') return <>{children}</>

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-60 bg-blue-900 text-white flex flex-col flex-shrink-0">
        <div className="p-5 border-b border-blue-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-sm">KDK Admin</div>
              <div className="text-blue-300 text-xs">Control Panel</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                pathname === item.href ? 'bg-white/20 text-white' : 'text-blue-200 hover:bg-white/10 hover:text-white'
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-blue-800">
          <div className="text-xs text-blue-300 mb-3 px-2 truncate">{admin?.email}</div>
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-xl text-blue-200 hover:bg-white/10 hover:text-white transition-all text-sm font-medium">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}
