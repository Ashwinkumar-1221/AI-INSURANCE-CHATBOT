import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface AuthLayoutProps {
  title: string
  children: ReactNode
  actionLink: { href: string; label: string }
}

export default function AuthLayout({ title, children, actionLink }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 xl:grid-cols-[1.05fr_0.95fr] xl:gap-12">
        <div className="premium-card rounded-[32px] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/40 backdrop-blur-3xl sm:p-10 lg:p-14">
          <div className="mb-8 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-sky-300/80">{title}</p>
              <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">{title}</h1>
            </div>
            <Link
              to="/"
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-slate-200/30 hover:bg-white/10"
            >
              Back to Home
            </Link>
          </div>
          {children}
          <div className="mt-8 border-t border-white/10 pt-6 text-sm text-slate-400">
            {actionLink.label}{' '}
            <Link to={actionLink.href} className="font-semibold text-slate-100 transition hover:text-white">
              {actionLink.href === '/register' ? 'Register' : 'Login'}
            </Link>
          </div>
        </div>

        <div className="premium-card relative hidden overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-slate-950/60 via-slate-900/70 to-slate-950/60 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur-3xl lg:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(139,92,246,0.18),transparent_22%)]" />
          <div className="relative z-10 flex h-full flex-col justify-between gap-8">
            <div className="space-y-6">
              <div className="rounded-[28px] border border-white/10 bg-slate-950/70 p-5 shadow-lg shadow-slate-950/20 backdrop-blur-xl">
                <p className="text-sm uppercase tracking-[0.28em] text-sky-300/80">AI Shield</p>
                <p className="mt-3 text-lg font-semibold text-white">Secure policy decisions with intelligent protection.</p>
              </div>
              <div className="rounded-[28px] border border-white/10 bg-slate-950/70 p-5 shadow-lg shadow-slate-950/20 backdrop-blur-xl">
                <p className="text-sm uppercase tracking-[0.28em] text-violet-300/80">Claims</p>
                <p className="mt-3 text-lg font-semibold text-white">Streamlined claims flow, powered by AI validation.</p>
              </div>
            </div>
            <div className="grid gap-5">
              <div className="rounded-[28px] border border-white/10 bg-slate-950/80 p-5 shadow-lg shadow-slate-950/20 backdrop-blur-xl">
                <p className="text-sm uppercase tracking-[0.28em] text-sky-300/80">Policy Analytics</p>
                <p className="mt-3 text-lg font-semibold text-white">Smart recommendations based on your risk profile.</p>
              </div>
              <div className="rounded-[28px] border border-white/10 bg-slate-950/80 p-5 shadow-lg shadow-slate-950/20 backdrop-blur-xl">
                <p className="text-sm uppercase tracking-[0.28em] text-slate-400/80">Voice Assistant</p>
                <p className="mt-3 text-lg font-semibold text-white">Talk to AI and get personalized insurance advice instantly.</p>
              </div>
            </div>
          </div>
          <div className="pointer-events-none absolute -right-16 top-1/4 h-80 w-80 rounded-full bg-sky-500/10 blur-3xl" />
          <div className="pointer-events-none absolute bottom-8 left-10 h-44 w-44 rounded-full bg-violet-500/10 blur-3xl" />
        </div>
      </div>
    </div>
  )
}
