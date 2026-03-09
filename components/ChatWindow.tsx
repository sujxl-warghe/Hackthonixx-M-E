'use client'

import Image from 'next/image'
import Link from 'next/link'
import { MessageList } from './MessageList'
import { Composer } from './Composer'
import { useChat } from '@/context/ChatContext'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'
import { BarChart3 } from 'lucide-react'

interface ChatWindowProps {
  sidebarWidth: number
  isMobile: boolean
}

function EmptyState() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="min-h-full flex flex-col items-center justify-center px-4 py-8 relative">
        {/* Watermark Logo */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Image
            src="/kdk-logo.png"
            alt=""
            width={400}
            height={400}
            className="opacity-5 select-none"
            priority
          />
        </div>
        
        {/* Welcome Text */}
        <div className="relative z-10 text-center max-w-2xl w-full">
          <div className="mx-auto mb-6 w-28 h-28 md:w-40 md:h-40 rounded-2xl border border-primary/30 bg-gradient-to-br from-[#1a1d24] to-[#0f1318] p-3 flex items-center justify-center shadow-lg shadow-primary/10 ring-1 ring-white/5">
            <Image
              src="/kdk-logo.png"
              alt="KDK College Logo"
              width={140}
              height={140}
              className="object-contain"
              priority
            />
          </div>
          <h2 className="text-xl md:text-3xl font-semibold mb-3 text-foreground">
            Welcome to KDK College AI Assistant
          </h2>
          <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8 px-2">
            How can I help you today?
          </p>
          
          {/* Quick Suggestions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3 max-w-xl mx-auto">
            <SuggestionCard
              title="Admission Process"
              description="What are the steps for admission?"
            />
            <SuggestionCard
              title="Campus Events"
              description="What events are happening this week?"
            />
            <SuggestionCard
              title="Courses Offered"
              description="What engineering branches are available?"
            />
            <SuggestionCard
              title="Contact Info"
              description="How can I contact the college office?"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function SuggestionCard({ title, description }: { title: string; description: string }) {
  const { sendMessage } = useChat()

  return (
    <button
      type="button"
      onClick={() => sendMessage(description)}
      className="text-left p-4 rounded-xl border border-border bg-card/50 hover:bg-accent/50 transition-colors group"
    >
      <p className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
        {title}
      </p>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </button>
  )
}

function UploadWarningBanner() {
  const { uploadedFiles } = useChat()
  const { isAuthenticated } = useAuth()

  if (isAuthenticated || uploadedFiles.length === 0) return null

  return (
    <div className="mx-4 mb-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 text-sm">
      Uploads are only used in this chat. Login to save documents to your account.
    </div>
  )
}

export function ChatWindow({ sidebarWidth, isMobile }: ChatWindowProps) {
  const { messages, isStreaming } = useChat()
  const hasMessages = messages.length > 0

  return (
    <main
      className={cn(
        'flex flex-col h-screen transition-all duration-300',
        !isMobile && 'ml-auto'
      )}
      style={{
        width: isMobile ? '100%' : `calc(100% - ${sidebarWidth}px)`,
        paddingTop: isMobile ? '56px' : '0',
      }}
    >
      {/* Header with Dashboard Link */}
      <div className="shrink-0 border-b border-border bg-background/50 backdrop-blur-sm px-4 md:px-8 py-3 flex items-center justify-end">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent/50 hover:bg-accent transition-colors text-sm font-medium text-foreground"
          title="Go to Dashboard"
        >
          <BarChart3 className="h-4 w-4" />
          <span className="hidden sm:inline">Dashboard</span>
        </Link>
      </div>

      {hasMessages ? (
        <MessageList messages={messages} isStreaming={isStreaming} />
      ) : (
        <EmptyState />
      )}
      
      <div className="shrink-0 bg-gradient-to-t from-background via-background to-transparent pt-4 pb-3 md:pb-4 px-3 md:px-8">
        <div className="max-w-3xl mx-auto">
          <UploadWarningBanner />
          <Composer />
        </div>
        <p className="text-center text-xs text-muted-foreground mt-2">
          KDK College AI may produce inaccurate information. Verify important details.
        </p>
      </div>
    </main>
  )
}
