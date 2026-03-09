'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { 
  Plus, 
  Search, 
  MessageSquare, 
  MoreHorizontal, 
  Pencil, 
  Trash2, 
  LogIn, 
  LogOut,
  PanelLeftClose,
  PanelLeft,
  Menu,
  BarChart3,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useAuth } from '@/context/AuthContext'
import { useChat } from '@/context/ChatContext'
import { cn } from '@/lib/utils'

interface SidebarProps {
  isCollapsed: boolean
  onToggle: () => void
  isMobile: boolean
  mobileOpen: boolean
  onMobileClose: () => void
}

function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}

function SessionItem({ 
  session, 
  isActive, 
  isCollapsed,
  onSelect, 
  onRename, 
  onDelete 
}: { 
  session: { id: string; title: string; updatedAt: Date }
  isActive: boolean
  isCollapsed: boolean
  onSelect: () => void
  onRename: (title: string) => void
  onDelete: () => void
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(session.title)

  const handleRename = () => {
    if (editTitle.trim()) {
      onRename(editTitle.trim())
    }
    setIsEditing(false)
  }

  if (isCollapsed) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          'w-full h-10 flex items-center justify-center',
          isActive && 'bg-accent'
        )}
        onClick={onSelect}
        title={session.title}
      >
        <MessageSquare className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <div
      className={cn(
        'group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors',
        isActive 
          ? 'bg-accent text-accent-foreground' 
          : 'hover:bg-accent/50'
      )}
      onClick={onSelect}
    >
      <MessageSquare className="h-4 w-4 shrink-0 text-muted-foreground" />
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleRename}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleRename()
              if (e.key === 'Escape') setIsEditing(false)
            }}
            className="h-6 text-sm bg-input"
            autoFocus
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <>
            <p className="text-sm truncate">{session.title}</p>
            <p className="text-xs text-muted-foreground">
              {formatTimeAgo(session.updatedAt)}
            </p>
          </>
        )}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 opacity-0 group-hover:opacity-100 shrink-0"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation()
              setIsEditing(true)
            }}
          >
            <Pencil className="h-4 w-4 mr-2" />
            Rename
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

