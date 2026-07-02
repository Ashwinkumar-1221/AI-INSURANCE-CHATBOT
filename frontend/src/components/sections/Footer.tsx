const footerLinks = [
  { label: 'About', href: '#home' },
  { label: 'Features', href: '#features' },
  { label: 'Documentation', href: '#technologies' },
  { label: 'GitHub', href: 'https://github.com' },
  { label: 'Contact', href: '#contact' },
  { label: 'Privacy Policy', href: '#contact' },
]

export default function Footer() {
  return (
    <footer id="footer" className="border-t border-white/10 bg-slate-950/90 px-6 py-16 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl text-slate-300">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-300/80">AI Insurance</p>
          <h3 className="mt-4 text-2xl font-semibold text-white">Premium insurance recommendations with enterprise-grade confidence.</h3>
          <p className="mt-4 text-sm leading-7 text-slate-400">
            Built for teams who need AI-powered insurance guidance, secure claims support, and personalized policy workflows.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-2">
          {footerLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-slate-400 transition hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>

      <div className="mt-12 border-t border-white/10 pt-6 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} AI Insurance. All rights reserved.
      </div>
    </footer>
  )
}
