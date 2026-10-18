import type { Request, Property } from '../data/types'
import { daysUntil } from './dates'

export function buildReport(requests: Request[], properties: Property[]) {
  const byCat: Record<string, number> = {}
  const byProp: Record<string, Record<string, number>> = {}
  requests.forEach(r => {
    byCat[r.category] = (byCat[r.category] || 0) + 1
    ;(byProp[r.propertyId] ||= {})[r.category] = ((byProp[r.propertyId] ||= {})[r.category] || 0) + 1
  })
  const resolved = requests.filter(r => r.resolvedAt)
  const hours = resolved.map(r => (new Date(r.resolvedAt!).getTime() - new Date(r.submitted).getTime()) / 36e5)
  const avgHours = hours.length ? hours.reduce((a, b) => a + b, 0) / hours.length : 0
  const open = requests.filter(r => r.status !== 'resolved')
  const aged = open.filter(r => -daysUntil(r.submitted.slice(0, 10)) > 7)
  // recurring = same property+unit+category appearing 2+ times
  const key: Record<string, Request[]> = {}
  requests.forEach(r => (key[`${r.propertyId}|${r.unit}|${r.category}`] ||= []).push(r))
  const recurring = Object.values(key).filter(a => a.length >= 2).map(a => ({ unit: a[0].unit, property: properties.find(p => p.id === a[0].propertyId)?.name ?? '', category: a[0].category, count: a.length }))
  const summary: string[] = []
  const top = Object.entries(byCat).sort((a, b) => b[1] - a[1])[0]
  if (top) summary.push(`${top[0]} is the most common category (${top[1]} of ${requests.length} requests).`)
  if (resolved.length) summary.push(`Average resolution time across ${resolved.length} resolved requests is ${(avgHours / 24).toFixed(1)} days.`)
  if (aged.length) summary.push(`${aged.length} open request${aged.length > 1 ? 's have' : ' has'} been waiting more than 7 days.`)
  recurring.forEach(r => summary.push(`${r.category} requests recurred ${r.count}× in ${r.property} unit ${r.unit}. Worth an inspection; the data alone does not show the root cause.`))
  return { byCat, avgHours, open, aged, recurring, summary, sampleSize: requests.length }
}
