import { motion } from 'framer-motion'

const stack = [
  {
    category: 'Frontend',
    items: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
  },
  {
    category: 'Backend',
    items: ['FastAPI', 'Python', 'JWT'],
  },
  {
    category: 'Database',
    items: ['PostgreSQL'],
  },
  {
    category: 'AI',
    items: ['Groq', 'Llama 3.3', 'RAG'],
  },
  {
    category: 'Deployment',
    items: ['Vercel', 'Railway', 'Supabase'],
  },
]

export default function TechStackSection() {
  return (
    <section id="technologies" className="px-6 pb-24 pt-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 max-w-3xl text-slate-300">
          <p className="text-sm uppercase tracking-[0.28em] text-sky-300/80">Technology stack</p>
          <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Engineered with best-in-class tools for reliability and scale.</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {stack.map((group, index) => (
            <motion.div
              key={group.category}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="rounded-[28px] border border-white/10 bg-slate-950/70 p-6 shadow-xl shadow-slate-950/20 backdrop-blur-xl"
            >
              <p className="text-sm uppercase tracking-[0.24em] text-sky-300/80">{group.category}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:border-sky-400/20 hover:bg-slate-900/80"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
