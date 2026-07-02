import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Activity,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  FileCheck2,
  ShieldCheck,
  Sparkles,
  Users,
  Wallet,
} from 'lucide-react'
import DashboardSidebar from '../components/ui/DashboardSidebar'
import DashboardTopbar from '../components/ui/DashboardTopbar'

const kpis = [
  { title: 'Total Users', value: '24.8K', detail: '+12.4% this month', icon: Users },
  { title: 'Active Policies', value: '8,320', detail: '+4.8% weekly growth', icon: ShieldCheck },
  { title: 'Claims', value: '1,246', detail: '89 pending approvals', icon: FileCheck2 },
  { title: 'Revenue', value: '₹48.2M', detail: '+9.1% QoQ', icon: Wallet },
]

const recentUsers = [
  { name: 'Aarav Singh', email: 'aarav@insure.com', plan: 'Premium' },
  { name: 'Neha Rao', email: 'neha@insure.com', plan: 'Family' },
  { name: 'Rohan Verma', email: 'rohan@insure.com', plan: 'Enterprise' },
]

const approvalQueue = [
  { id: 'CLM-1074', policy: 'Health Shield', amount: '₹82k', priority: 'High' },
  { id: 'CLM-1071', policy: 'Vehicle Secure', amount: '₹41k', priority: 'Medium' },
  { id: 'CLM-1068', policy: 'Home Guard', amount: '₹28k', priority: 'Low' },
]

const policies = [
  { name: 'Aurelia Health Shield', type: 'Health', status: 'Live' },
  { name: 'DriveShield Plus', type: 'Vehicle', status: 'Live' },
  { name: 'Harbor Home Secure', type: 'Home', status: 'Review' },
]

const activity = [
  { title: 'New policy launched', detail: 'Family Plus package became available.', time: '10 min ago' },
  { title: 'AI model tuned', detail: 'Recommendation accuracy improved by 3.2%.', time: '42 min ago' },
  { title: 'Claim queue updated', detail: 'Three high-priority claims moved to review.', time: '1 hr ago' },
]

