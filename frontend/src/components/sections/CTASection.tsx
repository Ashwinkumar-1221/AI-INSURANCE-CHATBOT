import { motion } from 'framer-motion'

export default function CTASection() {
  return (
    <section className="relative overflow-hidden px-6 py-24 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(139,92,246,0.16),transparent_28%)]" />
      <div className="premium-card relative mx-auto max-w-5xl rounded-[40px] border border-white/10 bg-slate-950/85 px-6 py-12 shadow-2xl shadow-slate-950/40 backdrop-blur-3xl sm:px-8 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="text-center"
        >
          <p className="text-sm uppercase tracking-[0.32em] text-sky-300/80">Ready for the next generation of insurance?</p>
          <h2 className="mt-6 text-4xl font-semibold text-white sm:text-5xl">
            Ready to Find the Right Insurance Policy?
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-300">
            Experience an AI-first assistant built for enterprise insurance teams, policyholders, and advisors who need accurate guidance in real time.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#features"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-violet-500 px-7 py-4 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:scale-[1.02]"
            >
              Start Now
            </a>
            <a
              href="#architecture"
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-7 py-4 text-sm font-semibold text-slate-100 transition hover:border-slate-200/30 hover:bg-white/10"
            >
              View Demo
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
