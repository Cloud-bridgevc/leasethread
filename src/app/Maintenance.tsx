import { useState } from 'react'
import { useStore } from '../lib/store'
import { UrgencyBadge, StatusBadge, Section, Pill } from '../components/ui'
import TriageWidget from '../site/TriageWidget'
import { fmtDate } from '../lib/dates'
import type { TriageResult } from '../lib/triage'
import type { Request } from '../data/types'

export default function Maintenance() {
  const s = useStore()
  const [sel, setSel] = useState<string | null>(null)
  const [filter, setFilter] = useState<'open' | 'all'>('open')
  const [last, setLast] = useState<{ text: string; r: TriageResult } | null>(null)
  const [pid, setPid] = useState(s.properties[0].id)
  const [unit, setUnit] = useState('1A')
  const list = s.requests.filter(r => filter === 'all' || r.status !== 'resolved')
  const cur = s.requests.find(r => r.id === sel)
  const create = () => {
    if (!last) return
    const req: Request = { id: 'r' + Date.now(), propertyId: pid, unit, tenant: 'Demo tenant (sample)', submitted: new Date().toISOString(), text: last.text, status: 'triaged', category: last.r.category, urgency: last.r.urgency, missingInfo: last.r.missingInfo }
    s.dispatch({ type: 'addRequest', req })
    if (last.r.urgency === 'emergency') s.dispatch({ type: 'addTask', task: { id: 't' + Date.now(), title: `Dispatch ${last.r.team} — ${unit}`, due: new Date().toISOString().slice(0, 10), done: false, source: 'ai', link: req.id } })
    setSel(req.id); setLast(null)
  }
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Maintenance</h1>
      <Section title="Log a request with AI triage"><TriageWidget onResult={(text, r) => setLast({ text, r })} />
        {last && <div className="mt-3 flex flex-wrap items-end gap-3"><div><label className="label">Property</label><select className="input" value={pid} onChange={e => setPid(e.target.value)}>{s.properties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div><div><label className="label">Unit</label><input className="input w-24" value={unit} onChange={e => setUnit(e.target.value)} /></div><button className="btn-accent" onClick={create}>Create request from triage</button></div>}
      </Section>
      <div className="grid gap-5 lg:grid-cols-5">
        <div className="card lg:col-span-3">
          <div className="flex gap-2 border-b p-3">{(['open', 'all'] as const).map(f => <button key={f} onClick={() => setFilter(f)} className={`rounded-full px-3 py-1 text-xs font-semibold ${filter === f ? 'bg-navy-900 text-white' : 'bg-slate-100'}`}>{f === 'open' ? 'Open' : 'All'}</button>)}</div>
          <div className="divide-y">{list.map(r => <button key={r.id} onClick={() => setSel(r.id)} className={`block w-full px-4 py-3 text-left hover:bg-slate-50 ${sel === r.id ? 'bg-teal-50' : ''}`}><div className="flex items-center justify-between gap-2"><span className="text-sm font-semibold text-navy-900">{s.properties.find(p => p.id === r.propertyId)?.name} · {r.unit}</span><span className="flex gap-1"><UrgencyBadge u={r.urgency} /><StatusBadge s={r.status} /></span></div><div className="mt-0.5 truncate text-sm text-slate-600">{r.text}</div></button>)}</div>
        </div>
        <div className="lg:col-span-2">
          {cur ? <Section title={`${cur.category} · ${cur.unit}`}>
            <div className="space-y-3 text-sm"><p>{cur.text}</p><div className="text-xs text-slate-500">{cur.tenant} · submitted {fmtDate(cur.submitted)}</div>
              {cur.missingInfo.length > 0 && <div><div className="label">AI: missing information</div><ul className="list-disc pl-5">{cur.missingInfo.map(m => <li key={m}>{m}</li>)}</ul></div>}
              <div><label className="label">Assign contractor</label><select className="input" value={cur.contractorId ?? ''} onChange={e => e.target.value && s.dispatch({ type: 'assign', id: cur.id, contractorId: e.target.value })}><option value="">Unassigned</option>{s.contractors.map(c => <option key={c.id} value={c.id}>{c.name} — {c.availability}</option>)}</select></div>
              <div><label className="label">Status</label><select className="input" value={cur.status} onChange={e => s.dispatch({ type: 'status', id: cur.id, status: e.target.value as Request['status'] })}>{['new', 'triaged', 'assigned', 'in_progress', 'resolved'].map(x => <option key={x} value={x}>{x.replace('_', ' ')}</option>)}</select></div>
              <Pill className="bg-amber-50 text-amber-800 ring-amber-200">Tenant notification: backend required</Pill></div>
          </Section> : <div className="card p-6 text-sm text-slate-500">Select a request to see details and assign a contractor.</div>}
        </div>
      </div>
    </div>
  )
}
