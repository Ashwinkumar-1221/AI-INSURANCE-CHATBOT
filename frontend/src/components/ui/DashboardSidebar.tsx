import { useLocation, Link, useNavigate } from 'react-router-dom'
import { Home, Cpu, ShieldCheck, FileText, Bell, User, Settings, Shield, LogOut, X } from 'lucide-react'

interface DashboardSidebarProps {
  open: boolean
  onClose: () => void
}

const navItems = [
  { label: 'Dashboard', to: '/dashboard', icon: Home },
  { label: 'AI Assistant', to: '/chat', icon: Cpu },
  { label: 'Policy Recommendation', to: '/recommendation', icon: ShieldCheck },
  { label: 'Claims', to: '/claims', icon: FileText },
  { label: 'Notifications', to: '/notifications', icon: Bell },
  { label: 'Profile', to: '/profile', icon: User },
  { label: 'Settings', to: '/settings', icon: Settings },
  { label: 'Admin', to: '/admin', icon: Shield },
]

export default function DashboardSidebar({ open, onClose }: DashboardSidebarProps) {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <>
      <div className={`fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xl transition-opacity lg:hidden ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-80 transform bg-slate-950/95 border-r border-white/10 shadow-2xl shadow-slate-950/30 backdrop-blur-3xl transition-transform lg:fixed lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex h-full flex-col p-6">
          <div className="mb-10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 rounded-3xl bg-slate-900/80 px-4 py-3 shadow-inner shadow-slate-950/20">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-violet-500 text-white">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-lg font-semibold text-white">AI Insurance</p>
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Dashboard</p>
              </div>
            </div>
            <button type="button" className="lg:hidden text-slate-400 transition hover:text-white" onClick={onClose}>
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav className="flex-1 space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.to
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`group flex items-center gap-4 rounded-3xl px-4 py-3 text-sm font-semibold transition ${isActive ? 'bg-slate-900/90 text-white shadow-xl shadow-slate-950/20' : 'text-slate-300 hover:bg-slate-900/70 hover:text-white'}`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="mt-6 rounded-[28px] border border-white/10 bg-slate-900/70 p-4 text-sm text-slate-300 shadow-inner shadow-slate-950/20">
            <p className="font-semibold text-slate-100">Need help?</p>
            <p className="mt-2 leading-6 text-slate-400">Use the AI Assistant or reach out to your account manager for tailored policy guidance.</p>
          </div>

          <button type="button" onClick={() => navigate('/login')} className="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-slate-900/80 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-sky-500/20 hover:text-white">
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}
