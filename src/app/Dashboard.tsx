import { useStore } from '../lib/store'
import { Stat, Section, UrgencyBadge, StatusBadge, Pill } from '../components/ui'
import { Link } from '../lib/router'
import { renewalRisks, occupancy } from '../lib/risk'
import { buildReport } from '../lib/reports'
import { daysUntil, fmtDate, money } from '../lib/dates'

export default function Dashboard() {
  const s = useStore()
  const open = s.requests.filter(r => r.status !== 'resolved')
  const risks = renewalRisks(s.leases, s.requests)
  const rep = buildReport(s.requests, s.properties)
  const pName = (id: string) => s.properties.find(p => p.id === id)?.name
  const totalUnits = s.properties.reduce((a, p) => a + p.units, 0), occ = s.properties.reduce((a, p) => a + p.occupied, 0)
  return (
    <div className="space-y-5">
      <div><h1 className="text-2xl font-bold">Good morning, Priya</h1><p className="text-sm text-slate-500">Portfolio overview across {s.properties.length} properties</p></div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Units / occupancy" value={`${Math.round(occ / totalUnits * 100)}%`} sub={`${occ} of ${totalUnits} units`} />
        <Stat label="Open requests" value={open.length} sub={`${open.filter(r => r.urgency === 'emergency').length} emergency`} tone={open.some(r => r.urgency === 'emergency') ? 'bad' : undefined} />
        <Stat label="Leases ≤ 90 days" value={s.leases.filter(l => daysUntil(l.end) <= 90).length} tone="warn" />
        <Stat label="Monthly rent roll" value={money(s.properties.reduce((a, p) => a + p.monthlyRent, 0))} />
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Section title="AI operational insights" action={<Pill className="bg-teal-100 text-teal-700 ring-teal-200">rule-based demo</Pill>}>
            <ul className="space-y-2 text-sm">{rep.summary.map((t, i) => <li key={i} className="flex gap-2"><span className="text-teal-600">◆</span>{t}</li>)}
              {risks[0] && <li className="flex gap-2"><span className="text-teal-600">◆</span>{risks.length} renewal flag{risks.length > 1 ? 's' : ''} need attention — soonest is {pName(s.leases.find(l => l.id === risks[0].leaseId)!.propertyId)} unit {s.leases.find(l => l.id === risks[0].leaseId)!.unit}.</li>}</ul>
            <p className="mt-3 text-xs text-slate-500">Insights are based on {rep.sampleSize} sample requests. Small samples mean patterns are indicative only.</p>
          </Section>
          <Section title="Open maintenance requests" action={<Link to="/app/maintenance" className="text-xs font-semibold text-teal-600">View all</Link>}>
            <div className="divide-y">{open.slice(0, 5).map(r => <div key={r.id} className="flex items-center justify-between gap-2 py-2 text-sm"><div className="min-w-0"><div className="truncate font-medium text-navy-900">{pName(r.propertyId)} · {r.unit} — {r.category}</div><div className="truncate text-xs text-slate-500">{r.text}</div></div><div className="flex shrink-0 gap-1"><UrgencyBadge u={r.urgency} /><StatusBadge s={r.status} /></div></div>)}</div>
          </Section>
        </div>
        <div className="space-y-5">
          <Section title="Upcoming renewals" action={<Link to="/app/leases" className="text-xs font-semibold text-teal-600">Details</Link>}>
            <div className="space-y-3">{[...s.leases].sort((a, b) => daysUntil(a.end) - daysUntil(b.end)).slice(0, 4).map(l => <div key={l.id} className="text-sm"><div className="flex justify-between"><b>{pName(l.propertyId)} {l.unit}</b><span className={daysUntil(l.end) <= 30 ? 'font-semibold text-red-600' : 'text-slate-500'}>{daysUntil(l.end)}d</span></div><div className="text-xs text-slate-500">Ends {fmtDate(l.end)} · {l.renewalActionTaken ? 'renewal action taken' : 'no renewal action'}</div></div>)}</div>
          </Section>
          <Section title="Portfolio">
            <div className="space-y-3">{s.properties.map(p => <div key={p.id}><div className="flex justify-between text-sm"><span className="font-medium text-navy-900">{p.name}</span><span className="text-slate-500">{occupancy(p)}%</span></div><div className="mt-1 h-1.5 rounded bg-slate-100"><div className="h-1.5 rounded bg-teal-500" style={{ width: `${occupancy(p)}%` }} /></div></div>)}</div>
          </Section>
        </div>
      </div>
    </div>
  )
}
