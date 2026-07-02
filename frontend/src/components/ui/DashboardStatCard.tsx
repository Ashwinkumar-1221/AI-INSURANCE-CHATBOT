import type{ LucideIcon } from 'lucide-react'

interface DashboardStatCardProps {
  title: string
  value: string
  detail: string
  icon: LucideIcon
  accent: 'sky' | 'violet' | 'emerald' | 'fuchsia'
}

const accentClasses = {
  sky: 'from-sky-500/20 to-sky-500/10 text-sky-300',
  violet: 'from-violet-500/20 to-violet-500/10 text-violet-300',
  emerald: 'from-emerald-500/20 to-emerald-500/10 text-emerald-300',
  fuchsia: 'from-fuchsia-500/20 to-fuchsia-500/10 text-fuchsia-300',
}

export default function DashboardStatCard({ title, value, detail, icon: Icon, accent }: DashboardStatCardProps) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-slate-950/80 p-6 shadow-xl shadow-slate-950/20 backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-slate-950/30">
      <div className={`inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br ${accentClasses[accent]}`}>
        <Icon className="h-6 w-6" />
      </div>
      <p className="mt-6 text-sm uppercase tracking-[0.24em] text-slate-400">{title}</p>
      <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
      <p className="mt-3 text-sm text-slate-400">{detail}</p>
    </div>
  )
}
