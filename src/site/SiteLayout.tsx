import { useState, type ReactNode } from 'react'
import { Link } from '../lib/router'
import { Logo } from '../components/ui'

const nav = [['/features', 'Features'], ['/demo', 'AI demo'], ['/use-cases', 'Use cases'], ['/pricing', 'Pricing'], ['/faq', 'FAQ']]
export default function SiteLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="min-h-screen">
      <div className="bg-navy-900 px-4 py-1.5 text-center text-xs text-slate-300">Product prototype — all properties, leases and people shown are fictional sample data.</div>
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/"><Logo /></Link>
          <nav className="hidden items-center gap-6 md:flex">{nav.map(([to, l]) => <Link key={to} to={to} className="text-sm font-medium text-slate-600 hover:text-navy-900">{l}</Link>)}</nav>
          <div className="hidden items-center gap-2 md:flex"><Link to="/app" className="btn-ghost">Open workspace</Link><Link to="/request-demo" className="btn-primary">Request demo</Link></div>
          <button className="md:hidden" aria-label="Menu" onClick={() => setOpen(!open)}>☰</button>
        </div>
        {open && <div className="flex flex-col gap-3 border-t px-4 py-3 md:hidden" onClick={() => setOpen(false)}>{nav.map(([to, l]) => <Link key={to} to={to}>{l}</Link>)}<Link to="/app">Open workspace</Link><Link to="/request-demo" className="btn-primary">Request demo</Link></div>}
      </header>
      <main>{children}</main>
      <footer className="bg-navy-950 text-slate-400">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-4">
          <div><Logo light /><p className="mt-3 text-sm">Every property, lease, and maintenance request connected in one intelligent workspace.</p></div>
          <div><h4 className="mb-2 text-sm font-semibold text-white">Product</h4><ul className="space-y-1 text-sm"><li><Link to="/features">Features</Link></li><li><Link to="/demo">AI triage demo</Link></li><li><Link to="/pricing">Pricing</Link></li></ul></div>
          <div><h4 className="mb-2 text-sm font-semibold text-white">Company</h4><ul className="space-y-1 text-sm"><li><Link to="/use-cases">Use cases</Link></li><li><Link to="/faq">FAQ</Link></li><li><Link to="/request-demo">Request a demo</Link></li></ul></div>
          <div><h4 className="mb-2 text-sm font-semibold text-white">Legal</h4><ul className="space-y-1 text-sm"><li><Link to="/privacy">Privacy</Link></li><li><Link to="/security">Security</Link></li><li><Link to="/terms">Terms</Link></li></ul></div>
        </div>
        <div className="border-t border-white/10 py-4 text-center text-xs">© {new Date().getFullYear()} LeaseThread (prototype). Legal pages are draft templates and require legal review before launch.</div>
      </footer>
    </div>
  )
}
