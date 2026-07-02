import { Link } from 'react-router-dom'

interface PlaceholderPageProps {
  title: string
  description: string
  route: string
}

export default function PlaceholderPage({ title, description, route }: PlaceholderPageProps) {
  return (
    <div className="min-h-screen bg-slate-950 px-6 py-20 text-white sm:px-10">
      <div className="mx-auto max-w-4xl rounded-[32px] border border-white/10 bg-slate-900/80 p-10 shadow-2xl shadow-slate-950/40 backdrop-blur-3xl">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.32em] text-sky-300/80">{route} page</p>
          <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">{title}</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">{description}</p>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-slate-950/90 p-8 shadow-inner shadow-slate-950/20">
          <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Coming Soon</p>
          <h2 className="mt-4 text-3xl font-semibold text-white">Modern AI operations dashboard</h2>
          <p className="mt-3 text-slate-400">This route is being prepared to deliver a refined enterprise experience with policy intelligence, chat, and management workflows.</p>
          <Link
            to="/"
            className="mt-8 inline-flex items-center rounded-full bg-gradient-to-r from-sky-500 to-violet-500 px-6 py-3 text-sm font-semibold text-white transition hover:scale-[1.02]"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