export default function AdminPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()

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
                  <Sparkles className="h-4 w-4" />
                  Admin console
                </div>
                <h1 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">Operations overview</h1>
                <p className="mt-3 text-sm leading-7 text-slate-300 sm:text-base">
                  Monitor users, claims, policies, financial health, and AI performance from one premium control center.
                </p>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-slate-900/80 px-4 py-4 text-sm text-slate-300 shadow-inner shadow-slate-950/20">
                <div className="flex items-center gap-2 text-sky-200">
                  <Activity className="h-4 w-4" />
                  <span className="font-semibold text-white">System status</span>
                </div>
                <p className="mt-2 text-slate-400">All services operating normally</p>
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {kpis.map((kpi) => {
                const Icon = kpi.icon
                return (
                  <motion.div key={kpi.title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[24px] border border-white/10 bg-slate-900/80 p-5 shadow-inner shadow-slate-950/20">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm text-slate-400">{kpi.title}</p>
                        <p className="mt-3 text-2xl font-semibold text-white">{kpi.value}</p>
                      </div>
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500/20 to-violet-500/20 text-sky-300">
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>
                    <p className="mt-4 text-sm text-slate-400">{kpi.detail}</p>
                  </motion.div>
                )
              })}
            </div>

            <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-6">
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[28px] border border-white/10 bg-slate-900/80 p-5 shadow-inner shadow-slate-950/20">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">Performance overview</p>
                      <p className="mt-1 text-sm text-slate-400">Charts placeholder</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-3 text-sky-300">
                      <BarChart3 className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="mt-5 h-56 rounded-[24px] border border-dashed border-white/10 bg-slate-950/70 p-4">
                    <div className="flex h-full items-end justify-between gap-2">
                      {[40, 70, 55, 85, 75, 95, 88].map((height, index) => (
                        <div key={index} className="flex-1 rounded-t-2xl bg-gradient-to-t from-sky-500 to-violet-500" style={{ height: `${height}%` }} />
                      ))}
                    </div>
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="rounded-[28px] border border-white/10 bg-slate-900/80 p-5 shadow-inner shadow-slate-950/20">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">Recent users</p>
                      <p className="mt-1 text-sm text-slate-400">Latest account signups</p>
                    </div>
                    <button type="button" onClick={() => navigate('/profile')} className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:border-sky-400/20 hover:text-white">
                      View All
                    </button>
                  </div>

                  <div className="mt-4 space-y-3">
                    {recentUsers.map((user) => (
                      <div key={user.email} className="flex items-center justify-between rounded-[22px] border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-300">
                        <div>
                          <p className="font-semibold text-white">{user.name}</p>
                          <p className="mt-1 text-slate-400">{user.email}</p>
                        </div>
                        <span className="rounded-full bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-200">{user.plan}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="rounded-[28px] border border-white/10 bg-slate-900/80 p-5 shadow-inner shadow-slate-950/20">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">Policy management</p>
                      <p className="mt-1 text-sm text-slate-400">Live and review policies</p>
                    </div>
                    <button type="button" onClick={() => navigate('/recommendation')} className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:border-sky-400/20 hover:text-white">
                      Manage
                    </button>
                  </div>
                  <div className="mt-4 overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                      <thead className="text-slate-400">
                        <tr>
                          <th className="px-2 py-2 font-medium">Policy</th>
                          <th className="px-2 py-2 font-medium">Type</th>
                          <th className="px-2 py-2 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {policies.map((policy) => (
                          <tr key={policy.name} className="border-t border-white/10">
                            <td className="px-2 py-3 font-semibold text-white">{policy.name}</td>
                            <td className="px-2 py-3 text-slate-300">{policy.type}</td>
                            <td className="px-2 py-3">
                              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${policy.status === 'Live' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-violet-500/15 text-violet-300'}`}>{policy.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              </div>

              <div className="space-y-6">
                <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} className="rounded-[28px] border border-white/10 bg-slate-900/80 p-5 shadow-inner shadow-slate-950/20">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500/20 to-violet-500/20 text-sky-300">
                      <FileCheck2 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Claims approval queue</p>
                      <p className="text-sm text-slate-400">Pending review</p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-3">
                    {approvalQueue.map((claim) => (
                      <div key={claim.id} className="rounded-[22px] border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-300">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="font-semibold text-white">{claim.id}</p>
                            <p className="mt-1 text-slate-400">{claim.policy}</p>
                          </div>
                          <span className="rounded-full bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-200">{claim.priority}</span>
                        </div>
                        <div className="mt-3 flex items-center justify-between text-sm">
                          <span>{claim.amount}</span>
                          <button type="button" onClick={() => navigate('/claims')} className="inline-flex items-center gap-1 text-sky-200 transition hover:text-white">
                            Review <ArrowRight className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 }} className="rounded-[28px] border border-white/10 bg-slate-900/80 p-5 shadow-inner shadow-slate-950/20">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-sky-500/20 text-violet-200">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">AI analytics summary</p>
                      <p className="text-sm text-slate-400">Model insights</p>
                    </div>
                  </div>
                  <div className="mt-4 rounded-[24px] border border-white/10 bg-slate-950/70 p-4 text-sm leading-7 text-slate-300">
                    Recommendation accuracy increased by 3.2% this week. The assistant is delivering stronger family coverage suggestions and faster claim triage.
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 }} className="rounded-[28px] border border-white/10 bg-slate-900/80 p-5 shadow-inner shadow-slate-950/20">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500/20 to-violet-500/20 text-sky-300">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Quick admin actions</p>
                      <p className="text-sm text-slate-400">Operational shortcuts</p>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-3">
                    {[
                      { label: 'Publish policy update', route: '/recommendation' },
                      { label: 'Approve pending claims', route: '/claims' },
                      { label: 'Sync AI recommendations', route: '/chat' },
                      { label: 'Download audit report', route: '/admin' },
                    ].map((action) => (
                      <button key={action.label} type="button" onClick={() => navigate(action.route)} className="flex items-center justify-between rounded-[22px] border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-200 transition hover:border-sky-400/20 hover:text-white">
                        <span>{action.label}</span>
                        <ArrowRight className="h-4 w-4 text-slate-500" />
                      </button>
                    ))}
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="rounded-[28px] border border-white/10 bg-slate-900/80 p-5 shadow-inner shadow-slate-950/20">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-sky-500/20 text-violet-200">
                      <Activity className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Recent system activity</p>
                      <p className="text-sm text-slate-400">Updates across the platform</p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-3">
                    {activity.map((item) => (
                      <div key={item.title} className="rounded-[22px] border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-300">
                        <p className="font-semibold text-white">{item.title}</p>
                        <p className="mt-2 leading-6 text-slate-400">{item.detail}</p>
                        <p className="mt-3 text-xs uppercase tracking-[0.24em] text-slate-500">{item.time}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
