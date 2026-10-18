import type { ReactNode } from 'react'
import { Link } from '../lib/router'
import { Logo, SampleBadge } from '../components/ui'
import { useStore } from '../lib/store'

export const appNav = [
  ['/app', 'Dashboard'], ['/app/properties', 'Properties'], ['/app/maintenance', 'Maintenance'], ['/app/leases', 'Leases & renewals'],
  ['/app/contractors', 'Contractor board'], ['/app/communications', 'Communications'], ['/app/assistant', 'Assistant'],
  ['/app/reports', 'Reports'], ['/app/documents', 'Documents'], ['/app/tasks', 'Tasks & alerts'],
]
export default function AppShell({ path, children }: { path: string; children: ReactNode }) {
  const { notifications, tasks } = useStore()
  const unread = notifications.filter(n => !n.read).length
  return (
    <div className="flex min-h-screen bg-slate-100">
      <aside className="hidden w-60 shrink-0 flex-col bg-navy-900 p-4 md:flex">
        <Link to="/"><Logo light /></Link>
        <nav className="mt-8 flex-1 space-y-1">
          {appNav.map(([to, l]) => <Link key={to} to={to} className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium ${path === to ? 'bg-teal-500/20 text-teal-200' : 'text-slate-300 hover:bg-white/5'}`}>{l}{to === '/app/tasks' && unread + tasks.filter(t => !t.done).length > 0 && <span className="rounded-full bg-teal-500 px-1.5 text-[10px] font-bold text-white">{unread + tasks.filter(t => !t.done).length}</span>}</Link>)}
        </nav>
        <div className="rounded-lg bg-white/5 p-3 text-xs text-slate-400">Signed in as <b className="text-slate-200">Priya Raman</b><br />Role: Property manager<br /><span className="text-slate-500">(simulated session — auth not implemented)</span></div>
      </aside>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-2.5">
          <div className="flex gap-1 overflow-x-auto md:hidden">{appNav.map(([to, l]) => <Link key={to} to={to} className={`whitespace-nowrap rounded px-2 py-1 text-xs ${path === to ? 'bg-navy-900 text-white' : 'text-slate-600'}`}>{l}</Link>)}</div>
          <div className="hidden md:block"><SampleBadge text="Sample data — fictional properties, tenants and contractors" /></div>
          <Link to="/" className="shrink-0 text-xs font-semibold text-slate-500 hover:text-navy-900">← Public site</Link>
        </div>
        <main className="mx-auto max-w-7xl p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
