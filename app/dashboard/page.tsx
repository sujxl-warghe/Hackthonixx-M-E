'use client'

import Image from 'next/image'
import Link from 'next/link'
import { 
  Code2,
  Cpu,
  TrendingUp,
  Leaf,
  Wifi,
  ArrowLeft,
  Calendar,
  CheckSquare,
  ClipboardList,
  AlertCircle,
  Check,
  Book,
  Flag,
  InfoIcon,
  Search,
  Bell,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import { ChatProvider } from '@/context/ChatContext'
import { useEffect, useState } from 'react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000'

interface Subject {
  id: string
  name: string
  icon: React.ReactNode
  assignments: number
  quizzes: number
  progress: number
  borderColor: string
}

interface EventItem {
  id: string
  title: string
  date: string
  daysRemaining?: number
  type: 'event' | 'quiz' | 'task' | 'assignment'
  priority?: 'High' | 'Medium' | 'Low'
  status?: string
}

interface DashboardData {
  stats: {
    totalSubjects: number
    pendingAssignments: number
    upcomingEvents: number
    completedTasks: number
  }
  subjects: any[]
  upcomingEvents: EventItem[]
  quizzes: EventItem[]
  tasks: EventItem[]
  assignments: EventItem[]
}

const iconMap: { [key: string]: React.ReactNode } = {
  Code2: <Code2 className="h-6 w-6" />,
  Cpu: <Cpu className="h-6 w-6" />,
  TrendingUp: <TrendingUp className="h-6 w-6" />,
  Leaf: <Leaf className="h-6 w-6" />,
  Wifi: <Wifi className="h-6 w-6" />,
}

const colorMap: { [key: string]: string } = {
  java: 'from-yellow-500 to-green-500',
  os: 'from-blue-500 to-cyan-500',
  economics: 'from-purple-500 to-pink-500',
  environmental: 'from-green-500 to-emerald-500',
  iot: 'from-blue-500 to-indigo-500',
}

function DashboardContent() {
  const { user } = useAuth()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${API_BASE_URL}/dashboard/data`)
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data')
        }
        const dashboardData = await response.json()
        setData(dashboardData)
        setError(null)
      } catch (err) {
        console.error('Error fetching dashboard:', err)
        setError(err instanceof Error ? err.message : 'Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || 'Failed to load dashboard'}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    )
  }

  const stats = [
    { label: 'Total Subjects', value: data.stats.totalSubjects, icon: <Book className="h-6 w-6" />, color: 'from-green-500 to-teal-500' },
    { label: 'Pending Assignments', value: data.stats.pendingAssignments, icon: <Flag className="h-6 w-6" />, color: 'from-blue-500 to-cyan-500' },
    { label: 'Upcoming Events', value: data.stats.upcomingEvents, icon: <Calendar className="h-6 w-6" />, color: 'from-purple-500 to-pink-500' },
    { label: 'Completed Tasks', value: data.stats.completedTasks, icon: <Check className="h-6 w-6" />, color: 'from-orange-500 to-yellow-500' },
  ]

  const subjects: Subject[] = data.subjects.map((s: any) => ({
    ...s,
    icon: iconMap[s.icon] || <Code2 className="h-6 w-6" />,
    borderColor: colorMap[s.id] || 'from-blue-500 to-cyan-500',
  }))

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-4 min-w-0">
              <Link href="/chat">
                <Button variant="ghost" size="icon" title="Back to Chat" className="shrink-0">
                  <ArrowLeft className="h-4 md:h-5 w-4 md:w-5" />
                </Button>
              </Link>
              <div className="min-w-0">
                <h1 className="text-xl md:text-2xl font-bold text-foreground truncate">Dashboard</h1>
                <p className="text-xs md:text-sm text-muted-foreground truncate">Welcome back, {user?.name || 'User'}!</p>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-2 shrink-0">
              <Button variant="ghost" size="icon" className="h-9 w-9 md:h-10 md:w-10">
                <Search className="h-4 md:h-5 w-4 md:w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 md:h-10 md:w-10">
                <Bell className="h-4 md:h-5 w-4 md:w-5" />
              </Button>
              <Image
                src="/kdk-logo.png"
                alt="KDK College Logo"
                width={36}
                height={36}
                className="rounded hidden sm:block"
              />
              <Image
                src="/kdk-logo.png"
                alt="KDK College Logo"
                width={32}
                height={32}
                className="rounded sm:hidden"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 md:py-8 relative z-10">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className={`relative p-4 md:p-6 rounded-xl bg-background border-2 border-transparent bg-gradient-to-br from-slate-900 to-slate-800 overflow-hidden group`}
              style={{
                backgroundClip: 'padding-box',
              }}
            >
              <div
                className={`absolute inset-0 rounded-xl bg-gradient-to-br ${stat.color} opacity-30 group-hover:opacity-50 transition-opacity -z-10`}
              />
              <div className="relative flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-muted-foreground text-xs md:text-sm mb-1">{stat.label}</p>
                  <p className="text-2xl md:text-3xl font-bold text-foreground truncate">{stat.value}</p>
                </div>
                <div className={`text-primary p-2 rounded-lg bg-gradient-to-br ${stat.color} bg-opacity-20 shrink-0`}>
                  <div className="w-5 h-5 md:w-6 md:h-6 flex items-center justify-center">
                    {stat.icon}
                  </div>
                </div>
              </div>
              <div className={`absolute top-0 left-0 h-1 bg-gradient-to-r ${stat.color}`} />
            </div>
          ))}
        </div>

        {/* Subjects Section */}
        <section className="mb-6 md:mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-foreground mb-3 md:mb-4">Subjects</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-4">
            {subjects.map((subject) => (
              <Link key={subject.id} href={`/chat?subject=${subject.id}`}>
                <div
                  className={`relative p-4 md:p-6 rounded-xl bg-background border-2 border-transparent cursor-pointer hover:shadow-lg transition-all group overflow-hidden`}
                  style={{
                    backgroundClip: 'padding-box',
                  }}
                >
                  <div
                    className={`absolute inset-0 rounded-xl bg-gradient-to-br ${subject.borderColor} opacity-30 group-hover:opacity-50 transition-opacity -z-10`}
                  />
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-3 md:mb-4">
                      <div className={`text-primary text-lg md:text-xl`}>
                        {subject.icon}
                      </div>
                      <h3 className="font-semibold text-foreground text-xs md:text-sm line-clamp-2">{subject.name}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3 md:mb-4 line-clamp-1">
                      {subject.assignments} Assignments · {subject.quizzes} Quiz{subject.quizzes !== 1 ? 'zes' : ''}
                    </p>
                  </div>
                  <div className={`absolute top-0 left-0 h-1 bg-gradient-to-r ${subject.borderColor}`} />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Events and Tasks Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
          {/* Upcoming Events */}
          <section>
            <div className="flex items-center gap-2 mb-3 md:mb-4">
              <CheckSquare className="h-4 md:h-5 w-4 md:w-5 text-primary" />
              <h2 className="text-lg md:text-xl font-semibold text-foreground">Upcoming Events</h2>
            </div>
            <div className="space-y-2 md:space-y-3">
              {data.upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="relative p-3 md:p-4 rounded-xl bg-background border border-border hover:border-primary/50 transition-colors group overflow-hidden"
                >
                  <div className="absolute top-0 left-0 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 opacity-50" />
                  <div className="relative flex items-start justify-between gap-2 md:gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm md:text-base truncate">{event.title}</p>
                      <p className="text-xs md:text-sm text-muted-foreground truncate">{event.date}</p>
                    </div>
                    {event.daysRemaining !== undefined && (
                      <div className="bg-gradient-to-br from-red-500 to-pink-500 bg-opacity-20 border border-red-500/50 rounded-lg px-2 md:px-3 py-1 md:py-2 text-center shrink-0">
                        <p className="text-xs text-red-400 font-medium hidden sm:block">In {event.daysRemaining} days</p>
                        <p className="text-lg md:text-xl font-bold text-red-400">{event.daysRemaining}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Tasks */}
          <section>
            <div className="flex items-center gap-2 mb-3 md:mb-4">
              <ClipboardList className="h-4 md:h-5 w-4 md:w-5 text-primary" />
              <h2 className="text-lg md:text-xl font-semibold text-foreground">Tasks</h2>
            </div>
            <div className="space-y-2 md:space-y-3">
              {data.tasks.map((task) => (
                <div
                  key={task.id}
                  className="relative p-3 md:p-4 rounded-xl bg-background border border-border hover:border-primary/50 transition-colors group overflow-hidden"
                >
                  <div className="absolute top-0 left-0 h-1 bg-gradient-to-r from-green-500 to-teal-500 opacity-50" />
                  <div className="relative flex items-start justify-between gap-2 md:gap-4">
                    <div className="flex items-start gap-2 md:gap-3 flex-1 min-w-0">
                      <Check className="h-4 md:h-5 w-4 md:w-5 text-green-500 mt-0.5 shrink-0" />
                      <div className="min-w-0">
                        <p className="font-medium text-foreground text-sm md:text-base truncate">{task.title}</p>
                        {task.priority && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                            {task.priority} Priority
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      {task.status === 'Today' ? (
                        <p className="text-xs text-green-400 font-medium flex items-center gap-1 whitespace-nowrap">
                          {task.status}
                          <Check className="h-3 w-3" />
                        </p>
                      ) : (
                        <p className="text-xs text-muted-foreground flex items-center gap-1 whitespace-nowrap">
                          {task.status}
                          <Calendar className="h-3 w-3" />
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Quizzes and Assignments Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Quizzes */}
          <section>
            <div className="flex items-center gap-2 mb-3 md:mb-4">
              <CheckSquare className="h-4 md:h-5 w-4 md:w-5 text-primary" />
              <h2 className="text-lg md:text-xl font-semibold text-foreground">Quizzes</h2>
            </div>
            <div className="space-y-2 md:space-y-3">
              {data.quizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="relative p-3 md:p-4 rounded-xl bg-background border border-border hover:border-primary/50 transition-colors group overflow-hidden"
                >
                  <div className="absolute top-0 left-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 opacity-50" />
                  <div className="relative flex items-start gap-2 md:gap-3">
                    <Book className="h-4 md:h-5 w-4 md:w-5 text-primary mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium text-foreground text-sm md:text-base truncate">{quiz.title}</p>
                      {quiz.priority && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                          {quiz.priority} Priority
                        </p>
                      )}
                      {quiz.date && (
                        <p className="text-xs text-green-400 font-medium mt-1">{quiz.date}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Upcoming Assignments */}
          <section>
            <div className="flex items-center gap-2 mb-3 md:mb-4">
              <AlertCircle className="h-4 md:h-5 w-4 md:w-5 text-primary" />
              <h2 className="text-lg md:text-xl font-semibold text-foreground">Upcoming Assignments</h2>
            </div>
            <div className="space-y-2 md:space-y-3">
              {data.assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="relative p-3 md:p-4 rounded-xl bg-background border border-border hover:border-primary/50 transition-colors group overflow-hidden"
                >
                  <div className="absolute top-0 left-0 h-1 bg-gradient-to-r from-pink-500 to-red-500 opacity-50" />
                  <div className="relative flex items-start justify-between gap-2 md:gap-4">
                    <div className="flex items-start gap-2 md:gap-3 flex-1 min-w-0">
                      <Check className="h-4 md:h-5 w-4 md:w-5 text-primary mt-0.5 shrink-0" />
                      <div className="min-w-0">
                        <p className="font-medium text-foreground text-sm md:text-base truncate">{assignment.title}</p>
                        <p className="text-xs text-muted-foreground mt-1 truncate">{assignment.date}</p>
                      </div>
                    </div>
                    <InfoIcon className="h-4 md:h-5 w-4 md:w-5 text-muted-foreground shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <AuthProvider>
      <ChatProvider>
        <DashboardContent />
      </ChatProvider>
    </AuthProvider>
  )
}

