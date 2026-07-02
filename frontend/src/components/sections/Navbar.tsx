import { useEffect, useState } from 'react'
import { ArrowRight, ShieldCheck } from 'lucide-react'

import { Link } from 'react-router-dom'

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Features', href: '/#features' },
  { label: 'Architecture', href: '/#architecture' },
  { label: 'Technologies', href: '/#technologies' },
  { label: 'Contact', href: '/#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24)
    handler()
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 border-b border-white/10 transition duration-500 ${
        scrolled ? 'bg-slate-950/80 shadow-2xl shadow-slate-950/40 backdrop-blur-xl' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3 text-white">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-violet-500 shadow-xl shadow-sky-500/20">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-base font-semibold leading-tight">AI Insurance</p>
            <p className="text-xs text-slate-400">Policy Intelligence</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-300 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="transition hover:text-white"
              onClick={(event) => {
                if (item.href.includes('#')) {
                  event.preventDefault()

                  const [path, hash] = item.href.split('#')

                  if (window.location.pathname !== path) {
                    window.location.href = item.href
                  } else {
                    document.getElementById(hash)?.scrollIntoView({
                      behavior: 'smooth',
                      block: 'start',
                    })
                  }
                }
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/login"
            className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-200/30 hover:bg-white/10 sm:px-4"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-violet-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/30 transition hover:from-sky-400 hover:to-violet-400 sm:px-5"
          >
            Get Started
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  )
}
