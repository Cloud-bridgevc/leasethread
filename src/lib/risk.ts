import type { Lease, Request, Property } from '../data/types'
import { daysUntil } from './dates'

export interface RiskFlag { leaseId: string; level: 'high' | 'medium' | 'low'; reasons: string[]; daysLeft: number }

/** Transparent, rule-based renewal risk. No prediction — only flags observable conditions. */
export function renewalRisks(leases: Lease[], requests: Request[]): RiskFlag[] {
  return leases.map(l => {
    const daysLeft = daysUntil(l.end)
    const reasons: string[] = []
    let score = 0
    const noticeDeadline = daysLeft - l.noticeDays
    if (daysLeft <= 30) { score += 2; reasons.push(`Lease expires in ${daysLeft} days`) }
    else if (daysLeft <= 90) { score += 1; reasons.push(`Lease expires in ${daysLeft} days`) }
    if (!l.renewalActionTaken && daysLeft <= 90) {
      score += 2
      reasons.push(noticeDeadline < 0 ? `Notice window (${l.noticeDays} days) has already passed with no renewal action` : `No renewal action; notice deadline in ${noticeDeadline} days`)
    }
    const open = requests.filter(r => r.propertyId === l.propertyId && r.unit === l.unit && r.status !== 'resolved')
    if (open.length) { score += 1; reasons.push(`${open.length} unresolved maintenance request${open.length > 1 ? 's' : ''}`) }
    const stale = open.filter(r => -daysUntil(r.submitted.slice(0, 10)) > 7)
    if (stale.length) { score += 1; reasons.push('Request open for more than 7 days') }
    return { leaseId: l.id, level: score >= 4 ? 'high' as const : score >= 2 ? 'medium' as const : 'low' as const, reasons, daysLeft }
  }).filter(f => f.reasons.length && f.daysLeft <= 120).sort((a, b) => a.daysLeft - b.daysLeft)
}

export const occupancy = (p: Property) => Math.round((p.occupied / p.units) * 100)
