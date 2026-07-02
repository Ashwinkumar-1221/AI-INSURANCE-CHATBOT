import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  BellRing,
  Bot,
  CheckCheck,
  CreditCard,
  FileText,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from 'lucide-react'
import DashboardSidebar from '../components/ui/DashboardSidebar'
import DashboardTopbar from '../components/ui/DashboardTopbar'

interface NotificationItem {
  id: number
  type: 'All' | 'Claims' | 'Policies' | 'Payments' | 'AI'
  title: string
  description: string
  timestamp: string
  unread: boolean
  icon: typeof BellRing
}

const initialNotifications: NotificationItem[] = [
  {
    id: 1,
    type: 'Claims',
    title: 'Claim under review',
    description: 'Your vehicle claim is now being verified by the underwriting team.',
    timestamp: '10 min ago',
    unread: true,
    icon: FileText,
  },
  {
    id: 2,
    type: 'Policies',
    title: 'Policy renewal reminder',
    description: 'Your health policy renews in 3 days. Review your benefits before renewing.',
    timestamp: '1 hour ago',
    unread: true,
    icon: ShieldCheck,
  },
  {
    id: 3,
    type: 'Payments',
    title: 'Payment received',
    description: 'Your premium payment for Home Secure was successful and documented.',
    timestamp: '3 hours ago',
    unread: false,
    icon: CreditCard,
  },
  {
    id: 4,
    type: 'AI',
    title: 'AI recommendation ready',
    description: 'A new insurance recommendation based on your profile is available.',
    timestamp: 'Yesterday',
    unread: true,
    icon: Bot,
  },
  {
    id: 5,
    type: 'Policies',
    title: 'Coverage upgrade available',
    description: 'You may be eligible for enhanced family protection with additional wellness benefits.',
    timestamp: 'Yesterday',
    unread: false,
    icon: TrendingUp,
  },
]

const tabs: Array<'All' | 'Claims' | 'Policies' | 'Payments' | 'AI'> = ['All', 'Claims', 'Policies', 'Payments', 'AI']

export default function NotificationsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'All' | 'Claims' | 'Policies' | 'Payments' | 'AI'>('All')
  const [notifications, setNotifications] = useState(initialNotifications)

  const filteredNotifications = useMemo(() => {
    if (activeTab === 'All') {
      return notifications
    }

    return notifications.filter((item) => item.type === activeTab)
  }, [activeTab, notifications])

  const unreadCount = notifications.filter((item) => item.unread).length

  const markAsRead = (id: number) => {
    setNotifications((current) => current.map((item) => (item.id === id ? { ...item, unread: false } : item)))
  }

  const markAllAsRead = () => {
    setNotifications((current) => current.map((item) => ({ ...item, unread: false })))
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <DashboardSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 lg:ml-80">
        <main className="w-full px-4 pb-8 pt-4 sm:px-6 lg:px-8 lg:pb-10 lg:pt-6">
          <DashboardTopbar onMenuClick={() => setSidebarOpen(true)} />

          <div className="mt-6 rounded-[32px] border border-white/10 bg-slate-950/80 p-4 shadow-2xl shadow-slate-950/30 backdrop-blur-2xl sm:p-6 lg:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-500/10 px-3 py-1 text-sm text-sky-200">
                  <BellRing className="h-4 w-4" />
                  Notification center
                </div>
                <h1 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">Stay updated in real time</h1>
                <p className="mt-3 text-sm leading-7 text-slate-300 sm:text-base">
                  Review claim updates, policy reminders, payment confirmations, and AI suggestions from one polished workspace.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button type="button" onClick={markAllAsRead} className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-slate-900/80 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:border-sky-400/20 hover:text-white">
                  <CheckCheck className="h-4 w-4" />
                  Mark All as Read
                </button>
              </div>
            </div>

            <div className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-6">
                <div className="flex flex-wrap gap-2 rounded-[24px] border border-white/10 bg-slate-900/70 p-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeTab === tab ? 'bg-gradient-to-r from-sky-500 to-violet-500 text-white shadow-lg shadow-sky-500/20' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="space-y-3">
                  {filteredNotifications.map((item) => {
                    const Icon = item.icon
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`rounded-[24px] border p-4 shadow-lg transition ${item.unread ? 'border-sky-400/20 bg-slate-900/90' : 'border-white/10 bg-slate-900/70'}`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex gap-3">
                            <div className="mt-0.5 flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950/80 text-sky-300">
                              <Icon className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-base font-semibold text-white">{item.title}</p>
                                {item.unread ? <span className="h-2.5 w-2.5 rounded-full bg-sky-400" /> : null}
                              </div>
                              <p className="mt-2 text-sm leading-7 text-slate-400">{item.description}</p>
                              <div className="mt-3 flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-slate-500">
                                <span>{item.timestamp}</span>
                                <span>•</span>
                                <span>{item.type}</span>
                              </div>
                            </div>
                          </div>

                          <button type="button" onClick={() => markAsRead(item.id)} className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:border-sky-400/20 hover:text-white">
                            {item.unread ? 'Mark Read' : 'Read'}
                          </button>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-[28px] border border-white/10 bg-slate-900/80 p-5 shadow-inner shadow-slate-950/20">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500/20 to-violet-500/20 text-sky-300">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Summary</p>
                      <p className="text-sm text-slate-400">Your current inbox status</p>
                    </div>
                  </div>

                  <div className="mt-5 rounded-[24px] border border-white/10 bg-slate-950/70 p-4">
                    <p className="text-sm text-slate-400">Unread notifications</p>
                    <p className="mt-2 text-3xl font-semibold text-white">{unreadCount}</p>
                    <p className="mt-2 text-sm text-slate-400">Keep your policy timeline and claims updates front and center.</p>
                  </div>
                </div>

                <div className="rounded-[28px] border border-white/10 bg-slate-900/80 p-5 shadow-inner shadow-slate-950/20">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-sky-500/20 text-violet-200">
                      <BellRing className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Notification preferences</p>
                      <p className="text-sm text-slate-400">Choose what matters most</p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3 text-sm text-slate-300">
                    {['Claims updates', 'Policy renewals', 'Payment confirmations', 'AI recommendations'].map((item) => (
                      <div key={item} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3">
                        <span>{item}</span>
                        <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300">Enabled</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
