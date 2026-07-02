import { motion } from 'framer-motion'
import { ArrowRight, Clock3, Mail, Phone, Sparkles } from 'lucide-react'

const contactPoints = [
  {
    title: 'Email support',
    value: 'hello@aiinsurance.com',
    detail: 'Ideal for product demos and enterprise onboarding.',
    icon: Mail,
  },
  {
    title: 'Call us',
    value: '+1 (800) 555-0199',
    detail: 'Speak with our specialists for implementation guidance.',
    icon: Phone,
  },
  {
    title: 'Response time',
    value: 'Under 24 hours',
    detail: 'Most inquiries receive a tailored reply the same day.',
    icon: Clock3,
  },
]

export default function ContactSection() {
  return (
    <section id="contact" className="relative overflow-hidden px-6 py-24 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(139,92,246,0.16),transparent_24%)]" />
      <div className="premium-card relative mx-auto max-w-7xl rounded-[40px] border border-white/10 bg-slate-950/85 px-6 py-12 shadow-2xl shadow-slate-950/40 backdrop-blur-3xl sm:px-8 lg:px-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-500/10 px-3 py-1 text-sm text-sky-200">
              <Sparkles className="h-4 w-4" />
              Contact us
            </div>
            <h2 className="mt-6 text-3xl font-semibold text-white sm:text-4xl">
              Let's build a premium insurance experience together.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
              Whether you’re launching a new policy intelligence workflow or upgrading an existing claims experience, our team can help you move faster with confidence.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href="mailto:hello@aiinsurance.com"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-violet-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:scale-[1.02]"
              >
                Book a demo
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="tel:+18005550199"
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-semibold text-slate-100 transition hover:border-slate-200/30 hover:bg-white/10"
              >
                Talk to sales
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.05 }}
            className="grid gap-4 sm:grid-cols-2"
          >
            {contactPoints.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.title} className="rounded-[24px] border border-white/10 bg-slate-900/80 p-5 shadow-inner shadow-slate-950/20">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500/20 to-violet-500/20 text-sky-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="mt-4 text-sm font-semibold text-white">{item.title}</p>
                  <p className="mt-2 text-sm text-slate-300">{item.value}</p>
                  <p className="mt-3 text-sm leading-6 text-slate-400">{item.detail}</p>
                </div>
              )
            })}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
