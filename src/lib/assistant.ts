/**
 * DEMO operations assistant: keyword intent matching over in-memory sample data,
 * scoped to the signed-in manager's properties.
 * Production: POST /api/assistant -> Lambda -> Bedrock with tool-calling against
 * PostgreSQL. Every tool query is filtered by the caller's org_id + property grants;
 * the model never receives data outside that scope.
 */
import type { Property, Lease, Request, Contractor } from '../data/types'
import { daysUntil, fmtDate } from './dates'
import { renewalRisks } from './risk'

interface Ctx { properties: Property[]; leases: Lease[]; requests: Request[]; contractors: Contractor[] }

export function answer(q: string, c: Ctx): string {
  const s = q.toLowerCase()
  const pn = (id: string) => c.properties.find(p => p.id === id)?.name ?? id
  const mentioned = c.properties.filter(p => s.includes(p.name.toLowerCase().split(' ')[0]))
  const scopeP = mentioned.length ? mentioned : c.properties
  const scoped = <T extends { propertyId: string }>(a: T[]) => a.filter(x => scopeP.some(p => p.id === x.propertyId))

  if (/renew|expir|lease/.test(s) && /(deadline|renew|expir|soon|upcoming|ending)/.test(s)) {
    const l = scoped(c.leases).filter(x => daysUntil(x.end) <= 90).sort((a, b) => daysUntil(a.end) - daysUntil(b.end))
    if (!l.length) return 'No leases in your scope expire within 90 days.'
    return 'Leases expiring within 90 days:\n' + l.map(x => `• ${pn(x.propertyId)} ${x.unit} (${x.tenant}) — ends ${fmtDate(x.end)} (${daysUntil(x.end)} days), notice ${x.noticeDays} days, renewal action ${x.renewalActionTaken ? 'taken' : 'NOT taken'}`).join('\n')
  }
  if (/risk|attention|flag/.test(s)) {
    const f = renewalRisks(scoped(c.leases), scoped(c.requests))
    if (!f.length) return 'No renewal risk flags right now.'
    return 'Renewal risk flags:\n' + f.map(x => { const l = c.leases.find(l => l.id === x.leaseId)!; return `• ${pn(l.propertyId)} ${l.unit} [${x.level}] — ${x.reasons.join('; ')}` }).join('\n')
  }
  if (/contractor|assign|plumber|electric|hvac|who/.test(s)) {
    const r = scoped(c.requests).filter(x => x.contractorId && x.status !== 'resolved')
    if (!r.length) return 'No open requests currently have an assigned contractor.'
    return 'Open contractor assignments:\n' + r.map(x => `• ${pn(x.propertyId)} ${x.unit}: ${x.category} → ${c.contractors.find(k => k.id === x.contractorId)?.name} (${x.status.replace('_', ' ')})`).join('\n')
  }
  if (/open|maintenance|request|urgent|emergency/.test(s)) {
    let r = scoped(c.requests).filter(x => x.status !== 'resolved')
    if (/urgent|emergency/.test(s)) r = r.filter(x => x.urgency === 'emergency' || x.urgency === 'high')
    if (!r.length) return 'No matching open requests.'
    return `${r.length} open request${r.length > 1 ? 's' : ''}:\n` + r.map(x => `• ${pn(x.propertyId)} ${x.unit} — ${x.category}, ${x.urgency} urgency, ${x.status.replace('_', ' ')}`).join('\n')
  }
  return `I can answer questions about open maintenance requests, lease deadlines, renewal risks, and contractor assignments for ${scopeP.map(p => p.name).join(', ')}. I can't answer questions about properties outside your access, and I don't forecast failures.`
}

export const SUGGESTED = ['What leases expire in the next 90 days?', 'Which open requests are urgent?', 'Who is assigned to open maintenance requests?', 'Which renewals need attention at Northgate?']
