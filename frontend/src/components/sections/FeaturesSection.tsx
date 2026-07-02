import { motion } from 'framer-motion'
import {
  Cpu,
  MessageSquare,
  Mic2,
  LifeBuoy,
  Bell,
  Globe,
  Shield,
  Zap,
} from 'lucide-react'

const features = [
  {
    title: 'Smart Policy Recommendation',
    description: 'AI evaluates coverage, premiums, and personal profile to suggest ideal policies.',
    icon: Cpu,
  },
  {
    title: 'AI Chat Assistant',
    description: 'Real-time conversational support with contextual policy insights.',
    icon: MessageSquare,
  },
  {
    title: 'Voice-Based Interaction',
    description: 'Fast voice control for searching policies and submitting claims.',
    icon: Mic2,
  },
  {
    title: 'Claims Assistance',
    description: 'Guided claim preparation and status tracking for smooth resolution.',
    icon: LifeBuoy,
  },
  {
    title: 'Premium Reminder',
    description: 'Automated alerts for renewals and critical deadlines.',
    icon: Bell,
  },
  {
    title: 'Multi-language Support',
    description: 'Global-ready assistant with multilingual conversational flows.',
    icon: Globe,
  },
  {
    title: 'Secure Authentication',
    description: 'Enterprise-grade security for user sessions and sensitive data.',
    icon: Shield,
  },
  {
    title: 'Real-time Notifications',
    description: 'Instant alerts across platforms for policy events and renewals.',
    icon: Zap,
  },
]

export default function FeaturesSection() {
  return (
    <section id="features" className="relative px-6 pb-24 pt-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 max-w-3xl space-y-4 text-slate-300">
          <p className="text-sm uppercase tracking-[0.28em] text-sky-300/80">Product highlights</p>
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">Built to guide every customer to the right coverage.</h2>
          <p className="text-base leading-8 text-slate-400">
            A premium suite of AI-driven insurance tools designed for modern enterprises, with security, personalization, and effortless interaction baked in.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                whileHover={{ y: -8, scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 220, damping: 18, delay: index * 0.04 }}
                className="group rounded-[28px] border border-white/10 bg-slate-950/75 p-6 shadow-xl shadow-slate-950/20 backdrop-blur-xl"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-sky-500/10 to-violet-500/10 text-sky-300 transition group-hover:scale-105">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-white">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">{feature.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
