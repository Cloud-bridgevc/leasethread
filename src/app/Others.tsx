import { useState } from 'react'
import { useStore } from '../lib/store'
import { Section, UrgencyBadge, Pill, NeedsBackend, SampleBadge } from '../components/ui'
import { answer, SUGGESTED } from '../lib/assistant'
import { buildReport } from '../lib/reports'
import { occupancy } from '../lib/risk'
import { fmtDate, money, daysUntil } from '../lib/dates'

export function Properties() {
  const s = useStore()
  return (<div className="space-y-5"><h1 className="text-2xl font-bold">Properties</h1><div className="grid gap-4 md:grid-cols-2">{s.properties.map(p => (
    <div key={p.id} className="card p-5"><div className="flex justify-between"><h3 className="font-bold">{p.name}</h3><SampleBadge /></div><div className="text-sm text-slate-500">{p.address}</div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm"><div><b className="block text-lg text-navy-900">{p.units}</b>units</div><div><b className="block text-lg text-navy-900">{occupancy(p)}%</b>occupied</div><div><b className="block text-lg text-navy-900">{money(p.monthlyRent)}</b>rent/mo</div></div>
      <div className="mt-3 text-xs text-slate-500">{p.type} · Manager: {p.manager} · {s.requests.filter(r => r.propertyId === p.id && r.status !== 'resolved').length} open requests</div></div>))}</div></div>)
}

export function Contractors() {
  const s = useStore()
  const cols = ['assigned', 'in_progress', 'resolved'] as const
  return (<div className="space-y-5"><h1 className="text-2xl font-bold">Contractor assignment board</h1>
    <div className="grid gap-4 lg:grid-cols-3">{cols.map(c => <div key={c} className="rounded-xl bg-slate-200/60 p-3"><div className="mb-2 text-xs font-bold uppercase text-slate-600">{c.replace('_', ' ')}</div>
      <div className="space-y-2">{s.requests.filter(r => r.status === c && r.contractorId).map(r => <div key={r.id} className="card p-3 text-sm"><div className="flex justify-between"><b>{s.properties.find(p => p.id === r.propertyId)?.name.split(' ')[0]} {r.unit}</b><UrgencyBadge u={r.urgency} /></div><div className="text-xs text-slate-500">{r.category} → {s.contractors.find(k => k.id === r.contractorId)?.name}</div>
        {c !== 'resolved' && <button className="mt-2 text-xs font-semibold text-teal-600" onClick={() => s.dispatch({ type: 'status', id: r.id, status: c === 'assigned' ? 'in_progress' : 'resolved' })}>Move to {c === 'assigned' ? 'in progress' : 'resolved'} →</button>}</div>)}</div></div>)}</div>
    <Section title="Contractors"><div className="grid gap-3 md:grid-cols-3">{s.contractors.map(c => <div key={c.id} className="rounded-lg border p-3 text-sm"><b>{c.name}</b><div className="text-xs text-slate-500">{c.trade} · ★ {c.rating} (sample)</div><Pill className={c.availability === 'available' ? 'mt-2 bg-emerald-100 text-emerald-700 ring-emerald-200' : c.availability === 'busy' ? 'mt-2 bg-amber-100 text-amber-800 ring-amber-200' : 'mt-2 bg-slate-100 text-slate-600 ring-slate-200'}>{c.availability}</Pill></div>)}</div></Section></div>)
}

