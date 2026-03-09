'use client'

import { AuthProvider } from '@/context/AuthContext'
import { ChatProvider } from '@/context/ChatContext'
import { Sidebar, useSidebar } from '@/components/Sidebar'
import { ChatWindow } from '@/components/ChatWindow'

function ChatApp() {
  const { isCollapsed, isMobile, mobileOpen, toggle, closeMobile, sidebarWidth } = useSidebar()

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        isCollapsed={isCollapsed}
        onToggle={toggle}
        isMobile={isMobile}
        mobileOpen={mobileOpen}
        onMobileClose={closeMobile}
      />
      <ChatWindow sidebarWidth={sidebarWidth} isMobile={isMobile} />
    </div>
  )
}

export default function ChatPage() {
  return (
    <AuthProvider>
      <ChatProvider>
        <ChatApp />
      </ChatProvider>
    </AuthProvider>
  )
}
