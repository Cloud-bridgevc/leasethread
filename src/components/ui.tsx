import type { ReactNode } from 'react'
import type { Urgency, RequestStatus } from '../data/types'

export const Logo = ({ light = false }: { light?: boolean }) => (
  <span className="inline-flex items-center gap-2 font-display text-lg font-bold">
    <svg width="28" height="28" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill={light ? '#3bb5ab' : '#0b1f3f'} /><path d="M8 22V10h3v9h6v3zM19 10h5v3h-5zM19 15h5v3h-5z" fill={light ? '#0b1f3f' : '#3bb5ab'} /></svg>
    <span className={light ? 'text-white' : 'text-navy-900'}>LeaseThread</span>
  </span>
)

const urgencyStyle: Record<Urgency, string> = {
  emergency: 'bg-red-100 text-red-700 ring-red-200', high: 'bg-orange-100 text-orange-700 ring-orange-200',
  medium: 'bg-amber-100 text-amber-800 ring-amber-200', low: 'bg-slate-100 text-slate-600 ring-slate-200',
}
export const Pill = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${className}`}>{children}</span>
)
export const UrgencyBadge = ({ u }: { u: Urgency }) => <Pill className={urgencyStyle[u]}><span className="h-1.5 w-1.5 rounded-full bg-current" />{u}</Pill>
const statusStyle: Record<RequestStatus, string> = {
  new: 'bg-blue-100 text-blue-700 ring-blue-200', triaged: 'bg-indigo-100 text-indigo-700 ring-indigo-200', assigned: 'bg-teal-100 text-teal-700 ring-teal-200',
  in_progress: 'bg-cyan-100 text-cyan-700 ring-cyan-200', resolved: 'bg-emerald-100 text-emerald-700 ring-emerald-200',
}
export const StatusBadge = ({ s }: { s: RequestStatus }) => <Pill className={statusStyle[s]}>{s.replace('_', ' ')}</Pill>

export const SampleBadge = ({ text = 'Sample data' }: { text?: string }) => (
  <span className="inline-flex items-center rounded border border-dashed border-slate-300 bg-slate-50 px-1.5 py-0.5 text-[11px] font-medium text-slate-500">{text}</span>
)
export const NeedsBackend = ({ what }: { what: string }) => (
  <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
    <span className="mt-0.5 font-bold">⚙ Backend required</span><span>{what}</span>
  </div>
)
export const Stat = ({ label, value, sub, tone }: { label: string; value: ReactNode; sub?: string; tone?: 'warn' | 'bad' }) => (
  <div className="card p-4">
    <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</div>
    <div className={`mt-1 font-display text-3xl font-bold ${tone === 'bad' ? 'text-red-600' : tone === 'warn' ? 'text-orange-600' : 'text-navy-900'}`}>{value}</div>
    {sub && <div className="mt-0.5 text-xs text-slate-500">{sub}</div>}
  </div>
)
export const Section = ({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) => (
  <section className="card"><header className="flex items-center justify-between border-b border-slate-100 px-4 py-3"><h3 className="text-sm font-bold">{title}</h3>{action}</header><div className="p-4">{children}</div></section>
)
