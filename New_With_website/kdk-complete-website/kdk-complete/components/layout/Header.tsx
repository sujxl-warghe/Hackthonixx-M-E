'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, MessageCircle, GraduationCap } from 'lucide-react'

const navLinks = [
  { label: 'Home', href: '/home' },
  { label: 'About', href: '/about' },
  { label: 'Academics', href: '/academics' },
  { label: 'Admissions', href: '/admissions' },
  { label: 'Placements', href: '/placements' },
  { label: 'Facilities', href: '/facilities' },
  { label: 'Student Life', href: '/student-life' },
  { label: 'Contact', href: '/contact' },
]

export function Header() {
  const [open, setOpen] = useState(false)
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link href="/home" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div className="hidden sm:block">
            <div className="font-bold text-blue-900 text-sm leading-tight">KDK College of</div>
            <div className="font-bold text-blue-900 text-sm leading-tight">Engineering</div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map(l => (
            <Link key={l.href} href={l.href} className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/admissions" className="hidden sm:inline-flex items-center px-4 py-2 bg-orange-500 text-white text-sm font-semibold rounded-lg hover:bg-orange-600 transition-colors">
            Apply Now
          </Link>
          <Link href="/chat" className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-blue-800 text-white text-sm font-semibold rounded-lg hover:bg-blue-900 transition-colors">
            <MessageCircle className="w-4 h-4" />
            AI Chat
          </Link>
          <button onClick={() => setOpen(!open)} className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100">
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden bg-white border-t px-4 py-4 space-y-1">
          {navLinks.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-800 hover:bg-blue-50 rounded-md">
              {l.label}
            </Link>
          ))}
          <div className="pt-2 flex gap-2">
            <Link href="/admissions" onClick={() => setOpen(false)} className="flex-1 text-center px-4 py-2 bg-orange-500 text-white text-sm font-semibold rounded-lg">Apply Now</Link>
            <Link href="/chat" onClick={() => setOpen(false)} className="flex-1 text-center px-4 py-2 bg-blue-800 text-white text-sm font-semibold rounded-lg">AI Chat</Link>
          </div>
        </div>
      )}
    </header>
  )
}
