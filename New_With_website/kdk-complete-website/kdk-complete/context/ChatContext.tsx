'use client'

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import { 
  type Message, 
  type ChatSession, 
  askPublic, 
  askPrivate, 
  isAcademicQuery,
  getSessions as apiGetSessions,
  getSessionMessages as apiGetSessionMessages,
} from '@/lib/api'
import { useAuth } from './AuthContext'

const SESSIONS_STORAGE_KEY = 'kdk_chat_sessions'
const CURRENT_SESSION_KEY = 'kdk_current_session'

interface UploadedFile {
  id: string
  name: string
  type: string
  size: number
}

interface ChatContextType {
  sessions: ChatSession[]
  currentSession: ChatSession | null
  messages: Message[]
  isLoading: boolean
  isStreaming: boolean
  uploadedFiles: UploadedFile[]
  createNewSession: () => void
  selectSession: (sessionId: string) => void
  deleteSession: (sessionId: string) => void
  renameSession: (sessionId: string, title: string) => void
  sendMessage: (content: string) => Promise<void>
  addUploadedFile: (file: UploadedFile) => void
  removeUploadedFile: (fileId: string) => void
  clearUploadedFiles: () => void
  searchSessions: (query: string) => ChatSession[]
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

function generateId(): string {
  return Math.random().toString(36).substring(2, 15)
}

function getStoredSessions(): ChatSession[] {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem(SESSIONS_STORAGE_KEY)
  if (!stored) return []
  try {
    const sessions = JSON.parse(stored)
    return sessions.map((s: ChatSession) => ({
      ...s,
      updatedAt: new Date(s.updatedAt),
      messages: s.messages.map((m: Message) => ({
        ...m,
        timestamp: new Date(m.timestamp),
      })),
    }))
  } catch {
    return []
  }
}

function storeSessions(sessions: ChatSession[]): void {
  localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions))
}

function getStoredCurrentSessionId(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(CURRENT_SESSION_KEY)
}

function storeCurrentSessionId(sessionId: string | null): void {
  if (sessionId) {
    localStorage.setItem(CURRENT_SESSION_KEY, sessionId)
  } else {
    localStorage.removeItem(CURRENT_SESSION_KEY)
  }
}

