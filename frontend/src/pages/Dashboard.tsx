import { useState } from 'react'
import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { ArrowRight, MessageSquare, FileCheck2, ShieldCheck, Sparkles, BarChart3, MessageCircle, Bell } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DashboardSidebar from '../components/ui/DashboardSidebar'
import DashboardTopbar from '../components/ui/DashboardTopbar'
import DashboardStatCard from '../components/ui/DashboardStatCard'

interface ActionItem {
  title: string
  icon: LucideIcon
  accent: 'sky' | 'violet' | 'emerald' | 'fuchsia'
  route: string
}

interface StatItem {
  title: string
  value: string
  detail: string
  icon: LucideIcon
  accent: 'sky' | 'violet' | 'emerald' | 'fuchsia'
}

interface ActivityItem {
  title: string
  detail: string
  time: string
  icon: LucideIcon
}

const actions: ActionItem[] = [
  { title: 'Start AI Chat', icon: MessageSquare, accent: 'sky', route: '/chat' },
  { title: 'Recommend Policy', icon: ShieldCheck, accent: 'violet', route: '/recommendation' },
  { title: 'File a Claim', icon: FileCheck2, accent: 'emerald', route: '/claims' },
  { title: 'Renew Policy', icon: ArrowRight, accent: 'fuchsia', route: '/recommendation' },
]

const quickStats: StatItem[] = [
  { title: 'Policies', value: '2,842', detail: 'Active policies in portfolio', icon: Sparkles, accent: 'sky' },
  { title: 'Claims', value: '128', detail: 'Open claims this month', icon: FileCheck2, accent: 'violet' },
  { title: 'Recommendations', value: '1,224', detail: 'AI suggestions ready', icon: BarChart3, accent: 'emerald' },
  { title: 'Notifications', value: '24', detail: 'Unread alerts', icon: Bell, accent: 'fuchsia' },
]

const recentItems: ActivityItem[] = [
  { title: 'Policy recommendation generated', detail: 'Health Plus plan matched with risk profile', time: '2h ago', icon: Sparkles },
  { title: 'Claim opened for vehicle damage', detail: 'Submitted documents pending review', time: '5h ago', icon: FileCheck2 },
  { title: 'System notification', detail: 'New underwriting update released', time: 'Yesterday', icon: Bell },
]

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      <DashboardSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 lg:ml-80">
       <main className="w-full px-6 pb-10 pt-6 sm:px-8">
          <DashboardTopbar onMenuClick={() => setSidebarOpen(true)} />

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.55fr_0.95fr]">
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="rounded-[32px] border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-xl"
              >
                <div className="flex flex-col gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.32em] text-sky-300/80">Welcome back</p>
                    <h1 className="mt-4 text-4xl font-semibold text-white">Welcome back</h1>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                      Today's AI status is ready. Review policy recommendations, manage claims, and keep workflows moving with the assistant.
                    </p>
                  </div>
                  <div className="rounded-[28px] border border-white/10 bg-slate-900/80 p-5 text-slate-200 shadow-inner shadow-slate-950/10">
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Today's AI Status</p>
                    <p className="mt-3 text-lg font-semibold text-white">Idle</p>
                  </div>
                </div>
              </motion.div>

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                {actions.map((action) => (
                  <motion.button
                    key={action.title}
                    type="button"
                    whileHover={{ y: -4 }}
                    onClick={() => navigate(action.route)}
                    className="group rounded-[28px] border border-white/10 bg-slate-950/80 p-5 text-left shadow-xl shadow-slate-950/20 transition hover:border-sky-500/20 hover:bg-slate-900/80"
                  >
                    <div
                      className={`inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br ${action.accent === 'sky' ? 'from-sky-500/20 to-sky-500/10 text-sky-300' : action.accent === 'violet' ? 'from-violet-500/20 to-violet-500/10 text-violet-300' : action.accent === 'emerald' ? 'from-emerald-500/20 to-emerald-500/10 text-emerald-300' : 'from-fuchsia-500/20 to-fuchsia-500/10 text-fuchsia-300'}`}
                    >
                      <action.icon className="h-6 w-6" />
                    </div>
                    <p className="mt-4 text-lg font-semibold text-white">{action.title}</p>
                  </motion.button>
                ))}
              </div>

              <div className="grid gap-6 xl:grid-cols-2">
                {quickStats.map((stat) => (
                  <DashboardStatCard key={stat.title} title={stat.title} value={stat.value} detail={stat.detail} icon={stat.icon} accent={stat.accent} />
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.05 }}
                className="rounded-[32px] border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-xl"
              >
                <div className="flex flex-col gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.32em] text-sky-300/80">Recent Activity</p>
                    <h2 className="mt-4 text-2xl font-semibold text-white">Latest recommendations</h2>
                  </div>
                  <div className="space-y-4">
                    {recentItems.map((item) => (
                      <div key={item.title} className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 text-slate-300 shadow-inner shadow-slate-950/10">
                        <div className="flex justify-between gap-4">
                          <div>
                            <p className="text-base font-semibold text-white">{item.title}</p>
                            <p className="mt-2 text-sm leading-6 text-slate-400">{item.detail}</p>
                          </div>
                          <div className="inline-flex h-10 w-10 items-center justify-center rounded-3xl bg-slate-950/80 text-sky-300">
                            <item.icon className="h-5 w-5" />
                          </div>
                        </div>
                        <p className="mt-4 text-sm text-slate-500">{item.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45, delay: 0.1 }}
                className="rounded-[32px] border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-xl"
              >
                <div className="flex justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.32em] text-sky-300/80">AI Assistant</p>
                    <h2 className="mt-4 text-2xl font-semibold text-white">Idle</h2>
                  </div>
                  <div className="rounded-full border border-white/10 bg-slate-900/80 px-4 py-2 text-sm text-slate-200">Live</div>
                </div>
                <div className="mt-8 rounded-[28px] border border-white/10 bg-slate-900/80 p-8 text-center shadow-inner shadow-slate-950/10">
                  <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-violet-500 text-white shadow-2xl shadow-sky-500/20">
                    <ShieldCheck className="h-12 w-12" />
                  </div>
                  <p className="text-lg font-semibold text-white">AI Assistant Idle</p>
                  <p className="mt-3 text-sm leading-6 text-slate-400">Ready to analyze policy data, answer customer questions, and help deliver perfect recommendations.</p>
                </div>
                <button type="button" onClick={() => navigate('/chat')} className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-violet-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 transition hover:brightness-105">
                  <MessageCircle className="h-5 w-5" />
                  Start Conversation
                </button>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
