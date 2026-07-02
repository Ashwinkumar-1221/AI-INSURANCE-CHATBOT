import { motion } from 'framer-motion'
import { Mic2, Cpu, ShieldCheck, MessageSquare, Repeat, User } from 'lucide-react'

const steps = [
  { label: 'User', icon: User },
  { label: 'Speech to Text', icon: Mic2 },
  { label: 'AI Analysis', icon: Cpu },
  { label: 'Policy Recommendation', icon: ShieldCheck },
  { label: 'Claims Assistance', icon: MessageSquare },
  { label: 'Text to Speech', icon: Repeat },
  { label: 'User Response', icon: User },
]

export default function WorkflowSection() {
  return (
    <section id="workflow" className="relative px-6 pb-24 pt-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 max-w-3xl text-slate-300">
          <p className="text-sm uppercase tracking-[0.28em] text-sky-300/80">AI workflow</p>
          <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">From voice to recommendation, every step is intelligent.</h2>
          <p className="mt-4 text-base leading-8 text-slate-400">
            A smooth workflow that turns user intent into tailored policy advice and actionable claim support.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[repeat(7,1fr)] xl:gap-4">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isLast = index === steps.length - 1
            return (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.55, delay: index * 0.06 }}
                className="relative flex items-center justify-center rounded-[28px] border border-white/10 bg-slate-950/80 p-6 text-center shadow-xl shadow-slate-950/20 backdrop-blur-xl"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-900/80 text-sky-300 shadow-inner shadow-slate-950/20">
                  <Icon className="h-6 w-6" />
                </div>
                <p className="mt-4 text-sm font-semibold text-white">{step.label}</p>
                {!isLast && (
                  <span className="pointer-events-none absolute right-4 top-1/2 hidden h-8 w-px -translate-y-1/2 bg-gradient-to-b from-sky-500/80 to-violet-500/20 xl:block" />
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