export function ChatProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isStreaming, setIsStreaming] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])

  // Load sessions on mount
  useEffect(() => {
    const loadSessions = async () => {
      setIsLoading(true)
      try {
        // Try to fetch from API first
        if (isAuthenticated) {
          try {
            const apiSessions = await apiGetSessions()
            setSessions(apiSessions)
            const currentId = getStoredCurrentSessionId()
            if (currentId) {
              const session = apiSessions.find((s: ChatSession) => s.id === currentId)
              if (session) {
                const messages = await apiGetSessionMessages(currentId)
                setCurrentSession({ ...session, messages })
              }
            }
            setIsLoading(false)
            return
          } catch {
            // Fall back to localStorage if API fails
          }
        }
        
        // Load from localStorage
        const storedSessions = getStoredSessions()
        setSessions(storedSessions)
        
        const currentId = getStoredCurrentSessionId()
        if (currentId) {
          const session = storedSessions.find(s => s.id === currentId)
          if (session) {
            setCurrentSession(session)
          }
        }
      } finally {
        setIsLoading(false)
      }
    }
    
    loadSessions()
  }, [isAuthenticated])

  // Save sessions to localStorage when they change
  useEffect(() => {
    if (!isLoading) {
      storeSessions(sessions)
    }
  }, [sessions, isLoading])

  const createNewSession = useCallback(() => {
    const newSession: ChatSession = {
      id: generateId(),
      title: 'New Chat',
      updatedAt: new Date(),
      messages: [],
    }
    setSessions(prev => [newSession, ...prev])
    setCurrentSession(newSession)
    storeCurrentSessionId(newSession.id)
    setUploadedFiles([])
  }, [])

  const selectSession = useCallback((sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId)
    if (session) {
      setCurrentSession(session)
      storeCurrentSessionId(sessionId)
      setUploadedFiles([])
    }
  }, [sessions])

  const deleteSession = useCallback((sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId))
    if (currentSession?.id === sessionId) {
      setCurrentSession(null)
      storeCurrentSessionId(null)
    }
  }, [currentSession])

  const renameSession = useCallback((sessionId: string, title: string) => {
    setSessions(prev =>
      prev.map(s =>
        s.id === sessionId ? { ...s, title, updatedAt: new Date() } : s
      )
    )
    if (currentSession?.id === sessionId) {
      setCurrentSession(prev => prev ? { ...prev, title } : null)
    }
  }, [currentSession])

  const sendMessage = useCallback(async (content: string) => {
    if (!currentSession) {
      // Create a new session if none exists
      const newSession: ChatSession = {
        id: generateId(),
        title: content.slice(0, 30) + (content.length > 30 ? '...' : ''),
        updatedAt: new Date(),
        messages: [],
      }
      setSessions(prev => [newSession, ...prev])
      setCurrentSession(newSession)
      storeCurrentSessionId(newSession.id)
    }

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: new Date(),
    }

    // Optimistic update - add user message immediately
    setCurrentSession(prev => {
      if (!prev) return prev
      const updated = {
        ...prev,
        messages: [...prev.messages, userMessage],
        updatedAt: new Date(),
        title: prev.messages.length === 0 
          ? content.slice(0, 30) + (content.length > 30 ? '...' : '')
          : prev.title,
      }
      return updated
    })

    setSessions(prev =>
      prev.map(s =>
        s.id === (currentSession?.id || prev[0]?.id)
          ? {
              ...s,
              messages: [...s.messages, userMessage],
              updatedAt: new Date(),
              title: s.messages.length === 0 
                ? content.slice(0, 30) + (content.length > 30 ? '...' : '')
                : s.title,
            }
          : s
      )
    )

    setIsStreaming(true)

    try {
      let response
      
      // Check if user needs to login for academic queries
      if (!isAuthenticated && isAcademicQuery(content)) {
        response = {
          content: 'To access study material, please login with your college email ID.',
          sources: [],
        }
      } else {
        // Use appropriate endpoint based on auth status
        const sessionId = currentSession?.id || sessions[0]?.id
        if (isAuthenticated) {
          response = await askPrivate(content, sessionId)
        } else {
          response = await askPublic(content, sessionId)
        }
      }

      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: response.content || response.answer || 'I apologize, but I could not generate a response.',
        sources: response.sources,
        confidence: response.confidence,
        timestamp: new Date(),
      }

      setCurrentSession(prev => {
        if (!prev) return prev
        return {
          ...prev,
          messages: [...prev.messages, assistantMessage],
          updatedAt: new Date(),
        }
      })

      setSessions(prev =>
        prev.map(s =>
          s.id === (currentSession?.id || prev[0]?.id)
            ? {
                ...s,
                messages: [...s.messages, assistantMessage],
                updatedAt: new Date(),
              }
            : s
        )
      )
    } catch (error) {
      console.error('Failed to send message:', error)
      const errorMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      }

      setCurrentSession(prev => {
        if (!prev) return prev
        return {
          ...prev,
          messages: [...prev.messages, errorMessage],
        }
      })
    } finally {
      setIsStreaming(false)
    }
  }, [currentSession, isAuthenticated, sessions])

  const addUploadedFile = useCallback((file: UploadedFile) => {
    setUploadedFiles(prev => [...prev, file])
  }, [])

  const removeUploadedFile = useCallback((fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId))
  }, [])

  const clearUploadedFiles = useCallback(() => {
    setUploadedFiles([])
  }, [])

  const searchSessions = useCallback((query: string) => {
    if (!query.trim()) return sessions
    const lowerQuery = query.toLowerCase()
    return sessions.filter(s =>
      s.title.toLowerCase().includes(lowerQuery) ||
      s.messages.some(m => m.content.toLowerCase().includes(lowerQuery))
    )
  }, [sessions])

  const messages = currentSession?.messages || []

  return (
    <ChatContext.Provider
      value={{
        sessions,
        currentSession,
        messages,
        isLoading,
        isStreaming,
        uploadedFiles,
        createNewSession,
        selectSession,
        deleteSession,
        renameSession,
        sendMessage,
        addUploadedFile,
        removeUploadedFile,
        clearUploadedFiles,
        searchSessions,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
}