function SidebarContent({ 
  isCollapsed, 
  onClose 
}: { 
  isCollapsed: boolean
  onClose?: () => void 
}) {
  const { user, isAuthenticated, logout } = useAuth()
  const { 
    sessions, 
    currentSession, 
    isLoading, 
    createNewSession, 
    selectSession, 
    deleteSession, 
    renameSession,
    searchSessions,
  } = useChat()
  const [searchQuery, setSearchQuery] = useState('')

  const filteredSessions = searchQuery ? searchSessions(searchQuery) : sessions

  const handleSelectSession = (sessionId: string) => {
    selectSession(sessionId)
    onClose?.()
  }

  const handleNewChat = () => {
    createNewSession()
    onClose?.()
  }

  return (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground">
      {/* Header */}
      <div className={cn(
        'flex items-center gap-3 p-4 border-b border-sidebar-border',
        isCollapsed && 'justify-center'
      )}>
        <Image
          src="/kdk-logo.png"
          alt="KDK College Logo"
          width={isCollapsed ? 32 : 40}
          height={isCollapsed ? 32 : 40}
          className="rounded"
        />
        {!isCollapsed && (
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-semibold truncate">KDK College</h1>
            <p className="text-xs text-muted-foreground truncate">AI Assistant</p>
          </div>
        )}
      </div>

      {/* New Chat Button */}
      <div className="p-3 space-y-2">
        {/* Navigation Links */}
        <div className="space-y-1 mb-3 pb-3 border-b border-sidebar-border">
          <Link href="/chat" className="block">
            <Button
              variant="ghost"
              className={cn(
                'w-full justify-start gap-2 text-sidebar-foreground hover:bg-sidebar-accent/50',
                isCollapsed && 'px-0 flex justify-center'
              )}
              size={isCollapsed ? 'icon' : 'default'}
              title="Chat"
            >
              <MessageSquare className="h-4 w-4" />
              {!isCollapsed && 'Chat'}
            </Button>
          </Link>
          <Link href="/dashboard" className="block">
            <Button
              variant="ghost"
              className={cn(
                'w-full justify-start gap-2 text-sidebar-foreground hover:bg-sidebar-accent/50',
                isCollapsed && 'px-0 flex justify-center'
              )}
              size={isCollapsed ? 'icon' : 'default'}
              title="Dashboard"
            >
              <BarChart3 className="h-4 w-4" />
              {!isCollapsed && 'Dashboard'}
            </Button>
          </Link>
        </div>

        {/* New Chat Button */}
        <Button
          onClick={handleNewChat}
          className={cn(
            'w-full bg-sidebar-accent hover:bg-sidebar-accent/80 text-sidebar-accent-foreground',
            isCollapsed ? 'px-0' : 'justify-start gap-2'
          )}
          size={isCollapsed ? 'icon' : 'default'}
        >
          <Plus className="h-4 w-4" />
          {!isCollapsed && 'New chat'}
        </Button>
      </div>

      {/* Search */}
      {!isCollapsed && (
        <div className="px-3 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-sidebar-accent/50 border-sidebar-border"
            />
          </div>
        </div>
      )}

      {/* Sessions List */}
      <ScrollArea className="flex-1 px-3">
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-lg" />
            ))}
          </div>
        ) : filteredSessions.length === 0 ? (
          !isCollapsed && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              {searchQuery ? 'No matching chats' : 'No chat history yet'}
            </div>
          )
        ) : (
          <div className="space-y-1 pb-4">
            {filteredSessions.map((session) => (
              <SessionItem
                key={session.id}
                session={session}
                isActive={currentSession?.id === session.id}
                isCollapsed={isCollapsed}
                onSelect={() => handleSelectSession(session.id)}
                onRename={(title) => renameSession(session.id, title)}
                onDelete={() => deleteSession(session.id)}
              />
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Footer - Auth Button */}
      <div className="p-3 border-t border-sidebar-border">
        {isAuthenticated ? (
          <div className={cn(
            'flex items-center gap-2',
            isCollapsed && 'flex-col'
          )}>
            {!isCollapsed && user && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            )}
            <Button
              variant="ghost"
              size={isCollapsed ? 'icon' : 'sm'}
              onClick={() => logout()}
              className={cn(!isCollapsed && 'gap-2')}
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
              {!isCollapsed && 'Logout'}
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            className={cn(
              'w-full border-sidebar-border',
              isCollapsed ? 'px-0' : 'justify-start gap-2'
            )}
            size={isCollapsed ? 'icon' : 'default'}
            asChild
          >
            <Link href="/login">
              <LogIn className="h-4 w-4" />
              {!isCollapsed && 'Login'}
            </Link>
          </Button>
        )}
      </div>
    </div>
  )
}

export function Sidebar({ 
  isCollapsed, 
  onToggle, 
  isMobile, 
  mobileOpen, 
  onMobileClose 
}: SidebarProps) {
  // Mobile: Sheet overlay
  if (isMobile) {
    return (
      <>
        {/* Mobile toggle button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="fixed top-3 left-3 z-40 bg-background/80 backdrop-blur-sm"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <Sheet open={mobileOpen} onOpenChange={onMobileClose}>
          <SheetContent side="left" className="w-[280px] p-0 bg-sidebar border-sidebar-border">
            <SheetHeader className="sr-only">
              <SheetTitle>Navigation Menu</SheetTitle>
            </SheetHeader>
            <SidebarContent isCollapsed={false} onClose={onMobileClose} />
          </SheetContent>
        </Sheet>
      </>
    )
  }

  // Desktop: Fixed sidebar
  return (
    <>
      {/* Toggle button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggle}
        className="fixed top-3 left-3 z-40 bg-background/80 backdrop-blur-sm"
        title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? (
          <PanelLeft className="h-5 w-5" />
        ) : (
          <PanelLeftClose className="h-5 w-5" />
        )}
      </Button>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-full border-r border-sidebar-border bg-sidebar transition-all duration-300 z-30',
          isCollapsed ? 'w-16' : 'w-[280px]'
        )}
      >
        <div className="pt-14">
          <SidebarContent isCollapsed={isCollapsed} />
        </div>
      </aside>
    </>
  )
}

export function useSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const toggle = () => {
    if (isMobile) {
      setMobileOpen(true)
    } else {
      setIsCollapsed(prev => !prev)
    }
  }

  const closeMobile = () => setMobileOpen(false)

  return {
    isCollapsed,
    isMobile,
    mobileOpen,
    toggle,
    closeMobile,
    sidebarWidth: isMobile ? 0 : (isCollapsed ? 64 : 280),
  }
}