export function Communications() {
  const s = useStore()
  return (<div className="space-y-5"><h1 className="text-2xl font-bold">Tenant communications</h1><Section title="Communication log">
    <div className="divide-y">{[...s.comms].sort((a, b) => b.at.localeCompare(a.at)).map(m => <div key={m.id} className="flex gap-3 py-3 text-sm"><span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${m.direction === 'in' ? 'bg-teal-500' : 'bg-navy-600'}`} /><div><b>{m.tenant}</b> <span className="text-xs text-slate-500">· {m.channel} · {m.direction === 'in' ? 'received' : 'sent'} · {fmtDate(m.at)}</span><div>{m.summary}</div></div></div>)}</div>
    <div className="mt-3"><NeedsBackend what="Sending/receiving email, SMS and portal messages (SES / SNS or Twilio + inbound webhooks). This log shows sample records only." /></div></Section></div>)
}

export function Assistant() {
  const s = useStore()
  const [msgs, setMsgs] = useState<{ role: 'u' | 'a'; text: string }[]>([{ role: 'a', text: 'Hi Priya — ask me about open requests, lease deadlines, renewal risks or contractor assignments for your properties.' }])
  const [q, setQ] = useState('')
  const ask = (text: string) => { if (!text.trim()) return; setMsgs(m => [...m, { role: 'u', text }, { role: 'a', text: answer(text, s) }]); setQ('') }
  return (<div className="space-y-5"><h1 className="text-2xl font-bold">Operations assistant</h1><div className="card">
    <div className="max-h-[420px] min-h-[260px] space-y-3 overflow-auto p-4">{msgs.map((m, i) => <div key={i} className={`flex ${m.role === 'u' ? 'justify-end' : ''}`}><div className={`max-w-[85%] whitespace-pre-wrap rounded-xl px-3 py-2 text-sm ${m.role === 'u' ? 'bg-navy-900 text-white' : 'bg-slate-100'}`}>{m.text}</div></div>)}</div>
    <div className="border-t p-3"><div className="mb-2 flex flex-wrap gap-2">{SUGGESTED.map(x => <button key={x} onClick={() => ask(x)} className="rounded-full border px-2.5 py-1 text-xs hover:border-teal-400">{x}</button>)}</div>
      <form className="flex gap-2" onSubmit={e => { e.preventDefault(); ask(q) }}><input className="input" value={q} onChange={e => setQ(e.target.value)} placeholder="Ask about your properties…" aria-label="Question" /><button className="btn-accent">Ask</button></form></div></div>
    <NeedsBackend what="Demo assistant matches keywords over sample data. Production: Bedrock with tool-calling against PostgreSQL, restricted to the user's organization and property grants. Not a general chatbot, and it does not forecast failures." /></div>)
}

export function Reports() {
  const s = useStore(); const r = buildReport(s.requests, s.properties); const max = Math.max(...Object.values(r.byCat))
  return (<div className="space-y-5"><h1 className="text-2xl font-bold">Reports</h1>
    <Section title="Summary" action={<Pill className="bg-teal-100 text-teal-700 ring-teal-200">n = {r.sampleSize} sample requests</Pill>}><ul className="list-disc space-y-1 pl-5 text-sm">{r.summary.map((t, i) => <li key={i}>{t}</li>)}</ul></Section>
    <div className="grid gap-5 lg:grid-cols-2"><Section title="Requests by category"><div className="space-y-2">{Object.entries(r.byCat).sort((a, b) => b[1] - a[1]).map(([k, v]) => <div key={k} className="flex items-center gap-2 text-sm"><span className="w-28 shrink-0">{k}</span><div className="h-3 flex-1 rounded bg-slate-100"><div className="h-3 rounded bg-teal-500" style={{ width: `${v / max * 100}%` }} /></div><b className="w-5 text-right">{v}</b></div>)}</div></Section>
      <Section title="Outstanding"><div className="text-sm"><div>Average resolution: <b>{(r.avgHours / 24).toFixed(1)} days</b></div><div>Open: <b>{r.open.length}</b> · Waiting &gt;7 days: <b>{r.aged.length}</b></div><div className="mt-2">Open tasks: <b>{s.tasks.filter(t => !t.done).length}</b></div></div></Section></div></div>)
}

export function Documents() {
  const s = useStore(); const [open, setOpen] = useState<string | null>(null)
  return (<div className="space-y-5"><h1 className="text-2xl font-bold">Document library</h1><Section title="Property & lease documents"><div className="divide-y">{s.docs.map(d => <div key={d.id} className="py-2 text-sm"><button className="flex w-full justify-between text-left" onClick={() => setOpen(open === d.id ? null : d.id)}><span><b>{d.name}</b> <span className="text-xs text-slate-500">· {s.properties.find(p => p.id === d.propertyId)?.name}</span></span><Pill className="bg-slate-100 text-slate-600 ring-slate-200">{d.kind}</Pill></button>{open === d.id && <pre className="mt-2 whitespace-pre-wrap rounded bg-slate-50 p-3 font-sans text-xs">{d.text ?? 'Sample placeholder — no content.'}</pre>}</div>)}</div>
    <div className="mt-3"><NeedsBackend what="File upload to Amazon S3 (pre-signed URLs, virus scan, per-org prefixes). Not yet implemented." /></div></Section></div>)
}

export function Tasks() {
  const s = useStore(); const [title, setTitle] = useState('')
  return (<div className="space-y-5"><h1 className="text-2xl font-bold">Tasks & notifications</h1><div className="grid gap-5 lg:grid-cols-2">
    <Section title="Tasks"><form className="mb-3 flex gap-2" onSubmit={e => { e.preventDefault(); if (title.trim()) { s.dispatch({ type: 'addTask', task: { id: 't' + Date.now(), title, due: new Date().toISOString().slice(0, 10), done: false, source: 'manual' } }); setTitle('') } }}><input className="input" placeholder="Add a task" value={title} onChange={e => setTitle(e.target.value)} /><button className="btn-primary">Add</button></form>
      <div className="space-y-2">{s.tasks.map(t => <label key={t.id} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={t.done} onChange={() => s.dispatch({ type: 'toggleTask', id: t.id })} /><span className={t.done ? 'text-slate-400 line-through' : ''}>{t.title}</span>{t.source === 'ai' && <Pill className="bg-teal-100 text-teal-700 ring-teal-200">AI-suggested</Pill>}<span className="ml-auto text-xs text-slate-500">{daysUntil(t.due) < 0 ? 'overdue' : fmtDate(t.due)}</span></label>)}</div></Section>
    <Section title="Notifications"><div className="space-y-2">{s.notifications.map(n => <button key={n.id} onClick={() => s.dispatch({ type: 'read', id: n.id })} className={`block w-full rounded-lg border p-3 text-left text-sm ${n.read ? 'opacity-60' : ''} ${n.level === 'critical' ? 'border-red-200 bg-red-50' : n.level === 'warn' ? 'border-amber-200 bg-amber-50' : ''}`}>{n.text}<div className="text-xs text-slate-500">{fmtDate(n.at)}{n.read ? '' : ' · click to mark read'}</div></button>)}</div>
      <div className="mt-3"><NeedsBackend what="Email/push delivery of notifications (SES + scheduled Lambda via EventBridge)." /></div></Section></div></div>)
}
