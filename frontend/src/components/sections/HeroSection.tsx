import { motion } from 'framer-motion'
import { MessageCircle, Mic2, ShieldCheck, Sparkles, Shield, Lock, Clock3 } from 'lucide-react'

const stats = [
  { label: '95% Recommendation Accuracy', icon: Sparkles },
  { label: '24/7 AI Assistance', icon: Clock3 },
  { label: 'Voice Enabled', icon: Mic2 },
  { label: 'Secure Authentication', icon: Lock },
]

export default function HeroSection() {
  return (
    <section id="home" className="relative overflow-hidden px-6 pt-10 pb-24 lg:px-8">
      <div className="absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.18),transparent_42%),radial-gradient(circle_at_20%_10%,rgba(139,92,246,0.14),transparent_28%)]" />
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
        <div className="relative z-10 flex flex-col justify-center gap-8 pt-10 lg:pt-20">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-sky-400/20 bg-slate-950/70 px-4 py-2 text-sm text-sky-300 shadow-lg shadow-sky-500/10 backdrop-blur-xl">
            <ShieldCheck className="h-4 w-4" />
            Enterprise AI for smarter insurance decisions
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <h1 className="max-w-3xl bg-gradient-to-r from-white via-sky-100 to-slate-300 bg-clip-text text-4xl font-semibold leading-tight text-transparent sm:text-5xl xl:text-6xl">
              AI-Powered Insurance Policy Recommendation Assistant
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
              Helping users discover the best insurance policies using Artificial Intelligence, voice interaction, personalized recommendations, and secure claim assistance.
            </p>
          </motion.div>

          <motion.div
            className="flex flex-col gap-4 sm:flex-row"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.1 }}
          >
            <a
              href="#features"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-violet-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:scale-[1.02]"
            >
              Try AI Assistant
            </a>
            <a
              href="#architecture"
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-slate-200/30 hover:bg-white/10"
            >
              Explore Features
            </a>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  whileHover={{ y: -4 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 18 }}
                  className="group rounded-3xl border border-white/10 bg-slate-950/80 p-5 shadow-xl shadow-slate-950/30 backdrop-blur-xl"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900/80 text-sky-300 transition group-hover:bg-sky-500/15">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="mt-4 text-sm font-semibold text-white">{stat.label}</p>
                </motion.div>
              )
            })}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="premium-card relative overflow-hidden rounded-[32px] border border-white/10 bg-slate-950/80 p-4 shadow-2xl shadow-slate-950/40 backdrop-blur-xl sm:p-6"
        >
          <div className="absolute -left-10 top-16 h-32 w-32 rounded-full bg-sky-500/10 blur-3xl" />
          <div className="absolute right-0 top-10 h-24 w-24 rounded-full bg-violet-500/10 blur-3xl" />
          <div className="relative grid gap-6 rounded-[28px] border border-white/10 bg-slate-900/80 p-6 shadow-inner shadow-slate-950/30">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">AI Assistant</p>
                <h2 className="mt-4 text-2xl font-semibold text-white">Insurance guidance, faster.</h2>
              </div>
              <div className="voice-orb flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-sky-500/20 to-violet-500/20 text-sky-200">
                <Shield className="h-7 w-7" />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-slate-950/90 p-4">
                <p className="text-sm text-slate-400">Policy Score</p>
                <p className="mt-3 text-3xl font-semibold text-white">9.8/10</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-950/90 p-4">
                <p className="text-sm text-slate-400">Risk Coverage</p>
                <p className="mt-3 text-3xl font-semibold text-white">Full Spectrum</p>
              </div>
            </div>

            <div className="mt-6 grid gap-4">
              <div className="flex items-center gap-3 rounded-3xl bg-slate-900/80 p-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-300">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Conversational insights</p>
                  <p className="text-sm font-semibold text-white">Voice and chat in one place</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-3xl bg-slate-900/80 p-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-300">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Enterprise protection</p>
                  <p className="text-sm font-semibold text-white">Secure authentication & claim flow</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
          <div className="absolute -right-12 bottom-14 h-24 w-24 rounded-full bg-gradient-to-br from-sky-500/40 via-transparent to-transparent blur-2xl" />
          <div className="absolute left-4 bottom-10 h-16 w-16 rounded-full bg-gradient-to-br from-violet-500/40 via-transparent to-transparent blur-2xl" />
        </motion.div>
      </div>
    </section>
  )
}
