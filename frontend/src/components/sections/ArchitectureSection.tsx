import { motion } from 'framer-motion'
import { ArrowDown, Server, Database, Layers, CloudLightning } from 'lucide-react'

const layers = [
  {
    title: 'Frontend',
    description: 'React · Tailwind · Voice UI',
    icon: Layers,
  },
  {
    title: 'FastAPI Backend',
    description: 'Secure API orchestration and business logic.',
    icon: Server,
  },
  {
    title: 'Groq Llama 3.3 AI',
    description: 'High-performance reasoning for policy evaluation.',
    icon: CloudLightning,
  },
  {
    title: 'PostgreSQL Database',
    description: 'Structured storage for customer, policy, and claim data.',
    icon: Database,
  },
  {
    title: 'External APIs',
    description: 'Twilio · Razorpay · DigiLocker for communications and verification.',
    icon: ArrowDown,
  },
]

export default function ArchitectureSection() {
  return (
    <section id="architecture" className="relative px-6 pb-24 pt-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 max-w-3xl text-slate-300">
          <p className="text-sm uppercase tracking-[0.28em] text-sky-300/80">Architecture</p>
          <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">A connected stack for intelligent insurance workflows.</h2>
          <p className="mt-4 text-base leading-8 text-slate-400">
            A modern, layered architecture that brings frontend experience, backend logic, AI reasoning, and real-world integrations into one secure platform.
          </p>
        </div>

        <div className="relative mx-auto max-w-4xl">
          <div className="absolute left-1/2 top-8 h-[calc(100%-3rem)] w-px -translate-x-1/2 rounded-full bg-gradient-to-b from-sky-500/50 via-transparent to-violet-500/20" />
          <div className="space-y-8">
            {layers.map((layer, index) => {
              const Icon = layer.icon
              return (
                <motion.div
                  key={layer.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 0.6, delay: index * 0.08 }}
                  className="relative flex items-center gap-6 rounded-[28px] border border-white/10 bg-slate-950/80 p-6 shadow-xl shadow-slate-950/20 backdrop-blur-xl"
                >
                  <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-900/80 text-sky-300 shadow-inner shadow-slate-950/20">
                    <Icon className="h-7 w-7" />
                  </div>
                  <div className="relative z-10">
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-400">{layer.title}</p>
                    <p className="mt-2 text-lg font-semibold text-white">{layer.description}</p>
                  </div>
                  <div className="absolute left-1/2 top-full mt-6 hidden h-12 w-px bg-gradient-to-b from-sky-500/50 to-violet-500/20 md:block" />
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
