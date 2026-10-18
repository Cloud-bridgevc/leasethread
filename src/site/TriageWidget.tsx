import { useState } from 'react'
import { apiTriage } from '../lib/api'
import { SAMPLE_REQUESTS, type TriageResult } from '../lib/triage'
import { UrgencyBadge, Pill } from '../components/ui'

export default function TriageWidget({ onResult, compact = false }: { onResult?: (text: string, r: TriageResult) => void; compact?: boolean }) {
  const [text, setText] = useState(SAMPLE_REQUESTS[0])
  const [busy, setBusy] = useState(false)
  const [res, setRes] = useState<TriageResult | null>(null)
  const run = async () => { setBusy(true); const r = await apiTriage(text); setRes(r); setBusy(false); onResult?.(text, r) }
  return (
    <div className="card overflow-hidden">
      <div className="grid md:grid-cols-2">
        <div className="space-y-3 p-5">
          <label className="label" htmlFor="tri">Tenant maintenance request</label>
          <textarea id="tri" className="input min-h-[120px]" value={text} onChange={e => setText(e.target.value)} maxLength={1000} />
          <div className="flex flex-wrap gap-2">{SAMPLE_REQUESTS.map((s, i) => <button key={i} onClick={() => setText(s)} className="rounded-full border border-slate-200 px-2.5 py-1 text-xs text-slate-600 hover:border-teal-400">Sample {i + 1}</button>)}</div>
          <button className="btn-accent w-full" onClick={run} disabled={busy || text.trim().length < 5}>{busy ? 'Analyzing…' : 'Run AI triage'}</button>
          <p className="text-[11px] text-slate-500">Demo mode: results come from a transparent rule-based simulator, not a live model. In production this call runs server-side through Amazon Bedrock.</p>
        </div>
        <div className="border-t border-slate-100 bg-slate-50 p-5 md:border-l md:border-t-0">
          {!res ? <p className="text-sm text-slate-500">Results appear here: category, urgency, next action, missing information and an explanation.</p> : (
            <div className="space-y-3 text-sm">
              <div className="flex flex-wrap items-center gap-2"><Pill className="bg-navy-900 text-white ring-navy-900">{res.category}</Pill><UrgencyBadge u={res.urgency} /><Pill className="bg-white text-slate-600 ring-slate-200">Team: {res.team}</Pill></div>
              {res.safetyNote && <div className="rounded-lg border border-red-200 bg-red-50 p-2 text-xs text-red-800">{res.safetyNote}</div>}
              <div><div className="label">Recommended next action</div>{res.nextAction}</div>
              {!compact && res.missingInfo.length > 0 && <div><div className="label">Missing information to request</div><ul className="list-disc pl-5">{res.missingInfo.map(m => <li key={m}>{m}</li>)}</ul></div>}
              <div><div className="label">Why</div>{res.explanation}</div>
              <p className="text-[11px] text-slate-500">Triage supports, but does not replace, a manager's judgment. No prediction of future failures is made.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
