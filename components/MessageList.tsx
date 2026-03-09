'use client'

import React from "react"

import { useEffect, useRef, useState } from 'react'
import { ChevronDown, ExternalLink, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'
import type { Message } from '@/lib/api'

interface MessageListProps {
  messages: Message[]
  isStreaming: boolean
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      <div className="flex gap-1">
        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]" />
        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]" />
        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
      </div>
    </div>
  )
}

function CodeBlock({ code, language }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative group my-4 rounded-lg overflow-hidden bg-[#1a1b26] border border-border">
      <div className="flex items-center justify-between px-4 py-2 bg-[#15161e] border-b border-border">
        <span className="text-xs text-muted-foreground font-mono">
          {language || 'code'}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-7 px-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 mr-1" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-3 w-3 mr-1" />
              Copy
            </>
          )}
        </Button>
      </div>
      <pre className="p-4 overflow-x-auto">
        <code className="text-sm font-mono text-foreground">{code}</code>
      </pre>
    </div>
  )
}

function renderMarkdown(content: string) {
  const elements: React.ReactNode[] = []
  let key = 0

  // Split by code blocks first
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g
  let lastIndex = 0
  let match

  while ((match = codeBlockRegex.exec(content)) !== null) {
    // Add text before code block
    if (match.index > lastIndex) {
      const textBefore = content.slice(lastIndex, match.index)
      elements.push(
        <span key={key++} className="whitespace-pre-wrap">
          {renderInlineMarkdown(textBefore)}
        </span>
      )
    }

    // Add code block
    elements.push(
      <CodeBlock
        key={key++}
        language={match[1]}
        code={match[2].trim()}
      />
    )

    lastIndex = match.index + match[0].length
  }

  // Add remaining text
  if (lastIndex < content.length) {
    const remainingText = content.slice(lastIndex)
    elements.push(
      <span key={key++} className="whitespace-pre-wrap">
        {renderInlineMarkdown(remainingText)}
      </span>
    )
  }

  return elements
}

function renderInlineMarkdown(text: string) {
  // Handle inline code
  const parts = text.split(/(`[^`]+`)/g)
  return parts.map((part, i) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={i}
          className="px-1.5 py-0.5 rounded bg-muted font-mono text-sm"
        >
          {part.slice(1, -1)}
        </code>
      )
    }
    // Handle bold
    const boldParts = part.split(/(\*\*[^*]+\*\*)/g)
    return boldParts.map((bp, j) => {
      if (bp.startsWith('**') && bp.endsWith('**')) {
        return <strong key={`${i}-${j}`}>{bp.slice(2, -2)}</strong>
      }
      return <span key={`${i}-${j}`}>{bp}</span>
    })
  })
}

function SourcesSection({ sources }: { sources: { title: string; url?: string }[] }) {
  const [isOpen, setIsOpen] = useState(false)

  if (!sources || sources.length === 0) return null

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mt-4">
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-3 text-xs text-muted-foreground hover:text-foreground gap-2"
        >
          <span>Sources ({sources.length})</span>
          <ChevronDown
            className={cn(
              'h-3 w-3 transition-transform',
              isOpen && 'rotate-180'
            )}
          />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2">
        <div className="flex flex-wrap gap-2">
          {sources.map((source, i) => (
            <a
              key={i}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-muted rounded-full hover:bg-accent transition-colors"
            >
              <span className="truncate max-w-[200px]">{source.title}</span>
              {source.url && <ExternalLink className="h-3 w-3 shrink-0" />}
            </a>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

function ConfidenceScore({ score }: { score: number }) {
  const percentage = Math.round(score * 100)
  const color = score >= 0.8 ? 'text-green-500' : score >= 0.5 ? 'text-yellow-500' : 'text-red-500'

  return (
    <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground mt-2">
      <span>Confidence:</span>
      <span className={cn('font-medium', color)}>{percentage}%</span>
    </div>
  )
}

function MessageBlock({ message }: { message: Message }) {
  const isUser = message.role === 'user'

  return (
    <div
      className={cn(
        'px-4 py-6 md:px-8',
        isUser ? 'bg-transparent' : 'bg-accent/30'
      )}
    >
      <div className="max-w-3xl mx-auto">
        <div className="text-sm leading-relaxed">
          {renderMarkdown(message.content)}
        </div>
        
        {!isUser && message.sources && message.sources.length > 0 && (
          <SourcesSection sources={message.sources} />
        )}
        
        {!isUser && message.confidence !== undefined && (
          <ConfidenceScore score={message.confidence} />
        )}
      </div>
    </div>
  )
}

export function MessageList({ messages, isStreaming }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isStreaming])

  if (messages.length === 0) {
    return null
  }

  return (
    <ScrollArea className="flex-1" ref={scrollRef}>
      <div className="pb-32">
        {messages.map((message) => (
          <MessageBlock key={message.id} message={message} />
        ))}
        
        {isStreaming && (
          <div className="px-4 py-6 md:px-8 bg-accent/30">
            <div className="max-w-3xl mx-auto">
              <TypingIndicator />
            </div>
          </div>
        )}
        
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  )
}
