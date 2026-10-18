import { useState } from 'react'
import { useStore } from '../lib/store'
import { Section, Pill, NeedsBackend } from '../components/ui'
import { extractLease } from '../lib/leaseExtract'
import { renewalRisks } from '../lib/risk'
import { daysUntil, fmtDate, money } from '../lib/dates'

export default function Leases() {
  const s = useStore()
  const [id, setId] = useState(s.leases[0].id)
  const [hi, setHi] = useState<string | null>(null)
  const lease = s.leases.find(l => l.id === id)!
  const doc = s.docs.find(d => d.id === lease.docId)!
  const fields = doc.text ? extractLease(doc.text) : []
  const risks = renewalRisks(s.leases, s.requests)
  const pName = (pid: string) => s.properties.find(p => p.id === pid)?.name
  const render = (t: string) => { if (!hi) return t; const i = t.indexOf(hi); return i < 0 ? t : <>{t.slice(0, i)}<mark className="rounded bg-teal-200 px-0.5">{hi}</mark>{t.slice(i + hi.length)}</> }
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Leases & renewals</h1>
      <Section title="Renewal risk monitor">
        <div className="space-y-2">{risks.map(f => { const l = s.leases.find(x => x.id === f.leaseId)!; return (
          <div key={f.leaseId} className="flex flex-wrap items-start justify-between gap-2 rounded-lg border border-slate-200 p-3 text-sm">
            <div><b>{pName(l.propertyId)} · {l.unit}</b> <Pill className={f.level === 'high' ? 'bg-red-100 text-red-700 ring-red-200' : f.level === 'medium' ? 'bg-amber-100 text-amber-800 ring-amber-200' : 'bg-slate-100 text-slate-600 ring-slate-200'}>{f.level}</Pill>
              <ul className="mt-1 list-disc pl-5 text-slate-600">{f.reasons.map(r => <li key={r}>{r}</li>)}</ul></div>
            {l.renewalActionTaken ? <Pill className="bg-emerald-100 text-emerald-700 ring-emerald-200">offer sent</Pill> : <button className="btn-ghost" onClick={() => { s.dispatch({ type: 'renewalSent', leaseId: l.id }); s.dispatch({ type: 'addTask', task: { id: 't' + Date.now(), title: `Follow up on renewal — ${l.unit}`, due: new Date(Date.now() + 7 * 864e5).toISOString().slice(0, 10), done: false, source: 'manual' } }) }}>Mark renewal offer sent</button>}
          </div>) })}</div>
        <p className="mt-3 text-xs text-slate-500">Flags use transparent rules (expiry date, notice window, unresolved requests). They indicate items needing review, not likelihood of tenant departure.</p>
      </Section>
      <Section title="AI lease intelligence">
        <div className="mb-4 flex flex-wrap gap-2">{s.leases.map(l => <button key={l.id} onClick={() => { setId(l.id); setHi(null) }} className={`rounded-full px-3 py-1 text-xs font-semibold ${id === l.id ? 'bg-navy-900 text-white' : 'bg-slate-100'}`}>{pName(l.propertyId)?.split(' ')[0]} {l.unit}</button>)}</div>
        <div className="grid gap-4 lg:grid-cols-2">
          <div><div className="label">Extracted terms — click to verify in source</div>
            <div className="mb-2 grid grid-cols-3 gap-2 text-center text-xs"><div className="rounded bg-slate-50 p-2"><b className="block text-base text-navy-900">{money(lease.rent)}</b>rent</div><div className="rounded bg-slate-50 p-2"><b className="block text-base text-navy-900">{daysUntil(lease.end)}d</b>to {fmtDate(lease.end)}</div><div className="rounded bg-slate-50 p-2"><b className="block text-base text-navy-900">{lease.noticeDays}d</b>notice</div></div>
            <div className="divide-y rounded-lg border">{fields.map(f => <button key={f.field} onClick={() => setHi(f.passage)} className={`block w-full px-3 py-2 text-left text-sm hover:bg-teal-50 ${hi === f.passage ? 'bg-teal-50' : ''}`}><div className="text-xs font-semibold uppercase text-slate-500">{f.field}</div><div className="text-navy-900">{f.value}</div></button>)}</div></div>
          <div><div className="label">Source: {doc.name}</div><pre className="max-h-96 overflow-auto whitespace-pre-wrap rounded-lg border bg-slate-50 p-3 font-sans text-xs leading-relaxed">{render(doc.text ?? '')}</pre></div>
        </div>
        <div className="mt-4 space-y-2"><NeedsBackend what="Uploading real lease PDFs (S3 + Textract/OCR + Bedrock extraction via Lambda). Here, fields are parsed from fictional sample text with regular expressions. Extractions should always be human-verified." /></div>
      </Section>
    </div>
  )
}
