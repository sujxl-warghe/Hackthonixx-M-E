'use client'
import Link from 'next/link'
import { MessageCircle } from 'lucide-react'

export function FloatingChat() {
  return (
    <Link
      href="/chat"
      className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-blue-800 hover:bg-blue-900 text-white rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-110 group"
    >
      <MessageCircle className="w-7 h-7" />
      <span className="absolute right-full mr-3 bg-gray-900 text-white text-xs rounded-lg px-3 py-1.5 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        Chat with AI Assistant
      </span>
    </Link>
  )
}
