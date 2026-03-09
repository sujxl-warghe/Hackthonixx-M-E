'use client'

import { useState, useRef, useEffect, type KeyboardEvent, type ChangeEvent } from 'react'
import { Send, Paperclip, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FileUploadChips } from './FileUploadChips'
import { useChat } from '@/context/ChatContext'
import { uploadTempDoc } from '@/lib/api'
import { cn } from '@/lib/utils'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/gif',
  'image/webp',
]

export function Composer() {
  const [input, setInput] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const { 
    sendMessage, 
    isStreaming, 
    uploadedFiles, 
    addUploadedFile, 
    removeUploadedFile,
    currentSession,
  } = useChat()

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`
    }
  }, [input])

  // Focus textarea on mount
  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  const handleSubmit = async () => {
    const trimmedInput = input.trim()
    if (!trimmedInput || isStreaming) return

    setInput('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
    
    await sendMessage(trimmedInput)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)

    for (const file of Array.from(files)) {
      // Validate file type
      if (!ALLOWED_TYPES.includes(file.type)) {
        console.error(`Invalid file type: ${file.type}`)
        continue
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        console.error(`File too large: ${file.name}`)
        continue
      }

      try {
        // If we have a session and API is available, upload to server
        if (currentSession?.id) {
          await uploadTempDoc(file, currentSession.id)
        }

        // Add to local state
        addUploadedFile({
          id: Math.random().toString(36).substring(2, 15),
          name: file.name,
          type: file.type,
          size: file.size,
        })
      } catch (error) {
        console.error('Failed to upload file:', error)
        // Still add locally for UI purposes
        addUploadedFile({
          id: Math.random().toString(36).substring(2, 15),
          name: file.name,
          type: file.type,
          size: file.size,
        })
      }
    }

    setIsUploading(false)
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="relative">
      <FileUploadChips files={uploadedFiles} onRemove={removeUploadedFile} />
      
      <div className="relative flex items-end gap-2 rounded-2xl border border-border bg-input p-2 focus-within:border-ring transition-colors">
        {/* File Upload Button */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-9 w-9 shrink-0 text-muted-foreground hover:text-foreground"
          onClick={handleUploadClick}
          disabled={isUploading}
        >
          {isUploading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Paperclip className="h-5 w-5" />
          )}
        </Button>
        
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".pdf,.png,.jpg,.jpeg,.gif,.webp"
          multiple
          onChange={handleFileSelect}
        />

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything..."
          rows={1}
          className={cn(
            'flex-1 resize-none bg-transparent text-foreground placeholder:text-muted-foreground',
            'focus:outline-none text-sm md:text-base py-1.5',
            'max-h-[120px] overflow-y-auto'
          )}
          disabled={isStreaming}
        />

        {/* Send Button */}
        <Button
          type="button"
          size="icon"
          className={cn(
            'h-9 w-9 shrink-0 rounded-xl transition-all',
            input.trim()
              ? 'bg-primary text-primary-foreground hover:bg-primary/90'
              : 'bg-muted text-muted-foreground'
          )}
          onClick={handleSubmit}
          disabled={!input.trim() || isStreaming}
        >
          {isStreaming ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </Button>
      </div>
    </div>
  )
}
